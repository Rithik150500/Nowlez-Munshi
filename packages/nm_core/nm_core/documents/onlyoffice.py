"""OnlyOffice integration helpers: a blank DOCX, signed editor config, callback verify.

Requires an OnlyOffice Document Server (see deploy/) to actually edit; these helpers
are pure and unit-testable without it.
"""
from __future__ import annotations

import io
import zipfile

import jwt as pyjwt

from nm_core.config import get_settings

_CONTENT_TYPES = (
    '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>'
    '<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">'
    '<Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>'  # noqa: E501
    '<Default Extension="xml" ContentType="application/xml"/>'
    '<Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/>'  # noqa: E501
    "</Types>"
)
_RELS = (
    '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>'
    '<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">'
    '<Relationship Id="rId1" '
    'Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" '
    'Target="word/document.xml"/></Relationships>'
)
_DOCUMENT = (
    '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>'
    '<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">'
    "<w:body><w:p><w:r><w:t></w:t></w:r></w:p></w:body></w:document>"
)


def blank_docx() -> bytes:
    """A minimal, valid empty .docx."""
    buf = io.BytesIO()
    with zipfile.ZipFile(buf, "w", zipfile.ZIP_DEFLATED) as z:
        z.writestr("[Content_Types].xml", _CONTENT_TYPES)
        z.writestr("_rels/.rels", _RELS)
        z.writestr("word/document.xml", _DOCUMENT)
    return buf.getvalue()


def editor_config(*, key: str, title: str, document_url: str, callback_url: str) -> dict:
    """Build the OnlyOffice editor config and sign it (JWT) when a secret is set."""
    s = get_settings()
    config = {
        "document": {
            "fileType": "docx",
            "key": key,
            "title": title,
            "url": document_url,
        },
        "documentType": "word",
        "editorConfig": {"callbackUrl": callback_url},
    }
    if s.ONLYOFFICE_JWT_SECRET:
        config["token"] = pyjwt.encode(config, s.ONLYOFFICE_JWT_SECRET, algorithm="HS256")
    return config


def verify_callback(token: str | None) -> dict | None:
    """Verify an OnlyOffice callback JWT (if a secret is configured). Returns claims."""
    s = get_settings()
    if not s.ONLYOFFICE_JWT_SECRET:
        return None
    return pyjwt.decode(token or "", s.ONLYOFFICE_JWT_SECRET, algorithms=["HS256"])
