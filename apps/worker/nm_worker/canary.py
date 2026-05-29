"""eCourts canary: periodically fetch a known CNR to detect NIC schema drift / outages.

Run: ``python -m nm_worker.canary``  (emits ecourts.canary.* / ecourts.schema_changed).
"""
from __future__ import annotations

import logging

from nm_core import ecourts, observability
from nm_core.ecourts.errors import ECourtsError, SchemaChanged

logger = logging.getLogger("nm_worker.canary")

# A well-known, long-lived CNR (override via arg in prod).
_CANARY_CNR = "DLND010000012024"


def run_once(cnr: str = _CANARY_CNR) -> dict:
    try:
        ecourts.fetch_case(cnr)
    except SchemaChanged as e:
        observability.incr("ecourts.schema_changed")
        logger.error("eCourts schema drift on canary: %s", e)
        return {"ok": False, "schema_changed": True}
    except ECourtsError as e:
        observability.incr("ecourts.canary.error")
        logger.warning("eCourts canary error: %s", type(e).__name__)
        return {"ok": False, "error": type(e).__name__}
    observability.incr("ecourts.canary.ok")
    return {"ok": True}


def main() -> None:
    logging.basicConfig(level=logging.INFO)
    logger.info("canary: %s", run_once())


if __name__ == "__main__":
    main()
