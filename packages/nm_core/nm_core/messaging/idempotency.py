"""Database idempotency claims: inbound message dedup + outbound daily slot."""
from __future__ import annotations

import uuid
from datetime import date

from sqlalchemy.dialects.postgresql import insert as pg_insert
from sqlalchemy.dialects.sqlite import insert as sqlite_insert
from sqlalchemy.orm import Session

from nm_core.db.models.messaging import MessageLog, OutboundMessage


def _insert(session: Session):
    return pg_insert if session.get_bind().dialect.name == "postgresql" else sqlite_insert


def claim_inbound(
    session: Session, *, meta_message_id: str, user_id: uuid.UUID | None = None
) -> bool:
    """Return True on first sighting of this provider message id; False on a Meta retry."""
    stmt = (
        _insert(session)(MessageLog)
        .values(meta_message_id=meta_message_id, user_id=user_id)
        .on_conflict_do_nothing(index_elements=["meta_message_id"])
    )
    result = session.execute(stmt)
    session.flush()
    return bool(result.rowcount and result.rowcount > 0)  # type: ignore[attr-defined]


def claim_daily_slot(
    session: Session,
    *,
    user_id: uuid.UUID,
    template_name: str,
    send_date_ist: date,
    to_phone: str,
) -> bool:
    """Return True if this (user, template, day) slot was free; False if already taken."""
    stmt = (
        _insert(session)(OutboundMessage)
        .values(
            user_id=user_id,
            template_name=template_name,
            send_date_ist=send_date_ist,
            to_phone=to_phone,
            kind="template",
        )
        .on_conflict_do_nothing(
            index_elements=["user_id", "template_name", "send_date_ist"]
        )
    )
    result = session.execute(stmt)
    session.flush()
    return bool(result.rowcount and result.rowcount > 0)  # type: ignore[attr-defined]
