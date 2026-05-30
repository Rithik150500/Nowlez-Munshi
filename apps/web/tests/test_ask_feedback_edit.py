"""Chat message feedback (thumbs) + edit-and-regenerate."""
from __future__ import annotations


def _auth(client, phone="+919100000091") -> dict:
    r = client.post("/api/auth/dev-login", json={"phone": phone, "name": "Adv"})
    return {"Authorization": f"Bearer {r.json()['access_token']}"}


def _ask(client, h, q, thread_id=None):
    body = {"question": q}
    if thread_id:
        body["thread_id"] = thread_id
    return client.post("/api/ask", json=body, headers=h).json()


def _assistant_message(client, h, thread_id):
    msgs = client.get(f"/api/threads/{thread_id}", headers=h).json()["messages"]
    return next(m for m in msgs if m["role"] == "assistant")


def test_feedback_up_down_clear(client):
    h = _auth(client)
    tid = _ask(client, h, "what cases am I tracking?")["thread_id"]
    msg = _assistant_message(client, h, tid)

    r = client.post(f"/api/ask/messages/{msg['id']}/feedback", json={"feedback": "up"}, headers=h)
    assert r.status_code == 200 and r.json()["feedback"] == "up"
    assert _assistant_message(client, h, tid)["feedback"] == "up"

    # clear
    client.post(f"/api/ask/messages/{msg['id']}/feedback", json={"feedback": None}, headers=h)
    assert _assistant_message(client, h, tid)["feedback"] is None


def test_feedback_rejects_bad_value(client):
    h = _auth(client, "+919100000092")
    tid = _ask(client, h, "hi")["thread_id"]
    msg = _assistant_message(client, h, tid)
    r = client.post(f"/api/ask/messages/{msg['id']}/feedback", json={"feedback": "meh"}, headers=h)
    assert r.status_code == 422


def test_feedback_only_on_own_message(client):
    h1 = _auth(client, "+919100000093")
    tid = _ask(client, h1, "hi")["thread_id"]
    msg = _assistant_message(client, h1, tid)
    h2 = _auth(client, "+919100000094")
    r = client.post(f"/api/ask/messages/{msg['id']}/feedback", json={"feedback": "up"}, headers=h2)
    assert r.status_code == 404  # not the other user's message


def test_edit_and_regenerate_truncates_thread(client):
    h = _auth(client, "+919100000095")
    first = _ask(client, h, "first question")
    tid = first["thread_id"]
    _ask(client, h, "second question", thread_id=tid)
    # 4 messages now: u1, a1, u2, a2
    msgs = client.get(f"/api/threads/{tid}", headers=h).json()["messages"]
    assert len(msgs) == 4
    second_user_msg = [m for m in msgs if m["role"] == "user"][1]

    r = client.post("/api/ask/edit", json={
        "thread_id": tid, "message_id": second_user_msg["id"],
        "question": "edited second question",
    }, headers=h)
    assert r.status_code == 200
    msgs = client.get(f"/api/threads/{tid}", headers=h).json()["messages"]
    # u1, a1, (edited u2), a2' — still 4, with the edited text replacing the old u2
    user_texts = [m["content"] for m in msgs if m["role"] == "user"]
    assert user_texts == ["first question", "edited second question"]
