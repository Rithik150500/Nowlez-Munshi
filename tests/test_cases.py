from tests._helpers import make_user_with_cases


def test_cases_list_shows_both_origins(client, db):
    phone = "+919800000001"
    make_user_with_cases(db, phone)

    token = client.post("/auth/dev-login", json={"phone": phone}).json()["access_token"]
    res = client.get("/cases", headers={"Authorization": f"Bearer {token}"})
    assert res.status_code == 200, res.text

    cases = res.json()["cases"]
    assert len(cases) == 2
    # The unification thesis, made visible: one case book, both channels.
    assert {c["added_via"] for c in cases} == {"nowlez", "munshi"}


def test_cases_require_auth(client):
    assert client.get("/cases").status_code == 401
