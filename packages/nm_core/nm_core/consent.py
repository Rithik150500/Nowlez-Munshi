"""WhatsApp messaging consent (DPDP): inbound STOP / START keyword handling.

A bare ``STOP`` (and Hindi/synonym variants) opts the user out of *proactive*
WhatsApp — alerts, digests, re-engagement. Inbound service replies still work
(they're within Meta's 24h window and user-initiated). ``START`` opts back in.

Detection is leading-keyword + punctuation tolerant (telecom-style): the first
token of the message, stripped of surrounding punctuation, is matched — so
"STOP", "stop.", "Stop please", and "रोको" all opt out.
"""
from __future__ import annotations

import uuid
from datetime import UTC, datetime

from sqlalchemy.orm import Session

from nm_core.db.models.audit import AuditLog
from nm_core.db.models.user import User

_STOP_KEYWORDS = frozenset({
    "stop", "unsubscribe", "cancel", "stopall", "end", "quit", "रोको", "रुको", "बंद",
})
_START_KEYWORDS = frozenset({
    "start", "unstop", "resume", "subscribe", "चालू", "शुरू", "शुरु",
})


def _first_token(text: str) -> str:
    """Lowercased first whitespace-token with surrounding punctuation stripped."""
    parts = text.strip().split()
    if not parts:
        return ""
    return parts[0].strip(".,!?;:'\"()[]।-").lower()


def is_stop_keyword(text: str | None) -> bool:
    return _first_token(text or "") in _STOP_KEYWORDS


def is_start_keyword(text: str | None) -> bool:
    return _first_token(text or "") in _START_KEYWORDS


def is_opted_out(user: User) -> bool:
    return user.whatsapp_opted_out_at is not None


def set_opt_out(session: Session, *, user: User, opted_out: bool, keyword: str = "") -> None:
    """Flip the user's proactive-WhatsApp consent and write an audit row.

    Idempotent: re-running with the same state is a no-op (no duplicate audit).
    """
    if opted_out and user.whatsapp_opted_out_at is None:
        user.whatsapp_opted_out_at = datetime.now(UTC)
        _audit(session, user.id, "whatsapp.opted_out_via_inbound", keyword)
    elif not opted_out and user.whatsapp_opted_out_at is not None:
        user.whatsapp_opted_out_at = None
        _audit(session, user.id, "whatsapp.opted_in_via_inbound", keyword)
    session.flush()


def _audit(session: Session, user_id: uuid.UUID, event_type: str, keyword: str) -> None:
    session.add(
        AuditLog(
            event_type=event_type,
            user_id=user_id,
            source="whatsapp",
            metadata_={"keyword": keyword} if keyword else {},
        )
    )
