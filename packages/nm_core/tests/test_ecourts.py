"""eCourts: crypto round-trip, CNR routing, parser, resilience, offline fetch."""
from __future__ import annotations

import pytest

from nm_core.config import get_settings
from nm_core.ecourts import classify_cnr, fetch_case
from nm_core.ecourts.crypto import decrypt_response, encrypt_request
from nm_core.ecourts.errors import CircuitOpen, CNRMalformed, CNRNotFound, CourtSiteDown
from nm_core.ecourts.offline import clear_offline_cases
from nm_core.ecourts.parsers import parse_case_history
from nm_core.ecourts.resilience import reset_registries, with_circuit_breaker, with_retry


@pytest.fixture(autouse=True)
def _clean():
    reset_registries()
    clear_offline_cases()
    yield
    reset_registries()
    clear_offline_cases()


@pytest.fixture
def offline(monkeypatch):
    monkeypatch.setattr(get_settings(), "ECOURTS_OFFLINE", True)


# --- crypto ---
def test_crypto_request_envelope_shape():
    env = encrypt_request({"hello": "world"})
    # random_iv_hex(16) + global_index(1) + base64(...)
    assert len(env) > 17
    assert all(c in "0123456789abcdef" for c in env[:16])
    assert env[16].isdigit()


def test_crypto_response_round_trip():
    # encrypt_request and decrypt_response use different keys (request vs response),
    # so build a response envelope manually via the response key to verify decrypt.
    import base64

    from cryptography.hazmat.primitives import padding
    from cryptography.hazmat.primitives.ciphers import Cipher, algorithms, modes

    from nm_core.ecourts.crypto import RESPONSE_KEY

    iv = bytes.fromhex("00112233445566778899aabbccddeeff")
    plaintext = b'{"status":"Y","token":"t"}'
    padder = padding.PKCS7(128).padder()
    padded = padder.update(plaintext) + padder.finalize()
    enc = Cipher(algorithms.AES(RESPONSE_KEY), modes.CBC(iv)).encryptor()
    ct = enc.update(padded) + enc.finalize()
    envelope = iv.hex() + base64.b64encode(ct).decode()
    assert decrypt_response(envelope) == '{"status":"Y","token":"t"}'


# --- routing ---
def test_classify_district_vs_highcourt():
    assert classify_cnr("DLND010000012024") == "district"
    assert classify_cnr("DLHC010000012024") == "highcourt"


def test_classify_rejects_malformed():
    with pytest.raises(CNRMalformed):
        classify_cnr("nope")
    with pytest.raises(CNRMalformed):
        classify_cnr("ZZND010000012024")  # unknown state code


# --- parser ---
def test_parse_case_history_extracts_fields():
    resp = {
        "history": {
            "cino": "DLND010000012024",
            "pet_name": "Alice",
            "res_name": "State",
            "pet_adv": "Adv. P",
            "date_next_list": "2026-07-15",
            "court_name": "CMM",
            "district_name": "New Delhi",
            "state_name": "Delhi",
            "purpose_name": "Arguments ",
            "desgname": "District Judge-01",
            "act": "<table><tr><td>IPC</td><td>302</td></tr></table>",
            "historyOfCaseHearing": (
                "<table><tr><td>J1</td><td>x</td><td>2026-01-01</td><td>Appearance</td></tr></table>"
            ),
            "interimOrder": (
                "<table><tr><td>1</td><td>2026-01-02</td>"
                "<td><a href='https://x/o.pdf'>view</a></td></tr></table>"
            ),
        }
    }
    case = parse_case_history(resp, cnr="DLND010000012024")
    assert case.title == "Alice vs State"
    assert case.court == "CMM, New Delhi, Delhi"
    assert case.stage == "Arguments"
    assert str(case.next_hearing_date) == "2026-07-15"
    assert case.judge == "District Judge-01"
    assert [p.role for p in case.parties] == ["petitioner", "respondent"]
    assert case.acts[0].act_name == "IPC" and case.acts[0].section == "302"
    assert len(case.history) == 1
    assert case.orders[0].order_url == "https://x/o.pdf"


# --- resilience ---
def test_retry_retries_only_court_site_down():
    calls = {"n": 0}

    @with_retry(max_attempts=3, base_delay=0.0)
    def flaky():
        calls["n"] += 1
        if calls["n"] < 3:
            raise CourtSiteDown("down")
        return "ok"

    assert flaky() == "ok"
    assert calls["n"] == 3


def test_retry_does_not_retry_other_errors():
    calls = {"n": 0}

    @with_retry(max_attempts=3, base_delay=0.0)
    def boom():
        calls["n"] += 1
        raise CNRNotFound("DLND010000012024")

    with pytest.raises(CNRNotFound):
        boom()
    assert calls["n"] == 1


def test_circuit_opens_after_threshold():
    @with_circuit_breaker(name="t", failure_threshold=2, recovery_timeout=60.0)
    def boom():
        raise CourtSiteDown("down")

    for _ in range(2):
        with pytest.raises(CourtSiteDown):
            boom()
    # breaker now open → fast-fail without calling fn
    with pytest.raises(CircuitOpen):
        boom()


# --- offline fetch ---
def test_offline_fetch_returns_case(offline):
    case = fetch_case("DLND010000012024")
    assert case.cnr == "DLND010000012024"
    assert case.orders and case.parties


def test_fetch_validates_cnr_even_offline(offline):
    with pytest.raises(CNRMalformed):
        fetch_case("garbage")
