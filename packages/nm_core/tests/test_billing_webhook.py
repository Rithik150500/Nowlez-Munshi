"""Unified Razorpay webhook routing + replay idempotency."""
from __future__ import annotations

from datetime import date

import fakeredis
import pytest

from nm_core.billing import SubscriptionRepository, effective_tier
from nm_core.billing.munshi import generate_invoice
from nm_core.billing.webhook import process_webhook
from nm_core.config import get_settings
from nm_core.db.models.payment_event import PaymentEvent
from nm_core.identity.repositories import UserRepository
from nm_core.messaging import redis_dedup
from nm_core.teams import ensure_personal_account


@pytest.fixture(autouse=True)
def env(monkeypatch):
    monkeypatch.setattr(get_settings(), "ECOURTS_OFFLINE", True)
    monkeypatch.setattr(redis_dedup, "_client", fakeredis.FakeStrictRedis())
    yield
    monkeypatch.setattr(redis_dedup, "_client", None)


def _sub_payload(event, account_id, tier):
    return {"event": event,
            "payload": {"subscription": {"entity": {"id": "sub_1",
                        "notes": {"account_id": str(account_id), "tier": tier}}}}}


def test_subscription_activated_sets_tier(db_session):
    user, _ = UserRepository(db_session).get_or_create_by_phone(phone="+919100000231")
    acc = ensure_personal_account(db_session, user)
    action = process_webhook(db_session, event_id="evt_1",
                             payload=_sub_payload("subscription.activated", acc.id, "counsel"))
    assert action == "nowlez_tier"
    assert effective_tier(db_session, acc.id) == "counsel"


def test_subscription_cancel_downgrades(db_session):
    user, _ = UserRepository(db_session).get_or_create_by_phone(phone="+919100000232")
    acc = ensure_personal_account(db_session, user)
    SubscriptionRepository(db_session).set_tier(acc.id, "counsel")
    action = process_webhook(db_session, event_id="evt_2",
                             payload=_sub_payload("subscription.cancelled", acc.id, "counsel"))
    assert action == "nowlez_cancel"
    assert effective_tier(db_session, acc.id) == "free"


def test_munshi_invoice_payment_marks_paid(db_session):
    user, _ = UserRepository(db_session).get_or_create_by_phone(phone="+919100000233")
    user.billing_anniversary_day = 15
    db_session.flush()
    invoice = generate_invoice(db_session, user=user, today=date(2026, 4, 15))
    payload = {"event": "payment.captured",
               "payload": {"payment": {"entity": {"id": "pay_9",
                           "notes": {"munshi_invoice_id": str(invoice.id), "product": "munshi"}}}}}
    action = process_webhook(db_session, event_id="evt_3", payload=payload)
    assert action == "munshi_paid"
    assert invoice.status == "paid" and invoice.provider_ref == "pay_9"


def test_duplicate_event_is_noop(db_session):
    user, _ = UserRepository(db_session).get_or_create_by_phone(phone="+919100000234")
    acc = ensure_personal_account(db_session, user)
    p = _sub_payload("subscription.activated", acc.id, "advocate")
    assert process_webhook(db_session, event_id="evt_dup", payload=p) == "nowlez_tier"
    assert process_webhook(db_session, event_id="evt_dup", payload=p) == "duplicate"
    assert db_session.query(PaymentEvent).filter_by(event_id="evt_dup").count() == 1
