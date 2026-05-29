"""Parsers for search, dropdowns, cause-list, and daily-business endpoints.

Ported from the shared eCourts client. Pure functions over response dicts/HTML —
unit-testable with recorded fixtures (no network).
"""
from __future__ import annotations

import re
from datetime import date, datetime
from typing import Any

from bs4 import BeautifulSoup

from nm_core.ecourts.errors import SchemaChanged
from nm_core.ecourts.models import (
    BenchRef,
    CaseStub,
    CaseTypeRef,
    CauseList,
    CauseListEntry,
    CourtComplexRef,
    DailyBusiness,
    DistrictRef,
    PoliceStationRef,
    StateRef,
)

_DMY_RE = re.compile(r"\b(\d{2}-\d{2}-\d{4})\b")
_CASE_NO_RE = re.compile(r"case_no\s*=\s*['\"](\d+)['\"]")


# --- search (party / case-number / FIR share one shape) ---
def flatten_search_response(response: dict[str, Any]) -> list[CaseStub]:
    if not isinstance(response, dict):
        raise SchemaChanged(field="search.response", reason=f"got {type(response).__name__}")
    out: list[CaseStub] = []
    for key, bucket in response.items():
        if not key.isdigit() or not isinstance(bucket, dict):
            continue
        court = (bucket.get("establishment_name") or "").strip() or "(unknown court)"
        for row in bucket.get("caseNos") or []:
            cino = (row.get("cino") or "").strip()
            if not cino:
                continue
            pet = (row.get("pet_name") or "").strip()
            res = (row.get("res_name") or "").strip()
            title = f"{pet} vs {res}" if pet and res else (pet or res or "(unknown title)")
            year = row.get("reg_year") or row.get("case_year")
            try:
                filing_year: int | None = int(year) if year else None
            except (TypeError, ValueError):
                filing_year = None
            out.append(
                CaseStub(
                    cnr=cino,
                    title=title,
                    case_number=str(row.get("case_no") or ""),
                    court=court,
                    filing_year=filing_year,
                )
            )
    return out


parse_party_search = flatten_search_response
parse_case_number_search = flatten_search_response
parse_fir_search = flatten_search_response


# --- dropdowns (list or post-2026 dict-of-rows) ---
def _normalise_rows(raw: Any, *, field: str) -> list[dict[str, Any]]:
    if isinstance(raw, dict):
        return list(raw.values())
    if isinstance(raw, list):
        return raw
    raise SchemaChanged(field=field, reason=f"expected list or dict, got {type(raw).__name__}")


def parse_states(response: dict[str, Any]) -> list[StateRef]:
    rows = _normalise_rows(response.get("states"), field="states")
    return [
        StateRef(
            code=str(r["state_code"]),
            name=(r.get("state_name") or "").strip(),
            national_code=(r.get("nationalstate_code") or "").strip(),
        )
        for r in rows
        if r.get("state_code") is not None and r.get("display") != "N"
    ]


def parse_districts(response: dict[str, Any], state_code: str) -> list[DistrictRef]:
    rows = _normalise_rows(response.get("districts"), field="districts")
    return [
        DistrictRef(code=str(r["dist_code"]), name=(r.get("dist_name") or "").strip(),
                    state_code=state_code)
        for r in rows
        if r.get("dist_code") is not None and r.get("display") != "N"
    ]


def parse_court_complexes(
    response: dict[str, Any], state_code: str, district_code: str
) -> list[CourtComplexRef]:
    rows = _normalise_rows(response.get("courtComplex"), field="courtComplex")
    return [
        CourtComplexRef(
            code=str(r["complex_code"]),
            name=(r.get("court_complex_name") or "").strip(),
            state_code=state_code,
            district_code=district_code,
            est_code=str(r.get("njdg_est_code") or ""),
        )
        for r in rows
        if r.get("complex_code")
    ]


def _parse_hash_list(packed: str) -> list[tuple[str, str]]:
    out: list[tuple[str, str]] = []
    for entry in (packed or "").split("#"):
        if entry and "~" in entry:
            code, name = entry.split("~", 1)
            out.append((code.strip(), name.strip()))
    return out


def parse_case_types(response: dict[str, Any], *, court_code: str) -> list[CaseTypeRef]:
    rows = response.get("case_types")
    if not isinstance(rows, list):
        return []
    return [
        CaseTypeRef(code=code, name=name, court_code=court_code)
        for row in rows
        for code, name in _parse_hash_list(row.get("case_type") or "")
    ]


def parse_police_stations(
    response: dict[str, Any], *, district_code: str, court_code: str
) -> list[PoliceStationRef]:
    rows = response.get("police_stationlist")
    if not isinstance(rows, list):
        return []
    out: list[PoliceStationRef] = []
    for row in rows:
        uniform_map = row.get("uniform_code") if isinstance(row.get("uniform_code"), dict) else {}
        for code, name in _parse_hash_list(row.get("police_station") or ""):
            try:
                uniform = int(uniform_map.get(code, 0) or 0)
            except (TypeError, ValueError):
                uniform = 0
            out.append(PoliceStationRef(code=code, name=name, district_code=district_code,
                                        court_code=court_code, uniform_code=uniform))
    return out


