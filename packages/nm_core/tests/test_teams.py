"""Teams: personal-account bootstrap, co-membership visibility, role checks."""
from __future__ import annotations

from datetime import date

import pytest

from nm_core.cases import CaseRepository, sync_case
from nm_core.config import get_settings
from nm_core.ecourts.models import Case as FetchedCase
from nm_core.ecourts.offline import clear_offline_cases, register_offline_case
from nm_core.identity.repositories import UserRepository
from nm_core.teams import (
    AccountRepository,
    accessible_user_ids,
    ensure_personal_account,
    require_role,
)

CNR_A = "DLND010000012024"
CNR_B = "MHHC010000012024"


@pytest.fixture(autouse=True)
def offline(monkeypatch):
    monkeypatch.setattr(get_settings(), "ECOURTS_OFFLINE", True)
    clear_offline_cases()
    yield
    clear_offline_cases()


def _u(db_session, phone, name):
    u, _ = UserRepository(db_session).get_or_create_by_phone(phone=phone, name=name)
    return u


def test_personal_account_created_once(db_session):
    u = _u(db_session, "+919100000101", "Adv A")
    a1 = ensure_personal_account(db_session, u)
    a2 = ensure_personal_account(db_session, u)
    assert a1.id == a2.id and a1.is_personal


def test_solo_user_sees_only_self(db_session):
    u = _u(db_session, "+919100000102", "Adv A")
    assert accessible_user_ids(db_session, u) == {u.id}


def test_co_members_see_each_others_cases(db_session):
    register_offline_case(CNR_A, FetchedCase(cnr=CNR_A, title="A", court="X", stage="S",
                                             next_hearing_date=date(2026, 7, 1), judge="J",
                                             parties=[], orders=[]))
    register_offline_case(CNR_B, FetchedCase(cnr=CNR_B, title="B", court="Y", stage="S",
                                             next_hearing_date=date(2026, 7, 1), judge="J",
                                             parties=[], orders=[]))
    owner = _u(db_session, "+919100000103", "Owner")
    junior = _u(db_session, "+919100000104", "Junior")
    sync_case(db_session, user_id=owner.id, cnr=CNR_A)
    sync_case(db_session, user_id=junior.id, cnr=CNR_B)

    # Form a chamber: owner's account, add junior as editor.
    accounts = AccountRepository(db_session)
    chamber = accounts.create_account(owner_user_id=owner.id, name="Chamber")
    accounts.add_member(account_id=chamber.id, user_id=junior.id, role="editor")

    visible = accessible_user_ids(db_session, owner)
    assert {owner.id, junior.id} <= visible
    cnrs = {c.cnr for c in CaseRepository(db_session).list_visible(visible)}
    assert cnrs == {CNR_A, CNR_B}


def test_require_role(db_session):
    accounts = AccountRepository(db_session)
    owner = _u(db_session, "+919100000105", "Owner")
    viewer = _u(db_session, "+919100000106", "Viewer")
    acc = accounts.create_account(owner_user_id=owner.id, name="C")
    accounts.add_member(account_id=acc.id, user_id=viewer.id, role="viewer")

    assert require_role(db_session, account_id=acc.id, user_id=owner.id, minimum="owner")
    assert require_role(db_session, account_id=acc.id, user_id=viewer.id, minimum="viewer")
    assert not require_role(db_session, account_id=acc.id, user_id=viewer.id, minimum="editor")
