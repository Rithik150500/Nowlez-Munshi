"""cause_list_rows (indexed HC cause-list rows)

Revision ID: 0015
Revises: 0014
Create Date: 2026-05-29
"""
from __future__ import annotations

from collections.abc import Sequence

import sqlalchemy as sa
from alembic import op
from sqlalchemy.dialects import postgresql

revision: str = "0015"
down_revision: str | Sequence[str] | None = "0014"
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None


def upgrade() -> None:
    bind = op.get_bind()
    is_pg = bind.dialect.name == "postgresql"
    uuid_type = postgresql.UUID(as_uuid=True) if is_pg else sa.String(36)
    uuid_default = sa.text("gen_random_uuid()") if is_pg else None

    op.create_table(
        "cause_list_rows",
        sa.Column("id", uuid_type, primary_key=True, server_default=uuid_default),
        sa.Column("state_code", sa.String(8), nullable=False),
        sa.Column("court_code", sa.String(32), nullable=False),
        sa.Column("bench_id", sa.String(64), nullable=False),
        sa.Column("list_date", sa.Date(), nullable=False),
        sa.Column("sr_no", sa.Integer(), nullable=False),
        sa.Column("section", sa.Text(), nullable=False, server_default="DEFAULT"),
        sa.Column("case_number", sa.Text(), nullable=False, server_default=""),
        sa.Column("cnr", sa.String(16), nullable=True),
        sa.Column("raw_text", sa.Text(), nullable=False, server_default=""),
        sa.Column("created_at", sa.DateTime(timezone=True),
                  nullable=False, server_default=sa.func.now()),
        sa.UniqueConstraint("bench_id", "list_date", "sr_no", name="cause_list_rows_uq"),
    )
    op.create_index("cause_list_rows_date_cnr_idx", "cause_list_rows", ["list_date", "cnr"])


def downgrade() -> None:
    op.drop_index("cause_list_rows_date_cnr_idx", table_name="cause_list_rows")
    op.drop_table("cause_list_rows")
