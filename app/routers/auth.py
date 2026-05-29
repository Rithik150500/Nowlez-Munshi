"""Auth routes — phone-OTP via shared identity, plus a DEV-only bypass.

Routes are sync `def` on purpose: the shared identity functions are synchronous
and do blocking DB/HTTP work, so FastAPI runs these in its threadpool.
"""
from __future__ import annotations

from fastapi import APIRouter, Depends, HTTPException, Request, status
from pydantic import BaseModel

from identity import start_phone_login, verify_otp_and_login
from identity.session.jwt import encode_access_token
from data_access.daos import user_dao

from ..config import settings
from ..db import get_db

router = APIRouter(prefix="/auth", tags=["auth"])


class StartReq(BaseModel):
    phone: str


class VerifyReq(BaseModel):
    otp_id: str
    code: str
    name: str | None = None


class DevLoginReq(BaseModel):
    phone: str
    name: str | None = None


def _client_ip(request: Request) -> str | None:
    return request.client.host if request.client else None


@router.post("/start")
def auth_start(body: StartReq, request: Request, db=Depends(get_db)):
    """Begin phone-OTP login. Needs Meta/MSG91 creds to actually deliver — in a
    local demo without them this 502s; use /auth/dev-login instead."""
    try:
        return start_phone_login(db, phone=body.phone, ip_address=_client_ip(request))
    except Exception as exc:  # noqa: BLE001 — surface a helpful hint
        raise HTTPException(
            status.HTTP_502_BAD_GATEWAY,
            f"OTP delivery unavailable ({type(exc).__name__}). "
            "In dev, use POST /auth/dev-login.",
        )


@router.post("/verify")
def auth_verify(body: VerifyReq, request: Request, db=Depends(get_db)):
    try:
        return verify_otp_and_login(
            db,
            otp_id=body.otp_id,
            code=body.code,
            brand="nowlez",
            name=body.name,
            ip_address=_client_ip(request),
        )
    except Exception as exc:  # noqa: BLE001
        raise HTTPException(
            status.HTTP_400_BAD_REQUEST, f"OTP verification failed: {type(exc).__name__}"
        )


@router.post("/dev-login")
def dev_login(body: DevLoginReq, db=Depends(get_db)):
    """DEV ONLY: find-or-create by phone and mint a real identity JWT (skips OTP
    delivery). Disabled when DEV_MODE is off."""
    if not settings.dev_mode:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Not found")
    user, _ = user_dao.get_or_create_by_phone(db, phone=body.phone)
    user_dao.ensure_nowlez_extension(db, user.id, name=body.name or "")
    token = encode_access_token(user.id)
    return {
        "access_token": token,
        "token_type": "bearer",
        "user": {"id": str(user.id), "phone": user.phone, "locale": user.locale},
    }
