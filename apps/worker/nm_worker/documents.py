"""Process pending order documents (store + summarize). Cron-friendly.

Run once:  ``python -m nm_worker.documents``
"""
from __future__ import annotations

import logging

from nm_core import documents
from nm_core.db.engine import session_scope

logger = logging.getLogger("nm_worker.documents")


def run_once(*, limit: int = 50) -> int:
    with session_scope() as session:
        n = documents.process_pending(session, limit=limit)
    logger.info("processed %d pending order(s)", n)
    return n


def main() -> None:
    logging.basicConfig(level=logging.INFO)
    run_once()


if __name__ == "__main__":
    main()
