"""Personal-account bootstrap + co-membership visibility + role checks."""
from __future__ import annotations

import uuid

from sqlalchemy import select
from sqlalchemy.orm import Session

from nm_core.db.models.account import Account, Membership
from nm_core.db.models.user import User

_ROLE_RANK = {"viewer": 0, "editor": 1, "owner": 2}


def ensure_personal_account(session: Session, user: User) -> Account:
    """Return the user's personal account, creating it (with owner membership) once."""
    from nm_core.teams.repository import AccountRepository

    repo = AccountRepository(session)
    existing = session.execute(
        select(Account)
        .join(Membership, Membership.account_id == Account.id)
        .where(Membership.user_id == user.id, Account.is_personal.is_(True))
        .limit(1)
    ).scalar_one_or_none()
    if existing is not None:
        return existing
    name = (user.name or user.phone or "My") + " (personal)"
    return repo.create_account(owner_user_id=user.id, name=name, is_personal=True)


def accessible_user_ids(session: Session, user: User) -> set[uuid.UUID]:
    """All users who share at least one account with this user (incl. themselves).

    This is the case-book visibility set: a user sees their own cases plus those of
    co-members in any shared account.
    """
    ensure_personal_account(session, user)
    my_accounts = select(Membership.account_id).where(Membership.user_id == user.id)
    rows = session.execute(
        select(Membership.user_id).where(Membership.account_id.in_(my_accounts))
    ).scalars()
    ids = set(rows)
    ids.add(user.id)
    return ids


def require_role(
    session: Session, *, account_id: uuid.UUID, user_id: uuid.UUID, minimum: str
) -> bool:
    """True if the user's role in the account meets the minimum (viewer<editor<owner)."""
    from nm_core.teams.repository import AccountRepository

    m = AccountRepository(session).get_membership(account_id, user_id)
    if m is None:
        return False
    return _ROLE_RANK.get(m.role, -1) >= _ROLE_RANK.get(minimum, 99)
