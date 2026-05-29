"""P1: the SPA i18n catalog endpoint (no auth; login screen needs strings)."""
from __future__ import annotations


def test_catalog_default_en(client):
    r = client.get("/api/i18n")
    assert r.status_code == 200
    body = r.json()
    assert body["locale"] == "en"
    assert body["strings"]["cases"] == "Case book"
    assert "en" in body["supported"] and "hi" in body["supported"]


def test_catalog_hi(client):
    body = client.get("/api/i18n?locale=hi").json()
    assert body["locale"] == "hi"
    assert body["strings"]["cases"] != "Case book"


def test_unknown_locale_falls_back(client):
    body = client.get("/api/i18n?locale=zz").json()
    assert body["strings"]["cases"] == "Case book"
