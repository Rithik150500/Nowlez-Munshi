"""WhatsApp command router behaviour (offline eCourts)."""
from __future__ import annotations

from nm_bot.commands import handle_message

from nm_core.cases import CasePreferenceRepository, CaseRepository
from nm_core.identity.repositories import UserRepository

PHONE = "+919100000051"
CNR = "DLND010000012024"


def _reply(db_session, text=None, button=None):
    return handle_message(db_session, from_phone=PHONE, text=text, button_payload=button)


def test_cnr_tracks_case(db_session):
    reply = _reply(db_session, CNR)
    assert "Tracking now" in reply
    user = UserRepository(db_session).get_by_phone(PHONE)
    assert CaseRepository(db_session).get_by_cnr(user.id, CNR) is not None


def test_help_and_empty(db_session):
    assert "Nowlez Munshi" in _reply(db_session, "/help")
    assert "Nowlez Munshi" in _reply(db_session, "")


def test_help_is_localized(db_session):
    _reply(db_session, "/help")  # creates the user
    user = UserRepository(db_session).get_by_phone(PHONE)
    user.locale = "hi"
    db_session.flush()
    assert "केस" in _reply(db_session, "/help")  # Hindi help


def test_unknown_command_localized(db_session):
    _reply(db_session, "/help")  # creates the user
    user = UserRepository(db_session).get_by_phone(PHONE)
    user.locale = "hi"
    db_session.flush()
    assert "अज्ञात" in _reply(db_session, "/bogus")  # Hindi "unknown"


def test_saved_lists_cases(db_session):
    _reply(db_session, CNR)
    assert CNR in _reply(db_session, "/saved")


def test_free_text_routes_to_ai(db_session):
    # No cases for this fresh user → the offline Munshi says so.
    assert "no cases" in _reply(db_session, "what is my next hearing?").lower()


def test_free_text_ai_answers_about_tracked_case(db_session, monkeypatch):
    from nm_core.config import get_settings

    monkeypatch.setattr(get_settings(), "GEMINI_API_KEY", "")  # offline agent
    _reply(db_session, CNR)  # track it first
    reply = _reply(db_session, f"what is the status of {CNR}?")
    assert CNR in reply  # cited


def test_forget(db_session):
    _reply(db_session, CNR)
    assert "Stopped tracking" in _reply(db_session, f"/forget {CNR}")
    user = UserRepository(db_session).get_by_phone(PHONE)
    assert CaseRepository(db_session).get_by_cnr(user.id, CNR) is None


def test_alerts_sets_level(db_session):
    _reply(db_session, CNR)
    assert "orders_only" in _reply(db_session, f"/alerts {CNR} orders_only")
    user = UserRepository(db_session).get_by_phone(PHONE)
    assert CasePreferenceRepository(db_session).get(user.id, CNR).alert_level == "orders_only"


def test_web_command_deep_link(db_session, monkeypatch):
    from nm_core.config import get_settings

    monkeypatch.setattr(get_settings(), "WEB_BASE_URL", "https://app.nowlez.in")
    reply = _reply(db_session, "/web")
    assert "https://app.nowlez.in/link#token=" in reply


def test_search_command_deep_links_to_web(db_session, monkeypatch):
    from nm_core.config import get_settings

    monkeypatch.setattr(get_settings(), "WEB_BASE_URL", "https://app.nowlez.in")
    reply = _reply(db_session, "/search")
    assert "/link#token=" in reply and "next=/search" in reply


def test_track_reply_includes_web_link(db_session, monkeypatch):
    from nm_core.config import get_settings

    monkeypatch.setattr(get_settings(), "WEB_BASE_URL", "https://app.nowlez.in")
    reply = _reply(db_session, CNR)
    assert "/link#token=" in reply and f"next=/cases/{CNR}" in reply


def test_snooze(db_session):
    _reply(db_session, CNR)
    assert "Snoozed" in _reply(db_session, f"/snooze {CNR} 3")
    user = UserRepository(db_session).get_by_phone(PHONE)
    assert CasePreferenceRepository(db_session).get(user.id, CNR).snooze_until is not None
