"""Thin repositories over the identity ORM models. Each is constructed with a Session."""
from __future__ import annotations

import uuid
from datetime import UTC, datetime, timedelta

from sqlalchemy import func, select, update
from sqlalchemy.orm import Session

from nm_core.config import get_settings
from nm_core.db.models.audit import AuditLog
from nm_core.db.models.auth import AuthSession, OtpCode
from nm_core.db.models.user import User


def _utcnow() -> datetime:
    return datetime.now(UTC)


class UserRepository:
    def __init__(self, session: Session) -> None:
        self.s = session

    def get_or_create_by_phone(
        self, *, phone: str, name: str | None = None, locale: str = "en"
    ) -> tuple[User, bool]:
        user = self.s.execute(select(User).where(User.phone == phone)).scalar_one_or_none()
        if user is not None:
            if name and not user.name:
                user.name = name
                self.s.flush()
            return user, False
        user = User(phone=phone, name=name, locale=locale)
        self.s.add(user)
        self.s.flush()
        return user, True

    def get_by_phone(self, phone: str) -> User | None:
        return self.s.execute(select(User).where(User.phone == phone)).scalar_one_or_none()

    def get_by_id(self, user_id: uuid.UUID) -> User | None:
        return self.s.get(User, user_id)

    def touch_last_login(self, user_id: uuid.UUID) -> None:
        self.s.execute(
            update(User).where(User.id == user_id).values(last_login_at=_utcnow())
        )

    def update_password(self, user_id: uuid.UUID, password_hash: str) -> None:
        # Load-and-set (not a bulk UPDATE) so an already-loaded User instance in this
        # session reflects the new hash — the rehash-on-login path reuses the object.
        user = self.s.get(User, user_id)
        if user is not None:
            user.password_hash = password_hash
            self.s.flush()


class OtpRepository:
    def __init__(self, session: Session) -> None:
        self.s = session

    def insert(
        self, *, phone: str, code_hash: str, channel: str, ttl_minutes: int, ip_address: str | None
    ) -> OtpCode:
        obj = OtpCode(
            phone=phone,
            code_hash=code_hash,
            channel=channel,
            ip_address=ip_address,
            attempts_remaining=get_settings().OTP_MAX_ATTEMPTS,
            expires_at=_utcnow() + timedelta(minutes=ttl_minutes),
        )
        self.s.add(obj)
        self.s.flush()
        return obj

    def get_by_id(self, otp_id: uuid.UUID) -> OtpCode | None:
        return self.s.get(OtpCode, otp_id)

    def mark_delivered(self, otp_id: uuid.UUID, *, provider_id: str) -> None:
        self.s.execute(
            update(OtpCode)
            .where(OtpCode.id == otp_id)
            .values(delivery_status="delivered", delivery_provider_id=provider_id)
        )

    def mark_failed(self, otp_id: uuid.UUID) -> None:
        self.s.execute(
            update(OtpCode).where(OtpCode.id == otp_id).values(delivery_status="failed")
        )

    def mark_used(self, otp_id: uuid.UUID) -> None:
        self.s.execute(update(OtpCode).where(OtpCode.id == otp_id).values(used_at=_utcnow()))

    def decrement_attempts(self, otp_id: uuid.UUID) -> int:
        otp = self.s.get(OtpCode, otp_id)
        if otp is None:
            return 0
        otp.attempts_remaining = max(0, otp.attempts_remaining - 1)
        self.s.flush()
        return otp.attempts_remaining

    def count_within(self, *, phone: str, minutes: int) -> int:
        threshold = _utcnow() - timedelta(minutes=minutes)
        return int(
            self.s.execute(
                select(func.count())
                .select_from(OtpCode)
                .where(OtpCode.phone == phone, OtpCode.created_at > threshold)
            ).scalar_one()
        )

    def count_by_ip_within(self, *, ip_address: str, minutes: int) -> int:
        threshold = _utcnow() - timedelta(minutes=minutes)
        return int(
            self.s.execute(
                select(func.count())
                .select_from(OtpCode)
                .where(OtpCode.ip_address == ip_address, OtpCode.created_at > threshold)
            ).scalar_one()
        )


class SessionRepository:
    def __init__(self, session: Session) -> None:
        self.s = session

    def create(
        self,
        *,
        user_id: uuid.UUID,
        refresh_token_hash: str,
        user_agent: str | None,
        ip_address: str | None,
        ttl_days: int,
    ) -> AuthSession:
        obj = AuthSession(
            user_id=user_id,
            refresh_token_hash=refresh_token_hash,
            user_agent=user_agent,
            ip_address=ip_address,
            expires_at=_utcnow() + timedelta(days=ttl_days),
        )
        self.s.add(obj)
        self.s.flush()
        return obj

    def lookup_active_by_hash(self, token_hash: str) -> AuthSession | None:
        return self.s.execute(
            select(AuthSession).where(
                AuthSession.refresh_token_hash == token_hash,
                AuthSession.revoked_at.is_(None),
                AuthSession.expires_at > _utcnow(),
            )
        ).scalar_one_or_none()

    def touch_last_used(self, session_id: uuid.UUID) -> None:
        self.s.execute(
            update(AuthSession).where(AuthSession.id == session_id).values(last_used_at=_utcnow())
        )

    def revoke_by_hash(self, token_hash: str) -> None:
        self.s.execute(
            update(AuthSession)
            .where(AuthSession.refresh_token_hash == token_hash, AuthSession.revoked_at.is_(None))
            .values(revoked_at=_utcnow())
        )

    def revoke_all_except(self, user_id: uuid.UUID, *, except_session_id: uuid.UUID) -> None:
        self.s.execute(
            update(AuthSession)
            .where(
                AuthSession.user_id == user_id,
                AuthSession.id != except_session_id,
                AuthSession.revoked_at.is_(None),
            )
            .values(revoked_at=_utcnow())
        )


class AuditRepository:
    def __init__(self, session: Session) -> None:
        self.s = session

    def log_event(
        self,
        *,
        event_type: str,
        source: str,
        user_id: uuid.UUID | None = None,
        actor_id: uuid.UUID | None = None,
        metadata: dict | None = None,
        ip_address: str | None = None,
        user_agent: str | None = None,
    ) -> AuditLog:
        obj = AuditLog(
            event_type=event_type,
            source=source,
            user_id=user_id,
            actor_id=actor_id,
            metadata_=metadata or {},
            ip_address=ip_address,
            user_agent=user_agent,
        )
        self.s.add(obj)
        self.s.flush()
        return obj
