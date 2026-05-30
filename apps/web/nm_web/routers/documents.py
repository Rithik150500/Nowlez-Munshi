"""DOCX documents: list/create + OnlyOffice editor config, content fetch, save callback.

Editing needs an OnlyOffice Document Server (deploy/). Content + callback URLs carry
a short JWT (doc purpose) so the Document Server can fetch/post without a user session.
"""
from __future__ import annotations

import uuid
from datetime import UTC, datetime, timedelta

import httpx
import jwt as pyjwt
from fastapi import APIRouter, Depends, HTTPException, Request, Response, UploadFile
from pydantic import BaseModel
from sqlalchemy import select
from sqlalchemy.orm import Session

from nm_core import documents as docproc
from nm_core.config import get_settings
from nm_core.db.models.case import Case
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
    now = datetime.now(UTC)
    # Short-lived capability so a leaked editor URL can't grant indefinite access.
    payload = {
        "purpose": "doc",
        "doc": str(doc_id),
        "iat": int(now.timestamp()),
        "exp": int((now + timedelta(hours=2)).timestamp()),
    }
    return pyjwt.encode(payload, s.JWT_SECRET_KEY, algorithm="HS256")


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


def _doc_view(d: Document) -> dict:
    return {
        "id": str(d.id), "title": d.title, "filename": d.filename,
        "kind": d.kind, "status": d.status, "document_type": d.document_type,
        "page_count": d.page_count, "summary": d.summary,
        "permanently_failed": d.permanently_failed,
    }


@router.get("/tree")
def document_tree(
    user: User = Depends(get_current_user), db: Session = Depends(get_db)
) -> dict:
    """The account's documents grouped by the case they're attached to (the flat-storage
    equivalent of a folder tree); unattached docs land under a null case group."""
    account = ensure_personal_account(db, user)
    docs = db.execute(
        select(Document).where(Document.account_id == account.id)
        .order_by(Document.updated_at.desc())
    ).scalars().all()
    case_ids = {d.case_id for d in docs if d.case_id is not None}
    cases = {
        c.id: c for c in db.execute(select(Case).where(Case.id.in_(case_ids))).scalars()
    } if case_ids else {}
    groups: dict[str, dict] = {}
    for d in docs:
        key = str(d.case_id) if d.case_id else "_unclassified"
        if key not in groups:
            case = cases.get(d.case_id) if d.case_id else None
            groups[key] = {
                "case": ({"id": str(case.id), "cnr": case.cnr, "title": case.title}
                         if case else None),
                "files": [],
            }
        groups[key]["files"].append(_doc_view(d))
    # Unclassified group last; the rest by most-recent activity (insertion order).
    ordered = [g for k, g in groups.items() if k != "_unclassified"]
    if "_unclassified" in groups:
        ordered.append(groups["_unclassified"])
    return {"groups": ordered}


class RenameBody(BaseModel):
    new_name: str


@router.put("/{document_id}/rename")
def rename_document(
    document_id: str, body: RenameBody,
    user: User = Depends(get_current_user), db: Session = Depends(get_db),
) -> dict:
    account = ensure_personal_account(db, user)
    doc = db.get(Document, uuid.UUID(document_id))
    if doc is None or doc.account_id != account.id:
        raise HTTPException(status_code=404, detail="document not found")
    try:
        name = docproc.validate_filename(body.new_name, original=doc.filename)
    except docproc.InvalidFilename as e:
        raise HTTPException(status_code=422, detail=str(e)) from e
    # Collision within the same case group.
    clash = db.execute(
        select(Document).where(
            Document.account_id == account.id, Document.id != doc.id,
            Document.case_id.is_(doc.case_id) if doc.case_id is None
            else Document.case_id == doc.case_id,
            Document.filename == name,
        )
    ).first()
    if clash is not None:
        raise HTTPException(status_code=409, detail="a file with that name already exists")
    doc.filename = name
    doc.title = name.rsplit(".", 1)[0] if "." in name else name
    db.flush()
    return _doc_view(doc)


class ReclassifyBody(BaseModel):
    target_case_id: str | None = None


@router.put("/{document_id}/reclassify")
def reclassify_document(
    document_id: str, body: ReclassifyBody,
    user: User = Depends(get_current_user), db: Session = Depends(get_db),
) -> dict:
    account = ensure_personal_account(db, user)
    doc = db.get(Document, uuid.UUID(document_id))
    if doc is None or doc.account_id != account.id:
        raise HTTPException(status_code=404, detail="document not found")
    if body.target_case_id is None:
        doc.case_id = None
    else:
        # The target case must belong to the requesting user (no cross-scope attach).
        target = db.get(Case, uuid.UUID(body.target_case_id))
        if target is None or target.user_id != user.id:
            raise HTTPException(status_code=404, detail="target case not found")
        doc.case_id = target.id
    db.flush()
    return _doc_view(doc)


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


@router.post("/upload")
async def upload(
    file: UploadFile, user: User = Depends(get_current_user), db: Session = Depends(get_db)
) -> dict:
    """Upload a document (PDF/DOCX/text) → store → extract text + AI summary."""
    account = ensure_personal_account(db, user)
    from nm_core.billing import feature_allowed

    if not feature_allowed(db, account.id, "documents"):
        raise HTTPException(status_code=402, detail="document uploads require a paid plan")
    data = await file.read()
    title = file.filename or "upload"
    doc = docproc.DocumentRepository(db).create_upload(
        account_id=account.id, created_by=user.id, title=title, filename=title,
        content_type=file.content_type, storage_key="",
    )
    doc.storage_key = f"uploads/{account.id}/{doc.id}-{title}"
    get_storage().put(doc.storage_key, data)
    db.flush()
    docproc.process_upload(db, document_id=doc.id)
    return {
        "id": str(doc.id), "title": doc.title, "status": doc.status,
        "summary": doc.summary, "page_count": doc.page_count,
    }


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
