"""Build a compact, channel-agnostic "case book" context from shared
`data_access.Case` rows. A trimmed cousin of casepilot's 5-section system
prompt (chat.py) — role + case table only, no document inlining, no orders."""
from __future__ import annotations

from datetime import date, datetime
from typing import Any

SYSTEM_PROMPT = (
    "You are Munshi, an AI legal clerk for Indian court practice. "
    "Answer the user's question using ONLY the case book provided below. "
    "Be concise and practical. When you reference a case, name its CNR. "
    "If the answer is not in the case book, say so plainly."
)


def fmt_date(d: Any) -> str:
    if d is None:
        return "not scheduled"
    if isinstance(d, (datetime, date)):
        return d.strftime("%Y-%m-%d")
    return str(d)


def case_title(case: Any) -> str:
    """Prefer the stored title; otherwise derive "<petitioner> vs <respondent>"
    from the parties JSON; finally fall back to the CNR."""
    title = getattr(case, "title", None)
    if title:
        return title
    parties = getattr(case, "parties", None) or []
    names: list[str] = []
    for p in parties[:2]:
        if isinstance(p, dict):
            names.append(p.get("name") or p.get("party") or p.get("value") or str(p))
        else:
            names.append(str(p))
    if names:
        return " vs ".join(names)
    return getattr(case, "cnr", "Unknown case")


def case_line(case: Any) -> str:
    return (
        f"- CNR {case.cnr} | {case_title(case)} | "
        f"status: {case.case_status or 'unknown'} | "
        f"next hearing: {fmt_date(case.next_hearing_date)}"
    )


def build_case_context(cases: list[Any]) -> str:
    if not cases:
        return "The user has no cases on file."
    body = "\n".join(case_line(c) for c in cases)
    return "The user's case book (one line per case):\n" + body
