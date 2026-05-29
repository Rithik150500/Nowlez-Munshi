"""Case sync, change detection, and repositories (offline eCourts)."""
from __future__ import annotations

from datetime import date

import pytest

from nm_core.cases import (
    CasePreferenceRepository,
    CaseRepository,
    detect_changes,
    sync_case,
)
from nm_core.config import get_settings
from nm_core.ecourts.models import Case as FetchedCase
from nm_core.ecourts.models import OrderRef, Party
from nm_core.ecourts.offline import clear_offline_cases, register_offline_case
from nm_core.identity.repositories import UserRepository

CNR = "DLND010000012024"


@pytest.fixture(autouse=True)
def offline(monkeypatch):
    monkeypatch.setattr(get_settings(), "ECOURTS_OFFLINE", True)
    clear_offline_cases()
    yield
    clear_offline_cases()


def _user(db_session):
    user, _ = UserRepository(db_session).get_or_create_by_phone(phone="+919100000001", name="Adv")
    return user


def _case(**overrides) -> FetchedCase:
    base = {
        "cnr": CNR,
        "title": "A vs B",
        "court": "Court X",
        "stage": "Appearance",
        "next_hearing_date": date(2026, 7, 1),
        "judge": "J1",
        "parties": [Party(name="A", role="petitioner")],
        "orders": [OrderRef(order_date=date(2026, 1, 1), order_url="u1", order_id="1")],
    }
    base.update(overrides)
    return FetchedCase(**base)


# --- change detection ---
def test_detect_status_change():
    old = _case()
    new = _case(stage="Arguments")
    changes = detect_changes(old, new)
    assert [c.type for c in changes] == ["status_change"]


def test_detect_disposal_not_status():
    changes = detect_changes(_case(), _case(stage="Case Disposed"))
    assert [c.type for c in changes] == ["disposal"]


def test_detect_hearing_date_change():
    changes = detect_changes(_case(), _case(next_hearing_date=date(2026, 8, 1)))
    assert [c.type for c in changes] == ["hearing_date_change"]


def test_detect_new_orders():
    new = _case(
        orders=[
            OrderRef(order_date=date(2026, 1, 1), order_url="u1", order_id="1"),
            OrderRef(order_date=date(2026, 2, 1), order_url="u2", order_id="2"),
        ]
    )
    changes = detect_changes(_case(), new)
    assert [c.type for c in changes] == ["new_orders"]
    assert changes[0].detail["order_ids"] == ["2"]


def test_detect_transfer():
    changes = detect_changes(_case(), _case(court="Court Y"))
    assert [c.type for c in changes] == ["transfer"]


def test_detect_no_change():
    assert detect_changes(_case(), _case()) == []


# --- sync ---
def test_sync_first_fetch_creates_no_changes(db_session):
    user = _user(db_session)
    register_offline_case(CNR, _case())
    case, changes = sync_case(db_session, user_id=user.id, cnr=CNR, added_via="whatsapp")
    assert changes == []
    assert case.cnr == CNR
    assert case.added_via == "whatsapp"
    assert case.portal == "district"
    assert case.last_refreshed_at is not None
    assert len(CaseRepository(db_session).list_orders(case.id)) == 1


def test_sync_second_fetch_detects_changes(db_session):
    user = _user(db_session)
    register_offline_case(CNR, _case())
    sync_case(db_session, user_id=user.id, cnr=CNR)
    # the portal moves the hearing and adds an order
    register_offline_case(
        CNR,
        _case(
            next_hearing_date=date(2026, 9, 9),
            orders=[
                OrderRef(order_date=date(2026, 1, 1), order_url="u1", order_id="1"),
                OrderRef(order_date=date(2026, 3, 1), order_url="u3", order_id="3"),
            ],
        ),
    )
    case, changes = sync_case(db_session, user_id=user.id, cnr=CNR)
    types = {c.type for c in changes}
    assert types == {"hearing_date_change", "new_orders"}
    assert case.last_change_at is not None
    assert len(CaseRepository(db_session).list_orders(case.id)) == 2


# --- repositories ---
def test_refresh_queue_orders_never_refreshed_first(db_session):
    user = _user(db_session)
    register_offline_case(CNR, _case())
    sync_case(db_session, user_id=user.id, cnr=CNR)
    due = CaseRepository(db_session).get_due_for_refresh(limit=10)
    assert [c.cnr for c in due] == [CNR]


def test_delete_removes_case_and_prefs(db_session):
    user = _user(db_session)
    register_offline_case(CNR, _case())
    sync_case(db_session, user_id=user.id, cnr=CNR)
    CasePreferenceRepository(db_session).upsert(user.id, CNR, alert_level="orders_only")
    repo = CaseRepository(db_session)
    assert repo.delete(user.id, CNR) is True
    assert repo.get_by_cnr(user.id, CNR) is None
    assert CasePreferenceRepository(db_session).get(user.id, CNR) is None


def test_pref_upsert_and_snooze(db_session):
    user = _user(db_session)
    prefs = CasePreferenceRepository(db_session)
    prefs.upsert(user.id, CNR, alert_level="digest_only")
    until = None
    pref = prefs.upsert(user.id, CNR, snooze_until=None, label="Important")
    assert pref.alert_level == "digest_only"  # preserved
    assert pref.label == "Important"
    assert until is None
