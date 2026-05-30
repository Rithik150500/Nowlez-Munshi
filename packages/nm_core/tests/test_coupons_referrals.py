"""Coupons + referrals: validation, atomic use, reward on payment, webhook hook."""
from __future__ import annotations

from datetime import UTC, datetime, timedelta

import fakeredis
import pytest

from nm_core.billing import SubscriptionRepository, coupons, effective_tier, referrals
from nm_core.billing.webhook import process_webhook
from nm_core.config import get_settings
from nm_core.db.models.coupon import CouponCode
from nm_core.identity.repositories import UserRepository
from nm_core.messaging import redis_dedup
from nm_core.teams import ensure_personal_account

NOW = datetime(2026, 5, 30, tzinfo=UTC)


@pytest.fixture(autouse=True)
def env(monkeypatch):
    monkeypatch.setattr(get_settings(), "ECOURTS_OFFLINE", True)
    monkeypatch.setattr(redis_dedup, "_client", fakeredis.FakeStrictRedis())
    yield
    monkeypatch.setattr(redis_dedup, "_client", None)


def _coupon(db, **kw):
    defaults = dict(code="SAVE20", discount_percent=20, max_uses=2,
                    valid_from=NOW - timedelta(days=1), valid_until=NOW + timedelta(days=30))
    defaults.update(kw)
    return coupons.create_coupon(db, **defaults)


# --- coupons ---
def test_validate_coupon_rules(db_session):
    _coupon(db_session)
    assert coupons.validate_coupon(db_session, "SAVE20", now=NOW).discount_percent == 20
    assert coupons.validate_coupon(db_session, "NOPE", now=NOW) is None
    # expired window
    _coupon(db_session, code="OLD", valid_until=NOW - timedelta(days=1))
    assert coupons.validate_coupon(db_session, "OLD", now=NOW) is None


def test_coupon_usage_cap_atomic(db_session):
    _coupon(db_session, code="CAP", max_uses=1)
    assert coupons.increment_usage(db_session, "CAP") is True
    assert coupons.increment_usage(db_session, "CAP") is False  # exhausted
    assert db_session.query(CouponCode).filter_by(code="CAP").one().current_uses == 1


# --- referrals ---
def test_referral_code_and_apply(db_session):
    referrer, _ = UserRepository(db_session).get_or_create_by_phone(phone="+919100000901")
    code = referrals.get_or_create_code(db_session, referrer)
    assert code and referrals.get_or_create_code(db_session, referrer) == code  # stable

    referee, _ = UserRepository(db_session).get_or_create_by_phone(phone="+919100000902")
    assert referrals.apply_referral(db_session, new_user=referee, code=code) is True
    assert referee.referred_by == referrer.id
    # self-referral rejected
    assert referrals.apply_referral(db_session, new_user=referrer, code=code) is False
    # unknown code rejected
    assert referrals.apply_referral(db_session, new_user=referee, code="xxxx") is False


def test_referral_reward_on_payment_idempotent(db_session):
    referrer, _ = UserRepository(db_session).get_or_create_by_phone(phone="+919100000903")
    ref_account = ensure_personal_account(db_session, referrer)
    SubscriptionRepository(db_session).set_tier(ref_account.id, "advocate")
    code = referrals.get_or_create_code(db_session, referrer)

    referee, _ = UserRepository(db_session).get_or_create_by_phone(phone="+919100000904")
    referee_account = ensure_personal_account(db_session, referee)
    referrals.apply_referral(db_session, new_user=referee, code=code)

    # referee pays → referrer rewarded once
    assert referrals.apply_reward_on_payment(db_session, account_id=referee_account.id) == 1
    sub = SubscriptionRepository(db_session).get_latest(ref_account.id)
    assert sub.period_end is not None  # +15 days granted
    # replay → no second reward
    assert referrals.apply_reward_on_payment(db_session, account_id=referee_account.id) == 0
    assert referrals.stats(db_session, referrer)["rewards_earned"] == 1


def test_webhook_activation_consumes_coupon_and_rewards(db_session):
    _coupon(db_session, code="WHC", max_uses=5)
    referrer, _ = UserRepository(db_session).get_or_create_by_phone(phone="+919100000905")
    ensure_personal_account(db_session, referrer)
    code = referrals.get_or_create_code(db_session, referrer)
    referee, _ = UserRepository(db_session).get_or_create_by_phone(phone="+919100000906")
    referee_account = ensure_personal_account(db_session, referee)
    referrals.apply_referral(db_session, new_user=referee, code=code)

    payload = {"event": "subscription.activated", "payload": {"subscription": {"entity": {
        "id": "sub_1",
        "notes": {"account_id": str(referee_account.id), "tier": "advocate",
                  "coupon_code": "WHC"}}}}}
    action = process_webhook(db_session, event_id="evt_cr", payload=payload)
    assert action == "nowlez_tier"
    assert effective_tier(db_session, referee_account.id) == "advocate"
    assert db_session.query(CouponCode).filter_by(code="WHC").one().current_uses == 1
    assert referrals.stats(db_session, referrer)["rewards_earned"] == 1


def test_duplicate_activation_event_does_not_double_reward(db_session):
    """A replayed activation (same event_id) must not apply the referral reward twice
    or burn a second coupon use — the claim short-circuits before side effects (HIGH-1)."""
    _coupon(db_session, code="DUP", max_uses=5)
    referrer, _ = UserRepository(db_session).get_or_create_by_phone(phone="+919100000907")
    ensure_personal_account(db_session, referrer)
    code = referrals.get_or_create_code(db_session, referrer)
    referee, _ = UserRepository(db_session).get_or_create_by_phone(phone="+919100000908")
    referee_account = ensure_personal_account(db_session, referee)
    referrals.apply_referral(db_session, new_user=referee, code=code)

    payload = {"event": "subscription.activated", "payload": {"subscription": {"entity": {
        "id": "sub_dup", "notes": {"account_id": str(referee_account.id),
                                   "tier": "advocate", "coupon_code": "DUP"}}}}}
    assert process_webhook(db_session, event_id="evt_x", payload=payload) == "nowlez_tier"
    assert process_webhook(db_session, event_id="evt_x", payload=payload) == "duplicate"

    from nm_core.db.models.coupon import CouponCode
    assert db_session.query(CouponCode).filter_by(code="DUP").one().current_uses == 1
    assert referrals.stats(db_session, referrer)["rewards_earned"] == 1
