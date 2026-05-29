"""Identity exception hierarchy. All inherit from ``IdentityError``."""
from __future__ import annotations


class IdentityError(Exception):
    """Base class for all identity errors."""


# --- OTP ---
class OtpExpired(IdentityError):
    pass


class OtpAlreadyUsed(IdentityError):
    pass


class OtpAttemptsExhausted(IdentityError):
    pass


class OtpInvalid(IdentityError):
    pass


# --- Rate limiting ---
class RateLimited(IdentityError):
    def __init__(self, retry_after_seconds: int = 60) -> None:
        super().__init__(f"rate limited; retry after {retry_after_seconds}s")
        self.retry_after_seconds = retry_after_seconds


# --- Tokens / sessions ---
class InvalidToken(IdentityError):
    pass


class SessionRevoked(IdentityError):
    pass


class SessionExpired(IdentityError):
    pass


# --- Password ---
class InvalidCredentials(IdentityError):
    pass


class PasswordNotSet(IdentityError):
    pass


class PasswordTooWeak(IdentityError):
    pass


# --- Delivery ---
class DeliveryFailed(IdentityError):
    def __init__(self, channel: str, provider_error: str = "") -> None:
        super().__init__(f"{channel} delivery failed: {provider_error}")
        self.channel = channel
        self.provider_error = provider_error
