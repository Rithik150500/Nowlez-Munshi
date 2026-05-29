"""Meta WhatsApp Cloud API client (httpx, sync). Returns the wamid on success.

Beyond plain text/template sends this also speaks the *interactive* surface
(reply buttons + tap-to-pick lists) and the two-step *document* upload→send path —
the primitives the WhatsApp door needs for onboarding, guided search, order
delivery, and opt-out. Payload shapes and Meta's row/length caps are ported from
the legacy bot's hard-won client.
"""
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

# Meta hard caps — exceed them and the API 4xxs, so clip defensively.
_MAX_BUTTONS = 3
_MAX_BUTTON_TITLE = 20
_MAX_BUTTON_ID = 256
_MAX_LIST_ROWS = 10
_MAX_ROW_TITLE = 24
_MAX_ROW_DESC = 72
_MAX_BODY = 1024
_MAX_DOCUMENT_FILENAME = 240
_MAX_DOCUMENT_CAPTION = 1024


def _scrub_auth(text: str) -> str:
    """Meta's media/error envelopes occasionally echo the request Authorization
    header; never let a bearer token reach a log line or Sentry event."""
    return re.sub(r"(?i)(bearer\s+)[A-Za-z0-9._\-]+", r"\1<redacted>", text)


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

    def send_interactive_buttons(
        self, *, to: str, body: str, buttons: list[dict[str, str]]
    ) -> str:
        """Send up to 3 reply buttons. Each button is ``{"id": ..., "title": ...}``.

        The button *id* comes back as ``button_payload`` on the inbound webhook
        (see ``webhook._one_message``), so callers route on the id they set here.
        """
        clipped = [
            {"type": "reply", "reply": {"id": b["id"][:_MAX_BUTTON_ID],
                                        "title": b["title"][:_MAX_BUTTON_TITLE]}}
            for b in buttons[:_MAX_BUTTONS]
        ]
        return self._send(
            {
                "messaging_product": "whatsapp",
                "to": to.lstrip("+"),
                "type": "interactive",
                "interactive": {
                    "type": "button",
                    "body": {"text": body[:_MAX_BODY]},
                    "action": {"buttons": clipped},
                },
            }
        )

    def send_interactive_list(
        self, *, to: str, body: str, button_label: str, rows: list[dict[str, str]]
    ) -> str:
        """Send a tap-to-pick list (up to 10 rows). Each row is
        ``{"id": ..., "title": ..., "description": ...}`` (description optional).
        The picked row's *id* returns as ``button_payload`` on the webhook."""
        clipped: list[dict[str, str]] = []
        for r in rows[:_MAX_LIST_ROWS]:
            row = {"id": r["id"][:_MAX_BUTTON_ID], "title": r["title"][:_MAX_ROW_TITLE]}
            if r.get("description"):
                row["description"] = r["description"][:_MAX_ROW_DESC]
            clipped.append(row)
        return self._send(
            {
                "messaging_product": "whatsapp",
                "to": to.lstrip("+"),
                "type": "interactive",
                "interactive": {
                    "type": "list",
                    "body": {"text": body[:_MAX_BODY]},
                    "action": {
                        "button": button_label[:_MAX_BUTTON_TITLE],
                        "sections": [{"title": "", "rows": clipped}],
                    },
                },
            }
        )

    def upload_media(self, *, content: bytes, filename: str, mime_type: str) -> str:
        """Upload bytes to Meta's media store (multipart) and return the media_id.

        Two-step upload→send is deliberate over Meta's ``link`` mode: link mode
        requires a public URL we'd have to host, whereas the media store keeps the
        PDF inside Meta's 30-day TTL and only the recipient downloads it.
        """
        url = f"{self._base}/{self.phone_number_id}/media"
        try:
            resp = httpx.post(
                url,
                headers={"Authorization": f"Bearer {self.access_token}"},
                data={"messaging_product": "whatsapp", "type": mime_type},
                files={"file": (filename, content, mime_type)},
                timeout=self._timeout,
            )
        except httpx.HTTPError as e:
            raise MetaTransientError(f"network error: {e}") from e
        self._raise_for_status(resp)
        return resp.json()["id"]

    def send_document(
        self, *, to: str, media_id: str, filename: str | None = None,
        caption: str | None = None,
    ) -> str:
        """Send a previously-uploaded document by media_id. Returns the wamid."""
        document: dict[str, object] = {"id": media_id}
        if filename:
            document["filename"] = filename[:_MAX_DOCUMENT_FILENAME]
        if caption:
            document["caption"] = caption[:_MAX_DOCUMENT_CAPTION]
        return self._send(
            {
                "messaging_product": "whatsapp",
                "to": to.lstrip("+"),
                "type": "document",
                "document": document,
            }
        )

    def send_document_from_bytes(
        self, *, to: str, content: bytes, filename: str, mime_type: str = "application/pdf",
        caption: str | None = None,
    ) -> str:
        """Convenience: upload then send in one call."""
        media_id = self.upload_media(content=content, filename=filename, mime_type=mime_type)
        return self.send_document(to=to, media_id=media_id, filename=filename, caption=caption)

    def fetch_media(self, media_id: str) -> bytes:
        """Two-step Graph media download: resolve the media URL, then GET the bytes."""
        headers = {"Authorization": f"Bearer {self.access_token}"}
        try:
            meta = httpx.get(f"{self._base}/{media_id}", headers=headers, timeout=self._timeout)
            self._raise_for_status(meta)
            url = meta.json()["url"]
            blob = httpx.get(url, headers=headers, timeout=self._timeout)
            self._raise_for_status(blob)
        except httpx.HTTPError as e:
            raise MetaTransientError(f"network error: {e}") from e
        return blob.content

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
            raise MetaTransientError(f"meta {resp.status_code}: {_scrub_auth(resp.text[:200])}")
        try:
            err = resp.json().get("error", {})
        except ValueError:
            raise MetaInvalidMessage(
                f"meta {resp.status_code}: {_scrub_auth(resp.text[:200])}"
            ) from None
        code = err.get("code")
        if code in _RETRYABLE_ERROR_CODES:
            raise MetaTransientError(f"meta retryable {code}: {err.get('message')}")
        if code == _WINDOW_EXPIRED_CODE:
            raise Meta24HourWindowExpired(err.get("message", "24h window expired"))
        raise MetaInvalidMessage(f"meta {code}: {err.get('message')}")
