"""chat: chat_threads, chat_messages

Revision ID: 0005
Revises: 0004
Create Date: 2026-05-29
"""
from __future__ import annotations

from collections.abc import Sequence

import sqlalchemy as sa
from alembic import op
from sqlalchemy.dialects import postgresql

revision: str = "0005"
down_revision: str | Sequence[str] | None = "0004"
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
        "chat_threads",
        sa.Column("id", uuid_type, primary_key=True, server_default=uuid_default),
        sa.Column("user_id", uuid_type, sa.ForeignKey("users.id", ondelete="CASCADE"), nullable=False),
        sa.Column("channel", sa.Text(), nullable=False, server_default="web"),
        sa.Column("title", sa.Text(), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.func.now()),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.func.now()),
    )
    op.create_index("chat_threads_user_id_idx", "chat_threads", ["user_id", "updated_at"])

    op.create_table(
        "chat_messages",
        sa.Column("id", uuid_type, primary_key=True, server_default=uuid_default),
        sa.Column("thread_id", uuid_type, sa.ForeignKey("chat_threads.id", ondelete="CASCADE"), nullable=False),
        sa.Column("role", sa.Text(), nullable=False),
        sa.Column("content", sa.Text(), nullable=False),
        sa.Column("citations", json_type, nullable=False, server_default=json_list_default),
        sa.Column("tool_calls", json_type, nullable=False, server_default=json_list_default),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.func.now()),
    )
    op.create_index("chat_messages_thread_id_idx", "chat_messages", ["thread_id", "created_at"])


def downgrade() -> None:
    op.drop_table("chat_messages")
    op.drop_table("chat_threads")
