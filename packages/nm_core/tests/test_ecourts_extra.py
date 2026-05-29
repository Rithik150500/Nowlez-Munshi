"""D1: search / dropdown / cause-list / daily-business parsers (recorded fixtures)."""
from __future__ import annotations

from datetime import date

import pytest

from nm_core.ecourts import extra_parsers as xp
from nm_core.ecourts.errors import SchemaChanged


def test_party_search_flattens_establishments():
    resp = {
        "no_of_establishments": 1,
        "0": {
            "establishment_name": "CMM Court, Delhi",
            "caseNos": [
                {"cino": "DLND010000012024", "pet_name": "Alice", "res_name": "State",
                 "case_no": "200400000672025", "reg_year": "2024"},
                {"cino": "", "pet_name": "skip"},  # no cino → dropped
            ],
        },
    }
    stubs = xp.parse_party_search(resp)
    assert len(stubs) == 1
    assert stubs[0].cnr == "DLND010000012024"
    assert stubs[0].title == "Alice vs State"
    assert stubs[0].filing_year == 2024
    assert stubs[0].court == "CMM Court, Delhi"


def test_states_list_and_dict_shapes():
    as_list = {"states": [{"state_code": "7", "state_name": "Delhi", "nationalstate_code": "DL"}]}
    as_dict = {"states": {"7": {"state_code": "7", "state_name": "Delhi",
                                "nationalstate_code": "DL"}}}
    for resp in (as_list, as_dict):
        states = xp.parse_states(resp)
        assert states[0].code == "7" and states[0].national_code == "DL"


def test_states_hidden_rows_dropped():
    resp = {"states": [{"state_code": "9", "state_name": "X", "display": "N"}]}
    assert xp.parse_states(resp) == []


def test_states_schema_changed_on_bad_shape():
    with pytest.raises(SchemaChanged):
        xp.parse_states({"states": "nonsense"})


def test_case_types_hash_list():
    resp = {"case_types": [{"case_type": "11~HMA - HINDU MARRIAGE ACT#5~CS - CIVIL SUIT"}]}
    types = xp.parse_case_types(resp, court_code="1")
    assert {t.code for t in types} == {"11", "5"}
    assert types[0].name.startswith("HMA")


def test_police_stations_hash_list_with_uniform():
    resp = {"police_stationlist": [
        {"police_station": "1~Connaught Place#2~Karol Bagh", "uniform_code": {"1": "101"}}
    ]}
    stations = xp.parse_police_stations(resp, district_code="1", court_code="1")
    assert {s.code for s in stations} == {"1", "2"}
    assert next(s for s in stations if s.code == "1").uniform_code == 101


def test_cause_list_parses_entries_and_section():
    html = (
        "<div id='table_heading'><center><center>Sh. J. Singh<br/>District Judge</center>"
        "Civil Cases Listed on&nbsp;14-07-2025</center></div>"
        "<table><tbody>"
        "<tr><td colspan='4'>Final Disposal</td></tr>"
        "<tr><td>1</td>"
        "<td>&nbsp;<a class='x' court_code='1' case_no='200400000672025' cino='dlnd010000012024'>"
        "CS/67/2025</a><br/>14-07-2025</td>"
        "<td>JASMOHAN<br/>versus<br/>NDMC</td><td>VASU DEV</td></tr>"
        "</tbody></table>"
    )
    cl = xp.parse_cause_list(
        {"cases": html}, state_code="7", district_code="1", court_code="1",
        court_no="1", list_date=date(2025, 7, 14), flag="civ_t",
    )
    assert cl.judge == "Sh. J. Singh"
    assert len(cl.entries) == 1
    e = cl.entries[0]
    assert e.case_number == "200400000672025"
    assert e.cnr == "DLND010000012024"
    assert e.section == "Final Disposal"
    assert e.listed_on == date(2025, 7, 14)


def test_cause_list_empty_when_no_html():
    cl = xp.parse_cause_list(
        {"cases": False}, state_code="7", district_code="1", court_code="1",
        court_no="1", list_date=date(2025, 7, 14), flag="civ_t",
    )
    assert cl.entries == []


def test_daily_business_extracts_text_and_next_date():
    html = (
        "<table>"
        "<tr><td>Business Details</td><td>Arguments heard. Adjourned.</td></tr>"
        "<tr><td>Next Hearing Date</td><td>15-08-2025</td></tr>"
        "<tr><td>Next Purpose</td><td>Judgment</td></tr>"
        "</table>"
    )
    db = xp.parse_daily_business({"viewBusiness": html}, cnr="DLND010000012024",
                                 business_date=date(2025, 7, 14))
    assert "Adjourned" in db.business_text
    assert db.next_hearing_date == date(2025, 8, 15)
    assert db.next_purpose == "Judgment"


def test_daily_business_schema_changed_when_empty():
    with pytest.raises(SchemaChanged):
        xp.parse_daily_business({}, cnr="X", business_date=date(2025, 7, 14))
