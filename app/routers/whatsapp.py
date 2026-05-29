"""The WhatsApp door. For the prototype this is a plain webhook-style POST that
calls the shared handler synchronously (no RQ/Redis) — enough to prove the
same brain answers on both channels."""
from __future__ import annotations

from fastapi import APIRouter, Depends
from pydantic import BaseModel, Field

from whatsapp.handler import handle_inbound

from ..db import get_db

router = APIRouter(prefix="/wa", tags=["whatsapp"])


class InboundReq(BaseModel):
    # "from" is a Python keyword, so alias it.
    sender: str = Field(alias="from")
    text: str

    model_config = {"populate_by_name": True}


@router.post("/inbound")
def inbound(body: InboundReq, db=Depends(get_db)):
    return handle_inbound(db, phone=body.sender, text=body.text)
