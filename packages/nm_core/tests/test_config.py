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


def _prod_env(monkeypatch):
    """A fully-configured production environment (no hard-fail triggers)."""
    monkeypatch.setenv("ENV", "production")
    monkeypatch.setenv("DATABASE_URL", "postgresql+psycopg2://db.internal/prod")
    monkeypatch.setenv("REDIS_URL", "redis://cache.internal:6379/0")
    monkeypatch.setenv("JWT_SECRET_KEY", "a-strong-secret-key-of-sufficient-length-1234")
    monkeypatch.setenv("DEV_MODE", "0")


def test_fully_configured_production_passes(monkeypatch):
    _prod_env(monkeypatch)
    s = Settings()
    assert s.DATABASE_URL == "postgresql+psycopg2://db.internal/prod"
    assert s.DEV_MODE is False


def test_half_configured_vapid_hard_fails(monkeypatch):
    monkeypatch.setenv("VAPID_PUBLIC_KEY", "pub-only")
    monkeypatch.delenv("VAPID_PRIVATE_KEY", raising=False)
    with pytest.raises(RuntimeError, match="VAPID keys are half-configured"):
        Settings()


def test_both_vapid_keys_pass(monkeypatch):
    monkeypatch.setenv("VAPID_PUBLIC_KEY", "pub")
    monkeypatch.setenv("VAPID_PRIVATE_KEY", "priv")
    assert Settings().VAPID_PUBLIC_KEY == "pub"


def test_redis_dev_default_in_production_hard_fails(monkeypatch):
    _prod_env(monkeypatch)
    monkeypatch.delenv("REDIS_URL", raising=False)
    with pytest.raises(RuntimeError, match="REDIS_URL is unset"):
        Settings()


def test_default_jwt_secret_in_production_hard_fails(monkeypatch):
    _prod_env(monkeypatch)
    monkeypatch.delenv("JWT_SECRET_KEY", raising=False)
    with pytest.raises(RuntimeError, match="JWT_SECRET_KEY"):
        Settings()


def test_dev_mode_in_production_hard_fails(monkeypatch):
    _prod_env(monkeypatch)
    monkeypatch.setenv("DEV_MODE", "1")
    with pytest.raises(RuntimeError, match="DEV_MODE"):
        Settings()


def test_railway_marker_triggers_hard_fail(monkeypatch):
    monkeypatch.delenv("DATABASE_URL", raising=False)
    monkeypatch.delenv("ENV", raising=False)
    monkeypatch.setenv("RAILWAY_ENVIRONMENT", "production")
    with pytest.raises(RuntimeError):
        Settings()
