"""Decode a CNR from a QR-code image (eCourts case QR stickers / app screenshots).

pyzbar needs the native zbar library, which may be absent in some environments, so
the import is lazy and failures degrade to "no CNR found" rather than crashing the
webhook. The decoded payload is scanned for a 16-char CNR.
"""
from __future__ import annotations

import io
import re

# eCourts QR payloads embed the CNR; match a bare 16-char token anywhere in the text.
_CNR_IN_TEXT = re.compile(r"\b([A-Z]{4}[A-Z0-9]{12})\b")


def decode_cnr_from_image(data: bytes) -> str | None:
    """Return the first CNR found in any QR code in the image, or None."""
    for payload in _decode_qr_payloads(data):
        m = _CNR_IN_TEXT.search(payload.upper())
        if m:
            return m.group(1)
    return None


def _decode_qr_payloads(data: bytes) -> list[str]:
    try:
        from PIL import Image
        from pyzbar.pyzbar import decode
    except Exception:  # noqa: BLE001 — missing native zbar / pillow → no decode
        return []
    try:
        img = Image.open(io.BytesIO(data))
        return [r.data.decode("utf-8", "replace") for r in decode(img)]
    except Exception:  # noqa: BLE001 — unreadable image
        return []
