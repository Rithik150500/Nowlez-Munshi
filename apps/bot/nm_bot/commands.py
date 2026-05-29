"""WhatsApp command router. Pure logic: (session, phone, text/button) -> reply string.

A WhatsApp sender is identified by phone; first message auto-creates the account
(the WhatsApp onboarding door). Free text routes to the AI Munshi (same brain the
web chat calls), so both doors answer identically.
"""
from __future__ import annotations

from datetime import UTC, date, datetime, timedelta

from sqlalchemy.orm import Session

from nm_core import ai, identity, tracking
from nm_core.ai.types import Answer
from nm_core.cases import CasePreferenceRepository, CaseRepository
from nm_core.config import get_settings
from nm_core.ecourts.errors import CNRNotFound, ECourtsError
from nm_core.ecourts.routing import CNR_REGEX
from nm_core.i18n import t
from nm_core.identity.repositories import UserRepository


def _help_for(user) -> str:
    return t("help", getattr(user, "locale", "en"))


def _fmt_case(case) -> str:
    line = f"*{case.title or case.cnr}*\n{case.cnr}"
    if case.court:
        line += f"\n{case.court}"
    if case.stage:
        line += f"\nStage: {case.stage}"
    if case.next_hearing_date:
        line += f"\nNext hearing: {case.next_hearing_date}"
    return line


def _list(cases, *, empty: str) -> str:
    if not cases:
        return empty
    return "\n\n".join(f"{i + 1}. {_fmt_case(c)}" for i, c in enumerate(cases))


def _format_answer(answer: Answer) -> str:
    text = answer.text
    if answer.citations:
        text += "\n\n📎 " + ", ".join(c.cnr for c in answer.citations)
    return text


def _web_link(user, next_path: str = "/") -> str | None:
    """A short-lived 'continue on web' deep-link, or None if web isn't configured."""
    base = get_settings().WEB_BASE_URL
    if not base:
        return None
    token = identity.create_link_token(user.id)
    return f"{base.rstrip('/')}/link#token={token}&next={next_path}"


def handle_message(
    session: Session, *, from_phone: str, text: str | None, button_payload: str | None = None
) -> str:
    users = UserRepository(session)
    user, _ = users.get_or_create_by_phone(phone=from_phone)
    cases = CaseRepository(session)
    prefs = CasePreferenceRepository(session)

    raw = (button_payload or text or "").strip()
    if not raw:
        return _help_for(user)

    upper = raw.upper()
    if CNR_REGEX.match(upper):
        return _track(session, user, upper)

    if not raw.startswith("/"):
        return _format_answer(ai.ask(session, user=user, question=raw, channel="whatsapp"))

    parts = raw.split()
    cmd = parts[0].lower()
    args = parts[1:]

    if cmd in ("/start", "/help"):
        return _help_for(user)
    if cmd == "/web":
        link = _web_link(user)
        return f"📱 Open Nowlez Munshi on the web:\n{link}" if link else "Web app isn't configured."
    if cmd == "/saved":
        return _list(cases.list_by_user(user.id), empty=t("no_cases", user.locale))
    if cmd == "/today":
        return _hearings(cases, user.id, date.today(), date.today(), "today")
    if cmd == "/this_week":
        today = date.today()
        return _hearings(cases, user.id, today, today + timedelta(days=7), "this week")
    if cmd == "/forget":
        return _forget(cases, user.id, args)
    if cmd == "/snooze":
        return _snooze(prefs, user.id, args)
    if cmd == "/alerts":
        return _alerts(prefs, user.id, args)
    if cmd == "/digest_on":
        return _digest(prefs, cases, user.id, True)
    if cmd == "/digest_off":
        return _digest(prefs, cases, user.id, False)
    return t("unknown_cmd", user.locale, cmd=cmd)


def _track(session: Session, user, cnr: str) -> str:
    try:
        result = tracking.track_case(session, user=user, cnr=cnr, added_via="whatsapp")
    except CNRNotFound:
        return t("not_found", user.locale, cnr=cnr)
    except ECourtsError as e:
        return (
            f"Couldn't reach eCourts for {cnr} right now ({type(e).__name__}). "
            "Try again shortly."
        )
    reply = t("tracking_now", user.locale) + "\n\n" + _fmt_case(result.case)
    link = _web_link(user, next_path=f"/cases/{cnr}")
    if link:
        reply += f"\n\n📱 Open on web: {link}"
    return reply


def _hearings(cases, user_id, start: date, end: date, label: str) -> str:
    rows = [
        c
        for c in cases.list_by_user(user_id)
        if c.next_hearing_date and start <= c.next_hearing_date <= end
    ]
    rows.sort(key=lambda c: c.next_hearing_date)
    return _list(rows, empty=f"No hearings {label}.")


def _forget(cases, user_id, args) -> str:
    if not args:
        return "Usage: /forget <CNR>"
    cnr = args[0].upper()
    return f"🗑️ Stopped tracking {cnr}." if cases.delete(user_id, cnr) else f"{cnr} wasn't tracked."


def _snooze(prefs, user_id, args) -> str:
    if len(args) < 2 or not args[1].isdigit():
        return "Usage: /snooze <CNR> <days>"
    cnr, days = args[0].upper(), int(args[1])
    until = datetime.now(UTC) + timedelta(days=days)
    prefs.upsert(user_id, cnr, snooze_until=until)
    return f"🔕 Snoozed {cnr} for {days} day(s)."


def _alerts(prefs, user_id, args) -> str:
    valid = {"all", "orders_only", "hearings_only", "digest_only"}
    if len(args) < 2 or args[1].lower() not in valid:
        return f"Usage: /alerts <CNR> <{'|'.join(sorted(valid))}>"
    cnr, level = args[0].upper(), args[1].lower()
    prefs.upsert(user_id, cnr, alert_level=level)
    return f"🔔 Alerts for {cnr} set to {level}."


def _digest(prefs, cases, user_id, enabled: bool) -> str:
    for c in cases.list_by_user(user_id):
        prefs.upsert(user_id, c.cnr, digest_enabled=enabled)
    return f"📰 Daily digest {'enabled' if enabled else 'disabled'} for all cases."
