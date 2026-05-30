"""AI document classification: descriptive name + summary + document type +
case auto-attach, via a structured Gemini call (ported from the legacy preprocessing).

The agent is shown the chamber's case context and existing documents, then returns a
constrained JSON object. Validation gates the result: an unknown ``document_type``
coerces to ``other``, and a ``case_cnr`` that isn't one of the user's tracked cases is
dropped (no cross-case attach). Disabled without a Gemini key, so dev/tests stay offline.
"""
from __future__ import annotations

import json
import logging
import re
import unicodedata

import httpx

from nm_core.config import get_settings

logger = logging.getLogger("nm_core.documents.classify")

DOCUMENT_TYPES = (
    "petition", "affidavit", "application", "order", "judgment", "notice", "contract",
    "agreement", "power-of-attorney", "evidence", "correspondence", "memo", "submission",
    "reply", "rejoinder", "vakalatnama", "written-statement", "plaint", "complaint",
    "fir", "chargesheet", "bail-application", "stay-application", "settlement", "other",
)

_SCHEMA = {
    "type": "object",
    "properties": {
        "descriptive_name": {"type": "string"},
        "summary": {"type": "string"},
        "document_type": {"type": "string", "enum": list(DOCUMENT_TYPES)},
        "case_cnr": {"type": "string"},
    },
    "required": ["descriptive_name", "summary", "document_type"],
}

_SYSTEM = (
    "You are a legal clerk filing a document for an Indian advocate. Read the document "
    "and return JSON with: descriptive_name (a short, specific human file name, no "
    "extension); summary (2-3 neutral sentences); document_type (one of the allowed "
    "values); and case_cnr (the 16-char CNR of the matching case from the context below, "
    "or omit if none clearly matches). Do not invent a CNR."
)


def is_available() -> bool:
    return bool(get_settings().GEMINI_API_KEY)


def sanitize_filename(name: str) -> str:
    """Port of the legacy filename sanitizer — NFKC, strip RTL/LTR overrides, ASCII+Latin
    only, path-seps→'-', collapse, trim, cap 100 chars / 240 bytes, lowercase."""
    if not name:
        return "unnamed-document"
    name = unicodedata.normalize("NFKC", name)
    for ch in ("‮", "‭", "‏", "‎"):
        name = name.replace(ch, "")
    name = re.sub(r"[^\x20-\x7eÀ-ÿ]", "", name)
    name = re.sub(r'[/\\:\x00<>"|?*]', "-", name.strip())
    name = re.sub(r"[\s_]+", "-", name)
    name = re.sub(r"-{2,}", "-", name).strip("-.")
    name = name[:100]
    while len(name.encode("utf-8")) > 240:
        name = name[:-1]
    if not name or name in (".", ".."):
        return "unnamed-document"
    return name.lower()


def build_context(cases: list[dict]) -> str:
    """A compact per-case context block the model matches the document against."""
    if not cases:
        return "The advocate has no tracked cases yet."
    lines = ["The advocate's tracked cases (match the document to one if clearly relevant):"]
    for c in cases:
        bits = [c.get("cnr", "")]
        if c.get("title"):
            bits.append(c["title"])
        if c.get("court"):
            bits.append(c["court"])
        lines.append("- " + " · ".join(b for b in bits if b))
    return "\n".join(lines)


def classify(*, pdf_bytes: bytes | None, text: str, cases: list[dict]) -> dict | None:
    """Return ``{descriptive_name, summary, document_type, case_cnr?}`` or None.

    Validates against the user's CNR set + the document-type enum. None when Gemini is
    unavailable or the call fails (caller leaves the doc un-enriched for a later retry)."""
    s = get_settings()
    if not s.GEMINI_API_KEY:
        return None
    parts: list[dict] = []
    if pdf_bytes:
        import base64
        parts.append({"inlineData": {"mimeType": "application/pdf",
                                      "data": base64.b64encode(pdf_bytes).decode("ascii")}})
    elif text.strip():
        parts.append({"text": text[:12000]})
    else:
        return None
    parts.append({"text": build_context(cases)})

    url = (f"https://generativelanguage.googleapis.com/v1beta/models/"
           f"{s.GEMINI_MODEL}:generateContent")
    payload = {
        "systemInstruction": {"parts": [{"text": _SYSTEM}]},
        "contents": [{"role": "user", "parts": parts}],
        "generationConfig": {"temperature": 0.0, "responseMimeType": "application/json",
                             "responseSchema": _SCHEMA},
    }
    try:
        with httpx.Client(timeout=s.AI_REQUEST_TIMEOUT_SECONDS) as client:
            resp = client.post(url, json=payload, headers={"x-goog-api-key": s.GEMINI_API_KEY})
            resp.raise_for_status()
            raw = resp.json()["candidates"][0]["content"]["parts"][0]["text"]
            result = json.loads(raw)
    except (httpx.HTTPError, KeyError, IndexError, ValueError):
        logger.warning("document classification failed", exc_info=True)
        return None
    return _validate(result, {c.get("cnr") for c in cases})


def _validate(result: dict, valid_cnrs: set) -> dict:
    out = {
        "descriptive_name": str(result.get("descriptive_name") or "").strip() or "document",
        "summary": str(result.get("summary") or "").strip(),
        "document_type": result.get("document_type")
        if result.get("document_type") in DOCUMENT_TYPES else "other",
        "case_cnr": None,
    }
    cnr = (result.get("case_cnr") or "").strip().upper()
    if cnr and cnr in valid_cnrs:  # only attach to a case the user actually tracks
        out["case_cnr"] = cnr
    return out
