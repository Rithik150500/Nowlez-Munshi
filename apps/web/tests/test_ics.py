"""GET /api/calendar/export.ics — downloadable hearings calendar."""
from __future__ import annotations

from datetime import date, timedelta

from nm_core.config import get_settings
from nm_core.ecourts.models import Case as FetchedCase
from nm_core.ecourts.offline import register_offline_case

CNR = "DLND010000012024"


def _auth(client, phone="+919100000701"):
    r = client.post("/api/auth/dev-login", json={"phone": phone, "name": "Adv"})
    return {"Authorization": f"Bearer {r.json()['access_token']}"}


def _track(client, h, monkeypatch, *, hearing):
    monkeypatch.setattr(get_settings(), "ECOURTS_OFFLINE", True)
    register_offline_case(CNR, FetchedCase(
        cnr=CNR, title="Sharma; vs, State", court="HC", stage="Final Arguments",
        next_hearing_date=hearing, judge="J", parties=[], orders=[]))
    client.post("/api/cases", json={"cnr": CNR}, headers=h)


def test_ics_export_well_formed(client, monkeypatch):
    h = _auth(client)
    hearing = date.today() + timedelta(days=3)
    _track(client, h, monkeypatch, hearing=hearing)

    r = client.get("/api/calendar/export.ics", headers=h)
    assert r.status_code == 200
    assert r.headers["content-type"].startswith("text/calendar")
    assert "attachment" in r.headers["content-disposition"]
    body = r.text
    assert body.startswith("BEGIN:VCALENDAR") and body.rstrip().endswith("END:VCALENDAR")
    assert f"DTSTART;VALUE=DATE:{hearing.strftime('%Y%m%d')}" in body
    # RFC 5545 escaping of ; and , in the title
    assert "SUMMARY:Sharma\\; vs\\, State" in body
    assert "\r\n" in body  # CRLF line endings
    assert f"{CNR}-hearing-" in body  # stable UID


def test_ics_empty_when_no_hearings(client, monkeypatch):
    h = _auth(client, "+919100000702")
    r = client.get("/api/calendar/export.ics", headers=h)
    assert r.status_code == 200
    assert "BEGIN:VEVENT" not in r.text  # no events, still a valid empty calendar
    assert r.text.startswith("BEGIN:VCALENDAR")
