"""Bot test fixtures: in-memory DB + offline eCourts + fake Redis."""
from __future__ import annotations

import sqlite3
import uuid
from collections.abc import Iterator

import fakeredis
import pytest
from sqlalchemy import create_engine
from sqlalchemy.orm import Session, sessionmaker

from nm_core.config import get_settings
from nm_core.db import models  # noqa: F401 — register models
from nm_core.db.base import Base
from nm_core.ecourts.offline import clear_offline_cases
from nm_core.messaging import redis_dedup

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


@pytest.fixture(autouse=True)
def env(monkeypatch):
    monkeypatch.setattr(get_settings(), "ECOURTS_OFFLINE", True)
    monkeypatch.setattr(get_settings(), "WHATSAPP_DISABLED", True)
    monkeypatch.setattr(redis_dedup, "_client", fakeredis.FakeStrictRedis())
    clear_offline_cases()
    yield
    clear_offline_cases()
    monkeypatch.setattr(redis_dedup, "_client", None)
