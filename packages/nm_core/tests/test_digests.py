"""D2: tomorrow-hearing digests (enqueue + email; respects digest_enabled/snooze)."""
from __future__ import annotations

from datetime import UTC, date, datetime, timedelta

import fakeredis
import pytest

from nm_core import digests, email
from nm_core.cases import CasePreferenceRepository, sync_case
from nm_core.config import get_settings
from nm_core.ecourts.models import Case as FetchedCase
from nm_core.ecourts.offline import clear_offline_cases, register_offline_case
from nm_core.identity.repositories import UserRepository
from nm_core.messaging import redis_dedup

CNR = "DLND010000012024"


@pytest.fixture(autouse=True)
def env(monkeypatch):
    monkeypatch.setattr(get_settings(), "ECOURTS_OFFLINE", True)
    monkeypatch.setattr(get_settings(), "WHATSAPP_DISABLED", False)
    monkeypatch.setattr(redis_dedup, "_client", fakeredis.FakeStrictRedis())
    email.sent_outbox.clear()
    clear_offline_cases()
    # capture enqueued daily templates instead of touching RQ/Meta
    sent = []
    monkeypatch.setattr(
        digests.messaging, "enqueue_send_daily_template",
        lambda session, **kw: sent.append(kw) or True,
    )
    digests._sent = sent  # type: ignore[attr-defined]
    yield
    clear_offline_cases()


def _user_with_hearing(db_session, *, when: date, phone="+919100000301", emailaddr=None):
    user, _ = UserRepository(db_session).get_or_create_by_phone(phone=phone, name="Adv")
    if emailaddr:
        user.email = emailaddr
    register_offline_case(
        CNR,
        FetchedCase(cnr=CNR, title="A vs B", court="X", stage="S",
                    next_hearing_date=when, judge="J", parties=[], orders=[]),
    )
    sync_case(db_session, user_id=user.id, cnr=CNR)
    return user


def test_digest_sent_for_tomorrow(db_session):
    today = date(2026, 5, 29)
    _user_with_hearing(db_session, when=today + timedelta(days=1), emailaddr="a@b.com")
    n = digests.send_tomorrow_digests(db_session, today=today)
    assert n == 1
    assert len(digests._sent) == 1  # WhatsApp template enqueued
    assert digests._sent[0]["template_name"] == digests.TOMORROW_TEMPLATE
    assert email.sent_outbox and "hearing" in email.sent_outbox[-1]["subject"].lower()


def test_no_digest_when_hearing_not_tomorrow(db_session):
    today = date(2026, 5, 29)
    _user_with_hearing(db_session, when=today + timedelta(days=10))
    assert digests.send_tomorrow_digests(db_session, today=today) == 0


def test_digest_respects_digest_disabled(db_session):
    today = date(2026, 5, 29)
    user = _user_with_hearing(db_session, when=today + timedelta(days=1))
    CasePreferenceRepository(db_session).upsert(user.id, CNR, digest_enabled=False)
    assert digests.send_tomorrow_digests(db_session, today=today) == 0


def test_digest_respects_snooze(db_session):
    today = date(2026, 5, 29)
    user = _user_with_hearing(db_session, when=today + timedelta(days=1))
    future = datetime.now(UTC) + timedelta(days=3)
    CasePreferenceRepository(db_session).upsert(user.id, CNR, snooze_until=future)
    assert digests.send_tomorrow_digests(db_session, today=today) == 0
