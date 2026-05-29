"""Notification dispatch policy + in-app feed."""
from __future__ import annotations

from datetime import UTC, datetime, timedelta

import fakeredis
import pytest

from nm_core.cases import CasePreferenceRepository, sync_case
from nm_core.cases.changes import Change
from nm_core.config import get_settings
from nm_core.ecourts.models import Case as FetchedCase
from nm_core.ecourts.models import Party
from nm_core.ecourts.offline import clear_offline_cases, register_offline_case
from nm_core.identity.repositories import UserRepository
from nm_core.messaging import redis_dedup
from nm_core.notifications import NotificationRepository, dispatch_change
from nm_core.notifications.dispatch import _realtime_allowed

CNR = "DLND010000012024"


@pytest.fixture(autouse=True)
def env(monkeypatch):
    monkeypatch.setattr(get_settings(), "ECOURTS_OFFLINE", True)
    monkeypatch.setattr(get_settings(), "WHATSAPP_DISABLED", False)
    monkeypatch.setattr(redis_dedup, "_client", fakeredis.FakeStrictRedis())
    clear_offline_cases()
    yield
    clear_offline_cases()
    monkeypatch.setattr(redis_dedup, "_client", None)


def _setup(db_session):
    user, _ = UserRepository(db_session).get_or_create_by_phone(phone="+919100000021", name="Adv")
    register_offline_case(
        CNR,
        FetchedCase(
            cnr=CNR, title="A vs B", court="Court X", stage="Appearance",
            next_hearing_date=None, judge="J1",
            parties=[Party(name="A", role="petitioner")], orders=[],
        ),
    )
    case, _ = sync_case(db_session, user_id=user.id, cnr=CNR)
    return user, case


def _mk(level: str, snooze=None):
    class P:
        alert_level = level
        snooze_until = snooze
    return P()


# --- policy ---
def test_policy_all_allows_everything():
    for t in ("status_change", "new_orders", "disposal", "transfer", "hearing_date_change"):
        assert _realtime_allowed(Change(type=t, summary=""), _mk("all")) is True


def test_policy_orders_only():
    assert _realtime_allowed(Change(type="new_orders", summary=""), _mk("orders_only")) is True
    assert _realtime_allowed(Change(type="status_change", summary=""), _mk("orders_only")) is False


def test_policy_digest_only_blocks_realtime():
    assert _realtime_allowed(Change(type="new_orders", summary=""), _mk("digest_only")) is False


def test_policy_snooze_suppresses():
    future = datetime.now(UTC) + timedelta(days=1)
    assert _realtime_allowed(Change(type="new_orders", summary=""), _mk("all", future)) is False


def test_policy_default_is_all_when_no_pref():
    assert _realtime_allowed(Change(type="disposal", summary=""), None) is True


# --- dispatch ---
def test_dispatch_creates_in_app_and_sends_whatsapp(db_session, monkeypatch):
    user, case = _setup(db_session)
    sent = {}
    monkeypatch.setattr(
        "nm_core.notifications.dispatch.messaging.enqueue_send_text",
        lambda **kw: sent.update(kw) or True,
    )
    n = dispatch_change(
        db_session, user=user, case=case, change=Change(type="new_orders", summary="1 new order")
    )
    assert n.channels_sent == ["in_app", "whatsapp"]
    assert "new order" in sent["body"]
    feed = NotificationRepository(db_session).list_by_user(user.id)
    assert len(feed) == 1


def test_dispatch_in_app_only_when_digest_only(db_session, monkeypatch):
    user, case = _setup(db_session)
    CasePreferenceRepository(db_session).upsert(user.id, CNR, alert_level="digest_only")
    pref = CasePreferenceRepository(db_session).get(user.id, CNR)
    called = {"n": 0}
    monkeypatch.setattr(
        "nm_core.notifications.dispatch.messaging.enqueue_send_text",
        lambda **kw: called.update(n=called["n"] + 1) or True,
    )
    n = dispatch_change(
        db_session, user=user, case=case,
        change=Change(type="new_orders", summary="x"), pref=pref,
    )
    assert n.channels_sent == ["in_app"]
    assert called["n"] == 0
