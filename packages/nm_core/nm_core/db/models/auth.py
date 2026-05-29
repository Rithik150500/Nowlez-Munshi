"""Auth artefacts: opaque refresh sessions and one-time passcodes.

``created_at``/``expires_at`` carry a Python ``default`` (UTC-aware) so the values
SQLAlchemy renders for SQLite match the format used for query bind params — keeping
the rate-limit and session-lookup comparisons reliable on the test dialect.
"""
from __future__ import annotations

import uuid
from datetime import UTC, datetime

from sqlalchemy import (
    CheckConstraint,
    DateTime,
    ForeignKey,
    Index,
    SmallInteger,
    String,
    Text,
    func,
    text,
)
from sqlalchemy.orm import Mapped, mapped_column

from nm_core.db.base import Base
from nm_core.db.types import INETType, UUIDType


def _utcnow() -> datetime:
    return datetime.now(UTC)


class AuthSession(Base):
    __tablename__ = "auth_sessions"

    id: Mapped[uuid.UUID] = mapped_column(UUIDType, primary_key=True, default=uuid.uuid4)
    user_id: Mapped[uuid.UUID] = mapped_column(
        UUIDType, ForeignKey("users.id", ondelete="CASCADE"), nullable=False
    )
    refresh_token_hash: Mapped[str] = mapped_column(Text, nullable=False, unique=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=False, default=_utcnow, server_default=func.now()
    )
    expires_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)
    last_used_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=False, default=_utcnow, server_default=func.now()
    )
    user_agent: Mapped[str | None] = mapped_column(Text, nullable=True)
    ip_address: Mapped[str | None] = mapped_column(INETType, nullable=True)
    revoked_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)

    __table_args__ = (
        Index(
            "auth_sessions_user_id_idx",
            "user_id",
            postgresql_where=text("revoked_at IS NULL"),
        ),
        Index(
            "auth_sessions_expires_at_idx",
            "expires_at",
            postgresql_where=text("revoked_at IS NULL"),
        ),
    )


class OtpCode(Base):
    __tablename__ = "otp_codes"

    id: Mapped[uuid.UUID] = mapped_column(UUIDType, primary_key=True, default=uuid.uuid4)
    phone: Mapped[str] = mapped_column(String(20), nullable=False)
    code_hash: Mapped[str] = mapped_column(Text, nullable=False)
    channel: Mapped[str] = mapped_column(Text, nullable=False)
    delivery_status: Mapped[str] = mapped_column(
        Text, nullable=False, default="pending", server_default="pending"
    )
    delivery_provider_id: Mapped[str | None] = mapped_column(Text, nullable=True)
    attempts_remaining: Mapped[int] = mapped_column(
        SmallInteger, nullable=False, default=3, server_default="3"
    )
    expires_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=False, default=_utcnow, server_default=func.now()
    )
    used_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    ip_address: Mapped[str | None] = mapped_column(INETType, nullable=True)

    __table_args__ = (
        CheckConstraint("channel IN ('whatsapp', 'sms')", name="otp_codes_channel_ck"),
        CheckConstraint(
            "delivery_status IN ('pending', 'delivered', 'failed')",
            name="otp_codes_delivery_status_ck",
        ),
        Index("otp_codes_phone_idx", "phone", postgresql_where=text("used_at IS NULL")),
        Index(
            "otp_codes_expires_at_idx",
            "expires_at",
            postgresql_where=text("used_at IS NULL"),
        ),
    )
