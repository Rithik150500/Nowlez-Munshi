"""POST /api/auth/me/export — GDPR ZIP download + 1/hour rate limit."""
from __future__ import annotations

import io
import zipfile


def _auth(client, phone="+919100000811"):
    r = client.post("/api/auth/dev-login", json={"phone": phone, "name": "Adv"})
    return {"Authorization": f"Bearer {r.json()['access_token']}"}


def test_export_download_then_rate_limited(client):
    h = _auth(client)
    r = client.post("/api/auth/me/export", headers=h)
    assert r.status_code == 200
    assert r.headers["content-type"] == "application/zip"
    names = zipfile.ZipFile(io.BytesIO(r.content)).namelist()
    assert any(n.endswith("/profile.json") for n in names)

    # second call within the hour → 429
    assert client.post("/api/auth/me/export", headers=h).status_code == 429
