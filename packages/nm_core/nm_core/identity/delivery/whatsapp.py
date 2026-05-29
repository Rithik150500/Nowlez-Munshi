"""Send an OTP via a Meta WhatsApp AUTHENTICATION template (code as body + URL button)."""
from __future__ import annotations

import httpx

from nm_core.config import get_settings
from nm_core.identity.errors import DeliveryFailed

_GRAPH_URL = "https://graph.facebook.com/v21.0/{phone_number_id}/messages"


def send_otp_whatsapp(
    phone: str,
    code: str,
    *,
    phone_number_id: str | None = None,
    access_token: str | None = None,
    timeout_seconds: float | None = None,
) -> str:
    """Returns the Meta message id (``wamid``). Raises ``DeliveryFailed`` on any error."""
    s = get_settings()
    pid = phone_number_id or s.META_PHONE_NUMBER_ID
    token = access_token or s.META_ACCESS_TOKEN
    timeout = timeout_seconds or s.WHATSAPP_SEND_TIMEOUT_SECONDS
    if not pid or not token:
        raise DeliveryFailed("whatsapp", "Meta credentials not configured")

    payload = {
        "messaging_product": "whatsapp",
        "to": phone.lstrip("+"),
        "type": "template",
        "template": {
            "name": s.META_AUTH_TEMPLATE_NAME,
            "language": {"code": "en"},
            "components": [
                {"type": "body", "parameters": [{"type": "text", "text": code}]},
                {
                    "type": "button",
                    "sub_type": "url",
                    "index": "0",
                    "parameters": [{"type": "text", "text": code}],
                },
            ],
        },
    }
    try:
        resp = httpx.post(
            _GRAPH_URL.format(phone_number_id=pid),
            json=payload,
            headers={"Authorization": f"Bearer {token}"},
            timeout=timeout,
        )
        resp.raise_for_status()
        return resp.json()["messages"][0]["id"]
    except (httpx.HTTPError, KeyError, IndexError, ValueError) as e:
        raise DeliveryFailed("whatsapp", str(e)) from e
