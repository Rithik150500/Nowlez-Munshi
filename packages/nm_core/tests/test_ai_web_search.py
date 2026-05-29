"""AI Munshi web search (Tavily): tool gating, citations, offline-agent routing."""
from __future__ import annotations

import httpx
import pytest
import respx

from nm_core.ai import ask, tavily
from nm_core.ai.tools import ToolContext, tool_declarations
from nm_core.config import get_settings
from nm_core.identity.repositories import UserRepository

TAVILY_URL = "https://api.tavily.com/search"


@pytest.fixture(autouse=True)
def env(monkeypatch):
    monkeypatch.setattr(get_settings(), "ECOURTS_OFFLINE", True)
    monkeypatch.setattr(get_settings(), "GEMINI_API_KEY", "")  # offline agent
    yield


def test_search_web_tool_gated_on_key(monkeypatch):
    monkeypatch.setattr(get_settings(), "TAVILY_API_KEY", "")
    assert all(d["name"] != "search_web" for d in tool_declarations())
    monkeypatch.setattr(get_settings(), "TAVILY_API_KEY", "tvly-x")
    assert any(d["name"] == "search_web" for d in tool_declarations())


@respx.mock
def test_tavily_search_parses_results(monkeypatch):
    monkeypatch.setattr(get_settings(), "TAVILY_API_KEY", "tvly-x")
    respx.post(TAVILY_URL).mock(return_value=httpx.Response(200, json={"results": [
        {"title": "Section 138 NI Act", "url": "https://x.test/138", "content": "snippet"},
    ]}))
    out = tavily.search("section 138")
    assert out == [{"title": "Section 138 NI Act", "url": "https://x.test/138",
                    "content": "snippet"}]


@respx.mock
def test_tavily_failure_returns_empty(monkeypatch):
    monkeypatch.setattr(get_settings(), "TAVILY_API_KEY", "tvly-x")
    respx.post(TAVILY_URL).mock(return_value=httpx.Response(500, text="down"))
    assert tavily.search("anything") == []  # never breaks the agent


@respx.mock
def test_tool_context_tracks_web_sources(db_session, monkeypatch):
    monkeypatch.setattr(get_settings(), "TAVILY_API_KEY", "tvly-x")
    respx.post(TAVILY_URL).mock(return_value=httpx.Response(200, json={"results": [
        {"title": "A", "url": "https://x.test/a", "content": "c"},
        {"title": "B", "url": "https://x.test/b", "content": "c"},
    ]}))
    user, _ = UserRepository(db_session).get_or_create_by_phone(phone="+919100000301")
    ctx = ToolContext(db_session, user)
    result = ctx.execute("search_web", {"query": "latest bail judgment"})
    assert len(result["results"]) == 2
    assert [s["url"] for s in ctx.web_sources] == ["https://x.test/a", "https://x.test/b"]


@respx.mock
def test_ask_surfaces_web_sources(db_session, monkeypatch):
    monkeypatch.setattr(get_settings(), "TAVILY_API_KEY", "tvly-x")
    respx.post(TAVILY_URL).mock(return_value=httpx.Response(200, json={"results": [
        {"title": "Recent ruling", "url": "https://x.test/ruling", "content": "c"},
    ]}))
    user, _ = UserRepository(db_session).get_or_create_by_phone(phone="+919100000302")
    answer = ask(db_session, user=user, question="What's the latest on anticipatory bail news?")
    assert answer.web_sources == [{"title": "Recent ruling", "url": "https://x.test/ruling"}]
    assert "x.test/ruling" in answer.text


def test_no_web_search_without_key(db_session, monkeypatch):
    monkeypatch.setattr(get_settings(), "TAVILY_API_KEY", "")
    user, _ = UserRepository(db_session).get_or_create_by_phone(phone="+919100000303")
    answer = ask(db_session, user=user, question="search the web for latest news")
    assert answer.web_sources == []  # tool disabled → falls through to case-book agent


EXTRACT_URL = "https://api.tavily.com/extract"


def test_fetch_url_tool_gated_on_key(monkeypatch):
    monkeypatch.setattr(get_settings(), "TAVILY_API_KEY", "")
    assert all(d["name"] != "fetch_url" for d in tool_declarations())
    monkeypatch.setattr(get_settings(), "TAVILY_API_KEY", "tvly-x")
    assert any(d["name"] == "fetch_url" for d in tool_declarations())


def test_fetch_url_rejects_bad_scheme(monkeypatch):
    monkeypatch.setattr(get_settings(), "TAVILY_API_KEY", "tvly-x")
    out = tavily.extract(["ftp://x.test/doc"])
    assert "error" in out and out["results"] == []


@respx.mock
def test_fetch_url_extracts_and_tracks_sources(db_session, monkeypatch):
    monkeypatch.setattr(get_settings(), "TAVILY_API_KEY", "tvly-x")
    respx.post(EXTRACT_URL).mock(return_value=httpx.Response(200, json={
        "results": [{"url": "https://ik.test/j1", "raw_content": "# Judgment\nfull text"}],
        "failed_results": [{"url": "https://ik.test/bad", "error": "404"}],
    }))
    user, _ = UserRepository(db_session).get_or_create_by_phone(phone="+919100000311")
    ctx = ToolContext(db_session, user)
    out = ctx.execute("fetch_url", {"url": "https://ik.test/j1, https://ik.test/bad"})
    assert out["results"][0]["content"].startswith("# Judgment")
    assert out["failed"][0]["url"] == "https://ik.test/bad"
    assert ctx.web_sources == [{"title": "https://ik.test/j1", "url": "https://ik.test/j1"}]
