"""District court client: two-step CNR resolution (listOfCases → caseHistory/filing)."""
from __future__ import annotations

from nm_core.ecourts.errors import CNRNotFound
from nm_core.ecourts.models import Case
from nm_core.ecourts.parsers import parse_case_history
from nm_core.ecourts.pdf import fetch_pdf
from nm_core.ecourts.session import Session


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
