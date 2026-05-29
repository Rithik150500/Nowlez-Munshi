"""eCourts integration: CNR routing, case fetch, PDF fetch, resilience, offline mode."""
from __future__ import annotations

from nm_core.ecourts import errors
from nm_core.ecourts.client import fetch_case, fetch_pdf, get_client_for
from nm_core.ecourts.models import (
    Act,
    Case,
    CategoryDetails,
    FIRDetails,
    HearingHistoryRow,
    ObjectionDetails,
    OrderRef,
    Party,
)
from nm_core.ecourts.routing import classify_cnr, validate_cnr_shape

__all__ = [
    "Act",
    "Case",
    "CategoryDetails",
    "FIRDetails",
    "HearingHistoryRow",
    "ObjectionDetails",
    "OrderRef",
    "Party",
    "classify_cnr",
    "errors",
    "fetch_case",
    "fetch_pdf",
    "get_client_for",
    "validate_cnr_shape",
]
