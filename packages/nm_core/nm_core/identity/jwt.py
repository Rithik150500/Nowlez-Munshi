"""Stateless tokens (HS256).

Access tokens carry no ``purpose`` claim; the short-lived *link* token (continuity
handoff) carries ``purpose: "link"`` and is rejected by the access path, and vice
versa, so a link can only be exchanged for a session — never used as one.
"""
from __future__ import annotations

import uuid
from datetime import UTC, datetime, timedelta

import jwt as pyjwt

from nm_core.config import get_settings
from nm_core.identity.errors import InvalidToken

_LINK_PURPOSE = "link"


def encode_access_token(user_id: uuid.UUID, *, ttl_seconds: int | None = None) -> str:
    s = get_settings()
    now = datetime.now(UTC)
    ttl = (
        timedelta(seconds=ttl_seconds)
        if ttl_seconds is not None
        else timedelta(minutes=s.JWT_ACCESS_TTL_MINUTES)
    )
    payload = {
        "sub": str(user_id),
        "iat": int(now.timestamp()),
        "exp": int((now + ttl).timestamp()),
    }
    return pyjwt.encode(payload, s.JWT_SECRET_KEY, algorithm=s.JWT_ALGORITHM)


def decode_access_token(token: str) -> dict:
    s = get_settings()
    try:
        claims = pyjwt.decode(token, s.JWT_SECRET_KEY, algorithms=[s.JWT_ALGORITHM])
    except pyjwt.ExpiredSignatureError as e:
        raise InvalidToken("access token expired") from e
    except pyjwt.InvalidTokenError as e:
        raise InvalidToken(f"invalid access token: {e}") from e
    if claims.get("purpose") == _LINK_PURPOSE:
        raise InvalidToken("link token cannot be used as an access token")
    return claims


def encode_link_token(user_id: uuid.UUID, *, ttl_seconds: int | None = None) -> str:
    """Short-lived single-purpose token for the WhatsApp→web continuity handoff."""
    s = get_settings()
    now = datetime.now(UTC)
    ttl = (
        timedelta(seconds=ttl_seconds)
        if ttl_seconds is not None
        else timedelta(minutes=s.LINK_TOKEN_TTL_MINUTES)
    )
    payload = {
        "sub": str(user_id),
        "purpose": _LINK_PURPOSE,
        "iat": int(now.timestamp()),
        "exp": int((now + ttl).timestamp()),
    }
    return pyjwt.encode(payload, s.JWT_SECRET_KEY, algorithm=s.JWT_ALGORITHM)


def decode_link_token(token: str) -> dict:
    s = get_settings()
    try:
        claims = pyjwt.decode(token, s.JWT_SECRET_KEY, algorithms=[s.JWT_ALGORITHM])
    except pyjwt.ExpiredSignatureError as e:
        raise InvalidToken("link token expired") from e
    except pyjwt.InvalidTokenError as e:
        raise InvalidToken(f"invalid link token: {e}") from e
    if claims.get("purpose") != _LINK_PURPOSE:
        raise InvalidToken("not a link token")
    return claims
