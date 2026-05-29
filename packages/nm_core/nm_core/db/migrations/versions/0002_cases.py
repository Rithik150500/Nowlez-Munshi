"""cases: cases, case_orders, case_preferences

Revision ID: 0002
Revises: 0001
Create Date: 2026-05-29
"""
from __future__ import annotations

from collections.abc import Sequence

import sqlalchemy as sa
from alembic import op
from sqlalchemy.dialects import postgresql

revision: str = "0002"
down_revision: str | Sequence[str] | None = "0001"
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None


def upgrade() -> None:
    bind = op.get_bind()
    is_pg = bind.dialect.name == "postgresql"

    uuid_type = postgresql.UUID(as_uuid=True) if is_pg else sa.String(36)
    json_type = postgresql.JSONB() if is_pg else sa.JSON()
    uuid_default = sa.text("gen_random_uuid()") if is_pg else None
    true_default = sa.text("true") if is_pg else sa.text("1")
    json_list_default = sa.text("'[]'::jsonb") if is_pg else None
    json_obj_default = sa.text("'{}'::jsonb") if is_pg else None

    op.create_table(
        "cases",
        sa.Column("id", uuid_type, primary_key=True, server_default=uuid_default),
        sa.Column("user_id", uuid_type, sa.ForeignKey("users.id", ondelete="CASCADE"), nullable=False),
        sa.Column("cnr", sa.String(16), nullable=False),
        sa.Column("portal", sa.Text(), nullable=False),
        sa.Column("title", sa.Text(), nullable=True),
        sa.Column("court", sa.Text(), nullable=True),
        sa.Column("judge", sa.Text(), nullable=True),
        sa.Column("stage", sa.Text(), nullable=True),
        sa.Column("next_hearing_date", sa.Date(), nullable=True),
        sa.Column("parties", json_type, nullable=False, server_default=json_list_default),
        sa.Column("acts", json_type, nullable=False, server_default=json_list_default),
        sa.Column("history", json_type, nullable=False, server_default=json_list_default),
        sa.Column("raw_response", json_type, nullable=False, server_default=json_obj_default),
        sa.Column("added_via", sa.Text(), nullable=False, server_default="web"),
        sa.Column("notes", sa.Text(), nullable=True),
        sa.Column("refresh_enabled", sa.Boolean(), nullable=False, server_default=true_default),
        sa.Column("last_refreshed_at", sa.DateTime(timezone=True), nullable=True),
        sa.Column("last_change_at", sa.DateTime(timezone=True), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.func.now()),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.func.now()),
        sa.UniqueConstraint("user_id", "cnr", name="cases_user_cnr_unique"),
        sa.CheckConstraint("portal IN ('district', 'highcourt')", name="cases_portal_ck"),
    )
    op.create_index("cases_user_id_idx", "cases", ["user_id"])
    op.create_index("cases_cnr_idx", "cases", ["cnr"])
    op.create_index(
        "cases_next_hearing_date_idx",
        "cases",
        ["next_hearing_date"],
        postgresql_where=sa.text("next_hearing_date IS NOT NULL"),
    )
    op.create_index(
        "cases_refresh_queue_idx",
        "cases",
        ["refresh_enabled", "last_refreshed_at"],
        postgresql_where=sa.text("refresh_enabled IS TRUE"),
    )

    op.create_table(
        "case_orders",
        sa.Column("id", uuid_type, primary_key=True, server_default=uuid_default),
        sa.Column("case_id", uuid_type, sa.ForeignKey("cases.id", ondelete="CASCADE"), nullable=False),
        sa.Column("order_id", sa.Text(), nullable=False),
        sa.Column("order_date", sa.Date(), nullable=False),
        sa.Column("order_url", sa.Text(), nullable=True),
        sa.Column("descriptive_name", sa.Text(), nullable=True),
        sa.Column("summary", sa.Text(), nullable=True),
        sa.Column("file_path", sa.Text(), nullable=True),
        sa.Column("page_count", sa.Integer(), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.func.now()),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.func.now()),
        sa.UniqueConstraint("case_id", "order_id", name="case_orders_case_order_unique"),
    )
    op.create_index("case_orders_case_id_idx", "case_orders", ["case_id"])

    op.create_table(
        "case_preferences",
        sa.Column("user_id", uuid_type, sa.ForeignKey("users.id", ondelete="CASCADE"), nullable=False),
        sa.Column("cnr", sa.String(16), nullable=False),
        sa.Column("alert_level", sa.Text(), nullable=False, server_default="all"),
        sa.Column("snooze_until", sa.DateTime(timezone=True), nullable=True),
        sa.Column("digest_enabled", sa.Boolean(), nullable=False, server_default=true_default),
        sa.Column("label", sa.Text(), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.func.now()),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.func.now()),
        sa.PrimaryKeyConstraint("user_id", "cnr"),
        sa.CheckConstraint(
            "alert_level IN ('all', 'orders_only', 'hearings_only', 'digest_only')",
            name="case_preferences_alert_level_ck",
        ),
    )
    op.create_index("case_preferences_user_id_idx", "case_preferences", ["user_id"])


def downgrade() -> None:
    op.drop_table("case_preferences")
    op.drop_table("case_orders")
    op.drop_table("cases")
