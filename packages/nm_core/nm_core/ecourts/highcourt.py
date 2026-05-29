"""High court client: single-step CNR fetch (+ search, benches, states)."""
from __future__ import annotations

import time

from nm_core.ecourts import extra_parsers as xp
from nm_core.ecourts.errors import CNRNotFound
from nm_core.ecourts.models import BenchRef, Case, CaseStub, StateRef
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
