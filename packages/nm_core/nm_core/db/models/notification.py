"""In-app notification feed (also the record of what was fanned out to channels)."""
from __future__ import annotations

import uuid
from datetime import datetime

from sqlalchemy import DateTime, ForeignKey, Index, String, Text, func
from sqlalchemy.orm import Mapped, mapped_column

from nm_core.db.base import Base
from nm_core.db.types import JSONBType, UUIDType


class Notification(Base):
    __tablename__ = "notifications"

    id: Mapped[uuid.UUID] = mapped_column(UUIDType, primary_key=True, default=uuid.uuid4)
    user_id: Mapped[uuid.UUID] = mapped_column(
        UUIDType, ForeignKey("users.id", ondelete="CASCADE"), nullable=False
    )
    case_id: Mapped[uuid.UUID | None] = mapped_column(
        UUIDType, ForeignKey("cases.id", ondelete="SET NULL"), nullable=True
    )
    cnr: Mapped[str | None] = mapped_column(String(16), nullable=True)
    type: Mapped[str] = mapped_column(Text, nullable=False)
    title: Mapped[str] = mapped_column(Text, nullable=False)
    body: Mapped[str] = mapped_column(Text, nullable=False)
    channels_sent: Mapped[list] = mapped_column(JSONBType, nullable=False, default=list)
    read_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=False, server_default=func.now()
    )

    __table_args__ = (Index("notifications_user_id_idx", "user_id", "created_at"),)
