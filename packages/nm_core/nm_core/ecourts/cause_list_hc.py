"""High Court cause-list parsers — index (HTML), bench sittings (JSON), and the
position-based PDF extractor.

HC cause-lists are PDFs with position-based (not ruled-table) layouts: benches
differ in column widths, fonts, and section markers. The PDF extractor is
robust-but-imperfect and per-bench fragile — it captures each case's full text
bundle in ``raw_text`` (always reliable) and best-effort splits out the case
number. Ported from the legacy bot; tuned against AP/Tripura HC snapshots, other
benches need their own fixtures before being considered production-ready.
"""
from __future__ import annotations

import io
import re
from collections import defaultdict
from datetime import date
from typing import Any

import pdfplumber
from bs4 import BeautifulSoup

from nm_core.ecourts.errors import SchemaChanged
from nm_core.ecourts.models import HCBenchSitting, HCCauseListIndex, HCCauseListPDFRow

# Section markers seen across HC PDFs (union over captured benches). Detection is
# substring-based, so adding more is safe.
_SECTION_MARKERS = {
    "LUNCH MOTION", "FRESH MOTION HEARING", "FRESH MOTION", "REGULAR MOTION",
    "ADMISSION", "DISPOSAL", "FINAL HEARING", "ORDER", "FOR ORDERS",
    "FOR JUDGMENT", "ADJOURNED", "PART HEARD",
    "FOR MOTION", "FOR ADMISSION", "PART I", "PART II",
}
_SR_NO_HEADER_RE = re.compile(
    r"^\s*(?:S\.?\s*No\.?|Sr\.?\s*No\.?|Sl\.?\s*No\.?)\s*$", re.IGNORECASE
)
# Row-start markers: a digit optionally followed by ')' or '.' (e.g. "1", "1)", "1.")
_ROW_START_RE = re.compile(r"^\d+[)\.]?$")


def parse_hc_bench_sittings(
    response: dict[str, Any], *, state_code: str, sitting_date: date
) -> list[HCBenchSitting]:
    """``{benches: {benchesStr: 'code1~name1^code2~name2'}}`` → sittings.

    Returns [] on holidays / non-sitting days (``benches`` null or missing). The
    HC bench separator is '^' (not '#' as in police-stations / case-types)."""
    payload = response.get("benches")
    if not isinstance(payload, dict):
        return []
    packed = payload.get("benchesStr")
    if not isinstance(packed, str):
        return []
    out: list[HCBenchSitting] = []
    for entry in packed.split("^"):
        if not entry or "~" not in entry:
            continue
        code, name = entry.split("~", 1)
        out.append(HCBenchSitting(
            code=code.strip(), name=name.strip(),
            state_code=state_code, sitting_date=sitting_date,
        ))
    return out


def parse_hc_cause_list_index(response: dict[str, Any]) -> list[HCCauseListIndex]:
    """Parse the HC cause-list index HTML (4 cols: Sr | Bench | Type | View PDF)."""
    if not isinstance(response, dict):
        raise SchemaChanged(
            field="response", reason=f"expected dict, got {type(response).__name__}"
        )
    html = response.get("cases")
    if not isinstance(html, str) or not html.strip():
        return []

    soup = BeautifulSoup(html, "lxml")
    rows: list[HCCauseListIndex] = []
    for tr in soup.find_all("tr"):
        cells = tr.find_all("td")
        if len(cells) < 4:
            continue
        try:
            sr_no = int(cells[0].get_text(strip=True))
        except ValueError:
            continue
        link = cells[3].find("a")
        href = link.get("href") if link is not None else None
        pdf_url = href.strip() if isinstance(href, str) else ""
        if not pdf_url:
            continue
        rows.append(HCCauseListIndex(
            sr_no=sr_no, bench=cells[1].get_text(strip=True),
            list_type=cells[2].get_text(strip=True), pdf_url=pdf_url,
        ))
    return rows


def parse_hc_cause_list_pdf(pdf_bytes: bytes) -> list[HCCauseListPDFRow]:
    """Parse a downloaded HC cause-list PDF into structured row records.

    Returns [] (rather than raising) when the PDF is empty or the column-header
    anchor isn't found. Raises SchemaChanged only on catastrophic input (not a PDF)."""
    pdf_bytes = pdf_bytes.lstrip()  # some HC PDFs are prefixed by PHP-echo whitespace
    if not pdf_bytes.startswith(b"%PDF"):
        raise SchemaChanged(field="pdf_magic", reason="content does not start with %PDF")

    rows_out: list[HCCauseListPDFRow] = []
    sr_counter = 0
    with pdfplumber.open(io.BytesIO(pdf_bytes)) as pdf:
        if not pdf.pages:
            return []
        for page in pdf.pages:
            words = page.extract_words(use_text_flow=True)
            if not words:
                continue
            sr_x, header_y = _find_sr_no_anchor(words)
            if sr_x is None or header_y is None:
                continue
            _, page_rows, sr_counter = _walk_page(
                words, sr_x=sr_x, header_y=header_y, starting_sr=sr_counter,
            )
            rows_out.extend(page_rows)
    return rows_out


