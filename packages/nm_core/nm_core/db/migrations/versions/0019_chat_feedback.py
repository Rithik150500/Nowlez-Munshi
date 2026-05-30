"""chat_messages.feedback (thumbs up/down)

Revision ID: 0019
Revises: 0018
Create Date: 2026-05-29
"""
from __future__ import annotations

from collections.abc import Sequence

import sqlalchemy as sa
from alembic import op

revision: str = "0019"
down_revision: str | Sequence[str] | None = "0018"
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None


def upgrade() -> None:
    op.add_column("chat_messages", sa.Column("feedback", sa.Text(), nullable=True))


def downgrade() -> None:
    op.drop_column("chat_messages", "feedback")
