"""Guided eCourts search over WhatsApp — a multi-step interactive flow.

Three modes share one court-selection spine:

    /search → pick MODE (party | case-number | FIR)
            → pick STATE → DISTRICT → COURT COMPLEX
            → (FIR only: pick POLICE STATION)
            → type the mode-specific query → tap a RESULT → track.

State is persisted in nm_core.conversation. The hard-won legacy detail: the eCourts
search AND listing endpoints (party / case / FIR search, police-station + case-type
lookups) all key on the court complex's *establishment code* (``est_code``), NOT the
full complex ``code`` — using the complex code silently returns zero results. We carry
both on the state (``court_code`` = complex code, ``court_code_arr`` = est_code) and
pass ``court_code_arr`` to every eCourts call.
"""
from __future__ import annotations

from datetime import date

from sqlalchemy.orm import Session

from nm_core import conversation, messaging, tracking
from nm_core.ecourts import client as ecourts
from nm_core.ecourts.errors import CNRNotFound, ECourtsError

_PREFIX = "search:"
_TEXT_STEPS = frozenset({"party_name", "caseno_input", "fir_input"})
_MODE_LABELS = {"party": "Party name", "caseno": "Case number", "fir": "FIR number"}


def is_search_button(payload: str | None) -> bool:
    return bool(payload) and payload.startswith(_PREFIX)


def has_pending_text_step(user) -> bool:
    """True if the user is mid-search at a step that expects a free-text reply."""
    state = conversation.get_state(user.id)
    return bool(state and state.get("flow") == "search" and state.get("step") in _TEXT_STEPS)


def _send_list(session: Session, user, body: str, button: str, rows: list[dict]) -> str:
    messaging.send_interactive_list(
        session, to_phone=user.phone, user_id=user.id,
        body=body, button_label=button, rows=rows,
    )
    return ""


def start(session: Session, user) -> str:
    """/search — begin by choosing the search mode."""
    conversation.set_state(user.id, {"flow": "search", "step": "mode"})
    messaging.send_interactive_buttons(
        session, to_phone=user.phone, user_id=user.id,
        body="🔎 How would you like to search?",
        buttons=[{"id": f"{_PREFIX}mode:{m}", "title": label}
                 for m, label in _MODE_LABELS.items()],
    )
    return ""


def handle_button(session: Session, user, payload: str) -> str:
    kind, _, val = payload[len(_PREFIX):].partition(":")
    state = conversation.get_state(user.id) or {"flow": "search"}

    if kind == "mode":
        state.update(mode=val, step="state")
        conversation.set_state(user.id, state)
        return _send_list(
            session, user, "Pick the state:", "Choose state",
            [{"id": f"{_PREFIX}state:{s.code}", "title": s.name}
             for s in ecourts.list_states()],
        )

    if kind == "state":
        state.update(state_code=val, step="district")
        conversation.set_state(user.id, state)
        return _send_list(
            session, user, "Pick the district:", "Choose district",
            [{"id": f"{_PREFIX}district:{d.code}", "title": d.name}
             for d in ecourts.list_districts(val)],
        )

    if kind == "district":
        state.update(district_code=val, step="complex")
        conversation.set_state(user.id, state)
        rows = ecourts.list_court_complexes(
            state_code=state["state_code"], district_code=val
        )
        # carry both the complex code and the est_code; every eCourts search/listing
        # call uses the est_code (court_code_arr), never the complex code.
        return _send_list(
            session, user, "Pick the court complex:", "Choose court",
            [{"id": f"{_PREFIX}complex:{c.code}|{c.est_code}", "title": c.name} for c in rows],
        )

    if kind == "complex":
        code, _, est = val.partition("|")
        state.update(court_code=code, court_code_arr=est or code)
        return _after_complex(session, user, state)

    if kind == "police":
        state.update(police_station_code=val, step="fir_input")
        conversation.set_state(user.id, state)
        return "Type the *FIR number* and year (e.g. `45 2024`):"

    if kind == "track":
        conversation.clear_state(user.id)
        return _track(session, user, val)

    return "That search step has expired. Send /search to start again."


