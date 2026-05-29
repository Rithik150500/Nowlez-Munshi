"""Processed Razorpay webhook events — replay idempotency.

Razorpay re-delivers webhooks until acked; the unique ``event_id`` (from the
``X-Razorpay-Event-Id`` header) lets us process each event exactly once."""
from __future__ import annotations

import uuid
from datetime import datetime

from sqlalchemy import DateTime, String, Text, func
from sqlalchemy.orm import Mapped, mapped_column

from nm_core.db.base import Base
from nm_core.db.types import UUIDType


class PaymentEvent(Base):
    __tablename__ = "payment_events"

    id: Mapped[uuid.UUID] = mapped_column(UUIDType, primary_key=True, default=uuid.uuid4)
    event_id: Mapped[str] = mapped_column(String(128), nullable=False, unique=True)
    event_type: Mapped[str] = mapped_column(Text, nullable=False)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=False, server_default=func.now()
    )
