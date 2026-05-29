"""Billing status (read-only; not enforced in v1)."""
from __future__ import annotations

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from nm_core.billing import effective_tier
from nm_core.db.models.user import User
from nm_core.teams import ensure_personal_account
from nm_web.deps import get_current_user, get_db

router = APIRouter(prefix="/api", tags=["billing"])


@router.get("/billing")
def billing(user: User = Depends(get_current_user), db: Session = Depends(get_db)) -> dict:
    account = ensure_personal_account(db, user)
    return {
        "account_id": str(account.id),
        "tier": effective_tier(db, account.id),
        "enforced": False,  # v1 has no paywall
    }
