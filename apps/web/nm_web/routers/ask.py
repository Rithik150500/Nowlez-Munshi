"""AI Munshi endpoints: ask + chat threads."""
from __future__ import annotations

import uuid

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session

from nm_core import ai
from nm_core.ai.repository import ChatRepository
from nm_core.db.models.user import User
from nm_web.deps import get_current_user, get_db

router = APIRouter(prefix="/api", tags=["ai"])


class AskBody(BaseModel):
    question: str
    thread_id: str | None = None


@router.post("/ask")
def ask(
    body: AskBody, user: User = Depends(get_current_user), db: Session = Depends(get_db)
) -> dict:
    answer = ai.ask(db, user=user, question=body.question, thread_id=body.thread_id, channel="web")
    return answer.to_dict()


@router.get("/threads")
def list_threads(
    user: User = Depends(get_current_user), db: Session = Depends(get_db)
) -> dict:
    threads = ChatRepository(db).list_threads(user.id)
    return {
        "threads": [
            {"id": str(t.id), "title": t.title, "channel": t.channel,
             "updated_at": t.updated_at.isoformat() if t.updated_at else None}
            for t in threads
        ]
    }


@router.get("/threads/{thread_id}")
def get_thread(
    thread_id: str, user: User = Depends(get_current_user), db: Session = Depends(get_db)
) -> dict:
    repo = ChatRepository(db)
    thread = repo.get_thread(user.id, uuid.UUID(thread_id))
    if thread is None:
        raise HTTPException(status_code=404, detail="thread not found")
    msgs = repo.recent_messages(thread.id, limit=200)
    return {
        "id": str(thread.id),
        "messages": [
            {"role": m.role, "content": m.content, "citations": m.citations,
             "created_at": m.created_at.isoformat() if m.created_at else None}
            for m in msgs
        ],
    }
