"""eCourts domain dataclasses for a fetched case."""
from __future__ import annotations

import json
from dataclasses import asdict, dataclass, field
from datetime import date
from typing import Literal

PartyRole = Literal["petitioner", "respondent", "complainant", "accused", "advocate", "other"]


@dataclass(frozen=True)
class Party:
    name: str
    role: PartyRole
    advocate: str | None = None


@dataclass(frozen=True)
class Act:
    act_name: str
    section: str | None = None


@dataclass(frozen=True)
class FIRDetails:
    fir_number: str
    police_station: str
    year: int


@dataclass(frozen=True)
class HearingHistoryRow:
    hearing_date: date
    purpose: str
    judge: str
    business_on_date: str | None = None


@dataclass(frozen=True)
class OrderRef:
    order_date: date
    order_url: str
    order_id: str


@dataclass(frozen=True)
class ObjectionDetails:
    raised_on: date
    objections: list[str]
    comply_by: date | None


@dataclass(frozen=True)
class CategoryDetails:
    category: str
    sub_category: str | None


@dataclass(frozen=True)
class CaseStub:
    """A search-result row — enough to follow up with fetch_case(cnr)."""

    cnr: str
    title: str
    case_number: str
    court: str
    filing_year: int | None = None
    stage: str | None = None


@dataclass(frozen=True)
class StateRef:
    code: str
    name: str
    national_code: str


@dataclass(frozen=True)
class DistrictRef:
    code: str
    name: str
    state_code: str


@dataclass(frozen=True)
class CourtComplexRef:
    code: str
    name: str
    state_code: str
    district_code: str
    est_code: str = ""


@dataclass(frozen=True)
class PoliceStationRef:
    code: str
    name: str
    district_code: str
    court_code: str
    uniform_code: int = 0


@dataclass(frozen=True)
class CaseTypeRef:
    code: str
    name: str
    court_code: str


@dataclass(frozen=True)
class BenchRef:
    code: str
    name: str
    state_code: str


@dataclass(frozen=True)
class HCBenchSitting:
    """A bench listed as sitting on a given date (causeListBenchWebService.php)."""
    code: str
    name: str
    state_code: str
    sitting_date: date


@dataclass(frozen=True)
class HCCauseListIndex:
    """A row of the HC cause-list index — points to a downloadable PDF."""
    sr_no: int
    bench: str
    list_type: str
    pdf_url: str


@dataclass(frozen=True)
class HCCauseListPDFRow:
    """A best-effort case row extracted from an HC cause-list PDF.

    ``raw_text`` is the reliable ground truth (full text bundle); ``case_number`` is
    a best-effort column split. ``cnr`` is filled later by back-resolution (HC PDFs
    print the case number, never the CNR)."""
    sr_no: int
    section: str
    case_number: str
    raw_text: str
    parties: str = ""
    advocates: str = ""


@dataclass(frozen=True)
class CauseListEntry:
    sr_no: int
    case_number: str
    cnr: str | None
    parties: str
    advocates: str | None
    section: str
    listed_on: date | None


@dataclass(frozen=True)
class CauseList:
    state_code: str
    district_code: str
    court_code: str
    court_no: str
    list_date: date
    flag: str
    judge: str | None
    entries: list[CauseListEntry] = field(default_factory=list)


@dataclass(frozen=True)
class DailyBusiness:
    cnr: str
    business_date: date
    business_text: str
    next_purpose: str | None
    next_hearing_date: date | None


@dataclass(frozen=True)
class Case:
    cnr: str
    title: str
    court: str
    stage: str
    next_hearing_date: date | None
    judge: str | None
    parties: list[Party] = field(default_factory=list)
    acts: list[Act] = field(default_factory=list)
    history: list[HearingHistoryRow] = field(default_factory=list)
    orders: list[OrderRef] = field(default_factory=list)
    fir: FIRDetails | None = None
    objections: ObjectionDetails | None = None
    category: CategoryDetails | None = None

    def to_json(self) -> str:
        return json.dumps(asdict(self), default=_json_default, sort_keys=True)

    @classmethod
    def from_json(cls, raw: str) -> Case:
        return _case_from_dict(json.loads(raw))


def _json_default(o: object) -> str:
    if isinstance(o, date):
        return o.isoformat()
    raise TypeError(f"Cannot JSON-encode {type(o).__name__}")


def _date(s: str | None) -> date | None:
    return date.fromisoformat(s) if s else None


def _case_from_dict(d: dict) -> Case:
    parties = [Party(**p) for p in d["parties"]]
    acts = [Act(**a) for a in d["acts"]]
    history = [
        HearingHistoryRow(**{**h, "hearing_date": _date(h["hearing_date"])}) for h in d["history"]
    ]
    orders = [OrderRef(**{**o, "order_date": _date(o["order_date"])}) for o in d["orders"]]
    fir = FIRDetails(**d["fir"]) if d.get("fir") else None
    objections: ObjectionDetails | None = None
    if d.get("objections"):
        raised = _date(d["objections"]["raised_on"])
        assert raised is not None
        objections = ObjectionDetails(
            raised_on=raised,
            objections=d["objections"]["objections"],
            comply_by=_date(d["objections"]["comply_by"]),
        )
    category = CategoryDetails(**d["category"]) if d.get("category") else None
    return Case(
        cnr=d["cnr"],
        title=d["title"],
        court=d["court"],
        stage=d["stage"],
        next_hearing_date=_date(d["next_hearing_date"]),
        judge=d["judge"],
        parties=parties,
        acts=acts,
        history=history,
        orders=orders,
        fir=fir,
        objections=objections,
        category=category,
    )
