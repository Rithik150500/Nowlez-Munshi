"""Lightweight fixed-window rate limiting over Redis (fail-open).

Used by the public waitlist/demo endpoints to cap abuse per IP. Like the messaging
dedup, it never blocks a request on a Redis hiccup — if Redis is unreachable the call
is allowed (availability over strictness for these low-stakes public forms)."""
from __future__ import annotations

import logging

from nm_core.messaging.redis_dedup import get_redis

logger = logging.getLogger(__name__)


def allow(key: str, *, limit: int, window_seconds: int) -> bool:
    """Return True if this key is under ``limit`` hits in the current window.

    Fixed-window counter: INCR the key, set its TTL on first hit. Fail-open."""
    redis_key = f"ratelimit:{key}"
    try:
        r = get_redis()
        count = r.incr(redis_key)
        if count == 1:
            r.expire(redis_key, window_seconds)
        return int(count) <= limit
    except Exception as e:  # noqa: BLE001 — never block a request on Redis
        logger.warning("rate-limit check failed (%s); allowing", e)
        return True
