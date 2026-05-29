"""Identity context: JWT, refresh sessions, OTP, rate limiting, password, delivery, API."""
from __future__ import annotations

import uuid
from datetime import UTC, datetime, timedelta

import pytest

from nm_core.config import get_settings
from nm_core.identity import (
    decode_access_token,
    dev_login,
    encode_access_token,
    login_with_password,
    refresh_access_token,
    revoke_session,
    set_password,
    start_phone_login,
    verify_otp_and_login,
)
from nm_core.identity import otp as otp_mod
from nm_core.identity import passwords as pw
from nm_core.identity import sessions as sessions_mod
from nm_core.identity.delivery import router as router_mod
from nm_core.identity.errors import (
    DeliveryFailed,
    InvalidCredentials,
    InvalidToken,
    OtpAlreadyUsed,
    OtpAttemptsExhausted,
    OtpExpired,
    OtpInvalid,
    PasswordNotSet,
    PasswordTooWeak,
    RateLimited,
)
from nm_core.identity.repositories import OtpRepository, UserRepository

FIXED_CODE = "424242"


@pytest.fixture
def stub_delivery(monkeypatch):
    """WhatsApp send succeeds; OTP code is deterministic."""
    monkeypatch.setattr(otp_mod, "generate_otp_code", lambda: FIXED_CODE)
    monkeypatch.setattr(router_mod, "send_otp_whatsapp", lambda phone, code: "wamid.TEST")
    monkeypatch.setattr(router_mod, "send_otp_sms", lambda phone, code: "req.TEST")


# --- JWT ---
def test_jwt_roundtrip():
    uid = uuid.uuid4()
    claims = decode_access_token(encode_access_token(uid))
    assert claims["sub"] == str(uid)


def test_jwt_tampered_rejected():
    token = encode_access_token(uuid.uuid4())
    with pytest.raises(InvalidToken):
        decode_access_token(token + "x")


def test_jwt_expired_rejected():
    token = encode_access_token(uuid.uuid4(), ttl_seconds=-10)
    with pytest.raises(InvalidToken, match="expired"):
        decode_access_token(token)


# --- Refresh sessions ---
def _make_user(db_session, phone="+919111111111"):
    user, _ = UserRepository(db_session).get_or_create_by_phone(phone=phone, name="T")
    return user


def test_refresh_issue_consume_revoke(db_session):
    user = _make_user(db_session)
    raw, sess = sessions_mod.issue_refresh_token(db_session, user_id=user.id)
    consumed = sessions_mod.consume_refresh_token(db_session, raw)
    assert consumed.id == sess.id
    assert consumed.last_used_at is not None

    sessions_mod.revoke_refresh_token(db_session, raw)
    with pytest.raises(InvalidToken):
        sessions_mod.consume_refresh_token(db_session, raw)


def test_refresh_unknown_token_rejected(db_session):
    with pytest.raises(InvalidToken):
        sessions_mod.consume_refresh_token(db_session, "not-a-real-token")


# --- OTP via API ---
def test_start_and_verify_login(db_session, stub_delivery):
    started = start_phone_login(db_session, phone="+919222222222")
    assert started["channel"] == "whatsapp"
    result = verify_otp_and_login(
        db_session, otp_id=started["otp_id"], code=FIXED_CODE, name="Adv. Singh"
    )
    assert decode_access_token(result["access_token"])["sub"] == result["user"]["id"]
    assert result["user"]["name"] == "Adv. Singh"
    # refresh works
    refreshed = refresh_access_token(db_session, refresh_token=result["refresh_token"])
    assert "access_token" in refreshed
    # revoke then refresh fails
    revoke_session(db_session, refresh_token=result["refresh_token"])
    with pytest.raises(InvalidToken):
        refresh_access_token(db_session, refresh_token=result["refresh_token"])


def test_otp_reuse_rejected(db_session, stub_delivery):
    started = start_phone_login(db_session, phone="+919222222223")
    verify_otp_and_login(db_session, otp_id=started["otp_id"], code=FIXED_CODE)
    with pytest.raises(OtpAlreadyUsed):
        verify_otp_and_login(db_session, otp_id=started["otp_id"], code=FIXED_CODE)


def test_otp_wrong_code_and_exhaustion(db_session, stub_delivery):
    started = start_phone_login(db_session, phone="+919222222224")
    otp_id = uuid.UUID(started["otp_id"])
    for _ in range(get_settings().OTP_MAX_ATTEMPTS):
        with pytest.raises(OtpInvalid):
            otp_mod.verify_otp(db_session, otp_id=otp_id, code="000000")
    with pytest.raises(OtpAttemptsExhausted):
        otp_mod.verify_otp(db_session, otp_id=otp_id, code="000000")


