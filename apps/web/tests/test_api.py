"""Web API: auth, the case book, refresh + change surfacing, notifications."""
from __future__ import annotations

CNR = "DLND010000012024"


def _auth(client) -> dict:
    r = client.post("/api/auth/dev-login", json={"phone": "+919100000061", "name": "Adv"})
    assert r.status_code == 200
    return {"Authorization": f"Bearer {r.json()['access_token']}"}


def test_health(client):
    assert client.get("/api/health").json()["status"] == "ok"


def test_requires_auth(client):
    assert client.get("/api/cases").status_code == 401


def test_me(client):
    h = _auth(client)
    assert client.get("/api/auth/me", headers=h).json()["name"] == "Adv"


def test_add_list_get_delete_case(client):
    h = _auth(client)
    add = client.post("/api/cases", json={"cnr": CNR}, headers=h)
    assert add.status_code == 200
    assert add.json()["cnr"] == CNR
    assert add.json()["added_via"] == "web"

    lst = client.get("/api/cases", headers=h).json()["cases"]
    assert [c["cnr"] for c in lst] == [CNR]

    detail = client.get(f"/api/cases/{CNR}", headers=h).json()
    assert "orders" in detail and "parties" in detail

    assert client.delete(f"/api/cases/{CNR}", headers=h).status_code == 200
    assert client.get(f"/api/cases/{CNR}", headers=h).status_code == 404


def test_add_malformed_cnr_422(client):
    h = _auth(client)
    assert client.post("/api/cases", json={"cnr": "nope"}, headers=h).status_code == 422


def test_prefs_update(client):
    h = _auth(client)
    client.post("/api/cases", json={"cnr": CNR}, headers=h)
    r = client.put(f"/api/cases/{CNR}/prefs", json={"alert_level": "orders_only"}, headers=h)
    assert r.status_code == 200 and r.json()["alert_level"] == "orders_only"
    bad = client.put(f"/api/cases/{CNR}/prefs", json={"alert_level": "nonsense"}, headers=h)
    assert bad.status_code == 422


def test_refresh_surfaces_changes_and_notifications(client):
    from nm_core.ecourts.models import Case as FetchedCase
    from nm_core.ecourts.offline import register_offline_case

    h = _auth(client)
    register_offline_case(
        CNR,
        FetchedCase(
            cnr=CNR, title="A vs B", court="X", stage="Appearance",
            next_hearing_date=None, judge="J", parties=[], orders=[],
        ),
    )
    client.post("/api/cases", json={"cnr": CNR}, headers=h)
    register_offline_case(
        CNR,
        FetchedCase(
            cnr=CNR, title="A vs B", court="X", stage="Arguments",
            next_hearing_date=None, judge="J", parties=[], orders=[],
        ),
    )
    r = client.post(f"/api/cases/{CNR}/refresh", headers=h).json()
    assert [c["type"] for c in r["changes"]] == ["status_change"]
    notifs = client.get("/api/notifications", headers=h).json()["notifications"]
    assert len(notifs) == 1 and notifs[0]["type"] == "status_change"
