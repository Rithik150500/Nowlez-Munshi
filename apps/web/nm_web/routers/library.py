"""Universal search over the user's own data (documents, cases, orders).

Distinct from /api/search (eCourts portal lookup). Gated behind the `search` billing
feature, like the eCourts search router."""
from __future__ import annotations

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from nm_core import billing, search
from nm_core.db.models.user import User
from nm_core.teams import ensure_personal_account
from nm_web.deps import get_current_user, get_db

router = APIRouter(prefix="/api/library", tags=["library"])


@router.get("/search")
def library_search(
    q: str, limit: int = 15,
    user: User = Depends(get_current_user), db: Session = Depends(get_db),
) -> dict:
    account = ensure_personal_account(db, user)
    if not billing.feature_allowed(db, account.id, "search"):
        raise HTTPException(status_code=402, detail="search requires a paid plan")
    return search.search_all(db, user=user, query=q, limit=min(limit, 50))
