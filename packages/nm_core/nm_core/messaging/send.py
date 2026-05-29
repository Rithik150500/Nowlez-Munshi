"""Outbound send: producer-side dedup (send_text/send_daily_template) over a raw
delivery primitive (_deliver_*) that the RQ job also calls.

Split rationale: logical dedup (don't send the same alert twice) belongs at the
*producer* (enqueue / inline call); delivery *retry* belongs to the job/RQ. So the job
runs the raw `_deliver_*` (no dedup) — a transient retry actually re-sends instead of
being short-circuited by its own dedup key.
"""
from __future__ import annotations

import uuid
from collections.abc import Callable
from datetime import UTC, date, datetime
from zoneinfo import ZoneInfo

from sqlalchemy.orm import Session

from nm_core import observability
from nm_core.config import get_settings
from nm_core.db.models.messaging import OutboundMessage
from nm_core.messaging.client import MetaClient
from nm_core.messaging.errors import Meta24HourWindowExpired, MetaInvalidMessage
from nm_core.messaging.idempotency import claim_daily_slot
from nm_core.messaging.redis_dedup import claim_send_dedup
from nm_core.storage import get_storage

_IST = ZoneInfo("Asia/Kolkata")
_MAX_DOCUMENT_BYTES = 16 * 1024 * 1024  # Meta's document size ceiling


def _today_ist() -> date:
    return datetime.now(UTC).astimezone(_IST).date()


def _log(
    session: Session,
    *,
    user_id: uuid.UUID | None,
    to_phone: str,
    kind: str,
    provider_message_id: str | None,
    status: str,
    error_code: str | None = None,
    dedup_key: str | None = None,
) -> None:
    session.add(
        OutboundMessage(
            user_id=user_id,
            to_phone=to_phone,
            kind=kind,
            provider_message_id=provider_message_id,
            status=status,
            error_code=error_code,
            dedup_key=dedup_key,
        )
    )
    session.flush()


# --- raw delivery (no dedup; MetaTransientError propagates for retry) ---
def _deliver_text(
    session: Session,
    *,
    to_phone: str,
    body: str,
    user_id: uuid.UUID | None = None,
    dedup_key: str | None = None,
    client: MetaClient | None = None,
) -> str | None:
    client = client or MetaClient()
    try:
        wamid = client.send_text(to_phone, body)
    except (MetaInvalidMessage, Meta24HourWindowExpired) as e:
        observability.incr("whatsapp.send.failed")
        _log(session, user_id=user_id, to_phone=to_phone, kind="text",
             provider_message_id=None, status="failed", error_code=type(e).__name__,
             dedup_key=dedup_key)
        return None
    observability.incr("whatsapp.send.sent")
    _log(session, user_id=user_id, to_phone=to_phone, kind="text",
         provider_message_id=wamid, status="sent", dedup_key=dedup_key)
    return wamid


def _deliver_template(
    session: Session,
    *,
    user_id: uuid.UUID,
    to_phone: str,
    template_name: str,
    language: str,
    body_variables: list[object],
    client: MetaClient | None = None,
) -> str | None:
    client = client or MetaClient()
    try:
        wamid = client.send_template(
            to=to_phone, name=template_name, language=language, body_variables=body_variables
        )
    except (MetaInvalidMessage, Meta24HourWindowExpired) as e:
        observability.incr("whatsapp.send.failed")
        _log(session, user_id=user_id, to_phone=to_phone, kind="template",
             provider_message_id=None, status="failed", error_code=type(e).__name__)
        return None
    observability.incr("whatsapp.send.sent")
    _log(session, user_id=user_id, to_phone=to_phone, kind="template",
         provider_message_id=wamid, status="sent")
    return wamid


# --- inline convenience (kill-switch + dedup + deliver) ---
def send_text(
    session: Session,
    *,
    to_phone: str,
    body: str,
    user_id: uuid.UUID | None = None,
    dedup_key: str | None = None,
    client: MetaClient | None = None,
) -> str | None:
    """Send a free-text WhatsApp message inline. Honors kill-switch + dedup."""
    if get_settings().WHATSAPP_DISABLED:
        return None
    if dedup_key and not claim_send_dedup(dedup_key):
        return None
    return _deliver_text(
        session, to_phone=to_phone, body=body, user_id=user_id, dedup_key=dedup_key, client=client
    )


