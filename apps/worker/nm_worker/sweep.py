"""The refresh sweep: re-fetch due cases and fan out changes.

Run once (cron-friendly): ``python -m nm_worker.sweep``
Run continuously:        ``python -m nm_worker.sweep --loop --interval 900``
"""
from __future__ import annotations

import argparse
import logging
import time

from sqlalchemy.orm import Session

from nm_core.db.engine import session_scope
from nm_core.tracking import run_refresh_sweep

logger = logging.getLogger("nm_worker.sweep")


def sweep_once(session: Session, *, limit: int = 100) -> dict[str, int]:
    return run_refresh_sweep(session, limit=limit)


def run_once(*, limit: int = 100) -> dict[str, int]:
    with session_scope() as session:
        counts = sweep_once(session, limit=limit)
    logger.info("refresh sweep: %s", counts)
    return counts


def main(argv: list[str] | None = None) -> None:
    parser = argparse.ArgumentParser(description="Nowlez Munshi refresh sweep")
    parser.add_argument("--loop", action="store_true", help="run continuously")
    parser.add_argument("--interval", type=int, default=900, help="seconds between sweeps")
    parser.add_argument("--limit", type=int, default=100, help="cases per sweep")
    args = parser.parse_args(argv)

    logging.basicConfig(level=logging.INFO)
    if not args.loop:
        run_once(limit=args.limit)
        return
    while True:
        try:
            run_once(limit=args.limit)
        except Exception:  # noqa: BLE001 — keep the loop alive across transient failures
            logger.exception("sweep iteration failed")
        time.sleep(args.interval)


if __name__ == "__main__":
    main()
