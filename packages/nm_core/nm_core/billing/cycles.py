"""Anniversary-based Munshi billing-cycle math (postpaid).

Every paid Munshi user has a billing anniversary day-of-month. Each month the
postpaid invoice covers the window *(previous anniversary, today]* — no proration.
Both functions are deterministic and IST-based.

Day-of-month clamping: a day above the target month's length snaps to the month's
last day, but the *original* anniversary day is remembered — so a Jan-31 anniversary
clamps to Feb-28 (2026, non-leap) yet restores to Mar-31 the next cycle. IST has no
DST, so returned datetimes always carry +05:30.
"""
from __future__ import annotations

import calendar
from datetime import date, datetime
from zoneinfo import ZoneInfo

IST: ZoneInfo = ZoneInfo("Asia/Kolkata")


def _clamp_day_to_month(year: int, month: int, day: int) -> date:
    """date(year, month, min(day, last_day_of_month)) — snaps e.g. day=31 in Feb."""
    max_day = calendar.monthrange(year, month)[1]
    return date(year, month, min(day, max_day))


def _previous_anniversary_calendar_day(anniversary_day: int, today: date) -> date:
    """Most recent calendar date < today matching the (clamped) anniversary day."""
    candidate = _clamp_day_to_month(today.year, today.month, anniversary_day)
    if candidate < today:
        return candidate
    if today.month == 1:
        prev_year, prev_month = today.year - 1, 12
    else:
        prev_year, prev_month = today.year, today.month - 1
    return _clamp_day_to_month(prev_year, prev_month, anniversary_day)


def is_anniversary(anniversary_day: int, today: date) -> bool:
    """True if ``today`` is the user's (clamped) billing anniversary — i.e. invoice day."""
    return _clamp_day_to_month(today.year, today.month, anniversary_day) == today


def compute_cycle_window(anniversary_date: date, today: date) -> tuple[datetime, datetime]:
    """Return (cycle_start, cycle_end) IST datetimes for the cycle ending on ``today``.

    Only the day-of-month of ``anniversary_date`` is used."""
    prev = _previous_anniversary_calendar_day(anniversary_date.day, today)
    return (
        datetime(prev.year, prev.month, prev.day, tzinfo=IST),
        datetime(today.year, today.month, today.day, tzinfo=IST),
    )


def next_anniversary_date(anniversary: date, today: date) -> date:
    """Calendar date of the next anniversary strictly after ``today`` (clamped, with the
    original day remembered for subsequent months)."""
    anniversary_day = anniversary.day
    year, month = today.year, today.month
    for _ in range(14):  # ≤13 steps to advance at most a year
        candidate = _clamp_day_to_month(year, month, anniversary_day)
        if candidate > today:
            return candidate
        year, month = (year + 1, 1) if month == 12 else (year, month + 1)
    raise RuntimeError("Failed to locate next anniversary within 14 months")  # unreachable
