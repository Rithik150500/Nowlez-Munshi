"""Drip lifecycle: pure decision logic (IST, catch-up, cursor, terminal) + scheduler."""
from __future__ import annotations

from datetime import UTC, datetime, timedelta

import fakeredis
import pytest

from nm_core import drip, email
from nm_core.cases import sync_case
from nm_core.config import get_settings
from nm_core.db.models.drip_state import UserDripState
from nm_core.ecourts.models import Case as FetchedCase
from nm_core.ecourts.offline import clear_offline_cases, register_offline_case
from nm_core.identity.repositories import UserRepository
from nm_core.messaging import redis_dedup

CNR = "DLND010000012024"
SIGNUP = datetime(2026, 5, 1, 12, 0, tzinfo=UTC)


def _state(**kw):
    base = dict(last_step_sent_day=-1, became_active_at=None, catch_up_pending=False,
                catch_up_sent_at=None, terminal=False)
    base.update(kw)
    return base


# --- pure decision logic ---
def test_day_bucket_is_ist():
    # 2026-05-01 19:30 UTC = 2026-05-02 01:00 IST → day 1 already in IST
    now = datetime(2026, 5, 1, 19, 30, tzinfo=UTC)
    assert drip.compute_day_since_signup(SIGNUP, now) == 1
    # 2026-05-01 17:00 UTC = 22:30 IST same day → day 0
    assert drip.compute_day_since_signup(SIGNUP, datetime(2026, 5, 1, 17, 0, tzinfo=UTC)) == 0


def test_active_day1_sends_active_template():
    d = drip.evaluate_drip_for_user(
        signup_at_utc=SIGNUP, case_count=1, state=_state(),
        now_utc=SIGNUP + timedelta(days=1))
    assert d.track == "active" and d.send_step_template == "d1_active"
    assert d.new_last_step_sent_day == 1


def test_cursor_dedupes_same_day():
    d = drip.evaluate_drip_for_user(
        signup_at_utc=SIGNUP, case_count=0, state=_state(last_step_sent_day=1),
        now_utc=SIGNUP + timedelta(days=1))
    assert d.send_step_template is None  # already sent day 1


def test_late_activation_triggers_catch_up():
    # Inactive through day 5, then activates → missed D1-3 active emails → catch-up
    d = drip.evaluate_drip_for_user(
        signup_at_utc=SIGNUP, case_count=1, state=_state(last_step_sent_day=4),
        now_utc=SIGNUP + timedelta(days=5))
    assert d.set_became_active_at and d.set_catch_up_pending and d.send_catch_up


def test_terminal_after_day_27():
    d = drip.evaluate_drip_for_user(
        signup_at_utc=SIGNUP, case_count=1, state=_state(),
        now_utc=SIGNUP + timedelta(days=30))
    assert d.set_terminal is True


# --- scheduler integration ---
@pytest.fixture
def env(monkeypatch):
    monkeypatch.setattr(get_settings(), "ECOURTS_OFFLINE", True)
    monkeypatch.setattr(redis_dedup, "_client", fakeredis.FakeStrictRedis())
    email.sent_outbox.clear()
    clear_offline_cases()
    yield
    clear_offline_cases()
    monkeypatch.setattr(redis_dedup, "_client", None)


def _user(db_session, phone, *, email_addr, created_at):
    user, _ = UserRepository(db_session).get_or_create_by_phone(phone=phone)
    user.email = email_addr
    user.created_at = created_at
    db_session.flush()
    return user


def test_scheduler_sends_and_is_idempotent(db_session, env):
    now = datetime(2026, 5, 2, 6, 0, tzinfo=UTC)  # day 1 IST for a 2026-05-01 signup
    user = _user(db_session, "+919100000951", email_addr="a@x.test", created_at=SIGNUP)
    register_offline_case(CNR, FetchedCase(
        cnr=CNR, title="A", court="C", stage="S", next_hearing_date=None,
        judge="J", parties=[], orders=[]))
    sync_case(db_session, user_id=user.id, cnr=CNR)  # active track

    assert drip.evaluate_drip(db_session, now=now) == 1
    assert len(email.sent_outbox) == 1
    # same day again → cursor dedupes, no second send
    assert drip.evaluate_drip(db_session, now=now) == 0


def test_scheduler_autocreates_state_and_skips_day0(db_session, env):
    now = datetime(2026, 5, 1, 13, 0, tzinfo=UTC)  # day 0
    _user(db_session, "+919100000952", email_addr="b@x.test", created_at=SIGNUP)
    assert drip.evaluate_drip(db_session, now=now) == 0  # day 0 → nothing
    # state row was auto-created
    assert db_session.query(UserDripState).count() == 1
