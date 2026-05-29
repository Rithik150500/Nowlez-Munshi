"""R3: the Prometheus /metrics endpoint exposes the registry."""
from __future__ import annotations

from nm_core import observability


def test_metrics_endpoint(client):
    observability.incr("test.metric", 7)
    r = client.get("/metrics")
    assert r.status_code == 200
    assert "text/plain" in r.headers["content-type"]
    assert "nm_test_metric 7" in r.text
