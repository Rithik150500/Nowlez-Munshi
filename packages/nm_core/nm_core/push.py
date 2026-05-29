"""Web push (VAPID / browser Push API).

No VAPID keys configured → the push channel is a no-op (recorded in ``sent_outbox``
for dev/tests, like the console email provider). Dead endpoints (404/410) are pruned
from the database so we stop pushing to unsubscribed browsers.
"""
from __future__ import annotations

import json
import logging
import uuid

from sqlalchemy import select
from sqlalchemy.orm import Session

from nm_core.config import get_settings
from nm_core.db.models.push import PushSubscription

logger = logging.getLogger("nm_core.push")

# Captures payloads when VAPID isn't configured so tests can assert on them.
sent_outbox: list[dict] = []


class PushSubscriptionRepository:
    def __init__(self, session: Session) -> None:
        self.s = session

    def upsert(
        self, *, user_id: uuid.UUID, endpoint: str, p256dh: str, auth: str
    ) -> PushSubscription:
        sub = self.s.execute(
            select(PushSubscription).where(PushSubscription.endpoint == endpoint)
        ).scalar_one_or_none()
        if sub is None:
            sub = PushSubscription(user_id=user_id, endpoint=endpoint, p256dh=p256dh, auth=auth)
            self.s.add(sub)
        else:
            sub.user_id = user_id
            sub.p256dh = p256dh
            sub.auth = auth
        self.s.flush()
        return sub

    def list_for_user(self, user_id: uuid.UUID) -> list[PushSubscription]:
        return list(
            self.s.execute(
                select(PushSubscription).where(PushSubscription.user_id == user_id)
            ).scalars()
        )

    def delete(self, sub: PushSubscription) -> None:
        self.s.delete(sub)


def public_key() -> str:
    return get_settings().VAPID_PUBLIC_KEY


def notify_user(session: Session, *, user_id: uuid.UUID, title: str, body: str) -> int:
    """Push to all of a user's subscriptions. Returns the count attempted/recorded."""
    subs = PushSubscriptionRepository(session).list_for_user(user_id)
    payload = json.dumps({"title": title, "body": body})
    sent = 0
    for sub in subs:
        if _deliver(session, sub, payload):
            sent += 1
    return sent


def _deliver(session: Session, sub: PushSubscription, payload: str) -> bool:
    s = get_settings()
    if not (s.VAPID_PRIVATE_KEY and s.VAPID_PUBLIC_KEY):
        sent_outbox.append({"endpoint": sub.endpoint, "payload": payload})
        return True
    try:
        from pywebpush import WebPushException, webpush
    except Exception:  # noqa: BLE001 — library missing → behave like console
        sent_outbox.append({"endpoint": sub.endpoint, "payload": payload})
        return True
    try:
        webpush(
            subscription_info={
                "endpoint": sub.endpoint,
                "keys": {"p256dh": sub.p256dh, "auth": sub.auth},
            },
            data=payload,
            vapid_private_key=s.VAPID_PRIVATE_KEY,
            vapid_claims={"sub": s.VAPID_SUBJECT},
        )
        return True
    except WebPushException as e:
        status = getattr(e.response, "status_code", None)
        if status in (404, 410):  # gone → prune the dead endpoint
            PushSubscriptionRepository(session).delete(sub)
        else:
            logger.warning("web push failed (%s): %s", status, e)
        return False
