"""M4e growth: email provider + re-engagement of dormant users."""
from __future__ import annotations

from datetime import UTC, datetime, timedelta

import fakeredis
import pytest

from nm_core import email
from nm_core.config import get_settings
from nm_core.growth import reengage_dormant
from nm_core.identity.repositories import UserRepository
from nm_core.messaging import redis_dedup


@pytest.fixture(autouse=True)
def env(monkeypatch):
    monkeypatch.setattr(get_settings(), "WHATSAPP_DISABLED", True)  # no real sends
    monkeypatch.setattr(redis_dedup, "_client", fakeredis.FakeStrictRedis())
    email.sent_outbox.clear()
    yield


def test_email_console_outbox():
    email.send_email(to="a@b.com", subject="Welcome", body="Hi")
    assert email.sent_outbox[-1]["subject"] == "Welcome"


def test_reengage_only_dormant(db_session):
    users = UserRepository(db_session)
    now = datetime.now(UTC)
    active, _ = users.get_or_create_by_phone(phone="+919100000201", name="Active")
    dormant, _ = users.get_or_create_by_phone(phone="+919100000202", name="Dormant")
    active.last_login_at = now - timedelta(days=1)
    dormant.last_login_at = now - timedelta(days=60)
    db_session.flush()

    n = reengage_dormant(db_session, now=now)
    assert n == 1
    db_session.refresh(dormant)
    db_session.refresh(active)
    assert dormant.re_engaged_at is not None
    assert active.re_engaged_at is None

    # idempotent within the window
    assert reengage_dormant(db_session, now=now) == 0
