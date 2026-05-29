"""High court client: single-step CNR fetch (+ search, benches, states, cause lists)."""
from __future__ import annotations

import time
from datetime import date

from nm_core.ecourts import extra_parsers as xp
from nm_core.ecourts.cause_list_hc import (
    parse_hc_bench_sittings,
    parse_hc_cause_list_index,
    parse_hc_cause_list_pdf,
)
from nm_core.ecourts.errors import CNRNotFound
from nm_core.ecourts.models import (
    BenchRef,
    Case,
    CaseStub,
    HCBenchSitting,
    HCCauseListIndex,
    HCCauseListPDFRow,
    StateRef,
)
from nm_core.ecourts.parsers import parse_case_history
from nm_core.ecourts.pdf import fetch_pdf
from nm_core.ecourts.session import Session

_ENG = {"language_flag": "english", "bilingual_flag": "0"}
_PENDING = {"Pending", "Disposed", "Both"}


class HighCourtClient:
    scope = "highcourt"

    def __init__(self) -> None:
        self._session = Session(scope="highcourt")

    def fetch_case(self, cnr: str) -> Case:
        response = self._session.call("caseHistoryWebService.php", {"cino": cnr})
        if not response.get("history"):
            raise CNRNotFound(cnr=cnr)
        return parse_case_history(response, cnr=cnr)

    def fetch_pdf(self, url: str) -> bytes:
        return fetch_pdf(self._session._http, url)

    def list_states(self) -> list[StateRef]:
        resp = self._session.call(
            "stateWebService.php", {"action_code": "fillState", "time": str(time.time())}
        )
        return xp.parse_states(resp)

    def list_hc_benches(self, state_code: str) -> list[BenchRef]:
        resp = self._session.call(
            "districtWebService.php",
            {"state_code": str(state_code), "test_param": "pending", "action_code": "benches"},
        )
        return xp.parse_hc_benches(resp, state_code=str(state_code))

    def search_by_party_name(
        self, *, state_code: str, district_code: str, court_code_arr: str,
        party_name: str, year: int, pending_disposed: str = "Pending",
    ) -> list[CaseStub]:
        if pending_disposed not in _PENDING:
            raise ValueError(f"pending_disposed must be one of {_PENDING}")
        resp = self._session.call(
            "showDataWebService.php",
            {"state_code": str(state_code), "dist_code": str(district_code),
             "court_code_arr": str(court_code_arr), "pet_name": party_name,
             "pendingDisposed": pending_disposed, "year": str(year), **_ENG},
        )
        return xp.parse_party_search(resp)

    def search_by_case_number(
        self, *, state_code: str, district_code: str, court_code_arr: str,
        case_type: str, case_number: str, year: int,
    ) -> list[CaseStub]:
        resp = self._session.call(
            "caseNumberSearch.php",
            {"state_code": str(state_code), "dist_code": str(district_code),
             "court_code_arr": str(court_code_arr), "case_number": str(case_number),
             "case_type": str(case_type), "year": str(year), **_ENG},
        )
        return xp.parse_case_number_search(resp)

    # --- cause lists ---
    def list_bench_sittings(
        self, *, state_code: str, district_code: str, court_code: str, sitting_date: date
    ) -> list[HCBenchSitting]:
        """Benches sitting on a date (empty on holidays / non-sitting days)."""
        resp = self._session.call(
            "causeListBenchWebService.php",
            {"state_code": str(state_code), "dist_code": str(district_code),
             "court_code": str(court_code), "date": sitting_date.strftime("%d-%m-%Y")},
        )
        return parse_hc_bench_sittings(resp, state_code=str(state_code), sitting_date=sitting_date)

    def fetch_cause_list_index(
        self, *, state_code: str, district_code: str, court_code: str,
        bench_id: str, list_date: date, today: date | None = None,
    ) -> list[HCCauseListIndex]:
        """The cause-list index for a bench on a date; each row points to a PDF."""
        sel_prev = "1" if list_date < (today or date.today()) else "0"
        resp = self._session.call(
            "cases_new.php",
            {"state_code": str(state_code), "dist_code": str(district_code),
             "selprevdays": sel_prev, "court_code": str(court_code),
             "causelist_date": list_date.strftime("%d-%m-%Y"), "bench_id": str(bench_id)},
        )
        return parse_hc_cause_list_index(resp)

    def fetch_cause_list_pdf_rows(self, *, pdf_url: str) -> list[HCCauseListPDFRow]:
        """Download a cause-list PDF and extract its rows (position-based, best-effort)."""
        return parse_hc_cause_list_pdf(fetch_pdf(self._session._http, pdf_url))
