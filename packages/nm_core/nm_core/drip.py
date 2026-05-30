"""Lifecycle drip-email campaign — calendar + the pure once-per-day decision function.

Ported from the legacy Nowlez drip. ``DRIP_CALENDAR`` declares per-day templates
branched on Active/Inactive; ``evaluate_drip_for_user`` is the pure, I/O-free decision
function (injected ``now_utc`` for testability). Day buckets are **IST** calendar days
since signup — kept pure so the off-by-one IST/UTC boundary is unit-testable.

Greenfield has no "client" entity, so the Active track is ``case_count >= 1`` (the legacy
required a client too). Emails are plain-text builders in ``drip_templates`` rather than
the legacy HTML files.
"""
from __future__ import annotations

from dataclasses import dataclass
from datetime import UTC, datetime
from typing import Any
from zoneinfo import ZoneInfo

IST = ZoneInfo("Asia/Kolkata")

# Day → {"active": template_key | None, "inactive": template_key | None}.
DRIP_CALENDAR: dict[int, dict[str, str | None]] = {
    1:  {"active": "d1_active",          "inactive": "d1_inactive"},
    2:  {"active": "d2_active",          "inactive": "d2_inactive"},
    3:  {"active": "d3_active",          "inactive": "d3_inactive"},
    7:  {"active": "d7_active_pricing",  "inactive": "d7_inactive_reengage"},
    25: {"active": "d25_active_refer",   "inactive": None},
    27: {"active": "d27_active_plan",    "inactive": None},
}
ACTIVE_FEATURE_OVERVIEW_DAYS: set[int] = {1, 2, 3}
LAST_SCHEDULED_DAY = 27


def _to_ist(dt: datetime) -> datetime:
    if dt.tzinfo is None:
        dt = dt.replace(tzinfo=UTC)
    return dt.astimezone(IST)


def compute_day_since_signup(signup_at_utc: datetime, now_utc: datetime) -> int:
    """Whole IST days between signup and now. Day 0 = the signup day."""
    return (_to_ist(now_utc).date() - _to_ist(signup_at_utc).date()).days


def compute_track(case_count: int) -> str:
    """Active iff the user has at least one tracked case (no client entity in greenfield)."""
    return "active" if case_count >= 1 else "inactive"


@dataclass
class DripDecision:
    day: int
    track: str
    send_catch_up: bool
    send_step_template: str | None
    set_became_active_at: bool
    set_catch_up_pending: bool
    set_terminal: bool
    new_last_step_sent_day: int | None


def evaluate_drip_for_user(
    *, signup_at_utc: datetime, case_count: int, state: dict[str, Any], now_utc: datetime,
) -> DripDecision:
    """Pure decision: what should the scheduler do for this user today?"""
    day = compute_day_since_signup(signup_at_utc, now_utc)
    track = compute_track(case_count)

    last_step_sent_day = int(state.get("last_step_sent_day", -1))
    became_active_at = state.get("became_active_at")
    catch_up_pending = bool(state.get("catch_up_pending", False))
    catch_up_sent_at = state.get("catch_up_sent_at")
    terminal_already = bool(state.get("terminal", False))

    set_became_active_at = False
    set_catch_up_pending = False

    # First-ever Active transition (once per user). If they passed any D1/2/3 Active
    # email while Inactive, queue a catch-up.
    if track == "active" and not became_active_at:
        set_became_active_at = True
        missed_cutoff = max(day - 1, last_step_sent_day)
        if any(d <= missed_cutoff for d in ACTIVE_FEATURE_OVERVIEW_DAYS):
            set_catch_up_pending = True
            catch_up_pending = True

    # 1) Catch-up — fires immediately on first eligibility, not calendar-gated.
    send_catch_up = catch_up_pending and not catch_up_sent_at

    # 2) Scheduled step — calendar-gated, deduped via the cursor.
    send_step_template: str | None = None
    new_last_step_sent_day: int | None = None
    if last_step_sent_day < day and day in DRIP_CALENDAR:
        candidate = DRIP_CALENDAR[day][track]
        if candidate is not None:
            send_step_template = candidate
            new_last_step_sent_day = day

    # 3) Terminal — past the last scheduled day.
    set_terminal = day >= LAST_SCHEDULED_DAY and not terminal_already

    return DripDecision(
        day=day, track=track, send_catch_up=send_catch_up,
        send_step_template=send_step_template,
        set_became_active_at=set_became_active_at,
        set_catch_up_pending=set_catch_up_pending,
        set_terminal=set_terminal, new_last_step_sent_day=new_last_step_sent_day,
    )


# --- scheduler (I/O side) -------------------------------------------------------------

def evaluate_drip(session, *, now: datetime | None = None, limit: int = 500) -> int:
    """Run one daily drip pass: for each non-terminal user signed up >=1 day ago,
    apply the pure decision, send any due email, and persist the new state. Returns the
    number of emails sent. Idempotent within a day via the cursor + catch_up_sent_at."""
    from sqlalchemy import func, select

    from nm_core import drip_templates, email
    from nm_core.db.models.case import Case
    from nm_core.db.models.drip_state import UserDripState
    from nm_core.db.models.user import User

    now = now or datetime.now(UTC)
    # Auto-create a drip-state row for any emailable user that lacks one (covers signups
    # since the last backfill, without a per-door signup hook).
    missing = session.execute(
        select(User.id).outerjoin(UserDripState, UserDripState.user_id == User.id)
        .where(UserDripState.user_id.is_(None), User.email.is_not(None))
    ).scalars().all()
    for uid in missing:
        session.add(UserDripState(user_id=uid))
    if missing:
        session.flush()

    rows = session.execute(
        select(User, UserDripState)
        .join(UserDripState, UserDripState.user_id == User.id)
        .where(UserDripState.terminal.is_(False), User.email.is_not(None))
        .limit(limit)
    ).all()

    sent = 0
    for user, state in rows:
        day = compute_day_since_signup(user.created_at, now)
        if day < 1:
            continue
        case_count = int(session.execute(
            select(func.count()).select_from(Case).where(Case.user_id == user.id)
        ).scalar_one())
        decision = evaluate_drip_for_user(
            signup_at_utc=user.created_at, case_count=case_count,
            state={
                "last_step_sent_day": state.last_step_sent_day,
                "became_active_at": state.became_active_at,
                "catch_up_pending": state.catch_up_pending,
                "catch_up_sent_at": state.catch_up_sent_at,
                "terminal": state.terminal,
            },
            now_utc=now,
        )
        sent += _apply(session, user, state, decision, drip_templates, email, now)
    return sent


def _apply(session, user, state, decision, drip_templates, email, now) -> int:
    """Persist the decision + send any due emails. Returns emails sent (0-2)."""
    n = 0
    if decision.set_became_active_at:
        state.became_active_at = now
    if decision.set_catch_up_pending:
        state.catch_up_pending = True
    state.track_today = decision.track

    if decision.send_catch_up:
        tpl = drip_templates.render("catch_up")
        if tpl and user.email:
            email.send_email(to=user.email, subject=tpl[0], body=tpl[1])
            n += 1
        state.catch_up_sent_at = now
        state.catch_up_pending = False

    if decision.send_step_template:
        tpl = drip_templates.render(decision.send_step_template)
        if tpl and user.email:
            email.send_email(to=user.email, subject=tpl[0], body=tpl[1])
            n += 1
        if decision.new_last_step_sent_day is not None:
            state.last_step_sent_day = decision.new_last_step_sent_day

    if decision.set_terminal:
        state.terminal = True
    state.last_evaluated_at = now
    session.flush()
    return n
