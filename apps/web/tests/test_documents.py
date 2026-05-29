"""M4i: document create/list/editor/content/callback (no live Document Server)."""
from __future__ import annotations

import io
import zipfile

import respx
from httpx import Response

from nm_core.config import get_settings


def _auth(client):
    r = client.post("/api/auth/dev-login", json={"phone": "+919100000161", "name": "Adv"})
    return {"Authorization": f"Bearer {r.json()['access_token']}"}


def test_create_list_and_content(client, monkeypatch, tmp_path):
    monkeypatch.setattr(get_settings(), "STORAGE_DIR", str(tmp_path))
    monkeypatch.setattr(get_settings(), "WEB_BASE_URL", "http://web")
    h = _auth(client)

    doc = client.post("/api/documents", json={"title": "Bail Application"}, headers=h).json()
    assert doc["title"] == "Bail Application"

    docs = client.get("/api/documents", headers=h).json()["documents"]
    assert [d["id"] for d in docs] == [doc["id"]]

    ed = client.get(f"/api/documents/{doc['id']}/editor", headers=h).json()
    url = ed["config"]["document"]["url"]  # /content?token=...
    token = url.split("token=")[1]

    # content endpoint serves a valid docx with the doc token
    content = client.get(f"/api/documents/{doc['id']}/content?token={token}")
    assert content.status_code == 200
    with zipfile.ZipFile(io.BytesIO(content.content)) as z:
        assert "word/document.xml" in z.namelist()

    # bad token rejected
    assert client.get(f"/api/documents/{doc['id']}/content?token=nope").status_code == 403


@respx.mock
def test_callback_saves(client, monkeypatch, tmp_path):
    monkeypatch.setattr(get_settings(), "STORAGE_DIR", str(tmp_path))
    monkeypatch.setattr(get_settings(), "WEB_BASE_URL", "http://web")
    monkeypatch.setattr(get_settings(), "ONLYOFFICE_JWT_SECRET", "")
    h = _auth(client)
    doc = client.post("/api/documents", json={"title": "Draft"}, headers=h).json()
    ed = client.get(f"/api/documents/{doc['id']}/editor", headers=h).json()
    token = ed["config"]["document"]["url"].split("token=")[1]

    respx.get("http://docserver/edited.docx").mock(return_value=Response(200, content=b"NEWBYTES"))
    r = client.post(
        f"/api/documents/{doc['id']}/callback?token={token}",
        json={"status": 2, "url": "http://docserver/edited.docx"},
    )
    assert r.json() == {"error": 0}
    # the new bytes were stored
    content = client.get(f"/api/documents/{doc['id']}/content?token={token}")
    assert content.content == b"NEWBYTES"
