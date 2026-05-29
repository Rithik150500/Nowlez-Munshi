"""payment_events (Razorpay webhook replay idempotency)

Revision ID: 0018
Revises: 0017
Create Date: 2026-05-29
"""
from __future__ import annotations

from collections.abc import Sequence

import sqlalchemy as sa
from alembic import op
from sqlalchemy.dialects import postgresql

revision: str = "0018"
down_revision: str | Sequence[str] | None = "0017"
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None


def upgrade() -> None:
    bind = op.get_bind()
    is_pg = bind.dialect.name == "postgresql"
    uuid_type = postgresql.UUID(as_uuid=True) if is_pg else sa.String(36)
    uuid_default = sa.text("gen_random_uuid()") if is_pg else None

    op.create_table(
        "payment_events",
        sa.Column("id", uuid_type, primary_key=True, server_default=uuid_default),
        sa.Column("event_id", sa.String(128), nullable=False, unique=True),
        sa.Column("event_type", sa.Text(), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True),
                  nullable=False, server_default=sa.func.now()),
    )


def downgrade() -> None:
    op.drop_table("payment_events")
