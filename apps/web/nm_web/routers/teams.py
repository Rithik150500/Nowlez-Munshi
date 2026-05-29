"""Team endpoints: accounts, members, invite-by-phone, roles."""
from __future__ import annotations

import uuid

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session

from nm_core.db.models.user import User
from nm_core.identity.repositories import UserRepository
from nm_core.teams import AccountRepository, ensure_personal_account, require_role
from nm_web.deps import get_current_user, get_db

router = APIRouter(prefix="/api/accounts", tags=["teams"])


class CreateAccountBody(BaseModel):
    name: str


class InviteBody(BaseModel):
    phone: str
    role: str = "viewer"


def _role_in(db: Session, account_id: uuid.UUID, user: User) -> str | None:
    m = AccountRepository(db).get_membership(account_id, user.id)
    return m.role if m else None


@router.get("")
def list_accounts(user: User = Depends(get_current_user), db: Session = Depends(get_db)) -> dict:
    ensure_personal_account(db, user)
    repo = AccountRepository(db)
    out = []
    for a in repo.list_accounts_for_user(user.id):
        m = repo.get_membership(a.id, user.id)
        out.append({"id": str(a.id), "name": a.name, "is_personal": a.is_personal,
                    "role": m.role if m else None})
    return {"accounts": out}


@router.post("")
def create_account(
    body: CreateAccountBody, user: User = Depends(get_current_user), db: Session = Depends(get_db)
) -> dict:
    acc = AccountRepository(db).create_account(owner_user_id=user.id, name=body.name)
    return {"id": str(acc.id), "name": acc.name, "role": "owner"}


@router.get("/{account_id}/members")
def members(
    account_id: str, user: User = Depends(get_current_user), db: Session = Depends(get_db)
) -> dict:
    aid = uuid.UUID(account_id)
    if _role_in(db, aid, user) is None:
        raise HTTPException(status_code=403, detail="not a member")
    repo = AccountRepository(db)
    users = UserRepository(db)
    out = []
    for m in repo.list_members(aid):
        member = users.get_by_id(m.user_id)
        out.append({"user_id": str(m.user_id), "role": m.role,
                    "name": member.name if member else None,
                    "phone": member.phone if member else None})
    return {"members": out}


@router.post("/{account_id}/members")
def invite(
    account_id: str,
    body: InviteBody,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> dict:
    aid = uuid.UUID(account_id)
    if not require_role(db, account_id=aid, user_id=user.id, minimum="owner"):
        raise HTTPException(status_code=403, detail="owner role required")
    if body.role not in ("owner", "editor", "viewer"):
        raise HTTPException(status_code=422, detail="invalid role")
    invitee, _ = UserRepository(db).get_or_create_by_phone(phone=body.phone)
    AccountRepository(db).add_member(account_id=aid, user_id=invitee.id, role=body.role)
    return {"user_id": str(invitee.id), "role": body.role}


@router.delete("/{account_id}/members/{member_id}")
def remove_member(
    account_id: str,
    member_id: str,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> dict:
    aid = uuid.UUID(account_id)
    if not require_role(db, account_id=aid, user_id=user.id, minimum="owner"):
        raise HTTPException(status_code=403, detail="owner role required")
    ok = AccountRepository(db).remove_member(aid, uuid.UUID(member_id))
    if not ok:
        raise HTTPException(status_code=404, detail="member not found")
    return {"ok": True}
