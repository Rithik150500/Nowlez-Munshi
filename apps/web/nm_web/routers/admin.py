"""Admin ops overview (gated by User.is_admin). The observability seed for M5."""
from __future__ import annotations

import uuid
from datetime import UTC, datetime

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy import func, select
from sqlalchemy.orm import Session

from nm_core import observability
from nm_core.billing import coupons
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
    # Refresh lag: how stale is the oldest refresh-eligible case (seconds).
    oldest = db.execute(
        select(func.min(Case.last_refreshed_at)).where(Case.refresh_enabled.is_(True))
    ).scalar_one_or_none()
    refresh_lag_seconds = None
    if oldest is not None:
        ref = oldest if oldest.tzinfo else oldest.replace(tzinfo=UTC)
        refresh_lag_seconds = (datetime.now(UTC) - ref).total_seconds()

    return {
        "users": int(users),
        "cases": int(cases),
        "outbound_by_status": {k: int(v) for k, v in by_status.items()},
        "refresh_lag_seconds": refresh_lag_seconds,
        "metrics": observability.snapshot(),
    }


def _coupon_view(c) -> dict:
    return {
        "id": str(c.id), "code": c.code, "discount_percent": c.discount_percent,
        "max_uses": c.max_uses, "current_uses": c.current_uses,
        "valid_from": c.valid_from.isoformat(), "valid_until": c.valid_until.isoformat(),
        "is_active": c.is_active,
    }


class CouponBody(BaseModel):
    code: str
    discount_percent: int
    max_uses: int
    valid_from: datetime
    valid_until: datetime
    razorpay_offer_id: str | None = None


@router.get("/coupons")
def list_coupons(_: User = Depends(require_admin), db: Session = Depends(get_db)) -> dict:
    return {"coupons": [_coupon_view(c) for c in coupons.list_coupons(db)]}


@router.post("/coupons")
def create_coupon(
    body: CouponBody, _: User = Depends(require_admin), db: Session = Depends(get_db)
) -> dict:
    c = coupons.create_coupon(
        db, code=body.code, discount_percent=body.discount_percent, max_uses=body.max_uses,
        valid_from=body.valid_from, valid_until=body.valid_until,
        razorpay_offer_id=body.razorpay_offer_id,
    )
    return _coupon_view(c)


@router.post("/coupons/{coupon_id}/deactivate")
def deactivate_coupon(
    coupon_id: str, _: User = Depends(require_admin), db: Session = Depends(get_db)
) -> dict:
    c = coupons.set_active(db, uuid.UUID(coupon_id), active=False)
    if c is None:
        raise HTTPException(status_code=404, detail="coupon not found")
    return _coupon_view(c)
