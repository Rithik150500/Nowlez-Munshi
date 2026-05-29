"""Billing scaffolding — built, NOT enforced in v1 (no paywall).

Provides the subscription store + tier lookup so monetization can be switched on
later by flipping ``feature_allowed`` to a real check, with zero schema change.
"""
from __future__ import annotations

import uuid

from sqlalchemy import select
from sqlalchemy.orm import Session

from nm_core.db.models.billing import Subscription


class SubscriptionRepository:
    def __init__(self, session: Session) -> None:
        self.s = session

    def get_for_account(self, account_id: uuid.UUID) -> Subscription | None:
        return self.s.execute(
            select(Subscription)
            .where(Subscription.account_id == account_id, Subscription.status == "active")
            .order_by(Subscription.created_at.desc())
            .limit(1)
        ).scalar_one_or_none()

    def set_tier(self, account_id: uuid.UUID, tier: str) -> Subscription:
        sub = self.get_for_account(account_id)
        if sub is None:
            sub = Subscription(account_id=account_id, tier=tier, status="active")
            self.s.add(sub)
        else:
            sub.tier = tier
        self.s.flush()
        return sub


def effective_tier(session: Session, account_id: uuid.UUID) -> str:
    sub = SubscriptionRepository(session).get_for_account(account_id)
    return sub.tier if sub else "free"


def feature_allowed(session: Session, account_id: uuid.UUID, feature: str) -> bool:
    """v1: everything is allowed (no paywall). Flip to a tier check to enforce later."""
    return True
