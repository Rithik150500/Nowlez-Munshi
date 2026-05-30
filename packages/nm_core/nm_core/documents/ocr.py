"""OCR for scanned/image-only PDFs via Gemini multimodal (legacy "Path A").

The legacy Nowlez app never ran a local OCR engine — it handed PDF bytes to Gemini and
relied on its native OCR. We mirror that: when local pdfplumber extraction comes back
near-empty for a PDF that has pages, send the PDF bytes to Gemini and ask for a plain-text
transcription. Disabled (returns "") without GEMINI_API_KEY, so dev/tests stay offline —
exactly like the existing text-extraction degrade path.
"""
from __future__ import annotations

import base64
import logging

import httpx

from nm_core.config import get_settings

logger = logging.getLogger("nm_core.documents.ocr")

_MIN_TEXT_CHARS = 30  # below this for a multi-page PDF, treat it as scanned
_OCR_PROMPT = (
    "Transcribe all readable text from this document verbatim, preserving reading "
    "order. Output only the transcribed text, no commentary."
)


def needs_ocr(text: str, page_count: int | None) -> bool:
    """True when local extraction yielded almost nothing but the PDF has pages."""
    return bool(page_count) and len((text or "").strip()) < _MIN_TEXT_CHARS


def ocr_pdf(data: bytes) -> str:
    """OCR a PDF's bytes via Gemini. Returns "" when no API key or on any failure
    (OCR is best-effort and must never break document processing)."""
    s = get_settings()
    if not s.GEMINI_API_KEY:
        return ""
    url = (
        f"https://generativelanguage.googleapis.com/v1beta/models/"
        f"{s.GEMINI_MODEL}:generateContent"
    )
    payload = {
        "contents": [{"role": "user", "parts": [
            {"inlineData": {"mimeType": "application/pdf",
                            "data": base64.b64encode(data).decode("ascii")}},
            {"text": _OCR_PROMPT},
        ]}],
        "generationConfig": {"temperature": 0.0},
    }
    try:
        with httpx.Client(timeout=s.AI_REQUEST_TIMEOUT_SECONDS) as client:
            resp = client.post(url, json=payload, headers={"x-goog-api-key": s.GEMINI_API_KEY})
            resp.raise_for_status()
            data_json = resp.json()
    except (httpx.HTTPError, ValueError):
        logger.warning("OCR via Gemini failed", exc_info=True)
        return ""
    parts = data_json.get("candidates", [{}])[0].get("content", {}).get("parts", [])
    return "\n".join(p["text"] for p in parts if "text" in p and not p.get("thought")).strip()
