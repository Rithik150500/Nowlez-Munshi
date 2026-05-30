"""Unified Razorpay webhook processing.

Routes a verified webhook to the right billing state machine, exactly once:

- ``subscription.activated`` / ``charged`` / ``resumed`` (Nowlez) → set the account tier
- ``subscription.halted`` / ``cancelled`` (Nowlez) → downgrade to free
- a captured payment carrying ``notes.munshi_invoice_id`` → mark that invoice paid (+resume)

Replay idempotency: each event is recorded in ``payment_events`` by its
``X-Razorpay-Event-Id``; a re-delivered event is a no-op.
"""
from __future__ import annotations

import uuid
from typing import Any

from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from nm_core.billing import SubscriptionRepository
from nm_core.billing.munshi import mark_invoice_paid
from nm_core.billing.razorpay import extract_account_and_tier
from nm_core.db.models.munshi_invoice import MunshiInvoice
from nm_core.db.models.payment_event import PaymentEvent

_TIER_ACTIVATE = {"subscription.activated", "subscription.charged", "subscription.resumed"}
_TIER_CANCEL = {"subscription.halted", "subscription.cancelled"}


def _claim_event(session: Session, event_id: str, event_type: str) -> bool:
    """Claim an event id as the serialization point. Insert-then-flush so the DB unique
    constraint — not a racy SELECT — decides the winner: a concurrent replay's insert
    raises IntegrityError and we report it as already-processed. Returns True if THIS
    call won the claim (proceed with side effects), False if it's a duplicate."""
    savepoint = session.begin_nested()
    session.add(PaymentEvent(event_id=event_id, event_type=event_type))
    try:
        savepoint.commit()  # flushes the INSERT; unique violation surfaces here
    except IntegrityError:
        savepoint.rollback()
        return False
    return True


def _munshi_invoice_id(payload: dict[str, Any]) -> str | None:
    try:
        notes = payload["payload"]["payment"]["entity"].get("notes") or {}
    except (KeyError, TypeError):
        return None
    inv = notes.get("munshi_invoice_id")
    return str(inv) if inv else None


def _subscription_notes(payload: dict[str, Any]) -> dict:
    try:
        return payload["payload"]["subscription"]["entity"].get("notes") or {}
    except (KeyError, TypeError):
        return {}


def _on_activation(session: Session, *, account_id: str, notes: dict) -> None:
    """Shared post-activation hook: consume a coupon use and apply a referral reward.

    Both are idempotent (coupon increment is conditional on the cap; referral reward is
    guarded by reward_applied), so a webhook replay can't double-apply."""
    from nm_core.billing import coupons, referrals

    code = notes.get("coupon_code")
    if code:
        coupons.increment_usage(session, str(code))
    referrals.apply_reward_on_payment(session, account_id=uuid.UUID(account_id))


def _provider_ref(payload: dict[str, Any], key: str) -> str | None:
    try:
        return str(payload["payload"][key]["entity"].get("id") or "") or None
    except (KeyError, TypeError):
        return None


def process_webhook(session: Session, *, event_id: str | None, payload: dict[str, Any]) -> str:
    """Process one verified webhook. Returns an action label (for logging/tests)."""
    if event_id and not _claim_event(session, event_id, payload.get("event", "")):
        return "duplicate"

    event = payload.get("event", "")

    # Munshi postpaid invoice payment.
    inv_id = _munshi_invoice_id(payload)
    if inv_id:
        invoice = session.get(MunshiInvoice, uuid.UUID(inv_id))
        if invoice is not None and invoice.status != "paid":
            mark_invoice_paid(session, invoice, provider_ref=_provider_ref(payload, "payment"))
            return "munshi_paid"
        return "munshi_noop"

    # Nowlez subscription tier changes.
    if event in _TIER_ACTIVATE:
        found = extract_account_and_tier(payload)
        if found:
            account_id, tier = found
            SubscriptionRepository(session).set_tier(
                uuid.UUID(account_id), tier, provider_ref=_provider_ref(payload, "subscription"),
            )
            _on_activation(session, account_id=account_id, notes=_subscription_notes(payload))
            return "nowlez_tier"
    if event in _TIER_CANCEL:
        found = extract_account_and_tier(payload)
        if found:
            SubscriptionRepository(session).set_tier(uuid.UUID(found[0]), "free")
            return "nowlez_cancel"

    return "ignored"
