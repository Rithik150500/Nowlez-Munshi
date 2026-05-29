"""Munshi postpaid invoicing: ₹ per tracked case, billed each anniversary cycle.

A user is on postpaid iff ``billing_anniversary_day`` is set. ``generate_invoice``
computes the cycle window (billing.cycles), counts the user's tracked cases, and
records a pending invoice — idempotent per cycle (unique on user_id + cycle_end), so
re-running the cron is safe.
"""
from __future__ import annotations

import uuid
from datetime import date

from sqlalchemy import func, select
from sqlalchemy.orm import Session

from nm_core.billing.cycles import compute_cycle_window, is_anniversary
from nm_core.db.models.case import Case
from nm_core.db.models.munshi_invoice import MunshiInvoice
from nm_core.db.models.user import User

RATE_PER_CASE_INR = 10


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
    invoice = MunshiInvoice(
        user_id=user.id, cycle_start=start, cycle_end=end,
        case_count=count, amount_inr=count * RATE_PER_CASE_INR, status="pending",
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
        generate_invoice(session, user=user, today=today)
        if before is None:
            generated += 1
    return generated
