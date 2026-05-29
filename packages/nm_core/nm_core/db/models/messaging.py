"""Messaging models: inbound dedup log + outbound delivery log / daily-slot."""
from __future__ import annotations

import uuid
from datetime import date, datetime

from sqlalchemy import (
    Date,
    DateTime,
    ForeignKey,
    Index,
    Text,
    UniqueConstraint,
    func,
)
from sqlalchemy.orm import Mapped, mapped_column

from nm_core.db.base import Base
from nm_core.db.types import UUIDType


class MessageLog(Base):
    """One row per inbound provider message id — the inbound-dedup guard."""

    __tablename__ = "message_log"

    id: Mapped[uuid.UUID] = mapped_column(UUIDType, primary_key=True, default=uuid.uuid4)
    meta_message_id: Mapped[str] = mapped_column(Text, nullable=False, unique=True)
    user_id: Mapped[uuid.UUID | None] = mapped_column(
        UUIDType, ForeignKey("users.id", ondelete="SET NULL"), nullable=True
    )
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=False, server_default=func.now()
    )


class OutboundMessage(Base):
    """Outbound delivery log. The (user_id, template_name, send_date_ist) unique
    constraint is the per-day dedup slot for daily-cadence templates; ad-hoc text
    sends leave template_name/send_date_ist NULL (NULLs don't collide)."""

    __tablename__ = "outbound_messages"

    id: Mapped[uuid.UUID] = mapped_column(UUIDType, primary_key=True, default=uuid.uuid4)
    user_id: Mapped[uuid.UUID | None] = mapped_column(
        UUIDType, ForeignKey("users.id", ondelete="SET NULL"), nullable=True
    )
    to_phone: Mapped[str] = mapped_column(Text, nullable=False)
    kind: Mapped[str] = mapped_column(Text, nullable=False, default="text")
    template_name: Mapped[str | None] = mapped_column(Text, nullable=True)
    send_date_ist: Mapped[date | None] = mapped_column(Date, nullable=True)
    dedup_key: Mapped[str | None] = mapped_column(Text, nullable=True)
    provider_message_id: Mapped[str | None] = mapped_column(Text, nullable=True)
    status: Mapped[str] = mapped_column(
        Text, nullable=False, default="pending", server_default="pending"
    )
    error_code: Mapped[str | None] = mapped_column(Text, nullable=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=False, server_default=func.now()
    )

    __table_args__ = (
        UniqueConstraint(
            "user_id", "template_name", "send_date_ist", name="outbound_daily_slot_uq"
        ),
        Index("outbound_messages_user_id_idx", "user_id"),
    )
