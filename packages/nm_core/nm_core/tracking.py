"""Use-case orchestrator: add/refresh a tracked case and fan out its changes.

Sits above the cases + notifications contexts (it imports both); nothing in those
contexts imports this, so there is no cycle. Apps (worker, bot, web) call these.
"""
from __future__ import annotations

import uuid
from dataclasses import dataclass

from sqlalchemy.orm import Session

from nm_core.cases import CasePreferenceRepository, CaseRepository, sync_case
from nm_core.cases.changes import Change
from nm_core.db.models.case import Case
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
    due = CaseRepository(session).get_due_for_refresh(limit=limit)
    refreshed = 0
    changed = 0
    errored = 0
    user_cache: dict[uuid.UUID, User | None] = {}
    for case in due:
        user = user_cache.get(case.user_id)
        if user is None:
            user = session.get(User, case.user_id)
            user_cache[case.user_id] = user
        if user is None:
            continue
        try:
            result = refresh_case(session, user=user, cnr=case.cnr)
            refreshed += 1
            if result.changes:
                changed += 1
        except Exception:  # noqa: BLE001 — one bad case must not stop the sweep
            errored += 1
    return {"refreshed": refreshed, "changed": changed, "errored": errored, "due": len(due)}
