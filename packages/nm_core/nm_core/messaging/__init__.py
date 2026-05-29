"""WhatsApp (Meta) messaging: send client, webhook verify/parse, idempotency/dedup."""
from __future__ import annotations

from nm_core.messaging import errors
from nm_core.messaging.client import MetaClient
from nm_core.messaging.idempotency import claim_daily_slot, claim_inbound
from nm_core.messaging.qr import decode_cnr_from_image
from nm_core.messaging.queue import (
    enqueue_send_daily_template,
    enqueue_send_document,
    enqueue_send_text,
)
from nm_core.messaging.send import (
    send_daily_template,
    send_document,
    send_interactive_buttons,
    send_interactive_list,
    send_text,
)
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
    "decode_cnr_from_image",
    "enqueue_send_daily_template",
    "enqueue_send_document",
    "enqueue_send_text",
    "errors",
    "parse_incoming",
    "parse_status_updates",
    "send_daily_template",
    "send_document",
    "send_interactive_buttons",
    "send_interactive_list",
    "send_text",
    "validate_secret",
    "verify_signature",
]
