"""Case endpoints: the unified case book, add/track, detail, refresh, prefs."""
from __future__ import annotations

from datetime import UTC, datetime, timedelta

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session

from nm_core import tracking
from nm_core.cases import CasePreferenceRepository, CaseRepository
from nm_core.cases.changes import Change
from nm_core.db.models.user import User
from nm_core.ecourts.errors import CNRMalformed, CNRNotFound, ECourtsError
from nm_core.teams import accessible_user_ids
from nm_web import serializers
from nm_web.deps import get_current_user, get_db

router = APIRouter(prefix="/api/cases", tags=["cases"])


class AddBody(BaseModel):
    cnr: str


class PrefsBody(BaseModel):
    alert_level: str | None = None
    digest_enabled: bool | None = None
    snooze_days: int | None = None
    label: str | None = None


def _changes(changes: list[Change]) -> list[dict]:
    return [{"type": c.type, "summary": c.summary, "detail": c.detail} for c in changes]


@router.get("")
def list_cases(user: User = Depends(get_current_user), db: Session = Depends(get_db)) -> dict:
    # Team-aware: the chamber's shared case book (own + co-members'), each flagged `mine`.
    visible = accessible_user_ids(db, user)
    cases = CaseRepository(db).list_visible(visible)
    return {
        "cases": [{**serializers.case_summary(c), "mine": c.user_id == user.id} for c in cases]
    }


@router.post("")
def add_case(
    body: AddBody, user: User = Depends(get_current_user), db: Session = Depends(get_db)
) -> dict:
    cnr = body.cnr.strip().upper()
    try:
        result = tracking.track_case(db, user=user, cnr=cnr, added_via="web")
    except CNRMalformed as e:
        raise HTTPException(status_code=422, detail=str(e)) from e
    except CNRNotFound as e:
        raise HTTPException(status_code=404, detail=str(e)) from e
    except ECourtsError as e:
        raise HTTPException(status_code=502, detail=f"eCourts error: {type(e).__name__}") from e
    return serializers.case_summary(result.case)


@router.get("/{cnr}")
def get_case(
    cnr: str, user: User = Depends(get_current_user), db: Session = Depends(get_db)
) -> dict:
    repo = CaseRepository(db)
    case = repo.get_visible(accessible_user_ids(db, user), cnr.upper(), prefer=user.id)
    if case is None:
        raise HTTPException(status_code=404, detail="case not found")
    return serializers.case_detail(case, repo.list_orders(case.id))


@router.delete("/{cnr}")
def delete_case(
    cnr: str, user: User = Depends(get_current_user), db: Session = Depends(get_db)
) -> dict:
    ok = CaseRepository(db).delete(user.id, cnr.upper())
    if not ok:
        raise HTTPException(status_code=404, detail="case not found")
    return {"ok": True}


@router.post("/{cnr}/refresh")
def refresh_case(
    cnr: str, user: User = Depends(get_current_user), db: Session = Depends(get_db)
) -> dict:
    repo = CaseRepository(db)
    # Refresh syncs under this user, so it is owner-scoped (a shared case is refreshed
    # by its owner / the worker, not forked by a co-member).
    if repo.get_by_cnr(user.id, cnr.upper()) is None:
        raise HTTPException(status_code=404, detail="case not found")
    try:
        result = tracking.refresh_case(db, user=user, cnr=cnr.upper())
    except ECourtsError as e:
        raise HTTPException(status_code=502, detail=f"eCourts error: {type(e).__name__}") from e
    return {"case": serializers.case_summary(result.case), "changes": _changes(result.changes)}


@router.post("/{cnr}/process-orders")
def process_orders(
    cnr: str, user: User = Depends(get_current_user), db: Session = Depends(get_db)
) -> dict:
    from nm_core import documents

    case = CaseRepository(db).get_by_cnr(user.id, cnr.upper())
    if case is None:
        raise HTTPException(status_code=404, detail="case not found")
    count = documents.process_for_case(db, case_id=case.id)
    return {"processed": count}


@router.put("/{cnr}/prefs")
def set_prefs(
    cnr: str,
    body: PrefsBody,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> dict:
    valid = {"all", "orders_only", "hearings_only", "digest_only"}
    if body.alert_level is not None and body.alert_level not in valid:
        raise HTTPException(status_code=422, detail="invalid alert_level")
    # Don't create preference rows for cases the user can't see.
    if CaseRepository(db).get_visible(accessible_user_ids(db, user), cnr.upper()) is None:
        raise HTTPException(status_code=404, detail="case not found")
    snooze_until = (
        datetime.now(UTC) + timedelta(days=body.snooze_days)
        if body.snooze_days
        else None
    )
    pref = CasePreferenceRepository(db).upsert(
        user.id,
        cnr.upper(),
        alert_level=body.alert_level,
        digest_enabled=body.digest_enabled,
        snooze_until=snooze_until,
        label=body.label,
    )
    return {
        "cnr": pref.cnr,
        "alert_level": pref.alert_level,
        "digest_enabled": pref.digest_enabled,
        "snooze_until": pref.snooze_until.isoformat() if pref.snooze_until else None,
        "label": pref.label,
    }
