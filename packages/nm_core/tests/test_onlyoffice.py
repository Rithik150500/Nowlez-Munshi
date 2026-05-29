"""M4i: OnlyOffice helpers — blank docx, signed config, callback verify (no server)."""
from __future__ import annotations

import io
import zipfile

import jwt as pyjwt
import pytest

from nm_core.config import get_settings
from nm_core.documents.onlyoffice import blank_docx, editor_config, verify_callback


def test_blank_docx_is_valid_zip_with_document():
    data = blank_docx()
    with zipfile.ZipFile(io.BytesIO(data)) as z:
        names = set(z.namelist())
    assert {"[Content_Types].xml", "_rels/.rels", "word/document.xml"} <= names


def test_editor_config_signed_when_secret_set(monkeypatch):
    monkeypatch.setattr(get_settings(), "ONLYOFFICE_JWT_SECRET", "secret")
    cfg = editor_config(key="k1", title="Draft", document_url="http://d/x", callback_url="http://d/cb")
    assert cfg["document"]["url"] == "http://d/x"
    decoded = pyjwt.decode(cfg["token"], "secret", algorithms=["HS256"])
    assert decoded["document"]["key"] == "k1"


def test_editor_config_unsigned_without_secret(monkeypatch):
    monkeypatch.setattr(get_settings(), "ONLYOFFICE_JWT_SECRET", "")
    cfg = editor_config(key="k", title="T", document_url="u", callback_url="c")
    assert "token" not in cfg


def test_verify_callback(monkeypatch):
    monkeypatch.setattr(get_settings(), "ONLYOFFICE_JWT_SECRET", "secret")
    token = pyjwt.encode({"status": 2}, "secret", algorithm="HS256")
    assert verify_callback(token)["status"] == 2
    with pytest.raises(pyjwt.InvalidTokenError):
        verify_callback(pyjwt.encode({"x": 1}, "wrong", algorithm="HS256"))
