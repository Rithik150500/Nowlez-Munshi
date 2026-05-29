"""M4c: calendar range + portfolio analytics over the case book."""
from __future__ import annotations

from datetime import date, timedelta

from nm_core.ecourts.models import Case as FetchedCase
from nm_core.ecourts.offline import register_offline_case

CNR1 = "DLND010000012024"
CNR2 = "MHHC010000012024"


def _auth(client):
    r = client.post("/api/auth/dev-login", json={"phone": "+919100000121", "name": "Adv"})
    return {"Authorization": f"Bearer {r.json()['access_token']}"}


def _seed(client, h):
    soon = date.today() + timedelta(days=3)
    far = date.today() + timedelta(days=20)
    register_offline_case(
        CNR1,
        FetchedCase(cnr=CNR1, title="A", court="CourtX", stage="Arguments",
                    next_hearing_date=soon, judge="J", parties=[], orders=[]),
    )
    register_offline_case(
        CNR2,
        FetchedCase(cnr=CNR2, title="B", court="CourtY", stage="Evidence",
                    next_hearing_date=far, judge="J", parties=[], orders=[]),
    )
    client.post("/api/cases", json={"cnr": CNR1}, headers=h)
    client.post("/api/cases", json={"cnr": CNR2}, headers=h)


def test_calendar_default_range(client):
    h = _auth(client)
    _seed(client, h)
    hearings = client.get("/api/calendar", headers=h).json()["hearings"]
    assert {x["cnr"] for x in hearings} == {CNR1, CNR2}  # both within 30 days


def test_calendar_narrow_range(client):
    h = _auth(client)
    _seed(client, h)
    to = (date.today() + timedelta(days=7)).isoformat()
    hearings = client.get(f"/api/calendar?to={to}", headers=h).json()["hearings"]
    assert [x["cnr"] for x in hearings] == [CNR1]  # only the near one


def test_analytics(client):
    h = _auth(client)
    _seed(client, h)
    a = client.get("/api/analytics", headers=h).json()
    assert a["total"] == 2
    assert a["by_portal"] == {"district": 1, "highcourt": 1}
    assert a["by_stage"] == {"Arguments": 1, "Evidence": 1}
    assert a["upcoming_7"] == 1 and a["upcoming_30"] == 2
