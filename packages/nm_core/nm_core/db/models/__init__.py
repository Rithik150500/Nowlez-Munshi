"""Import every model so it registers on ``Base.metadata`` (Alembic + create_all)."""
from __future__ import annotations

from nm_core.db.models.audit import AuditLog
from nm_core.db.models.auth import AuthSession, OtpCode
from nm_core.db.models.case import Case, CaseOrder, CasePreference
from nm_core.db.models.user import User

__all__ = [
    "AuditLog",
    "AuthSession",
    "Case",
    "CaseOrder",
    "CasePreference",
    "OtpCode",
    "User",
]
