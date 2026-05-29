"""OTP delivery: WhatsApp-first with SMS fallback. Self-contained for M1.

Migrates onto ``nm_core.messaging`` in M3 behind the same ``deliver_otp`` interface.
"""
from __future__ import annotations

from nm_core.identity.delivery.router import deliver_otp

__all__ = ["deliver_otp"]
