"""eCourts mobile API session: JWT lifecycle + encrypted-GET transport (sync, httpx).

The transport classifies failures (CourtSiteDown / RateLimited / BlockedByGeoIP) but
does not retry — the outer resilience stack owns retry. A single 401 is retried with
the package-suffixed uid; a second 401 raises JWTExpired.
"""
from __future__ import annotations

import json
import uuid
from typing import Any, Literal

import httpx

from nm_core.config import get_settings
from nm_core.ecourts.crypto import decrypt_response, encrypt_request, wrap_bearer
from nm_core.ecourts.errors import (
    BlockedByGeoIP,
    CourtSiteDown,
    ECourtsError,
    JWTExpired,
    RateLimited,
)

_PACKAGE_NAME = "in.gov.ecourts.eCourtsServices"
_APP_VERSION = "3.0"

Scope = Literal["district", "highcourt"]


class Session:
    """One HTTP session with a rolling JWT and encrypted-GET transport."""

    def __init__(self, scope: Scope) -> None:
        s = get_settings()
        self.scope = scope
        self.base_url = (
            s.ECOURTS_DISTRICT_BASE_URL if scope == "district" else s.ECOURTS_HC_BASE_URL
        )
        self.uid = str(uuid.uuid4())
        self.jwt: str | None = None
        self._http = httpx.Client(
            headers={"User-Agent": s.ECOURTS_USER_AGENT},
            timeout=s.ECOURTS_REQUEST_TIMEOUT_SECONDS,
        )

    @property
    def uid_with_pkgname(self) -> str:
        return f"{self.uid}:{_PACKAGE_NAME}"

    def init(self) -> None:
        """Mint the initial JWT via appReleaseWebService.php."""
        payload = {"version": _APP_VERSION, "uid": self.uid_with_pkgname}
        body = self._send("appReleaseWebService.php", payload, with_bearer=False)
        token = body.get("token")
        if not token:
            raise ECourtsError(f"appReleaseWebService.php returned no token: {body!r}")
        self.jwt = token

    def call(self, endpoint: str, payload: dict[str, Any]) -> dict[str, Any]:
        if self.jwt is None:
            self.init()

        result = self._send(endpoint, payload, with_bearer=True)
        if result.get("status") == "N" and str(result.get("status_code")) == "401":
            retried = {**payload, "uid": self.uid_with_pkgname}
            result = self._send(endpoint, retried, with_bearer=True)
            if result.get("status") == "N" and str(result.get("status_code")) == "401":
                self.jwt = None
                raise JWTExpired(f"Second 401 from {endpoint}; JWT must be re-minted")

        if result.get("status") == "N":
            msg = result.get("msg") or result.get("errorMessage") or "unknown eCourts error"
            raise ECourtsError(f"{endpoint}: {msg}")
        return result

    def _send(self, endpoint: str, payload: Any, *, with_bearer: bool) -> dict[str, Any]:
        url = self.base_url + endpoint
        encrypted_body = encrypt_request(payload)

        headers: dict[str, str] = {}
        if with_bearer:
            if self.jwt is None:
                raise ECourtsError("attempt to send authenticated call without JWT")
            headers["Authorization"] = f"Bearer {wrap_bearer(self.jwt)}"

        try:
            resp = self._http.get(url, params={"params": encrypted_body}, headers=headers)
        except httpx.TransportError as e:
            raise CourtSiteDown(f"transport error on {endpoint}: {e}") from e

        if resp.status_code == 429:
            raise RateLimited(f"eCourts returned 429 for {endpoint}")
        if resp.status_code == 403 and "geographic" in resp.text.lower():
            raise BlockedByGeoIP(f"GeoIP block for {endpoint}")
        if 500 <= resp.status_code < 600:
            raise CourtSiteDown(f"{resp.status_code} on {endpoint}")

        body = resp.text.strip()
        if body.startswith("{") and body.endswith("}"):
            try:
                return json.loads(body)
            except json.JSONDecodeError:
                pass  # fall through; may be ciphertext that happens to start with {

        plaintext = decrypt_response(resp.text)
        try:
            parsed = json.loads(plaintext)
        except json.JSONDecodeError as e:
            raise ECourtsError(f"non-JSON response from {endpoint}: {plaintext[:200]!r}") from e

        if "token" in parsed:
            self.jwt = parsed["token"]
        return parsed
