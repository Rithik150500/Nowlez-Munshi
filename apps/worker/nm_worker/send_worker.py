"""RQ worker for the outbound WhatsApp send queue.

Run: ``python -m nm_worker.send_worker``  (consumes the "wa_send" queue with retry).
"""
from __future__ import annotations

import logging

from redis import Redis
from rq import Worker

from nm_core.config import get_settings
from nm_core.messaging.queue import QUEUE_NAME


def main() -> None:
    logging.basicConfig(level=logging.INFO)
    conn = Redis.from_url(get_settings().REDIS_URL)
    Worker([QUEUE_NAME], connection=conn).work(with_scheduler=True)


if __name__ == "__main__":
    main()
