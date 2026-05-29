"""Download an order PDF, tolerating up to 1 KB of leading junk before %PDF."""
from __future__ import annotations

import httpx

from nm_core.config import get_settings
from nm_core.ecourts.errors import PDFInvalid, PDFNotFound

_MAGIC_HEADER_SCAN_LIMIT = 1024


def fetch_pdf(client: httpx.Client, url: str) -> bytes:
    resp = client.get(url, timeout=get_settings().ECOURTS_PDF_TIMEOUT_SECONDS)
    if 400 <= resp.status_code < 600:
        raise PDFNotFound(f"{resp.status_code} for {url}")

    content = resp.content
    if content.startswith(b"%PDF"):
        return content
    # Some benches (Bombay HC) serve CRLF-prefixed PDFs; scan the first KB.
    pdf_start = content[:_MAGIC_HEADER_SCAN_LIMIT].find(b"%PDF")
    if pdf_start > 0:
        return content[pdf_start:]
    raise PDFInvalid(f"non-PDF body at {url}: starts with {content[:8]!r}")
