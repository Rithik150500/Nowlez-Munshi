"""GET /api/library/search — universal search endpoint (billing-gated)."""
from __future__ import annotations

import uuid

from nm_web.deps import get_db

from nm_core.billing import SubscriptionRepository
from nm_core.ecourts.models import Case as FetchedCase
from nm_core.ecourts.offline import register_offline_case

CNR = "DLND010000012024"


def _auth(client, phone="+919100000501"):
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


def test_search_requires_paid_plan(client):
    h, _ = _auth(client)
    # free tier lacks the `search` feature → 402
    assert client.get("/api/library/search?q=anything", headers=h).status_code == 402


def test_search_returns_own_cases(client):
    h, _ = _auth(client, "+919100000502")
    account_id = client.get("/api/billing", headers=h).json()["account_id"]
    _set_tier(client, account_id, "advocate")  # grants `search`

    register_offline_case(CNR, FetchedCase(
        cnr=CNR, title="Mehta vs State", court="HC Delhi", stage="Admission",
        next_hearing_date=None, judge="J", parties=[], orders=[]))
    client.post("/api/cases", json={"cnr": CNR}, headers=h)

    body = client.get("/api/library/search?q=mehta", headers=h).json()
    assert body["query"] == "mehta"
    assert any(r["kind"] == "case" and "Mehta" in r["title"] for r in body["results"])