def _after_complex(session: Session, user, state: dict) -> str:
    """Branch on the chosen mode once the court complex is set."""
    mode = state.get("mode", "party")
    if mode == "party":
        state["step"] = "party_name"
        conversation.set_state(user.id, state)
        return "Type the *party name* to search for:"
    if mode == "caseno":
        state["step"] = "caseno_input"
        conversation.set_state(user.id, state)
        return "Type the *case type, number and year* (e.g. `CC 123 2024`):"
    # FIR: needs a police station first. The listing endpoint — like the search
    # endpoints — keys on the establishment code, not the full complex code
    # (the same est_code-not-complex-code fix that applies to party/case search).
    state["step"] = "police"
    conversation.set_state(user.id, state)
    stations = ecourts.list_police_stations(
        state_code=state["state_code"], district_code=state["district_code"],
        court_code=state["court_code_arr"],
    )
    return _send_list(
        session, user, "Pick the police station:", "Choose station",
        [{"id": f"{_PREFIX}police:{p.code}", "title": p.name} for p in stations],
    )


def handle_text_step(session: Session, user, text: str) -> str:
    """Handle the free-text query for whichever mode is pending."""
    state = conversation.get_state(user.id)
    if not state or state.get("step") not in _TEXT_STEPS:
        conversation.clear_state(user.id)
        return "Send /search to start a new search."
    step = state["step"]
    try:
        if step == "party_name":
            results = ecourts.search_party(
                state_code=state["state_code"], district_code=state["district_code"],
                court_code_arr=state["court_code_arr"], party_name=text,
                year=date.today().year,
            )
        elif step == "caseno_input":
            parsed = _parse_caseno(text)
            if parsed is None:
                return "Please send it as `CASE_TYPE NUMBER YEAR`, e.g. `CC 123 2024`."
            case_type, number, year = parsed
            results = ecourts.search_case_number(
                state_code=state["state_code"], district_code=state["district_code"],
                court_code_arr=state["court_code_arr"], case_type=case_type,
                case_number=number, year=year,
            )
        else:  # fir_input
            parsed = _parse_fir(text)
            if parsed is None:
                return "Please send it as `FIR_NUMBER YEAR`, e.g. `45 2024`."
            fir_number, year = parsed
            results = ecourts.search_fir(
                state_code=state["state_code"], district_code=state["district_code"],
                court_code_arr=state["court_code_arr"],
                police_station_code=state["police_station_code"],
                fir_number=fir_number, year=year,
            )
    except ECourtsError:
        return "Couldn't reach eCourts right now. Try /search again shortly."

    if not results:
        return "No matching cases found. Check the details, or send /search to try again."
    state["step"] = "results"
    conversation.set_state(user.id, state)
    return _send_list(
        session, user, f"Found {len(results)} case(s). Tap one to track:", "Track a case",
        [{"id": f"{_PREFIX}track:{r.cnr}", "title": r.title or r.cnr,
          "description": r.case_number or ""} for r in results],
    )


def _parse_caseno(text: str) -> tuple[str, str, int] | None:
    parts = text.split()
    if len(parts) < 3 or not parts[-1].isdigit():
        return None
    return " ".join(parts[:-2]), parts[-2], int(parts[-1])


def _parse_fir(text: str) -> tuple[str, int] | None:
    parts = text.split()
    if len(parts) < 2 or not parts[-1].isdigit():
        return None
    return parts[0], int(parts[-1])


def _track(session: Session, user, cnr: str) -> str:
    try:
        result = tracking.track_case(session, user=user, cnr=cnr, added_via="whatsapp_search")
    except CNRNotFound:
        return f"Couldn't open {cnr}. Send /search to try again."
    except ECourtsError:
        return f"Couldn't reach eCourts for {cnr} right now. Try again shortly."
    c = result.case
    return f"✅ Tracking *{c.title or c.cnr}*\n{c.cnr}" + (f"\n{c.court}" if c.court else "")
