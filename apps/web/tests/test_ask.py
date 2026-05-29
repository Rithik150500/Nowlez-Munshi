"""AI ask endpoint + the cross-channel parity guarantee (web == WhatsApp)."""
from __future__ import annotations

from datetime import date

from nm_core.config import get_settings
from nm_core.ecourts.models import Case as FetchedCase
from nm_core.ecourts.models import OrderRef, Party
from nm_core.ecourts.offline import register_offline_case
from nm_core.identity.repositories import UserRepository

CNR = "DLND010000012024"


def _auth(client) -> dict:
    r = client.post("/api/auth/dev-login", json={"phone": "+919100000081", "name": "Adv"})
    return {"Authorization": f"Bearer {r.json()['access_token']}"}


def test_ask_endpoint(client):
    h = _auth(client)
    client.post("/api/cases", json={"cnr": CNR}, headers=h)
    r = client.post("/api/ask", json={"question": "what cases am I tracking?"}, headers=h)
    assert r.status_code == 200
    assert CNR in r.json()["answer"]
    assert r.json()["mode"] == "offline"
    # a thread was created and is listable
    assert len(client.get("/api/threads", headers=h).json()["threads"]) == 1


def test_web_whatsapp_parity(client, monkeypatch):
    """Same user + same first question → identical answer text on both doors."""
    monkeypatch.setattr(get_settings(), "GEMINI_API_KEY", "")  # deterministic offline agent
    h = _auth(client)
    register_offline_case(
        CNR,
        FetchedCase(
            cnr=CNR, title="Alice vs State", court="CMM", stage="Arguments",
            next_hearing_date=date(2026, 7, 1), judge="J",
            parties=[Party(name="Alice", role="petitioner")],
            orders=[OrderRef(order_date=date(2026, 1, 2), order_url="u", order_id="1")],
        ),
    )
    client.post("/api/cases", json={"cnr": CNR}, headers=h)
    question = f"what is the status of {CNR}?"
    web_answer = client.post("/api/ask", json={"question": question}, headers=h).json()["answer"]

    # WhatsApp door: resolve the same user (by phone) in a session on the same engine.
    from nm_web.deps import get_db  # the app override yields sessions on the test engine
    gen = client.app.dependency_overrides[get_db]()
    session = next(gen)
    try:
        user = UserRepository(session).get_by_phone("+919100000081")
        from nm_core.ai import ask as ai_ask

        wa = ai_ask(session, user=user, question=question, channel="whatsapp")
        session.commit()
    finally:
        gen.close()

    assert web_answer == wa.text  # identical brain, identical answer
