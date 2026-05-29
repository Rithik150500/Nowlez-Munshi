"""Account + membership persistence."""
from __future__ import annotations

import uuid

from sqlalchemy import select
from sqlalchemy.orm import Session

from nm_core.db.models.account import Account, Membership

_ROLES = ("owner", "editor", "viewer")


class AccountRepository:
    def __init__(self, session: Session) -> None:
        self.s = session

    def create_account(
        self, *, owner_user_id: uuid.UUID, name: str, is_personal: bool = False
    ) -> Account:
        account = Account(owner_user_id=owner_user_id, name=name, is_personal=is_personal)
        self.s.add(account)
        self.s.flush()
        self.add_member(account_id=account.id, user_id=owner_user_id, role="owner")
        return account

    def get(self, account_id: uuid.UUID) -> Account | None:
        return self.s.get(Account, account_id)

    def add_member(
        self, *, account_id: uuid.UUID, user_id: uuid.UUID, role: str = "viewer"
    ) -> Membership:
        if role not in _ROLES:
            raise ValueError(f"invalid role {role}")
        existing = self.get_membership(account_id, user_id)
        if existing is not None:
            existing.role = role
            self.s.flush()
            return existing
        m = Membership(account_id=account_id, user_id=user_id, role=role)
        self.s.add(m)
        self.s.flush()
        return m

    def get_membership(self, account_id: uuid.UUID, user_id: uuid.UUID) -> Membership | None:
        return self.s.get(Membership, (account_id, user_id))

    def list_members(self, account_id: uuid.UUID) -> list[Membership]:
        return list(
            self.s.execute(
                select(Membership).where(Membership.account_id == account_id)
            ).scalars()
        )

    def list_accounts_for_user(self, user_id: uuid.UUID) -> list[Account]:
        return list(
            self.s.execute(
                select(Account)
                .join(Membership, Membership.account_id == Account.id)
                .where(Membership.user_id == user_id)
                .order_by(Account.created_at.asc())
            ).scalars()
        )

    def remove_member(self, account_id: uuid.UUID, user_id: uuid.UUID) -> bool:
        m = self.get_membership(account_id, user_id)
        if m is None:
            return False
        self.s.delete(m)
        self.s.flush()
        return True
