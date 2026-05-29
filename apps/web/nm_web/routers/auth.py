"""Auth endpoints: phone-OTP login, refresh, logout, dev-login, /me."""
from __future__ import annotations

from fastapi import APIRouter, Depends, HTTPException
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


@router.get("/me")
def me(user: User = Depends(get_current_user)) -> dict:
    return {
        "id": str(user.id),
        "phone": user.phone,
        "name": user.name,
        "locale": user.locale,
        "is_admin": user.is_admin,
    }
