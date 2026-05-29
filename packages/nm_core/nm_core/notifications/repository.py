"""In-app notification feed repository."""
from __future__ import annotations

import uuid
from datetime import UTC, datetime

from sqlalchemy import select, update
from sqlalchemy.orm import Session

from nm_core.db.models.notification import Notification


class NotificationRepository:
    def __init__(self, session: Session) -> None:
        self.s = session

    def create(
        self,
        *,
        user_id: uuid.UUID,
        title: str,
        body: str,
        type: str,
        case_id: uuid.UUID | None = None,
        cnr: str | None = None,
        channels_sent: list[str] | None = None,
    ) -> Notification:
        obj = Notification(
            user_id=user_id,
            case_id=case_id,
            cnr=cnr,
            type=type,
            title=title,
            body=body,
            channels_sent=channels_sent or [],
        )
        self.s.add(obj)
        self.s.flush()
        return obj

    def list_by_user(
        self, user_id: uuid.UUID, *, unread_only: bool = False, limit: int = 100
    ) -> list[Notification]:
        stmt = select(Notification).where(Notification.user_id == user_id)
        if unread_only:
            stmt = stmt.where(Notification.read_at.is_(None))
        stmt = stmt.order_by(Notification.created_at.desc()).limit(limit)
        return list(self.s.execute(stmt).scalars())

    def mark_read(self, notification_id: uuid.UUID) -> None:
        self.s.execute(
            update(Notification)
            .where(Notification.id == notification_id)
            .values(read_at=datetime.now(UTC))
        )
