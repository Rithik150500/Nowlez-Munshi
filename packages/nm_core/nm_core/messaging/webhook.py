"""Meta webhook: signature verification + inbound message / status parsing."""
from __future__ import annotations

import hashlib
import hmac
from dataclasses import dataclass, field
from typing import Any


def validate_secret(secret: str) -> None:
    """Catch the common .env mistakes that silently break HMAC verification."""
    if not secret:
        raise ValueError("META_APP_SECRET is empty")
    if secret != secret.strip():
        raise ValueError("META_APP_SECRET has leading/trailing whitespace")
    if secret.startswith("﻿"):
        raise ValueError("META_APP_SECRET has a UTF-8 BOM")


def verify_signature(body: bytes, header: str | None, secret: str) -> bool:
    """Constant-time check of Meta's X-Hub-Signature-256 header."""
    if not header or not header.startswith("sha256="):
        return False
    expected = hmac.new(secret.encode(), body, hashlib.sha256).hexdigest()
    return hmac.compare_digest(expected, header[len("sha256=") :])


@dataclass(frozen=True)
class IncomingMessage:
    meta_message_id: str
    from_phone: str  # E.164 with leading +
    timestamp: int
    type: str
    text: str | None = None
    button_payload: str | None = None
    raw: dict = field(default_factory=dict)


@dataclass(frozen=True)
class DeliveryStatus:
    meta_message_id: str
    recipient_id: str
    status: str  # sent | delivered | read | failed
    timestamp: int
    failure_reason: str | None = None


def _one_message(m: dict[str, Any]) -> IncomingMessage:
    raw_from = str(m.get("from", ""))
    from_phone = raw_from if raw_from.startswith("+") else "+" + raw_from
    msg_type = m.get("type", "unknown")
    text = None
    button_payload = None
    if msg_type == "text":
        text = (m.get("text") or {}).get("body")
    elif msg_type == "interactive":
        inter = m.get("interactive") or {}
        reply = inter.get("button_reply") or inter.get("list_reply") or {}
        button_payload = reply.get("id")
        text = reply.get("title")
    elif msg_type == "button":
        button_payload = (m.get("button") or {}).get("payload")
        text = (m.get("button") or {}).get("text")
    return IncomingMessage(
        meta_message_id=m.get("id", ""),
        from_phone=from_phone,
        timestamp=int(m.get("timestamp", 0)),
        type=msg_type,
        text=text,
        button_payload=button_payload,
        raw=m,
    )


def parse_incoming(payload: dict[str, Any]) -> list[IncomingMessage]:
    out: list[IncomingMessage] = []
    for entry in payload.get("entry", []):
        for change in entry.get("changes", []):
            for m in (change.get("value", {}) or {}).get("messages", []) or []:
                out.append(_one_message(m))
    return out


def parse_status_updates(payload: dict[str, Any]) -> list[DeliveryStatus]:
    out: list[DeliveryStatus] = []
    for entry in payload.get("entry", []):
        for change in entry.get("changes", []):
            for s in (change.get("value", {}) or {}).get("statuses", []) or []:
                err = (s.get("errors") or [{}])[0]
                out.append(
                    DeliveryStatus(
                        meta_message_id=s.get("id", ""),
                        recipient_id=s.get("recipient_id", ""),
                        status=s.get("status", ""),
                        timestamp=int(s.get("timestamp", 0)),
                        failure_reason=err.get("title") or err.get("message"),
                    )
                )
    return out
