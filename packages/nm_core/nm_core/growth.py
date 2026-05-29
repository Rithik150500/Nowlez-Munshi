"""Growth: re-engagement of dormant users (worker-driven)."""
from __future__ import annotations

from datetime import UTC, datetime, timedelta

from sqlalchemy import select
from sqlalchemy.orm import Session

from nm_core import messaging
from nm_core.config import get_settings
from nm_core.db.models.user import User

_NUDGE = (
    "👋 It's been a while. Your cases are still being tracked on Nowlez Munshi — "
    "send a CNR or /saved to catch up."
)


def _aware(dt: datetime) -> datetime:
    return dt if dt.tzinfo is not None else dt.replace(tzinfo=UTC)


def reengage_dormant(session: Session, *, now: datetime | None = None) -> int:
    """Nudge users inactive past the threshold and not recently nudged. Returns count."""
    now = now or datetime.now(UTC)
    cutoff = now - timedelta(days=get_settings().REENGAGE_AFTER_DAYS)
    users = session.execute(
        select(User).where(User.phone.is_not(None), User.last_login_at.is_not(None))
    ).scalars()
    nudged = 0
    for user in users:
        if user.phone is None or user.last_login_at is None:
            continue
        if _aware(user.last_login_at) >= cutoff:
            continue
        if user.re_engaged_at is not None and _aware(user.re_engaged_at) >= cutoff:
            continue
        messaging.send_text(
            session,
            to_phone=user.phone,
            body=_NUDGE,
            user_id=user.id,
            dedup_key=f"reengage:{user.id}:{now.date().isoformat()}",
        )
        user.re_engaged_at = now
        session.flush()
        nudged += 1
    return nudged
