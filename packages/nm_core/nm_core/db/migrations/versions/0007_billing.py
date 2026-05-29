"""billing: subscriptions (built, not enforced)

Revision ID: 0007
Revises: 0006
Create Date: 2026-05-29
"""
from __future__ import annotations

from collections.abc import Sequence

import sqlalchemy as sa
from alembic import op
from sqlalchemy.dialects import postgresql

revision: str = "0007"
down_revision: str | Sequence[str] | None = "0006"
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None


def upgrade() -> None:
    bind = op.get_bind()
    is_pg = bind.dialect.name == "postgresql"
    uuid_type = postgresql.UUID(as_uuid=True) if is_pg else sa.String(36)
    uuid_default = sa.text("gen_random_uuid()") if is_pg else None

    op.create_table(
        "subscriptions",
        sa.Column("id", uuid_type, primary_key=True, server_default=uuid_default),
        sa.Column("account_id", uuid_type, sa.ForeignKey("accounts.id", ondelete="CASCADE"), nullable=False),
        sa.Column("tier", sa.Text(), nullable=False, server_default="free"),
        sa.Column("status", sa.Text(), nullable=False, server_default="active"),
        sa.Column("provider_ref", sa.Text(), nullable=True),
        sa.Column("period_start", sa.DateTime(timezone=True), nullable=True),
        sa.Column("period_end", sa.DateTime(timezone=True), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.func.now()),
        sa.CheckConstraint("tier IN ('free', 'advocate', 'counsel', 'chambers')", name="subscriptions_tier_ck"),
    )
    op.create_index("subscriptions_account_idx", "subscriptions", ["account_id"])


def downgrade() -> None:
    op.drop_table("subscriptions")
