"""Seed a demo advocate with two cases — one "added via Nowlez web", one "added
via Munshi WhatsApp" — so the unified case book visibly shows both origins.

    python scripts/seed_demo.py
"""
from __future__ import annotations

import os
import sys
from datetime import datetime, timedelta, timezone

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.db import SessionLocal, init_db  # noqa: E402
from data_access.daos import user_dao  # noqa: E402
from data_access.models import Case  # noqa: E402

DEMO_PHONE = "+919999900000"

_CASES = [
    dict(
        cnr="DLHC010012342024",
        portal="highcourt",
        title="Sharma vs State of Delhi",
        case_status="Pending",
        days=7,
        parties=[
            {"name": "Sharma", "type": "petitioner"},
            {"name": "State of Delhi", "type": "respondent"},
        ],
        added_via="nowlez",
    ),
    dict(
        cnr="MHCC050067892023",
        portal="district",
        title="Patel vs Mehta",
        case_status="Disposed",
        days=21,
        parties=[
            {"name": "Patel", "type": "petitioner"},
            {"name": "Mehta", "type": "respondent"},
        ],
        added_via="munshi",
    ),
]


def seed() -> None:
    init_db()
    session = SessionLocal()
    try:
        user, _ = user_dao.get_or_create_by_phone(session, phone=DEMO_PHONE)
        user_dao.ensure_nowlez_extension(session, user.id, name="Demo Advocate")
        session.flush()

        now = datetime.now(timezone.utc)
        added = 0
        for spec in _CASES:
            exists = (
                session.query(Case)
                .filter_by(user_id=user.id, cnr=spec["cnr"])
                .first()
            )
            if exists:
                continue
            session.add(
                Case(
                    user_id=user.id,
                    cnr=spec["cnr"],
                    portal=spec["portal"],
                    title=spec["title"],
                    case_status=spec["case_status"],
                    next_hearing_date=now + timedelta(days=spec["days"]),
                    parties=spec["parties"],
                    raw_response={"added_via": spec["added_via"]},
                )
            )
            added += 1
        session.commit()
        print(
            f"Seeded user {user.id} ({DEMO_PHONE}); added {added} case(s), "
            f"{len(_CASES)} total. Dev-login with this phone to explore."
        )
    finally:
        session.close()


if __name__ == "__main__":
    seed()
