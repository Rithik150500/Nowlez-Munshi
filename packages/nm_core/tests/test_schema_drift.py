"""Guard: the Alembic migration chain and the ORM (create_all) agree on the schema.

Catches the "column/table in the model but not the migration" (or vice-versa) class
of drift, where tests (create_all) and prod (Alembic) would diverge.
"""
from __future__ import annotations

import subprocess
import sys
from pathlib import Path

from sqlalchemy import create_engine, inspect
from sqlalchemy.orm import sessionmaker  # noqa: F401  (ensures ORM import wiring)

from nm_core.db import models  # noqa: F401 — register all models
from nm_core.db.base import Base

_PKG_DIR = Path(__file__).resolve().parents[1]


def _columns(engine) -> dict[str, set[str]]:
    insp = inspect(engine)
    return {
        t: {c["name"] for c in insp.get_columns(t)}
        for t in insp.get_table_names()
        if t != "alembic_version"
    }


def test_migrations_match_metadata(tmp_path):
    # Schema via Alembic.
    db_file = tmp_path / "alembic.db"
    url = f"sqlite:///{db_file}"
    import os

    res = subprocess.run(
        [sys.executable, "-m", "alembic", "-c", str(_PKG_DIR / "alembic.ini"), "upgrade", "head"],
        cwd=_PKG_DIR,
        env={**os.environ, "DATABASE_URL": url},
        capture_output=True,
        text=True,
    )
    assert res.returncode == 0, res.stderr
    alembic_cols = _columns(create_engine(url, future=True))

    # Schema via ORM create_all.
    orm_engine = create_engine("sqlite://", future=True)
    Base.metadata.create_all(orm_engine)
    orm_cols = _columns(orm_engine)

    assert set(alembic_cols) == set(orm_cols), (
        f"table drift: alembic-only={set(alembic_cols) - set(orm_cols)}, "
        f"orm-only={set(orm_cols) - set(alembic_cols)}"
    )
    for table in orm_cols:
        assert alembic_cols[table] == orm_cols[table], (
            f"column drift in {table}: "
            f"alembic-only={alembic_cols[table] - orm_cols[table]}, "
            f"orm-only={orm_cols[table] - alembic_cols[table]}"
        )
