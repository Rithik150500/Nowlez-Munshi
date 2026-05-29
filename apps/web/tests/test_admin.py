"""M4h: admin overview is gated by is_admin."""
from __future__ import annotations

import uuid

from nm_web.deps import get_db

from nm_core.identity.repositories import UserRepository


def _auth(client, phone):
    r = client.post("/api/auth/dev-login", json={"phone": phone, "name": "X"})
    return {"Authorization": f"Bearer {r.json()['access_token']}"}, r.json()["user"]["id"]


def _promote(client, user_id):
    gen = client.app.dependency_overrides[get_db]()
    session = next(gen)
    try:
        UserRepository(session).get_by_id(uuid.UUID(user_id)).is_admin = True
        session.commit()
    finally:
        gen.close()


def test_admin_forbidden_for_normal_user(client):
    h, _ = _auth(client, "+919100000141")
    assert client.get("/api/admin/overview", headers=h).status_code == 403


def test_admin_overview_for_admin(client):
    h, uid = _auth(client, "+919100000142")
    _promote(client, uid)
    r = client.get("/api/admin/overview", headers=h)
    assert r.status_code == 200
    body = r.json()
    assert body["users"] >= 1
    assert "metrics" in body and "refresh_lag_seconds" in body


def test_health_deep_check(client):
    body = client.get("/api/health").json()
    assert body["status"] == "ok" and body["db"] is True
