"""The WEB door into the Munshi brain. Mirror of whatsapp/handler.py — both
call the same munshi_core.ask_munshi()."""
from __future__ import annotations

from fastapi import APIRouter, Depends
from pydantic import BaseModel

from munshi_core import ask_munshi

from ..db import get_db
from ..deps import get_current_user

router = APIRouter(prefix="/munshi", tags=["munshi"])


class AskReq(BaseModel):
    question: str


@router.post("/ask")
def ask(body: AskReq, user=Depends(get_current_user), db=Depends(get_db)):
    result = ask_munshi(user, body.question, session=db, channel="web")
    return result.to_dict()
