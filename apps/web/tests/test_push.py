"""F2: web-push subscription endpoints."""
from __future__ import annotations

from nm_core.config import get_settings


def _auth(client, phone="+919100000801"):
    r = client.post("/api/auth/dev-login", json={"phone": phone, "name": "Adv"})
    return {"Authorization": f"Bearer {r.json()['access_token']}"}


def test_vapid_key_empty_by_default(client):
    assert client.get("/api/push/key").json()["public_key"] == ""


def test_vapid_key_exposed_when_set(client, monkeypatch):
    monkeypatch.setattr(get_settings(), "VAPID_PUBLIC_KEY", "the-public-key")
    assert client.get("/api/push/key").json()["public_key"] == "the-public-key"


def test_subscribe_persists(client):
    h = _auth(client, "+919100000802")
    r = client.post(
        "/api/push/subscribe",
        json={"endpoint": "https://push.example/abc", "p256dh": "k", "auth": "a"},
        headers=h,
    )
    assert r.json() == {"ok": True}
    # Idempotent re-subscribe with rotated keys.
    r2 = client.post(
        "/api/push/subscribe",
        json={"endpoint": "https://push.example/abc", "p256dh": "k2", "auth": "a2"},
        headers=h,
    )
    assert r2.json() == {"ok": True}


def test_subscribe_requires_auth(client):
    r = client.post(
        "/api/push/subscribe",
        json={"endpoint": "https://push.example/x", "p256dh": "k", "auth": "a"},
    )
    assert r.status_code == 401
