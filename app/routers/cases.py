"""Case book — the unified, origin-agnostic list from the shared `cases` table.

The `added_via` badge (nowlez | munshi) is stashed in the Case.raw_response JSON
at seed time, since the shared model has no dedicated source column. It makes
the "one case book, both channels" story visible in the UI.
"""
from __future__ import annotations

from typing import Any

from fastapi import APIRouter, Depends, HTTPException, status

from data_access.daos import case_dao

from munshi_core.context import case_title, fmt_date

from ..db import get_db
from ..deps import get_current_user

router = APIRouter(prefix="/cases", tags=["cases"])


def _serialize(case: Any) -> dict:
    added_via = "unknown"
    if isinstance(case.raw_response, dict):
        added_via = case.raw_response.get("added_via", "unknown")
    return {
        "cnr": case.cnr,
        "title": case_title(case),
        "case_status": case.case_status,
        "next_hearing_date": fmt_date(case.next_hearing_date),
        "portal": case.portal,
        "added_via": added_via,
    }


@router.get("")
def list_cases(user=Depends(get_current_user), db=Depends(get_db)):
    cases = case_dao.list_by_user(db, user_id=user.id)
    return {"cases": [_serialize(c) for c in cases]}


@router.get("/{cnr}")
def get_case(cnr: str, user=Depends(get_current_user), db=Depends(get_db)):
    case = case_dao.get_by_cnr(db, user_id=user.id, cnr=cnr)
    if case is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Case not found")
    return _serialize(case)
