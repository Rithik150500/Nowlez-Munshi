"""Cross-channel notification dispatch + the in-app feed repository."""
from __future__ import annotations

from nm_core.notifications.dispatch import dispatch_change, dispatch_changes
from nm_core.notifications.repository import NotificationRepository

__all__ = ["NotificationRepository", "dispatch_change", "dispatch_changes"]
