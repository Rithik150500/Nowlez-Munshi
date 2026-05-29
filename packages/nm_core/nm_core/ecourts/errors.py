"""eCourts error taxonomy. Only ``CourtSiteDown`` is retryable (see resilience)."""
from __future__ import annotations


class ECourtsError(Exception):
    """Base class for all eCourts errors."""


class CNRMalformed(ECourtsError):
    """CNR doesn't match the 16-char regex or has an unknown state code."""

    def __init__(self, cnr: str, reason: str | None = None) -> None:
        self.cnr = cnr
        self.reason = reason
        super().__init__(f"Malformed CNR: {cnr}" + (f" ({reason})" if reason else ""))


class CNRNotFound(ECourtsError):
    """eCourts returned a 'no record found' response for this CNR."""

    def __init__(self, cnr: str) -> None:
        self.cnr = cnr
        super().__init__(f"CNR not found: {cnr}")


class CourtSiteDown(ECourtsError):
    """eCourts returned a 5xx, timed out, or refused the connection. Retryable."""


class RateLimited(ECourtsError):
    """eCourts returned a throttle response (429). Not retryable."""


class BlockedByGeoIP(ECourtsError):
    """eCourts returned a 403 with the GeoIP-block signature. Not retryable."""


class PDFNotFound(ECourtsError):
    """The PDF URL returned 404 or a non-2xx body."""


class PDFInvalid(ECourtsError):
    """The downloaded bytes are not a valid PDF (missing %PDF magic)."""


class SchemaChanged(ECourtsError):
    """A parser couldn't find an expected field — likely NIC schema drift."""

    def __init__(self, field: str, reason: str) -> None:
        self.field = field
        self.reason = reason
        super().__init__(f"Schema changed at field '{field}': {reason}")


class CircuitOpen(ECourtsError):
    """Circuit breaker is open; the request was rejected without hitting eCourts."""

    def __init__(self, name: str, retry_after_seconds: float) -> None:
        self.name = name
        self.retry_after_seconds = retry_after_seconds
        super().__init__(f"Circuit '{name}' is open; retry after {retry_after_seconds:.1f}s")


class JWTExpired(ECourtsError):
    """Two consecutive 401s; the session must mint a fresh JWT."""
