"""Admin ops overview (gated by User.is_admin). The observability seed for M5."""
from __future__ import annotations

from fastapi import APIRouter, Depends
from sqlalchemy import func, select
from sqlalchemy.orm import Session

from nm_core.db.models.case import Case
from nm_core.db.models.messaging import OutboundMessage
from nm_core.db.models.user import User
from nm_web.deps import get_db, require_admin

router = APIRouter(prefix="/api/admin", tags=["admin"])


@router.get("/overview")
def overview(_: User = Depends(require_admin), db: Session = Depends(get_db)) -> dict:
    users = db.execute(select(func.count()).select_from(User)).scalar_one()
    cases = db.execute(select(func.count()).select_from(Case)).scalar_one()
    by_status = dict(
        db.execute(
            select(OutboundMessage.status, func.count()).group_by(OutboundMessage.status)
        ).all()
    )
    return {
        "users": int(users),
        "cases": int(cases),
        "outbound_by_status": {k: int(v) for k, v in by_status.items()},
    }
