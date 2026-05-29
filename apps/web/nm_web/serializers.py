"""Plain dict serializers for API responses."""
from __future__ import annotations

from nm_core.db.models.case import Case, CaseOrder
from nm_core.db.models.notification import Notification


def case_summary(case: Case) -> dict:
    return {
        "cnr": case.cnr,
        "title": case.title,
        "court": case.court,
        "judge": case.judge,
        "stage": case.stage,
        "portal": case.portal,
        "next_hearing_date": case.next_hearing_date.isoformat() if case.next_hearing_date else None,
        "added_via": case.added_via,
        "refresh_enabled": case.refresh_enabled,
        "last_refreshed_at": case.last_refreshed_at.isoformat() if case.last_refreshed_at else None,
        "last_change_at": case.last_change_at.isoformat() if case.last_change_at else None,
    }


def case_detail(case: Case, orders: list[CaseOrder]) -> dict:
    return {
        **case_summary(case),
        "parties": case.parties,
        "acts": case.acts,
        "history": case.history,
        "orders": [order(o) for o in orders],
    }


def order(o: CaseOrder) -> dict:
    return {
        "order_id": o.order_id,
        "order_date": o.order_date.isoformat() if o.order_date else None,
        "order_url": o.order_url,
        "descriptive_name": o.descriptive_name,
        "summary": o.summary,
    }


def notification(n: Notification) -> dict:
    return {
        "id": str(n.id),
        "cnr": n.cnr,
        "type": n.type,
        "title": n.title,
        "body": n.body,
        "channels_sent": n.channels_sent,
        "read_at": n.read_at.isoformat() if n.read_at else None,
        "created_at": n.created_at.isoformat() if n.created_at else None,
    }
