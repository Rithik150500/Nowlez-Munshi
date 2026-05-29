"""document upload/processing columns

Revision ID: 0011
Revises: 0010
Create Date: 2026-05-29
"""
from __future__ import annotations

from collections.abc import Sequence

import sqlalchemy as sa
from alembic import op

revision: str = "0011"
down_revision: str | Sequence[str] | None = "0010"
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None


def upgrade() -> None:
    op.add_column("documents", sa.Column("kind", sa.Text(), nullable=False, server_default="draft"))
    op.add_column("documents", sa.Column("content_type", sa.Text(), nullable=True))
    op.add_column("documents", sa.Column("extracted_text", sa.Text(), nullable=True))
    op.add_column("documents", sa.Column("summary", sa.Text(), nullable=True))
    op.add_column("documents", sa.Column("page_count", sa.Integer(), nullable=True))
    op.add_column("documents", sa.Column("status", sa.Text(), nullable=False, server_default="ready"))


def downgrade() -> None:
    for col in ("status", "page_count", "summary", "extracted_text", "content_type", "kind"):
        op.drop_column("documents", col)
