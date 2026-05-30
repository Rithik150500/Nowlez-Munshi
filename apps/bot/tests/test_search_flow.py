"""Guided eCourts search flow over WhatsApp: party / case-number / FIR modes."""
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
def sends(monkeypatch):
    """Capture interactive list + button sends instead of calling Meta."""
    calls: list[dict] = []
    monkeypatch.setattr(get_settings(), "ECOURTS_OFFLINE", True)
    monkeypatch.setattr(redis_dedup, "_client", fakeredis.FakeStrictRedis())
    import nm_core.messaging as messaging
    for fn in ("send_interactive_list", "send_interactive_buttons"):
        monkeypatch.setattr(messaging, fn, lambda session, **kw: calls.append(kw) or "wamid")
    yield calls
    monkeypatch.setattr(redis_dedup, "_client", None)


def _reply(db_session, text=None, button=None):
    return handle_message(db_session, from_phone=PHONE, text=text, button_payload=button)


def _walk_to_complex(db_session, sends, mode: str) -> str:
    """Run /search → mode → state → district, returning the complex-picker row id."""
    assert _reply(db_session, "/search") == ""
    assert any(b["id"] == f"search:mode:{mode}" for b in sends[-1]["buttons"])
    assert _reply(db_session, button=f"search:mode:{mode}") == ""
    assert _reply(db_session, button=sends[-1]["rows"][0]["id"]) == ""  # state → district
    assert _reply(db_session, button=sends[-1]["rows"][0]["id"]) == ""  # district → complex
    cx = sends[-1]["rows"][0]["id"]
    assert cx.startswith("search:complex:") and "|DLND01" in cx  # carries est_code
    return cx


def test_party_search_happy_path(db_session, sends):
    cx = _walk_to_complex(db_session, sends, "party")
    assert "party name" in _reply(db_session, button=cx).lower()
    assert _reply(db_session, "Sharma") == ""  # → results list
    res = sends[-1]["rows"][0]["id"]
    assert res.startswith("search:track:")
    assert "Tracking" in _reply(db_session, button=res)
    user = UserRepository(db_session).get_by_phone(PHONE)
    assert conversation.get_state(user.id) is None  # cleared after tracking


def test_case_number_search(db_session, sends):
    cx = _walk_to_complex(db_session, sends, "caseno")
    assert "case type" in _reply(db_session, button=cx).lower()
    assert "CASE_TYPE" in _reply(db_session, "garbage input")  # bad parse re-prompts
    assert _reply(db_session, "CC 123 2024") == ""  # → results
    assert sends[-1]["rows"][0]["id"].startswith("search:track:")


def test_fir_search(db_session, sends, monkeypatch):
    # Capture the police-station listing args: it must receive the est_code
    # (court_code_arr), not the full complex code — else the endpoint returns nothing.
    import nm_bot.search_flow as sf
    seen: dict = {}
    real = sf.ecourts.list_police_stations
    monkeypatch.setattr(sf.ecourts, "list_police_stations",
                        lambda **kw: seen.update(kw) or real(**kw))

    cx = _walk_to_complex(db_session, sends, "fir")
    assert _reply(db_session, button=cx) == ""  # FIR → police-station picker
    assert seen["court_code"] == "DLND01"  # est_code from the offline complex, not "1"
    police = sends[-1]["rows"][0]["id"]
    assert police.startswith("search:police:")
    assert "FIR number" in _reply(db_session, button=police)
    assert _reply(db_session, "45 2024") == ""  # → results
    assert sends[-1]["rows"][0]["id"].startswith("search:track:")


def test_free_text_without_active_flow_is_not_hijacked(db_session, sends):
    user, _ = UserRepository(db_session).get_or_create_by_phone(phone=PHONE)
    assert conversation.get_state(user.id) is None
    _reply(db_session, "Sharma")  # no /search first → not a party-name step
    assert sends == []


def test_button_after_state_expiry_is_graceful(db_session, sends, monkeypatch):
    """A picker tapped after the conversation TTL expired must not KeyError (B1)."""
    from nm_core import conversation
    user, _ = UserRepository(db_session).get_or_create_by_phone(phone=PHONE)
    conversation.clear_state(user.id)  # simulate TTL expiry
    # district/complex/police need prior state → graceful expiry message, no crash
    for payload in ("search:district:1", "search:complex:1|DLND01", "search:police:1"):
        reply = handle_message(db_session, from_phone=PHONE, text=None, button_payload=payload)
        assert "expired" in reply.lower()
