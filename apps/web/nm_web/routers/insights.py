"""Calendar + portfolio analytics over the team-visible case book."""
from __future__ import annotations

from collections import Counter
from datetime import date, timedelta

from fastapi import APIRouter, Depends, Response
from sqlalchemy.orm import Session

from nm_core.cases import CaseRepository
from nm_core.db.models.user import User
from nm_core.teams import accessible_user_ids
from nm_web import serializers
from nm_web.deps import get_current_user, get_db

router = APIRouter(prefix="/api", tags=["insights"])


@router.get("/calendar")
def calendar(
    from_: str | None = None,
    to: str | None = None,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> dict:
    start = date.fromisoformat(from_) if from_ else date.today()
    end = date.fromisoformat(to) if to else start + timedelta(days=30)
    cases = CaseRepository(db).list_visible(accessible_user_ids(db, user))
    rows = [
        c for c in cases if c.next_hearing_date and start <= c.next_hearing_date <= end
    ]
    rows.sort(key=lambda c: c.next_hearing_date)
    return {
        "from": start.isoformat(),
        "to": end.isoformat(),
        "hearings": [serializers.case_summary(c) for c in rows],
    }


def _ical_escape(text: str) -> str:
    """Escape text for an iCalendar value (RFC 5545)."""
    if not text:
        return ""
    return (text.replace("\\", "\\\\").replace(";", "\\;")
            .replace(",", "\\,").replace("\n", "\\n"))


@router.get("/calendar/export.ics")
def calendar_ics(
    from_: str | None = None,
    to: str | None = None,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> Response:
    """Downloadable .ics of the user's hearings (all-day VEVENTs), importable anywhere."""
    start = date.fromisoformat(from_) if from_ else date.today()
    end = date.fromisoformat(to) if to else start + timedelta(days=90)
    cases = CaseRepository(db).list_visible(accessible_user_ids(db, user))
    rows = sorted(
        (c for c in cases if c.next_hearing_date and start <= c.next_hearing_date <= end),
        key=lambda c: c.next_hearing_date,
    )
    lines = ["BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//Nowlez Munshi//Hearings//EN"]
    for idx, c in enumerate(rows):
        date_str = c.next_hearing_date.strftime("%Y%m%d")
        lines += [
            "BEGIN:VEVENT",
            f"DTSTART;VALUE=DATE:{date_str}",
            f"SUMMARY:{_ical_escape(c.title or c.cnr)}",
            f"DESCRIPTION:{_ical_escape(c.stage or '')}",
            f"UID:{c.cnr}-hearing-{date_str}-{idx}@nowlez.in",
            "END:VEVENT",
        ]
    lines.append("END:VCALENDAR")
    return Response(
        content="\r\n".join(lines),
        media_type="text/calendar",
        headers={"Content-Disposition": 'attachment; filename="nowlez-munshi-hearings.ics"'},
    )


@router.get("/analytics")
def analytics(user: User = Depends(get_current_user), db: Session = Depends(get_db)) -> dict:
    cases = CaseRepository(db).list_visible(accessible_user_ids(db, user))
    today = date.today()
    by_portal: Counter = Counter()
    by_stage: Counter = Counter()
    upcoming_7 = upcoming_30 = 0
    for c in cases:
        by_portal[c.portal] += 1
        by_stage[(c.stage or "unknown").strip()] += 1
        if c.next_hearing_date:
            delta = (c.next_hearing_date - today).days
            if 0 <= delta <= 7:
                upcoming_7 += 1
            if 0 <= delta <= 30:
                upcoming_30 += 1
    return {
        "total": len(cases),
        "by_portal": dict(by_portal),
        "by_stage": dict(by_stage),
        "upcoming_7": upcoming_7,
        "upcoming_30": upcoming_30,
    }
