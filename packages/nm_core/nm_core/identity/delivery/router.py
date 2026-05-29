"""Delivery router: WhatsApp first, SMS fallback on failure."""
from __future__ import annotations

import logging

from nm_core.identity.delivery.sms import send_otp_sms
from nm_core.identity.delivery.whatsapp import send_otp_whatsapp
from nm_core.identity.errors import DeliveryFailed

logger = logging.getLogger(__name__)


def deliver_otp(phone: str, code: str) -> tuple[str, str]:
    """Returns ``(channel, provider_id)``. Raises ``DeliveryFailed`` only if both fail."""
    try:
        return "whatsapp", send_otp_whatsapp(phone, code)
    except DeliveryFailed as wa_err:
        logger.warning(
            "WhatsApp OTP delivery failed, falling back to SMS: %s", wa_err.provider_error
        )
        return "sms", send_otp_sms(phone, code)
