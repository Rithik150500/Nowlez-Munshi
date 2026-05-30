"""Auth endpoints: phone-OTP login, refresh, logout, dev-login, /me."""
from __future__ import annotations

from fastapi import APIRouter, Depends, HTTPException, Response
from pydantic import BaseModel
from sqlalchemy.orm import Session

from nm_core import identity
from nm_core.config import get_settings
from nm_core.db.models.user import User
from nm_core.identity.errors import IdentityError, RateLimited
from nm_web.deps import get_current_user, get_db

router = APIRouter(prefix="/api/auth", tags=["auth"])


class StartBody(BaseModel):
    phone: str


class VerifyBody(BaseModel):
    otp_id: str
    code: str
    name: str | None = None


class TokenBody(BaseModel):
    refresh_token: str


class DevLoginBody(BaseModel):
    phone: str
    name: str | None = None


class LinkBody(BaseModel):
    token: str


@router.post("/start")
def start(body: StartBody, db: Session = Depends(get_db)) -> dict:
    try:
        return identity.start_phone_login(db, phone=body.phone)
    except RateLimited as e:
        raise HTTPException(status_code=429, detail=str(e)) from e
    except IdentityError as e:
        raise HTTPException(status_code=400, detail=str(e)) from e


@router.post("/verify")
def verify(body: VerifyBody, db: Session = Depends(get_db)) -> dict:
    try:
        return identity.verify_otp_and_login(db, otp_id=body.otp_id, code=body.code, name=body.name)
    except IdentityError as e:
        raise HTTPException(status_code=400, detail=str(e)) from e


@router.post("/refresh")
def refresh(body: TokenBody, db: Session = Depends(get_db)) -> dict:
    try:
        return identity.refresh_access_token(db, refresh_token=body.refresh_token)
    except IdentityError as e:
        raise HTTPException(status_code=401, detail=str(e)) from e


@router.post("/logout")
def logout(body: TokenBody, db: Session = Depends(get_db)) -> dict:
    identity.revoke_session(db, refresh_token=body.refresh_token)
    return {"ok": True}


@router.post("/dev-login")
def dev_login(body: DevLoginBody, db: Session = Depends(get_db)) -> dict:
    if not get_settings().DEV_MODE:
        raise HTTPException(status_code=404, detail="not found")
    return identity.dev_login(db, phone=body.phone, name=body.name)


@router.post("/link")
def link(body: LinkBody, db: Session = Depends(get_db)) -> dict:
    """Exchange a WhatsApp→web continuity link token for a session."""
    try:
        return identity.exchange_link_token(db, token=body.token)
    except IdentityError as e:
        raise HTTPException(status_code=401, detail=str(e)) from e


class ProfileBody(BaseModel):
    name: str | None = None
    locale: str | None = None


def _me_dict(user: User) -> dict:
    return {
        "id": str(user.id),
        "phone": user.phone,
        "name": user.name,
        "locale": user.locale,
        "is_admin": user.is_admin,
        "onboarded": user.onboarded_at is not None,
    }


@router.get("/me")
def me(user: User = Depends(get_current_user)) -> dict:
    return _me_dict(user)


@router.put("/me")
def update_me(
    body: ProfileBody, user: User = Depends(get_current_user), db: Session = Depends(get_db)
) -> dict:
    if body.name is not None:
        user.name = body.name
    if body.locale is not None:
        if body.locale not in ("en", "hi"):
            raise HTTPException(status_code=422, detail="locale must be en or hi")
        user.locale = body.locale
    db.flush()
    return _me_dict(user)


@router.post("/me/onboarded")
def mark_onboarded(user: User = Depends(get_current_user), db: Session = Depends(get_db)) -> dict:
    from datetime import UTC, datetime

    if user.onboarded_at is None:
        user.onboarded_at = datetime.now(UTC)
        db.flush()
    return _me_dict(user)


@router.post("/me/export")
def export_my_data(
    user: User = Depends(get_current_user), db: Session = Depends(get_db)
) -> Response:
    """Download a ZIP of all the user's data (GDPR). Rate-limited to 1/hour."""
    from datetime import UTC, datetime

    from nm_core import export

    if not export.can_export(user):
        raise HTTPException(status_code=429, detail="export allowed once per hour")
    user.last_export_at = datetime.now(UTC)  # set before building (multi-worker safe)
    db.flush()
    data = export.build_user_export_zip(db, user=user)
    return Response(
        content=data, media_type="application/zip",
        headers={"Content-Disposition": 'attachment; filename="nowlez-munshi-export.zip"'},
    )
