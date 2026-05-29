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
