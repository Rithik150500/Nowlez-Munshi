"""Worker billing cron: thin wrapper orchestrates the three billing operations."""
from __future__ import annotations

from contextlib import contextmanager

from nm_worker import billing


def test_run_once_aggregates(monkeypatch):
    @contextmanager
    def _fake_scope():
        yield object()

    monkeypatch.setattr(billing, "session_scope", _fake_scope)
    monkeypatch.setattr(billing, "generate_due_invoices", lambda s: 3)
    monkeypatch.setattr(billing, "run_grace_suspension", lambda s: {"suspended": 2})
    monkeypatch.setattr(billing, "expire_lapsed_trials", lambda s: 1)

    assert billing.run_once() == {"invoiced": 3, "suspended": 2, "trials_expired": 1}


def test_main_runs_once(monkeypatch):
    calls = {"n": 0}
    monkeypatch.setattr(billing, "run_once", lambda: calls.update(n=calls["n"] + 1))
    billing.main()
    assert calls["n"] == 1
