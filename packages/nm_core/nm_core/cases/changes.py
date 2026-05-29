"""The alert engine: classify what changed between two fetched case snapshots.

Change types: status_change, hearing_date_change, new_orders, disposal, transfer.
A stage change that looks like a disposal is reported as ``disposal`` (higher impact),
not also as a generic ``status_change``.
"""
from __future__ import annotations

import re
from dataclasses import dataclass, field
from typing import Literal

from nm_core.ecourts.models import Case

ChangeType = Literal[
    "status_change", "hearing_date_change", "new_orders", "disposal", "transfer"
]

_DISPOSED_RE = re.compile(r"dispos", re.IGNORECASE)


@dataclass(frozen=True)
class Change:
    type: ChangeType
    summary: str
    detail: dict = field(default_factory=dict)


def _is_disposed(stage: str | None) -> bool:
    return bool(stage and _DISPOSED_RE.search(stage))


def detect_changes(old: Case, new: Case) -> list[Change]:
    changes: list[Change] = []

    # Stage / disposal
    if (old.stage or "") != (new.stage or ""):
        if _is_disposed(new.stage) and not _is_disposed(old.stage):
            changes.append(
                Change(
                    type="disposal",
                    summary=f"Case disposed: {new.stage}",
                    detail={"old": old.stage, "new": new.stage},
                )
            )
        else:
            changes.append(
                Change(
                    type="status_change",
                    summary=f"Stage changed: {old.stage or '—'} → {new.stage or '—'}",
                    detail={"old": old.stage, "new": new.stage},
                )
            )

    # Next hearing date
    if old.next_hearing_date != new.next_hearing_date:
        changes.append(
            Change(
                type="hearing_date_change",
                summary=(
                    f"Next hearing: {old.next_hearing_date or '—'} → "
                    f"{new.next_hearing_date or '—'}"
                ),
                detail={
                    "old": old.next_hearing_date.isoformat() if old.next_hearing_date else None,
                    "new": new.next_hearing_date.isoformat() if new.next_hearing_date else None,
                },
            )
        )

    # New orders
    old_ids = {o.order_id for o in old.orders}
    new_order_refs = [o for o in new.orders if o.order_id not in old_ids]
    if new_order_refs:
        changes.append(
            Change(
                type="new_orders",
                summary=f"{len(new_order_refs)} new order(s)",
                detail={
                    "order_ids": [o.order_id for o in new_order_refs],
                    "order_dates": [o.order_date.isoformat() for o in new_order_refs],
                },
            )
        )

    # Transfer (court changed)
    if (old.court or "") != (new.court or ""):
        changes.append(
            Change(
                type="transfer",
                summary=f"Court changed: {old.court or '—'} → {new.court or '—'}",
                detail={"old": old.court, "new": new.court},
            )
        )

    return changes
