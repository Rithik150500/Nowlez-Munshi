"""universal search: documents.{case_id,document_type,retry_count,permanently_failed}
+ Postgres search_tsv generated columns/GIN on documents, cases, case_orders

Revision ID: 0020
Revises: 0019
Create Date: 2026-05-29
"""
from __future__ import annotations

from collections.abc import Sequence

import sqlalchemy as sa
from alembic import op
from sqlalchemy.dialects import postgresql

revision: str = "0020"
down_revision: str | Sequence[str] | None = "0019"
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None

# Postgres-only: generated tsvector columns + GIN indexes. SQLite uses a LIKE
# fallback in nm_core.search, so it gets none of these (guarded by is_pg).
_TSV = {
    "documents": (
        "coalesce(title,'') || ' ' || coalesce(filename,'') || ' ' || "
        "coalesce(summary,'') || ' ' || coalesce(extracted_text,'')"
    ),
    "cases": (
        "coalesce(title,'') || ' ' || coalesce(cnr,'') || ' ' || "
        "coalesce(court,'') || ' ' || coalesce(judge,'')"
    ),
    "case_orders": "coalesce(descriptive_name,'') || ' ' || coalesce(summary,'')",
}


def upgrade() -> None:
    bind = op.get_bind()
    is_pg = bind.dialect.name == "postgresql"

    # Columns that back the document library + AI auto-classify (features 2/3).
    uuid_type = postgresql.UUID(as_uuid=True) if is_pg else sa.String(36)
    op.add_column("documents", sa.Column("case_id", uuid_type, nullable=True))
    op.add_column("documents", sa.Column("document_type", sa.Text(), nullable=True))
    op.add_column("documents", sa.Column(
        "retry_count", sa.Integer(), nullable=False, server_default="0"))
    op.add_column("documents", sa.Column(
        "permanently_failed", sa.Boolean(), nullable=False, server_default=sa.text(
            "false" if is_pg else "0")))
    op.create_index("documents_case_id_idx", "documents", ["case_id"])

    if not is_pg:
        # SQLite (tests): no ALTER-ADD-CONSTRAINT support and no tsvector/GIN.
        # The FK is enforced in prod (Postgres) below; search uses the LIKE fallback.
        return
    op.create_foreign_key(
        "documents_case_id_fkey", "documents", "cases", ["case_id"], ["id"],
        ondelete="SET NULL",
    )

    for table, expr in _TSV.items():
        op.execute(
            f"ALTER TABLE {table} ADD COLUMN search_tsv tsvector "
            f"GENERATED ALWAYS AS (to_tsvector('english', {expr})) STORED"
        )
        op.execute(f"CREATE INDEX {table}_search_tsv_idx ON {table} USING gin(search_tsv)")


def downgrade() -> None:
    bind = op.get_bind()
    is_pg = bind.dialect.name == "postgresql"
    if is_pg:
        for table in _TSV:
            op.execute(f"DROP INDEX IF EXISTS {table}_search_tsv_idx")
            op.execute(f"ALTER TABLE {table} DROP COLUMN IF EXISTS search_tsv")
        op.drop_constraint("documents_case_id_fkey", "documents", type_="foreignkey")
    op.drop_index("documents_case_id_idx", table_name="documents")
    for col in ("permanently_failed", "retry_count", "document_type", "case_id"):
        op.drop_column("documents", col)
