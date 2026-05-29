"""Meta WhatsApp error taxonomy."""
from __future__ import annotations


class MessagingError(Exception):
    """Base class for messaging errors."""


class MetaTransientError(MessagingError):
    """5xx, 429, or a documented retryable error code. Safe to retry."""

    def __init__(self, message: str, *, retry_after_seconds: int | None = None) -> None:
        super().__init__(message)
        self.retry_after_seconds = retry_after_seconds


class MetaInvalidMessage(MessagingError):
    """A 4xx that isn't a 24h-window expiry. Do not retry."""


class Meta24HourWindowExpired(MessagingError):
    """Error 131047 — outside the 24h customer-service window; template-only."""
