"""Offline mode: deterministic synthetic cases for dev/tests (no live portal).

Tests register specific cases per CNR (and mutate them across refreshes to exercise
change detection); anything unregistered returns a stable synthetic case.
"""
from __future__ import annotations

from datetime import date, timedelta

from nm_core.ecourts.models import (
    Act,
    Case,
    CaseStub,
    CourtComplexRef,
    DistrictRef,
    HearingHistoryRow,
    OrderRef,
    Party,
    StateRef,
)
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


# --- search & dropdowns (deterministic synthetic data for dev/tests) ---
def offline_list_states() -> list[StateRef]:
    return [
        StateRef(code="1", name="Demo State", national_code="DL"),
        StateRef(code="2", name="Other State", national_code="MH"),
    ]


def offline_list_districts(state_code: str) -> list[DistrictRef]:
    return [DistrictRef(code="1", name="Demo District", state_code=str(state_code))]


def offline_list_court_complexes(*, state_code: str, district_code: str) -> list[CourtComplexRef]:
    return [
        CourtComplexRef(
            code="1", name="Demo Court Complex", state_code=str(state_code),
            district_code=str(district_code), est_code="DLND01",
        )
    ]


def offline_search_party(*, party_name: str, year: int) -> list[CaseStub]:
    # 16-char CNRs (6-char establishment + 6 digits + 4-digit year), as fetch_case expects.
    name = party_name.strip() or "Synthetic"
    return [
        CaseStub(
            cnr=f"DLND01{i:06d}{year}", title=f"{name} vs State",
            case_number=f"CC/{100 + i}/{year}", court="Demo District Court",
            filing_year=year, stage="Appearance",
        )
        for i in range(1, 3)
    ]


def offline_search_case_number(*, case_type: str, case_number: str, year: int) -> list[CaseStub]:
    digits = int(case_number) if case_number.isdigit() else 1
    return [
        CaseStub(
            cnr=f"DLND01{digits:06d}{year}",
            title="Synthetic Petitioner vs State",
            case_number=f"{case_type}/{case_number}/{year}", court="Demo District Court",
            filing_year=year, stage="Appearance",
        )
    ]
