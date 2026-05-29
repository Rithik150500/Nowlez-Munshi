"""Parse a caseHistoryWebService.php / filingCaseHistory.php response into a Case."""
from __future__ import annotations

from datetime import date, datetime
from typing import Any

from bs4 import BeautifulSoup

from nm_core.ecourts.errors import SchemaChanged
from nm_core.ecourts.models import Act, Case, HearingHistoryRow, OrderRef, Party


def parse_case_history(response: dict[str, Any], cnr: str) -> Case:
    if not isinstance(response, dict):
        raise SchemaChanged(
            field="response", reason=f"expected dict, got {type(response).__name__}"
        )
    history = response.get("history")
    if not isinstance(history, dict):
        raise SchemaChanged(
            field="response.history", reason=f"expected dict, got {type(history).__name__}"
        )

    return Case(
        cnr=cnr,
        title=_build_title(history),
        court=_build_court(history),
        stage=(history.get("purpose_name") or "").strip() or "Unknown",
        next_hearing_date=_parse_date(history.get("date_next_list")),
        judge=(history.get("desgname") or "").strip() or None,
        parties=_build_parties(history),
        acts=_parse_acts_html(history.get("act") or ""),
        history=_parse_history_html(history.get("historyOfCaseHearing") or ""),
        orders=(
            _parse_orders_html(history.get("interimOrder") or "")
            + _parse_orders_html(history.get("finalOrder") or "")
        ),
    )


def _build_title(h: dict[str, Any]) -> str:
    pet = (h.get("pet_name") or "").strip()
    res = (h.get("res_name") or "").strip()
    if pet and res:
        return f"{pet} vs {res}"
    return pet or res or "(unknown title)"


def _build_court(h: dict[str, Any]) -> str:
    parts = [
        (h.get("court_name") or "").strip(),
        (h.get("district_name") or "").strip(),
        (h.get("state_name") or "").strip(),
    ]
    return ", ".join(p for p in parts if p) or "(unknown court)"


def _parse_date(s: Any) -> date | None:
    if not isinstance(s, str):
        return None
    s = s.strip()
    if not s or s.lower() in ("date not given", "null", "none"):
        return None
    for fmt in ("%Y-%m-%d", "%d-%m-%Y"):
        try:
            return datetime.strptime(s, fmt).date()
        except ValueError:
            continue
    return None


def _build_parties(h: dict[str, Any]) -> list[Party]:
    parties: list[Party] = []
    if pet_name := (h.get("pet_name") or "").strip():
        pet_adv = (h.get("pet_adv") or "").strip() or None
        parties.append(Party(name=pet_name, role="petitioner", advocate=pet_adv))
    if res_name := (h.get("res_name") or "").strip():
        res_adv = (h.get("res_adv") or "").strip() or None
        parties.append(Party(name=res_name, role="respondent", advocate=res_adv))
    return parties


def _parse_acts_html(html: str) -> list[Act]:
    if not html:
        return []
    soup = BeautifulSoup(html, "lxml")
    acts: list[Act] = []
    for tr in soup.find_all("tr"):
        cells = [c.get_text(strip=True) for c in tr.find_all("td")]
        if len(cells) >= 2 and cells[0] and cells[0].lower() not in ("under act(s)", ""):
            acts.append(Act(act_name=cells[0], section=cells[1] or None))
    return acts


def _parse_history_html(html: str) -> list[HearingHistoryRow]:
    if not html:
        return []
    soup = BeautifulSoup(html, "lxml")
    rows: list[HearingHistoryRow] = []
    for tr in soup.find_all("tr"):
        cells = tr.find_all("td")
        if len(cells) < 4:
            continue
        judge = cells[0].get_text(strip=True)
        business_text = cells[1].get_text(strip=True)
        hearing_date = _parse_date(cells[2].get_text(strip=True)) or _parse_date(business_text)
        if hearing_date is None:
            continue
        rows.append(
            HearingHistoryRow(
                hearing_date=hearing_date,
                purpose=cells[3].get_text(strip=True),
                judge=judge,
                business_on_date=business_text or None,
            )
        )
    return rows


def _parse_orders_html(html: str) -> list[OrderRef]:
    if not html:
        return []
    soup = BeautifulSoup(html, "lxml")
    orders: list[OrderRef] = []
    for tr in soup.find_all("tr"):
        cells = tr.find_all("td")
        if len(cells) < 3:
            continue
        order_no = cells[0].get_text(strip=True)
        order_date = _parse_date(cells[1].get_text(strip=True))
        if order_date is None:
            continue
        link = cells[2].find("a")
        if link is None or not link.get("href"):
            continue
        orders.append(
            OrderRef(
                order_date=order_date,
                order_url=str(link["href"]).strip(),
                order_id=order_no or order_date.isoformat(),
            )
        )
    return orders
