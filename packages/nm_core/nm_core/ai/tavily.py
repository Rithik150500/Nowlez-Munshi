"""Tavily web-search client for the AI Munshi.

A thin wrapper over Tavily's search API. Disabled (``is_available() == False``) when
no ``TAVILY_API_KEY`` is set, in which case the ``search_web`` tool isn't offered to
the agent — so dev/tests stay fully offline and deterministic.
"""
from __future__ import annotations

import httpx

from nm_core.config import get_settings

_ENDPOINT = "https://api.tavily.com/search"
_EXTRACT_ENDPOINT = "https://api.tavily.com/extract"


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


def extract(urls: list[str]) -> dict:
    """Extract full page content (markdown) from URLs via Tavily Extract — the backing
    for the ``fetch_url`` tool (read a full judgment/page when snippets aren't enough).

    Validates http(s) schemes; returns ``{results:[{url, content}], failed:[{url, error}]}``.
    Degrades to an error/empty payload rather than raising, so the agent loop is safe."""
    s = get_settings()
    if not s.TAVILY_API_KEY:
        return {"results": [], "failed": []}
    bad = [u for u in urls if not u.startswith(("http://", "https://"))]
    if bad:
        return {"error": f"invalid URL scheme: {bad[0]}; only http(s) is supported",
                "results": [], "failed": []}
    try:
        with httpx.Client(timeout=s.AI_REQUEST_TIMEOUT_SECONDS) as client:
            resp = client.post(
                _EXTRACT_ENDPOINT,
                json={"api_key": s.TAVILY_API_KEY, "urls": urls, "format": "markdown",
                      "extract_depth": "basic"},
            )
            resp.raise_for_status()
            data = resp.json()
    except (httpx.HTTPError, ValueError):
        return {"results": [], "failed": [{"url": u, "error": "extract failed"} for u in urls]}
    return {
        "results": [{"url": r.get("url", ""), "content": r.get("raw_content", "")}
                    for r in data.get("results", [])],
        "failed": [{"url": r.get("url", ""), "error": r.get("error", "extraction error")}
                   for r in data.get("failed_results", [])],
    }
