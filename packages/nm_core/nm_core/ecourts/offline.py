"""Offline mode: deterministic synthetic cases for dev/tests (no live portal).

Tests register specific cases per CNR (and mutate them across refreshes to exercise
change detection); anything unregistered returns a stable synthetic case.
"""
from __future__ import annotations

from datetime import date, timedelta

from nm_core.ecourts.models import Act, Case, HearingHistoryRow, OrderRef, Party
from nm_core.ecourts.routing import classify_cnr, validate_cnr_shape

_OFFLINE_CASES: dict[str, Case] = {}


def register_offline_case(cnr: str, case: Case) -> None:
    _OFFLINE_CASES[cnr] = case


def clear_offline_cases() -> None:
    _OFFLINE_CASES.clear()


def _synthetic_case(cnr: str) -> Case:
    scope = classify_cnr(cnr)
    court = "Demo High Court" if scope == "highcourt" else "Demo District Court, Demo, Demo State"
    today = date(2026, 5, 29)
    return Case(
        cnr=cnr,
        title="Synthetic Petitioner vs State",
        court=court,
        stage="Appearance",
        next_hearing_date=today + timedelta(days=30),
        judge="Demo J",
        parties=[
            Party(name="Synthetic Petitioner", role="petitioner", advocate="Adv. A"),
            Party(name="State", role="respondent", advocate="Adv. B"),
        ],
        acts=[Act(act_name="Indian Penal Code", section="420")],
        history=[HearingHistoryRow(hearing_date=today, purpose="Appearance", judge="Demo J")],
        orders=[
            OrderRef(order_date=today, order_url="https://example.test/order1.pdf", order_id="1")
        ],
    )


def offline_fetch_case(cnr: str) -> Case:
    validate_cnr_shape(cnr)
    return _OFFLINE_CASES.get(cnr) or _synthetic_case(cnr)


def offline_fetch_pdf(url: str) -> bytes:
    return b"%PDF-1.4 synthetic offline pdf\n%%EOF\n"
