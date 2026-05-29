"""WhatsApp webhook app. GET verifies the handshake; POST processes inbound messages."""
from __future__ import annotations

import logging

from fastapi import FastAPI, Request, Response

from nm_bot.commands import handle_message
from nm_core import messaging
from nm_core.config import get_settings
from nm_core.db.engine import session_scope

logger = logging.getLogger("nm_bot")
app = FastAPI(title="Nowlez Munshi — WhatsApp bot")


@app.get("/health")
def health() -> dict:
    return {"status": "ok"}


@app.get("/webhook")
def verify(request: Request) -> Response:
    """Meta subscription handshake."""
    params = request.query_params
    if (
        params.get("hub.mode") == "subscribe"
        and params.get("hub.verify_token") == get_settings().META_VERIFY_TOKEN
    ):
        return Response(content=params.get("hub.challenge", ""), media_type="text/plain")
    return Response(status_code=403)


@app.post("/webhook")
async def inbound(request: Request) -> Response:
    body = await request.body()
    settings = get_settings()
    sig = request.headers.get("X-Hub-Signature-256")
    if settings.META_APP_SECRET and not messaging.verify_signature(
        body, sig, settings.META_APP_SECRET
    ):
        return Response(status_code=403)

    payload = await request.json()
    for msg in messaging.parse_incoming(payload):
        _process(msg)
    return Response(status_code=200)


def _process(msg: messaging.IncomingMessage) -> None:
    """Claim, route, and reply in ONE transaction.

    If the reply send fails (e.g. a transient Meta error propagates), the whole
    transaction — including the inbound claim — rolls back, so Meta's webhook retry
    reprocesses the message instead of the reply being silently lost. Reprocessing is
    idempotent (find-or-create user, upsert case).
    """
    try:
        with session_scope() as session:
            if not messaging.claim_inbound(session, meta_message_id=msg.meta_message_id):
                return  # Meta retry of an already-handled message
            text = _resolve_image_cnr(msg) if msg.type == "image" else msg.text
            if msg.type == "image" and text is None:
                messaging.enqueue_send_text(
                    to_phone=msg.from_phone,
                    body="Couldn't read a case QR from that image. Send the CNR as text instead.",
                )
                return
            reply = handle_message(
                session, from_phone=msg.from_phone, text=text, button_payload=msg.button_payload
            )
            messaging.enqueue_send_text(to_phone=msg.from_phone, body=reply)
    except Exception:  # noqa: BLE001 — never 500 the webhook; Meta would retry-storm
        logger.exception("failed to process inbound %s", msg.meta_message_id)


def _resolve_image_cnr(msg: messaging.IncomingMessage) -> str | None:
    """Fetch an image attachment and decode a CNR from its QR code (None if unreadable)."""
    if not msg.media_id:
        return None
    try:
        data = messaging.MetaClient().fetch_media(msg.media_id)
    except Exception:  # noqa: BLE001 — media fetch failures shouldn't 500 the webhook
        logger.exception("failed to fetch media %s", msg.media_id)
        return None
    return messaging.decode_cnr_from_image(data)
