"""High court client: single-step CNR resolution (caseHistory with {cino})."""
from __future__ import annotations

from nm_core.ecourts.errors import CNRNotFound
from nm_core.ecourts.models import Case
from nm_core.ecourts.parsers import parse_case_history
from nm_core.ecourts.pdf import fetch_pdf
from nm_core.ecourts.session import Session


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
