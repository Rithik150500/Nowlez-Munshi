"""Send an OTP via MSG91's v5 OTP endpoint (query-string params)."""
from __future__ import annotations

import httpx

from nm_core.config import get_settings
from nm_core.identity.errors import DeliveryFailed

_MSG91_URL = "https://api.msg91.com/api/v5/otp"


def send_otp_sms(
    phone: str,
    code: str,
    *,
    auth_key: str | None = None,
    template_id: str | None = None,
    sender_id: str | None = None,
    timeout_seconds: float | None = None,
) -> str:
    """Returns the MSG91 ``request_id``. Raises ``DeliveryFailed`` on any error."""
    s = get_settings()
    key = auth_key or s.MSG91_AUTH_KEY
    tpl = template_id or s.MSG91_OTP_TEMPLATE_ID
    sender = sender_id or s.MSG91_SENDER_ID
    timeout = timeout_seconds or s.SMS_SEND_TIMEOUT_SECONDS
    if not key or not tpl:
        raise DeliveryFailed("sms", "MSG91 credentials not configured")

    params = {
        "template_id": tpl,
        "mobile": phone.lstrip("+"),
        "authkey": key,
        "otp": code,
        "sender": sender,
    }
    try:
        resp = httpx.post(_MSG91_URL, params=params, timeout=timeout)
        try:
            data = resp.json()
        except ValueError:
            data = {}
        if resp.status_code != 200 or data.get("type") != "success":
            raise DeliveryFailed("sms", f"MSG91 {resp.status_code}: {data}")
        return data.get("request_id", "")
    except httpx.HTTPError as e:
        raise DeliveryFailed("sms", str(e)) from e
