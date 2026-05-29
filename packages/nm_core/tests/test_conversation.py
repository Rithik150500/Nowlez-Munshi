"""Per-user conversation-state store (Redis, fail-open)."""
from __future__ import annotations

import uuid

import fakeredis
import pytest

from nm_core import conversation
from nm_core.messaging import redis_dedup


@pytest.fixture(autouse=True)
def fake_redis(monkeypatch):
    monkeypatch.setattr(redis_dedup, "_client", fakeredis.FakeStrictRedis())
    yield
    monkeypatch.setattr(redis_dedup, "_client", None)


def test_set_get_clear_roundtrip():
    uid = uuid.uuid4()
    assert conversation.get_state(uid) is None
    conversation.set_state(uid, {"flow": "search", "step": "state"})
    assert conversation.get_state(uid) == {"flow": "search", "step": "state"}
    conversation.clear_state(uid)
    assert conversation.get_state(uid) is None


def test_set_overwrites():
    uid = uuid.uuid4()
    conversation.set_state(uid, {"step": "state"})
    conversation.set_state(uid, {"step": "district", "state_code": "1"})
    assert conversation.get_state(uid) == {"step": "district", "state_code": "1"}


def test_fail_open_when_redis_down(monkeypatch):
    class _Broken:
        def get(self, *a, **k):
            raise ConnectionError("down")

    monkeypatch.setattr(redis_dedup, "_client", _Broken())
    # No active flow reported, rather than raising into the webhook handler.
    assert conversation.get_state(uuid.uuid4()) is None
