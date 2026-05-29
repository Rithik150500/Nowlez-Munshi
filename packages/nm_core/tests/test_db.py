"""DB foundation: type round-trips and the Alembic chain apply on SQLite."""
from __future__ import annotations

import subprocess
import sys
import uuid
from pathlib import Path

from sqlalchemy import create_engine, inspect, text

from nm_core.db.models.audit import AuditLog
from nm_core.db.models.user import User

_PKG_DIR = Path(__file__).resolve().parents[1]


def test_uuid_and_json_round_trip(db_session):
    user = User(phone="+919000000001", name="Adv. Rao", locale="en")
    db_session.add(user)
    db_session.flush()
    assert isinstance(user.id, uuid.UUID)

    log = AuditLog(
        event_type="test.event",
        source="identity",
        user_id=user.id,
        metadata_={"k": "v", "n": 1},
    )
    db_session.add(log)
    db_session.flush()
    db_session.expire_all()

    fetched = db_session.get(AuditLog, log.id)
    assert isinstance(fetched.id, uuid.UUID)
    assert isinstance(fetched.user_id, uuid.UUID)
    assert fetched.metadata_ == {"k": "v", "n": 1}


def test_alembic_upgrade_and_downgrade(tmp_path):
    db_file = tmp_path / "m1.db"
    url = f"sqlite:///{db_file}"
    env = {"DATABASE_URL": url, "PATH": __import__("os").environ["PATH"]}

    def alembic(*args):
        return subprocess.run(
            [sys.executable, "-m", "alembic", "-c", str(_PKG_DIR / "alembic.ini"), *args],
            cwd=_PKG_DIR,
            env={**__import__("os").environ, **env},
            capture_output=True,
            text=True,
        )

    up = alembic("upgrade", "head")
    assert up.returncode == 0, up.stderr

    engine = create_engine(url, future=True)
    tables = set(inspect(engine).get_table_names())
    assert {"users", "otp_codes", "auth_sessions", "audit_log"} <= tables
    with engine.connect() as conn:
        conn.execute(text("SELECT id, phone, name FROM users"))  # columns exist
    engine.dispose()

    down = alembic("downgrade", "base")
    assert down.returncode == 0, down.stderr
    engine = create_engine(url, future=True)
    assert "users" not in set(inspect(engine).get_table_names())
    engine.dispose()
