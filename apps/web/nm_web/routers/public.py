"""Public (unauthenticated) endpoints: waitlist + demo request.

No get_current_user dependency. IP rate-limited to curb abuse; input is validated and
HTML-sanitized in nm_core.waitlist."""
from __future__ import annotations

from fastapi import APIRouter, Depends, HTTPException, Request
from pydantic import BaseModel
from sqlalchemy.orm import Session

from nm_core import ratelimit, waitlist
from nm_web.deps import get_db

router = APIRouter(prefix="/api", tags=["public"])


def _client_ip(request: Request) -> str:
    fwd = request.headers.get("x-forwarded-for")
    if fwd:
        return fwd.split(",")[0].strip()
    return request.client.host if request.client else "unknown"


class WaitlistBody(BaseModel):
    name: str
    email: str
    practice_area: str | None = None


@router.post("/waitlist")
def join_waitlist(
    body: WaitlistBody, request: Request, db: Session = Depends(get_db)
) -> dict:
    if not ratelimit.allow(f"waitlist:{_client_ip(request)}", limit=5, window_seconds=60):
        raise HTTPException(status_code=429, detail="too many requests")
    try:
        created = waitlist.join_waitlist(
            db, name=body.name, email=body.email, practice_area=body.practice_area)
    except waitlist.WaitlistError as e:
        raise HTTPException(status_code=422, detail=str(e)) from e
    return {"success": True, "created": created, "waitlist_count": waitlist.waitlist_count(db)}


@router.get("/waitlist/count")
def waitlist_count(db: Session = Depends(get_db)) -> dict:
    return {"waitlist_count": waitlist.waitlist_count(db)}


class DemoBody(BaseModel):
    name: str
    email: str
    firm: str | None = None
    message: str | None = None


@router.post("/demo-request")
def demo_request(
    body: DemoBody, request: Request, db: Session = Depends(get_db)
) -> dict:
    if not ratelimit.allow(f"demo:{_client_ip(request)}", limit=3, window_seconds=60):
        raise HTTPException(status_code=429, detail="too many requests")
    try:
        waitlist.record_demo_request(
            db, name=body.name, email=body.email, firm=body.firm, message=body.message)
    except waitlist.WaitlistError as e:
        raise HTTPException(status_code=422, detail=str(e)) from e
    return {"success": True}
