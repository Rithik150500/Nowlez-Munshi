"""Public waitlist + demo-request endpoints (unauthenticated, rate-limited)."""
from __future__ import annotations

from nm_web.deps import get_db

from nm_core.db.models.audit import AuditLog


def test_join_waitlist_idempotent_and_count(client):
    r1 = client.post("/api/waitlist", json={"name": "Asha Rao", "email": "a@x.test",
                                            "practice_area": "Criminal"})
    assert r1.status_code == 200
    assert r1.json()["created"] is True and r1.json()["waitlist_count"] == 1

    # same email again → not created, count unchanged
    r2 = client.post("/api/waitlist", json={"name": "Asha", "email": "A@X.test"})
    assert r2.json()["created"] is False and r2.json()["waitlist_count"] == 1

    assert client.get("/api/waitlist/count").json()["waitlist_count"] == 1


def test_waitlist_validates(client):
    assert client.post("/api/waitlist", json={"name": "A", "email": "a@x.test"}).status_code == 422
    assert client.post("/api/waitlist",
                       json={"name": "Asha", "email": "bad"}).status_code == 422


def test_waitlist_rate_limited(client):
    # 5/min per IP; the 6th is throttled
    for i in range(5):
        assert client.post("/api/waitlist",
                           json={"name": "User", "email": f"u{i}@x.test"}).status_code == 200
    r = client.post("/api/waitlist", json={"name": "User", "email": "u6@x.test"})
    assert r.status_code == 429


def test_demo_request_sanitizes_and_audits(client):
    r = client.post("/api/demo-request", json={
        "name": "Bob <script>alert(1)</script>", "email": "b@x.test",
        "firm": "Acme", "message": "Hi <b>there</b>"})
    assert r.status_code == 200
    gen = client.app.dependency_overrides[get_db]()
    s = next(gen)
    try:
        row = s.query(AuditLog).filter_by(event_type="demo.requested").one()
        assert "<script>" not in row.metadata_["name"]
        assert row.metadata_["message"] == "Hi there"
    finally:
        gen.close()
