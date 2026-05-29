"""Engine + session factory.

``make_engine`` is dialect-aware (no pool args for SQLite). A default ``engine``
and ``SessionLocal`` are built lazily from ``settings.DATABASE_URL`` for apps that
don't construct their own; tests build their own in-memory SQLite engine.
"""
from __future__ import annotations

import sqlite3
import uuid
from collections.abc import Iterator
from contextlib import contextmanager

from sqlalchemy import create_engine
from sqlalchemy.engine import Engine
from sqlalchemy.orm import Session, sessionmaker

from nm_core.config import get_settings

# SQLite cannot bind a uuid.UUID directly; store as text.
sqlite3.register_adapter(uuid.UUID, str)


def make_engine(url: str, **kwargs) -> Engine:
    if url.startswith("sqlite"):
        return create_engine(
            url, future=True, connect_args={"check_same_thread": False}, **kwargs
        )
    s = get_settings()
    return create_engine(
        url,
        future=True,
        pool_pre_ping=True,
        pool_size=s.DB_POOL_SIZE,
        max_overflow=s.DB_MAX_OVERFLOW,
        pool_recycle=s.DB_POOL_RECYCLE_SECONDS,
        **kwargs,
    )


engine: Engine = make_engine(get_settings().DATABASE_URL)
SessionLocal = sessionmaker(bind=engine, expire_on_commit=False, future=True)


@contextmanager
def session_scope() -> Iterator[Session]:
    """Transactional scope: commit on success, rollback on error, always close."""
    session = SessionLocal()
    try:
        yield session
        session.commit()
    except Exception:
        session.rollback()
        raise
    finally:
        session.close()
