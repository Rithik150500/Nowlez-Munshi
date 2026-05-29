"""Argon2id password + OTP hashing, timing-safe verification, strength validation."""
from __future__ import annotations

from pathlib import Path

from argon2 import PasswordHasher
from argon2 import exceptions as a2err

from nm_core.config import get_settings
from nm_core.identity.errors import PasswordTooWeak


def _build_hasher() -> PasswordHasher:
    s = get_settings()
    return PasswordHasher(
        time_cost=s.ARGON2_TIME_COST,
        memory_cost=s.ARGON2_MEMORY_COST_KB,
        parallelism=s.ARGON2_PARALLELISM,
    )


# One shared hasher (also reused for OTP codes — same parameters).
hasher = _build_hasher()

# Pre-computed decoy hash for timing-safe login when phone unknown / password unset.
BOGUS_HASH = hasher.hash("__bogus__")


def hash_password(plain: str) -> str:
    return hasher.hash(plain)


def verify_password(plain: str, hashed: str) -> bool:
    """Never raises — returns False on any mismatch/corruption (timing-parity safe)."""
    try:
        return hasher.verify(hashed, plain)
    except (a2err.VerifyMismatchError, a2err.InvalidHash, a2err.VerificationError):
        return False


def needs_rehash(hashed: str) -> bool:
    try:
        return hasher.check_needs_rehash(hashed)
    except a2err.InvalidHash:
        return True


def _load_common_passwords() -> frozenset[str]:
    path = Path(__file__).parent / "common_passwords.txt"
    if not path.exists():
        return frozenset()
    return frozenset(
        line.strip().lower() for line in path.read_text().splitlines() if line.strip()
    )


_COMMON_PASSWORDS = _load_common_passwords()


def validate_password_strength(plain: str) -> None:
    if len(plain) < 8:
        raise PasswordTooWeak("Password must be at least 8 characters")
    if plain.lower() in _COMMON_PASSWORDS:
        raise PasswordTooWeak("Password is too common")
