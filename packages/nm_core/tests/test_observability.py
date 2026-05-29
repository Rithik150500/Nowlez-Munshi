"""Observability: metrics registry + instrumentation of sends, AI mode, circuit."""
from __future__ import annotations

import fakeredis
import httpx
import pytest
import respx

from nm_core import observability
from nm_core.config import get_settings
from nm_core.ecourts.errors import CourtSiteDown
from nm_core.ecourts.resilience import reset_registries, with_circuit_breaker
from nm_core.messaging import redis_dedup, send_text


@pytest.fixture(autouse=True)
def _clean(monkeypatch):
    observability.reset()
    reset_registries()
    monkeypatch.setattr(redis_dedup, "_client", fakeredis.FakeStrictRedis())
    yield
    observability.reset()
    reset_registries()


def test_counters_and_snapshot():
    observability.incr("x")
    observability.incr("x", 2)
    observability.gauge("g", 5)
    snap = observability.snapshot()
    assert snap["counters"]["x"] == 3
    assert snap["gauges"]["g"] == 5


@respx.mock
def test_send_increments_metric(db_session, monkeypatch):
    monkeypatch.setattr(get_settings(), "WHATSAPP_DISABLED", False)
    from nm_core.messaging import MetaClient

    respx.post("https://graph.facebook.com/v21.0/PNID/messages").mock(
        return_value=httpx.Response(200, json={"messages": [{"id": "w1"}]})
    )
    send_text(db_session, to_phone="+9199", body="hi",
              client=MetaClient(phone_number_id="PNID", access_token="t"))
    assert observability.snapshot()["counters"]["whatsapp.send.sent"] == 1


def test_circuit_open_increments_metric():
    @with_circuit_breaker(name="obs", failure_threshold=1, recovery_timeout=60.0)
    def boom():
        raise CourtSiteDown("down")

    with pytest.raises(CourtSiteDown):
        boom()
    assert observability.snapshot()["counters"]["ecourts.circuit_open"] == 1
