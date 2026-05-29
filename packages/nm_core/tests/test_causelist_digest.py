"""1c: cause-list digest assembly — holiday skip + snapshot ∪ indexed-row union."""
from __future__ import annotations

from datetime import date, timedelta

import fakeredis
import pytest

from nm_core import digests
from nm_core.config import get_settings
from nm_core.db.models.cause_list import CauseListRow
from nm_core.ecourts.models import Case as FetchedCase
from nm_core.ecourts.models import OrderRef, Party
from nm_core.ecourts.offline import clear_offline_cases, register_offline_case
from nm_core.holidays import COURT_HOLIDAYS, is_court_holiday
from nm_core.identity.repositories import UserRepository
from nm_core.messaging import redis_dedup
from nm_core.tracking import track_case

CNR = "DLND010000012024"
TODAY = date(2026, 6, 1)          # tomorrow = 2026-06-02, not a holiday
TOMORROW = TODAY + timedelta(days=1)


@pytest.fixture
def env(monkeypatch):
    monkeypatch.setattr(get_settings(), "ECOURTS_OFFLINE", True)
    monkeypatch.setattr(get_settings(), "WHATSAPP_DISABLED", True)
    monkeypatch.setattr(redis_dedup, "_client", fakeredis.FakeStrictRedis())
    clear_offline_cases()
    yield
    clear_offline_cases()
    monkeypatch.setattr(redis_dedup, "_client", None)


def _case(**kw) -> FetchedCase:
    base = dict(
        cnr=CNR, title="A vs B", court="HC", stage="Admission",
        next_hearing_date=date(2026, 12, 1), judge="J1",  # snapshot NOT tomorrow
        parties=[Party(name="A", role="petitioner")],
        orders=[OrderRef(order_date=date(2026, 1, 1), order_url="u", order_id="1")],
    )
    base.update(kw)
    return FetchedCase(**base)


def test_holiday_is_known():
    assert is_court_holiday(date(2026, 8, 15)) is True
    assert is_court_holiday(TOMORROW) is False


def test_digest_skipped_on_holiday(db_session, env):
    holiday = next(iter(COURT_HOLIDAYS))
    # day before the holiday → "tomorrow" is the holiday → skipped
    assert digests.send_tomorrow_digests(db_session, today=holiday - timedelta(days=1)) == 0


def test_indexed_row_pulls_case_into_digest(db_session, env, monkeypatch):
    """A tracked case listed in tomorrow's indexed cause-list is included even when its
    snapshot next_hearing_date is stale (NIC published the PDF before the poll)."""
    sent: list[dict] = []
    monkeypatch.setattr(digests.messaging, "enqueue_send_daily_template",
                        lambda session, **kw: sent.append(kw) or True)

    user, _ = UserRepository(db_session).get_or_create_by_phone(phone="+919100000131")
    register_offline_case(CNR, _case())
    track_case(db_session, user=user, cnr=CNR)  # snapshot hearing is in December

    # No snapshot match for tomorrow → without the index, nothing would send.
    assert digests.send_tomorrow_digests(db_session, today=TODAY) == 0

    # Index a cause-list row for tomorrow back-resolved to this CNR.
    db_session.add(CauseListRow(
        state_code="1", court_code="C1", bench_id="B1", list_date=TOMORROW,
        sr_no=1, section="ADMISSION", case_number="WP/100/2026", cnr=CNR, raw_text="…",
    ))
    db_session.flush()

    assert digests.send_tomorrow_digests(db_session, today=TODAY) == 1
    assert sent and CNR in sent[-1]["body_variables"][1]
