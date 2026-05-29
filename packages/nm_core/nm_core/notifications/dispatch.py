"""Fan-out a detected change: always in-app; WhatsApp/email/web-push when policy allows.

Real-time policy gate (shared by all push channels):
- alert_level 'all'           → every change type
- alert_level 'orders_only'   → new_orders only
- alert_level 'hearings_only' → hearing_date_change only
- alert_level 'digest_only'   → nothing real-time (digest cron handles it)
- snooze_until in the future  → suppressed
- WHATSAPP_DISABLED kill-switch → suppresses WhatsApp only

Idempotent per (user, cnr, type, day) via the messaging Redis dedup key (WhatsApp).
"""
from __future__ import annotations

import logging
from datetime import UTC, datetime

from sqlalchemy.orm import Session

from nm_core import messaging, push
from nm_core.cases.changes import Change
from nm_core.consent import is_opted_out
from nm_core.db.models.case import Case, CasePreference
from nm_core.db.models.notification import Notification
from nm_core.db.models.user import User
from nm_core.email import send_email
from nm_core.notifications.repository import NotificationRepository

logger = logging.getLogger("nm_core.notifications")

_ALERT_LEVEL_ALLOWS = {
    "all": {"status_change", "hearing_date_change", "new_orders", "disposal", "transfer"},
    "orders_only": {"new_orders"},
    "hearings_only": {"hearing_date_change"},
    "digest_only": set(),
}


def _realtime_allowed(change: Change, pref: CasePreference | None) -> bool:
    level = pref.alert_level if pref else "all"
    if change.type not in _ALERT_LEVEL_ALLOWS.get(level, set()):
        return False
    if pref and pref.snooze_until is not None:
        snooze = pref.snooze_until
        if snooze.tzinfo is None:
            snooze = snooze.replace(tzinfo=UTC)
        if snooze > datetime.now(UTC):
            return False
    return True


def dispatch_change(
    session: Session,
    *,
    user: User,
    case: Case,
    change: Change,
    pref: CasePreference | None = None,
) -> Notification:
    """Record the in-app notification and fan out to WhatsApp/email/web-push if allowed."""
    channels: list[str] = ["in_app"]
    title = case.title or case.cnr
    body = change.summary

    if _realtime_allowed(change, pref):
        if user.phone and not is_opted_out(user):
            today = datetime.now(UTC).date().isoformat()
            if messaging.enqueue_send_text(
                to_phone=user.phone,
                body=f"{title}\n{body}",
                user_id=user.id,
                dedup_key=f"{user.id}:{case.cnr}:{change.type}:{today}",
            ):
                channels.append("whatsapp")
        # Email/web-push are best-effort side-channels: a flaky SMTP server or push
        # endpoint must never roll back the in-app notification or the refresh sweep.
        if user.email:
            try:
                send_email(to=user.email, subject=f"Nowlez Munshi — {title}", body=body)
                channels.append("email")
            except Exception:  # noqa: BLE001
                logger.exception("email alert failed for user %s", user.id)
        try:
            if push.notify_user(session, user_id=user.id, title=title, body=body):
                channels.append("push")
        except Exception:  # noqa: BLE001
            logger.exception("web-push alert failed for user %s", user.id)

    return NotificationRepository(session).create(
        user_id=user.id,
        case_id=case.id,
        cnr=case.cnr,
        type=change.type,
        title=case.title or case.cnr,
        body=change.summary,
        channels_sent=channels,
    )


def dispatch_changes(
    session: Session,
    *,
    user: User,
    case: Case,
    changes: list[Change],
    pref: CasePreference | None = None,
) -> list[Notification]:
    return [
        dispatch_change(session, user=user, case=case, change=c, pref=pref) for c in changes
    ]
