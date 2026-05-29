"""Synchronous layered resilience: semaphore → circuit breaker → retry.

Only ``CourtSiteDown`` is retried. Named registries are process-global so all
callers share one breaker/semaphore per name; ``reset_registries()`` clears them
for tests.
"""
from __future__ import annotations

import logging
import threading
import time
from collections.abc import Callable
from functools import wraps
from typing import TypeVar

from nm_core.ecourts.errors import CircuitOpen, CourtSiteDown

T = TypeVar("T")
logger = logging.getLogger(__name__)

_RETRIABLE = (CourtSiteDown,)


# --- circuit breaker ---------------------------------------------------------
class CircuitBreaker:
    """3-state breaker: closed → open → half_open → closed."""

    def __init__(
        self,
        *,
        name: str,
        failure_threshold: int = 5,
        recovery_timeout: float = 60.0,
        max_recovery_timeout: float = 1800.0,
    ) -> None:
        self.name = name
        self._failure_threshold = failure_threshold
        self._base_recovery_timeout = recovery_timeout
        self._current_recovery_timeout = recovery_timeout
        self._max_recovery_timeout = max_recovery_timeout
        self._failure_count = 0
        self._last_failure_time = 0.0
        self._state = "closed"
        self._half_open_allowed = False
        self._half_open_time = 0.0
        self._probe_failures = 0
        self._lock = threading.Lock()

    def allow_request(self) -> bool:
        with self._lock:
            now = time.monotonic()
            if self._state == "open" and (
                now - self._last_failure_time
            ) >= self._current_recovery_timeout:
                self._state = "half_open"
                self._half_open_allowed = True
                self._half_open_time = now
            elif self._state == "half_open" and not self._half_open_allowed:
                if (now - self._half_open_time) >= self._base_recovery_timeout:
                    self._half_open_allowed = True
                    self._half_open_time = now
            s = self._state
            if s == "closed":
                return True
            if s == "half_open" and self._half_open_allowed:
                self._half_open_allowed = False
                return True
            return False

    def record_success(self) -> None:
        with self._lock:
            if self._state == "half_open":
                self._probe_failures = 0
                self._current_recovery_timeout = self._base_recovery_timeout
            self._failure_count = 0
            self._state = "closed"
            self._half_open_allowed = False

    def record_failure(self) -> None:
        opened = False
        with self._lock:
            was_open = self._state == "open"
            self._failure_count += 1
            self._last_failure_time = time.monotonic()
            if self._state == "half_open":
                self._probe_failures += 1
                self._current_recovery_timeout = min(
                    self._base_recovery_timeout * (2**self._probe_failures),
                    self._max_recovery_timeout,
                )
                self._state = "open"
            elif self._failure_count >= self._failure_threshold:
                self._state = "open"
            opened = self._state == "open" and not was_open
        if opened:
            from nm_core import observability

            observability.incr("ecourts.circuit_open")

    def time_until_retry(self) -> float:
        with self._lock:
            if self._state != "open":
                return 0.0
            return max(
                0.0, self._current_recovery_timeout - (time.monotonic() - self._last_failure_time)
            )


class _CircuitRegistry:
    _registry: dict[str, CircuitBreaker] = {}
    _lock = threading.Lock()

    @classmethod
    def get(cls, name: str, **kwargs) -> CircuitBreaker:
        with cls._lock:
            if name not in cls._registry:
                cls._registry[name] = CircuitBreaker(name=name, **kwargs)
            return cls._registry[name]

    @classmethod
    def reset(cls) -> None:
        with cls._lock:
            cls._registry.clear()


class _SemaphoreRegistry:
    _registry: dict[str, threading.BoundedSemaphore] = {}
    _lock = threading.Lock()

    @classmethod
    def get(cls, name: str, max_concurrency: int = 10) -> threading.BoundedSemaphore:
        with cls._lock:
            if name not in cls._registry:
                cls._registry[name] = threading.BoundedSemaphore(max_concurrency)
            return cls._registry[name]

    @classmethod
    def reset(cls) -> None:
        with cls._lock:
            cls._registry.clear()


def reset_registries() -> None:
    """Clear circuit + semaphore state (tests)."""
    _CircuitRegistry.reset()
    _SemaphoreRegistry.reset()


def with_circuit_breaker(
    *, name: str, failure_threshold: int = 5, recovery_timeout: float = 60.0
) -> Callable[[Callable[..., T]], Callable[..., T]]:
    def decorator(fn: Callable[..., T]) -> Callable[..., T]:
        @wraps(fn)
        def wrapper(*args, **kwargs):
            cb = _CircuitRegistry.get(
                name, failure_threshold=failure_threshold, recovery_timeout=recovery_timeout
            )
            if not cb.allow_request():
                raise CircuitOpen(name=name, retry_after_seconds=cb.time_until_retry())
            try:
                result = fn(*args, **kwargs)
            except Exception:
                cb.record_failure()
                raise
            cb.record_success()
            return result

        return wrapper

    return decorator


def with_retry(
    *, max_attempts: int = 3, base_delay: float = 1.0, max_delay: float = 30.0
) -> Callable[[Callable[..., T]], Callable[..., T]]:
    def decorator(fn: Callable[..., T]) -> Callable[..., T]:
        @wraps(fn)
        def wrapper(*args, **kwargs):
            last_exc: Exception | None = None
            for attempt in range(max_attempts):
                try:
                    return fn(*args, **kwargs)
                except _RETRIABLE as e:
                    last_exc = e
                    if attempt + 1 == max_attempts:
                        break
                    delay = min(base_delay * (2**attempt), max_delay)
                    logger.info(
                        "ecourts retry %d/%d after %s in %.2fs",
                        attempt + 1, max_attempts, type(e).__name__, delay,
                    )
                    time.sleep(delay)
            assert last_exc is not None
            raise last_exc

        return wrapper

    return decorator


def with_semaphore(
    *, name: str, max_concurrency: int = 10
) -> Callable[[Callable[..., T]], Callable[..., T]]:
    def decorator(fn: Callable[..., T]) -> Callable[..., T]:
        @wraps(fn)
        def wrapper(*args, **kwargs):
            sem = _SemaphoreRegistry.get(name, max_concurrency=max_concurrency)
            with sem:
                return fn(*args, **kwargs)

        return wrapper

    return decorator
