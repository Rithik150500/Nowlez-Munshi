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


def test_back_resolution_skips_untranslatable_case_type(db_session, monkeypatch):
    """A PDF abbreviation absent from the case-type catalog is skipped, not queried
    with a bad type (regression: raw 'WP' was sent as the case_type)."""
    import nm_core.cause_lists as cl

    # An offline catalog that doesn't contain 'WP' → nothing resolves.
    monkeypatch.setattr(cl.ecourts, "hc_list_case_types",
                        lambda **kw: [])
    searched: list = []
    monkeypatch.setattr(cl.ecourts, "hc_search_case_number",
                        lambda **kw: searched.append(kw) or [])
    stats = index_hc_cause_lists(
        db_session, state_code="1", district_code="1", court_code="C1", sitting_date=SD,
    )
    assert stats["resolved"] == 0
    assert searched == []  # never queried with an untranslatable type


def test_back_resolution_requires_unique_match(db_session, monkeypatch):
    """An ambiguous (>1) case-number search must NOT bind a CNR (regression: hits[0])."""
    import nm_core.cause_lists as cl
    from nm_core.ecourts.models import CaseStub

    monkeypatch.setattr(cl.ecourts, "hc_list_case_types",
                        lambda **kw: cl.ecourts.offline.offline_list_case_types(
                            court_code=kw["court_code"]))
    monkeypatch.setattr(cl.ecourts, "hc_search_case_number", lambda **kw: [
        CaseStub(cnr="HCXX010000012026", title="A", case_number="WP/100/2026",
                 court="HC", filing_year=2026, stage="Adm"),
        CaseStub(cnr="HCXX010000022026", title="B", case_number="WP/100/2026",
                 court="HC", filing_year=2026, stage="Adm"),
    ])
    index_hc_cause_lists(
        db_session, state_code="1", district_code="1", court_code="C1", sitting_date=SD,
    )
    # both offline rows are 'WP' → ambiguous → none bound
    assert db_session.query(CauseListRow).filter(CauseListRow.cnr.is_not(None)).count() == 0
