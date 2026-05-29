"""ask(): the single channel-agnostic brain both doors call.

Persists multi-turn threads, runs the agentic loop (Gemini if a key is set, else the
deterministic offline agent), and returns a cited Answer. The reasoning depends only
on (user, question, thread history) + the case book — channel is metadata, which is
why web and WhatsApp return identical answers for the same first-turn question.
"""
from __future__ import annotations

import uuid

from sqlalchemy.orm import Session

from nm_core import observability
from nm_core.ai import gemini, offline
from nm_core.ai.repository import ChatRepository
from nm_core.ai.tools import ToolContext
from nm_core.ai.types import Answer, Citation
from nm_core.cases import CaseRepository
from nm_core.config import get_settings
from nm_core.db.models.user import User


def _resolve_thread(repo: ChatRepository, user: User, thread_id, channel: str):
    if thread_id is not None:
        thread = repo.get_thread(user.id, uuid.UUID(str(thread_id)))
        if thread is not None:
            return thread
    if channel == "whatsapp":
        existing = repo.latest_thread(user.id, channel="whatsapp")
        if existing is not None:
            return existing
    return repo.create_thread(user_id=user.id, channel=channel)


def _citations(session: Session, ctx: ToolContext, text: str) -> list[Citation]:
    cited = dict(ctx.cited)
    # Also cite any team-visible case whose CNR appears verbatim (covers list answers).
    for case in CaseRepository(session).list_visible(ctx.visible):
        if case.cnr in text:
            cited.setdefault(case.cnr, case.title or case.cnr)
    return [Citation(cnr=cnr, title=title) for cnr, title in cited.items()]


def ask(
    session: Session,
    *,
    user: User,
    question: str,
    thread_id: uuid.UUID | str | None = None,
    channel: str = "web",
) -> Answer:
    settings = get_settings()
    repo = ChatRepository(session)
    thread = _resolve_thread(repo, user, thread_id, channel)

    history = [
        {"role": m.role, "content": m.content}
        for m in repo.recent_messages(thread.id, limit=settings.AI_HISTORY_TURNS * 2)
    ]
    repo.add_message(thread.id, role="user", content=question)

    ctx = ToolContext(session, user)
    text = ""
    mode = "offline"
    if gemini.is_available():
        try:
            text = gemini.run_agent(question=question, history=history, execute_tool=ctx.execute)
            mode = "gemini"
        except Exception:  # noqa: BLE001 — any model/network failure → deterministic fallback
            text = ""
    if not text:
        ctx = ToolContext(session, user)  # reset tool trace for the fallback run
        text = offline.run_agent(question=question, history=history, execute_tool=ctx.execute)
        mode = "offline"

    observability.incr(f"ai.answer.{mode}")
    citations = _citations(session, ctx, text)
    repo.add_message(
        thread.id,
        role="assistant",
        content=text,
        citations=[c.to_dict() for c in citations],
        tool_calls=ctx.calls,
    )
    return Answer(
        text=text,
        citations=citations,
        channel=channel,
        mode=mode,
        tool_calls=ctx.calls,
        thread_id=str(thread.id),
    )
