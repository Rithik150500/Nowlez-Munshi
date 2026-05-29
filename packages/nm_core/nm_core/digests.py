"""Hearing digests: tomorrow's listed cases, per user, via WhatsApp template + email.

Reuses the daily-slot dedup (messaging.enqueue_send_daily_template) so a digest goes
out at most once per user per day even across worker pods. Respects per-case
digest_enabled / snooze.
"""
from __future__ import annotations

import uuid
from collections import defaultdict
from datetime import UTC, date, datetime, timedelta

from sqlalchemy import select
from sqlalchemy.orm import Session

from nm_core import email, messaging
from nm_core.cases import CasePreferenceRepository
from nm_core.consent import is_opted_out
from nm_core.db.models.case import Case
from nm_core.db.models.cause_list import CauseListRow
from nm_core.db.models.user import User
from nm_core.holidays import is_court_holiday

TOMORROW_TEMPLATE = "nowlez_tomorrow_hearings_v1"


def _wanted(pref, now: datetime) -> bool:
    if pref is None:
        return True  # default: digest on
    if not pref.digest_enabled:
        return False
    if pref.snooze_until is not None:
        snooze = pref.snooze_until
        if snooze.tzinfo is None:
            snooze = snooze.replace(tzinfo=UTC)
        if snooze > now:
            return False
    return True


def _listed_on(session: Session, day: date) -> dict[uuid.UUID, list[Case]]:
    """Cases listed on ``day`` per user: the snapshot (Case.next_hearing_date) UNION
    the indexed HC cause-list rows back-resolved to a tracked case, deduped per CNR.

    The union catches the case where NIC publishes the cause-list PDF before the
    monitoring poll updates the case's snapshot next_hearing_date."""
    grouped: dict[uuid.UUID, list[Case]] = defaultdict(list)
    for case in session.execute(select(Case).where(Case.next_hearing_date == day)).scalars():
        grouped[case.user_id].append(case)

    indexed_cnrs = {
        c for c in session.execute(
            select(CauseListRow.cnr).where(
                CauseListRow.list_date == day, CauseListRow.cnr.is_not(None)
            )
        ).scalars()
    }
    if indexed_cnrs:
        for case in session.execute(
            select(Case).where(Case.cnr.in_(indexed_cnrs))
        ).scalars():
            seen = {c.cnr for c in grouped[case.user_id]}
            if case.cnr not in seen:
                grouped[case.user_id].append(case)
    return grouped


def send_tomorrow_digests(
    session: Session, *, today: date | None = None, skip_holidays: bool = True
) -> int:
    """Enqueue + email each user's digest of cases listed tomorrow. Returns count sent."""
    now = datetime.now(UTC)
    tomorrow = (today or now.date()) + timedelta(days=1)
    if skip_holidays and is_court_holiday(tomorrow):
        return 0  # no sittings on a court holiday
    prefs_repo = CasePreferenceRepository(session)
    sent = 0
    for user_id, cases in _listed_on(session, tomorrow).items():
        user = session.get(User, user_id)
        if user is None:
            continue
        prefs = {p.cnr: p for p in prefs_repo.list_for_user(user_id)}
        listed = [c for c in cases if _wanted(prefs.get(c.cnr), now)]
        if not listed:
            continue
        summary = "; ".join(f"{c.title or c.cnr} ({c.cnr})" for c in listed)
        if user.phone and not is_opted_out(user):
            messaging.enqueue_send_daily_template(
                session,
                user_id=user.id,
                to_phone=user.phone,
                template_name=TOMORROW_TEMPLATE,
                language=user.locale,
                body_variables=[str(len(listed)), summary],
            )
        if user.email:
            email.send_email(
                to=user.email,
                subject=f"Tomorrow's hearings ({tomorrow.isoformat()})",
                body=f"You have {len(listed)} hearing(s) tomorrow:\n{summary}",
            )
        sent += 1
    return sent
