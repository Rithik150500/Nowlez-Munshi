"""District court client: CNR fetch, search, dropdowns, cause-list, daily business."""
from __future__ import annotations

import time
from datetime import date

from nm_core.ecourts import extra_parsers as xp
from nm_core.ecourts.errors import CNRNotFound
from nm_core.ecourts.models import (
    Case,
    CaseStub,
    CaseTypeRef,
    CauseList,
    CourtComplexRef,
    DailyBusiness,
    DistrictRef,
    PoliceStationRef,
    StateRef,
)
from nm_core.ecourts.parsers import parse_case_history
from nm_core.ecourts.pdf import fetch_pdf
from nm_core.ecourts.session import Session

_ENG = {"language_flag": "english", "bilingual_flag": "0"}
_PENDING = {"Pending", "Disposed", "Both"}


class DistrictCourtClient:
    scope = "district"

    def __init__(self) -> None:
        self._session = Session(scope="district")

    def fetch_case(self, cnr: str) -> Case:
        list_resp = self._session.call(
            "listOfCasesWebService.php",
            {
                "cino": cnr,
                "version_number": "3.0",
                "language_flag": "english",
                "bilingual_flag": "0",
            },
        )
        case_number = list_resp.get("case_number")
        if case_number:
            history_resp = self._session.call(
                "caseHistoryWebService.php",
                {"cinum": cnr, "language_flag": "english", "bilingual_flag": "0"},
            )
        else:
            history_resp = self._session.call(
                "filingCaseHistory.php",
                {"cino": cnr, "language_flag": "english", "bilingual_flag": "0"},
            )
        if not history_resp.get("history"):
            raise CNRNotFound(cnr=cnr)
        return parse_case_history(history_resp, cnr=cnr)

    def fetch_pdf(self, url: str) -> bytes:
        return fetch_pdf(self._session._http, url)

    # --- dropdowns ---
    def list_states(self) -> list[StateRef]:
        resp = self._session.call(
            "stateWebService.php", {"action_code": "fillState", "time": str(time.time())}
        )
        return xp.parse_states(resp)

    def list_districts(self, state_code: str) -> list[DistrictRef]:
        resp = self._session.call(
            "districtWebService.php", {"state_code": str(state_code), "test_param": "pending"}
        )
        return xp.parse_districts(resp, state_code=str(state_code))

    def list_court_complexes(
        self, *, state_code: str, district_code: str
    ) -> list[CourtComplexRef]:
        resp = self._session.call(
            "courtEstWebService.php",
            {"action_code": "fillCourtComplex", "state_code": str(state_code),
             "dist_code": str(district_code)},
        )
        return xp.parse_court_complexes(
            resp, state_code=str(state_code), district_code=str(district_code)
        )

    def list_case_types(
        self, *, state_code: str, district_code: str, court_code: str
    ) -> list[CaseTypeRef]:
        resp = self._session.call(
            "caseNumberWebService.php",
            {"state_code": str(state_code), "dist_code": str(district_code),
             "court_code": str(court_code), **_ENG},
        )
        return xp.parse_case_types(resp, court_code=str(court_code))

    def list_police_stations(
        self, *, state_code: str, district_code: str, court_code: str
    ) -> list[PoliceStationRef]:
        resp = self._session.call(
            "policeStationWebService.php",
            {"state_code": str(state_code), "dist_code": str(district_code),
             "court_code": str(court_code), **_ENG},
        )
        return xp.parse_police_stations(
            resp, district_code=str(district_code), court_code=str(court_code)
        )

    # --- search ---
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

    def search_by_fir(
        self, *, state_code: str, district_code: str, court_code_arr: str,
        police_station_code: str, fir_number: str, year: int,
        uniform_code: int = 0, pending_disposed: str = "Pending",
    ) -> list[CaseStub]:
        if pending_disposed not in _PENDING:
            raise ValueError(f"pending_disposed must be one of {_PENDING}")
        resp = self._session.call(
            "firNumberSearch.php",
            {"state_code": str(state_code), "dist_code": str(district_code),
             "court_code_arr": str(court_code_arr), "police_stationcode": str(police_station_code),
             "firNumber": str(fir_number), "year": str(year), "pendingDisposed": pending_disposed,
             "uniform_code": str(uniform_code), **_ENG},
        )
        return xp.parse_fir_search(resp)

    # --- cause list & daily business ---
    def fetch_cause_list(
        self, *, state_code: str, district_code: str, court_code: str, court_no: str,
        list_date: date, civil_or_criminal: str = "civ_t", today: date | None = None,
    ) -> CauseList:
        if civil_or_criminal not in {"civ_t", "cri_t"}:
            raise ValueError("civil_or_criminal must be civ_t|cri_t")
        sel_prev = "1" if list_date < (today or date.today()) else "0"
        resp = self._session.call(
            "cases_new.php",
            {"state_code": str(state_code), "dist_code": str(district_code),
             "flag": civil_or_criminal, "selprevdays": sel_prev, "court_no": str(court_no),
             "court_code": str(court_code), "causelist_date": list_date.strftime("%d-%m-%Y"),
             **_ENG},
        )
        return xp.parse_cause_list(
            resp, state_code=str(state_code), district_code=str(district_code),
            court_code=str(court_code), court_no=str(court_no), list_date=list_date,
            flag=civil_or_criminal,
        )

    def fetch_daily_business(
        self, *, cnr: str, case_number: str, court_code: str, court_no: str,
        district_code: str, state_code: str, business_date: date, next_hearing_date: date,
        disposal_flag: str = "Pending",
    ) -> DailyBusiness:
        resp = self._session.call(
            "s_show_business.php",
            {"court_code": str(court_code), "dist_code": str(district_code),
             "nextdate1": next_hearing_date.strftime("%Y%m%d"), "case_number1": str(case_number),
             "state_code": str(state_code), "disposal_flag": disposal_flag,
             "businessDate": business_date.strftime("%d-%m-%Y"), "court_no": str(court_no), **_ENG},
        )
        return xp.parse_daily_business(resp, cnr=cnr, business_date=business_date)
