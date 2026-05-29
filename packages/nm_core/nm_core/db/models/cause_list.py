"""Indexed HC cause-list rows.

Populated nightly by the indexer from each sitting bench's cause-list PDF. ``cnr``
is filled by best-effort back-resolution (HC PDFs print the case number, never the
CNR); rows that can't be resolved keep ``cnr = NULL`` and simply don't join to a
tracked case in the digest."""
from __future__ import annotations

import uuid
from datetime import date, datetime

from sqlalchemy import Date, DateTime, Index, Integer, String, Text, UniqueConstraint, func
from sqlalchemy.orm import Mapped, mapped_column

from nm_core.db.base import Base
from nm_core.db.types import UUIDType


class CauseListRow(Base):
    __tablename__ = "cause_list_rows"

    id: Mapped[uuid.UUID] = mapped_column(UUIDType, primary_key=True, default=uuid.uuid4)
    state_code: Mapped[str] = mapped_column(String(8), nullable=False)
    court_code: Mapped[str] = mapped_column(String(32), nullable=False)
    bench_id: Mapped[str] = mapped_column(String(64), nullable=False)
    list_date: Mapped[date] = mapped_column(Date, nullable=False)
    sr_no: Mapped[int] = mapped_column(Integer, nullable=False)
    section: Mapped[str] = mapped_column(Text, nullable=False, default="DEFAULT")
    case_number: Mapped[str] = mapped_column(Text, nullable=False, default="")
    cnr: Mapped[str | None] = mapped_column(String(16), nullable=True)
    raw_text: Mapped[str] = mapped_column(Text, nullable=False, default="")
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=False, server_default=func.now()
    )

    __table_args__ = (
        UniqueConstraint("bench_id", "list_date", "sr_no", name="cause_list_rows_uq"),
        Index("cause_list_rows_date_cnr_idx", "list_date", "cnr"),
    )
