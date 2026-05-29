"""baseline: users, otp_codes, auth_sessions, audit_log

Revision ID: 0001
Revises:
Create Date: 2026-05-29
"""
from __future__ import annotations

from collections.abc import Sequence

import sqlalchemy as sa
from alembic import op
from sqlalchemy.dialects import postgresql

revision: str = "0001"
down_revision: str | Sequence[str] | None = None
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None


def upgrade() -> None:
    bind = op.get_bind()
    is_pg = bind.dialect.name == "postgresql"

    uuid_type = postgresql.UUID(as_uuid=True) if is_pg else sa.String(36)
    json_type = postgresql.JSONB() if is_pg else sa.JSON()
    inet_type = postgresql.INET() if is_pg else sa.String(45)
    uuid_default = sa.text("gen_random_uuid()") if is_pg else None
    true_default = sa.text("true") if is_pg else sa.text("1")
    json_obj_default = sa.text("'{}'::jsonb") if is_pg else None

    # --- users ---
    op.create_table(
        "users",
        sa.Column("id", uuid_type, primary_key=True, server_default=uuid_default),
        sa.Column("phone", sa.String(20), unique=True, nullable=True),
        sa.Column("email", sa.String(254), unique=True, nullable=True),
        sa.Column("name", sa.Text(), nullable=True),
        sa.Column("password_hash", sa.Text(), nullable=True),
        sa.Column("locale", sa.String(8), nullable=False, server_default="en"),
        sa.Column("timezone", sa.String(64), nullable=False, server_default="Asia/Kolkata"),
        sa.Column("is_active", sa.Boolean(), nullable=False, server_default=true_default),
        sa.Column("last_login_at", sa.DateTime(timezone=True), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.func.now()),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.func.now()),
    )
    op.create_index("users_phone_idx", "users", ["phone"], postgresql_where=sa.text("phone IS NOT NULL"))
    op.create_index("users_email_idx", "users", ["email"], postgresql_where=sa.text("email IS NOT NULL"))

    # --- otp_codes ---
    op.create_table(
        "otp_codes",
        sa.Column("id", uuid_type, primary_key=True, server_default=uuid_default),
        sa.Column("phone", sa.String(20), nullable=False),
        sa.Column("code_hash", sa.Text(), nullable=False),
        sa.Column("channel", sa.Text(), nullable=False),
        sa.Column("delivery_status", sa.Text(), nullable=False, server_default="pending"),
        sa.Column("delivery_provider_id", sa.Text(), nullable=True),
        sa.Column("attempts_remaining", sa.SmallInteger(), nullable=False, server_default="3"),
        sa.Column("expires_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.func.now()),
        sa.Column("used_at", sa.DateTime(timezone=True), nullable=True),
        sa.Column("ip_address", inet_type, nullable=True),
        sa.CheckConstraint("channel IN ('whatsapp', 'sms')", name="otp_codes_channel_ck"),
        sa.CheckConstraint(
            "delivery_status IN ('pending', 'delivered', 'failed')",
            name="otp_codes_delivery_status_ck",
        ),
    )
    op.create_index("otp_codes_phone_idx", "otp_codes", ["phone"], postgresql_where=sa.text("used_at IS NULL"))
    op.create_index(
        "otp_codes_expires_at_idx", "otp_codes", ["expires_at"], postgresql_where=sa.text("used_at IS NULL")
    )

    # --- auth_sessions ---
    op.create_table(
        "auth_sessions",
        sa.Column("id", uuid_type, primary_key=True, server_default=uuid_default),
        sa.Column("user_id", uuid_type, sa.ForeignKey("users.id", ondelete="CASCADE"), nullable=False),
        sa.Column("refresh_token_hash", sa.Text(), nullable=False, unique=True),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.func.now()),
        sa.Column("expires_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("last_used_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.func.now()),
        sa.Column("user_agent", sa.Text(), nullable=True),
        sa.Column("ip_address", inet_type, nullable=True),
        sa.Column("revoked_at", sa.DateTime(timezone=True), nullable=True),
    )
    op.create_index(
        "auth_sessions_user_id_idx", "auth_sessions", ["user_id"], postgresql_where=sa.text("revoked_at IS NULL")
    )
    op.create_index(
        "auth_sessions_expires_at_idx",
        "auth_sessions",
        ["expires_at"],
        postgresql_where=sa.text("revoked_at IS NULL"),
    )

    # --- audit_log ---
    op.create_table(
        "audit_log",
        sa.Column("id", uuid_type, primary_key=True, server_default=uuid_default),
        sa.Column("event_type", sa.Text(), nullable=False),
        sa.Column("user_id", uuid_type, sa.ForeignKey("users.id", ondelete="SET NULL"), nullable=True),
        sa.Column("actor_id", uuid_type, sa.ForeignKey("users.id", ondelete="SET NULL"), nullable=True),
        sa.Column("source", sa.Text(), nullable=False),
        sa.Column("metadata", json_type, nullable=False, server_default=json_obj_default),
        sa.Column("ip_address", inet_type, nullable=True),
        sa.Column("user_agent", sa.Text(), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.func.now()),
    )
    op.create_index("audit_log_event_type_idx", "audit_log", ["event_type", "created_at"])
    op.create_index("audit_log_user_id_idx", "audit_log", ["user_id", "created_at"])


def downgrade() -> None:
    op.drop_table("audit_log")
    op.drop_table("auth_sessions")
    op.drop_table("otp_codes")
    op.drop_table("users")
