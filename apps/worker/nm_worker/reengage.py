"""Re-engagement cron: nudge dormant users. Run once: ``python -m nm_worker.reengage``."""
from __future__ import annotations

import logging

from nm_core.db.engine import session_scope
from nm_core.growth import reengage_dormant

logger = logging.getLogger("nm_worker.reengage")


def run_once() -> int:
    with session_scope() as session:
        n = reengage_dormant(session)
    logger.info("re-engaged %d dormant user(s)", n)
    return n


def main() -> None:
    logging.basicConfig(level=logging.INFO)
    run_once()


if __name__ == "__main__":
    main()
