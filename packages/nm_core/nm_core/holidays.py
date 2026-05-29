"""Court-holiday calendar — digests are suppressed on holidays.

A minimal built-in set of national court holidays (extend per-jurisdiction via the
``extra`` argument or a future config source). Weekends are intentionally NOT treated
as holidays here: the tomorrow-hearing digest is driven by what eCourts actually lists,
not by a sitting-day assumption.
"""
from __future__ import annotations

from datetime import date

# National holidays courts observe (illustrative 2026 set; extend as needed).
COURT_HOLIDAYS: frozenset[date] = frozenset({
    date(2026, 1, 26),   # Republic Day
    date(2026, 8, 15),   # Independence Day
    date(2026, 10, 2),   # Gandhi Jayanti
    date(2026, 12, 25),  # Christmas
})


def is_court_holiday(day: date, *, extra: frozenset[date] | set[date] | None = None) -> bool:
    return day in COURT_HOLIDAYS or (extra is not None and day in extra)
