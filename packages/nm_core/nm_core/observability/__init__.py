"""Structured logging, an in-process metrics registry, and Sentry init.

The metrics registry is a minimal counters+gauges facade so the rest of the code can
record signals without a hard Prometheus/StatsD dependency; the web app exposes a
snapshot. Swap the registry for a real exporter later without touching call sites.
"""
from __future__ import annotations

import logging
from collections import defaultdict

logger = logging.getLogger("nm_core")

_counters: dict[str, float] = defaultdict(float)
_gauges: dict[str, float] = {}


def get_logger(name: str) -> logging.Logger:
    return logging.getLogger(name)


def incr(name: str, n: float = 1.0) -> None:
    _counters[name] += n


def gauge(name: str, value: float) -> None:
    _gauges[name] = value


def snapshot() -> dict[str, dict[str, float]]:
    return {"counters": dict(_counters), "gauges": dict(_gauges)}


def reset() -> None:
    _counters.clear()
    _gauges.clear()


def init_sentry() -> bool:
    """Initialise Sentry if SENTRY_DSN is set and the SDK is installed. Returns success."""
    from nm_core.config import get_settings

    dsn = get_settings().SENTRY_DSN
    if not dsn:
        return False
    try:
        import sentry_sdk

        sentry_sdk.init(dsn=dsn, traces_sample_rate=0.0)
        return True
    except Exception:  # noqa: BLE001 — observability must never crash the app
        logger.warning("Sentry DSN set but sentry_sdk init failed", exc_info=True)
        return False
