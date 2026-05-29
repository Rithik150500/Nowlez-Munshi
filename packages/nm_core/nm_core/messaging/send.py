"""High-level outbound send: kill-switch + dedup + delivery logging.

Returns the wamid on success, or None when the send was suppressed (kill-switch,
dedup hit, or a non-retryable Meta error). MetaTransientError propagates so the
caller can retry.
"""
from __future__ import annotations

import uuid
from datetime import UTC, date, datetime
from zoneinfo import ZoneInfo

from sqlalchemy.orm import Session

from nm_core.config import get_settings
from nm_core.db.models.messaging import OutboundMessage
from nm_core.messaging.client import MetaClient
from nm_core.messaging.errors import Meta24HourWindowExpired, MetaInvalidMessage
from nm_core.messaging.idempotency import claim_daily_slot
from nm_core.messaging.redis_dedup import claim_send_dedup

_IST = ZoneInfo("Asia/Kolkata")


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


def send_text(
    session: Session,
    *,
    to_phone: str,
    body: str,
    user_id: uuid.UUID | None = None,
    dedup_key: str | None = None,
    client: MetaClient | None = None,
) -> str | None:
    """Send a free-text WhatsApp message (24h-window). Honors kill-switch + dedup."""
    if get_settings().WHATSAPP_DISABLED:
        return None
    if dedup_key and not claim_send_dedup(dedup_key):
        return None
    client = client or MetaClient()
    try:
        wamid = client.send_text(to_phone, body)
    except (MetaInvalidMessage, Meta24HourWindowExpired) as e:
        _log(
            session,
            user_id=user_id,
            to_phone=to_phone,
            kind="text",
            provider_message_id=None,
            status="failed",
            error_code=type(e).__name__,
            dedup_key=dedup_key,
        )
        return None
    _log(
        session,
        user_id=user_id,
        to_phone=to_phone,
        kind="text",
        provider_message_id=wamid,
        status="sent",
        dedup_key=dedup_key,
    )
    return wamid


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
    """Send a daily-cadence template, claiming the per-day DB slot first (cross-pod safe)."""
    if get_settings().WHATSAPP_DISABLED:
        return None
    if not claim_daily_slot(
        session,
        user_id=user_id,
        template_name=template_name,
        send_date_ist=_today_ist(),
        to_phone=to_phone,
    ):
        return None  # already sent today
    client = client or MetaClient()
    try:
        return client.send_template(
            to=to_phone, name=template_name, language=language, body_variables=body_variables
        )
    except (MetaInvalidMessage, Meta24HourWindowExpired):
        return None
