"""Repositories for cases, orders, and per-case preferences."""
from __future__ import annotations

import uuid
from datetime import datetime

from sqlalchemy import delete, select
from sqlalchemy.orm import Session

from nm_core.db.models.case import Case, CaseOrder, CasePreference
from nm_core.ecourts.models import OrderRef


class CaseRepository:
    def __init__(self, session: Session) -> None:
        self.s = session

    def get_by_cnr(self, user_id: uuid.UUID, cnr: str) -> Case | None:
        return self.s.execute(
            select(Case).where(Case.user_id == user_id, Case.cnr == cnr)
        ).scalar_one_or_none()

    def list_by_user(self, user_id: uuid.UUID, *, limit: int = 200) -> list[Case]:
        return list(
            self.s.execute(
                select(Case)
                .where(Case.user_id == user_id)
                .order_by(Case.created_at.desc())
                .limit(limit)
            ).scalars()
        )

    def list_visible(self, user_ids: set[uuid.UUID], *, limit: int = 500) -> list[Case]:
        """Cases owned by any of these users (the team case book)."""
        return list(
            self.s.execute(
                select(Case)
                .where(Case.user_id.in_(user_ids))
                .order_by(Case.created_at.desc())
                .limit(limit)
            ).scalars()
        )

    def get_visible(
        self, user_ids: set[uuid.UUID], cnr: str, *, prefer: uuid.UUID | None = None
    ) -> Case | None:
        """A case by CNR among the given users — preferring ``prefer``'s own copy."""
        rows = list(
            self.s.execute(
                select(Case).where(Case.user_id.in_(user_ids), Case.cnr == cnr)
            ).scalars()
        )
        if not rows:
            return None
        if prefer is not None:
            for c in rows:
                if c.user_id == prefer:
                    return c
        return rows[0]

    def get_due_for_refresh(self, *, limit: int = 100) -> list[Case]:
        """Refresh-eligible cases, never-refreshed first (NULLS FIRST)."""
        return list(
            self.s.execute(
                select(Case)
                .where(Case.refresh_enabled.is_(True))
                .order_by(Case.last_refreshed_at.asc().nulls_first())
                .limit(limit)
            ).scalars()
        )

    def toggle_refresh(self, user_id: uuid.UUID, cnr: str) -> bool:
        case = self.get_by_cnr(user_id, cnr)
        if case is None:
            raise LookupError(f"case not found: {cnr}")
        case.refresh_enabled = not case.refresh_enabled
        self.s.flush()
        return case.refresh_enabled

    def delete(self, user_id: uuid.UUID, cnr: str) -> bool:
        """Delete a case (orders cascade) and its preferences."""
        case = self.get_by_cnr(user_id, cnr)
        if case is None:
            return False
        self.s.execute(
            delete(CasePreference).where(
                CasePreference.user_id == user_id, CasePreference.cnr == cnr
            )
        )
        self.s.delete(case)
        self.s.flush()
        return True

    def upsert_order(self, case_id: uuid.UUID, ref: OrderRef) -> CaseOrder:
        existing = self.s.execute(
            select(CaseOrder).where(
                CaseOrder.case_id == case_id, CaseOrder.order_id == ref.order_id
            )
        ).scalar_one_or_none()
        if existing is not None:
            existing.order_date = ref.order_date
            existing.order_url = ref.order_url
            self.s.flush()
            return existing
        order = CaseOrder(
            case_id=case_id,
            order_id=ref.order_id,
            order_date=ref.order_date,
            order_url=ref.order_url,
        )
        self.s.add(order)
        self.s.flush()
        return order

    def list_orders(self, case_id: uuid.UUID) -> list[CaseOrder]:
        return list(
            self.s.execute(
                select(CaseOrder)
                .where(CaseOrder.case_id == case_id)
                .order_by(CaseOrder.order_date.desc())
            ).scalars()
        )


class CasePreferenceRepository:
    def __init__(self, session: Session) -> None:
        self.s = session

    def get(self, user_id: uuid.UUID, cnr: str) -> CasePreference | None:
        return self.s.get(CasePreference, (user_id, cnr))

    def list_for_user(self, user_id: uuid.UUID) -> list[CasePreference]:
        return list(
            self.s.execute(
                select(CasePreference).where(CasePreference.user_id == user_id)
            ).scalars()
        )

    def upsert(
        self,
        user_id: uuid.UUID,
        cnr: str,
        *,
        alert_level: str | None = None,
        snooze_until: datetime | None = None,
        digest_enabled: bool | None = None,
        label: str | None = None,
    ) -> CasePreference:
        pref = self.get(user_id, cnr)
        if pref is None:
            pref = CasePreference(user_id=user_id, cnr=cnr)
            self.s.add(pref)
        if alert_level is not None:
            pref.alert_level = alert_level
        if snooze_until is not None:
            pref.snooze_until = snooze_until
        if digest_enabled is not None:
            pref.digest_enabled = digest_enabled
        if label is not None:
            pref.label = label
        self.s.flush()
        return pref
