"""Repeatedly-failing cases escalate to observability + the manual-review queue."""
from __future__ import annotations

from datetime import date

import fakeredis
import pytest

from nm_core import observability, tracking
from nm_core.cases import CaseRepository
from nm_core.config import get_settings
from nm_core.db.models.manual_review import ManualReviewItem
from nm_core.ecourts.models import Case as FetchedCase
from nm_core.ecourts.models import OrderRef, Party
from nm_core.ecourts.offline import clear_offline_cases, register_offline_case
from nm_core.identity.repositories import UserRepository
from nm_core.messaging import redis_dedup
from nm_core.tracking import (
    FAILURE_ALERT_THRESHOLD,
    FAILURE_REVIEW_THRESHOLD,
    _record_failure,
    run_refresh_sweep,
    track_case,
)

CNR = "DLND010000012024"


def _case() -> FetchedCase:
    return FetchedCase(
        cnr=CNR, title="A vs B", court="Court X", stage="Appearance",
        next_hearing_date=date(2026, 7, 1), judge="J1",
        parties=[Party(name="A", role="petitioner")],
        orders=[OrderRef(order_date=date(2026, 1, 1), order_url="u1", order_id="1")],
    )


@pytest.fixture(autouse=True)
def env(monkeypatch):
    monkeypatch.setattr(get_settings(), "ECOURTS_OFFLINE", True)
    monkeypatch.setattr(get_settings(), "WHATSAPP_DISABLED", True)
    monkeypatch.setattr(redis_dedup, "_client", fakeredis.FakeStrictRedis())
    observability.reset()
    clear_offline_cases()
    register_offline_case(CNR, _case())
    yield
    clear_offline_cases()
    monkeypatch.setattr(redis_dedup, "_client", None)


def _tracked_case(db_session):
    user, _ = UserRepository(db_session).get_or_create_by_phone(phone="+919100000111")
    track_case(db_session, user=user, cnr=CNR)
    return CaseRepository(db_session).get_by_cnr(user.id, CNR)


def test_escalation_thresholds_and_idempotent_queue(db_session):
    case = _tracked_case(db_session)
    for _ in range(FAILURE_REVIEW_THRESHOLD):
        _record_failure(db_session, case, RuntimeError("boom"))
    assert case.consecutive_failures == FAILURE_REVIEW_THRESHOLD
    assert observability.snapshot()["counters"].get("ecourts.case.failing") == 1

    open_rows = db_session.query(ManualReviewItem).filter_by(resolved_at=None).all()
    assert len(open_rows) == 1
    assert open_rows[0].cnr == CNR and open_rows[0].failure_count == FAILURE_REVIEW_THRESHOLD

    # A further failure updates the same open row (no duplicate).
    _record_failure(db_session, case, RuntimeError("again"))
    assert db_session.query(ManualReviewItem).filter_by(resolved_at=None).count() == 1
    assert db_session.query(ManualReviewItem).one().failure_count == FAILURE_REVIEW_THRESHOLD + 1


def test_sweep_failure_increments_then_success_resets(db_session, monkeypatch):
    case = _tracked_case(db_session)

    def _boom(*a, **k):
        raise RuntimeError("ecourts down")

    original = tracking.refresh_case
    monkeypatch.setattr(tracking, "refresh_case", _boom)
    stats = run_refresh_sweep(db_session)
    assert stats["errored"] == 1
    assert case.consecutive_failures == 1

    # Recovery: a successful refresh clears the streak. Restore only refresh_case
    # (not the whole monkeypatch, which would also undo the offline env fixture).
    monkeypatch.setattr(tracking, "refresh_case", original)
    case.consecutive_failures = FAILURE_ALERT_THRESHOLD
    db_session.flush()
    run_refresh_sweep(db_session)
    assert case.consecutive_failures == 0
