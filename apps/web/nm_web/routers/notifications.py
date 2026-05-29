"""Notification feed endpoints."""
from __future__ import annotations

import uuid

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from nm_core.db.models.user import User
from nm_core.notifications import NotificationRepository
from nm_web import serializers
from nm_web.deps import get_current_user, get_db

router = APIRouter(prefix="/api/notifications", tags=["notifications"])


@router.get("")
def list_notifications(
    unread_only: bool = False,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> dict:
    rows = NotificationRepository(db).list_by_user(user.id, unread_only=unread_only)
    return {"notifications": [serializers.notification(n) for n in rows]}


@router.post("/{notification_id}/read")
def mark_read(
    notification_id: str,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> dict:
    NotificationRepository(db).mark_read(uuid.UUID(notification_id))
    return {"ok": True}
