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


class FeedbackBody(BaseModel):
    feedback: str | None = None  # 'up' | 'down' | null to clear


class EditBody(BaseModel):
    thread_id: str
    message_id: str  # the user message being edited
    question: str    # the new question text


@router.post("/ask")
def ask(
    body: AskBody, user: User = Depends(get_current_user), db: Session = Depends(get_db)
) -> dict:
    answer = ai.ask(db, user=user, question=body.question, thread_id=body.thread_id, channel="web")
    return answer.to_dict()


@router.post("/ask/messages/{message_id}/feedback")
def set_feedback(
    message_id: str, body: FeedbackBody,
    user: User = Depends(get_current_user), db: Session = Depends(get_db),
) -> dict:
    if body.feedback not in (None, "up", "down"):
        raise HTTPException(status_code=422, detail="feedback must be 'up', 'down', or null")
    repo = ChatRepository(db)
    msg = repo.get_message(uuid.UUID(message_id))
    # Ownership: the message's thread must belong to the caller.
    if msg is None or repo.get_thread(user.id, msg.thread_id) is None:
        raise HTTPException(status_code=404, detail="message not found")
    updated = repo.set_feedback(uuid.UUID(message_id), body.feedback)
    if updated is None:
        raise HTTPException(status_code=422, detail="can only rate assistant messages")
    return {"message_id": message_id, "feedback": updated.feedback}


@router.post("/ask/edit")
def edit_and_regenerate(
    body: EditBody, user: User = Depends(get_current_user), db: Session = Depends(get_db)
) -> dict:
    """Edit a prior user message: drop it + everything after, then re-ask with new text."""
    repo = ChatRepository(db)
    thread = repo.get_thread(user.id, uuid.UUID(body.thread_id))
    if thread is None:
        raise HTTPException(status_code=404, detail="thread not found")
    msg = repo.get_message(uuid.UUID(body.message_id))
    if msg is None or msg.thread_id != thread.id or msg.role != "user":
        raise HTTPException(status_code=404, detail="user message not found in thread")
    repo.truncate_from(thread.id, msg.id)
    answer = ai.ask(db, user=user, question=body.question,
                    thread_id=body.thread_id, channel="web")
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
            {"id": str(m.id), "role": m.role, "content": m.content, "citations": m.citations,
             "feedback": m.feedback,
             "created_at": m.created_at.isoformat() if m.created_at else None}
            for m in msgs
        ],
    }
