"""referrals: users.referral_code/referred_by + referrals table

Revision ID: 0024
Revises: 0023
Create Date: 2026-05-30
"""
from __future__ import annotations

from collections.abc import Sequence

import sqlalchemy as sa
from alembic import op
from sqlalchemy.dialects import postgresql

revision: str = "0024"
down_revision: str | Sequence[str] | None = "0023"
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None


def upgrade() -> None:
    bind = op.get_bind()
    is_pg = bind.dialect.name == "postgresql"
    uuid_type = postgresql.UUID(as_uuid=True) if is_pg else sa.String(36)
    uuid_default = sa.text("gen_random_uuid()") if is_pg else None
    false_default = sa.text("false") if is_pg else sa.text("0")

    op.add_column("users", sa.Column("referral_code", sa.String(16), nullable=True))
    op.add_column("users", sa.Column("referred_by", uuid_type, nullable=True))
    if is_pg:  # SQLite can't ALTER-ADD-CONSTRAINT; tests get uniqueness via create_all
        op.create_unique_constraint("users_referral_code_key", "users", ["referral_code"])

    op.create_table(
        "referrals",
        sa.Column("id", uuid_type, primary_key=True, server_default=uuid_default),
        sa.Column("referrer_id", uuid_type,
                  sa.ForeignKey("users.id", ondelete="CASCADE"), nullable=False),
        sa.Column("referred_id", uuid_type,
                  sa.ForeignKey("users.id", ondelete="CASCADE"), nullable=False),
        sa.Column("status", sa.Text(), nullable=False, server_default="pending"),
        sa.Column("reward_applied", sa.Boolean(), nullable=False, server_default=false_default),
        sa.Column("created_at", sa.DateTime(timezone=True),
                  nullable=False, server_default=sa.func.now()),
    )
    op.create_index("referrals_referrer_idx", "referrals", ["referrer_id"])


def downgrade() -> None:
    bind = op.get_bind()
    op.drop_index("referrals_referrer_idx", table_name="referrals")
    op.drop_table("referrals")
    if bind.dialect.name == "postgresql":
        op.drop_constraint("users_referral_code_key", "users", type_="unique")
    op.drop_column("users", "referred_by")
    op.drop_column("users", "referral_code")
