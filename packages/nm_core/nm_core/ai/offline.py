"""Deterministic offline agent — runs without an API key, through the same tools.

Used in dev/tests (and as the fallback when Gemini is unavailable/errors). Keeps the
cross-channel parity test exact because the output depends only on (question, book).
"""
from __future__ import annotations

import re
from collections.abc import Callable

# Non-anchored CNR finder (routing.CNR_REGEX is anchored for full-string validation).
_CNR_IN_TEXT = re.compile(r"[A-Z]{2}[A-Z]{2}[A-Z0-9]{12}")


def _fmt_case(d: dict) -> str:
    nh = d.get("next_hearing_date") or "not scheduled"
    return (
        f"{d.get('title') or d['cnr']} (CNR {d['cnr']})\n"
        f"Court: {d.get('court') or '—'} · Judge: {d.get('judge') or '—'}\n"
        f"Stage: {d.get('stage') or '—'} · Next hearing: {nh}"
    )


def run_agent(
    *, question: str, history: list[dict], execute_tool: Callable[[str, dict], dict]
) -> str:
    q = question.lower()
    match = _CNR_IN_TEXT.search(question.upper())

    if match:
        cnr = match.group(0)
        if "order" in q or "judgment" in q or "judgement" in q:
            data = execute_tool("get_orders", {"cnr": cnr})
            if "error" in data:
                return f"You aren't tracking {cnr}."
            orders = data["orders"]
            if not orders:
                return f"No orders on record for {cnr} yet."
            lines = [
                f"- {o['order_date']}: {o.get('name') or 'Order ' + o['order_id']}" for o in orders
            ]
            return f"Orders in {cnr}:\n" + "\n".join(lines)
        data = execute_tool("get_case", {"cnr": cnr})
        if "error" in data:
            return f"You aren't tracking {cnr}."
        return _fmt_case(data)

    cases = execute_tool("list_cases", {})["cases"]
    if not cases:
        return "You have no cases on file yet. Add one by its CNR."
    if any(w in q for w in ("today", "tomorrow", "this week", "hearing", "next", "upcoming")):
        dated = sorted(
            (c for c in cases if c.get("next_hearing_date")), key=lambda c: c["next_hearing_date"]
        )
        if not dated:
            return "None of your cases have a scheduled next hearing."
        lines = [
            f"- {c['next_hearing_date']}: {c.get('title') or c['cnr']} (CNR {c['cnr']})"
            for c in dated
        ]
        return "Upcoming hearings:\n" + "\n".join(lines)
    lines = [
        f"- {c.get('title') or c['cnr']} (CNR {c['cnr']}) — stage {c.get('stage') or '—'}"
        for c in cases
    ]
    return f"You are tracking {len(cases)} case(s):\n" + "\n".join(lines)
