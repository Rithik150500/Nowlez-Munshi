"""F1: eCourts search facade (offline) + QR-CNR decode + image webhook parsing."""
from __future__ import annotations

import pytest

from nm_core.config import get_settings
from nm_core.ecourts import client as ecourts
from nm_core.ecourts.routing import classify_cnr
from nm_core.messaging import qr
from nm_core.messaging.webhook import parse_incoming


@pytest.fixture
def offline(monkeypatch):
    monkeypatch.setattr(get_settings(), "ECOURTS_OFFLINE", True)


def test_dropdowns_offline(offline):
    states = ecourts.list_states()
    assert states and states[0].code
    districts = ecourts.list_districts(states[0].code)
    assert districts
    complexes = ecourts.list_court_complexes(state_code="1", district_code=districts[0].code)
    assert complexes and complexes[0].est_code


def test_search_party_returns_trackable_stubs(offline):
    rows = ecourts.search_party(
        state_code="1", district_code="1", court_code_arr="1", party_name="Sharma", year=2024
    )
    assert rows
    for r in rows:
        assert "Sharma" in r.title
        # Each stub CNR must be a valid, fetchable CNR.
        assert classify_cnr(r.cnr) in ("district", "highcourt")


def test_search_case_number_offline(offline):
    rows = ecourts.search_case_number(
        state_code="1", district_code="1", court_code_arr="1",
        case_type="CC", case_number="42", year=2024,
    )
    assert len(rows) == 1
    assert classify_cnr(rows[0].cnr)


# --- QR decode ---
def test_qr_extracts_cnr_from_payload(monkeypatch):
    monkeypatch.setattr(qr, "_decode_qr_payloads", lambda data: ["CNR: DLND010000012024 etc"])
    assert qr.decode_cnr_from_image(b"x") == "DLND010000012024"


def test_qr_none_when_no_code(monkeypatch):
    monkeypatch.setattr(qr, "_decode_qr_payloads", lambda data: [])
    assert qr.decode_cnr_from_image(b"x") is None


def test_qr_missing_native_lib_degrades(monkeypatch):
    # The lazy import path returns [] when pyzbar/zbar is unavailable.
    assert qr.decode_cnr_from_image(b"not an image") is None


# --- image webhook parsing ---
def test_parse_image_message_captures_media_id():
    payload = {
        "entry": [
            {"changes": [{"value": {"messages": [
                {"id": "wamid.1", "from": "919100000099", "timestamp": "1700000000",
                 "type": "image", "image": {"id": "media-123", "caption": "my case"}}
            ]}}]}
        ]
    }
    msgs = parse_incoming(payload)
    assert len(msgs) == 1
    assert msgs[0].type == "image"
    assert msgs[0].media_id == "media-123"
    assert msgs[0].text == "my case"
