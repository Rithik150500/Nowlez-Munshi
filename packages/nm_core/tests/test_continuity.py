"""M4a continuity handoff: link-token mint/exchange + cross-rejection."""
from __future__ import annotations

import pytest

from nm_core.identity import (
    create_link_token,
    decode_access_token,
    encode_access_token,
    exchange_link_token,
)
from nm_core.identity.errors import InvalidToken
from nm_core.identity.jwt import decode_link_token, encode_link_token
from nm_core.identity.repositories import UserRepository


def test_link_token_exchange_roundtrip(db_session):
    user, _ = UserRepository(db_session).get_or_create_by_phone(phone="+919100000091", name="Adv")
    token = create_link_token(user.id)
    result = exchange_link_token(db_session, token=token)
    assert decode_access_token(result["access_token"])["sub"] == str(user.id)
    assert result["refresh_token"]


def test_link_token_is_single_use(db_session, monkeypatch):
    import fakeredis

    from nm_core import replay

    monkeypatch.setattr(replay, "_client", fakeredis.FakeStrictRedis())
    user, _ = UserRepository(db_session).get_or_create_by_phone(phone="+919100000092", name="Adv")
    token = create_link_token(user.id)
    exchange_link_token(db_session, token=token)  # first use OK
    with pytest.raises(InvalidToken, match="already used"):
        exchange_link_token(db_session, token=token)  # replay rejected
    monkeypatch.setattr(replay, "_client", None)


def test_link_token_rejected_as_access_token(db_session):
    import uuid

    token = encode_link_token(uuid.uuid4())
    with pytest.raises(InvalidToken, match="non-access token"):
        decode_access_token(token)


def test_doc_purpose_token_rejected_as_access_token():
    import uuid

    import jwt as pyjwt

    from nm_core.config import get_settings

    # A doc capability token (purpose=doc) must not be usable as an access token.
    s = get_settings()
    token = pyjwt.encode(
        {"sub": str(uuid.uuid4()), "purpose": "doc"}, s.JWT_SECRET_KEY, algorithm=s.JWT_ALGORITHM
    )
    with pytest.raises(InvalidToken, match="non-access token"):
        decode_access_token(token)


def test_access_token_rejected_as_link_token():
    import uuid

    token = encode_access_token(uuid.uuid4())
    with pytest.raises(InvalidToken, match="not a link token"):
        decode_link_token(token)


def test_expired_link_token_rejected(db_session):
    import uuid

    token = encode_link_token(uuid.uuid4(), ttl_seconds=-5)
    with pytest.raises(InvalidToken, match="expired"):
        exchange_link_token(db_session, token=token)


def test_exchange_unknown_user_rejected(db_session):
    import uuid

    token = encode_link_token(uuid.uuid4())  # no such user
    with pytest.raises(InvalidToken, match="unknown user"):
        exchange_link_token(db_session, token=token)