def send_daily_template(
    session: Session,
    *,
    user_id: uuid.UUID,
    to_phone: str,
    template_name: str,
    language: str,
    body_variables: list[object],
    client: MetaClient | None = None,
) -> str | None:
    """Send a daily-cadence template inline, claiming the per-day DB slot first."""
    if get_settings().WHATSAPP_DISABLED:
        return None
    if not claim_daily_slot(
        session, user_id=user_id, template_name=template_name,
        send_date_ist=_today_ist(), to_phone=to_phone,
    ):
        return None  # already sent today
    return _deliver_template(
        session, user_id=user_id, to_phone=to_phone, template_name=template_name,
        language=language, body_variables=body_variables, client=client,
    )


# --- interactive (buttons / lists) — used inline by the bot's reply path ---
def _deliver_interactive(
    session: Session,
    *,
    to_phone: str,
    user_id: uuid.UUID | None,
    send: Callable[[], str],
) -> str | None:
    try:
        wamid = send()
    except (MetaInvalidMessage, Meta24HourWindowExpired) as e:
        observability.incr("whatsapp.send.failed")
        _log(session, user_id=user_id, to_phone=to_phone, kind="interactive",
             provider_message_id=None, status="failed", error_code=type(e).__name__)
        return None
    observability.incr("whatsapp.send.sent")
    _log(session, user_id=user_id, to_phone=to_phone, kind="interactive",
         provider_message_id=wamid, status="sent")
    return wamid


def send_interactive_buttons(
    session: Session,
    *,
    to_phone: str,
    body: str,
    buttons: list[dict[str, str]],
    user_id: uuid.UUID | None = None,
    client: MetaClient | None = None,
) -> str | None:
    """Send up to 3 reply buttons inline. Honors the kill-switch."""
    if get_settings().WHATSAPP_DISABLED:
        return None
    c = client or MetaClient()
    return _deliver_interactive(
        session, to_phone=to_phone, user_id=user_id,
        send=lambda: c.send_interactive_buttons(to=to_phone, body=body, buttons=buttons),
    )


def send_interactive_list(
    session: Session,
    *,
    to_phone: str,
    body: str,
    button_label: str,
    rows: list[dict[str, str]],
    user_id: uuid.UUID | None = None,
    client: MetaClient | None = None,
) -> str | None:
    """Send a tap-to-pick list inline. Honors the kill-switch."""
    if get_settings().WHATSAPP_DISABLED:
        return None
    c = client or MetaClient()
    return _deliver_interactive(
        session, to_phone=to_phone, user_id=user_id,
        send=lambda: c.send_interactive_list(
            to=to_phone, body=body, button_label=button_label, rows=rows
        ),
    )


# --- document (PDF) delivery: queue carries a storage KEY, the job resolves bytes ---
def _deliver_document(
    session: Session,
    *,
    to_phone: str,
    storage_key: str,
    filename: str,
    caption: str | None = None,
    user_id: uuid.UUID | None = None,
    dedup_key: str | None = None,
    client: MetaClient | None = None,
) -> str | None:
    """Resolve the storage key to bytes (16 MB cap), upload to Meta, and send.

    The queue payload carries the *key* (not the bytes) so a transient retry
    re-reads from storage instead of dragging a multi-MB blob through Redis.
    """
    data = get_storage().get(storage_key)
    if len(data) > _MAX_DOCUMENT_BYTES:
        observability.incr("whatsapp.send.failed")
        _log(session, user_id=user_id, to_phone=to_phone, kind="document",
             provider_message_id=None, status="failed", error_code="DocumentTooLarge",
             dedup_key=dedup_key)
        return None
    client = client or MetaClient()
    try:
        wamid = client.send_document_from_bytes(
            to=to_phone, content=data, filename=filename, caption=caption
        )
    except (MetaInvalidMessage, Meta24HourWindowExpired) as e:
        observability.incr("whatsapp.send.failed")
        _log(session, user_id=user_id, to_phone=to_phone, kind="document",
             provider_message_id=None, status="failed", error_code=type(e).__name__,
             dedup_key=dedup_key)
        return None
    observability.incr("whatsapp.send.sent")
    _log(session, user_id=user_id, to_phone=to_phone, kind="document",
         provider_message_id=wamid, status="sent", dedup_key=dedup_key)
    return wamid


def send_document(
    session: Session,
    *,
    to_phone: str,
    storage_key: str,
    filename: str,
    caption: str | None = None,
    user_id: uuid.UUID | None = None,
    dedup_key: str | None = None,
    client: MetaClient | None = None,
) -> str | None:
    """Send a stored document (e.g. an order PDF) inline. Honors kill-switch + dedup."""
    if get_settings().WHATSAPP_DISABLED:
        return None
    if dedup_key and not claim_send_dedup(dedup_key):
        return None
    return _deliver_document(
        session, to_phone=to_phone, storage_key=storage_key, filename=filename,
        caption=caption, user_id=user_id, dedup_key=dedup_key, client=client,
    )
