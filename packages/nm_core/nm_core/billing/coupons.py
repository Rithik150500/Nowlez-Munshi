"""Coupon codes: validation (active / under cap / in window), atomic usage increment,
and admin CRUD. Ported from the legacy billing coupon path."""
from __future__ import annotations

import uuid
from datetime import UTC, datetime

from sqlalchemy import select, update
from sqlalchemy.orm import Session

from nm_core.db.models.coupon import CouponCode


def _aware(dt: datetime) -> datetime:
    return dt if dt.tzinfo is not None else dt.replace(tzinfo=UTC)


def validate_coupon(
    session: Session, code: str, *, now: datetime | None = None
) -> CouponCode | None:
    """Return the coupon iff it exists, is active, under its use cap, and in its window.
    Validation only — does NOT consume a use (that happens at activation)."""
    now = now or datetime.now(UTC)
    coupon = session.execute(
        select(CouponCode).where(CouponCode.code == (code or "").strip())
    ).scalar_one_or_none()
    if coupon is None or not coupon.is_active:
        return None
    if coupon.current_uses >= coupon.max_uses:
        return None
    if not (_aware(coupon.valid_from) <= now <= _aware(coupon.valid_until)):
        return None
    return coupon


def increment_usage(session: Session, code: str) -> bool:
    """Atomically consume one use (conditional on still being under the cap). Returns
    True if a use was consumed, False if the coupon is gone/exhausted."""
    result = session.execute(
        update(CouponCode)
        .where(CouponCode.code == (code or "").strip(),
               CouponCode.current_uses < CouponCode.max_uses)
        .values(current_uses=CouponCode.current_uses + 1)
    )
    session.flush()
    return bool(result.rowcount)  # type: ignore[attr-defined]


def create_coupon(
    session: Session, *, code: str, discount_percent: int, max_uses: int,
    valid_from: datetime, valid_until: datetime, razorpay_offer_id: str | None = None,
) -> CouponCode:
    coupon = CouponCode(
        code=code.strip(), discount_percent=discount_percent, max_uses=max_uses,
        valid_from=valid_from, valid_until=valid_until, razorpay_offer_id=razorpay_offer_id,
    )
    session.add(coupon)
    session.flush()
    return coupon


def list_coupons(session: Session) -> list[CouponCode]:
    return list(session.execute(
        select(CouponCode).order_by(CouponCode.created_at.desc())
    ).scalars())


def set_active(session: Session, coupon_id: uuid.UUID, *, active: bool) -> CouponCode | None:
    coupon = session.get(CouponCode, coupon_id)
    if coupon is None:
        return None
    coupon.is_active = active
    session.flush()
    return coupon
