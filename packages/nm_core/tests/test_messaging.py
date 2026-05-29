"""Messaging: Meta client (respx), webhook verify/parse, idempotency, dedup, send."""
from __future__ import annotations

import hashlib
import hmac
import json

import fakeredis
import httpx
import pytest
import respx

from nm_core.config import get_settings
from nm_core.db.models.messaging import OutboundMessage
from nm_core.identity.repositories import UserRepository
from nm_core.messaging import (
    MetaClient,
    claim_inbound,
    parse_incoming,
    parse_status_updates,
    redis_dedup,
    send_text,
    verify_signature,
)
from nm_core.messaging.errors import Meta24HourWindowExpired, MetaInvalidMessage, MetaTransientError
from nm_core.messaging.idempotency import claim_daily_slot

GRAPH = "https://graph.facebook.com/v21.0/PNID/messages"


@pytest.fixture
def client():
    return MetaClient(phone_number_id="PNID", access_token="tok")


@pytest.fixture(autouse=True)
def fake_redis(monkeypatch):
    fake = fakeredis.FakeStrictRedis()
    monkeypatch.setattr(redis_dedup, "_client", fake)
    yield fake
    monkeypatch.setattr(redis_dedup, "_client", None)


# --- Meta client ---
@respx.mock
def test_send_text_returns_wamid(client):
    respx.post(GRAPH).mock(return_value=httpx.Response(200, json={"messages": [{"id": "wamid.1"}]}))
    assert client.send_text("+9199", "hi") == "wamid.1"


@respx.mock
def test_send_5xx_is_transient(client):
    respx.post(GRAPH).mock(return_value=httpx.Response(503, text="down"))
    with pytest.raises(MetaTransientError):
        client.send_text("+9199", "hi")


@respx.mock
def test_send_24h_window(client):
    respx.post(GRAPH).mock(
        return_value=httpx.Response(400, json={"error": {"code": 131047, "message": "window"}})
    )
    with pytest.raises(Meta24HourWindowExpired):
        client.send_text("+9199", "hi")


@respx.mock
def test_send_invalid(client):
    respx.post(GRAPH).mock(
        return_value=httpx.Response(400, json={"error": {"code": 100, "message": "bad"}})
    )
    with pytest.raises(MetaInvalidMessage):
        client.send_text("+9199", "hi")


@respx.mock
def test_template_sanitizes_placeholders(client):
    route = respx.post(GRAPH).mock(
        return_value=httpx.Response(200, json={"messages": [{"id": "wamid.t"}]})
    )
    client.send_template(to="+9199", name="t", language="en", body_variables=["{{1}} evil"])
    sent = json.loads(route.calls[0].request.content)
    assert sent["template"]["components"][0]["parameters"][0]["text"] == "{ {1} } evil"


# --- webhook ---
def test_verify_signature_roundtrip():
    body = b'{"x":1}'
    sig = "sha256=" + hmac.new(b"secret", body, hashlib.sha256).hexdigest()
    assert verify_signature(body, sig, "secret") is True
    assert verify_signature(body, sig, "wrong") is False
    assert verify_signature(body, None, "secret") is False


def test_parse_incoming_text_and_button():
    payload = {
        "entry": [
            {
                "changes": [
                    {
                        "value": {
                            "messages": [
                                {"id": "m1", "from": "9199", "timestamp": "1", "type": "text",
                                 "text": {"body": "DLND010000012024"}},
                                {"id": "m2", "from": "+9188", "timestamp": "2", "type": "button",
                                 "button": {"payload": "SAVE", "text": "Save"}},
                            ]
                        }
                    }
                ]
            }
        ]
    }
    msgs = parse_incoming(payload)
    assert msgs[0].from_phone == "+9199" and msgs[0].text == "DLND010000012024"
    assert msgs[1].button_payload == "SAVE"


def test_parse_status_updates():
    payload = {
        "entry": [{"changes": [{"value": {"statuses": [
            {"id": "m1", "recipient_id": "9199", "status": "delivered", "timestamp": "3"}
        ]}}]}]
    }
    st = parse_status_updates(payload)
    assert st[0].status == "delivered"


# --- idempotency ---
def test_claim_inbound_dedup(db_session):
    assert claim_inbound(db_session, meta_message_id="wamid.x") is True
    assert claim_inbound(db_session, meta_message_id="wamid.x") is False


def test_claim_daily_slot(db_session):
    from datetime import date

    user, _ = UserRepository(db_session).get_or_create_by_phone(phone="+919100000009")
    day = date(2026, 5, 29)
    assert claim_daily_slot(
        db_session, user_id=user.id, template_name="digest", send_date_ist=day, to_phone="+91"
    ) is True
    assert claim_daily_slot(
        db_session, user_id=user.id, template_name="digest", send_date_ist=day, to_phone="+91"
    ) is False


# --- send orchestration ---
@respx.mock
def test_send_text_dedups(db_session):
    respx.post(GRAPH).mock(return_value=httpx.Response(200, json={"messages": [{"id": "wamid.s"}]}))
    monkey_client = MetaClient(phone_number_id="PNID", access_token="tok")
    first = send_text(
        db_session, to_phone="+9199", body="alert", dedup_key="u:c:status:2026-05-29",
        client=monkey_client,
    )
    second = send_text(
        db_session, to_phone="+9199", body="alert", dedup_key="u:c:status:2026-05-29",
        client=monkey_client,
    )
    assert first == "wamid.s"
    assert second is None  # deduped
    logged = db_session.query(OutboundMessage).all()
    assert len(logged) == 1


@respx.mock
def test_send_text_kill_switch(db_session, monkeypatch):
    monkeypatch.setattr(get_settings(), "WHATSAPP_DISABLED", True)
    assert send_text(db_session, to_phone="+9199", body="x") is None
