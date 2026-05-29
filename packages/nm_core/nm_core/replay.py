"""Single-use token guard: a Redis replay store (consume-once).

Fail-open (allow if Redis is unreachable) so an outage degrades to TTL-only security
rather than locking users out. Used for one-shot continuity link tokens.
"""
from __future__ import annotations

import logging

import redis as redis_lib

from nm_core.config import get_settings

logger = logging.getLogger("nm_core.replay")

_client: redis_lib.Redis | None = None


def get_redis() -> redis_lib.Redis:
    global _client
    if _client is None:
        _client = redis_lib.Redis.from_url(get_settings().REDIS_URL)
    return _client


def consume_once(jti: str, *, ttl_seconds: int) -> bool:
    """Return True the first time this jti is seen; False on replay (or always True
    if Redis is down — fail-open to TTL-only)."""
    try:
        return bool(get_redis().set(name=f"jti:{jti}", value="1", nx=True, ex=ttl_seconds))
    except Exception as e:  # noqa: BLE001
        logger.warning("replay store unavailable (%s); allowing token", e)
        return True
