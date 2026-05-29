"""Identity orchestration — the public surface apps call.

Phone-canonical: there is one ``User``, keyed by phone. No brand parameter; all
audit events use ``source="identity"``.
"""
from __future__ import annotations

import uuid

from sqlalchemy.orm import Session

from nm_core.config import get_settings
from nm_core.db.models.user import User
from nm_core.identity import jwt as _jwt
from nm_core.identity import otp as _otp
from nm_core.identity import passwords as _pw
from nm_core.identity import sessions as _sessions
from nm_core.identity.delivery import deliver_otp
from nm_core.identity.errors import InvalidCredentials, PasswordNotSet
from nm_core.identity.repositories import (
    AuditRepository,
    OtpRepository,
    SessionRepository,
    UserRepository,
)


def _login_result(user: User, *, access: str, refresh: str) -> dict:
    return {
        "access_token": access,
        "refresh_token": refresh,
        "user": {
            "id": str(user.id),
            "phone": user.phone,
            "name": user.name,
            "locale": user.locale,
        },
    }


def start_phone_login(session: Session, *, phone: str, ip_address: str | None = None) -> dict:
    """Issue + deliver an OTP. Anti-enumeration: response shape never reveals registration."""
    _otp.check_otp_rate_limit(session, phone=phone, ip_address=ip_address)
    code = _otp.generate_otp_code()
    otp_repo = OtpRepository(session)
    otp = otp_repo.insert(
        phone=phone,
        code_hash=_otp.hash_otp_code(code),
        channel="whatsapp",
        ttl_minutes=get_settings().OTP_TTL_MINUTES,
        ip_address=ip_address,
    )
    audit = AuditRepository(session)
    try:
        channel, provider_id = deliver_otp(phone, code)
        otp_repo.mark_delivered(otp.id, provider_id=provider_id)
        if channel != "whatsapp":
            otp.channel = channel
            session.flush()
    except Exception:
        otp_repo.mark_failed(otp.id)
        audit.log_event(
            event_type="otp.delivery_failed",
            source="identity",
            metadata={"otp_id": str(otp.id)},
            ip_address=ip_address,
        )
        raise
    audit.log_event(
        event_type="otp.issued",
        source="identity",
        metadata={"otp_id": str(otp.id), "channel": channel},
        ip_address=ip_address,
    )
    return {"otp_id": str(otp.id), "channel": channel}


def verify_otp_and_login(
    session: Session,
    *,
    otp_id: uuid.UUID | str,
    code: str,
    name: str | None = None,
    user_agent: str | None = None,
    ip_address: str | None = None,
) -> dict:
    if isinstance(otp_id, str):
        otp_id = uuid.UUID(otp_id)
    _otp.verify_otp(session, otp_id=otp_id, code=code)
    otp = OtpRepository(session).get_by_id(otp_id)
    assert otp is not None  # verify_otp confirmed existence

    users = UserRepository(session)
    user, was_created = users.get_or_create_by_phone(phone=otp.phone, name=name)
    users.touch_last_login(user.id)
    refresh_raw, _ = _sessions.issue_refresh_token(
        session, user_id=user.id, user_agent=user_agent, ip_address=ip_address
    )
    access = _jwt.encode_access_token(user.id)
    AuditRepository(session).log_event(
        event_type="user.created" if was_created else "user.login.otp",
        user_id=user.id,
        source="identity",
        metadata={"channel": otp.channel},
        ip_address=ip_address,
    )
    return _login_result(user, access=access, refresh=refresh_raw)


