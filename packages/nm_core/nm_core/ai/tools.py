"""The agent's tool layer — every tool is scoped to one user and records citations.

Both the Gemini agent and the deterministic offline agent execute through this same
``ToolContext.execute``, so the tool surface is identical and independently tested.
"""
from __future__ import annotations

from sqlalchemy.orm import Session

from nm_core.cases import CaseRepository

# Gemini function declarations (JSON schema) for the tools below.
TOOL_DECLARATIONS = [
    {
        "name": "list_cases",
        "description": "List the user's case book: CNR, title, court, stage, next hearing.",
        "parameters": {"type": "object", "properties": {}},
    },
    {
        "name": "get_case",
        "description": "Get one case by CNR: parties, stage, hearing history, judge.",
        "parameters": {
            "type": "object",
            "properties": {"cnr": {"type": "string", "description": "16-char CNR"}},
            "required": ["cnr"],
        },
    },
    {
        "name": "get_orders",
        "description": "List the orders/judgments filed in a case by CNR (date, name, link).",
        "parameters": {
            "type": "object",
            "properties": {"cnr": {"type": "string", "description": "16-char CNR"}},
            "required": ["cnr"],
        },
    },
    {
        "name": "get_order_text",
        "description": "Read the AI summaries of a case's order documents by CNR.",
        "parameters": {
            "type": "object",
            "properties": {"cnr": {"type": "string", "description": "16-char CNR"}},
            "required": ["cnr"],
        },
    },
]


class ToolContext:
    """Per-request tool executor over the user's team-visible case book.

    Scoped to the chamber's shared cases (own + co-members'), consistent with the web
    case book. Tracks which cases were touched (for citations).
    """

    def __init__(self, session: Session, user) -> None:
        from nm_core.teams import accessible_user_ids

        self.repo = CaseRepository(session)
        self.user_id = user.id
        self.visible = accessible_user_ids(session, user)
        self.cited: dict[str, str] = {}  # cnr -> title
        self.calls: list[dict] = []  # {name, args} executed, for the answer record

    def _cite(self, case) -> None:
        self.cited[case.cnr] = case.title or case.cnr

    def execute(self, name: str, args: dict) -> dict:
        self.calls.append({"name": name, "args": args})
        if name == "list_cases":
            return self._list_cases()
        if name == "get_case":
            return self._get_case(str(args.get("cnr", "")).upper())
        if name == "get_orders":
            return self._get_orders(str(args.get("cnr", "")).upper())
        if name == "get_order_text":
            return self._get_order_text(str(args.get("cnr", "")).upper())
        return {"error": f"unknown tool {name}"}

    def _list_cases(self) -> dict:
        cases = self.repo.list_visible(self.visible)
        return {
            "cases": [
                {
                    "cnr": c.cnr,
                    "title": c.title,
                    "court": c.court,
                    "stage": c.stage,
                    "next_hearing_date": c.next_hearing_date.isoformat()
                    if c.next_hearing_date
                    else None,
                }
                for c in cases
            ]
        }

    def _get_case(self, cnr: str) -> dict:
        case = self.repo.get_visible(self.visible, cnr, prefer=self.user_id)
        if case is None:
            return {"error": f"no tracked case {cnr}"}
        self._cite(case)
        return {
            "cnr": case.cnr,
            "title": case.title,
            "court": case.court,
            "judge": case.judge,
            "stage": case.stage,
            "next_hearing_date": case.next_hearing_date.isoformat()
            if case.next_hearing_date
            else None,
            "parties": case.parties,
            "recent_history": case.history[-5:] if case.history else [],
            "order_count": len(self.repo.list_orders(case.id)),
        }

    def _get_orders(self, cnr: str) -> dict:
        case = self.repo.get_visible(self.visible, cnr, prefer=self.user_id)
        if case is None:
            return {"error": f"no tracked case {cnr}"}
        self._cite(case)
        orders = self.repo.list_orders(case.id)
        return {
            "cnr": cnr,
            "orders": [
                {
                    "order_id": o.order_id,
                    "order_date": o.order_date.isoformat() if o.order_date else None,
                    "name": o.descriptive_name,
                    "url": o.order_url,
                }
                for o in orders
            ],
        }

    def _get_order_text(self, cnr: str) -> dict:
        case = self.repo.get_visible(self.visible, cnr, prefer=self.user_id)
        if case is None:
            return {"error": f"no tracked case {cnr}"}
        self._cite(case)
        return {
            "cnr": cnr,
            "orders": [
                {
                    "order_date": o.order_date.isoformat() if o.order_date else None,
                    "name": o.descriptive_name,
                    "summary": o.summary or "(not yet summarized)",
                }
                for o in self.repo.list_orders(case.id)
            ],
        }
