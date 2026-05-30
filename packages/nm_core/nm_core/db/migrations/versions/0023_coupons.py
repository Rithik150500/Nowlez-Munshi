"""coupon_codes

Revision ID: 0023
Revises: 0022
Create Date: 2026-05-30
"""
from __future__ import annotations

from collections.abc import Sequence

import sqlalchemy as sa
from alembic import op
from sqlalchemy.dialects import postgresql

revision: str = "0023"
down_revision: str | Sequence[str] | None = "0022"
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None


def upgrade() -> None:
    bind = op.get_bind()
    is_pg = bind.dialect.name == "postgresql"
    uuid_type = postgresql.UUID(as_uuid=True) if is_pg else sa.String(36)
    uuid_default = sa.text("gen_random_uuid()") if is_pg else None
    true_default = sa.text("true") if is_pg else sa.text("1")

    op.create_table(
        "coupon_codes",
        sa.Column("id", uuid_type, primary_key=True, server_default=uuid_default),
        sa.Column("code", sa.Text(), nullable=False, unique=True),
        sa.Column("discount_percent", sa.Integer(), nullable=False),
        sa.Column("max_uses", sa.Integer(), nullable=False, server_default="0"),
        sa.Column("current_uses", sa.Integer(), nullable=False, server_default="0"),
        sa.Column("valid_from", sa.DateTime(timezone=True), nullable=False),
        sa.Column("valid_until", sa.DateTime(timezone=True), nullable=False),
        sa.Column("is_active", sa.Boolean(), nullable=False, server_default=true_default),
        sa.Column("razorpay_offer_id", sa.Text(), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True),
                  nullable=False, server_default=sa.func.now()),
    )
    op.create_index("coupon_codes_code_idx", "coupon_codes", ["code"])


def downgrade() -> None:
    op.drop_index("coupon_codes_code_idx", table_name="coupon_codes")
    op.drop_table("coupon_codes")
