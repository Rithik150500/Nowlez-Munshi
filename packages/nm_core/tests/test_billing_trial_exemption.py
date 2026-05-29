"""Nowlez trial machine + cross-product exemption (don't double-bill)."""
from __future__ import annotations

from datetime import UTC, date, datetime, timedelta

import fakeredis
import pytest

from nm_core.billing import (
    SubscriptionRepository,
    effective_tier,
    expire_lapsed_trials,
    has_active_nowlez_benefit,
    start_trial,
)
from nm_core.billing.munshi import generate_invoice
from nm_core.config import get_settings
from nm_core.identity.repositories import UserRepository
from nm_core.messaging import redis_dedup
from nm_core.teams import ensure_personal_account


@pytest.fixture(autouse=True)
def env(monkeypatch):
    monkeypatch.setattr(get_settings(), "ECOURTS_OFFLINE", True)
    monkeypatch.setattr(redis_dedup, "_client", fakeredis.FakeStrictRedis())
    yield
    monkeypatch.setattr(redis_dedup, "_client", None)


def _user_with_account(db_session, phone):
    user, _ = UserRepository(db_session).get_or_create_by_phone(phone=phone)
    account = ensure_personal_account(db_session, user)
    return user, account


def test_active_trial_grants_tier_then_expires(db_session):
    user, acc = _user_with_account(db_session, "+919100000221")
    assert effective_tier(db_session, acc.id) == "free"

    start_trial(db_session, acc.id)  # 30-day chambers
    assert effective_tier(db_session, acc.id) == "chambers"

    # After the window, effective_tier falls back to free and expiry marks it.
    future = datetime.now(UTC) + timedelta(days=31)
    assert effective_tier(db_session, acc.id, now=future) == "free"
    assert expire_lapsed_trials(db_session, now=future) == 1
    sub = SubscriptionRepository(db_session).get_latest(acc.id)
    assert sub.status == "expired"


def test_paid_subscription_exempts_munshi_billing(db_session):
    user, acc = _user_with_account(db_session, "+919100000222")
    user.billing_anniversary_day = 15
    db_session.flush()

    # Free Nowlez → Munshi postpaid invoice is generated.
    inv = generate_invoice(db_session, user=user, today=date(2026, 4, 15))
    assert inv is not None and inv.status == "pending"

    # Upgrade to a paid Nowlez tier → next cycle is exempt (no double-billing).
    SubscriptionRepository(db_session).set_tier(acc.id, "advocate")
    assert has_active_nowlez_benefit(db_session, user.id) is True
    assert generate_invoice(db_session, user=user, today=date(2026, 5, 15)) is None


def test_active_trial_also_exempts(db_session):
    user, acc = _user_with_account(db_session, "+919100000223")
    user.billing_anniversary_day = 10
    db_session.flush()
    start_trial(db_session, acc.id)
    assert has_active_nowlez_benefit(db_session, user.id) is True
    assert generate_invoice(db_session, user=user, today=date(2026, 4, 10)) is None
