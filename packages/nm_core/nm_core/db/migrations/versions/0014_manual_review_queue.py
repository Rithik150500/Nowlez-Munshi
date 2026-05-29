"""manual_review_queue + cases.consecutive_failures

Revision ID: 0014
Revises: 0013
Create Date: 2026-05-29
"""
from __future__ import annotations

from collections.abc import Sequence

import sqlalchemy as sa
from alembic import op
from sqlalchemy.dialects import postgresql

revision: str = "0014"
down_revision: str | Sequence[str] | None = "0013"
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None


def upgrade() -> None:
    bind = op.get_bind()
    is_pg = bind.dialect.name == "postgresql"
    uuid_type = postgresql.UUID(as_uuid=True) if is_pg else sa.String(36)
    uuid_default = sa.text("gen_random_uuid()") if is_pg else None

    op.add_column(
        "cases",
        sa.Column("consecutive_failures", sa.Integer(), nullable=False, server_default="0"),
    )

    op.create_table(
        "manual_review_queue",
        sa.Column("id", uuid_type, primary_key=True, server_default=uuid_default),
        sa.Column("case_id", uuid_type,
                  sa.ForeignKey("cases.id", ondelete="CASCADE"), nullable=False),
        sa.Column("user_id", uuid_type,
                  sa.ForeignKey("users.id", ondelete="SET NULL"), nullable=True),
        sa.Column("cnr", sa.String(16), nullable=False),
        sa.Column("reason", sa.Text(), nullable=False),
        sa.Column("failure_count", sa.Integer(), nullable=False, server_default="0"),
        sa.Column("created_at", sa.DateTime(timezone=True),
                  nullable=False, server_default=sa.func.now()),
        sa.Column("resolved_at", sa.DateTime(timezone=True), nullable=True),
    )
    op.create_index(
        "manual_review_open_case_idx", "manual_review_queue", ["case_id"],
        unique=True, postgresql_where=sa.text("resolved_at IS NULL"),
        sqlite_where=sa.text("resolved_at IS NULL"),
    )


def downgrade() -> None:
    op.drop_index("manual_review_open_case_idx", table_name="manual_review_queue")
    op.drop_table("manual_review_queue")
    op.drop_column("cases", "consecutive_failures")
