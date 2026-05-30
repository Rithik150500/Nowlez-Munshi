"""AI document classification: sanitize, validation, structured call, auto-attach."""
from __future__ import annotations

import json
from datetime import date

import httpx
import pytest
import respx

from nm_core import documents
from nm_core.cases import sync_case
from nm_core.config import get_settings
from nm_core.db.models.document import Document
from nm_core.documents import classify
from nm_core.ecourts.models import Case as FetchedCase
from nm_core.ecourts.models import OrderRef, Party
from nm_core.ecourts.offline import clear_offline_cases, register_offline_case
from nm_core.identity.repositories import UserRepository
from nm_core.teams import ensure_personal_account

CNR = "DLND010000012024"
GEMINI_HOST = "generativelanguage.googleapis.com"


@pytest.fixture(autouse=True)
def env(monkeypatch, tmp_path):
    monkeypatch.setattr(get_settings(), "ECOURTS_OFFLINE", True)
    monkeypatch.setattr(get_settings(), "STORAGE_DIR", str(tmp_path / "s"))
    clear_offline_cases()
    yield
    clear_offline_cases()


@pytest.mark.parametrize("raw,expected", [
    ("Bail Application — Sharma", "bail-application-sharma"),
    ("../etc/passwd", "etc-passwd"),
    ("a/b\\c:d", "a-b-c-d"),
    ("", "unnamed-document"),
    ("....", "unnamed-document"),
])
def test_sanitize_filename(raw, expected):
    assert classify.sanitize_filename(raw) == expected


def test_validate_coerces_unknown_type_and_drops_foreign_cnr():
    out = classify._validate(
        {"descriptive_name": "X", "summary": "s", "document_type": "made-up",
         "case_cnr": "ZZZZ010000019999"},
        valid_cnrs={CNR})
    assert out["document_type"] == "other"
    assert out["case_cnr"] is None  # not in the user's case set → dropped


def test_validate_keeps_known_cnr():
    out = classify._validate(
        {"descriptive_name": "X", "summary": "s", "document_type": "petition",
         "case_cnr": CNR.lower()},
        valid_cnrs={CNR})
    assert out["document_type"] == "petition" and out["case_cnr"] == CNR


def test_classify_disabled_without_key(monkeypatch):
    monkeypatch.setattr(get_settings(), "GEMINI_API_KEY", "")
    assert classify.classify(pdf_bytes=None, text="some order text", cases=[]) is None


def _seed_user_case(db_session):
    user, _ = UserRepository(db_session).get_or_create_by_phone(phone="+919100000701", name="Adv")
    ensure_personal_account(db_session, user)
    register_offline_case(CNR, FetchedCase(
        cnr=CNR, title="Sharma vs State", court="HC", stage="Adm",
        next_hearing_date=date(2026, 7, 1), judge="J",
        parties=[Party(name="Sharma", role="petitioner")],
        orders=[OrderRef(order_date=date(2026, 1, 1), order_url="u", order_id="1")]))
    sync_case(db_session, user_id=user.id, cnr=CNR)
    return user


@respx.mock
def test_process_upload_enriches_and_auto_attaches(db_session, monkeypatch):
    monkeypatch.setattr(get_settings(), "GEMINI_API_KEY", "gem-x")
    # OCR not triggered (DOCX path); summarize + classify both hit Gemini host — mock it.
    respx.post(host=GEMINI_HOST).mock(return_value=httpx.Response(200, json={
        "candidates": [{"content": {"parts": [{"text": json.dumps({
            "descriptive_name": "Sharma Bail Application",
            "summary": "Application for anticipatory bail.",
            "document_type": "bail-application",
            "case_cnr": CNR,
        })}]}}]
    }))
    user = _seed_user_case(db_session)
    account = ensure_personal_account(db_session, user)
    doc = Document(account_id=account.id, created_by=user.id, kind="upload",
                   title="upload", filename="scan.pdf", content_type="application/pdf",
                   storage_key="k1")
    from nm_core.storage import get_storage
    get_storage().put("k1", b"%PDF-1.5 some text here that extracts fine and is long enough")
    db_session.add(doc)
    db_session.flush()

    documents.process_upload(db_session, document_id=doc.id)
    assert doc.title == "Sharma Bail Application"
    assert doc.filename == "sharma-bail-application.pdf"
    assert doc.document_type == "bail-application"
    assert doc.case_id is not None  # auto-attached to the matching case


def test_enrich_failure_bumps_retry_then_permanently_fails(db_session, monkeypatch):
    monkeypatch.setattr(get_settings(), "GEMINI_API_KEY", "gem-x")
    monkeypatch.setattr(classify, "classify", lambda **kw: None)  # always fails
    user = _seed_user_case(db_session)
    account = ensure_personal_account(db_session, user)
    doc = Document(account_id=account.id, created_by=user.id, kind="upload",
                   title="u", filename="x.pdf", content_type="application/pdf",
                   storage_key="k2", extracted_text="text")
    from nm_core.storage import get_storage
    get_storage().put("k2", b"%PDF data")
    db_session.add(doc)
    db_session.flush()

    for _ in range(3):
        documents.reenrich_uploads(db_session)
    assert doc.retry_count == 3 and doc.permanently_failed is True
    # a permanently-failed doc is no longer picked up
    assert documents.reenrich_uploads(db_session) == 0
