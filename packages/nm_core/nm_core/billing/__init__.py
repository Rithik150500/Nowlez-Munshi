"""Billing — hard tier gates (enforced) + Razorpay subscription plumbing.

Tiers gate boolean features (documents/search/digest) and numeric limits (cases,
team members). ``feature_allowed`` / ``within_limit`` are the enforcement primitives;
the web layer guards endpoints with them.
"""
from __future__ import annotations

import uuid

from sqlalchemy import func, select
from sqlalchemy.orm import Session

from nm_core.db.models.account import Membership
from nm_core.db.models.billing import Subscription
from nm_core.db.models.case import Case

# tier → {max_cases, max_members (None = unlimited), feature set}
TIERS: dict[str, dict] = {
    "free": {"max_cases": 5, "max_members": 1, "features": {"documents"}},
    "advocate": {"max_cases": 50, "max_members": 3,
                 "features": {"documents", "search", "digest"}},
    "counsel": {"max_cases": 200, "max_members": 10,
                "features": {"documents", "search", "digest"}},
    "chambers": {"max_cases": None, "max_members": None,
                 "features": {"documents", "search", "digest", "admin"}},
}


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

    def set_tier(
        self, account_id: uuid.UUID, tier: str, *, provider_ref: str | None = None
    ) -> Subscription:
        if tier not in TIERS:
            raise ValueError(f"unknown tier {tier}")
        sub = self.get_for_account(account_id)
        if sub is None:
            sub = Subscription(account_id=account_id, tier=tier, status="active",
                               provider_ref=provider_ref)
            self.s.add(sub)
        else:
            sub.tier = tier
            if provider_ref:
                sub.provider_ref = provider_ref
        self.s.flush()
        return sub


def effective_tier(session: Session, account_id: uuid.UUID) -> str:
    sub = SubscriptionRepository(session).get_for_account(account_id)
    return sub.tier if sub else "free"


def feature_allowed(session: Session, account_id: uuid.UUID, feature: str) -> bool:
    """True if the account's tier includes this boolean feature (enforced in v1.1)."""
    return feature in TIERS[effective_tier(session, account_id)]["features"]


def _count_cases(session: Session, account_id: uuid.UUID) -> int:
    # Cases are owned by members of the account.
    member_ids = select(Membership.user_id).where(Membership.account_id == account_id)
    return int(
        session.execute(
            select(func.count()).select_from(Case).where(Case.user_id.in_(member_ids))
        ).scalar_one()
    )


def _count_members(session: Session, account_id: uuid.UUID) -> int:
    return int(
        session.execute(
            select(func.count()).select_from(Membership).where(Membership.account_id == account_id)
        ).scalar_one()
    )


def within_case_limit(session: Session, account_id: uuid.UUID) -> bool:
    limit = TIERS[effective_tier(session, account_id)]["max_cases"]
    return limit is None or _count_cases(session, account_id) < limit


def within_member_limit(session: Session, account_id: uuid.UUID) -> bool:
    limit = TIERS[effective_tier(session, account_id)]["max_members"]
    return limit is None or _count_members(session, account_id) < limit
