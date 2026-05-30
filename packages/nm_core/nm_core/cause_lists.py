"""HC cause-list indexer + CNR back-resolution.

Nightly, for each bench sitting on the target date, download its cause-list PDF,
extract the rows, and upsert them into ``cause_list_rows``. HC PDFs print the case
number (e.g. ``WP/8742/2026``) but never the CNR, so a best-effort back-resolution
runs an HC case-number search to fill ``cnr`` where it can — rows that don't resolve
keep ``cnr = NULL`` and simply won't join to a tracked case in the digest.
"""
from __future__ import annotations

import logging
import re
from datetime import date

from sqlalchemy import delete, select
from sqlalchemy.orm import Session

from nm_core.db.models.cause_list import CauseListRow
from nm_core.ecourts import client as ecourts
from nm_core.ecourts.errors import ECourtsError

logger = logging.getLogger("nm_core.cause_lists")

# "WP/8742/2026", "CRL.A/42/2025", "W.P. - 12 - 2024" → (type, number, year)
_CASE_NUMBER_RE = re.compile(r"^\s*([A-Za-z.\s]+?)\s*[/-]\s*(\d+)\s*[/-]\s*(\d{4})\s*$")


def parse_case_number(text: str) -> tuple[str, str, int] | None:
    m = _CASE_NUMBER_RE.match(text or "")
    if not m:
        return None
    return m.group(1).strip(), m.group(2), int(m.group(3))


def index_hc_cause_lists(
    session: Session,
    *,
    state_code: str,
    district_code: str,
    court_code: str,
    sitting_date: date,
    list_date: date | None = None,
    resolve: bool = True,
) -> dict[str, int]:
    """Index every sitting bench's cause list for the date. Returns counts."""
    list_date = list_date or sitting_date
    benches = ecourts.hc_bench_sittings(
        state_code=state_code, district_code=district_code,
        court_code=court_code, sitting_date=sitting_date,
    )
    stored = 0
    resolved = 0
    for bench in benches:
        try:
            index = ecourts.hc_cause_list_index(
                state_code=state_code, district_code=district_code,
                court_code=court_code, bench_id=bench.code, list_date=list_date,
            )
        except ECourtsError:
            logger.exception("cause-list index failed for bench %s", bench.code)
            continue
        # sr_no is a synthetic positional counter from the position-based PDF parser, so
        # it shifts if a re-parse splits/merges rows differently. Replace this bench's
        # rows for the date wholesale rather than positionally upserting (which would
        # duplicate/mis-update on any drift).
        bench_rows = []
        for entry in index:
            try:
                bench_rows.extend(ecourts.hc_cause_list_pdf_rows(pdf_url=entry.pdf_url))
            except ECourtsError:
                logger.exception("cause-list PDF failed: %s", entry.pdf_url)
        if not index:
            continue
        session.execute(
            delete(CauseListRow).where(
                CauseListRow.bench_id == bench.code, CauseListRow.list_date == list_date
            )
        )
        for row in bench_rows:
            session.add(CauseListRow(
                state_code=state_code, court_code=court_code, bench_id=bench.code,
                list_date=list_date, sr_no=row.sr_no, section=row.section,
                case_number=row.case_number, raw_text=row.raw_text,
            ))
            stored += 1
        session.flush()
    if resolve:
        resolved = back_resolve_cnrs(
            session, state_code=state_code, district_code=district_code,
            court_code=court_code, list_date=list_date,
        )
    return {"benches": len(benches), "stored": stored, "resolved": resolved}


def _case_type_lookup(state_code: str, district_code: str, court_code: str) -> dict[str, str]:
    """Map a case-type abbreviation (e.g. 'WP') → the numeric NIC code eCourts expects.

    HC PDFs print the abbreviation, but caseNumberSearch.php requires the numeric code,
    so we build the map from list_case_types names like 'WP - Writ Petition'. Best-effort:
    an empty map means no rows resolve this run (vs. silently querying with a bad type)."""
    try:
        types = ecourts.hc_list_case_types(
            state_code=state_code, district_code=district_code, court_code=court_code
        )
    except ECourtsError:
        return {}
    lookup: dict[str, str] = {}
    for t in types:
        # The abbreviation is the leading token of the display name ("WP - Writ Petition").
        abbrev = re.split(r"[\s\-/]", t.name.strip(), maxsplit=1)[0].upper()
        if abbrev:
            lookup.setdefault(abbrev, t.code)
    return lookup


def back_resolve_cnrs(
    session: Session, *, state_code: str, district_code: str,
    court_code: str, list_date: date, limit: int = 200,
) -> int:
    """Fill cnr for unresolved rows via HC case-number search. Best-effort + bounded."""
    rows = session.execute(
        select(CauseListRow).where(
            CauseListRow.list_date == list_date,
            CauseListRow.cnr.is_(None),
            CauseListRow.case_number != "",
        ).limit(limit)
    ).scalars().all()
    if not rows:
        return 0
    type_lookup = _case_type_lookup(state_code, district_code, court_code)
    resolved = 0
    for row in rows:
        parsed = parse_case_number(row.case_number)
        if parsed is None:
            continue
        abbrev, number, year = parsed
        type_code = type_lookup.get(abbrev.upper())
        if type_code is None:
            continue  # untranslatable abbreviation — skip rather than query with a bad type
        try:
            hits = ecourts.hc_search_case_number(
                state_code=state_code, district_code=district_code,
                court_code_arr=court_code, case_type=type_code,
                case_number=number, year=year,
            )
        except ECourtsError:
            continue  # leave cnr NULL; a later run can retry
        # Only bind on an unambiguous single match — never guess between candidates.
        if len(hits) == 1 and hits[0].cnr:
            row.cnr = hits[0].cnr
            resolved += 1
    session.flush()
    return resolved
