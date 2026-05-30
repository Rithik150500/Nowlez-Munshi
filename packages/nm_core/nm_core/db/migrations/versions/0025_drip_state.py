"""user_drip_state (lifecycle drip)

Revision ID: 0025
Revises: 0024
Create Date: 2026-05-30
"""
from __future__ import annotations

from collections.abc import Sequence

import sqlalchemy as sa
from alembic import op
from sqlalchemy.dialects import postgresql

revision: str = "0025"
down_revision: str | Sequence[str] | None = "0024"
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None


def upgrade() -> None:
    bind = op.get_bind()
    is_pg = bind.dialect.name == "postgresql"
    uuid_type = postgresql.UUID(as_uuid=True) if is_pg else sa.String(36)
    false_default = sa.text("false") if is_pg else sa.text("0")

    op.create_table(
        "user_drip_state",
        sa.Column("user_id", uuid_type,
                  sa.ForeignKey("users.id", ondelete="CASCADE"), primary_key=True),
        sa.Column("track_today", sa.Text(), nullable=True),
        sa.Column("became_active_at", sa.DateTime(timezone=True), nullable=True),
        sa.Column("last_step_sent_day", sa.Integer(), nullable=False, server_default="-1"),
        sa.Column("catch_up_pending", sa.Boolean(), nullable=False,
                  server_default=false_default),
        sa.Column("catch_up_sent_at", sa.DateTime(timezone=True), nullable=True),
        sa.Column("terminal", sa.Boolean(), nullable=False, server_default=false_default),
        sa.Column("last_evaluated_at", sa.DateTime(timezone=True), nullable=True),
    )
    op.create_index("user_drip_state_terminal_idx", "user_drip_state", ["terminal"])

    # Backfill one row per existing user.
    op.execute("INSERT INTO user_drip_state (user_id) SELECT id FROM users")


def downgrade() -> None:
    op.drop_index("user_drip_state_terminal_idx", table_name="user_drip_state")
    op.drop_table("user_drip_state")
