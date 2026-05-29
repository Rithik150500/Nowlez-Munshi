"""sync_case: fetch from eCourts, diff against the stored snapshot, upsert row + orders."""
from __future__ import annotations

import json
import uuid
from datetime import UTC, datetime

from sqlalchemy.orm import Session

from nm_core import ecourts
from nm_core.cases.changes import Change, detect_changes
from nm_core.cases.repository import CaseRepository
from nm_core.db.models.case import Case
from nm_core.ecourts.models import Case as FetchedCase
from nm_core.ecourts.routing import classify_cnr


def _utcnow() -> datetime:
    return datetime.now(UTC)


def _snapshot_to_fetched(snapshot: dict) -> FetchedCase:
    return FetchedCase.from_json(json.dumps(snapshot))


def sync_case(
    session: Session, *, user_id: uuid.UUID, cnr: str, added_via: str = "web"
) -> tuple[Case, list[Change]]:
    """Fetch + persist a case. Returns the row and the list of detected changes.

    On first fetch there is nothing to diff, so ``changes`` is empty.
    """
    fetched = ecourts.fetch_case(cnr)
    repo = CaseRepository(session)
    existing = repo.get_by_cnr(user_id, cnr)

    changes: list[Change] = []
    if existing is not None and existing.raw_response:
        changes = detect_changes(_snapshot_to_fetched(existing.raw_response), fetched)

    snapshot = json.loads(fetched.to_json())
    now = _utcnow()

    case = existing
    if case is None:
        case = Case(user_id=user_id, cnr=cnr, added_via=added_via)
        session.add(case)

    case.portal = classify_cnr(cnr)
    case.title = fetched.title
    case.court = fetched.court
    case.judge = fetched.judge
    case.stage = fetched.stage
    case.next_hearing_date = fetched.next_hearing_date
    case.parties = snapshot["parties"]
    case.acts = snapshot["acts"]
    case.history = snapshot["history"]
    case.raw_response = snapshot
    case.last_refreshed_at = now
    if changes:
        case.last_change_at = now
    session.flush()

    for ref in fetched.orders:
        repo.upsert_order(case.id, ref)
    session.flush()

    return case, changes
