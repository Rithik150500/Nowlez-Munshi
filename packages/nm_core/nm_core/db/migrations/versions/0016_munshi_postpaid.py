"""munshi postpaid: users.billing_anniversary_day + munshi_invoices

Revision ID: 0016
Revises: 0015
Create Date: 2026-05-29
"""
from __future__ import annotations

from collections.abc import Sequence

import sqlalchemy as sa
from alembic import op
from sqlalchemy.dialects import postgresql

revision: str = "0016"
down_revision: str | Sequence[str] | None = "0015"
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None


def upgrade() -> None:
    bind = op.get_bind()
    is_pg = bind.dialect.name == "postgresql"
    uuid_type = postgresql.UUID(as_uuid=True) if is_pg else sa.String(36)
    uuid_default = sa.text("gen_random_uuid()") if is_pg else None

    op.add_column("users", sa.Column("billing_anniversary_day", sa.Integer(), nullable=True))

    op.create_table(
        "munshi_invoices",
        sa.Column("id", uuid_type, primary_key=True, server_default=uuid_default),
        sa.Column("user_id", uuid_type,
                  sa.ForeignKey("users.id", ondelete="CASCADE"), nullable=False),
        sa.Column("cycle_start", sa.DateTime(timezone=True), nullable=False),
        sa.Column("cycle_end", sa.DateTime(timezone=True), nullable=False),
        sa.Column("case_count", sa.Integer(), nullable=False, server_default="0"),
        sa.Column("amount_inr", sa.Integer(), nullable=False, server_default="0"),
        sa.Column("status", sa.Text(), nullable=False, server_default="pending"),
        sa.Column("provider_ref", sa.Text(), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True),
                  nullable=False, server_default=sa.func.now()),
        sa.Column("paid_at", sa.DateTime(timezone=True), nullable=True),
        sa.UniqueConstraint("user_id", "cycle_end", name="munshi_invoices_cycle_uq"),
    )


def downgrade() -> None:
    op.drop_table("munshi_invoices")
    op.drop_column("users", "billing_anniversary_day")
