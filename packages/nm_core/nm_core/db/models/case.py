"""Case tracking models: Case, CaseOrder, CasePreference (single-User, brand-neutral)."""
from __future__ import annotations

import uuid
from datetime import date, datetime

from sqlalchemy import (
    Boolean,
    CheckConstraint,
    Date,
    DateTime,
    ForeignKey,
    Index,
    Integer,
    String,
    Text,
    UniqueConstraint,
    func,
    text,
)
from sqlalchemy.orm import Mapped, mapped_column, relationship

from nm_core.db.base import Base
from nm_core.db.types import JSONBType, UUIDType


class Case(Base):
    __tablename__ = "cases"

    id: Mapped[uuid.UUID] = mapped_column(UUIDType, primary_key=True, default=uuid.uuid4)
    user_id: Mapped[uuid.UUID] = mapped_column(
        UUIDType, ForeignKey("users.id", ondelete="CASCADE"), nullable=False
    )
    cnr: Mapped[str] = mapped_column(String(16), nullable=False)
    portal: Mapped[str] = mapped_column(Text, nullable=False)
    title: Mapped[str | None] = mapped_column(Text, nullable=True)
    court: Mapped[str | None] = mapped_column(Text, nullable=True)
    judge: Mapped[str | None] = mapped_column(Text, nullable=True)
    stage: Mapped[str | None] = mapped_column(Text, nullable=True)
    next_hearing_date: Mapped[date | None] = mapped_column(Date, nullable=True)
    parties: Mapped[list] = mapped_column(JSONBType, nullable=False, default=list)
    acts: Mapped[list] = mapped_column(JSONBType, nullable=False, default=list)
    history: Mapped[list] = mapped_column(JSONBType, nullable=False, default=list)
    raw_response: Mapped[dict] = mapped_column(JSONBType, nullable=False, default=dict)
    added_via: Mapped[str] = mapped_column(
        Text, nullable=False, default="web", server_default="web"
    )
    notes: Mapped[str | None] = mapped_column(Text, nullable=True)
    refresh_enabled: Mapped[bool] = mapped_column(
        Boolean, nullable=False, default=True, server_default=text("true")
    )
    last_refreshed_at: Mapped[datetime | None] = mapped_column(
        DateTime(timezone=True), nullable=True
    )
    last_change_at: Mapped[datetime | None] = mapped_column(
        DateTime(timezone=True), nullable=True
    )
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=False, server_default=func.now()
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=False, server_default=func.now(), onupdate=func.now()
    )

    orders: Mapped[list[CaseOrder]] = relationship(
        "CaseOrder", back_populates="case", cascade="all, delete-orphan"
    )

    __table_args__ = (
        UniqueConstraint("user_id", "cnr", name="cases_user_cnr_unique"),
        CheckConstraint("portal IN ('district', 'highcourt')", name="cases_portal_ck"),
        Index("cases_user_id_idx", "user_id"),
        Index("cases_cnr_idx", "cnr"),
        Index(
            "cases_next_hearing_date_idx",
            "next_hearing_date",
            postgresql_where=text("next_hearing_date IS NOT NULL"),
        ),
        # The refresh sweep's primary access path.
        Index(
            "cases_refresh_queue_idx",
            "refresh_enabled",
            "last_refreshed_at",
            postgresql_where=text("refresh_enabled IS TRUE"),
        ),
    )


class CaseOrder(Base):
    __tablename__ = "case_orders"

    id: Mapped[uuid.UUID] = mapped_column(UUIDType, primary_key=True, default=uuid.uuid4)
    case_id: Mapped[uuid.UUID] = mapped_column(
        UUIDType, ForeignKey("cases.id", ondelete="CASCADE"), nullable=False
    )
    order_id: Mapped[str] = mapped_column(Text, nullable=False)
    order_date: Mapped[date] = mapped_column(Date, nullable=False)
    order_url: Mapped[str | None] = mapped_column(Text, nullable=True)
    descriptive_name: Mapped[str | None] = mapped_column(Text, nullable=True)
    summary: Mapped[str | None] = mapped_column(Text, nullable=True)
    file_path: Mapped[str | None] = mapped_column(Text, nullable=True)
    page_count: Mapped[int | None] = mapped_column(Integer, nullable=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=False, server_default=func.now()
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=False, server_default=func.now(), onupdate=func.now()
    )

    case: Mapped[Case] = relationship("Case", back_populates="orders")

    __table_args__ = (
        UniqueConstraint("case_id", "order_id", name="case_orders_case_order_unique"),
        Index("case_orders_case_id_idx", "case_id"),
    )


class CasePreference(Base):
    __tablename__ = "case_preferences"

    user_id: Mapped[uuid.UUID] = mapped_column(
        UUIDType, ForeignKey("users.id", ondelete="CASCADE"), primary_key=True
    )
    cnr: Mapped[str] = mapped_column(String(16), primary_key=True)
    alert_level: Mapped[str] = mapped_column(
        Text, nullable=False, default="all", server_default="all"
    )
    snooze_until: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    digest_enabled: Mapped[bool] = mapped_column(
        Boolean, nullable=False, default=True, server_default=text("true")
    )
    label: Mapped[str | None] = mapped_column(Text, nullable=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=False, server_default=func.now()
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=False, server_default=func.now(), onupdate=func.now()
    )

    __table_args__ = (
        CheckConstraint(
            "alert_level IN ('all', 'orders_only', 'hearings_only', 'digest_only')",
            name="case_preferences_alert_level_ck",
        ),
        Index("case_preferences_user_id_idx", "user_id"),
        # SQLAlchemy 2.0 composite-PK INSERT batching bug workaround on SQLite.
        {"implicit_returning": False},
    )
