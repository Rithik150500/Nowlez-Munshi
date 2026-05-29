"""M4a: the /api/auth/link continuity exchange end-to-end."""
from __future__ import annotations

from nm_core.identity import create_link_token


def test_link_exchange_logs_in(client):
    # A user exists (via dev-login), then a WhatsApp-minted link token logs them in.
    import uuid

    body = {"phone": "+919100000093", "name": "Adv"}
    user_id = client.post("/api/auth/dev-login", json=body).json()["user"]["id"]
    token = create_link_token(uuid.UUID(user_id))

    r = client.post("/api/auth/link", json={"token": token})
    assert r.status_code == 200
    access = r.json()["access_token"]
    me = client.get("/api/auth/me", headers={"Authorization": f"Bearer {access}"})
    assert me.json()["id"] == user_id


def test_link_exchange_rejects_garbage(client):
    assert client.post("/api/auth/link", json={"token": "nope"}).status_code == 401
