"""WhatsApp command router. Pure logic: (session, phone, text/button) -> reply string.

A WhatsApp sender is identified by phone; first message auto-creates the account
(the WhatsApp onboarding door). Free text routes to the AI Munshi (same brain the
web chat calls), so both doors answer identically.
"""
from __future__ import annotations

from datetime import UTC, date, datetime, timedelta

from sqlalchemy.orm import Session

from nm_bot import search_flow
from nm_core import ai, consent, identity, messaging, tracking
from nm_core.ai.types import Answer
from nm_core.cases import CasePreferenceRepository, CaseRepository
from nm_core.config import get_settings
from nm_core.ecourts.errors import CNRNotFound, ECourtsError
from nm_core.ecourts.routing import CNR_REGEX
from nm_core.i18n import t
from nm_core.identity.repositories import UserRepository
from nm_core.messaging.redis_dedup import claim_send_dedup


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


_ONBOARD_LANG_PREFIX = "onboard:lang:"
_GREETINGS = frozenset({
    "hi", "hii", "hey", "hello", "helo", "yo", "start", "namaste",
    "नमस्ते", "नमस्कार", "हाय", "हेलो",
})


def _is_greeting(raw: str) -> bool:
    return raw.split()[0].strip(".,!?;:'\"()[]।").lower() in _GREETINGS


def _send_welcome(session: Session, user) -> str:
    """Send the bilingual welcome + a language-picker (interactive buttons) inline.

    Returns "" so the webhook handler enqueues nothing more — the interactive
    message can't be expressed as the plain-text reply string.
    """
    messaging.send_interactive_buttons(
        session,
        to_phone=user.phone,
        user_id=user.id,
        body=t("welcome", user.locale),
        buttons=[
            {"id": f"{_ONBOARD_LANG_PREFIX}en", "title": "English"},
            {"id": f"{_ONBOARD_LANG_PREFIX}hi", "title": "हिंदी"},
        ],
    )
    return ""


def _complete_onboarding(session: Session, user, locale: str) -> str:
    """Persist the chosen language, mark onboarded, and reply with a demo + prompt."""
    from nm_core.i18n import SUPPORTED

    user.locale = locale if locale in SUPPORTED else "en"
    user.onboarded_at = datetime.now(UTC)
    user.re_engaged_at = None  # a fresh start resets the re-engagement clock
    session.flush()
    return t("onboard_done", user.locale)


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

    # DPDP consent: a bare STOP/START opts out of / back into proactive WhatsApp.
    # The reply (confirmation) is enqueued by the webhook handler *before* the
    # session commits, so a crash can't leave the user opted-out with no confirmation.
    if not raw.startswith("/"):
        if consent.is_stop_keyword(raw):
            consent.set_opt_out(session, user=user, opted_out=True, keyword=raw[:32])
            return t("opted_out", user.locale)
        if consent.is_start_keyword(raw) and consent.is_opted_out(user):
            consent.set_opt_out(session, user=user, opted_out=False, keyword=raw[:32])
            return t("opted_in", user.locale)

    # Onboarding: language-picker button callback completes onboarding.
    if button_payload and button_payload.startswith(_ONBOARD_LANG_PREFIX):
        return _complete_onboarding(session, user, button_payload[len(_ONBOARD_LANG_PREFIX):])

    # Guided search: list-picker callbacks, and the free-text party-name step.
    if search_flow.is_search_button(button_payload):
        return search_flow.handle_button(session, user, button_payload)

    upper = raw.upper()
    if CNR_REGEX.match(upper):
        return _track(session, user, upper)

    if not raw.startswith("/"):
        if search_flow.has_pending_text_step(user):
            return search_flow.handle_party_name(session, user, raw)
        if _is_greeting(raw):  # first-touch greeting → show the welcome + language picker
            return _send_welcome(session, user)
        return _format_answer(ai.ask(session, user=user, question=raw, channel="whatsapp"))

    parts = raw.split()
    cmd = parts[0].lower()
    args = parts[1:]

    if cmd == "/start":
        return _send_welcome(session, user)
    if cmd == "/help":
        return _help_for(user)
    if cmd == "/web":
        link = _web_link(user)
        return f"📱 Open Nowlez Munshi on the web:\n{link}" if link else "Web app isn't configured."
    if cmd == "/search":
        return search_flow.start(session, user)
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
    if cmd == "/label":
        return _label(cases, session, user.id, args)
    if cmd == "/portfolio":
        return _portfolio(cases, user.id)
    if cmd == "/refresh":
        return _refresh_all(session, cases, user)
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


def _label(cases, session: Session, user_id, args) -> str:
    """/label <CNR> <text> — set a friendly per-case label (stored in notes)."""
    if len(args) < 2:
        return "Usage: /label <CNR> <label text>"
    cnr = args[0].upper()
    case = cases.get_by_cnr(user_id, cnr)
    if case is None:
        return f"{cnr} isn't tracked. Send the CNR first to track it."
    case.notes = " ".join(args[1:])[:200]
    session.flush()
    return f"🏷️ Labelled {cnr}: {case.notes}"


def _portfolio(cases, user_id) -> str:
    """/portfolio — a one-glance summary of the user's case book."""
    rows = cases.list_by_user(user_id)
    if not rows:
        return "No cases yet. Send a CNR to start tracking."
    today = date.today()
    disposed = sum(1 for c in rows if c.stage and "dispos" in c.stage.lower())
    upcoming = sorted(
        (c for c in rows if c.next_hearing_date and c.next_hearing_date >= today),
        key=lambda c: c.next_hearing_date,
    )
    lines = [
        f"📁 *Your portfolio* — {len(rows)} case(s)",
        f"• Active: {len(rows) - disposed}   • Disposed: {disposed}",
    ]
    if upcoming:
        nxt = upcoming[0]
        lines.append(f"• Next hearing: {nxt.next_hearing_date} — {nxt.title or nxt.cnr}")
    return "\n".join(lines)


def _refresh_all(session: Session, cases, user) -> str:
    """/refresh — force-refresh the user's tracked cases (rate-limited 1 / 15 min)."""
    if not claim_send_dedup(f"refresh_cmd:{user.id}", ttl_seconds=900):
        return "⏳ You refreshed recently — try again in a few minutes."
    rows = cases.list_by_user(user.id, limit=25)
    if not rows:
        return "No cases to refresh."
    changed = 0
    for c in rows:
        try:
            if tracking.refresh_case(session, user=user, cnr=c.cnr).changes:
                changed += 1
        except Exception:  # noqa: BLE001 — one bad case must not abort the batch
            continue
    return f"🔄 Refreshed {len(rows)} case(s); {changed} had updates."


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