def login_with_password(
    session: Session,
    *,
    phone: str,
    password: str,
    user_agent: str | None = None,
    ip_address: str | None = None,
) -> dict:
    users = UserRepository(session)
    user = users.get_by_phone(phone)
    if user is None:
        _pw.verify_password("__decoy__", _pw.BOGUS_HASH)  # timing parity
        raise InvalidCredentials("phone or password is incorrect")
    if user.password_hash is None:
        _pw.verify_password("__decoy__", _pw.BOGUS_HASH)  # timing parity
        raise PasswordNotSet("password is not set for this account; use OTP login")
    if not _pw.verify_password(password, user.password_hash):
        raise InvalidCredentials("phone or password is incorrect")
    if _pw.needs_rehash(user.password_hash):
        users.update_password(user.id, _pw.hash_password(password))

    users.touch_last_login(user.id)
    refresh_raw, _ = _sessions.issue_refresh_token(
        session, user_id=user.id, user_agent=user_agent, ip_address=ip_address
    )
    access = _jwt.encode_access_token(user.id)
    AuditRepository(session).log_event(
        event_type="user.login.password", user_id=user.id, source="identity", ip_address=ip_address
    )
    return _login_result(user, access=access, refresh=refresh_raw)


def refresh_access_token(session: Session, *, refresh_token: str) -> dict:
    auth_session = _sessions.consume_refresh_token(session, refresh_token)
    return {"access_token": _jwt.encode_access_token(auth_session.user_id)}


def revoke_session(session: Session, *, refresh_token: str) -> None:
    _sessions.revoke_refresh_token(session, refresh_token)


def set_password(
    session: Session,
    *,
    user_id: uuid.UUID,
    new_password: str,
    fresh_otp_id: uuid.UUID | str,
    fresh_otp_code: str,
    current_session_id: uuid.UUID | None = None,
) -> None:
    """Set/change password — requires a fresh OTP. Optionally revokes sibling sessions."""
    if isinstance(fresh_otp_id, str):
        fresh_otp_id = uuid.UUID(fresh_otp_id)
    _pw.validate_password_strength(new_password)
    _otp.verify_otp(session, otp_id=fresh_otp_id, code=fresh_otp_code)
    UserRepository(session).update_password(user_id, _pw.hash_password(new_password))
    if current_session_id is not None:
        SessionRepository(session).revoke_all_except(
            user_id, except_session_id=current_session_id
        )
    AuditRepository(session).log_event(
        event_type="password.set", user_id=user_id, source="identity"
    )


def create_link_token(user_id: uuid.UUID) -> str:
    """Mint a short-lived continuity link token for the given user (web deep-link)."""
    return _jwt.encode_link_token(user_id)


def exchange_link_token(
    session: Session,
    *,
    token: str,
    user_agent: str | None = None,
    ip_address: str | None = None,
) -> dict:
    """Exchange a continuity link token for a normal session (access + refresh)."""
    claims = _jwt.decode_link_token(token)
    user_id = uuid.UUID(claims["sub"])
    users = UserRepository(session)
    user = users.get_by_id(user_id)
    if user is None or not user.is_active:
        from nm_core.identity.errors import InvalidToken

        raise InvalidToken("link token refers to an unknown user")
    users.touch_last_login(user.id)
    refresh_raw, _ = _sessions.issue_refresh_token(
        session, user_id=user.id, user_agent=user_agent, ip_address=ip_address
    )
    access = _jwt.encode_access_token(user.id)
    AuditRepository(session).log_event(
        event_type="user.login.link", user_id=user.id, source="identity", ip_address=ip_address
    )
    return _login_result(user, access=access, refresh=refresh_raw)


def dev_login(session: Session, *, phone: str, name: str | None = None) -> dict:
    """Credential-free login for local dev/demo. Hard-disabled unless ``DEV_MODE``."""
    if not get_settings().DEV_MODE:
        raise RuntimeError("dev_login is disabled: DEV_MODE is off")
    users = UserRepository(session)
    user, was_created = users.get_or_create_by_phone(phone=phone, name=name)
    users.touch_last_login(user.id)
    refresh_raw, _ = _sessions.issue_refresh_token(session, user_id=user.id)
    access = _jwt.encode_access_token(user.id)
    AuditRepository(session).log_event(
        event_type="user.created" if was_created else "user.login.dev",
        user_id=user.id,
        source="identity",
    )
    return _login_result(user, access=access, refresh=refresh_raw)
