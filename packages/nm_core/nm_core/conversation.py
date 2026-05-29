"""Per-user ephemeral conversation state for multi-step WhatsApp flows.

The bot is otherwise stateless (each webhook is request→reply); guided flows like
eCourts party search need to remember "which step are we on / what's been picked".
State is a small JSON dict kept in Redis with a short TTL, keyed by user id, so an
abandoned flow simply expires. Fail-open: if Redis is unreachable we behave as if
there is no active flow (the user just gets the default routing).
"""
from __future__ import annotations

import json
import logging
import uuid

from nm_core.messaging.redis_dedup import get_redis

logger = logging.getLogger(__name__)

_TTL_SECONDS = 900  # 15 min — a guided flow the user walks away from quietly expires


def _key(user_id: uuid.UUID) -> str:
    return f"conv:{user_id}"


def get_state(user_id: uuid.UUID) -> dict | None:
    try:
        raw = get_redis().get(_key(user_id))
    except Exception as e:  # noqa: BLE001 — never block routing on Redis
        logger.warning("conversation get failed (%s); treating as no active flow", e)
        return None
    if not raw:
        return None
    try:
        return json.loads(raw)
    except (ValueError, TypeError):
        return None


def set_state(user_id: uuid.UUID, state: dict, *, ttl_seconds: int = _TTL_SECONDS) -> None:
    try:
        get_redis().set(_key(user_id), json.dumps(state), ex=ttl_seconds)
    except Exception as e:  # noqa: BLE001
        logger.warning("conversation set failed (%s); flow will not persist", e)


def clear_state(user_id: uuid.UUID) -> None:
    try:
        get_redis().delete(_key(user_id))
    except Exception as e:  # noqa: BLE001
        logger.warning("conversation clear failed (%s)", e)