def test_otp_expired(db_session):
    repo = OtpRepository(db_session)
    otp = repo.insert(
        phone="+919222222225",
        code_hash=pw.hasher.hash(FIXED_CODE),
        channel="whatsapp",
        ttl_minutes=10,
        ip_address=None,
    )
    otp.expires_at = datetime.now(UTC) - timedelta(minutes=1)
    db_session.flush()
    with pytest.raises(OtpExpired):
        otp_mod.verify_otp(db_session, otp_id=otp.id, code=FIXED_CODE)


def test_otp_unknown_id(db_session):
    with pytest.raises(OtpInvalid):
        otp_mod.verify_otp(db_session, otp_id=uuid.uuid4(), code=FIXED_CODE)


# --- Rate limiting ---
def test_rate_limit_per_phone(db_session, stub_delivery):
    phone = "+919333333333"
    limit = get_settings().OTP_PER_PHONE_PER_HOUR
    for _ in range(limit):
        start_phone_login(db_session, phone=phone)
    with pytest.raises(RateLimited) as exc:
        start_phone_login(db_session, phone=phone)
    assert exc.value.retry_after_seconds == 3600


# --- Password login ---
def test_password_login_flow(db_session):
    users = UserRepository(db_session)
    user, _ = users.get_or_create_by_phone(phone="+919444444444", name="P")
    users.update_password(user.id, pw.hash_password("correct horse"))

    ok = login_with_password(db_session, phone="+919444444444", password="correct horse")
    assert decode_access_token(ok["access_token"])["sub"] == str(user.id)

    with pytest.raises(InvalidCredentials):
        login_with_password(db_session, phone="+919444444444", password="wrong")


def test_password_login_unknown_and_unset(db_session):
    with pytest.raises(InvalidCredentials):
        login_with_password(db_session, phone="+910000000000", password="whatever")

    UserRepository(db_session).get_or_create_by_phone(phone="+919555555555")
    with pytest.raises(PasswordNotSet):
        login_with_password(db_session, phone="+919555555555", password="whatever")


# --- Delivery router ---
def test_router_whatsapp_first(monkeypatch):
    monkeypatch.setattr(router_mod, "send_otp_whatsapp", lambda p, c: "wamid.1")
    assert router_mod.deliver_otp("+91999", "111111") == ("whatsapp", "wamid.1")


def test_router_sms_fallback(monkeypatch):
    def _wa_fail(p, c):
        raise DeliveryFailed("whatsapp", "boom")

    monkeypatch.setattr(router_mod, "send_otp_whatsapp", _wa_fail)
    monkeypatch.setattr(router_mod, "send_otp_sms", lambda p, c: "req.9")
    assert router_mod.deliver_otp("+91999", "111111") == ("sms", "req.9")


# --- set_password ---
def test_set_password_requires_fresh_otp(db_session, stub_delivery):
    started = start_phone_login(db_session, phone="+919666666666")
    user, _ = UserRepository(db_session).get_or_create_by_phone(phone="+919666666666")
    set_password(
        db_session,
        user_id=user.id,
        new_password="a-strong-passphrase",
        fresh_otp_id=started["otp_id"],
        fresh_otp_code=FIXED_CODE,
    )
    assert user.password_hash is not None
    login_with_password(db_session, phone="+919666666666", password="a-strong-passphrase")


def test_set_password_weak_rejected(db_session, stub_delivery):
    started = start_phone_login(db_session, phone="+919777777777")
    with pytest.raises(PasswordTooWeak):
        set_password(
            db_session,
            user_id=uuid.uuid4(),
            new_password="short",
            fresh_otp_id=started["otp_id"],
            fresh_otp_code=FIXED_CODE,
        )


# --- dev_login ---
def test_dev_login_mints_token(db_session):
    result = dev_login(db_session, phone="+919888888888", name="Dev")
    assert decode_access_token(result["access_token"])["sub"] == result["user"]["id"]


def test_dev_login_disabled_when_dev_mode_off(db_session, monkeypatch):
    monkeypatch.setattr(get_settings(), "DEV_MODE", False)
    with pytest.raises(RuntimeError, match="DEV_MODE"):
        dev_login(db_session, phone="+919999999999")
