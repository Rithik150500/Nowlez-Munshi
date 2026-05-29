"""notifications

Revision ID: 0004
Revises: 0003
Create Date: 2026-05-29
"""
from __future__ import annotations

from collections.abc import Sequence

import sqlalchemy as sa
from alembic import op
from sqlalchemy.dialects import postgresql

revision: str = "0004"
down_revision: str | Sequence[str] | None = "0003"
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None


def upgrade() -> None:
    bind = op.get_bind()
    is_pg = bind.dialect.name == "postgresql"
    uuid_type = postgresql.UUID(as_uuid=True) if is_pg else sa.String(36)
    json_type = postgresql.JSONB() if is_pg else sa.JSON()
    uuid_default = sa.text("gen_random_uuid()") if is_pg else None
    json_list_default = sa.text("'[]'::jsonb") if is_pg else None

    op.create_table(
        "notifications",
        sa.Column("id", uuid_type, primary_key=True, server_default=uuid_default),
        sa.Column("user_id", uuid_type, sa.ForeignKey("users.id", ondelete="CASCADE"), nullable=False),
        sa.Column("case_id", uuid_type, sa.ForeignKey("cases.id", ondelete="SET NULL"), nullable=True),
        sa.Column("cnr", sa.String(16), nullable=True),
        sa.Column("type", sa.Text(), nullable=False),
        sa.Column("title", sa.Text(), nullable=False),
        sa.Column("body", sa.Text(), nullable=False),
        sa.Column("channels_sent", json_type, nullable=False, server_default=json_list_default),
        sa.Column("read_at", sa.DateTime(timezone=True), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.func.now()),
    )
    op.create_index("notifications_user_id_idx", "notifications", ["user_id", "created_at"])


def downgrade() -> None:
    op.drop_table("notifications")
