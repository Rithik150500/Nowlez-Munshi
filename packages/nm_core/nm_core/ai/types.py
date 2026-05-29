"""AI result types."""
from __future__ import annotations

from dataclasses import dataclass, field


@dataclass(frozen=True)
class Citation:
    cnr: str
    title: str
    kind: str = "case"

    def to_dict(self) -> dict:
        return {"cnr": self.cnr, "title": self.title, "kind": self.kind}


@dataclass
class Answer:
    text: str
    citations: list[Citation] = field(default_factory=list)
    channel: str = "web"
    mode: str = "offline"  # "gemini" | "offline"
    tool_calls: list[dict] = field(default_factory=list)
    thread_id: str | None = None
    web_sources: list[dict] = field(default_factory=list)  # [{title, url}] from search_web
    documents: list[dict] = field(default_factory=list)  # [{storage_key, filename}] drafted

    def to_dict(self) -> dict:
        return {
            "answer": self.text,
            "citations": [c.to_dict() for c in self.citations],
            "channel": self.channel,
            "mode": self.mode,
            "tool_calls": self.tool_calls,
            "thread_id": self.thread_id,
            "web_sources": self.web_sources,
            "documents": self.documents,
        }
