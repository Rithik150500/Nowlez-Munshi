"""Use-case orchestrator: add/refresh a tracked case and fan out its changes.

Sits above the cases + notifications contexts (it imports both); nothing in those
contexts imports this, so there is no cycle. Apps (worker, bot, web) call these.
"""
from __future__ import annotations

import uuid
from dataclasses import dataclass

from sqlalchemy import select
from sqlalchemy.orm import Session

from nm_core import observability
from nm_core.cases import CasePreferenceRepository, CaseRepository, sync_case
from nm_core.cases.changes import Change
from nm_core.db.models.case import Case
from nm_core.db.models.manual_review import ManualReviewItem
from nm_core.db.models.notification import Notification
from nm_core.db.models.user import User
from nm_core.notifications import dispatch_changes


@dataclass
class RefreshResult:
    case: Case
    changes: list[Change]
    notifications: list[Notification]


def track_case(
    session: Session, *, user: User, cnr: str, added_via: str = "web"
) -> RefreshResult:
    """First add of a case: fetch + persist. No change alerts on the initial fetch."""
    case, changes = sync_case(session, user_id=user.id, cnr=cnr, added_via=added_via)
    return RefreshResult(case=case, changes=changes, notifications=[])


def refresh_case(session, *, user: User, cnr: str) -> RefreshResult:
    """Re-fetch a tracked case, detect changes, and dispatch notifications."""
    case, changes = sync_case(session, user_id=user.id, cnr=cnr)
    pref = CasePreferenceRepository(session).get(user.id, cnr)
    notifs = dispatch_changes(session, user=user, case=case, changes=changes, pref=pref)
    return RefreshResult(case=case, changes=changes, notifications=notifs)


def run_refresh_sweep(session: Session, *, limit: int = 100) -> dict[str, int]:
    """Refresh the next batch of due cases. Returns counts for observability."""
    cases_repo = CaseRepository(session)
    due = cases_repo.get_due_for_refresh(limit=limit)
    refreshed = 0
    changed = 0
    errored = 0
    skipped = 0
    user_cache: dict[uuid.UUID, User | None] = {}
    for case in due:
        user = user_cache.get(case.user_id)
        if user is None:
            user = session.get(User, case.user_id)
            user_cache[case.user_id] = user
        if user is None:
            continue
        if user.billing_suspended_at is not None:
            skipped += 1  # postpaid suspended for non-payment — don't refresh
            continue
        # Re-verify the case is still tracked right before firing: a user may have
        # /forgotten it after it was selected into this batch, and we must not spend
        # a notification (or a template) on a case they just dropped.
        if cases_repo.get_by_cnr(case.user_id, case.cnr) is None:
            skipped += 1
            continue
        try:
            result = refresh_case(session, user=user, cnr=case.cnr)
            refreshed += 1
            if result.changes:
                changed += 1
            if case.consecutive_failures:  # recovered — clear the failure streak
                case.consecutive_failures = 0
                session.flush()
        except Exception as e:  # noqa: BLE001 — one bad case must not stop the sweep
            errored += 1
            _record_failure(session, case, e)
    return {"refreshed": refreshed, "changed": changed, "errored": errored,
            "skipped": skipped, "due": len(due)}


# Escalation thresholds for repeatedly-failing cases (eCourts drift / persistent errors).
FAILURE_ALERT_THRESHOLD = 3   # surface to observability/Sentry
FAILURE_REVIEW_THRESHOLD = 5  # park in the operator manual-review queue


def _record_failure(session: Session, case: Case, exc: Exception) -> None:
    """Bump the case's consecutive-failure counter and escalate at the thresholds."""
    case.consecutive_failures = (case.consecutive_failures or 0) + 1
    n = case.consecutive_failures
    session.flush()
    if n == FAILURE_ALERT_THRESHOLD:
        observability.incr("ecourts.case.failing")
        observability.get_logger("nm_core.tracking").warning(
            "case %s has failed %d consecutive refreshes: %s", case.cnr, n, type(exc).__name__
        )
    if n >= FAILURE_REVIEW_THRESHOLD:
        _enqueue_manual_review(session, case, reason=type(exc).__name__, failure_count=n)


def _enqueue_manual_review(
    session: Session, case: Case, *, reason: str, failure_count: int
) -> None:
    """Upsert the single open manual-review row for this case."""
    existing = session.execute(
        select(ManualReviewItem).where(
            ManualReviewItem.case_id == case.id, ManualReviewItem.resolved_at.is_(None)
        )
    ).scalar_one_or_none()
    if existing is not None:
        existing.failure_count = failure_count
        existing.reason = reason
    else:
        session.add(
            ManualReviewItem(
                case_id=case.id, user_id=case.user_id, cnr=case.cnr,
                reason=reason, failure_count=failure_count,
            )
        )
    session.flush()
