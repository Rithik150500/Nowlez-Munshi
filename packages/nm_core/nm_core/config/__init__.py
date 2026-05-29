"""Typed settings, secrets, and prod-safety hard-fails.

Single ``Settings`` for the M1 surface (db + identity). Later contexts add their
own fields here. The prod-safety hard-fail refuses to boot if ``DATABASE_URL`` is
still the localhost dev default while a production environment is detected — the
guard that prevents the May-2026-class "prod talked to a dev DB" incident.
"""
from __future__ import annotations

import logging
import os
from functools import lru_cache

from pydantic_settings import BaseSettings, SettingsConfigDict

logger = logging.getLogger(__name__)

_DEV_DEFAULT_DATABASE_URL = "postgresql+psycopg2://localhost/nowlez_munshi"
_DEV_DEFAULT_REDIS_URL = "redis://localhost:6379/0"
_PROD_INDICATOR_ENV_VARS: tuple[str, ...] = (
    "RAILWAY_ENVIRONMENT",
    "RAILWAY_PROJECT_ID",
    "IS_PRODUCTION",
)


def _is_production_env() -> bool:
    """True iff ENV=production or any common prod indicator env var is set+non-empty."""
    if os.environ.get("ENV", "").strip().lower() == "production":
        return True
    return any((os.environ.get(k) or "").strip() for k in _PROD_INDICATOR_ENV_VARS)


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    # General
    DEV_MODE: bool = True  # enables identity.dev_login; MUST be False in prod.

    # Database
    DATABASE_URL: str = _DEV_DEFAULT_DATABASE_URL
    DB_POOL_SIZE: int = 10
    DB_MAX_OVERFLOW: int = 5
    DB_POOL_RECYCLE_SECONDS: int = 3600

    # JWT access tokens
    JWT_SECRET_KEY: str = "change-me-in-prod"
    JWT_ALGORITHM: str = "HS256"
    JWT_ACCESS_TTL_MINUTES: int = 30

    # Opaque refresh sessions
    REFRESH_TTL_DAYS: int = 30

    # Continuity handoff (WhatsApp → web deep-link)
    LINK_TOKEN_TTL_MINUTES: int = 10
    WEB_BASE_URL: str = ""  # e.g. https://app.nowlez.in — empty disables deep-links

    # OTP
    OTP_LENGTH: int = 6
    OTP_TTL_MINUTES: int = 10
    OTP_MAX_ATTEMPTS: int = 3
    OTP_PER_PHONE_PER_HOUR: int = 5
    OTP_PER_IP_PER_HOUR: int = 20

    # Argon2id (OWASP 2026 baseline; profile under prod load before lowering)
    ARGON2_TIME_COST: int = 2
    ARGON2_MEMORY_COST_KB: int = 65536  # 64 MiB
    ARGON2_PARALLELISM: int = 4

    # Redis (outbound dedup, future queue)
    REDIS_URL: str = _DEV_DEFAULT_REDIS_URL

    # WhatsApp / Meta Cloud API (shared by identity OTP delivery and messaging)
    META_ACCESS_TOKEN: str = ""
    META_PHONE_NUMBER_ID: str = ""
    META_AUTH_TEMPLATE_NAME: str = "auth_otp_v1"
    META_VERIFY_TOKEN: str = ""  # webhook GET verification handshake
    META_APP_SECRET: str = ""  # webhook X-Hub-Signature-256 HMAC key
    META_GRAPH_VERSION: str = "v21.0"
    WHATSAPP_DISABLED: bool = False  # kill-switch for all outbound WhatsApp

    # OTP delivery — SMS (MSG91)
    MSG91_AUTH_KEY: str = ""
    MSG91_OTP_TEMPLATE_ID: str = ""
    MSG91_SENDER_ID: str = "NOWLEZ"

    # Delivery timeouts (seconds)
    WHATSAPP_SEND_TIMEOUT_SECONDS: float = 15.0
    SMS_SEND_TIMEOUT_SECONDS: float = 10.0

    # eCourts. OFFLINE serves deterministic synthetic cases (dev/tests, no portal);
    # MUST be False in prod or you will serve fake case data.
    ECOURTS_OFFLINE: bool = False
    ECOURTS_DISTRICT_BASE_URL: str = "https://app.ecourts.gov.in/ecourt_mobile_DC/"
    ECOURTS_HC_BASE_URL: str = "https://app.ecourts.gov.in/ecourt_mobile_HC/"
    ECOURTS_USER_AGENT: str = "NowlezMunshi/1.0 (+https://nowlez.in/contact)"
    ECOURTS_REQUEST_TIMEOUT_SECONDS: float = 30.0
    ECOURTS_PDF_TIMEOUT_SECONDS: float = 60.0
    ECOURTS_MAX_CONCURRENCY: int = 10
    ECOURTS_CIRCUIT_FAILURE_THRESHOLD: int = 5
    ECOURTS_CIRCUIT_RECOVERY_TIMEOUT_SECONDS: float = 60.0
    ECOURTS_RETRY_MAX_ATTEMPTS: int = 3
    ECOURTS_RETRY_BASE_DELAY_SECONDS: float = 1.0

    # Document storage (order PDFs, drafts)
    STORAGE_DIR: str = "./var/storage"

    # AI Munshi (Gemini). No key → deterministic offline agent (dev/tests).
    GEMINI_API_KEY: str = ""
    GEMINI_MODEL: str = "gemini-3-flash-preview"
    AI_REQUEST_TIMEOUT_SECONDS: float = 60.0
    AI_MAX_TOOL_ITERATIONS: int = 6
    AI_HISTORY_TURNS: int = 10  # prior thread turns fed back as context

    def model_post_init(self, __context: object) -> None:
        prod = _is_production_env()
        if self.DATABASE_URL == _DEV_DEFAULT_DATABASE_URL:
            if prod:
                raise RuntimeError(
                    "DATABASE_URL is unset (defaulted to localhost) but a production "
                    "environment was detected via one of "
                    f"{('ENV=production', *_PROD_INDICATOR_ENV_VARS)}. Set DATABASE_URL "
                    "in the env-file or service variables before booting."
                )
            logger.info("DATABASE_URL using dev default (localhost). Set it for non-local use.")
        if self.REDIS_URL == _DEV_DEFAULT_REDIS_URL and prod:
            raise RuntimeError(
                "REDIS_URL is unset (defaulted to localhost) but a production environment "
                "was detected. Set REDIS_URL in the env-file or service variables."
            )
        if prod and self.JWT_SECRET_KEY == "change-me-in-prod":
            raise RuntimeError(
                "JWT_SECRET_KEY is the insecure default but a production environment was "
                "detected. Set a strong JWT_SECRET_KEY (>= 32 bytes)."
            )
        if prod and self.DEV_MODE:
            raise RuntimeError(
                "DEV_MODE is enabled but a production environment was detected. DEV_MODE "
                "exposes credential-free login (/auth/dev-login); set DEV_MODE=0 in prod."
            )


def assert_production_ready() -> None:
    """Re-run the prod-safety check against the live environment. Raises on failure."""
    Settings()


@lru_cache
def get_settings() -> Settings:
    """Process-wide cached settings."""
    return Settings()
