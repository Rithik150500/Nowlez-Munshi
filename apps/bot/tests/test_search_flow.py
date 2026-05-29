"""Guided eCourts party-search flow over WhatsApp (offline + fakeredis)."""
from __future__ import annotations

import fakeredis
import pytest
from nm_bot.commands import handle_message

from nm_core import conversation
from nm_core.config import get_settings
from nm_core.identity.repositories import UserRepository
from nm_core.messaging import redis_dedup

PHONE = "+919100000121"


@pytest.fixture
def captured(monkeypatch):
    """Capture interactive-list sends instead of calling Meta."""
    calls: list[dict] = []
    monkeypatch.setattr(get_settings(), "ECOURTS_OFFLINE", True)
    monkeypatch.setattr(redis_dedup, "_client", fakeredis.FakeStrictRedis())

    import nm_core.messaging as messaging
    monkeypatch.setattr(messaging, "send_interactive_list",
                        lambda session, **kw: calls.append(kw) or "wamid")
    yield calls
    monkeypatch.setattr(redis_dedup, "_client", None)


def _reply(db_session, text=None, button=None):
    return handle_message(db_session, from_phone=PHONE, text=text, button_payload=button)


def test_guided_search_happy_path(db_session, captured):
    assert _reply(db_session, "/search") == ""
    state_rows = captured[-1]["rows"]
    assert state_rows[0]["id"].startswith("search:state:")

    assert _reply(db_session, button=state_rows[0]["id"]) == ""  # → district picker
    dist_rows = captured[-1]["rows"]
    assert dist_rows[0]["id"].startswith("search:district:")

    assert _reply(db_session, button=dist_rows[0]["id"]) == ""  # → complex picker
    cx_rows = captured[-1]["rows"]
    # the hard-won detail: the row carries the establishment code, not the complex code
    assert cx_rows[0]["id"] == "search:complex:DLND01"

    prompt = _reply(db_session, button=cx_rows[0]["id"])
    assert "party name" in prompt.lower()

    assert _reply(db_session, "Sharma") == ""  # → results list
    res_rows = captured[-1]["rows"]
    assert res_rows and res_rows[0]["id"].startswith("search:track:")

    reply = _reply(db_session, button=res_rows[0]["id"])
    assert "Tracking" in reply

    user = UserRepository(db_session).get_by_phone(PHONE)
    assert conversation.get_state(user.id) is None  # flow cleared after tracking


def test_party_name_without_active_flow_is_not_hijacked(db_session, captured):
    """A free-text message with no pending search step is not swallowed by the flow."""
    user, _ = UserRepository(db_session).get_or_create_by_phone(phone=PHONE)
    assert conversation.get_state(user.id) is None
    # No /search first → "Sharma" must NOT be treated as a party-name step.
    # (It routes to the AI; we only assert the flow didn't capture it.)
    _reply(db_session, "Sharma")
    assert captured == []
