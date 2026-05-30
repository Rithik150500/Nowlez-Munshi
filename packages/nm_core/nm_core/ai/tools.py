"""The agent's tool layer — every tool is scoped to one user and records citations.

Both the Gemini agent and the deterministic offline agent execute through this same
``ToolContext.execute``, so the tool surface is identical and independently tested.
"""
from __future__ import annotations

from sqlalchemy.orm import Session

from nm_core.ai import drafting, tavily
from nm_core.cases import CaseRepository

_SEARCH_WEB_DECLARATION = {
    "name": "search_web",
    "description": (
        "Search the public web for current legal information (statutes, recent "
        "judgments, news) when the case book can't answer. Returns titles, URLs, and "
        "snippets to cite."
    ),
    "parameters": {
        "type": "object",
        "properties": {"query": {"type": "string", "description": "the web search query"}},
        "required": ["query"],
    },
}

_DRAFTING_DECLARATIONS = [
    {
        "name": "read_docx_reference",
        "description": ("Read the docx-js API reference + template catalog. Call this "
                        "before writing code for draft_document."),
        "parameters": {"type": "object", "properties": {}},
    },
    {
        "name": "read_docx_template",
        "description": ("Load a reference template (by id from the catalog) showing the "
                        "correct formatting for a document type, to adapt."),
        "parameters": {
            "type": "object",
            "properties": {"template_id": {"type": "string", "description": "template id"}},
            "required": ["template_id"],
        },
    },
    {
        "name": "draft_document",
        "description": ("Generate a downloadable DOCX legal document by writing docx-js "
                        "JavaScript code. Call read_docx_reference first; load the closest "
                        "template with read_docx_template if one exists."),
        "parameters": {
            "type": "object",
            "properties": {
                "title": {"type": "string", "description": "document title"},
                "code": {"type": "string", "description": "docx-js JavaScript source"},
            },
            "required": ["title", "code"],
        },
    },
]


_FETCH_URL_DECLARATION = {
    "name": "fetch_url",
    "description": (
        "Read the full content of one or more web pages by URL (e.g. a full judgment "
        "on Indian Kanoon) when search snippets aren't enough. Accepts a single URL or "
        "a comma-separated list."
    ),
    "parameters": {
        "type": "object",
        "properties": {"url": {"type": "string", "description": "URL or comma-separated URLs"}},
        "required": ["url"],
    },
}


def tool_declarations() -> list[dict]:
    """The active tool surface — search_web/fetch_url and the drafting tools appear only
    when their backing service (Tavily / a Node runtime) is configured."""
    decls = list(_CASE_BOOK_DECLARATIONS)
    if tavily.is_available():
        decls.append(_SEARCH_WEB_DECLARATION)
        decls.append(_FETCH_URL_DECLARATION)
    if drafting.is_available():
        decls.extend(_DRAFTING_DECLARATIONS)
    return decls


# Gemini function declarations (JSON schema) for the case-book tools below.
_CASE_BOOK_DECLARATIONS = [
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
    {
        "name": "list_documents",
        "description": "List the chamber's uploaded documents (title + summary).",
        "parameters": {"type": "object", "properties": {}},
    },
    {
        "name": "get_document_text",
        "description": "Read an uploaded document's extracted text by (partial) title.",
        "parameters": {
            "type": "object",
            "properties": {"title": {"type": "string", "description": "document title (or part)"}},
            "required": ["title"],
        },
    },
]


class ToolContext:
    """Per-request tool executor over the user's team-visible case book.

    Scoped to the chamber's shared cases (own + co-members'), consistent with the web
    case book. Tracks which cases were touched (for citations).
    """

    def __init__(self, session: Session, user) -> None:
        from nm_core.teams import AccountRepository, accessible_user_ids

        self.session = session
        self.repo = CaseRepository(session)
        self.user_id = user.id
        self.visible = accessible_user_ids(session, user)
        self.account_ids = {
            a.id for a in AccountRepository(session).list_accounts_for_user(user.id)
        }
        self.cited: dict[str, str] = {}  # cnr -> title
        self.web_sources: list[dict] = []  # {title, url} from search_web, for citations
        self.documents: list[dict] = []  # drafted DOCX {storage_key, filename} for the answer
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
        if name == "list_documents":
            return self._list_documents()
        if name == "get_document_text":
            return self._get_document_text(str(args.get("title", "")))
        if name == "search_web":
            return self._search_web(str(args.get("query", "")))
        if name == "fetch_url":
            return self._fetch_url(str(args.get("url", "")))
        if name == "read_docx_reference":
            return {"content": drafting.read_reference(), "templates": drafting.list_templates()}
        if name == "read_docx_template":
            text = drafting.read_template(str(args.get("template_id", "")))
            if text is None:
                return {"error": "template not found", "available": drafting.list_templates()}
            return {"content": text}
        if name == "draft_document":
            return self._draft_document(str(args.get("title", "")), str(args.get("code", "")))
        return {"error": f"unknown tool {name}"}

    def _draft_document(self, title: str, code: str) -> dict:
        account_id = next(iter(self.account_ids), self.user_id)
        try:
            meta = drafting.draft_and_store(code, account_id=account_id, title=title or "document")
        except drafting.DraftError as e:
            return {"error": str(e)}
        self.documents.append({"storage_key": meta["storage_key"], "filename": meta["filename"]})
        return {"status": "created", "filename": meta["filename"], "bytes": meta["bytes"]}

    def _search_web(self, query: str) -> dict:
        if not query.strip():
            return {"error": "empty query"}
        results = tavily.search(query)
        for r in results:  # track for web-source citations
            if r.get("url"):
                self.web_sources.append({"title": r["title"], "url": r["url"]})
        return {"results": results}

    def _fetch_url(self, url_input: str) -> dict:
        urls = [u.strip() for u in url_input.split(",") if u.strip()]
        if not urls:
            return {"error": "url is required"}
        out = tavily.extract(urls)
        for r in out.get("results", []):  # track fetched pages as web sources
            if r.get("url"):
                self.web_sources.append({"title": r["url"], "url": r["url"]})
        return out

    def _list_documents(self) -> dict:
        from nm_core.documents import DocumentRepository

        docs = DocumentRepository(self.session).list_for_accounts(self.account_ids)
        return {
            "documents": [
                {"title": d.title, "summary": d.summary or "(not yet processed)"} for d in docs
            ]
        }

    def _get_document_text(self, title: str) -> dict:
        from nm_core.documents import DocumentRepository

        title_l = title.lower()
        for d in DocumentRepository(self.session).list_for_accounts(self.account_ids):
            if title_l in (d.title or "").lower():
                return {
                    "title": d.title,
                    "summary": d.summary,
                    "text": (d.extracted_text or "")[:4000],
                }
        return {"error": f"no document matching '{title}'"}

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