def parse_hc_benches(response: dict[str, Any], *, state_code: str) -> list[BenchRef]:
    rows = response.get("districts")
    if not isinstance(rows, list):
        raise SchemaChanged(field="districts(benches)", reason=f"got {type(rows).__name__}")
    return [
        BenchRef(code=str(r["dist_code"]), name=(r.get("dist_name") or "").strip(),
                 state_code=state_code)
        for r in rows
        if r.get("dist_code") is not None and r.get("display") != "N"
    ]


# --- cause list ---
def parse_cause_list(
    response: dict[str, Any], *, state_code: str, district_code: str, court_code: str,
    court_no: str, list_date: date, flag: str,
) -> CauseList:
    html = response.get("cases") if isinstance(response, dict) else None
    if isinstance(html, str):
        soup = BeautifulSoup(html, "lxml")
        judge, entries = _extract_judge(soup), _extract_entries(soup)
    else:
        judge, entries = None, []
    return CauseList(
        state_code=state_code, district_code=district_code, court_code=court_code,
        court_no=court_no, list_date=list_date, flag=flag, judge=judge, entries=entries,
    )


def _extract_judge(soup: BeautifulSoup) -> str | None:
    heading = soup.find(id="table_heading")
    if heading is None:
        return None
    inner = heading.find("center")
    if inner is None:
        return None
    inner_inner = inner.find("center")
    text = (inner_inner or inner).get_text("\n", strip=True)
    return (text.splitlines()[0].strip() or None) if text else None


def _extract_entries(soup: BeautifulSoup) -> list[CauseListEntry]:
    entries: list[CauseListEntry] = []
    section = "Default"
    for tr in soup.find_all("tr"):
        cells = tr.find_all("td")
        if not cells:
            continue
        if len(cells) == 1 and cells[0].get("colspan"):
            if t := cells[0].get_text(strip=True):
                section = t
            continue
        if len(cells) < 3:
            continue
        try:
            sr_no = int(cells[0].get_text(strip=True))
        except ValueError:
            continue
        case_cell = cells[1]
        link = case_cell.find("a")
        m = _CASE_NO_RE.search(str(case_cell))
        case_number = m.group(1) if m else (link.get_text(strip=True) if link else "")
        cnr_attr = link.get("cino") if link else None
        listed = _DMY_RE.search(case_cell.get_text(" ", strip=True))
        entries.append(
            CauseListEntry(
                sr_no=sr_no, case_number=case_number,
                cnr=str(cnr_attr).upper() if cnr_attr else None,
                parties=cells[2].get_text("\n", strip=True),
                advocates=(cells[3].get_text("\n", strip=True) or None) if len(cells) > 3 else None,
                section=section,
                listed_on=_parse_dmy(listed.group(1)) if listed else None,
            )
        )
    return entries


# --- daily business ---
def parse_daily_business(response: dict[str, Any], cnr: str, business_date: date) -> DailyBusiness:
    html = response.get("viewBusiness") if isinstance(response, dict) else None
    if not isinstance(html, str) or not html.strip():
        raise SchemaChanged(field="response.viewBusiness", reason="missing viewBusiness HTML")
    soup = BeautifulSoup(html, "lxml")
    return DailyBusiness(
        cnr=cnr,
        business_date=business_date,
        business_text=_business_text(soup),
        next_purpose=_labelled(soup, ("next purpose", "purpose of next hearing")),
        next_hearing_date=_parse_dmy(
            _labelled(soup, ("next hearing date", "next date", "date of next hearing"))
        ),
    )


def _business_text(soup: BeautifulSoup) -> str:
    for tr in soup.find_all("tr"):
        cells = tr.find_all(["td", "th"])
        for i, c in enumerate(cells):
            label = c.get_text(strip=True).lower()
            if "business" in label and "details" in label and i + 1 < len(cells):
                if txt := cells[i + 1].get_text("\n", strip=True):
                    return txt
    candidates = sorted(
        (td.get_text("\n", strip=True) for td in soup.find_all(["td", "div", "p"])),
        key=len, reverse=True,
    )
    return candidates[0] if candidates else ""


def _labelled(soup: BeautifulSoup, labels: tuple[str, ...]) -> str | None:
    for tr in soup.find_all("tr"):
        cells = tr.find_all(["td", "th"])
        for i, c in enumerate(cells):
            label = c.get_text(strip=True).lower()
            if any(lbl in label for lbl in labels) and i + 1 < len(cells):
                if value := cells[i + 1].get_text(strip=True):
                    return value
    return None


def _parse_dmy(s: str | None) -> date | None:
    if not s or s.strip().lower() in ("", "date not given", "null", "none"):
        return None
    for fmt in ("%d-%m-%Y", "%Y-%m-%d", "%d/%m/%Y"):
        try:
            return datetime.strptime(s.strip(), fmt).date()
        except ValueError:
            continue
    return None
