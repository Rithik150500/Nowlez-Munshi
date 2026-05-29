"""DOCX documents: list/create + OnlyOffice editor config, content fetch, save callback.

Editing needs an OnlyOffice Document Server (deploy/). Content + callback URLs carry
a short JWT (doc purpose) so the Document Server can fetch/post without a user session.
"""
from __future__ import annotations

import uuid

import httpx
import jwt as pyjwt
from fastapi import APIRouter, Depends, HTTPException, Request, Response
from pydantic import BaseModel
from sqlalchemy import select
from sqlalchemy.orm import Session

from nm_core.config import get_settings
from nm_core.db.models.document import Document
from nm_core.db.models.user import User
from nm_core.documents.onlyoffice import blank_docx, editor_config, verify_callback
from nm_core.storage import get_storage
from nm_core.teams import ensure_personal_account
from nm_web.deps import get_current_user, get_db

router = APIRouter(prefix="/api/documents", tags=["documents"])


class CreateBody(BaseModel):
    title: str


def _doc_token(doc_id: uuid.UUID) -> str:
    s = get_settings()
    return pyjwt.encode({"purpose": "doc", "doc": str(doc_id)}, s.JWT_SECRET_KEY, algorithm="HS256")


def _verify_doc_token(token: str, doc_id: str) -> bool:
    s = get_settings()
    try:
        claims = pyjwt.decode(token, s.JWT_SECRET_KEY, algorithms=["HS256"])
    except pyjwt.InvalidTokenError:
        return False
    return claims.get("purpose") == "doc" and claims.get("doc") == doc_id


@router.get("")
def list_documents(user: User = Depends(get_current_user), db: Session = Depends(get_db)) -> dict:
    account = ensure_personal_account(db, user)
    rows = db.execute(
        select(Document)
        .where(Document.account_id == account.id)
        .order_by(Document.updated_at.desc())
    ).scalars()
    return {
        "documents": [{"id": str(d.id), "title": d.title, "filename": d.filename} for d in rows]
    }


@router.post("")
def create_document(
    body: CreateBody, user: User = Depends(get_current_user), db: Session = Depends(get_db)
) -> dict:
    account = ensure_personal_account(db, user)
    doc = Document(
        account_id=account.id, created_by=user.id, title=body.title, filename=f"{body.title}.docx",
        storage_key="",
    )
    db.add(doc)
    db.flush()
    doc.storage_key = f"documents/{doc.id}.docx"
    get_storage().put(doc.storage_key, blank_docx())
    db.flush()
    return {"id": str(doc.id), "title": doc.title}


@router.get("/{document_id}/editor")
def editor(
    document_id: str, user: User = Depends(get_current_user), db: Session = Depends(get_db)
) -> dict:
    account = ensure_personal_account(db, user)
    doc = db.get(Document, uuid.UUID(document_id))
    if doc is None or doc.account_id != account.id:
        raise HTTPException(status_code=404, detail="document not found")
    base = get_settings().WEB_BASE_URL.rstrip("/")
    token = _doc_token(doc.id)
    config = editor_config(
        key=f"{doc.id}-{int(doc.updated_at.timestamp())}",
        title=doc.title,
        document_url=f"{base}/api/documents/{doc.id}/content?token={token}",
        callback_url=f"{base}/api/documents/{doc.id}/callback?token={token}",
    )
    return {"server_url": get_settings().ONLYOFFICE_SERVER_URL, "config": config}


@router.get("/{document_id}/content")
def content(document_id: str, token: str = "", db: Session = Depends(get_db)) -> Response:
    if not _verify_doc_token(token, document_id):
        raise HTTPException(status_code=403, detail="bad document token")
    doc = db.get(Document, uuid.UUID(document_id))
    if doc is None or not doc.storage_key:
        raise HTTPException(status_code=404, detail="document not found")
    data = get_storage().get(doc.storage_key)
    docx_mime = "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    return Response(content=data, media_type=docx_mime)


@router.post("/{document_id}/callback")
async def callback(
    document_id: str, request: Request, token: str = "", db: Session = Depends(get_db)
) -> dict:
    """OnlyOffice save callback. status 2/3 ⇒ document ready to persist from `url`."""
    if not _verify_doc_token(token, document_id):
        raise HTTPException(status_code=403, detail="bad document token")
    payload = await request.json()
    # If the Document Server signs callbacks, verify (raises on bad signature).
    if get_settings().ONLYOFFICE_JWT_SECRET and payload.get("token"):
        verify_callback(payload["token"])

    if payload.get("status") in (2, 3) and payload.get("url"):
        doc = db.get(Document, uuid.UUID(document_id))
        if doc is not None:
            data = httpx.get(payload["url"], timeout=30).content
            get_storage().put(doc.storage_key, data)
    return {"error": 0}
