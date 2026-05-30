"""Web: coupon validate (404 on bad), admin coupon CRUD, referral code endpoint."""
from __future__ import annotations

import uuid
from datetime import UTC, datetime, timedelta

from nm_web.deps import get_db

from nm_core.db.models.user import User


def _auth(client, phone="+919100000911"):
    r = client.post("/api/auth/dev-login", json={"phone": phone, "name": "Adv"})
    return {"Authorization": f"Bearer {r.json()['access_token']}"}, r.json()["user"]["id"]


def _make_admin(client, uid):
    gen = client.app.dependency_overrides[get_db]()
    s = next(gen)
    try:
        s.get(User, uuid.UUID(uid)).is_admin = True
        s.commit()
    finally:
        gen.close()


def test_admin_coupon_crud_and_validate(client):
    h, uid = _auth(client)
    _make_admin(client, uid)
    now = datetime.now(UTC)
    r = client.post("/api/admin/coupons", json={
        "code": "WELCOME10", "discount_percent": 10, "max_uses": 100,
        "valid_from": (now - timedelta(days=1)).isoformat(),
        "valid_until": (now + timedelta(days=30)).isoformat(),
    }, headers=h)
    assert r.status_code == 200 and r.json()["code"] == "WELCOME10"

    listed = client.get("/api/admin/coupons", headers=h).json()["coupons"]
    assert any(c["code"] == "WELCOME10" for c in listed)

    # any authenticated user can validate (preview)
    h2, _ = _auth(client, "+919100000912")
    ok = client.post("/api/billing/validate-coupon", json={"code": "WELCOME10"}, headers=h2)
    assert ok.status_code == 200 and ok.json()["discount_percent"] == 10
    bad = client.post("/api/billing/validate-coupon", json={"code": "NOPE"}, headers=h2)
    assert bad.status_code == 404


def test_coupon_admin_requires_admin(client):
    h, _ = _auth(client, "+919100000913")  # not admin
    assert client.get("/api/admin/coupons", headers=h).status_code == 403


def test_referral_endpoint_returns_code_and_stats(client):
    h, _ = _auth(client, "+919100000914")
    body = client.get("/api/auth/me/referral", headers=h).json()
    assert body["code"] and body["total_referrals"] == 0 and body["rewards_earned"] == 0
    # stable across calls
    assert client.get("/api/auth/me/referral", headers=h).json()["code"] == body["code"]
