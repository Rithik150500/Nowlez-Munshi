"""AES-128-CBC envelope crypto for the eCourts mobile API (v3.0 APK).

- Request: key 4D62…397A, IV = global_iv(8, fixed pool) || random_iv(8). Wire format
  ``random_iv_hex(16) || global_index(1) || base64(ciphertext)``.
- Response: key 3273…4B62, IV = first 32 hex chars of the envelope.
- Bearer header: the JWT is itself wrapped as a request envelope.
"""
from __future__ import annotations

import base64
import json
import re
import secrets
from typing import Any

from cryptography.hazmat.primitives import padding
from cryptography.hazmat.primitives.ciphers import Cipher, algorithms, modes

REQUEST_KEY: bytes = bytes.fromhex("4D6251655468576D5A7134743677397A")
RESPONSE_KEY: bytes = bytes.fromhex("3273357638782F413F4428472B4B6250")

GLOBAL_IV_POOL: tuple[bytes, ...] = tuple(
    bytes.fromhex(h)
    for h in (
        "556A586E32723575",
        "34743777217A2543",
        "413F4428472B4B62",
        "48404D635166546A",
        "614E645267556B58",
        "655368566D597133",
    )
)

_CONTROL_CHARS_RE = re.compile(r"[\x00-\x19]+")


def _pick_global_iv() -> tuple[bytes, int]:
    index = secrets.randbelow(len(GLOBAL_IV_POOL))
    return GLOBAL_IV_POOL[index], index


def encrypt_request(payload: Any) -> str:
    """Encrypt a JSON-serializable payload into the eCourts request envelope."""
    plaintext = json.dumps(payload, separators=(",", ":")).encode("utf-8")
    global_iv, global_index = _pick_global_iv()
    random_iv = secrets.token_bytes(8)
    iv = global_iv + random_iv

    padder = padding.PKCS7(128).padder()
    padded = padder.update(plaintext) + padder.finalize()
    encryptor = Cipher(algorithms.AES(REQUEST_KEY), modes.CBC(iv)).encryptor()
    ciphertext = encryptor.update(padded) + encryptor.finalize()

    return random_iv.hex() + str(global_index) + base64.b64encode(ciphertext).decode("ascii")


def decrypt_response(envelope: str) -> str:
    """Decrypt a response envelope (iv_hex(32) || base64(ciphertext)) → JSON string."""
    s = envelope.strip()
    iv_hex, b64_ct = s[:32], s[32:]
    iv = bytes.fromhex(iv_hex)
    ciphertext = base64.b64decode(b64_ct)

    decryptor = Cipher(algorithms.AES(RESPONSE_KEY), modes.CBC(iv)).decryptor()
    padded = decryptor.update(ciphertext) + decryptor.finalize()
    unpadder = padding.PKCS7(128).unpadder()
    plaintext = unpadder.update(padded) + unpadder.finalize()

    return _CONTROL_CHARS_RE.sub("", plaintext.decode("utf-8", errors="replace"))


def wrap_bearer(jwt: str) -> str:
    """Wrap a JWT into the request envelope for the ``Authorization: Bearer`` header."""
    return encrypt_request(jwt)
