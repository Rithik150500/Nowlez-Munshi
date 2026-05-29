"""RQ outbound queue: producer dedup/enqueue + the job's raw delivery."""
from __future__ import annotations

from contextlib import contextmanager

import fakeredis
import httpx
import pytest
import respx

from nm_core.config import get_settings
from nm_core.db.models.messaging import OutboundMessage
from nm_core.messaging import enqueue_send_text, jobs, queue, redis_dedup

GRAPH = "https://graph.facebook.com/v21.0/PNID/messages"


class _FakeQueue:
    def __init__(self):
        self.jobs = []

    def enqueue(self, fn, **kwargs):
        kwargs.pop("retry", None)
        self.jobs.append((fn, kwargs))


@pytest.fixture(autouse=True)
def env(monkeypatch):
    monkeypatch.setattr(get_settings(), "WHATSAPP_DISABLED", False)
    monkeypatch.setattr(get_settings(), "META_PHONE_NUMBER_ID", "PNID")
    monkeypatch.setattr(get_settings(), "META_ACCESS_TOKEN", "tok")
    monkeypatch.setattr(redis_dedup, "_client", fakeredis.FakeStrictRedis())
    yield
    monkeypatch.setattr(redis_dedup, "_client", None)


@pytest.fixture
def fake_queue(monkeypatch):
    q = _FakeQueue()
    monkeypatch.setattr(queue, "_queue", lambda: q)
    return q


# --- producer (enqueue + dedup + kill-switch) ---
def test_enqueue_records_job(fake_queue):
    assert enqueue_send_text(to_phone="+9199", body="hello") is True
    assert len(fake_queue.jobs) == 1
    fn, kw = fake_queue.jobs[0]
    assert fn is jobs.do_send_text and kw["body"] == "hello"


def test_enqueue_dedups_at_producer(fake_queue):
    key = "u:c:status:2026-05-29"
    assert enqueue_send_text(to_phone="+9199", body="x", dedup_key=key) is True
    assert enqueue_send_text(to_phone="+9199", body="x", dedup_key=key) is False
    assert len(fake_queue.jobs) == 1  # second was deduped before enqueue


def test_kill_switch_blocks_enqueue(fake_queue, monkeypatch):
    monkeypatch.setattr(get_settings(), "WHATSAPP_DISABLED", True)
    assert enqueue_send_text(to_phone="+9199", body="x") is False
    assert fake_queue.jobs == []


# --- job (raw delivery, no dedup, transient propagates for RQ retry) ---
@respx.mock
def test_job_delivers_and_logs(db_session, monkeypatch):
    @contextmanager
    def _scope():
        yield db_session

    monkeypatch.setattr(jobs, "session_scope", _scope)
    respx.post(GRAPH).mock(return_value=httpx.Response(200, json={"messages": [{"id": "w.j"}]}))
    assert jobs.do_send_text(to_phone="+9199", body="hi") == "w.j"
    assert db_session.query(OutboundMessage).filter_by(status="sent").count() == 1


@respx.mock
def test_job_retries_transient(db_session, monkeypatch):
    from nm_core.messaging.errors import MetaTransientError

    @contextmanager
    def _scope():
        yield db_session

    monkeypatch.setattr(jobs, "session_scope", _scope)
    respx.post(GRAPH).mock(return_value=httpx.Response(503, text="down"))
    # Transient errors propagate so RQ retries (not swallowed).
    with pytest.raises(MetaTransientError):
        jobs.do_send_text(to_phone="+9199", body="hi")
