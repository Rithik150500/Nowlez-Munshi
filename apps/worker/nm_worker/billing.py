"""Daily billing crons. Run: ``python -m nm_worker.billing``.

Runs the three idempotent billing operations in one pass:
  - generate today's due Munshi postpaid invoices
  - suspend users whose unpaid invoice passed its grace window
  - expire lapsed Nowlez trials (day-31 fallback to free)
All are safe to re-run (idempotent), so a missed day self-heals on the next run.
"""
from __future__ import annotations

import logging

from nm_core.billing import expire_lapsed_trials
from nm_core.billing.munshi import generate_due_invoices, run_grace_suspension
from nm_core.db.engine import session_scope

logger = logging.getLogger("nm_worker.billing")


def run_once() -> dict[str, int]:
    with session_scope() as session:
        invoiced = generate_due_invoices(session)
        suspended = run_grace_suspension(session)["suspended"]
        expired = expire_lapsed_trials(session)
    stats = {"invoiced": invoiced, "suspended": suspended, "trials_expired": expired}
    logger.info("billing cron: %s", stats)
    return stats


def main() -> None:
    logging.basicConfig(level=logging.INFO)
    run_once()


if __name__ == "__main__":
    main()
