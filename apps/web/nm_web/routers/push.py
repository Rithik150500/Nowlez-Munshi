"""Web-push subscription management for the PWA."""
from __future__ import annotations

from fastapi import APIRouter, Depends
from pydantic import BaseModel
from sqlalchemy.orm import Session

from nm_core import push
from nm_core.db.models.user import User
from nm_web.deps import get_current_user, get_db

router = APIRouter(prefix="/api/push", tags=["push"])


class SubscribeBody(BaseModel):
    endpoint: str
    p256dh: str
    auth: str


@router.get("/key")
def vapid_key() -> dict:
    """The VAPID public key the browser needs to subscribe (empty if push is off)."""
    return {"public_key": push.public_key()}


@router.post("/subscribe")
def subscribe(
    body: SubscribeBody,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> dict:
    push.PushSubscriptionRepository(db).upsert(
        user_id=user.id, endpoint=body.endpoint, p256dh=body.p256dh, auth=body.auth
    )
    return {"ok": True}
