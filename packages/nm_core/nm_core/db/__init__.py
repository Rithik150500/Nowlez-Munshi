"""SQLAlchemy 2 Base, engine/session factory, and the single Alembic migration chain."""
from __future__ import annotations

from nm_core.db import models  # noqa: F401 — register models on Base.metadata
from nm_core.db.base import Base
from nm_core.db.engine import SessionLocal, engine, make_engine, session_scope
from nm_core.db.types import INETType, JSONBType, UUIDType

__all__ = [
    "Base",
    "INETType",
    "JSONBType",
    "SessionLocal",
    "UUIDType",
    "engine",
    "make_engine",
    "session_scope",
]
