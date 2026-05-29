"""P2: enforced tier gates + Razorpay webhook upgrade."""
from __future__ import annotations

import hashlib
import hmac
import json
import uuid

from nm_web.deps import get_db

from nm_core.billing import SubscriptionRepository
from nm_core.config import get_settings
from nm_core.ecourts.models import Case as FetchedCase
from nm_core.ecourts.offline import register_offline_case


def _auth(client, phone="+919100000401"):
    r = client.post("/api/auth/dev-login", json={"phone": phone, "name": "Adv"})
    return {"Authorization": f"Bearer {r.json()['access_token']}"}, r.json()["user"]["id"]


def _set_tier(client, account_id, tier):
    gen = client.app.dependency_overrides[get_db]()
    session = next(gen)
    try:
        SubscriptionRepository(session).set_tier(uuid.UUID(account_id), tier)
        session.commit()
    finally:
        gen.close()


def test_billing_reports_enforced(client):
    h, _ = _auth(client)
    body = client.get("/api/billing", headers=h).json()
    assert body["enforced"] is True
    assert body["tier"] == "free"
    assert body["limits"]["max_cases"] == 5


def test_free_tier_case_cap(client):
    h, _ = _auth(client, "+919100000402")
    # free cap is 5 cases; the 6th is rejected with 402.
    def _mk(cnr):
        register_offline_case(cnr, FetchedCase(cnr=cnr, title="A", court="X", stage="S",
                                               next_hearing_date=None, judge="J",
                                               parties=[], orders=[]))

    for i in range(5):
        cnr = f"DLND0100000{i}2024"  # 16 chars
        _mk(cnr)
        assert client.post("/api/cases", json={"cnr": cnr}, headers=h).status_code == 200
    _mk("DLND0100000X2024")
    assert client.post("/api/cases", json={"cnr": "DLND0100000X2024"}, headers=h).status_code == 402


def test_webhook_upgrades_tier(client, monkeypatch):
    monkeypatch.setattr(get_settings(), "RAZORPAY_WEBHOOK_SECRET", "whsec")
    h, _ = _auth(client, "+919100000403")
    account_id = client.get("/api/billing", headers=h).json()["account_id"]

    payload = {"event": "subscription.activated",
               "payload": {"subscription": {"entity": {"notes": {
                   "account_id": account_id, "tier": "advocate"}}}}}
    raw = json.dumps(payload).encode()
    sig = hmac.new(b"whsec", raw, hashlib.sha256).hexdigest()
    r = client.post("/api/billing/webhook", content=raw,
                    headers={"X-Razorpay-Signature": sig, "Content-Type": "application/json"})
    assert r.json() == {"ok": True, "action": "nowlez_tier"}
    assert client.get("/api/billing", headers=h).json()["tier"] == "advocate"


def test_webhook_rejects_bad_signature(client, monkeypatch):
    monkeypatch.setattr(get_settings(), "RAZORPAY_WEBHOOK_SECRET", "whsec")
    r = client.post("/api/billing/webhook", content=b"{}",
                    headers={"X-Razorpay-Signature": "nope"})
    assert r.status_code == 403
