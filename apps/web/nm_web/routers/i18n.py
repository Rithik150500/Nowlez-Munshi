"""i18n catalog endpoint: the SPA fetches UI strings for a locale.

No auth — the login screen needs strings before a session exists. The SPA passes
?locale=hi (read from the user's /me locale once signed in); unknown locales fall
back to English in the shared catalog.
"""
from __future__ import annotations

from fastapi import APIRouter

from nm_core.i18n import SUPPORTED, web_catalog

router = APIRouter(prefix="/api/i18n", tags=["i18n"])


@router.get("")
def catalog(locale: str = "en") -> dict:
    return {"locale": locale, "supported": list(SUPPORTED), "strings": web_catalog(locale)}
