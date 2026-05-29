"""D3: user file upload → store → extract (DOCX) → AI summary; Munshi can read it."""
from __future__ import annotations

import io

from nm_core.config import get_settings


def _auth(client):
    r = client.post("/api/auth/dev-login", json={"phone": "+919100000311", "name": "Adv"})
    return {"Authorization": f"Bearer {r.json()['access_token']}"}


def _docx_bytes(text: str) -> bytes:
    import docx

    d = docx.Document()
    d.add_paragraph(text)
    buf = io.BytesIO()
    d.save(buf)
    return buf.getvalue()


def test_upload_docx_extracts_and_summarizes(client, monkeypatch, tmp_path):
    monkeypatch.setattr(get_settings(), "STORAGE_DIR", str(tmp_path))
    monkeypatch.setattr(get_settings(), "GEMINI_API_KEY", "")  # offline summary
    h = _auth(client)
    content = _docx_bytes("The petitioner seeks anticipatory bail under section 438.")
    r = client.post(
        "/api/documents/upload",
        files={"file": ("petition.docx", content,
                        "application/vnd.openxmlformats-officedocument.wordprocessingml.document")},
        headers=h,
    )
    assert r.status_code == 200
    body = r.json()
    assert body["status"] == "processed"
    assert "anticipatory bail" in body["summary"]

    # The uploaded doc appears in the document list.
    docs = client.get("/api/documents", headers=h).json()["documents"]
    assert any(d["title"] == "petition.docx" for d in docs)
