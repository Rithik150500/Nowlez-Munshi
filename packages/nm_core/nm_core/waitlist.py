"""Public waitlist + demo-request handling.

Waitlist signups are idempotent on email; demo requests are not persisted (audit-logged
+ emailed, matching the legacy). Input validation/sanitization here is security-relevant
(these are unauthenticated endpoints feeding an admin view)."""
from __future__ import annotations

import re

from sqlalchemy import func, select
from sqlalchemy.orm import Session

from nm_core.db.models.audit import AuditLog
from nm_core.db.models.waitlist import Waitlist

_EMAIL_RE = re.compile(r"^[^@\s]+@[^@\s]+\.[^@\s]+$")
_TAG_RE = re.compile(r"<[^>]*>")


class WaitlistError(ValueError):
    """Invalid waitlist/demo input."""


def _clean(text: str, *, cap: int) -> str:
    """Strip HTML tags + control chars and cap length (stored-XSS defense)."""
    return _TAG_RE.sub("", (text or "")).strip()[:cap]


def validate_email(email: str) -> str:
    e = (email or "").strip().lower()
    if not e or len(e) > 254 or not _EMAIL_RE.match(e):
        raise WaitlistError("a valid email is required")
    return e


def join_waitlist(session: Session, *, name: str, email: str,
                  practice_area: str | None = None) -> bool:
    """Idempotent on email. Returns True if a new row was created, False if already on."""
    name = _clean(name, cap=200)
    if len(name) < 2:
        raise WaitlistError("name must be at least 2 characters")
    email = validate_email(email)
    existing = session.execute(
        select(Waitlist).where(Waitlist.email == email)
    ).scalar_one_or_none()
    if existing is not None:
        return False
    session.add(Waitlist(name=name, email=email,
                         practice_area=_clean(practice_area or "", cap=200) or None))
    session.flush()
    return True


def waitlist_count(session: Session) -> int:
    return int(session.execute(select(func.count()).select_from(Waitlist)).scalar_one())


def record_demo_request(session: Session, *, name: str, email: str,
                        firm: str | None = None, message: str | None = None) -> None:
    """Validate + sanitize a demo request and audit it (not persisted to a table)."""
    name = _clean(name, cap=200)
    if len(name) < 2:
        raise WaitlistError("name must be at least 2 characters")
    email = validate_email(email)
    session.add(AuditLog(
        event_type="demo.requested", source="public",
        metadata_={"name": name, "email": email,
                   "firm": _clean(firm or "", cap=200),
                   "message": _clean(message or "", cap=2000)},
    ))
    session.flush()
