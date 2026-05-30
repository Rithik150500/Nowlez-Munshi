"""Document library: /tree grouping, rename validation, reclassify ownership."""
from __future__ import annotations

import uuid

from nm_web.deps import get_db

from nm_core.db.models.document import Document
from nm_core.ecourts.models import Case as FetchedCase
from nm_core.ecourts.offline import register_offline_case

CNR = "DLND010000012024"


def _auth(client, phone="+919100000601"):
    r = client.post("/api/auth/dev-login", json={"phone": phone, "name": "Adv"})
    return {"Authorization": f"Bearer {r.json()['access_token']}"}, r.json()["user"]["id"]


def _add_doc(client, account_id, title="Notes", filename="notes.docx", case_id=None):
    gen = client.app.dependency_overrides[get_db]()
    s = next(gen)
    try:
        d = Document(account_id=uuid.UUID(account_id), kind="upload", title=title,
                     filename=filename, storage_key=f"k-{title}", case_id=case_id)
        s.add(d)
        s.commit()
        return str(d.id)
    finally:
        gen.close()


def _track(client, h, uid):
    register_offline_case(CNR, FetchedCase(
        cnr=CNR, title="A vs B", court="HC", stage="S", next_hearing_date=None,
        judge="J", parties=[], orders=[]))
    client.post("/api/cases", json={"cnr": CNR}, headers=h)
    # The case serializer doesn't expose the UUID; read it from the DB.
    from nm_core.cases import CaseRepository
    gen = client.app.dependency_overrides[get_db]()
    s = next(gen)
    try:
        return str(CaseRepository(s).get_by_cnr(uuid.UUID(uid), CNR).id)
    finally:
        gen.close()


def test_tree_groups_by_case_and_unclassified(client):
    h, uid = _auth(client)
    account_id = client.get("/api/billing", headers=h).json()["account_id"]
    case_id = _track(client, h, uid)
    _add_doc(client, account_id, title="Attached", case_id=uuid.UUID(case_id))
    _add_doc(client, account_id, title="Loose")

    groups = client.get("/api/documents/tree", headers=h).json()["groups"]
    attached = [g for g in groups if g["case"] and g["case"]["id"] == case_id]
    unclassified = [g for g in groups if g["case"] is None]
    assert attached and any(f["title"] == "Attached" for f in attached[0]["files"])
    assert unclassified and any(f["title"] == "Loose" for f in unclassified[0]["files"])


def test_rename_validates_and_preserves_extension(client):
    h, uid = _auth(client, "+919100000602")
    account_id = client.get("/api/billing", headers=h).json()["account_id"]
    doc_id = _add_doc(client, account_id, title="Old", filename="old.docx")

    # extension preserved when omitted
    r = client.put(f"/api/documents/{doc_id}/rename", json={"new_name": "Bail App"}, headers=h)
    assert r.status_code == 200 and r.json()["filename"] == "Bail App.docx"

    # illegal characters rejected
    bad = client.put(f"/api/documents/{doc_id}/rename", json={"new_name": "a/b<c>"}, headers=h)
    assert bad.status_code == 422


def test_rename_collision_conflicts(client):
    h, uid = _auth(client, "+919100000603")
    account_id = client.get("/api/billing", headers=h).json()["account_id"]
    _add_doc(client, account_id, title="One", filename="one.docx")
    d2 = _add_doc(client, account_id, title="Two", filename="two.docx")
    r = client.put(f"/api/documents/{d2}/rename", json={"new_name": "one.docx"}, headers=h)
    assert r.status_code == 409


def test_reclassify_attaches_and_detaches(client):
    h, uid = _auth(client, "+919100000604")
    account_id = client.get("/api/billing", headers=h).json()["account_id"]
    case_id = _track(client, h, uid)
    doc_id = _add_doc(client, account_id, title="Doc")

    r = client.put(f"/api/documents/{doc_id}/reclassify",
                   json={"target_case_id": case_id}, headers=h)
    assert r.status_code == 200
    # now appears under the case group
    groups = client.get("/api/documents/tree", headers=h).json()["groups"]
    assert any(g["case"] and g["case"]["id"] == case_id for g in groups)

    # detach
    client.put(f"/api/documents/{doc_id}/reclassify", json={"target_case_id": None}, headers=h)
    groups = client.get("/api/documents/tree", headers=h).json()["groups"]
    assert any(g["case"] is None for g in groups)


def test_reclassify_rejects_other_users_case(client):
    h1, uid1 = _auth(client, "+919100000605")
    case_id = _track(client, h1, uid1)
    h2, uid2 = _auth(client, "+919100000606")
    account2 = client.get("/api/billing", headers=h2).json()["account_id"]
    doc_id = _add_doc(client, account2, title="Mine")
    r = client.put(f"/api/documents/{doc_id}/reclassify",
                   json={"target_case_id": case_id}, headers=h2)
    assert r.status_code == 404  # can't attach to another user's case
