"""Persisted AI chat: threads and messages (multi-turn, cross-channel)."""
from __future__ import annotations

import uuid
from datetime import UTC, datetime

from sqlalchemy import DateTime, ForeignKey, Index, Text, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from nm_core.db.base import Base
from nm_core.db.types import JSONBType, UUIDType


def _now_utc() -> datetime:
    return datetime.now(UTC)


class ChatThread(Base):
    __tablename__ = "chat_threads"

    id: Mapped[uuid.UUID] = mapped_column(UUIDType, primary_key=True, default=uuid.uuid4)
    user_id: Mapped[uuid.UUID] = mapped_column(
        UUIDType, ForeignKey("users.id", ondelete="CASCADE"), nullable=False
    )
    channel: Mapped[str] = mapped_column(Text, nullable=False, default="web")
    title: Mapped[str | None] = mapped_column(Text, nullable=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=False, server_default=func.now()
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=False, server_default=func.now(), onupdate=func.now()
    )

    messages: Mapped[list[ChatMessage]] = relationship(
        "ChatMessage", back_populates="thread", cascade="all, delete-orphan"
    )

    __table_args__ = (Index("chat_threads_user_id_idx", "user_id", "updated_at"),)


class ChatMessage(Base):
    __tablename__ = "chat_messages"

    id: Mapped[uuid.UUID] = mapped_column(UUIDType, primary_key=True, default=uuid.uuid4)
    thread_id: Mapped[uuid.UUID] = mapped_column(
        UUIDType, ForeignKey("chat_threads.id", ondelete="CASCADE"), nullable=False
    )
    role: Mapped[str] = mapped_column(Text, nullable=False)  # 'user' | 'assistant'
    content: Mapped[str] = mapped_column(Text, nullable=False)
    citations: Mapped[list] = mapped_column(JSONBType, nullable=False, default=list)
    tool_calls: Mapped[list] = mapped_column(JSONBType, nullable=False, default=list)
    # User feedback on an assistant message: 'up' | 'down' | None.
    feedback: Mapped[str | None] = mapped_column(Text, nullable=True)
    # Microsecond-precision Python-side default so sibling messages in a thread keep a
    # strict insertion order (a second-precision server default ties them, breaking
    # ordering + truncate-from-here).
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=False, default=_now_utc, server_default=func.now()
    )

    thread: Mapped[ChatThread] = relationship("ChatThread", back_populates="messages")

    __table_args__ = (Index("chat_messages_thread_id_idx", "thread_id", "created_at"),)
