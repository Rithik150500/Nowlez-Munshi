"""The brain. `ask_munshi()` is the single function both channels call.

The answer depends only on (user, question) + the user's case book. `channel`
is metadata, never an input to the reasoning — which is *why* the web panel and
WhatsApp return the same answer. The offline extractive path is deterministic,
so the cross-channel parity test asserts byte-identical answers.
"""
from __future__ import annotations

import re
from typing import Any

from data_access.daos import case_dao

from . import gemini
from .context import SYSTEM_PROMPT, build_case_context, case_title, fmt_date
from .types import AnswerResult, Citation

_WORD = re.compile(r"[a-z0-9]+")


def _tokens(text: str) -> set[str]:
    return set(_WORD.findall((text or "").lower()))


def _best_case(question: str, cases: list[Any]) -> tuple[int, Any | None]:
    q = _tokens(question)
    best_score, best = 0, None
    for c in cases:
        hay = _tokens(f"{case_title(c)} {c.cnr} {c.case_status or ''}")
        score = len(q & hay)
        if score > best_score:
            best_score, best = score, c
    return best_score, best


def _extractive_answer(question: str, cases: list[Any]) -> tuple[str, list[Citation]]:
    if not cases:
        return "You have no cases on file yet.", []
    score, case = _best_case(question, cases)
    if case is None or score == 0:
        lines = [
            f"{case_title(c)} (CNR {c.cnr}): next hearing {fmt_date(c.next_hearing_date)}"
            for c in cases
        ]
        text = "Here are your cases:\n" + "\n".join(lines)
        return text, [Citation(cnr=c.cnr, title=case_title(c)) for c in cases]
    text = (
        f"In {case_title(case)} (CNR {case.cnr}), the next hearing is "
        f"{fmt_date(case.next_hearing_date)} and the status is "
        f"{case.case_status or 'unknown'}."
    )
    return text, [Citation(cnr=case.cnr, title=case_title(case))]


def _citations_for(text: str, cases: list[Any]) -> list[Citation]:
    out: list[Citation] = []
    low = text.lower()
    for c in cases:
        title = case_title(c)
        if c.cnr in text or (title and title.lower() in low):
            out.append(Citation(cnr=c.cnr, title=title))
    return out


def ask_munshi(user: Any, question: str, *, session, channel: str = "web") -> AnswerResult:
    """Answer a question about the user's cases. THE single brain.

    Fetches the case book itself (rather than taking it as a param) so that
    every caller — web or WhatsApp — reasons over identical context.
    """
    cases = case_dao.list_by_user(session, user_id=user.id)

    if gemini.is_available():
        try:
            text = gemini.generate(question, SYSTEM_PROMPT, build_case_context(cases))
            if text:
                return AnswerResult(
                    text=text,
                    citations=_citations_for(text, cases),
                    channel=channel,
                    mode="gemini",
                )
        except Exception:
            pass  # network/model hiccup -> deterministic fallback below

    text, citations = _extractive_answer(question, cases)
    return AnswerResult(text=text, citations=citations, channel=channel, mode="extractive")
