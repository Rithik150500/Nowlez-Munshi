"""CNR validation + district/high-court classification (court-type code = cnr[2:4])."""
from __future__ import annotations

import re
from typing import Literal

from nm_core.ecourts.errors import CNRMalformed

CnrScope = Literal["district", "highcourt"]

CNR_REGEX = re.compile(r"^[A-Z]{2}[A-Z]{2}[A-Z0-9]{12}$")

STATE_CODES: dict[str, str] = {
    "AP": "Andhra Pradesh", "AR": "Arunachal Pradesh", "AS": "Assam", "BR": "Bihar",
    "CG": "Chhattisgarh", "DL": "Delhi", "GA": "Goa", "GJ": "Gujarat", "HR": "Haryana",
    "HP": "Himachal Pradesh", "JH": "Jharkhand", "KA": "Karnataka", "KL": "Kerala",
    "MP": "Madhya Pradesh", "MH": "Maharashtra", "MN": "Manipur", "ML": "Meghalaya",
    "MZ": "Mizoram", "NL": "Nagaland", "OR": "Odisha", "PB": "Punjab", "RJ": "Rajasthan",
    "SK": "Sikkim", "TN": "Tamil Nadu", "TG": "Telangana", "TR": "Tripura",
    "UP": "Uttar Pradesh", "UK": "Uttarakhand", "WB": "West Bengal", "JK": "Jammu and Kashmir",
    "LA": "Ladakh", "AN": "Andaman and Nicobar Islands", "CH": "Chandigarh",
    "DD": "Dadra and Nagar Haveli and Daman and Diu", "LD": "Lakshadweep", "PY": "Puducherry",
}

HC_ESTABLISHMENT_CODES: set[str] = {"HC"}


def validate_cnr_shape(cnr: str) -> None:
    """Raise CNRMalformed if shape or state code is invalid."""
    if not isinstance(cnr, str) or not CNR_REGEX.match(cnr):
        raise CNRMalformed(cnr=cnr, reason="failed regex [A-Z]{2}[A-Z]{2}[A-Z0-9]{12}")
    state = cnr[:2]
    if state not in STATE_CODES:
        raise CNRMalformed(cnr=cnr, reason=f"unknown state code '{state}'")


def classify_cnr(cnr: str) -> CnrScope:
    """Return 'district' or 'highcourt' from the court-type code (chars 2:4)."""
    validate_cnr_shape(cnr)
    return "highcourt" if cnr[2:4] in HC_ESTABLISHMENT_CODES else "district"
