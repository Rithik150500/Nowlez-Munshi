"""Shared test helpers."""
from __future__ import annotations

from datetime import datetime, timedelta, timezone

from data_access.daos import user_dao
from data_access.models import Case


def make_user_with_cases(db, phone: str, *, with_munshi_origin: bool = True):
    """Create a user + a Nowlez-origin case (and optionally a Munshi-origin one).
    Returns the user."""
    user, _ = user_dao.get_or_create_by_phone(db, phone=phone)
    user_dao.ensure_nowlez_extension(db, user.id, name="Test Advocate")
    db.flush()
    now = datetime.now(timezone.utc)
    db.add(
        Case(
            user_id=user.id,
            cnr="DLHC010012342024",
            portal="highcourt",
            title="Sharma vs State",
            case_status="Pending",
            next_hearing_date=datetime(2026, 6, 15, tzinfo=timezone.utc),
            parties=[],
            raw_response={"added_via": "nowlez"},
        )
    )
    if with_munshi_origin:
        db.add(
            Case(
                user_id=user.id,
                cnr="MHCC050067892023",
                portal="district",
                title="Patel vs Mehta",
                case_status="Disposed",
                next_hearing_date=now + timedelta(days=21),
                parties=[],
                raw_response={"added_via": "munshi"},
            )
        )
    db.commit()
    return user
