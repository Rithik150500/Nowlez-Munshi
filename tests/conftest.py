"""Test harness: a throwaway file-backed SQLite DB + a FastAPI TestClient.

A file (not :memory:) is used so the app's pooled connections across threads
share one schema. GEMINI_API_KEY is cleared so the deterministic extractive
path runs — which is what makes the cross-channel parity assertion exact.
"""
from __future__ import annotations

import os
import tempfile

# Configure env BEFORE importing app modules (engine is built at import time).
_tmp = tempfile.NamedTemporaryFile(suffix=".db", delete=False)
_tmp.close()
os.environ["MUNSHI_DATABASE_URL"] = f"sqlite:///{_tmp.name}"
os.environ["DEV_MODE"] = "1"
os.environ.setdefault("JWT_SECRET_KEY", "test-secret")
os.environ.pop("GEMINI_API_KEY", None)

import pytest  # noqa: E402
from fastapi.testclient import TestClient  # noqa: E402

from app.db import SessionLocal, init_db  # noqa: E402
from app.main import app  # noqa: E402


@pytest.fixture(scope="session", autouse=True)
def _create_schema():
    init_db()
    yield
    try:
        os.unlink(_tmp.name)
    except OSError:
        pass


@pytest.fixture()
def client():
    with TestClient(app) as c:
        yield c


@pytest.fixture()
def db():
    session = SessionLocal()
    try:
        yield session
    finally:
        session.close()
