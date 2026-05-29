"""WhatsApp consent: STOP/START detection, opt-out audit, proactive suppression."""
from __future__ import annotations

from datetime import UTC, datetime, timedelta

import pytest

from nm_core import consent, growth
from nm_core.db.models.audit import AuditLog
from nm_core.identity.repositories import UserRepository


@pytest.mark.parametrize("text", ["STOP", "stop", "Stop.", "stop please", "रोको", "बंद", "cancel"])
def test_stop_keyword_detected(text):
    assert consent.is_stop_keyword(text) is True


@pytest.mark.parametrize("text", ["START", "start", "resume!", "चालू", "शुरू"])
def test_start_keyword_detected(text):
    assert consent.is_start_keyword(text) is True


@pytest.mark.parametrize("text", ["", "DLND010000012024", "stopwatch order", "/start", "hello"])
def test_non_keywords_ignored(text):
    # "stopwatch" is one token != "stop"; "/start" is a command, not the START keyword.
    assert consent.is_stop_keyword(text) is False
    assert consent.is_start_keyword(text) is False


def test_opt_out_sets_timestamp_and_audit_idempotent(db_session):
    user, _ = UserRepository(db_session).get_or_create_by_phone(phone="+919100000091")
    assert consent.is_opted_out(user) is False

    consent.set_opt_out(db_session, user=user, opted_out=True, keyword="STOP")
    assert consent.is_opted_out(user) is True
    audits = db_session.query(AuditLog).filter_by(event_type="whatsapp.opted_out_via_inbound").all()
    assert len(audits) == 1 and audits[0].user_id == user.id

    # Idempotent: opting out again writes no second audit row.
    consent.set_opt_out(db_session, user=user, opted_out=True, keyword="STOP")
    assert db_session.query(AuditLog).filter_by(
        event_type="whatsapp.opted_out_via_inbound"
    ).count() == 1


def test_opt_in_clears(db_session):
    user, _ = UserRepository(db_session).get_or_create_by_phone(phone="+919100000092")
    consent.set_opt_out(db_session, user=user, opted_out=True)
    consent.set_opt_out(db_session, user=user, opted_out=False, keyword="START")
    assert consent.is_opted_out(user) is False
    assert db_session.query(AuditLog).filter_by(
        event_type="whatsapp.opted_in_via_inbound"
    ).count() == 1


def test_reengage_skips_opted_out(db_session, monkeypatch):
    sent: list[str] = []
    monkeypatch.setattr(growth.messaging, "enqueue_send_text",
                        lambda **kw: sent.append(kw["to_phone"]) or True)
    long_ago = datetime.now(UTC) - timedelta(days=90)
    user, _ = UserRepository(db_session).get_or_create_by_phone(phone="+919100000093")
    user.last_login_at = long_ago
    consent.set_opt_out(db_session, user=user, opted_out=True)

    assert growth.reengage_dormant(db_session) == 0  # opted-out user is skipped
    assert sent == []
