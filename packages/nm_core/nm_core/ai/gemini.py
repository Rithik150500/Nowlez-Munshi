"""Gemini agentic loop via the generateContent function-calling API."""
from __future__ import annotations

from collections.abc import Callable

import httpx

from nm_core.ai.context import SYSTEM_PROMPT
from nm_core.ai.tools import TOOL_DECLARATIONS
from nm_core.config import get_settings

_BASE = "https://generativelanguage.googleapis.com/v1beta/models"


def is_available() -> bool:
    return bool(get_settings().GEMINI_API_KEY)


def _to_contents(history: list[dict], question: str) -> list[dict]:
    contents = [
        {"role": "model" if m["role"] == "assistant" else "user", "parts": [{"text": m["content"]}]}
        for m in history
    ]
    contents.append({"role": "user", "parts": [{"text": question}]})
    return contents


def _generate(contents: list[dict]) -> dict:
    s = get_settings()
    url = f"{_BASE}/{s.GEMINI_MODEL}:generateContent"
    payload = {
        "systemInstruction": {"parts": [{"text": SYSTEM_PROMPT}]},
        "contents": contents,
        "tools": [{"functionDeclarations": TOOL_DECLARATIONS}],
        "generationConfig": {"temperature": 1.0},
    }
    headers = {"x-goog-api-key": s.GEMINI_API_KEY, "Content-Type": "application/json"}
    with httpx.Client(timeout=s.AI_REQUEST_TIMEOUT_SECONDS) as client:
        resp = client.post(url, json=payload, headers=headers)
        resp.raise_for_status()
        return resp.json()


def run_agent(
    *, question: str, history: list[dict], execute_tool: Callable[[str, dict], dict]
) -> str:
    """Run the function-calling loop until the model answers in text. Returns the answer."""
    contents = _to_contents(history, question)
    max_iters = get_settings().AI_MAX_TOOL_ITERATIONS
    for _ in range(max_iters):
        data = _generate(contents)
        candidates = data.get("candidates", [])
        if not candidates:
            return ""
        parts = candidates[0].get("content", {}).get("parts", [])
        fcalls = [p["functionCall"] for p in parts if "functionCall" in p]
        if fcalls:
            contents.append({"role": "model", "parts": parts})
            tool_parts = [
                {
                    "functionResponse": {
                        "name": fc["name"],
                        "response": execute_tool(fc["name"], dict(fc.get("args", {}))),
                    }
                }
                for fc in fcalls
            ]
            contents.append({"role": "user", "parts": tool_parts})
            continue
        texts = [p["text"] for p in parts if "text" in p and not p.get("thought")]
        return "\n".join(texts).strip()
    return ""
