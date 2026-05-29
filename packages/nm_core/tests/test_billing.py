"""Billing scaffolding: tier lookup + the unenforced feature gate."""
from __future__ import annotations

from nm_core.billing import SubscriptionRepository, effective_tier, feature_allowed
from nm_core.identity.repositories import UserRepository
from nm_core.teams import AccountRepository


def _account(db_session):
    user, _ = UserRepository(db_session).get_or_create_by_phone(phone="+919100000131", name="Adv")
    return AccountRepository(db_session).create_account(owner_user_id=user.id, name="C")


def test_default_tier_is_free(db_session):
    acc = _account(db_session)
    assert effective_tier(db_session, acc.id) == "free"


def test_set_and_read_tier(db_session):
    acc = _account(db_session)
    SubscriptionRepository(db_session).set_tier(acc.id, "advocate")
    assert effective_tier(db_session, acc.id) == "advocate"


def test_feature_allowed_is_unenforced(db_session):
    acc = _account(db_session)
    # No paywall in v1: everything allowed regardless of tier.
    assert feature_allowed(db_session, acc.id, "anything") is True
