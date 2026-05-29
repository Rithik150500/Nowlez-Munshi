"""Bot webhook app: QR-image CNR intake resolution."""
from __future__ import annotations

from nm_bot import app as botapp

from nm_core.messaging import IncomingMessage


def _img(media_id="m1"):
    return IncomingMessage(
        meta_message_id="wamid.x", from_phone="+919100000601", timestamp=0,
        type="image", media_id=media_id,
    )


def test_resolve_image_cnr_decodes(monkeypatch):
    class FakeMeta:
        def fetch_media(self, media_id):
            assert media_id == "m1"
            return b"image-bytes"

    monkeypatch.setattr(botapp.messaging, "MetaClient", lambda: FakeMeta())
    monkeypatch.setattr(botapp.messaging, "decode_cnr_from_image", lambda data: "DLND010000012024")
    assert botapp._resolve_image_cnr(_img()) == "DLND010000012024"


def test_resolve_image_cnr_none_without_media():
    assert botapp._resolve_image_cnr(_img(media_id=None)) is None


def test_resolve_image_cnr_handles_fetch_failure(monkeypatch):
    class Boom:
        def fetch_media(self, media_id):
            raise RuntimeError("network down")

    monkeypatch.setattr(botapp.messaging, "MetaClient", lambda: Boom())
    assert botapp._resolve_image_cnr(_img()) is None
