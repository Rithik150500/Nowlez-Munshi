"""Chat thread + message persistence."""
from __future__ import annotations

import uuid

from sqlalchemy import select
from sqlalchemy.orm import Session

from nm_core.db.models.chat import ChatMessage, ChatThread


class ChatRepository:
    def __init__(self, session: Session) -> None:
        self.s = session

    def create_thread(
        self, *, user_id: uuid.UUID, channel: str = "web", title: str | None = None
    ) -> ChatThread:
        thread = ChatThread(user_id=user_id, channel=channel, title=title)
        self.s.add(thread)
        self.s.flush()
        return thread

    def get_thread(self, user_id: uuid.UUID, thread_id: uuid.UUID) -> ChatThread | None:
        thread = self.s.get(ChatThread, thread_id)
        if thread is None or thread.user_id != user_id:
            return None
        return thread

    def latest_thread(self, user_id: uuid.UUID, *, channel: str) -> ChatThread | None:
        return self.s.execute(
            select(ChatThread)
            .where(ChatThread.user_id == user_id, ChatThread.channel == channel)
            .order_by(ChatThread.updated_at.desc())
            .limit(1)
        ).scalar_one_or_none()

    def list_threads(self, user_id: uuid.UUID, *, limit: int = 50) -> list[ChatThread]:
        return list(
            self.s.execute(
                select(ChatThread)
                .where(ChatThread.user_id == user_id)
                .order_by(ChatThread.updated_at.desc())
                .limit(limit)
            ).scalars()
        )

    def recent_messages(self, thread_id: uuid.UUID, *, limit: int = 20) -> list[ChatMessage]:
        rows = list(
            self.s.execute(
                select(ChatMessage)
                .where(ChatMessage.thread_id == thread_id)
                .order_by(ChatMessage.created_at.desc())
                .limit(limit)
            ).scalars()
        )
        return list(reversed(rows))

    def add_message(
        self,
        thread_id: uuid.UUID,
        *,
        role: str,
        content: str,
        citations: list | None = None,
        tool_calls: list | None = None,
    ) -> ChatMessage:
        msg = ChatMessage(
            thread_id=thread_id,
            role=role,
            content=content,
            citations=citations or [],
            tool_calls=tool_calls or [],
        )
        self.s.add(msg)
        self.s.flush()
        return msg

    def get_message(self, message_id: uuid.UUID) -> ChatMessage | None:
        return self.s.get(ChatMessage, message_id)

    def set_feedback(self, message_id: uuid.UUID, feedback: str | None) -> ChatMessage | None:
        """Set thumbs feedback on an assistant message ('up' | 'down' | None to clear)."""
        msg = self.s.get(ChatMessage, message_id)
        if msg is None or msg.role != "assistant":
            return None
        msg.feedback = feedback
        self.s.flush()
        return msg

    def truncate_from(self, thread_id: uuid.UUID, message_id: uuid.UUID) -> bool:
        """Delete the given message and all messages at/after it in the thread (used to
        edit-and-regenerate a turn). Returns False if the message isn't in the thread."""
        anchor = self.s.get(ChatMessage, message_id)
        if anchor is None or anchor.thread_id != thread_id:
            return False
        for m in self.s.execute(
            select(ChatMessage).where(
                ChatMessage.thread_id == thread_id,
                ChatMessage.created_at >= anchor.created_at,
            )
        ).scalars():
            self.s.delete(m)
        self.s.flush()
        return True
