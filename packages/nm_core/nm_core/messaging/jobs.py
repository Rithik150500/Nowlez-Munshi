"""RQ job bodies for outbound WhatsApp sends.

Each opens its own DB session and runs the raw delivery primitive (no dedup — the
producer already deduped at enqueue). MetaTransientError propagates so RQ retries.
Module-level functions so RQ can serialize them by import path.
"""
from __future__ import annotations

import uuid

from nm_core.db.engine import session_scope
from nm_core.messaging.send import _deliver_template, _deliver_text


def do_send_text(
    *, to_phone: str, body: str, user_id: str | None = None, dedup_key: str | None = None
) -> str | None:
    uid = uuid.UUID(user_id) if user_id else None
    with session_scope() as session:
        return _deliver_text(
            session, to_phone=to_phone, body=body, user_id=uid, dedup_key=dedup_key
        )


def do_send_template(
    *,
    user_id: str,
    to_phone: str,
    template_name: str,
    language: str,
    body_variables: list[object],
) -> str | None:
    with session_scope() as session:
        return _deliver_template(
            session,
            user_id=uuid.UUID(user_id),
            to_phone=to_phone,
            template_name=template_name,
            language=language,
            body_variables=body_variables,
        )
