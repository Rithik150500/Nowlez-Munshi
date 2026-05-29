"""App settings via plain env vars (pydantic-settings would be fine too, but
this keeps the prototype dependency-light).

IMPORTANT: we deliberately do NOT read/set DATABASE_URL — that belongs to the
shared `data_access` package (whose Postgres-tuned engine we never use). This
app runs its OWN engine from MUNSHI_DATABASE_URL and passes sessions into the
shared DAOs. See app/db.py.
"""
from __future__ import annotations

import os


def _as_bool(value: str | None, default: bool) -> bool:
    if value is None:
        return default
    return value.strip().lower() in ("1", "true", "yes", "on")


class Settings:
    def __init__(self) -> None:
        self.dev_mode: bool = _as_bool(os.environ.get("DEV_MODE"), True)
        self.database_url: str = os.environ.get(
            "MUNSHI_DATABASE_URL", "sqlite:///./nowlez_munshi.db"
        )
        self.gemini_model: str = os.environ.get("GEMINI_MODEL", "gemini-3-flash-preview")


settings = Settings()
