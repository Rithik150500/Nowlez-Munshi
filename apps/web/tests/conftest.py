"""Web API test fixtures: TestClient wired to an in-memory DB + offline eCourts."""
from __future__ import annotations

import sqlite3
import uuid
from collections.abc import Iterator

import fakeredis
import pytest
from fastapi.testclient import TestClient
from nm_web.app import app
from nm_web.deps import get_db
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

from nm_core.config import get_settings
from nm_core.db import models  # noqa: F401 — register models
from nm_core.db.base import Base
from nm_core.ecourts.offline import clear_offline_cases
from nm_core.messaging import redis_dedup

sqlite3.register_adapter(uuid.UUID, str)


@pytest.fixture
def client(monkeypatch) -> Iterator[TestClient]:
    # StaticPool + a single shared connection so the create_all schema is visible to
    # the request handler thread (TestClient runs sync endpoints in a worker thread).
    engine = create_engine(
        "sqlite://",
        future=True,
        connect_args={"check_same_thread": False},
        poolclass=StaticPool,
    )
    Base.metadata.create_all(engine)
    factory = sessionmaker(bind=engine, expire_on_commit=False, future=True)

    def _override_get_db():
        session = factory()
        try:
            yield session
            session.commit()
        except Exception:
            session.rollback()
            raise
        finally:
            session.close()

    app.dependency_overrides[get_db] = _override_get_db
    monkeypatch.setattr(get_settings(), "ECOURTS_OFFLINE", True)
    monkeypatch.setattr(get_settings(), "WHATSAPP_DISABLED", True)
    monkeypatch.setattr(get_settings(), "DEV_MODE", True)
    monkeypatch.setattr(redis_dedup, "_client", fakeredis.FakeStrictRedis())
    clear_offline_cases()
    try:
        yield TestClient(app)
    finally:
        app.dependency_overrides.clear()
        clear_offline_cases()
        engine.dispose()
