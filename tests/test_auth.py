def test_dev_login_then_me(client):
    res = client.post("/auth/dev-login", json={"phone": "+919812345678", "name": "T"})
    assert res.status_code == 200, res.text
    token = res.json()["access_token"]
    assert token

    me = client.get("/me", headers={"Authorization": f"Bearer {token}"})
    assert me.status_code == 200
    assert me.json()["phone"] == "+919812345678"


def test_me_requires_valid_token(client):
    assert client.get("/me").status_code == 401
    assert client.get("/me", headers={"Authorization": "Bearer not-a-jwt"}).status_code == 401
