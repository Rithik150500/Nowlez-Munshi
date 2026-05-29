"""Stateless access tokens (HS256). Claims: ``sub``, ``iat``, ``exp``."""
from __future__ import annotations

import uuid
from datetime import UTC, datetime, timedelta

import jwt as pyjwt

from nm_core.config import get_settings
from nm_core.identity.errors import InvalidToken


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
        return pyjwt.decode(token, s.JWT_SECRET_KEY, algorithms=[s.JWT_ALGORITHM])
    except pyjwt.ExpiredSignatureError as e:
        raise InvalidToken("access token expired") from e
    except pyjwt.InvalidTokenError as e:
        raise InvalidToken(f"invalid access token: {e}") from e
