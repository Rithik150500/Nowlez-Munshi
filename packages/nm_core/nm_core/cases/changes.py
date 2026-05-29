"""The alert engine: classify what changed between two fetched case snapshots.

Change types: status_change, hearing_date_change, new_orders, disposal, transfer.
A stage change that looks like a disposal is reported as ``disposal`` (higher impact),
not also as a generic ``status_change``.

A hearing-date change landing within ``URGENT_HEARING_DAYS`` is flagged ``urgent``:
the dispatcher delivers urgent changes in real time even to ``digest_only`` users
(a hearing two days out is too important to hold for the nightly digest). Ported
from the legacy bot's ``amendment_detected`` split.
"""
from __future__ import annotations

import re
from dataclasses import dataclass, field
from datetime import UTC, date, datetime
from typing import Literal
from zoneinfo import ZoneInfo

from nm_core.ecourts.models import Case

ChangeType = Literal[
    "status_change", "hearing_date_change", "new_orders", "disposal", "transfer"
]

_DISPOSED_RE = re.compile(r"dispos", re.IGNORECASE)
_IST = ZoneInfo("Asia/Kolkata")
URGENT_HEARING_DAYS = 3


@dataclass(frozen=True)
class Change:
    type: ChangeType
    summary: str
    detail: dict = field(default_factory=dict)
    urgent: bool = False


def _is_disposed(stage: str | None) -> bool:
    return bool(stage and _DISPOSED_RE.search(stage))


def _normalize_stage(s: str | None) -> str:
    return " ".join((s or "").lower().split())


def _today_ist() -> date:
    return datetime.now(UTC).astimezone(_IST).date()


def detect_changes(old: Case, new: Case, *, today: date | None = None) -> list[Change]:
    changes: list[Change] = []
    today = today or _today_ist()

    # Stage / disposal. Compare normalized (trim/lowercase/collapse-whitespace) so a
    # cosmetic NIC re-edit (casing/spacing only) doesn't fire a spurious status_change.
    if _normalize_stage(old.stage) != _normalize_stage(new.stage):
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

    # Next hearing date. A new date within URGENT_HEARING_DAYS is urgent — it must
    # reach the user in real time even if they're on digest_only.
    if old.next_hearing_date != new.next_hearing_date:
        nhd = new.next_hearing_date
        urgent = nhd is not None and 0 <= (nhd - today).days <= URGENT_HEARING_DAYS
        changes.append(
            Change(
                type="hearing_date_change",
                summary=(
                    ("⚠️ Hearing imminent — " if urgent else "")
                    + f"Next hearing: {old.next_hearing_date or '—'} → {nhd or '—'}"
                ),
                detail={
                    "old": old.next_hearing_date.isoformat() if old.next_hearing_date else None,
                    "new": nhd.isoformat() if nhd else None,
                },
                urgent=urgent,
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
