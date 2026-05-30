"""Legal-document drafting: reference/template readers, render, gating, security.

The real Node render path runs only when a Node runtime + the docx dep are present
(drafting.is_available()); otherwise those cases are skipped, so CI without Node still
passes. The gating, size-cap, and template-traversal paths always run.
"""
from __future__ import annotations

import uuid

import pytest

from nm_core.ai import drafting
from nm_core.config import get_settings

_MINIMAL_DOCX_JS = """
const { Document, Paragraph, TextRun } = require("docx");
module.exports = new Document({
  sections: [{ children: [new Paragraph({ children: [new TextRun("Hello, court.")] })] }],
});
"""

_needs_node = pytest.mark.skipif(not drafting.is_available(), reason="no Node runtime")


def test_reference_and_templates_available():
    ref = drafting.read_reference()
    assert isinstance(ref, str)
    templates = drafting.list_templates()
    assert "anticipatory_bail" in templates
    assert len(templates) > 50  # the ported catalog


def test_read_template_traversal_blocked():
    assert drafting.read_template("../config/__init__") is None
    assert drafting.read_template("../../etc/passwd") is None
    assert drafting.read_template("does_not_exist") is None
    assert drafting.read_template("anticipatory_bail") is not None


def test_size_cap_rejected(monkeypatch):
    monkeypatch.setattr(get_settings(), "DOCX_MAX_CODE_SIZE_BYTES", 100)
    with pytest.raises(drafting.DraftError, match="limit"):
        drafting.render_docx("x" * 200)


def test_disabled_without_node(monkeypatch):
    monkeypatch.setattr(drafting, "is_available", lambda: False)
    with pytest.raises(drafting.DraftError, match="unavailable"):
        drafting.render_docx(_MINIMAL_DOCX_JS)


@_needs_node
def test_render_produces_docx_bytes():
    data = drafting.render_docx(_MINIMAL_DOCX_JS)
    assert data[:2] == b"PK"  # DOCX is a zip
    assert len(data) > 500


@_needs_node
def test_render_rejects_filesystem_access():
    # The sandbox blocks require('fs'); the runner must fail, not exfiltrate.
    bad = "const fs = require('fs'); module.exports = {};"
    with pytest.raises(drafting.DraftError):
        drafting.render_docx(bad)


@_needs_node
def test_draft_and_store_persists(tmp_path, monkeypatch):
    from nm_core import storage
    monkeypatch.setattr(storage, "get_storage", lambda: storage.LocalStorage(str(tmp_path)))
    monkeypatch.setattr(drafting, "get_storage", storage.get_storage)
    meta = drafting.draft_and_store(_MINIMAL_DOCX_JS, account_id=uuid.uuid4(), title="My Bail App")
    assert meta["filename"] == "My Bail App.docx"
    assert meta["bytes"] > 0
    assert storage.get_storage().get(meta["storage_key"])[:2] == b"PK"
