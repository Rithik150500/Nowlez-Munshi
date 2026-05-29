"""The crown-jewel test: the product thesis as an assertion.

The web door (POST /munshi/ask) and the WhatsApp door (POST /wa/inbound) call
the SAME munshi_core.ask_munshi(), so for the same user + question they return
an identical answer and identical citations. (Deterministic because tests run
the offline extractive path — see conftest.py.)
"""
from tests._helpers import make_user_with_cases


def test_web_and_whatsapp_return_identical_answer(client, db):
    phone = "+919600000001"
    make_user_with_cases(db, phone)
    question = "When is the next hearing in Sharma?"

    token = client.post("/auth/dev-login", json={"phone": phone}).json()["access_token"]
    web = client.post(
        "/munshi/ask",
        json={"question": question},
        headers={"Authorization": f"Bearer {token}"},
    ).json()

    wa = client.post("/wa/inbound", json={"from": phone, "text": question}).json()

    assert wa["matched"] is True
    assert wa["answer"] == web["answer"]
    assert [c["cnr"] for c in wa["citations"]] == [c["cnr"] for c in web["citations"]]


def test_whatsapp_unknown_sender_is_handled(client):
    res = client.post("/wa/inbound", json={"from": "+910000000000", "text": "hi"})
    assert res.status_code == 200
    body = res.json()
    assert body["matched"] is False
    assert "register" in body["reply"].lower()
