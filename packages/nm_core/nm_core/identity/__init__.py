"""Phone-canonical auth: OTP, password (argon2id), JWT, refresh sessions, links."""
from __future__ import annotations

from nm_core.identity import errors
from nm_core.identity.api import (
    create_link_token,
    dev_login,
    exchange_link_token,
    login_with_password,
    refresh_access_token,
    revoke_session,
    set_password,
    start_phone_login,
    verify_otp_and_login,
)
from nm_core.identity.jwt import decode_access_token, encode_access_token

__all__ = [
    "create_link_token",
    "decode_access_token",
    "dev_login",
    "encode_access_token",
    "errors",
    "exchange_link_token",
    "login_with_password",
    "refresh_access_token",
    "revoke_session",
    "set_password",
    "start_phone_login",
    "verify_otp_and_login",
]
