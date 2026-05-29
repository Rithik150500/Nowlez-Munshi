"""AI Munshi: tools, offline agent, threaded persistence, citations (offline)."""
from __future__ import annotations

from datetime import date

import pytest

from nm_core.ai import ask
from nm_core.ai.repository import ChatRepository
from nm_core.ai.tools import ToolContext
from nm_core.cases import sync_case
from nm_core.config import get_settings
from nm_core.ecourts.models import Case as FetchedCase
from nm_core.ecourts.models import OrderRef, Party
from nm_core.ecourts.offline import clear_offline_cases, register_offline_case
from nm_core.identity.repositories import UserRepository

CNR = "DLND010000012024"


@pytest.fixture(autouse=True)
def env(monkeypatch):
    monkeypatch.setattr(get_settings(), "ECOURTS_OFFLINE", True)
    monkeypatch.setattr(get_settings(), "GEMINI_API_KEY", "")  # force offline agent
    clear_offline_cases()
    yield
    clear_offline_cases()


def _user_with_case(db_session, *, with_case=True):
    user, _ = UserRepository(db_session).get_or_create_by_phone(phone="+919100000071", name="Adv")
    if with_case:
        register_offline_case(
            CNR,
            FetchedCase(
                cnr=CNR, title="Alice vs State", court="CMM Delhi", stage="Arguments",
                next_hearing_date=date(2026, 7, 1), judge="J1",
                parties=[Party(name="Alice", role="petitioner")],
                orders=[OrderRef(order_date=date(2026, 1, 2), order_url="u1", order_id="1")],
            ),
        )
        sync_case(db_session, user_id=user.id, cnr=CNR)
    return user


# --- tools ---
def test_tools_get_case_and_cite(db_session):
    user = _user_with_case(db_session)
    ctx = ToolContext(db_session, user)
    out = ctx.execute("get_case", {"cnr": CNR})
    assert out["title"] == "Alice vs State"
    assert ctx.cited == {CNR: "Alice vs State"}
    assert ctx.calls[0]["name"] == "get_case"


def test_tools_unknown_case(db_session):
    user = _user_with_case(db_session, with_case=False)
    assert "error" in ToolContext(db_session, user).execute("get_case", {"cnr": CNR})


# --- offline agent via ask ---
def test_ask_specific_case_cites(db_session):
    user = _user_with_case(db_session)
    ans = ask(db_session, user=user, question=f"What's the status of {CNR}?")
    assert ans.mode == "offline"
    assert "Arguments" in ans.text
    assert [c.cnr for c in ans.citations] == [CNR]


def test_ask_orders(db_session):
    user = _user_with_case(db_session)
    ans = ask(db_session, user=user, question=f"show me the orders in {CNR}")
    assert "2026-01-02" in ans.text
    assert ans.tool_calls[0]["name"] == "get_orders"


def test_ask_list_when_no_cnr(db_session):
    user = _user_with_case(db_session)
    ans = ask(db_session, user=user, question="what cases am I tracking?")
    assert CNR in ans.text
    assert [c.cnr for c in ans.citations] == [CNR]  # cited via text scan


def test_ask_empty_book(db_session):
    user = _user_with_case(db_session, with_case=False)
    ans = ask(db_session, user=user, question="anything?")
    assert "no cases" in ans.text.lower()


def test_ask_sees_co_member_shared_case(db_session):
    from nm_core.identity.repositories import UserRepository
    from nm_core.teams import AccountRepository

    owner = _user_with_case(db_session)  # owns CNR
    junior, _ = UserRepository(db_session).get_or_create_by_phone(phone="+919100000079", name="Jr")
    accounts = AccountRepository(db_session)
    chamber = accounts.create_account(owner_user_id=owner.id, name="Chamber")
    accounts.add_member(account_id=chamber.id, user_id=junior.id, role="editor")

    # Junior (who doesn't own the case) can ask about the chamber's shared case.
    ans = ask(db_session, user=junior, question=f"status of {CNR}?")
    assert "Arguments" in ans.text
    assert [c.cnr for c in ans.citations] == [CNR]


# --- threaded persistence ---
def test_ask_persists_thread(db_session):
    user = _user_with_case(db_session)
    ask(db_session, user=user, question="hi")
    threads = ChatRepository(db_session).list_threads(user.id)
    assert len(threads) == 1
    # A new web ask without a thread id starts a new thread, so pass it explicitly.
    tid = threads[0].id
    ask(db_session, user=user, question="and again", thread_id=tid)
    msgs = ChatRepository(db_session).recent_messages(tid, limit=20)
    # hi(user)+answer + again(user)+answer = 4
    assert [m.role for m in msgs] == ["user", "assistant", "user", "assistant"]


def test_whatsapp_reuses_rolling_thread(db_session):
    user = _user_with_case(db_session)
    ask(db_session, user=user, question="one", channel="whatsapp")
    ask(db_session, user=user, question="two", channel="whatsapp")
    threads = ChatRepository(db_session).list_threads(user.id)
    assert len(threads) == 1  # rolling single whatsapp thread
