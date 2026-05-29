"""Worker sweep: thin wrapper delegates to run_refresh_sweep; --loop runs once cleanly."""
from __future__ import annotations

from nm_worker import sweep


def test_sweep_once_delegates(monkeypatch):
    captured = {}

    def _fake(session, *, limit):
        captured["limit"] = limit
        return {"ok": 1}

    monkeypatch.setattr(sweep, "run_refresh_sweep", _fake)
    out = sweep.sweep_once(object(), limit=42)
    assert out == {"ok": 1}
    assert captured["limit"] == 42


def test_main_runs_once(monkeypatch):
    calls = {"n": 0}
    monkeypatch.setattr(sweep, "run_once", lambda *, limit: calls.update(n=calls["n"] + 1))
    sweep.main([])  # no --loop → single run
    assert calls["n"] == 1
