"""Redis SETNX dedup for ad-hoc outbound sends. Fail-open if Redis is unreachable."""
from __future__ import annotations

import logging

import redis as redis_lib

from nm_core.config import get_settings

logger = logging.getLogger(__name__)

_client: redis_lib.Redis | None = None


def get_redis() -> redis_lib.Redis:
    global _client
    if _client is None:
        _client = redis_lib.Redis.from_url(get_settings().REDIS_URL)
    return _client


def claim_send_dedup(dedup_key: str, *, ttl_seconds: int = 600) -> bool:
    """Return True if this key was unclaimed (proceed); False if already sent recently."""
    try:
        ok = get_redis().set(name=f"send_dedup:{dedup_key}", value="1", nx=True, ex=ttl_seconds)
        return bool(ok)
    except Exception as e:  # noqa: BLE001 — best-effort, never block a send on Redis
        logger.warning("send_dedup Redis SETNX failed (%s); proceeding", e)
        return True


def release_send_dedup(dedup_key: str) -> None:
    """Undo a claim so the producer can retry — used when the enqueue/send fails after
    the key was claimed (otherwise the message is suppressed for the full TTL)."""
    try:
        get_redis().delete(f"send_dedup:{dedup_key}")
    except Exception as e:  # noqa: BLE001
        logger.warning("send_dedup release failed (%s)", e)
