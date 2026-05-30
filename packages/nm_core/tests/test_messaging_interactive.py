"""Interactive (buttons/list) + document upload→send primitives (respx)."""
from __future__ import annotations

import json

import httpx
import pytest
import respx

from nm_core.messaging import MetaClient
from nm_core.messaging.errors import MetaTransientError

MESSAGES = "https://graph.facebook.com/v21.0/PNID/messages"
MEDIA = "https://graph.facebook.com/v21.0/PNID/media"


@pytest.fixture
def client():
    return MetaClient(phone_number_id="PNID", access_token="tok")


@respx.mock
def test_interactive_buttons_payload_and_caps(client):
    route = respx.post(MESSAGES).mock(
        return_value=httpx.Response(200, json={"messages": [{"id": "wamid.b"}]})
    )
    wamid = client.send_interactive_buttons(
        to="+9199",
        body="Pick one",
        buttons=[
            {"id": "a", "title": "This title is way over twenty chars"},
            {"id": "b", "title": "Two"},
            {"id": "c", "title": "Three"},
            {"id": "d", "title": "Four — should be dropped"},
        ],
    )
    assert wamid == "wamid.b"
    sent = json.loads(route.calls[0].request.content)
    action = sent["interactive"]["action"]["buttons"]
    assert sent["interactive"]["type"] == "button"
    assert len(action) == 3  # capped at 3
    assert action[0]["reply"]["title"] == "This title is way ov"  # capped at 20 chars
    assert len(action[0]["reply"]["title"]) == 20


@respx.mock
def test_interactive_list_payload_and_caps(client):
    route = respx.post(MESSAGES).mock(
        return_value=httpx.Response(200, json={"messages": [{"id": "wamid.l"}]})
    )
    rows = [{"id": f"r{i}", "title": f"Row {i}", "description": "d"} for i in range(12)]
    client.send_interactive_list(to="+9199", body="Choose", button_label="Open", rows=rows)
    sent = json.loads(route.calls[0].request.content)
    section_rows = sent["interactive"]["action"]["sections"][0]["rows"]
    assert sent["interactive"]["type"] == "list"
    assert sent["interactive"]["action"]["button"] == "Open"
    assert len(section_rows) == 10  # capped at 10
    assert section_rows[0] == {"id": "r0", "title": "Row 0", "description": "d"}


@respx.mock
def test_upload_media_returns_id(client):
    route = respx.post(MEDIA).mock(return_value=httpx.Response(200, json={"id": "media-123"}))
    media_id = client.upload_media(content=b"%PDF-1", filename="o.pdf", mime_type="application/pdf")
    assert media_id == "media-123"
    # multipart upload carries the product + type form fields
    assert b"whatsapp" in route.calls[0].request.content


@respx.mock
def test_send_document_payload(client):
    route = respx.post(MESSAGES).mock(
        return_value=httpx.Response(200, json={"messages": [{"id": "wamid.d"}]})
    )
    client.send_document(to="+9199", media_id="media-123", filename="order.pdf", caption="Order")
    sent = json.loads(route.calls[0].request.content)
    assert sent["type"] == "document"
    assert sent["document"] == {"id": "media-123", "filename": "order.pdf", "caption": "Order"}


@respx.mock
def test_send_document_from_bytes_uploads_then_sends(client):
    media_route = respx.post(MEDIA).mock(
        return_value=httpx.Response(200, json={"id": "media-xyz"})
    )
    msg_route = respx.post(MESSAGES).mock(
        return_value=httpx.Response(200, json={"messages": [{"id": "wamid.z"}]})
    )
    wamid = client.send_document_from_bytes(to="+9199", content=b"%PDF", filename="a.pdf")
    assert wamid == "wamid.z"
    assert media_route.called and msg_route.called
    sent = json.loads(msg_route.calls[0].request.content)
    assert sent["document"]["id"] == "media-xyz"


@respx.mock
def test_send_document_too_large_is_skipped(client, tmp_path, monkeypatch):
    """A document over Meta's 16 MB ceiling is logged failed, not uploaded."""
    from nm_core import storage
    from nm_core.messaging import send as send_mod

    monkeypatch.setattr(storage, "get_storage", lambda: storage.LocalStorage(str(tmp_path)))
    monkeypatch.setattr(send_mod, "get_storage", storage.get_storage)
    key = "big.pdf"
    storage.get_storage().put(key, b"x" * (17 * 1024 * 1024))
    media_route = respx.post(MEDIA).mock(return_value=httpx.Response(200, json={"id": "m"}))

    class _Sess:
        def add(self, *_a, **_k): ...
        def flush(self): ...

    wamid = send_mod._deliver_document(
        _Sess(), to_phone="+9199", storage_key=key, filename="big.pdf", client=client
    )
    assert wamid is None
    assert not media_route.called  # never attempted the upload


@respx.mock
def test_error_text_scrubs_bearer_token(client):
    # Meta sometimes echoes the Authorization header in error bodies; the raised
    # exception must not leak the token.
    respx.post(MESSAGES).mock(
        return_value=httpx.Response(500, text="auth failed: Bearer tok was rejected")
    )
    with pytest.raises(MetaTransientError) as exc:
        client.send_text("+9199", "hi")
    assert "tok" not in str(exc.value)
    assert "<redacted>" in str(exc.value)


def test_document_send_skips_opted_out_user(tmp_path, monkeypatch, client):
    """Proactive document delivery honors a DPDP opt-out at the boundary (B4)."""
    # in-memory DB session
    import sqlite3
    import uuid as _uuid

    from sqlalchemy import create_engine
    from sqlalchemy.orm import sessionmaker

    from nm_core import consent, storage
    from nm_core.db import models  # noqa: F401
    from nm_core.db.base import Base
    from nm_core.identity.repositories import UserRepository
    from nm_core.messaging import send as send_mod
    sqlite3.register_adapter(_uuid.UUID, str)
    eng = create_engine("sqlite:///:memory:", connect_args={"check_same_thread": False})
    Base.metadata.create_all(eng)
    s = sessionmaker(bind=eng)()

    monkeypatch.setattr(storage, "get_storage", lambda: storage.LocalStorage(str(tmp_path)))
    monkeypatch.setattr(send_mod, "get_storage", storage.get_storage)
    storage.get_storage().put("o.pdf", b"%PDF small")

    user, _ = UserRepository(s).get_or_create_by_phone(phone="+919100000999")
    consent.set_opt_out(s, user=user, opted_out=True)
    wamid = send_mod._deliver_document(
        s, to_phone=user.phone, storage_key="o.pdf", filename="o.pdf",
        user_id=user.id, client=client)
    assert wamid is None  # suppressed for the opted-out user
