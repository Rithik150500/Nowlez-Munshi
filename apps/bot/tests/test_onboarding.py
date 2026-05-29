"""WhatsApp onboarding: greeting/`/start` → language picker → demo card."""
from __future__ import annotations

import pytest
from nm_bot import commands
from nm_bot.commands import handle_message

from nm_core.identity.repositories import UserRepository

PHONE = "+919100000071"


@pytest.fixture
def captured(monkeypatch):
    """Capture interactive-button sends instead of hitting Meta."""
    calls: list[dict] = []

    def _fake(session, **kwargs):
        calls.append(kwargs)
        return "wamid.fake"

    monkeypatch.setattr(commands.messaging, "send_interactive_buttons", _fake)
    return calls


def _reply(db_session, text=None, button=None):
    return handle_message(db_session, from_phone=PHONE, text=text, button_payload=button)


def test_greeting_shows_language_picker(db_session, captured):
    reply = _reply(db_session, "hi")
    assert reply == ""  # handled inline; nothing to enqueue
    assert len(captured) == 1
    ids = [b["id"] for b in captured[0]["buttons"]]
    assert ids == ["onboard:lang:en", "onboard:lang:hi"]


def test_start_command_shows_language_picker(db_session, captured):
    assert _reply(db_session, "/start") == ""
    assert len(captured) == 1


def test_language_pick_completes_onboarding(db_session, captured):
    _reply(db_session, "hi")  # creates user + sends picker
    reply = _reply(db_session, button="onboard:lang:hi")
    assert "CNR" in reply
    assert "जून" in reply or "तैयार" in reply  # Hindi demo/prompt
    user = UserRepository(db_session).get_by_phone(PHONE)
    assert user.locale == "hi"
    assert user.onboarded_at is not None


def test_cnr_first_message_still_tracks_not_onboards(db_session, captured):
    """A new user who opens with a CNR is tracked directly — no onboarding wall."""
    reply = _reply(db_session, "DLND010000012024")
    assert "Tracking now" in reply
    assert captured == []  # the picker was never shown
