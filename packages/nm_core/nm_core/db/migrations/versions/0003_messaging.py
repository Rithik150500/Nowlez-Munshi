"""messaging: message_log, outbound_messages

Revision ID: 0003
Revises: 0002
Create Date: 2026-05-29
"""
from __future__ import annotations

from collections.abc import Sequence

import sqlalchemy as sa
from alembic import op
from sqlalchemy.dialects import postgresql

revision: str = "0003"
down_revision: str | Sequence[str] | None = "0002"
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None


def upgrade() -> None:
    bind = op.get_bind()
    is_pg = bind.dialect.name == "postgresql"
    uuid_type = postgresql.UUID(as_uuid=True) if is_pg else sa.String(36)
    uuid_default = sa.text("gen_random_uuid()") if is_pg else None

    op.create_table(
        "message_log",
        sa.Column("id", uuid_type, primary_key=True, server_default=uuid_default),
        sa.Column("meta_message_id", sa.Text(), nullable=False, unique=True),
        sa.Column("user_id", uuid_type, sa.ForeignKey("users.id", ondelete="SET NULL"), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.func.now()),
    )

    op.create_table(
        "outbound_messages",
        sa.Column("id", uuid_type, primary_key=True, server_default=uuid_default),
        sa.Column("user_id", uuid_type, sa.ForeignKey("users.id", ondelete="SET NULL"), nullable=True),
        sa.Column("to_phone", sa.Text(), nullable=False),
        sa.Column("kind", sa.Text(), nullable=False, server_default="text"),
        sa.Column("template_name", sa.Text(), nullable=True),
        sa.Column("send_date_ist", sa.Date(), nullable=True),
        sa.Column("dedup_key", sa.Text(), nullable=True),
        sa.Column("provider_message_id", sa.Text(), nullable=True),
        sa.Column("status", sa.Text(), nullable=False, server_default="pending"),
        sa.Column("error_code", sa.Text(), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.func.now()),
        sa.UniqueConstraint("user_id", "template_name", "send_date_ist", name="outbound_daily_slot_uq"),
    )
    op.create_index("outbound_messages_user_id_idx", "outbound_messages", ["user_id"])


def downgrade() -> None:
    op.drop_table("outbound_messages")
    op.drop_table("message_log")
