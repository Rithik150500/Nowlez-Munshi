"""M4e: profile (name/locale) update + onboarding flag."""
from __future__ import annotations


def _auth(client):
    r = client.post("/api/auth/dev-login", json={"phone": "+919100000211", "name": "Adv"})
    return {"Authorization": f"Bearer {r.json()['access_token']}"}


def test_me_starts_not_onboarded(client):
    h = _auth(client)
    assert client.get("/api/auth/me", headers=h).json()["onboarded"] is False


def test_update_locale_and_onboard(client):
    h = _auth(client)
    r = client.put("/api/auth/me", json={"locale": "hi"}, headers=h)
    assert r.status_code == 200 and r.json()["locale"] == "hi"
    assert client.put("/api/auth/me", json={"locale": "fr"}, headers=h).status_code == 422

    me = client.post("/api/auth/me/onboarded", headers=h).json()
    assert me["onboarded"] is True
