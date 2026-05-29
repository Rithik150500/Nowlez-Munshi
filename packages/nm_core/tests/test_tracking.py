"""End-to-end tracking orchestration: track -> refresh -> dispatch sweep (offline)."""
from __future__ import annotations

from datetime import date

import fakeredis
import pytest

from nm_core.config import get_settings
from nm_core.ecourts.models import Case as FetchedCase
from nm_core.ecourts.models import OrderRef, Party
from nm_core.ecourts.offline import clear_offline_cases, register_offline_case
from nm_core.identity.repositories import UserRepository
from nm_core.messaging import redis_dedup
from nm_core.notifications import NotificationRepository
from nm_core.tracking import refresh_case, run_refresh_sweep, track_case

CNR = "DLND010000012024"


@pytest.fixture(autouse=True)
def env(monkeypatch):
    monkeypatch.setattr(get_settings(), "ECOURTS_OFFLINE", True)
    monkeypatch.setattr(get_settings(), "WHATSAPP_DISABLED", True)  # no real sends in this test
    monkeypatch.setattr(redis_dedup, "_client", fakeredis.FakeStrictRedis())
    clear_offline_cases()
    yield
    clear_offline_cases()
    monkeypatch.setattr(redis_dedup, "_client", None)


def _case(**kw) -> FetchedCase:
    base = dict(
        cnr=CNR, title="A vs B", court="Court X", stage="Appearance",
        next_hearing_date=date(2026, 7, 1), judge="J1",
        parties=[Party(name="A", role="petitioner")],
        orders=[OrderRef(order_date=date(2026, 1, 1), order_url="u1", order_id="1")],
    )
    base.update(kw)
    return FetchedCase(**base)


def test_track_then_refresh_dispatches(db_session):
    user, _ = UserRepository(db_session).get_or_create_by_phone(phone="+919100000031", name="Adv")
    register_offline_case(CNR, _case())
    first = track_case(db_session, user=user, cnr=CNR, added_via="whatsapp")
    assert first.changes == [] and first.notifications == []

    register_offline_case(CNR, _case(stage="Arguments"))
    result = refresh_case(db_session, user=user, cnr=CNR)
    assert [c.type for c in result.changes] == ["status_change"]
    # in-app notification recorded (whatsapp suppressed by kill-switch)
    assert result.notifications[0].channels_sent == ["in_app"]
    assert len(NotificationRepository(db_session).list_by_user(user.id)) == 1


def test_refresh_sweep_counts(db_session):
    user, _ = UserRepository(db_session).get_or_create_by_phone(phone="+919100000032")
    register_offline_case(CNR, _case())
    track_case(db_session, user=user, cnr=CNR)
    register_offline_case(CNR, _case(court="Court Y"))  # transfer
    counts = run_refresh_sweep(db_session, limit=10)
    assert counts == {"refreshed": 1, "changed": 1, "errored": 0, "skipped": 0, "due": 1}
