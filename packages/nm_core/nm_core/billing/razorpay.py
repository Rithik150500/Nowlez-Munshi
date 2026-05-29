"""Razorpay webhook verification + tier extraction.

The webhook body is HMAC-SHA256 signed with RAZORPAY_WEBHOOK_SECRET. We expect the
subscription's ``notes`` to carry our ``account_id`` and ``tier`` (set at checkout).
"""
from __future__ import annotations

import hashlib
import hmac
from typing import Any


def verify_webhook(body: bytes, signature: str | None, secret: str) -> bool:
    if not signature or not secret:
        return False
    expected = hmac.new(secret.encode(), body, hashlib.sha256).hexdigest()
    return hmac.compare_digest(expected, signature)


def extract_account_and_tier(payload: dict[str, Any]) -> tuple[str, str] | None:
    """Pull (account_id, tier) from a subscription webhook's notes; None if absent."""
    try:
        entity = payload["payload"]["subscription"]["entity"]
        notes = entity.get("notes") or {}
        account_id = notes.get("account_id")
        tier = notes.get("tier")
        if account_id and tier:
            return str(account_id), str(tier)
    except (KeyError, TypeError):
        return None
    return None
