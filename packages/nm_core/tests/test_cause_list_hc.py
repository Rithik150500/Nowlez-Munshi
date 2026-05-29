"""HC cause-list parsers: bench sittings (JSON), index (HTML), PDF heuristics."""
from __future__ import annotations

from datetime import date

import pytest

from nm_core.ecourts.cause_list_hc import (
    _bundle_to_row,
    _find_sr_no_anchor,
    _walk_page,
    parse_hc_bench_sittings,
    parse_hc_cause_list_index,
    parse_hc_cause_list_pdf,
)
from nm_core.ecourts.errors import SchemaChanged

SD = date(2026, 6, 1)


# --- bench sittings (JSON) ---
def test_bench_sittings_parsed():
    resp = {"benches": {"benchesStr": "b1~Bench One^b2~Bench Two"}}
    out = parse_hc_bench_sittings(resp, state_code="1", sitting_date=SD)
    assert [(b.code, b.name) for b in out] == [("b1", "Bench One"), ("b2", "Bench Two")]
    assert out[0].sitting_date == SD


@pytest.mark.parametrize("resp", [{"benches": None}, {}, {"benches": {"benchesStr": None}}])
def test_bench_sittings_empty_on_holiday(resp):
    assert parse_hc_bench_sittings(resp, state_code="1", sitting_date=SD) == []


# --- index (HTML) ---
def test_index_parses_pdf_rows():
    html = (
        "<table>"
        "<tr><th>Sr</th><th>Bench</th><th>Type</th><th>View</th></tr>"
        "<tr><td>1</td><td>Bench A</td><td>Daily</td><td><a href='/cl/a.pdf'>view</a></td></tr>"
        "<tr><td>2</td><td>Bench B</td><td>Supp</td><td><a href='/cl/b.pdf'>view</a></td></tr>"
        "<tr><td>x</td><td>junk</td><td>junk</td><td>no link</td></tr>"
        "</table>"
    )
    rows = parse_hc_cause_list_index({"cases": html})
    assert [(r.sr_no, r.bench, r.pdf_url) for r in rows] == [
        (1, "Bench A", "/cl/a.pdf"), (2, "Bench B", "/cl/b.pdf"),
    ]


def test_index_empty_and_schema_guard():
    assert parse_hc_cause_list_index({"cases": ""}) == []
    with pytest.raises(SchemaChanged):
        parse_hc_cause_list_index("not a dict")  # type: ignore[arg-type]


# --- PDF: magic-byte guard ---
def test_pdf_rejects_non_pdf():
    with pytest.raises(SchemaChanged):
        parse_hc_cause_list_pdf(b"   <html>not a pdf</html>")


# --- PDF heuristics, exercised with synthetic pdfplumber word dicts ---
def _w(text: str, x0: float, top: float) -> dict:
    return {"text": text, "x0": x0, "top": top}


def test_explicit_header_anchor():
    words = [_w("S.No.", 10, 10), _w("Case", 50, 10), _w("Party", 100, 10)]
    sr_x, header_y = _find_sr_no_anchor(words)
    assert sr_x == 10 and header_y == 10


def test_implicit_header_anchor_from_first_row_marker():
    # No S.No header; the topmost row-marker line anchors the columns.
    words = [_w("CAUSE LIST", 100, 5), _w("1", 10, 20), _w("WP/1/2026", 50, 20)]
    sr_x, header_y = _find_sr_no_anchor(words)
    assert sr_x == 10 and header_y == 10  # row top (20) minus 10


def test_walk_page_groups_rows_sections_and_trailer():
    words = [
        _w("S.No.", 10, 10), _w("Case", 50, 10),
        _w("1", 10, 30), _w("WP/100/2026", 50, 30), _w("Petitioner", 120, 30),
        _w("Adv.", 50, 40), _w("Kumar", 75, 40),               # continuation of row 1
        _w("LUNCH", 10, 50), _w("MOTION", 45, 50),             # section marker
        _w("2", 10, 60), _w("WP/200/2026", 50, 60),
        _w("ADVOCATES", 10, 80), _w("ON", 60, 80), _w("LEAVE", 80, 80),  # trailer start
        _w("1)", 10, 90), _w("SomeAdvocate", 40, 90),          # trailer noise — ignored
    ]
    _, rows, last_sr = _walk_page(words, sr_x=10, header_y=10, starting_sr=0)
    assert last_sr == 2 and len(rows) == 2
    assert rows[0].sr_no == 1 and rows[0].section == "DEFAULT"
    assert rows[0].case_number == "WP/100/2026"
    assert "Kumar" in rows[0].raw_text  # continuation line aggregated into the bundle
    assert rows[1].sr_no == 2 and rows[1].section == "LUNCH MOTION"
    assert rows[1].case_number == "WP/200/2026"


def test_bundle_to_row_case_number_after_marker():
    bundle = {
        "sr_no": 5, "section": "ADMISSION",
        "lines": ["5 CRL.A/42/2025 State vs X"],
        "words": [_w("5", 10, 30), _w("CRL.A/42/2025", 50, 30), _w("State", 130, 30)],
    }
    row = _bundle_to_row(bundle)
    assert row.case_number == "CRL.A/42/2025" and row.section == "ADMISSION"
