"""GDPR data export — a single ZIP of everything the user owns.

Greenfield is case-centric (no legacy "client" entity), so the tree flattens to
``cases/<cnr>/...`` directly. A 500 MB cap stops runaway exports (documents/orders can
be large); once exceeded, file blobs are skipped and ``metadata.json`` records why.
The JSON manifests are always complete — only binary blobs are capped.
"""
from __future__ import annotations

import io
import json
import zipfile
from datetime import UTC, datetime

from sqlalchemy import select
from sqlalchemy.orm import Session

from nm_core.ai.repository import ChatRepository
from nm_core.billing import SubscriptionRepository
from nm_core.cases import CaseRepository
from nm_core.db.models.document import Document
from nm_core.db.models.munshi_invoice import MunshiInvoice
from nm_core.db.models.notification import Notification
from nm_core.db.models.user import User
from nm_core.storage import get_storage
from nm_core.teams import AccountRepository

MAX_BYTES = 500 * 1024 * 1024  # 500 MB blob ceiling


def _j(obj: object) -> bytes:
    return json.dumps(obj, indent=2, default=str).encode("utf-8")


def build_user_export_zip(session: Session, *, user: User, today=None) -> bytes:
    """Build the user's full-data export ZIP and return its bytes."""
    today = today or datetime.now(UTC).date()
    root = f"nowlez-munshi-export-{today.isoformat()}"
    buf = io.BytesIO()
    blob_bytes = 0
    files_excluded = False

    with zipfile.ZipFile(buf, "w", zipfile.ZIP_DEFLATED) as zf:
        zf.writestr(f"{root}/profile.json", _j({
            "id": str(user.id), "phone": user.phone, "email": user.email,
            "name": user.name, "locale": user.locale, "timezone": user.timezone,
            "created_at": user.created_at, "onboarded_at": user.onboarded_at,
        }))

        storage = get_storage()
        cases = CaseRepository(session).list_by_user(user.id)
        for case in cases:
            base = f"{root}/cases/{case.cnr}"
            zf.writestr(f"{base}/case.json", _j({
                "cnr": case.cnr, "title": case.title, "court": case.court,
                "judge": case.judge, "stage": case.stage,
                "next_hearing_date": case.next_hearing_date,
                "parties": case.parties, "acts": case.acts, "history": case.history,
            }))
            orders = CaseRepository(session).list_orders(case.id)
            zf.writestr(f"{base}/orders.json", _j([
                {"order_id": o.order_id, "order_date": o.order_date,
                 "name": o.descriptive_name, "summary": o.summary} for o in orders
            ]))
            for o in orders:
                blob_bytes, files_excluded = _maybe_add_blob(
                    zf, storage, o.file_path, f"{base}/orders/{o.order_id}.pdf",
                    blob_bytes, files_excluded)

        # Documents (account-scoped).
        account_ids = [a.id for a in AccountRepository(session).list_accounts_for_user(user.id)]
        docs = session.execute(
            select(Document).where(Document.account_id.in_(account_ids))
        ).scalars().all() if account_ids else []
        zf.writestr(f"{root}/documents.json", _j([
            {"id": str(d.id), "title": d.title, "filename": d.filename,
             "document_type": d.document_type, "summary": d.summary,
             "case_id": str(d.case_id) if d.case_id else None} for d in docs
        ]))
        for d in docs:
            blob_bytes, files_excluded = _maybe_add_blob(
                zf, storage, d.storage_key, f"{root}/documents/{d.id}-{d.filename}",
                blob_bytes, files_excluded)

        # Chat history.
        chat = ChatRepository(session)
        threads = []
        for t in chat.list_threads(user.id, limit=500):
            msgs = chat.recent_messages(t.id, limit=1000)
            threads.append({
                "id": str(t.id), "channel": t.channel, "created_at": t.created_at,
                "messages": [{"role": m.role, "content": m.content,
                              "created_at": m.created_at} for m in msgs],
            })
        zf.writestr(f"{root}/chat_history.json", _j(threads))

        # Notifications.
        notifs = session.execute(
            select(Notification).where(Notification.user_id == user.id)
        ).scalars().all()
        zf.writestr(f"{root}/notifications.json", _j([
            {"type": n.type, "title": n.title, "body": n.body, "cnr": n.cnr,
             "read_at": n.read_at, "created_at": n.created_at} for n in notifs
        ]))

        # Billing.
        sub = SubscriptionRepository(session).get_latest(account_ids[0]) if account_ids else None
        invoices = session.execute(
            select(MunshiInvoice).where(MunshiInvoice.user_id == user.id)
        ).scalars().all()
        zf.writestr(f"{root}/billing.json", _j({
            "subscription": ({"tier": sub.tier, "status": sub.status,
                              "period_end": sub.period_end} if sub else None),
            "munshi_invoices": [
                {"cycle_start": i.cycle_start, "cycle_end": i.cycle_end,
                 "case_count": i.case_count, "amount_inr": i.amount_inr,
                 "status": i.status} for i in invoices],
        }))

        zf.writestr(f"{root}/metadata.json", _j({
            "exported_at": datetime.now(UTC), "case_count": len(cases),
            "document_count": len(docs), "files_included": not files_excluded,
            "files_excluded_reason": "500MB size cap exceeded" if files_excluded else None,
        }))

    return buf.getvalue()


def _maybe_add_blob(zf, storage, key, arcname, blob_bytes, files_excluded):
    """Add a stored blob to the ZIP unless the size cap is hit. Returns updated state."""
    if not key:
        return blob_bytes, files_excluded
    try:
        data = storage.get(key)
    except (OSError, KeyError):
        return blob_bytes, files_excluded
    if blob_bytes + len(data) > MAX_BYTES:
        return blob_bytes, True  # over cap — skip this and mark excluded
    zf.writestr(arcname, data)
    return blob_bytes + len(data), files_excluded


def can_export(user: User, *, now=None) -> bool:
    """True if the user hasn't exported within the last hour (1/hour limit)."""
    now = now or datetime.now(UTC)
    if user.last_export_at is None:
        return True
    last = user.last_export_at
    if last.tzinfo is None:
        last = last.replace(tzinfo=UTC)
    return (now - last).total_seconds() >= 3600
