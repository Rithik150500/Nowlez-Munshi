"""accounts: accounts, memberships

Revision ID: 0006
Revises: 0005
Create Date: 2026-05-29
"""
from __future__ import annotations

from collections.abc import Sequence

import sqlalchemy as sa
from alembic import op
from sqlalchemy.dialects import postgresql

revision: str = "0006"
down_revision: str | Sequence[str] | None = "0005"
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None


def upgrade() -> None:
    bind = op.get_bind()
    is_pg = bind.dialect.name == "postgresql"
    uuid_type = postgresql.UUID(as_uuid=True) if is_pg else sa.String(36)
    uuid_default = sa.text("gen_random_uuid()") if is_pg else None
    true_default = sa.text("true") if is_pg else sa.text("1")

    op.create_table(
        "accounts",
        sa.Column("id", uuid_type, primary_key=True, server_default=uuid_default),
        sa.Column("name", sa.Text(), nullable=False),
        sa.Column("owner_user_id", uuid_type, sa.ForeignKey("users.id", ondelete="CASCADE"), nullable=False),
        sa.Column("is_personal", sa.Boolean(), nullable=False, server_default=true_default),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.func.now()),
    )
    op.create_index("accounts_owner_idx", "accounts", ["owner_user_id"])

    op.create_table(
        "memberships",
        sa.Column("account_id", uuid_type, sa.ForeignKey("accounts.id", ondelete="CASCADE"), nullable=False),
        sa.Column("user_id", uuid_type, sa.ForeignKey("users.id", ondelete="CASCADE"), nullable=False),
        sa.Column("role", sa.Text(), nullable=False, server_default="owner"),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.func.now()),
        sa.PrimaryKeyConstraint("account_id", "user_id"),
        sa.CheckConstraint("role IN ('owner', 'editor', 'viewer')", name="memberships_role_ck"),
    )
    op.create_index("memberships_user_idx", "memberships", ["user_id"])


def downgrade() -> None:
    op.drop_table("memberships")
    op.drop_table("accounts")
