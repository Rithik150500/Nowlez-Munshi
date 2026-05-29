"""Public eCourts API: fetch_case / fetch_pdf, with resilience + offline mode."""
from __future__ import annotations

from nm_core.config import get_settings
from nm_core.ecourts import offline
from nm_core.ecourts.models import Case
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
