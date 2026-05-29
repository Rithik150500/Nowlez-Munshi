"""OTP generation, hashing, verification, and rate limiting."""
from __future__ import annotations

import secrets
import uuid
from datetime import UTC, datetime

from argon2 import exceptions as a2err
from sqlalchemy.orm import Session

from nm_core.config import get_settings
from nm_core.identity.errors import (
    OtpAlreadyUsed,
    OtpAttemptsExhausted,
    OtpExpired,
    OtpInvalid,
    RateLimited,
)
from nm_core.identity.passwords import hasher
from nm_core.identity.repositories import OtpRepository


def generate_otp_code() -> str:
    n = get_settings().OTP_LENGTH
    return str(secrets.randbelow(10**n)).zfill(n)


def hash_otp_code(code: str) -> str:
    return hasher.hash(code)


def _aware(dt: datetime) -> datetime:
    """Coerce a possibly-naive (SQLite) datetime to UTC-aware for comparison."""
    return dt if dt.tzinfo is not None else dt.replace(tzinfo=UTC)


def verify_otp(session: Session, *, otp_id: uuid.UUID, code: str) -> None:
    """Validate an OTP. State guards run before the crypto check (no timing leak).

    On success the OTP is marked used. On a code mismatch the attempt counter is
    decremented. Raises the appropriate ``Otp*`` error otherwise.
    """
    repo = OtpRepository(session)
    otp = repo.get_by_id(otp_id)
    if otp is None:
        raise OtpInvalid("OTP not found")
    if otp.used_at is not None:
        raise OtpAlreadyUsed("OTP has already been used")
    if otp.attempts_remaining <= 0:
        raise OtpAttemptsExhausted("OTP attempts exhausted; request a new code")
    if _aware(otp.expires_at) <= datetime.now(UTC):
        raise OtpExpired("OTP has expired; request a new code")

    try:
        hasher.verify(otp.code_hash, code)
    except a2err.VerifyMismatchError as e:
        repo.decrement_attempts(otp_id)
        raise OtpInvalid("Invalid OTP code") from e
    except a2err.InvalidHash as e:
        raise OtpInvalid("OTP record corrupted") from e

    repo.mark_used(otp_id)


def check_otp_rate_limit(session: Session, *, phone: str, ip_address: str | None) -> None:
    s = get_settings()
    repo = OtpRepository(session)
    if repo.count_within(phone=phone, minutes=60) >= s.OTP_PER_PHONE_PER_HOUR:
        raise RateLimited(3600)
    if ip_address is not None:
        if repo.count_by_ip_within(ip_address=ip_address, minutes=60) >= s.OTP_PER_IP_PER_HOUR:
            raise RateLimited(3600)
