"""WhatsApp (Meta) messaging: send client, webhook verify/parse, idempotency/dedup."""
from __future__ import annotations

from nm_core.messaging import errors
from nm_core.messaging.client import MetaClient
from nm_core.messaging.idempotency import claim_daily_slot, claim_inbound
from nm_core.messaging.send import send_daily_template, send_text
from nm_core.messaging.webhook import (
    DeliveryStatus,
    IncomingMessage,
    parse_incoming,
    parse_status_updates,
    validate_secret,
    verify_signature,
)

__all__ = [
    "DeliveryStatus",
    "IncomingMessage",
    "MetaClient",
    "claim_daily_slot",
    "claim_inbound",
    "errors",
    "parse_incoming",
    "parse_status_updates",
    "send_daily_template",
    "send_text",
    "validate_secret",
    "verify_signature",
]
