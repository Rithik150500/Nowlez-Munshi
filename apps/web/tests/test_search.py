"""F1: eCourts search endpoints (offline), gated behind the `search` feature."""
from __future__ import annotations

import uuid

from nm_web.deps import get_db

from nm_core.billing import SubscriptionRepository


def _auth(client, phone="+919100000501"):
    r = client.post("/api/auth/dev-login", json={"phone": phone, "name": "Adv"})
    return {"Authorization": f"Bearer {r.json()['access_token']}"}


def _set_tier(client, account_id, tier):
    gen = client.app.dependency_overrides[get_db]()
    session = next(gen)
    try:
        SubscriptionRepository(session).set_tier(uuid.UUID(account_id), tier)
        session.commit()
    finally:
        gen.close()


def test_search_requires_paid_plan(client):
    h = _auth(client, "+919100000502")
    assert client.get("/api/search/states", headers=h).status_code == 402


def test_search_party_flow(client):
    h = _auth(client, "+919100000503")
    account_id = client.get("/api/billing", headers=h).json()["account_id"]
    _set_tier(client, account_id, "advocate")

    states = client.get("/api/search/states", headers=h).json()["states"]
    assert states
    sc = states[0]["code"]
    districts = client.get(f"/api/search/districts?state_code={sc}", headers=h).json()["districts"]
    dc = districts[0]["code"]

    r = client.get(
        f"/api/search/party?state_code={sc}&district_code={dc}"
        f"&court_code_arr=1&name=Sharma&year=2024",
        headers=h,
    )
    assert r.status_code == 200
    results = r.json()["results"]
    assert results and "Sharma" in results[0]["title"]
    # The result CNR is trackable into the case book.
    assert client.post("/api/cases", json={"cnr": results[0]["cnr"]}, headers=h).status_code == 200
