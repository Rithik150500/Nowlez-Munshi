"""Result types returned by the Munshi brain. Deliberately tiny — no
SourceRegistry / streaming machinery (that lives in casepilot and is overkill
for a single-turn MVP)."""
from __future__ import annotations

from dataclasses import dataclass, field


@dataclass(frozen=True)
class Citation:
    """A source the answer leans on. For the MVP every citation is a case."""

    cnr: str
    title: str
    kind: str = "case"

    def to_dict(self) -> dict:
        return {"cnr": self.cnr, "title": self.title, "kind": self.kind}


@dataclass
class AnswerResult:
    text: str
    citations: list[Citation] = field(default_factory=list)
    channel: str = "web"          # "web" | "whatsapp" — metadata only
    mode: str = "extractive"      # "gemini" | "extractive"

    def to_dict(self) -> dict:
        return {
            "answer": self.text,
            "citations": [c.to_dict() for c in self.citations],
            "channel": self.channel,
            "mode": self.mode,
        }
