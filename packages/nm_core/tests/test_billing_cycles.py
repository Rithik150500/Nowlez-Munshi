"""Munshi anniversary cycle math — day-clamping + restore, IST, strictly-after."""
from __future__ import annotations

from datetime import date

from nm_core.billing.cycles import (
    IST,
    compute_cycle_window,
    next_anniversary_date,
)


def test_mid_month_no_clamp():
    start, end = compute_cycle_window(date(2026, 3, 15), date(2026, 4, 15))
    assert (start.date(), end.date()) == (date(2026, 3, 15), date(2026, 4, 15))
    assert start.utcoffset().total_seconds() == 5.5 * 3600  # IST +05:30
    assert start.tzinfo is IST


def test_jan31_clamps_to_feb28_non_leap():
    start, end = compute_cycle_window(date(2026, 1, 31), date(2026, 2, 28))
    assert end.date() == date(2026, 2, 28)
    assert start.date() == date(2026, 1, 31)


def test_jan31_clamps_to_feb29_leap():
    _, end = compute_cycle_window(date(2024, 1, 31), date(2024, 2, 29))
    assert end.date() == date(2024, 2, 29)


def test_next_anniversary_strictly_after():
    # On the anniversary day → next is one month later, not today.
    assert next_anniversary_date(date(2026, 1, 15), date(2026, 4, 15)) == date(2026, 5, 15)
    assert next_anniversary_date(date(2026, 1, 15), date(2026, 4, 10)) == date(2026, 4, 15)


def test_jan31_restores_after_clamped_february():
    # Feb clamps to 28, but March restores the full 31 (original day remembered).
    assert next_anniversary_date(date(2026, 1, 31), date(2026, 2, 1)) == date(2026, 2, 28)
    assert next_anniversary_date(date(2026, 1, 31), date(2026, 2, 28)) == date(2026, 3, 31)


def test_year_rollover():
    assert next_anniversary_date(date(2026, 6, 10), date(2026, 12, 31)) == date(2027, 1, 10)
