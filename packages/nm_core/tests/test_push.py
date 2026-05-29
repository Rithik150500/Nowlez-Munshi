"""F2: web-push repository/delivery + email+push fan-out in dispatch."""
from __future__ import annotations

import fakeredis
import pytest

from nm_core import email, push
from nm_core.cases import sync_case
from nm_core.cases.changes import Change
from nm_core.config import get_settings
from nm_core.ecourts.models import Case as FetchedCase
from nm_core.ecourts.offline import clear_offline_cases, register_offline_case
from nm_core.identity.repositories import UserRepository
from nm_core.messaging import redis_dedup
from nm_core.notifications import dispatch_change

CNR = "DLND010000012024"


@pytest.fixture(autouse=True)
def env(monkeypatch):
    monkeypatch.setattr(get_settings(), "ECOURTS_OFFLINE", True)
    monkeypatch.setattr(get_settings(), "WHATSAPP_DISABLED", True)
    monkeypatch.setattr(redis_dedup, "_client", fakeredis.FakeStrictRedis())
    push.sent_outbox.clear()
    email.sent_outbox.clear()
    clear_offline_cases()
    yield
    clear_offline_cases()
    push.sent_outbox.clear()
    email.sent_outbox.clear()
    monkeypatch.setattr(redis_dedup, "_client", None)


def test_subscription_upsert_is_idempotent(db_session):
    user, _ = UserRepository(db_session).get_or_create_by_phone(phone="+919100000701")
    repo = push.PushSubscriptionRepository(db_session)
    repo.upsert(user_id=user.id, endpoint="https://push/1", p256dh="k", auth="a")
    repo.upsert(user_id=user.id, endpoint="https://push/1", p256dh="k2", auth="a2")
    subs = repo.list_for_user(user.id)
    assert len(subs) == 1 and subs[0].p256dh == "k2"


def test_notify_user_uses_console_outbox_without_vapid(db_session):
    user, _ = UserRepository(db_session).get_or_create_by_phone(phone="+919100000702")
    push.PushSubscriptionRepository(db_session).upsert(
        user_id=user.id, endpoint="https://push/2", p256dh="k", auth="a"
    )
    assert push.notify_user(db_session, user_id=user.id, title="T", body="B") == 1
    assert push.sent_outbox and '"title": "T"' in push.sent_outbox[0]["payload"]


def _setup_case(db_session, user):
    register_offline_case(
        CNR,
        FetchedCase(cnr=CNR, title="A vs B", court="X", stage="Appearance",
                    next_hearing_date=None, judge="J", parties=[], orders=[]),
    )
    case, _ = sync_case(db_session, user_id=user.id, cnr=CNR)
    return case


def test_dispatch_fans_out_to_email_and_push(db_session):
    user, _ = UserRepository(db_session).get_or_create_by_phone(phone="+919100000703")
    user.email = "adv@example.test"
    db_session.flush()
    push.PushSubscriptionRepository(db_session).upsert(
        user_id=user.id, endpoint="https://push/3", p256dh="k", auth="a"
    )
    case = _setup_case(db_session, user)
    n = dispatch_change(
        db_session, user=user, case=case, change=Change(type="new_orders", summary="1 new order")
    )
    # WhatsApp suppressed by kill-switch; email + push still fire.
    assert "email" in n.channels_sent and "push" in n.channels_sent
    assert email.sent_outbox[0]["to"] == "adv@example.test"
