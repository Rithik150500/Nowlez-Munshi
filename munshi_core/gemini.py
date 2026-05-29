"""Thin, single-turn Gemini client. Mirrors the request/response shape of
casepilot/backend/gemini_client.py WITHOUT forking its agentic loop, streaming,
function-calling, or retry machinery — none of which the MVP needs.

If GEMINI_API_KEY is unset (or the call fails), the brain falls back to a
deterministic extractive answer, so the prototype runs and tests pass offline.
"""
from __future__ import annotations

import os

import httpx

DEFAULT_MODEL = "gemini-3-flash-preview"
_BASE = "https://generativelanguage.googleapis.com/v1beta/models"


def is_available() -> bool:
    return bool(os.environ.get("GEMINI_API_KEY"))


def generate(question: str, system_prompt: str, context: str, *, timeout: float = 60.0) -> str:
    """One non-streaming generateContent call. Returns the answer text (or "")."""
    api_key = os.environ["GEMINI_API_KEY"]
    model = os.environ.get("GEMINI_MODEL", DEFAULT_MODEL)
    url = f"{_BASE}/{model}:generateContent"
    payload = {
        "systemInstruction": {"parts": [{"text": system_prompt}]},
        "contents": [
            {"role": "user", "parts": [{"text": f"{context}\n\nQuestion: {question}"}]}
        ],
        # 1.0 matches casepilot's finding that lowering it makes Gemini 3 loop.
        "generationConfig": {"temperature": 1.0},
    }
    headers = {"x-goog-api-key": api_key, "Content-Type": "application/json"}
    with httpx.Client(timeout=timeout) as client:
        resp = client.post(url, json=payload, headers=headers)
        resp.raise_for_status()
        data = resp.json()
    candidates = data.get("candidates", [])
    if not candidates:
        return ""
    parts = candidates[0].get("content", {}).get("parts", [])
    texts = [p["text"] for p in parts if "text" in p and not p.get("thought")]
    return "\n".join(texts).strip()
