"""Munshi postpaid invoice generation (offline)."""
from __future__ import annotations

from datetime import date

import fakeredis
import pytest

from nm_core.billing import munshi
from nm_core.billing.munshi import RATE_PER_CASE_INR, generate_due_invoices, generate_invoice
from nm_core.config import get_settings
from nm_core.db.models.munshi_invoice import MunshiInvoice
from nm_core.ecourts.models import Case as FetchedCase
from nm_core.ecourts.models import OrderRef, Party
from nm_core.ecourts.offline import clear_offline_cases, register_offline_case
from nm_core.identity.repositories import UserRepository
from nm_core.messaging import redis_dedup
from nm_core.tracking import track_case


@pytest.fixture(autouse=True)
def env(monkeypatch):
    monkeypatch.setattr(get_settings(), "ECOURTS_OFFLINE", True)
    monkeypatch.setattr(redis_dedup, "_client", fakeredis.FakeStrictRedis())
    clear_offline_cases()
    yield
    clear_offline_cases()
    monkeypatch.setattr(redis_dedup, "_client", None)


def _track(db_session, user, cnr):
    register_offline_case(cnr, FetchedCase(
        cnr=cnr, title="A vs B", court="C", stage="S", next_hearing_date=date(2026, 7, 1),
        judge="J", parties=[Party(name="A", role="petitioner")],
        orders=[OrderRef(order_date=date(2026, 1, 1), order_url="u", order_id="1")],
    ))
    track_case(db_session, user=user, cnr=cnr)


def test_no_invoice_when_not_on_postpaid(db_session):
    user, _ = UserRepository(db_session).get_or_create_by_phone(phone="+919100000201")
    assert generate_invoice(db_session, user=user, today=date(2026, 4, 15)) is None


def test_invoice_amount_is_rate_times_cases(db_session):
    user, _ = UserRepository(db_session).get_or_create_by_phone(phone="+919100000202")
    user.billing_anniversary_day = 15
    db_session.flush()
    _track(db_session, user, "DLND010000012024")
    _track(db_session, user, "DLND010000022024")

    inv = generate_invoice(db_session, user=user, today=date(2026, 4, 15))
    assert inv is not None
    assert inv.case_count == 2
    assert inv.amount_inr == 2 * RATE_PER_CASE_INR
    assert inv.status == "pending"
    assert inv.cycle_start.date() == date(2026, 3, 15) and inv.cycle_end.date() == date(2026, 4, 15)


def test_invoice_is_idempotent_per_cycle(db_session):
    user, _ = UserRepository(db_session).get_or_create_by_phone(phone="+919100000203")
    user.billing_anniversary_day = 15
    db_session.flush()
    first = generate_invoice(db_session, user=user, today=date(2026, 4, 15))
    second = generate_invoice(db_session, user=user, today=date(2026, 4, 15))
    assert first.id == second.id
    assert db_session.query(MunshiInvoice).count() == 1


def test_generate_due_only_on_anniversary(db_session):
    user, _ = UserRepository(db_session).get_or_create_by_phone(phone="+919100000204")
    user.billing_anniversary_day = 15
    db_session.flush()
    assert generate_due_invoices(db_session, today=date(2026, 4, 14)) == 0  # not anniversary
    assert generate_due_invoices(db_session, today=date(2026, 4, 15)) == 1  # anniversary
    assert generate_due_invoices(db_session, today=date(2026, 4, 15)) == 0  # idempotent


def test_clamped_anniversary_invoices_on_last_day(db_session, monkeypatch):
    user, _ = UserRepository(db_session).get_or_create_by_phone(phone="+919100000205")
    user.billing_anniversary_day = 31
    db_session.flush()
    # Feb has no 31st → anniversary clamps to Feb 28 (2026, non-leap).
    assert generate_due_invoices(db_session, today=date(2026, 2, 28)) == 1
    assert munshi.count_billable_cases(db_session, user.id) == 0
