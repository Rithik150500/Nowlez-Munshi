"""Web teams: personal account, invite, shared case book, RBAC."""
from __future__ import annotations

CNR = "DLND010000012024"


def _auth(client, phone, name="Adv"):
    r = client.post("/api/auth/dev-login", json={"phone": phone, "name": name})
    return {"Authorization": f"Bearer {r.json()['access_token']}"}, r.json()["user"]["id"]


def test_personal_account_listed(client):
    h, _ = _auth(client, "+919100000111")
    accounts = client.get("/api/accounts", headers=h).json()["accounts"]
    assert len(accounts) == 1 and accounts[0]["is_personal"] and accounts[0]["role"] == "owner"


def test_invite_and_shared_case_book(client):
    owner_h, _ = _auth(client, "+919100000112", "Owner")
    junior_h, junior_id = _auth(client, "+919100000113", "Junior")

    # owner tracks a case
    client.post("/api/cases", json={"cnr": CNR}, headers=owner_h)
    # junior can't see it yet
    assert client.get("/api/cases", headers=junior_h).json()["cases"] == []

    # owner creates a chamber and invites junior
    acc = client.post("/api/accounts", json={"name": "Chamber"}, headers=owner_h).json()
    inv = client.post(
        f"/api/accounts/{acc['id']}/members",
        json={"phone": "+919100000113", "role": "editor"},
        headers=owner_h,
    )
    assert inv.status_code == 200

    # now junior sees the owner's case in the shared book, flagged not-mine
    cases = client.get("/api/cases", headers=junior_h).json()["cases"]
    assert [c["cnr"] for c in cases] == [CNR]
    assert cases[0]["mine"] is False


def test_cannot_remove_last_owner(client):
    owner_h, owner_id = _auth(client, "+919100000117", "Owner")
    acc = client.post("/api/accounts", json={"name": "Solo"}, headers=owner_h).json()
    r = client.delete(f"/api/accounts/{acc['id']}/members/{owner_id}", headers=owner_h)
    assert r.status_code == 400


def test_invite_requires_owner(client):
    owner_h, _ = _auth(client, "+919100000114", "Owner")
    viewer_h, _ = _auth(client, "+919100000115", "Viewer")
    acc = client.post("/api/accounts", json={"name": "C"}, headers=owner_h).json()
    client.post(
        f"/api/accounts/{acc['id']}/members",
        json={"phone": "+919100000115", "role": "viewer"},
        headers=owner_h,
    )
    # viewer cannot invite
    r = client.post(
        f"/api/accounts/{acc['id']}/members",
        json={"phone": "+919100000116", "role": "viewer"},
        headers=viewer_h,
    )
    assert r.status_code == 403
