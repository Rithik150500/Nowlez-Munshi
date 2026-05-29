"""Universal search over the user's OWN data — documents, cases, case orders.

Distinct from ``nm_core.ecourts`` search (which queries the eCourts portal): this
searches what the chamber already has. Postgres uses the generated ``search_tsv``
columns + GIN (ranked by ``ts_rank``); SQLite falls back to a token-LIKE scan. Both
feed the same per-kind min-max normalizer + cross-kind merge ported from the legacy
BM25 ranking, so behavior is consistent between prod and tests.

Ownership is enforced after ranking: documents by the user's account ids, cases /
orders by the user's accessible user-ids — never trust a search row alone.
"""
from __future__ import annotations

from collections.abc import Callable, Sequence
from dataclasses import dataclass
from typing import Any

from sqlalchemy import select, text
from sqlalchemy.orm import Session

from nm_core.db.models.case import Case, CaseOrder
from nm_core.db.models.document import Document
from nm_core.teams import AccountRepository, accessible_user_ids

_BAD_CHARS = ('"', "(", ")", ":", "*")


def _sanitize_query(q: str) -> str:
    cleaned = q
    for ch in _BAD_CHARS:
        cleaned = cleaned.replace(ch, " ")
    return " ".join(cleaned.split())


def _normalize_scores(scores: list[float]) -> list[float]:
    """Min-max each per-kind list to [0,1]. Empty→[]; single→[1.0]. Higher input =
    better (PG ts_rank already higher-better; SQLite token-count higher-better)."""
    if not scores:
        return []
    if len(scores) == 1:
        return [1.0]
    lo, hi = min(scores), max(scores)
    span = hi - lo
    if span == 0:
        return [1.0] * len(scores)
    return [(s - lo) / span for s in scores]


@dataclass
class Hit:
    kind: str  # document | case | order
    id: str
    title: str
    secondary: str
    score: float

    def to_dict(self) -> dict:
        return {"kind": self.kind, "id": self.id, "title": self.title,
                "secondary": self.secondary, "score": round(self.score, 4)}


def _is_pg(session: Session) -> bool:
    return session.bind is not None and session.bind.dialect.name == "postgresql"


def _pg_rank(session: Session, model: Any, owner_clause: Any, q: str) -> list[tuple[Any, float]]:
    """Postgres tsvector match + ts_rank. The generated search_tsv column isn't ORM-
    mapped (it's Postgres-only, created in migration 0020), so reference it via raw SQL."""
    tbl = model.__tablename__
    rows = session.execute(
        select(model, text(f"ts_rank({tbl}.search_tsv, plainto_tsquery('english', :q)) AS r"))
        .where(owner_clause, text(f"{tbl}.search_tsv @@ plainto_tsquery('english', :q)"))
        .order_by(text("r DESC"))
        .limit(30),
        {"q": q},
    ).all()
    return [(r[0], float(r[1])) for r in rows]


def _like_rank(
    candidates: Sequence[Any], tokens: list[str], fields: Callable[[Any], list[str | None]]
) -> list[tuple[Any, float]]:
    """SQLite fallback: score each candidate by matched-token count over its text fields."""
    out: list[tuple[Any, float]] = []
    for entity in candidates:
        blob = " ".join(f for f in fields(entity) if f).lower()
        score = sum(1 for tok in tokens if tok in blob)
        if score > 0:
            out.append((entity, float(score)))
    return out


def search_all(session: Session, *, user, query: str, limit: int = 15) -> dict:
    """Search the user's documents/cases/orders; merge + rank across kinds.

    Never raises into the caller — returns ``{"query", "results": []}`` on any error."""
    q = _sanitize_query(query)
    if not q:
        return {"query": query, "results": []}
    try:
        return {"query": query, "results": _search(session, user, q, limit)}
    except Exception:  # noqa: BLE001 — search must degrade, never 500
        return {"query": query, "results": []}


def _search(session: Session, user, q: str, limit: int) -> list[dict]:
    is_pg = _is_pg(session)
    tokens = q.lower().split()
    account_ids = {a.id for a in AccountRepository(session).list_accounts_for_user(user.id)}
    visible_users = accessible_user_ids(session, user)

    hits: list[Hit] = []

    # --- documents (account-scoped) ---
    if account_ids:
        owner = Document.account_id.in_(account_ids)
        docs = (_pg_rank(session, Document, owner, q) if is_pg else _like_rank(
            session.execute(select(Document).where(owner)).scalars().all(),
            tokens,
            lambda d: [d.title, d.filename, d.summary, d.extracted_text]))
        hits += _to_hits("document", docs, lambda d: (d.title, d.filename or ""))

    # --- cases (user-visible) ---
    if visible_users:
        owner = Case.user_id.in_(visible_users)
        cases = (_pg_rank(session, Case, owner, q) if is_pg else _like_rank(
            session.execute(select(Case).where(owner)).scalars().all(),
            tokens,
            lambda c: [c.title, c.cnr, c.court, c.judge]))
        hits += _to_hits("case", cases, lambda c: (c.title or c.cnr, c.court or ""))

    # --- case orders (via visible cases) ---
    if visible_users:
        case_ids = select(Case.id).where(Case.user_id.in_(visible_users))
        owner = CaseOrder.case_id.in_(case_ids)
        orders = (_pg_rank(session, CaseOrder, owner, q) if is_pg else _like_rank(
            session.execute(select(CaseOrder).where(owner)).scalars().all(),
            tokens,
            lambda o: [o.descriptive_name, o.summary]))
        hits += _to_hits(
            "order", orders,
            lambda o: (o.descriptive_name or f"Order dated {o.order_date}", ""))

    hits.sort(key=lambda h: h.score, reverse=True)
    return [h.to_dict() for h in hits[:limit]]


def _to_hits(
    kind: str, scored: list[tuple[Any, float]], fields: Callable[[Any], tuple[str, str]]
) -> list[Hit]:
    """Normalize a per-kind scored list to [0,1] and build Hit rows."""
    norm = _normalize_scores([s for _, s in scored])
    out: list[Hit] = []
    for (entity, _), score in zip(scored, norm, strict=True):
        title, secondary = fields(entity)
        out.append(Hit(kind=kind, id=str(entity.id), title=title or "",
                       secondary=secondary or "", score=score))
    return out


__all__ = ["search_all", "Hit"]
