"""Import every model so it registers on ``Base.metadata`` (Alembic + create_all)."""
from __future__ import annotations

from nm_core.db.models.account import Account, Membership
from nm_core.db.models.audit import AuditLog
from nm_core.db.models.auth import AuthSession, OtpCode
from nm_core.db.models.billing import Subscription
from nm_core.db.models.case import Case, CaseOrder, CasePreference
from nm_core.db.models.chat import ChatMessage, ChatThread
from nm_core.db.models.messaging import MessageLog, OutboundMessage
from nm_core.db.models.notification import Notification
from nm_core.db.models.user import User

__all__ = [
    "Account",
    "AuditLog",
    "AuthSession",
    "Case",
    "CaseOrder",
    "CasePreference",
    "ChatMessage",
    "ChatThread",
    "MessageLog",
    "Membership",
    "Notification",
    "OutboundMessage",
    "OtpCode",
    "Subscription",
    "User",
]
