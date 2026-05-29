"""Prod-safety hard-fail behaviour."""
from __future__ import annotations

import pytest

from nm_core.config import _DEV_DEFAULT_DATABASE_URL, Settings


def test_dev_default_is_ok_without_prod_markers(monkeypatch):
    for var in ("ENV", "RAILWAY_ENVIRONMENT", "RAILWAY_PROJECT_ID", "IS_PRODUCTION"):
        monkeypatch.delenv(var, raising=False)
    monkeypatch.delenv("DATABASE_URL", raising=False)
    s = Settings()
    assert s.DATABASE_URL == _DEV_DEFAULT_DATABASE_URL


def test_dev_default_in_production_hard_fails(monkeypatch):
    monkeypatch.delenv("DATABASE_URL", raising=False)
    monkeypatch.setenv("ENV", "production")
    with pytest.raises(RuntimeError, match="DATABASE_URL is unset"):
        Settings()


def test_explicit_url_passes_in_production(monkeypatch):
    monkeypatch.setenv("ENV", "production")
    monkeypatch.setenv("DATABASE_URL", "postgresql+psycopg2://db.internal/prod")
    s = Settings()
    assert s.DATABASE_URL == "postgresql+psycopg2://db.internal/prod"


def test_railway_marker_triggers_hard_fail(monkeypatch):
    monkeypatch.delenv("DATABASE_URL", raising=False)
    monkeypatch.delenv("ENV", raising=False)
    monkeypatch.setenv("RAILWAY_ENVIRONMENT", "production")
    with pytest.raises(RuntimeError):
        Settings()
