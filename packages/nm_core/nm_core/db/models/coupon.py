"""Promo/coupon codes — percent discount, usage cap, validity window."""
from __future__ import annotations

import uuid
from datetime import datetime

from sqlalchemy import Boolean, DateTime, Index, Integer, Text, func, text
from sqlalchemy.orm import Mapped, mapped_column

from nm_core.db.base import Base
from nm_core.db.types import UUIDType


class CouponCode(Base):
    __tablename__ = "coupon_codes"

    id: Mapped[uuid.UUID] = mapped_column(UUIDType, primary_key=True, default=uuid.uuid4)
    code: Mapped[str] = mapped_column(Text, nullable=False, unique=True)
    discount_percent: Mapped[int] = mapped_column(Integer, nullable=False)
    max_uses: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    current_uses: Mapped[int] = mapped_column(
        Integer, nullable=False, default=0, server_default="0"
    )
    valid_from: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)
    valid_until: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)
    is_active: Mapped[bool] = mapped_column(
        Boolean, nullable=False, default=True, server_default=text("true")
    )
    razorpay_offer_id: Mapped[str | None] = mapped_column(Text, nullable=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=False, server_default=func.now()
    )

    __table_args__ = (Index("coupon_codes_code_idx", "code"),)
