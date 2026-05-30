"""Daily lifecycle-drip cron. Run: ``python -m nm_worker.drip``.

Idempotent within a day (cursor + catch_up_sent_at), so a missed run self-heals."""
from __future__ import annotations

import logging

from nm_core.db.engine import session_scope
from nm_core.drip import evaluate_drip

logger = logging.getLogger("nm_worker.drip")


def run_once() -> int:
    with session_scope() as session:
        n = evaluate_drip(session)
    logger.info("drip: sent %d email(s)", n)
    return n


def main() -> None:
    logging.basicConfig(level=logging.INFO)
    run_once()


if __name__ == "__main__":
    main()
