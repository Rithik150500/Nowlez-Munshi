"""Request dependencies: bearer-token auth via shared identity."""
from __future__ import annotations

import uuid

from fastapi import Depends, Header, HTTPException, status

from identity import decode_access_token
from data_access.daos import user_dao

from .db import get_db


def get_current_user(authorization: str | None = Header(default=None), db=Depends(get_db)):
    if not authorization or not authorization.lower().startswith("bearer "):
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "Missing bearer token")
    token = authorization.split(" ", 1)[1].strip()
    try:
        claims = decode_access_token(token)
    except Exception:
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "Invalid or expired token")
    user = user_dao.get_by_id(db, uuid.UUID(claims["sub"]))
    if user is None:
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "User not found")
    return user
