"""Guided eCourts party search over WhatsApp — a multi-step interactive flow.

State machine (persisted in nm_core.conversation):

    /search → pick STATE → pick DISTRICT → pick COURT COMPLEX → type PARTY NAME
            → tap a RESULT → track the case.

Each picker is sent as an interactive list; the picked row's id carries the next
input. The hard-won legacy detail: party search needs the court complex's
*establishment code* (``est_code``), not the complex code — using the complex code
silently returns zero results. We therefore carry ``est_code`` as ``court_code_arr``.
"""
from __future__ import annotations

from datetime import date

from sqlalchemy.orm import Session

from nm_core import conversation, messaging, tracking
from nm_core.ecourts import client as ecourts
from nm_core.ecourts.errors import CNRNotFound, ECourtsError

_PREFIX = "search:"


def is_search_button(payload: str | None) -> bool:
    return bool(payload) and payload.startswith(_PREFIX)


def has_pending_text_step(user) -> bool:
    """True if the user is mid-search at a step that expects a free-text reply."""
    state = conversation.get_state(user.id)
    return bool(state and state.get("flow") == "search" and state.get("step") == "party_name")


def _send_list(session: Session, user, body: str, button: str, rows: list[dict]) -> str:
    messaging.send_interactive_list(
        session, to_phone=user.phone, user_id=user.id,
        body=body, button_label=button, rows=rows,
    )
    return ""  # handled inline — nothing for the webhook to enqueue


def start(session: Session, user) -> str:
    """/search — begin the guided party search at the state picker."""
    states = ecourts.list_states()
    conversation.set_state(user.id, {"flow": "search", "step": "state"})
    return _send_list(
        session, user, "🔎 Search by party name. First, pick the state:", "Choose state",
        [{"id": f"{_PREFIX}state:{s.code}", "title": s.name} for s in states],
    )


def handle_button(session: Session, user, payload: str) -> str:
    kind, _, val = payload[len(_PREFIX):].partition(":")
    state = conversation.get_state(user.id) or {"flow": "search"}

    if kind == "state":
        state.update(state_code=val, step="district")
        conversation.set_state(user.id, state)
        rows = ecourts.list_districts(val)
        return _send_list(
            session, user, "Pick the district:", "Choose district",
            [{"id": f"{_PREFIX}district:{d.code}", "title": d.name} for d in rows],
        )

    if kind == "district":
        state.update(district_code=val, step="complex")
        conversation.set_state(user.id, state)
        rows = ecourts.list_court_complexes(
            state_code=state["state_code"], district_code=val
        )
        return _send_list(
            session, user, "Pick the court complex:", "Choose court",
            # carry est_code (not the complex code) — party search needs it
            [{"id": f"{_PREFIX}complex:{c.est_code}", "title": c.name} for c in rows],
        )

    if kind == "complex":
        state.update(court_code_arr=val, step="party_name")
        conversation.set_state(user.id, state)
        return "Type the *party name* to search for:"

    if kind == "track":
        conversation.clear_state(user.id)
        return _track(session, user, val)

    return "That search step has expired. Send /search to start again."


def handle_party_name(session: Session, user, party_name: str) -> str:
    """Run the search once the user types a party name, and list the results."""
    state = conversation.get_state(user.id)
    if not state or state.get("step") != "party_name":
        conversation.clear_state(user.id)
        return "Send /search to start a new search."
    try:
        results = ecourts.search_party(
            state_code=state["state_code"], district_code=state["district_code"],
            court_code_arr=state["court_code_arr"], party_name=party_name,
            year=date.today().year,
        )
    except ECourtsError:
        return "Couldn't reach eCourts right now. Try /search again shortly."
    if not results:
        return ("No cases found for that party this year. Check the spelling, "
                "or send /search to try a different court.")
    state["step"] = "results"
    conversation.set_state(user.id, state)
    return _send_list(
        session, user, f"Found {len(results)} case(s). Tap one to track:", "Track a case",
        [{"id": f"{_PREFIX}track:{r.cnr}", "title": r.title or r.cnr,
          "description": r.case_number or ""} for r in results],
    )


def _track(session: Session, user, cnr: str) -> str:
    try:
        result = tracking.track_case(session, user=user, cnr=cnr, added_via="whatsapp_search")
    except CNRNotFound:
        return f"Couldn't open {cnr}. Send /search to try again."
    except ECourtsError:
        return f"Couldn't reach eCourts for {cnr} right now. Try again shortly."
    c = result.case
    return f"✅ Tracking *{c.title or c.cnr}*\n{c.cnr}" + (f"\n{c.court}" if c.court else "")
