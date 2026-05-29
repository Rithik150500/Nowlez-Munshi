"""The Munshi brain: agentic, channel-agnostic ask() over the user's case book."""
from __future__ import annotations

from nm_core.ai.repository import ChatRepository
from nm_core.ai.service import ask
from nm_core.ai.types import Answer, Citation

__all__ = ["Answer", "ChatRepository", "Citation", "ask"]
