"""Meta WhatsApp Cloud API client (httpx, sync). Returns the wamid on success."""
from __future__ import annotations

import re

import httpx

from nm_core.config import get_settings
from nm_core.messaging.errors import (
    Meta24HourWindowExpired,
    MetaInvalidMessage,
    MetaTransientError,
)

_RETRYABLE_ERROR_CODES = frozenset({130429, 131056, 133016})
_WINDOW_EXPIRED_CODE = 131047
_CONTROL_RE = re.compile(r"[\x00-\x1f\x7f‪-‮]")


def _sanitize_var(value: object, max_len: int = 512) -> str:
    """Strip control/RTL chars and neutralise {{n}} placeholders in a template var."""
    text = str(value)
    text = _CONTROL_RE.sub("", text).replace("{{", "{ {").replace("}}", "} }")
    if len(text) > max_len:
        text = text[: max_len - 1] + "…"
    return text


class MetaClient:
    def __init__(self, *, phone_number_id: str | None = None, access_token: str | None = None):
        s = get_settings()
        self.phone_number_id = phone_number_id or s.META_PHONE_NUMBER_ID
        self.access_token = access_token or s.META_ACCESS_TOKEN
        self._base = f"https://graph.facebook.com/{s.META_GRAPH_VERSION}"
        self._timeout = s.WHATSAPP_SEND_TIMEOUT_SECONDS

    def send_text(self, to: str, body: str) -> str:
        return self._send(
            {
                "messaging_product": "whatsapp",
                "to": to.lstrip("+"),
                "type": "text",
                "text": {"body": body},
            }
        )

    def send_template(
        self, *, to: str, name: str, language: str, body_variables: list[object]
    ) -> str:
        params = [{"type": "text", "text": _sanitize_var(v)} for v in body_variables]
        components = [{"type": "body", "parameters": params}] if params else []
        return self._send(
            {
                "messaging_product": "whatsapp",
                "to": to.lstrip("+"),
                "type": "template",
                "template": {
                    "name": name,
                    "language": {"code": language},
                    "components": components,
                },
            }
        )

    def _send(self, payload: dict) -> str:
        url = f"{self._base}/{self.phone_number_id}/messages"
        try:
            resp = httpx.post(
                url,
                json=payload,
                headers={"Authorization": f"Bearer {self.access_token}"},
                timeout=self._timeout,
            )
        except httpx.HTTPError as e:
            raise MetaTransientError(f"network error: {e}") from e
        self._raise_for_status(resp)
        return resp.json()["messages"][0]["id"]

    @staticmethod
    def _raise_for_status(resp: httpx.Response) -> None:
        if resp.status_code < 400:
            return
        if resp.status_code >= 500 or resp.status_code == 429:
            raise MetaTransientError(f"meta {resp.status_code}: {resp.text[:200]}")
        try:
            err = resp.json().get("error", {})
        except ValueError:
            raise MetaInvalidMessage(f"meta {resp.status_code}: {resp.text[:200]}") from None
        code = err.get("code")
        if code in _RETRYABLE_ERROR_CODES:
            raise MetaTransientError(f"meta retryable {code}: {err.get('message')}")
        if code == _WINDOW_EXPIRED_CODE:
            raise Meta24HourWindowExpired(err.get("message", "24h window expired"))
        raise MetaInvalidMessage(f"meta {code}: {err.get('message')}")
