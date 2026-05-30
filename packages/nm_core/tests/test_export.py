"""GDPR data export: ZIP structure, contents, ownership, rate limit."""
from __future__ import annotations

import io
import json
import zipfile
from datetime import UTC, date, datetime, timedelta

import fakeredis
import pytest

from nm_core import ai, export
from nm_core.cases import sync_case
from nm_core.config import get_settings
from nm_core.ecourts.models import Case as FetchedCase
from nm_core.ecourts.models import OrderRef, Party
from nm_core.ecourts.offline import clear_offline_cases, register_offline_case
from nm_core.identity.repositories import UserRepository
from nm_core.messaging import redis_dedup
from nm_core.teams import ensure_personal_account

CNR = "DLND010000012024"


@pytest.fixture(autouse=True)
def env(monkeypatch, tmp_path):
    monkeypatch.setattr(get_settings(), "ECOURTS_OFFLINE", True)
    monkeypatch.setattr(get_settings(), "GEMINI_API_KEY", "")
    monkeypatch.setattr(get_settings(), "STORAGE_DIR", str(tmp_path / "s"))
    monkeypatch.setattr(redis_dedup, "_client", fakeredis.FakeStrictRedis())
    clear_offline_cases()
    yield
    clear_offline_cases()
    monkeypatch.setattr(redis_dedup, "_client", None)


def _seed(db_session):
    user, _ = UserRepository(db_session).get_or_create_by_phone(phone="+919100000801", name="Adv")
    ensure_personal_account(db_session, user)
    register_offline_case(CNR, FetchedCase(
        cnr=CNR, title="Sharma vs State", court="HC", stage="Adm",
        next_hearing_date=date(2026, 7, 1), judge="J",
        parties=[Party(name="Sharma", role="petitioner")],
        orders=[OrderRef(order_date=date(2026, 1, 1), order_url="u", order_id="1")]))
    sync_case(db_session, user_id=user.id, cnr=CNR)
    ai.ask(db_session, user=user, question="what am I tracking?")  # creates a chat thread
    return user


def _names(data: bytes) -> list[str]:
    return zipfile.ZipFile(io.BytesIO(data)).namelist()


def test_export_zip_structure_and_contents(db_session):
    user = _seed(db_session)
    data = export.build_user_export_zip(db_session, user=user, today=date(2026, 5, 30))
    names = _names(data)
    root = "nowlez-munshi-export-2026-05-30"
    for expected in ("profile.json", "documents.json", "chat_history.json",
                     "notifications.json", "billing.json", "metadata.json"):
        assert f"{root}/{expected}" in names
    assert f"{root}/cases/{CNR}/case.json" in names

    zf = zipfile.ZipFile(io.BytesIO(data))
    profile = json.loads(zf.read(f"{root}/profile.json"))
    assert profile["phone"] == "+919100000801"
    chat = json.loads(zf.read(f"{root}/chat_history.json"))
    assert len(chat) == 1 and chat[0]["messages"]  # the seeded thread + its turns


def test_export_only_includes_own_data(db_session):
    _seed(db_session)  # seeds the first user's case — must not leak into `other`'s export
    other, _ = UserRepository(db_session).get_or_create_by_phone(phone="+919100000802")
    ensure_personal_account(db_session, other)
    data = export.build_user_export_zip(db_session, user=other, today=date(2026, 5, 30))
    zf = zipfile.ZipFile(io.BytesIO(data))
    # the other user has no cases — no case folder, profile is theirs
    assert not any("/cases/" in n for n in zf.namelist())


def test_rate_limit_one_per_hour(db_session):
    user = _seed(db_session)
    assert export.can_export(user) is True
    user.last_export_at = datetime.now(UTC)
    assert export.can_export(user) is False
    user.last_export_at = datetime.now(UTC) - timedelta(hours=2)
    assert export.can_export(user) is True
