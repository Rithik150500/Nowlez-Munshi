"""M4d: order-PDF processing, summaries, and the get_order_text tool (offline)."""
from __future__ import annotations

from datetime import date

import pytest

from nm_core import documents
from nm_core.ai import summarize_order
from nm_core.ai.tools import ToolContext
from nm_core.cases import CaseRepository, sync_case
from nm_core.config import get_settings
from nm_core.ecourts.models import Case as FetchedCase
from nm_core.ecourts.models import OrderRef, Party
from nm_core.ecourts.offline import clear_offline_cases, register_offline_case
from nm_core.identity.repositories import UserRepository

CNR = "DLND010000012024"


@pytest.fixture(autouse=True)
def env(monkeypatch, tmp_path):
    monkeypatch.setattr(get_settings(), "ECOURTS_OFFLINE", True)
    monkeypatch.setattr(get_settings(), "GEMINI_API_KEY", "")
    monkeypatch.setattr(get_settings(), "STORAGE_DIR", str(tmp_path / "storage"))
    clear_offline_cases()
    yield
    clear_offline_cases()


def _seed(db_session):
    user, _ = UserRepository(db_session).get_or_create_by_phone(phone="+919100000151", name="Adv")
    register_offline_case(
        CNR,
        FetchedCase(
            cnr=CNR, title="A vs B", court="X", stage="S", next_hearing_date=date(2026, 7, 1),
            judge="J", parties=[Party(name="A", role="petitioner")],
            orders=[OrderRef(order_date=date(2026, 1, 2), order_url="u1", order_id="1")],
        ),
    )
    case, _ = sync_case(db_session, user_id=user.id, cnr=CNR)
    return user, case


def test_summarize_order_text_truncates():
    out = summarize_order("The court directed the parties to file written submissions. " * 20)
    assert out.endswith("…") and len(out) <= 281


def test_summarize_empty_text():
    assert "no extractable text" in summarize_order("")


def test_process_order_stores_and_summarizes(db_session):
    _user, case = _seed(db_session)
    order = CaseRepository(db_session).list_orders(case.id)[0]
    processed = documents.process_order(db_session, order_id=order.id)
    assert processed.file_path  # stored
    assert processed.summary  # synthetic PDF → "no extractable text" summary
    assert processed.descriptive_name


def test_get_order_text_tool(db_session):
    user, case = _seed(db_session)
    documents.process_for_case(db_session, case_id=case.id)
    ctx = ToolContext(db_session, user)
    out = ctx.execute("get_order_text", {"cnr": CNR})
    assert out["orders"][0]["summary"]
    assert ctx.cited == {CNR: "A vs B"}
