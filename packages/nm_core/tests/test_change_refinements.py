"""Wave 2 change-diff refinements: amendment urgency + forgotten-mid-cron recheck."""
from __future__ import annotations

from datetime import date, timedelta

import fakeredis
import pytest

from nm_core.cases import CaseRepository
from nm_core.cases.changes import detect_changes
from nm_core.config import get_settings
from nm_core.db.models.case import CasePreference
from nm_core.ecourts.models import Case as FetchedCase
from nm_core.ecourts.models import OrderRef, Party
from nm_core.ecourts.offline import clear_offline_cases, register_offline_case
from nm_core.identity.repositories import UserRepository
from nm_core.messaging import redis_dedup
from nm_core.notifications.dispatch import _realtime_allowed
from nm_core.tracking import run_refresh_sweep, track_case

CNR = "DLND010000012024"
TODAY = date(2026, 6, 1)


def _case(**kw) -> FetchedCase:
    base = dict(
        cnr=CNR, title="A vs B", court="Court X", stage="Appearance",
        next_hearing_date=date(2026, 7, 1), judge="J1",
        parties=[Party(name="A", role="petitioner")],
        orders=[OrderRef(order_date=date(2026, 1, 1), order_url="u1", order_id="1")],
    )
    base.update(kw)
    return FetchedCase(**base)


def _hearing_change(old_nhd: date, new_nhd: date):
    old, new = _case(next_hearing_date=old_nhd), _case(next_hearing_date=new_nhd)
    changes = [c for c in detect_changes(old, new, today=TODAY) if c.type == "hearing_date_change"]
    return changes[0]


def test_imminent_hearing_is_urgent():
    change = _hearing_change(date(2026, 12, 1), TODAY + timedelta(days=2))
    assert change.urgent is True
    assert "imminent" in change.summary.lower()


def test_far_hearing_is_not_urgent():
    change = _hearing_change(date(2026, 12, 1), TODAY + timedelta(days=30))
    assert change.urgent is False


def test_urgent_change_reaches_digest_only_user():
    """digest_only normally suppresses real-time alerts, but not urgent ones."""
    pref = CasePreference(alert_level="digest_only")
    urgent = _hearing_change(date(2026, 12, 1), TODAY + timedelta(days=1))
    assert urgent.urgent is True
    assert _realtime_allowed(urgent, pref) is True
    # a non-urgent hearing change for the same user is still suppressed
    slow = _hearing_change(date(2026, 12, 1), TODAY + timedelta(days=40))
    assert _realtime_allowed(slow, pref) is False


@pytest.fixture
def env(monkeypatch):
    monkeypatch.setattr(get_settings(), "ECOURTS_OFFLINE", True)
    monkeypatch.setattr(get_settings(), "WHATSAPP_DISABLED", True)
    monkeypatch.setattr(redis_dedup, "_client", fakeredis.FakeStrictRedis())
    clear_offline_cases()
    yield
    clear_offline_cases()
    monkeypatch.setattr(redis_dedup, "_client", None)


def test_sweep_skips_case_forgotten_mid_batch(db_session, env, monkeypatch):
    user, _ = UserRepository(db_session).get_or_create_by_phone(phone="+919100000081")
    register_offline_case(CNR, _case())
    track_case(db_session, user=user, cnr=CNR)
    case = CaseRepository(db_session).get_by_cnr(user.id, CNR)

    # Simulate the case being selected into the due batch and then /forgotten before
    # the sweep reaches it: due returns it, but the just-before-firing recheck finds
    # it gone.
    monkeypatch.setattr(CaseRepository, "get_due_for_refresh", lambda self, *, limit=100: [case])
    monkeypatch.setattr(CaseRepository, "get_by_cnr", lambda self, uid, cnr: None)

    stats = run_refresh_sweep(db_session)
    assert stats["skipped"] >= 1
    assert stats["refreshed"] == 0


def test_cosmetic_stage_edit_is_not_a_change():
    """A casing/whitespace-only stage re-edit must not fire a status_change (regression #5)."""
    old = _case(stage="Appearance")
    new = _case(stage="  appearance  ")
    assert [c for c in detect_changes(old, new, today=TODAY) if c.type == "status_change"] == []


def test_real_stage_change_still_fires():
    old = _case(stage="Appearance")
    new = _case(stage="Arguments")
    assert any(c.type == "status_change" for c in detect_changes(old, new, today=TODAY))
