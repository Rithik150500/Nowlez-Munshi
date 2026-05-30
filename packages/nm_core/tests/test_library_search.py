"""Universal search over the user's own data (SQLite LIKE path + ownership)."""
from __future__ import annotations

from datetime import date

import pytest

from nm_core import search
from nm_core.cases import sync_case
from nm_core.config import get_settings
from nm_core.db.models.document import Document
from nm_core.ecourts.models import Case as FetchedCase
from nm_core.ecourts.models import OrderRef, Party
from nm_core.ecourts.offline import clear_offline_cases, register_offline_case
from nm_core.identity.repositories import UserRepository
from nm_core.teams import ensure_personal_account

CNR = "DLND010000012024"


@pytest.fixture(autouse=True)
def offline(monkeypatch):
    monkeypatch.setattr(get_settings(), "ECOURTS_OFFLINE", True)
    clear_offline_cases()
    yield
    clear_offline_cases()


def _user(db_session, phone="+919100000401"):
    user, _ = UserRepository(db_session).get_or_create_by_phone(phone=phone)
    ensure_personal_account(db_session, user)
    return user


def _add_case(db_session, user, title="Sharma vs State"):
    register_offline_case(CNR, FetchedCase(
        cnr=CNR, title=title, court="High Court of Delhi", stage="Admission",
        next_hearing_date=date(2026, 7, 1), judge="J. Rao",
        parties=[Party(name="Sharma", role="petitioner")],
        orders=[OrderRef(order_date=date(2026, 1, 1), order_url="u", order_id="1")],
    ))
    sync_case(db_session, user_id=user.id, cnr=CNR)


def test_empty_query_returns_nothing(db_session):
    user = _user(db_session)
    assert search.search_all(db_session, user=user, query="   ")["results"] == []


def test_finds_case_by_title(db_session):
    user = _user(db_session)
    _add_case(db_session, user)
    results = search.search_all(db_session, user=user, query="sharma")["results"]
    assert any(r["kind"] == "case" and "Sharma" in r["title"] for r in results)


def test_finds_document_by_title(db_session):
    user = _user(db_session)
    account = ensure_personal_account(db_session, user)
    db_session.add(Document(
        account_id=account.id, kind="upload", title="Bail Application Draft",
        filename="bail.docx", storage_key="k1", summary="anticipatory bail under BNSS"))
    db_session.flush()
    results = search.search_all(db_session, user=user, query="bail")["results"]
    assert any(r["kind"] == "document" and "Bail" in r["title"] for r in results)


def test_does_not_leak_other_users_data(db_session):
    u1 = _user(db_session, "+919100000402")
    _add_case(db_session, u1)
    u2 = _user(db_session, "+919100000403")
    results = search.search_all(db_session, user=u2, query="sharma")["results"]
    assert results == []


def test_ranking_scores_normalized(db_session):
    user = _user(db_session)
    _add_case(db_session, user)
    results = search.search_all(db_session, user=user, query="delhi")["results"]
    assert all(0.0 <= r["score"] <= 1.0 for r in results)
