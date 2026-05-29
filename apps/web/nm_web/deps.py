"""FastAPI dependencies: request-scoped DB session + JWT-authenticated current user."""
from __future__ import annotations

import uuid
from collections.abc import Iterator

from fastapi import Depends, Header, HTTPException
from sqlalchemy.orm import Session

from nm_core.db.engine import SessionLocal
from nm_core.db.models.user import User
from nm_core.identity import decode_access_token
from nm_core.identity.errors import InvalidToken
from nm_core.identity.repositories import UserRepository


def get_db() -> Iterator[Session]:
    session = SessionLocal()
    try:
        yield session
        session.commit()
    except Exception:
        session.rollback()
        raise
    finally:
        session.close()


def get_current_user(
    authorization: str | None = Header(default=None),
    db: Session = Depends(get_db),
) -> User:
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="missing bearer token")
    try:
        claims = decode_access_token(authorization[len("Bearer ") :])
    except InvalidToken as e:
        raise HTTPException(status_code=401, detail="invalid token") from e
    user = UserRepository(db).get_by_id(uuid.UUID(claims["sub"]))
    if user is None or not user.is_active:
        raise HTTPException(status_code=401, detail="unknown user")
    return user


def require_admin(user: User = Depends(get_current_user)) -> User:
    if not user.is_admin:
        raise HTTPException(status_code=403, detail="admin only")
    return user
