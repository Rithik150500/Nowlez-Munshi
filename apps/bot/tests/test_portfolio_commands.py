"""/label, /portfolio, /refresh bot commands (offline eCourts + fakeredis)."""
from __future__ import annotations

from datetime import date

import fakeredis
import pytest
from nm_bot.commands import handle_message

from nm_core.cases import CaseRepository
from nm_core.config import get_settings
from nm_core.ecourts.models import Case as FetchedCase
from nm_core.ecourts.models import OrderRef, Party
from nm_core.ecourts.offline import clear_offline_cases, register_offline_case
from nm_core.identity.repositories import UserRepository
from nm_core.messaging import redis_dedup

PHONE = "+919100000101"
CNR = "DLND010000012024"


@pytest.fixture(autouse=True)
def env(monkeypatch):
    monkeypatch.setattr(get_settings(), "ECOURTS_OFFLINE", True)
    monkeypatch.setattr(get_settings(), "WHATSAPP_DISABLED", True)
    monkeypatch.setattr(redis_dedup, "_client", fakeredis.FakeStrictRedis())
    clear_offline_cases()
    register_offline_case(CNR, _case())
    yield
    clear_offline_cases()
    monkeypatch.setattr(redis_dedup, "_client", None)


def _case(**kw) -> FetchedCase:
    base = dict(
        cnr=CNR, title="A vs B", court="Court X", stage="Appearance",
        next_hearing_date=None, judge="J1",
        parties=[Party(name="A", role="petitioner")],
        orders=[OrderRef(order_date=date(2026, 1, 1), order_url="u1", order_id="1")],
    )
    base.update(kw)
    return FetchedCase(**base)


def _reply(db_session, text):
    return handle_message(db_session, from_phone=PHONE, text=text)


def test_label_sets_note(db_session):
    _reply(db_session, CNR)  # track first
    reply = _reply(db_session, f"/label {CNR} Smith bail matter")
    assert "Labelled" in reply
    user = UserRepository(db_session).get_by_phone(PHONE)
    assert CaseRepository(db_session).get_by_cnr(user.id, CNR).notes == "Smith bail matter"


def test_label_untracked_case(db_session):
    _reply(db_session, "/help")  # creates user
    assert "isn't tracked" in _reply(db_session, f"/label {CNR} x")


def test_portfolio_summary(db_session):
    _reply(db_session, CNR)
    reply = _reply(db_session, "/portfolio")
    assert "portfolio" in reply.lower()
    assert "1 case" in reply


def test_portfolio_empty(db_session):
    _reply(db_session, "/help")
    assert "No cases yet" in _reply(db_session, "/portfolio")


def test_refresh_rate_limited(db_session):
    _reply(db_session, CNR)
    first = _reply(db_session, "/refresh")
    assert "Refreshed" in first
    second = _reply(db_session, "/refresh")  # within 15 min → blocked
    assert "recently" in second
