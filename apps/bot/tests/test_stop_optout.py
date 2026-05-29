"""Inbound STOP/START opt-out flow through the bot command router."""
from __future__ import annotations

from nm_bot.commands import handle_message

from nm_core import consent
from nm_core.db.models.audit import AuditLog
from nm_core.identity.repositories import UserRepository

PHONE = "+919100000061"


def _reply(db_session, text):
    return handle_message(db_session, from_phone=PHONE, text=text)


def test_stop_opts_out_and_confirms(db_session):
    reply = _reply(db_session, "STOP")
    assert "opted out" in reply.lower()
    user = UserRepository(db_session).get_by_phone(PHONE)
    assert consent.is_opted_out(user) is True
    assert db_session.query(AuditLog).filter_by(
        event_type="whatsapp.opted_out_via_inbound"
    ).count() == 1


def test_start_opts_back_in(db_session):
    _reply(db_session, "STOP")
    reply = _reply(db_session, "START")
    assert "back" in reply.lower() or "🔔" in reply
    user = UserRepository(db_session).get_by_phone(PHONE)
    assert consent.is_opted_out(user) is False


def test_opted_out_user_still_gets_inbound_replies(db_session):
    """Opt-out suppresses *proactive* sends, not replies to user-initiated messages."""
    _reply(db_session, "STOP")
    reply = _reply(db_session, "/saved")
    assert reply  # the bot still answers a direct command
    assert "opted out" not in reply.lower()


def test_start_without_prior_optout_is_not_hijacked(db_session):
    """A bare START from an opted-in user is not treated as opt-in (no confirmation)."""
    reply = _reply(db_session, "START")
    assert "back" not in reply.lower()