def _find_sr_no_anchor(words: list[dict[str, Any]]) -> tuple[float | None, float | None]:
    """Locate the column-header line, two strategies in order:

    1. **Explicit header** — "S.No."/"Sr.No."/"Sl.No." with "Case"/"Party" beside it.
    2. **Implicit** — topmost line whose leftmost word is a row marker (1, 1), 1.);
       used by HCs (e.g. Tripura) that omit the header. header_y is set above the row
       so the row itself isn't excluded by _walk_page's filter.
    """
    for w in words:
        if _SR_NO_HEADER_RE.match(w["text"]):
            y = w["top"]
            neighbours = [
                ww["text"].lower() for ww in words
                if abs(ww["top"] - y) < 5 and ww["x0"] > w["x0"]
            ]
            if any("case" in n or "party" in n for n in neighbours):
                return w["x0"], y

    by_y: dict[int, list[dict[str, Any]]] = defaultdict(list)
    for w in words:
        by_y[int(round(w["top"] / 5) * 5)].append(w)
    for y in sorted(by_y.keys()):
        line_words = sorted(by_y[y], key=lambda w: w["x0"])
        if line_words and _ROW_START_RE.match(line_words[0]["text"]):
            return line_words[0]["x0"], line_words[0]["top"] - 10
    return None, None


def _walk_page(
    words: list[dict[str, Any]], *, sr_x: float, header_y: float, starting_sr: int,
) -> tuple[str, list[HCCauseListPDFRow], int]:
    """Sweep the page top-to-bottom, grouping words into y-band lines, then aggregate
    consecutive lines into case bundles (a row-marker at sr_x starts a new bundle)."""
    full_by_y: dict[int, list[dict[str, Any]]] = defaultdict(list)
    for w in words:
        full_by_y[int(round(w["top"] / 5) * 5)].append(w)
    # Row-data view excludes everything at/above the header line.
    by_y = {y for y in full_by_y if y > header_y + 2}

    current_section = "DEFAULT"
    bundles: list[dict[str, Any]] = []
    current_bundle: dict[str, Any] | None = None
    sr_counter = starting_sr
    in_trailer = False  # 'advocates on leave' trailer re-numbers 1)-N) — not case rows

    for y in sorted(full_by_y.keys()):
        line_words = sorted(full_by_y[y], key=lambda w: w["x0"])
        line_text = " ".join(w["text"] for w in line_words).strip()
        if not line_text:
            continue
        upper = line_text.upper()
        if ("COUNSEL NAMED BELOW" in upper or "ADVOCATES ON LEAVE" in upper
                or "REMAIN ABSENT" in upper):
            in_trailer = True
            continue
        if in_trailer:
            continue
        # Section marker anywhere on the page switches the current section.
        if any(marker in upper for marker in _SECTION_MARKERS):
            current_section = next(m for m in _SECTION_MARKERS if m in upper)
            continue
        if y not in by_y:  # still above the row-data region
            continue
        first = line_words[0]
        if _ROW_START_RE.match(first["text"]) and abs(first["x0"] - sr_x) < 12:
            sr_counter += 1
            current_bundle = {
                "sr_no": sr_counter, "section": current_section,
                "lines": [line_text], "words": list(line_words),
            }
            bundles.append(current_bundle)
        elif current_bundle is not None:
            current_bundle["lines"].append(line_text)
            current_bundle["words"].extend(line_words)

    return current_section, [_bundle_to_row(b) for b in bundles], sr_counter


def _bundle_to_row(bundle: dict[str, Any]) -> HCCauseListPDFRow:
    """Best-effort: case_number = first non-marker token of line 1; raw_text = all lines."""
    raw_text = "\n".join(bundle["lines"])
    first_line_words = sorted(bundle["words"], key=lambda w: w["top"])
    top_y = first_line_words[0]["top"] if first_line_words else 0
    line1 = sorted(
        (w for w in bundle["words"] if abs(w["top"] - top_y) < 5), key=lambda w: w["x0"]
    )
    case_number = ""
    saw_marker = False
    for w in line1:
        if not saw_marker and _ROW_START_RE.match(w["text"]):
            saw_marker = True
            continue
        if saw_marker:
            case_number = w["text"]
            break
    return HCCauseListPDFRow(
        sr_no=bundle["sr_no"], section=bundle["section"],
        case_number=case_number, raw_text=raw_text, parties="", advocates="",
    )
