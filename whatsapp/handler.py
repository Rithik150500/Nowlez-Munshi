"""Channel-agnostic-core demonstrator for WhatsApp.

`handle_inbound` is what a real Meta webhook (or the demo `POST /wa/inbound`)
calls. It resolves the sender to a unified `User` by phone and routes the text
straight into `munshi_core.ask_munshi(channel="whatsapp")` — the exact same
function the web app calls. That single shared call is the product thesis.
"""
from __future__ import annotations

from typing import Any

from data_access.daos import user_dao

from munshi_core import ask_munshi


def handle_inbound(session, *, phone: str, text: str) -> dict[str, Any]:
    user = user_dao.get_by_phone(session, phone)
    if user is None:
        return {
            "matched": False,
            "reply": "You're not registered yet — sign in on the Nowlez Munshi web app first.",
            "answer": None,
            "citations": [],
            "channel": "whatsapp",
        }

    result = ask_munshi(user, text, session=session, channel="whatsapp")

    reply = result.text
    if result.citations:
        reply += "\n\nSources: " + ", ".join(c.cnr for c in result.citations)

    return {
        "matched": True,
        "reply": reply,
        "answer": result.text,
        "citations": [c.to_dict() for c in result.citations],
        "channel": "whatsapp",
        "mode": result.mode,
    }
