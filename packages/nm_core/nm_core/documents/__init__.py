"""Order-document processing: fetch PDF → store → extract text → AI summary."""
from __future__ import annotations

import io
import uuid

from sqlalchemy import select
from sqlalchemy.orm import Session

from nm_core import ai, ecourts
from nm_core.db.models.case import CaseOrder
from nm_core.storage import get_storage


def extract_text(pdf: bytes) -> str:
    try:
        import pdfplumber

        with pdfplumber.open(io.BytesIO(pdf)) as doc:
            return "\n".join((page.extract_text() or "") for page in doc.pages)
    except Exception:  # noqa: BLE001 — scanned/invalid PDFs → no text (OCR is future work)
        return ""


def page_count(pdf: bytes) -> int | None:
    try:
        import pdfplumber

        with pdfplumber.open(io.BytesIO(pdf)) as doc:
            return len(doc.pages)
    except Exception:  # noqa: BLE001
        return None


def process_order(session: Session, *, order_id: uuid.UUID) -> CaseOrder | None:
    """Download, store, and AI-summarize one order. Idempotent-ish (re-stores)."""
    order = session.get(CaseOrder, order_id)
    if order is None or not order.order_url:
        return order
    pdf = ecourts.fetch_pdf(order.order_url)
    order.file_path = get_storage().put(f"orders/{order.case_id}/{order.order_id}.pdf", pdf)
    order.page_count = page_count(pdf)
    order.summary = ai.summarize_order(extract_text(pdf))
    if not order.descriptive_name:
        order.descriptive_name = f"Order dated {order.order_date}"
    session.flush()
    return order


def list_unprocessed(session: Session, *, limit: int = 50) -> list[CaseOrder]:
    return list(
        session.execute(
            select(CaseOrder).where(CaseOrder.file_path.is_(None)).limit(limit)
        ).scalars()
    )


def process_for_case(session: Session, *, case_id: uuid.UUID) -> int:
    rows = session.execute(
        select(CaseOrder).where(CaseOrder.case_id == case_id, CaseOrder.file_path.is_(None))
    ).scalars()
    n = 0
    for order in rows:
        process_order(session, order_id=order.id)
        n += 1
    return n


def process_pending(session: Session, *, limit: int = 50) -> int:
    n = 0
    for order in list_unprocessed(session, limit=limit):
        process_order(session, order_id=order.id)
        n += 1
    return n
