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

# English + romanized Hindi (WhatsApp QWERTY norm) + Devanagari. Ported from the
# legacy whatsapp_delivery router so common opt-outs ("OPT OUT", "PAUSE", "band karo")
# are all honored — a DPDP-compliance surface.
_STOP_KEYWORDS = frozenset({
    # English
    "STOP", "STOP ALL", "STOP NOTIFICATIONS", "PAUSE", "UNSUBSCRIBE",
    "OPT OUT", "OPT-OUT", "CANCEL", "END", "QUIT",
    # Romanized Hindi
    "BAND", "BAND KARO", "BAND KAR", "BANDH", "BANDH KARO",
    "CHHODO", "ROK", "ROK DO", "RUKO", "RUK",
    # Devanagari
    "बंद", "बंद करो", "बंद कर", "रुक", "रुको", "रोक", "रोक दो", "छोड़ो", "रोको",
})
_START_KEYWORDS = frozenset({
    "START", "UNSTOP", "RESUME", "SUBSCRIBE", "START ALL",
    "चालू", "शुरू", "शुरु",
})


def _matches(text: str | None, keywords: frozenset[str]) -> bool:
    """Whole-phrase keyword match, tolerating trailing punctuation and a single
    trailing word ("STOP ALL", "stop."), but not prefixes like "stopover"."""
    if not text:
        return False
    normalized = text.strip().upper()
    if normalized in keywords:
        return True
    if normalized.endswith((".", "!", "?")) and normalized[:-1].strip() in keywords:
        return True
    for kw in keywords:
        if normalized.startswith(kw + " "):
            tail = normalized[len(kw) + 1:].strip().rstrip(".!?")
            if " " not in tail:  # exactly one trailing word
                return True
        if normalized.startswith((kw + "!", kw + ".")):
            return True
    return False


def is_stop_keyword(text: str | None) -> bool:
    return _matches(text, _STOP_KEYWORDS)


def is_start_keyword(text: str | None) -> bool:
    return _matches(text, _START_KEYWORDS)


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
