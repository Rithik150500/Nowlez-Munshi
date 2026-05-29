"""i18n catalog: locale resolution, fallbacks, formatting."""
from __future__ import annotations

from nm_core.i18n import DEFAULT_LOCALE, SUPPORTED, t, web_catalog


def test_returns_locale_string():
    assert t("no_cases", "en").startswith("No cases")
    assert "केस" in t("no_cases", "hi")


def test_unknown_locale_falls_back_to_english():
    assert t("no_cases", "fr") == t("no_cases", "en")
    assert t("no_cases", None) == t("no_cases", DEFAULT_LOCALE)


def test_unknown_key_returns_key():
    assert t("nope_not_a_key", "en") == "nope_not_a_key"


def test_formatting_kwargs():
    assert "DLND01-2024" in t("not_found", "en", cnr="DLND01-2024")
    assert "/foo" in t("unknown_cmd", "hi", cmd="/foo")


def test_web_catalog_covers_all_locales():
    en = web_catalog("en")
    hi = web_catalog("hi")
    assert set(en) == set(hi)
    assert en["cases"] == "Case book"
    assert hi["cases"] != en["cases"]
    # Unknown locale → English values.
    assert web_catalog("zz") == en


def test_supported_includes_default():
    assert DEFAULT_LOCALE in SUPPORTED
