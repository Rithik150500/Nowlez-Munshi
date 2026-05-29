"""Public eCourts API: fetch_case / fetch_pdf, with resilience + offline mode."""
from __future__ import annotations

from nm_core.config import get_settings
from nm_core.ecourts import offline
from nm_core.ecourts.models import (
    Case,
    CaseStub,
    CourtComplexRef,
    DistrictRef,
    PoliceStationRef,
    StateRef,
)
from nm_core.ecourts.resilience import with_circuit_breaker, with_retry, with_semaphore
from nm_core.ecourts.routing import classify_cnr


def get_client_for(cnr: str):
    if classify_cnr(cnr) == "district":
        from nm_core.ecourts.district import DistrictCourtClient

        return DistrictCourtClient()
    from nm_core.ecourts.highcourt import HighCourtClient

    return HighCourtClient()


def _compose(fn):
    s = get_settings()
    return with_semaphore(name="ecourts_global", max_concurrency=s.ECOURTS_MAX_CONCURRENCY)(
        with_circuit_breaker(
            name="ecourts_global",
            failure_threshold=s.ECOURTS_CIRCUIT_FAILURE_THRESHOLD,
            recovery_timeout=s.ECOURTS_CIRCUIT_RECOVERY_TIMEOUT_SECONDS,
        )(
            with_retry(
                max_attempts=s.ECOURTS_RETRY_MAX_ATTEMPTS,
                base_delay=s.ECOURTS_RETRY_BASE_DELAY_SECONDS,
            )(fn)
        )
    )


def _transport_fetch_case(cnr: str) -> Case:
    return get_client_for(cnr).fetch_case(cnr)


def _transport_fetch_pdf(url: str, cnr_hint: str | None) -> bytes:
    client = get_client_for(cnr_hint) if cnr_hint else get_client_for("DLHC010000002024")
    return client.fetch_pdf(url)


def fetch_case(cnr: str) -> Case:
    """Fetch a case by CNR (validates early; resilient; offline-aware)."""
    classify_cnr(cnr)  # validate before entering resilience (malformed != site failure)
    if get_settings().ECOURTS_OFFLINE:
        return offline.offline_fetch_case(cnr)
    return _compose(_transport_fetch_case)(cnr)


def fetch_pdf(url: str, cnr_hint: str | None = None) -> bytes:
    if get_settings().ECOURTS_OFFLINE:
        return offline.offline_fetch_pdf(url)
    return _compose(_transport_fetch_pdf)(url, cnr_hint)


# --- district-court search facade (dropdowns + party / case-number search) ---
def _district():
    from nm_core.ecourts.district import DistrictCourtClient

    return DistrictCourtClient()


def list_states() -> list[StateRef]:
    if get_settings().ECOURTS_OFFLINE:
        return offline.offline_list_states()
    return _compose(lambda: _district().list_states())()


def list_districts(state_code: str) -> list[DistrictRef]:
    if get_settings().ECOURTS_OFFLINE:
        return offline.offline_list_districts(state_code)
    return _compose(lambda: _district().list_districts(state_code))()


def list_court_complexes(*, state_code: str, district_code: str) -> list[CourtComplexRef]:
    if get_settings().ECOURTS_OFFLINE:
        return offline.offline_list_court_complexes(
            state_code=state_code, district_code=district_code
        )
    return _compose(
        lambda: _district().list_court_complexes(
            state_code=state_code, district_code=district_code
        )
    )()


def search_party(
    *, state_code: str, district_code: str, court_code_arr: str, party_name: str, year: int
) -> list[CaseStub]:
    if get_settings().ECOURTS_OFFLINE:
        return offline.offline_search_party(party_name=party_name, year=year)
    return _compose(
        lambda: _district().search_by_party_name(
            state_code=state_code, district_code=district_code,
            court_code_arr=court_code_arr, party_name=party_name, year=year,
        )
    )()


def search_case_number(
    *, state_code: str, district_code: str, court_code_arr: str,
    case_type: str, case_number: str, year: int,
) -> list[CaseStub]:
    if get_settings().ECOURTS_OFFLINE:
        return offline.offline_search_case_number(
            case_type=case_type, case_number=case_number, year=year
        )
    return _compose(
        lambda: _district().search_by_case_number(
            state_code=state_code, district_code=district_code,
            court_code_arr=court_code_arr, case_type=case_type,
            case_number=case_number, year=year,
        )
    )()


def list_police_stations(
    *, state_code: str, district_code: str, court_code: str
) -> list[PoliceStationRef]:
    if get_settings().ECOURTS_OFFLINE:
        return offline.offline_list_police_stations(
            state_code=state_code, district_code=district_code, court_code=court_code
        )
    return _compose(
        lambda: _district().list_police_stations(
            state_code=state_code, district_code=district_code, court_code=court_code
        )
    )()


def search_fir(
    *, state_code: str, district_code: str, court_code_arr: str,
    police_station_code: str, fir_number: str, year: int,
) -> list[CaseStub]:
    if get_settings().ECOURTS_OFFLINE:
        return offline.offline_search_by_fir(fir_number=fir_number, year=year)
    return _compose(
        lambda: _district().search_by_fir(
            state_code=state_code, district_code=district_code,
            court_code_arr=court_code_arr, police_station_code=police_station_code,
            fir_number=fir_number, year=year,
        )
    )()
