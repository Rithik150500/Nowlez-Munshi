"""Shared test fixtures. Default dialect is in-memory SQLite (offline, no creds)."""
from __future__ import annotations

import sqlite3
import uuid
from collections.abc import Iterator

import pytest
from sqlalchemy import create_engine
from sqlalchemy.orm import Session, sessionmaker

from nm_core.db import models  # noqa: F401 — register models on Base.metadata
from nm_core.db.base import Base

# SQLite cannot bind a uuid.UUID directly.
sqlite3.register_adapter(uuid.UUID, str)


@pytest.fixture
def db_session() -> Iterator[Session]:
    engine = create_engine(
        "sqlite:///:memory:", future=True, connect_args={"check_same_thread": False}
    )
    Base.metadata.create_all(engine)
    factory = sessionmaker(bind=engine, expire_on_commit=False, future=True)
    session = factory()
    try:
        yield session
    finally:
        session.close()
        engine.dispose()
