"""Summarize an order's extracted text. Gemini if available, else deterministic."""
from __future__ import annotations

import httpx

from nm_core.config import get_settings

_PROMPT = (
    "You are a legal clerk. Summarize this Indian court order in 2-3 plain sentences: "
    "what the court directed and the next step. Be precise and neutral."
)


def summarize_order(text: str) -> str:
    text = (text or "").strip()
    if not text:
        return "Order document (no extractable text)."
    if get_settings().GEMINI_API_KEY:
        try:
            return _gemini_summary(text)
        except Exception:  # noqa: BLE001 — fall back to extractive
            pass
    # Deterministic offline summary: first ~3 sentences, capped.
    snippet = " ".join(text.split())
    return (snippet[:280] + "…") if len(snippet) > 280 else snippet


def _gemini_summary(text: str) -> str:
    s = get_settings()
    url = f"https://generativelanguage.googleapis.com/v1beta/models/{s.GEMINI_MODEL}:generateContent"
    payload = {
        "systemInstruction": {"parts": [{"text": _PROMPT}]},
        "contents": [{"role": "user", "parts": [{"text": text[:12000]}]}],
        "generationConfig": {"temperature": 1.0},
    }
    with httpx.Client(timeout=s.AI_REQUEST_TIMEOUT_SECONDS) as client:
        resp = client.post(url, json=payload, headers={"x-goog-api-key": s.GEMINI_API_KEY})
        resp.raise_for_status()
        data = resp.json()
    parts = data.get("candidates", [{}])[0].get("content", {}).get("parts", [])
    return "\n".join(p["text"] for p in parts if "text" in p and not p.get("thought")).strip()
