"""Opaque refresh-token lifecycle. Raw token is returned once; only its SHA-256 is stored."""
from __future__ import annotations

import hashlib
import secrets
import uuid

from sqlalchemy.orm import Session

from nm_core.config import get_settings
from nm_core.db.models.auth import AuthSession
from nm_core.identity.errors import InvalidToken
from nm_core.identity.repositories import SessionRepository


def _hash(raw: str) -> str:
    return hashlib.sha256(raw.encode("utf-8")).hexdigest()


def issue_refresh_token(
    session: Session,
    *,
    user_id: uuid.UUID,
    user_agent: str | None = None,
    ip_address: str | None = None,
) -> tuple[str, AuthSession]:
    raw = secrets.token_urlsafe(48)
    auth_session = SessionRepository(session).create(
        user_id=user_id,
        refresh_token_hash=_hash(raw),
        user_agent=user_agent,
        ip_address=ip_address,
        ttl_days=get_settings().REFRESH_TTL_DAYS,
    )
    return raw, auth_session


def consume_refresh_token(session: Session, raw_token: str) -> AuthSession:
    repo = SessionRepository(session)
    auth_session = repo.lookup_active_by_hash(_hash(raw_token))
    if auth_session is None:
        raise InvalidToken("refresh token invalid, revoked, or expired")
    repo.touch_last_used(auth_session.id)
    return auth_session


def revoke_refresh_token(session: Session, raw_token: str) -> None:
    """Idempotent logout — unknown tokens are a no-op."""
    SessionRepository(session).revoke_by_hash(_hash(raw_token))
