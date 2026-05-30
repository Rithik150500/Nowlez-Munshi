"""OCR fallback for scanned PDFs (Gemini Path A): heuristic, gating, transcription."""
from __future__ import annotations

import base64

import httpx
import pytest
import respx

from nm_core.config import get_settings
from nm_core.documents import ocr


@pytest.mark.parametrize("text,pages,expected", [
    ("", 3, True),            # scanned: pages but no text
    ("   ", 5, True),         # whitespace only
    ("short", 2, True),       # under the 30-char floor
    ("x" * 200, 4, False),    # plenty of text → no OCR
    ("", None, False),        # not a paged PDF (e.g. DOCX) → skip
    ("", 0, False),           # zero pages → skip
])
def test_needs_ocr(text, pages, expected):
    assert ocr.needs_ocr(text, pages) is expected


def test_ocr_disabled_without_key(monkeypatch):
    monkeypatch.setattr(get_settings(), "GEMINI_API_KEY", "")
    assert ocr.ocr_pdf(b"%PDF-1.5 scanned") == ""


@respx.mock
def test_ocr_sends_pdf_bytes_and_returns_text(monkeypatch):
    monkeypatch.setattr(get_settings(), "GEMINI_API_KEY", "gem-x")
    route = respx.post(host="generativelanguage.googleapis.com").mock(
        return_value=httpx.Response(200, json={
            "candidates": [{"content": {"parts": [{"text": "IN THE HIGH COURT ..."}]}}]
        })
    )
    out = ocr.ocr_pdf(b"%PDF-1.5 scanned bytes")
    assert out == "IN THE HIGH COURT ..."
    # the PDF bytes are sent base64 as inlineData
    sent = route.calls[0].request.content.decode()
    assert base64.b64encode(b"%PDF-1.5 scanned bytes").decode() in sent
    assert "application/pdf" in sent


@respx.mock
def test_ocr_failure_degrades_to_empty(monkeypatch):
    monkeypatch.setattr(get_settings(), "GEMINI_API_KEY", "gem-x")
    respx.post(host="generativelanguage.googleapis.com").mock(
        return_value=httpx.Response(500, text="boom"))
    assert ocr.ocr_pdf(b"%PDF scanned") == ""
