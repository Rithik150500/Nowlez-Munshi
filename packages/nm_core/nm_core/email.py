"""Pluggable transactional email. Default 'console' provider logs (dev/tests)."""
from __future__ import annotations

import logging
import smtplib
from email.message import EmailMessage

from nm_core.config import get_settings

logger = logging.getLogger("nm_core.email")

# Captures sent messages under the console provider so tests can assert on them.
sent_outbox: list[dict] = []


def send_email(*, to: str, subject: str, body: str) -> None:
    s = get_settings()
    if s.EMAIL_PROVIDER == "smtp" and s.SMTP_HOST:
        msg = EmailMessage()
        msg["From"] = s.EMAIL_FROM
        msg["To"] = to
        msg["Subject"] = subject
        msg.set_content(body)
        with smtplib.SMTP(s.SMTP_HOST, s.SMTP_PORT) as server:
            server.starttls()
            if s.SMTP_USER:
                server.login(s.SMTP_USER, s.SMTP_PASSWORD)
            server.send_message(msg)
        return
    # console provider
    sent_outbox.append({"to": to, "subject": subject, "body": body})
    logger.info("[email:console] to=%s subject=%s", to, subject)
