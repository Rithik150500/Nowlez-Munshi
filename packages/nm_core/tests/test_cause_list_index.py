"""HC cause-list indexer + CNR back-resolution (offline)."""
from __future__ import annotations

from datetime import date

import pytest

from nm_core.cause_lists import index_hc_cause_lists, parse_case_number
from nm_core.config import get_settings
from nm_core.db.models.cause_list import CauseListRow

SD = date(2026, 6, 1)


@pytest.fixture(autouse=True)
def offline(monkeypatch):
    monkeypatch.setattr(get_settings(), "ECOURTS_OFFLINE", True)


@pytest.mark.parametrize("text,expected", [
    ("WP/100/2026", ("WP", "100", 2026)),
    ("CRL.A/42/2025", ("CRL.A", "42", 2025)),
    ("W.P - 12 - 2024", ("W.P", "12", 2024)),
    ("garbage", None),
    ("", None),
])
def test_parse_case_number(text, expected):
    assert parse_case_number(text) == expected


def test_index_stores_rows_and_back_resolves(db_session):
    stats = index_hc_cause_lists(
        db_session, state_code="1", district_code="1", court_code="C1", sitting_date=SD,
    )
    assert stats["benches"] == 1
    assert stats["stored"] == 2  # two offline PDF rows
    assert stats["resolved"] == 2  # both case numbers resolved to a CNR

    rows = db_session.query(CauseListRow).order_by(CauseListRow.sr_no).all()
    assert [r.case_number for r in rows] == ["WP/100/2026", "WP/200/2026"]
    assert all(r.cnr and len(r.cnr) == 16 for r in rows)  # back-resolved CNRs


def test_index_is_idempotent(db_session):
    first = index_hc_cause_lists(
        db_session, state_code="1", district_code="1", court_code="C1", sitting_date=SD,
    )
    assert first["stored"] == 2
    second = index_hc_cause_lists(
        db_session, state_code="1", district_code="1", court_code="C1", sitting_date=SD,
    )
    assert second["stored"] == 0  # re-index upserts, no duplicate rows
    assert db_session.query(CauseListRow).count() == 2
