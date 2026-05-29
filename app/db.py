"""Our own SQLAlchemy engine + session.

We build the engine ourselves (rather than importing data_access.engine, which
is Postgres-pool-tuned) and pass the resulting Sessions into the shared DAOs and
identity functions — all of which are session-parameter driven. This lets the
prototype run on a local SQLite file while still using the shared schema.
"""
from __future__ import annotations

import sqlite3
import uuid

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from data_access.base import Base
import data_access.models  # noqa: F401 — registers every table on Base.metadata

from .config import settings

# sqlite3 adapters are process-wide; required so uuid.UUID binds as text on the
# SQLite path (with_variant only changes DDL, not the driver-level bind).
sqlite3.register_adapter(uuid.UUID, str)

_is_sqlite = settings.database_url.startswith("sqlite")
_connect_args = {"check_same_thread": False} if _is_sqlite else {}

engine = create_engine(settings.database_url, future=True, connect_args=_connect_args)
SessionLocal = sessionmaker(bind=engine, expire_on_commit=False, future=True)


def init_db() -> None:
    """Create all shared tables. Fine for a prototype; prod uses Alembic."""
    Base.metadata.create_all(engine)


def get_db():
    """FastAPI dependency: a committed-on-success, rolled-back-on-error session."""
    session = SessionLocal()
    try:
        yield session
        session.commit()
    except Exception:
        session.rollback()
        raise
    finally:
        session.close()
