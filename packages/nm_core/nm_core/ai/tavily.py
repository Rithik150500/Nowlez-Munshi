"""Tavily web-search client for the AI Munshi.

A thin wrapper over Tavily's search API. Disabled (``is_available() == False``) when
no ``TAVILY_API_KEY`` is set, in which case the ``search_web`` tool isn't offered to
the agent — so dev/tests stay fully offline and deterministic.
"""
from __future__ import annotations

import httpx

from nm_core.config import get_settings

_ENDPOINT = "https://api.tavily.com/search"


def is_available() -> bool:
    return bool(get_settings().TAVILY_API_KEY)


def search(query: str, *, max_results: int | None = None) -> list[dict]:
    """Return a list of ``{title, url, content}`` web results. Empty list on any error
    (web search must never break the agent loop)."""
    s = get_settings()
    if not s.TAVILY_API_KEY:
        return []
    payload = {
        "api_key": s.TAVILY_API_KEY,
        "query": query,
        "max_results": max_results or s.TAVILY_MAX_RESULTS,
        "search_depth": "basic",
    }
    try:
        with httpx.Client(timeout=s.AI_REQUEST_TIMEOUT_SECONDS) as client:
            resp = client.post(_ENDPOINT, json=payload)
            resp.raise_for_status()
            data = resp.json()
    except (httpx.HTTPError, ValueError):
        return []
    return [
        {"title": r.get("title", ""), "url": r.get("url", ""), "content": r.get("content", "")}
        for r in data.get("results", [])
    ]
