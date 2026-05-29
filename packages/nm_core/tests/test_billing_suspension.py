"""Munshi postpaid grace → suspension → resume, and the sweep gate."""
from __future__ import annotations

from datetime import UTC, date, datetime, timedelta

import fakeredis
import pytest

from nm_core.billing.munshi import (
    DUE_DAYS,
    GRACE_DAYS,
    generate_invoice,
    mark_invoice_paid,
    run_grace_suspension,
)
from nm_core.config import get_settings
from nm_core.ecourts.models import Case as FetchedCase
from nm_core.ecourts.models import OrderRef, Party
from nm_core.ecourts.offline import clear_offline_cases, register_offline_case
from nm_core.identity.repositories import UserRepository
from nm_core.messaging import redis_dedup
from nm_core.tracking import run_refresh_sweep, track_case

CNR = "DLND010000012024"
_DEADLINE_DAYS = DUE_DAYS + GRACE_DAYS  # cycle_end → suspension


@pytest.fixture(autouse=True)
def env(monkeypatch):
    monkeypatch.setattr(get_settings(), "ECOURTS_OFFLINE", True)
    monkeypatch.setattr(get_settings(), "WHATSAPP_DISABLED", True)
    monkeypatch.setattr(redis_dedup, "_client", fakeredis.FakeStrictRedis())
    clear_offline_cases()
    register_offline_case(CNR, FetchedCase(
        cnr=CNR, title="A vs B", court="C", stage="S", next_hearing_date=date(2026, 7, 1),
        judge="J", parties=[Party(name="A", role="petitioner")],
        orders=[OrderRef(order_date=date(2026, 1, 1), order_url="u", order_id="1")],
    ))
    yield
    clear_offline_cases()
    monkeypatch.setattr(redis_dedup, "_client", None)


def _postpaid_user_with_invoice(db_session):
    user, _ = UserRepository(db_session).get_or_create_by_phone(phone="+919100000211")
    user.billing_anniversary_day = 15
    db_session.flush()
    track_case(db_session, user=user, cnr=CNR)
    invoice = generate_invoice(db_session, user=user, today=date(2026, 4, 15))
    return user, invoice


def test_within_grace_not_suspended(db_session):
    user, invoice = _postpaid_user_with_invoice(db_session)
    just_inside = invoice.cycle_end + timedelta(days=_DEADLINE_DAYS - 1)
    assert run_grace_suspension(db_session, now=just_inside)["suspended"] == 0
    assert user.billing_suspended_at is None


def test_past_grace_suspends_and_sweep_skips(db_session):
    user, invoice = _postpaid_user_with_invoice(db_session)
    past = invoice.cycle_end + timedelta(days=_DEADLINE_DAYS + 1)
    assert run_grace_suspension(db_session, now=past)["suspended"] == 1
    assert user.billing_suspended_at is not None
    assert invoice.status == "suspended"
    # The sweep refreshes nothing for a suspended user.
    stats = run_refresh_sweep(db_session)
    assert stats["refreshed"] == 0 and stats["skipped"] >= 1
    # Idempotent: a second grace run doesn't re-suspend.
    assert run_grace_suspension(db_session, now=past)["suspended"] == 0


def test_payment_resumes(db_session):
    user, invoice = _postpaid_user_with_invoice(db_session)
    past = invoice.cycle_end + timedelta(days=_DEADLINE_DAYS + 1)
    run_grace_suspension(db_session, now=past)
    assert user.billing_suspended_at is not None

    mark_invoice_paid(db_session, invoice, provider_ref="pay_123",
                      now=datetime(2026, 4, 25, tzinfo=UTC))
    assert invoice.status == "paid" and invoice.provider_ref == "pay_123"
    assert user.billing_suspended_at is None  # resumed
    assert run_refresh_sweep(db_session)["refreshed"] == 1  # sweep works again
