"""Munshi postpaid invoicing: ₹ per tracked case, billed each anniversary cycle.

A user is on postpaid iff ``billing_anniversary_day`` is set. ``generate_invoice``
computes the cycle window (billing.cycles), counts the user's tracked cases, and
records a pending invoice — idempotent per cycle (unique on user_id + cycle_end), so
re-running the cron is safe.
"""
from __future__ import annotations

import uuid
from datetime import UTC, date, datetime, timedelta

from sqlalchemy import func, select
from sqlalchemy.orm import Session

from nm_core.billing import has_active_nowlez_benefit
from nm_core.billing.cycles import compute_cycle_window, is_anniversary
from nm_core.db.models.case import Case
from nm_core.db.models.munshi_invoice import MunshiInvoice
from nm_core.db.models.user import User

RATE_PER_CASE_INR = 10
CASE_CAP = 200  # spec §1.2: postpaid bills at most 200 cases/cycle
DUE_DAYS = 7  # invoice is due this many days after the cycle closes
GRACE_DAYS = 7  # additional days past the due date before the user is suspended


def count_billable_cases(session: Session, user_id: uuid.UUID) -> int:
    """Tracked cases the user is billed for. (Current count — a case added and
    /forgotten within a cycle is not billed.)"""
    return int(session.execute(
        select(func.count()).select_from(Case).where(Case.user_id == user_id)
    ).scalar_one())


def generate_invoice(
    session: Session, *, user: User, today: date | None = None
) -> MunshiInvoice | None:
    """Generate (or return the existing) postpaid invoice for the user's current cycle.

    Returns None if the user isn't on postpaid. Idempotent per cycle end."""
    if user.billing_anniversary_day is None:
        return None
    # Cross-product exemption: don't charge Munshi postpaid while the user has an
    # active paid Nowlez subscription or a live trial (the most product-defining rule).
    if has_active_nowlez_benefit(session, user.id):
        return None
    today = today or date.today()
    # cycles.compute_cycle_window uses only the day-of-month; January always has 31 days.
    anniversary = date(2000, 1, user.billing_anniversary_day)
    start, end = compute_cycle_window(anniversary, today)

    existing = session.execute(
        select(MunshiInvoice).where(
            MunshiInvoice.user_id == user.id, MunshiInvoice.cycle_end == end
        )
    ).scalar_one_or_none()
    if existing is not None:
        return existing

    count = count_billable_cases(session, user.id)
    # Bill at most CASE_CAP cases (spec §1.2); keep the raw count for audit/display.
    billable = min(count, CASE_CAP)
    invoice = MunshiInvoice(
        user_id=user.id, cycle_start=start, cycle_end=end,
        case_count=count, amount_inr=billable * RATE_PER_CASE_INR, status="pending",
    )
    session.add(invoice)
    session.flush()
    return invoice


def generate_due_invoices(session: Session, *, today: date | None = None) -> int:
    """Generate invoices for every postpaid user whose anniversary is today. Returns count."""
    today = today or date.today()
    users = session.execute(
        select(User).where(User.billing_anniversary_day.is_not(None))
    ).scalars()
    generated = 0
    for user in users:
        if user.billing_anniversary_day is None:
            continue
        if not is_anniversary(user.billing_anniversary_day, today):
            continue  # not this user's anniversary today
        _, end = compute_cycle_window(date(2000, 1, user.billing_anniversary_day), today)
        before = session.execute(
            select(MunshiInvoice).where(
                MunshiInvoice.user_id == user.id, MunshiInvoice.cycle_end == end
            )
        ).scalar_one_or_none()
        invoice = generate_invoice(session, user=user, today=today)
        if invoice is not None and before is None:  # created now (not exempt, not dup)
            generated += 1
    return generated


def _aware(dt: datetime) -> datetime:
    return dt if dt.tzinfo is not None else dt.replace(tzinfo=UTC)


def mark_invoice_paid(
    session: Session, invoice: MunshiInvoice, *, provider_ref: str | None = None,
    now: datetime | None = None,
) -> None:
    """Mark an invoice paid and resume the user if they were suspended for non-payment."""
    now = now or datetime.now(UTC)
    invoice.status = "paid"
    invoice.paid_at = now
    if provider_ref:
        invoice.provider_ref = provider_ref
    user = session.get(User, invoice.user_id)
    if user is not None and user.billing_suspended_at is not None:
        user.billing_suspended_at = None  # resume — sweep will refresh again
    session.flush()


def run_grace_suspension(
    session: Session, *, now: datetime | None = None, grace_days: int = GRACE_DAYS
) -> dict[str, int]:
    """Suspend users whose unpaid invoice has passed its grace window. Returns counts.

    Suspension is a user-level flag (the refresh sweep skips suspended users); the
    invoice is marked 'suspended'. Idempotent — already-suspended users are skipped."""
    now = now or datetime.now(UTC)
    overdue = session.execute(
        select(MunshiInvoice).where(MunshiInvoice.status == "pending")
    ).scalars()
    suspended = 0
    for invoice in overdue:
        # Suspend only after the due date (cycle_end + DUE_DAYS) AND the grace window:
        # cycle_end + DUE_DAYS + grace_days, matching the legacy due_at-anchored contract.
        deadline = _aware(invoice.cycle_end) + timedelta(days=DUE_DAYS + grace_days)
        if now < deadline:
            continue  # still within due + grace
        invoice.status = "suspended"
        user = session.get(User, invoice.user_id)
        if user is not None and user.billing_suspended_at is None:
            user.billing_suspended_at = now
            suspended += 1
    session.flush()
    return {"suspended": suspended}
