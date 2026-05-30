"""Referrals: shareable codes, signup attribution, and a payment-time reward.

A user gets a unique code (lazily). A new signup may supply a referrer's code → a
``pending`` Referral row. When the referee first pays, the referrer is rewarded
(+REWARD_DAYS extending their subscription period_end); the reward is idempotent
(guarded by ``reward_applied``) so a webhook replay can't double-credit. Self-referral
is rejected.
"""
from __future__ import annotations

import secrets
import uuid
from datetime import UTC, datetime, timedelta

from sqlalchemy import func, select
from sqlalchemy.orm import Session

from nm_core.billing import TRIAL_TIER, SubscriptionRepository
from nm_core.db.models.referral import Referral
from nm_core.db.models.user import User

REWARD_DAYS = 15


def _aware(dt: datetime) -> datetime:
    return dt if dt.tzinfo is not None else dt.replace(tzinfo=UTC)


def get_or_create_code(session: Session, user: User) -> str:
    """The user's referral code, created on first request (retry on collision)."""
    if user.referral_code:
        return user.referral_code
    for _ in range(5):
        code = secrets.token_urlsafe(6)[:12]
        clash = session.execute(
            select(User).where(User.referral_code == code)
        ).scalar_one_or_none()
        if clash is None:
            user.referral_code = code
            session.flush()
            return code
    raise RuntimeError("could not allocate a unique referral code")


def find_referrer(session: Session, code: str) -> User | None:
    code = (code or "").strip()
    if not code:
        return None
    return session.execute(
        select(User).where(User.referral_code == code)
    ).scalar_one_or_none()


def apply_referral(session: Session, *, new_user: User, code: str) -> bool:
    """Attribute a signup to a referrer's code. Returns True if a pending row was made.
    Rejects unknown codes and self-referral."""
    referrer = find_referrer(session, code)
    if referrer is None or referrer.id == new_user.id:
        return False
    if new_user.referred_by is not None:
        return False  # already attributed
    new_user.referred_by = referrer.id
    session.add(Referral(referrer_id=referrer.id, referred_id=new_user.id, status="pending"))
    session.flush()
    return True


def apply_reward_on_payment(session: Session, *, account_id: uuid.UUID) -> int:
    """On the referee's first payment, reward their referrer. Idempotent via
    reward_applied. ``account_id`` is the paying account; we resolve its owner (the
    referee). Returns the number of rewards applied (0 or 1)."""
    from nm_core.teams import AccountRepository

    account = AccountRepository(session).get(account_id)
    if account is None:
        return 0
    referee_id = account.owner_user_id
    referral = session.execute(
        select(Referral).where(
            Referral.referred_id == referee_id,
            Referral.reward_applied.is_(False),
        )
    ).scalar_one_or_none()
    if referral is None:
        return 0
    _extend_referrer(session, referral.referrer_id)
    referral.reward_applied = True
    referral.status = "rewarded"
    session.flush()
    return 1


def _extend_referrer(session: Session, referrer_id: uuid.UUID) -> None:
    """Grant the referrer +REWARD_DAYS. If they have an active sub, push period_end;
    otherwise start a reward trial so free users still benefit."""
    repo = SubscriptionRepository(session)
    from nm_core.teams import AccountRepository
    accounts = AccountRepository(session).list_accounts_for_user(referrer_id)
    if not accounts:
        return
    account_id = accounts[0].id
    sub = repo.get_latest(account_id)
    now = datetime.now(UTC)
    if sub is not None and sub.status in ("active", "trialing"):
        base = max(_aware(sub.period_end), now) if sub.period_end else now
        sub.period_end = base + timedelta(days=REWARD_DAYS)
    else:
        from nm_core.billing import start_trial
        start_trial(session, account_id, tier=TRIAL_TIER, days=REWARD_DAYS, now=now)
    session.flush()


def stats(session: Session, user: User) -> dict:
    total = int(session.execute(
        select(func.count()).select_from(Referral).where(Referral.referrer_id == user.id)
    ).scalar_one())
    rewarded = int(session.execute(
        select(func.count()).select_from(Referral).where(
            Referral.referrer_id == user.id, Referral.reward_applied.is_(True))
    ).scalar_one())
    return {"code": user.referral_code, "total_referrals": total, "rewards_earned": rewarded}
