"""Nightly hearing-digest cron. Run: ``python -m nm_worker.digest``."""
from __future__ import annotations

import logging

from nm_core.db.engine import session_scope
from nm_core.digests import send_tomorrow_digests

logger = logging.getLogger("nm_worker.digest")


def run_once() -> int:
    with session_scope() as session:
        n = send_tomorrow_digests(session)
    logger.info("sent %d tomorrow-hearing digest(s)", n)
    return n


def main() -> None:
    logging.basicConfig(level=logging.INFO)
    run_once()


if __name__ == "__main__":
    main()
