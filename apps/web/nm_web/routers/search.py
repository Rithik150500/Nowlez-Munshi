"""eCourts search: dropdowns + party/case-number lookup (district courts).

Gated behind the `search` billing feature. Returns lightweight stubs; the SPA
follows up with POST /api/cases to actually track a result by CNR.
"""
from __future__ import annotations

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from nm_core import billing
from nm_core.db.models.user import User
from nm_core.ecourts import client as ecourts
from nm_core.ecourts.errors import ECourtsError
from nm_core.teams import ensure_personal_account
from nm_web.deps import get_current_user, get_db

router = APIRouter(prefix="/api/search", tags=["search"])


def _require_search(user: User, db: Session) -> None:
    account = ensure_personal_account(db, user)
    if not billing.feature_allowed(db, account.id, "search"):
        raise HTTPException(status_code=402, detail="search requires a paid plan")


def _stub(s) -> dict:
    return {
        "cnr": s.cnr, "title": s.title, "case_number": s.case_number,
        "court": s.court, "filing_year": s.filing_year, "stage": s.stage,
    }


@router.get("/states")
def states(user: User = Depends(get_current_user), db: Session = Depends(get_db)) -> dict:
    _require_search(user, db)
    return {"states": [{"code": s.code, "name": s.name} for s in ecourts.list_states()]}


@router.get("/districts")
def districts(
    state_code: str, user: User = Depends(get_current_user), db: Session = Depends(get_db)
) -> dict:
    _require_search(user, db)
    rows = ecourts.list_districts(state_code)
    return {"districts": [{"code": d.code, "name": d.name} for d in rows]}


@router.get("/court-complexes")
def court_complexes(
    state_code: str, district_code: str,
    user: User = Depends(get_current_user), db: Session = Depends(get_db),
) -> dict:
    _require_search(user, db)
    rows = ecourts.list_court_complexes(state_code=state_code, district_code=district_code)
    return {"court_complexes": [{"code": c.code, "name": c.name, "est_code": c.est_code}
                                for c in rows]}


@router.get("/party")
def party(
    state_code: str, district_code: str, court_code_arr: str, name: str, year: int,
    user: User = Depends(get_current_user), db: Session = Depends(get_db),
) -> dict:
    _require_search(user, db)
    try:
        rows = ecourts.search_party(
            state_code=state_code, district_code=district_code,
            court_code_arr=court_code_arr, party_name=name, year=year,
        )
    except ECourtsError as e:
        raise HTTPException(status_code=502, detail=f"eCourts error: {type(e).__name__}") from e
    return {"results": [_stub(s) for s in rows]}


@router.get("/case-number")
def case_number(
    state_code: str, district_code: str, court_code_arr: str,
    case_type: str, case_number: str, year: int,
    user: User = Depends(get_current_user), db: Session = Depends(get_db),
) -> dict:
    _require_search(user, db)
    try:
        rows = ecourts.search_case_number(
            state_code=state_code, district_code=district_code,
            court_code_arr=court_code_arr, case_type=case_type,
            case_number=case_number, year=year,
        )
    except ECourtsError as e:
        raise HTTPException(status_code=502, detail=f"eCourts error: {type(e).__name__}") from e
    return {"results": [_stub(s) for s in rows]}
