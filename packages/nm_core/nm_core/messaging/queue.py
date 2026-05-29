"""Outbound send queue (RQ). Producer-side dedup + enqueue; the worker runs the job.

Logical dedup happens HERE (at enqueue); delivery retry is RQ's job. In dev/tests
``RQ_SYNC`` runs jobs inline (no worker, no real Redis needed beyond fakeredis).
"""
from __future__ import annotations

import logging
import uuid

from rq import Queue, Retry

from nm_core.config import get_settings
from nm_core.messaging import jobs
from nm_core.messaging.idempotency import claim_daily_slot
from nm_core.messaging.redis_dedup import claim_send_dedup, get_redis
from nm_core.messaging.send import _today_ist

logger = logging.getLogger("nm_core.messaging.queue")

QUEUE_NAME = "wa_send"
_RETRY = Retry(max=3, interval=[60, 300, 900])


def _queue() -> Queue:
    # Share the dedup Redis connection (tests fake it); is_async=False runs inline.
    return Queue(QUEUE_NAME, connection=get_redis(), is_async=not get_settings().RQ_SYNC)


def enqueue_send_text(
    *,
    to_phone: str,
    body: str,
    user_id: uuid.UUID | None = None,
    dedup_key: str | None = None,
) -> bool:
    """Enqueue a text send. Returns False if suppressed (kill-switch or logical dup)."""
    if get_settings().WHATSAPP_DISABLED:
        return False
    if dedup_key and not claim_send_dedup(dedup_key):
        return False  # logical duplicate — already sent/queued
    _queue().enqueue(
        jobs.do_send_text,
        to_phone=to_phone,
        body=body,
        user_id=str(user_id) if user_id else None,
        dedup_key=dedup_key,
        retry=_RETRY,
    )
    return True


def enqueue_send_daily_template(
    session,
    *,
    user_id: uuid.UUID,
    to_phone: str,
    template_name: str,
    language: str,
    body_variables: list[object],
) -> bool:
    """Claim the per-day slot (cross-pod safe) then enqueue. False if already sent today."""
    if get_settings().WHATSAPP_DISABLED:
        return False
    if not claim_daily_slot(
        session, user_id=user_id, template_name=template_name,
        send_date_ist=_today_ist(), to_phone=to_phone,
    ):
        return False
    _queue().enqueue(
        jobs.do_send_template,
        user_id=str(user_id),
        to_phone=to_phone,
        template_name=template_name,
        language=language,
        body_variables=body_variables,
        retry=_RETRY,
    )
    return True
