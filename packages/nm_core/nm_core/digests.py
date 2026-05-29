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
from nm_core.db.models.case import Case
from nm_core.db.models.user import User

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


def _hearings_on(session: Session, day: date) -> dict[uuid.UUID, list[Case]]:
    rows = session.execute(
        select(Case).where(Case.next_hearing_date == day)
    ).scalars()
    grouped: dict[uuid.UUID, list[Case]] = defaultdict(list)
    for case in rows:
        grouped[case.user_id].append(case)
    return grouped


def send_tomorrow_digests(session: Session, *, today: date | None = None) -> int:
    """Enqueue + email each user's digest of cases listed tomorrow. Returns count sent."""
    now = datetime.now(UTC)
    tomorrow = (today or now.date()) + timedelta(days=1)
    prefs_repo = CasePreferenceRepository(session)
    sent = 0
    for user_id, cases in _hearings_on(session, tomorrow).items():
        user = session.get(User, user_id)
        if user is None:
            continue
        prefs = {p.cnr: p for p in prefs_repo.list_for_user(user_id)}
        listed = [c for c in cases if _wanted(prefs.get(c.cnr), now)]
        if not listed:
            continue
        summary = "; ".join(f"{c.title or c.cnr} ({c.cnr})" for c in listed)
        if user.phone:
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
