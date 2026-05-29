# ADR-0002 — M2: transport reimplementation, synchronous messaging, eCourts offline mode

Status: accepted · Date: 2026-05-29 · Supersedes the "wrap shared libs" option floated in M2 planning.

## Context

M2 ("both doors + unified alerts") needs eCourts case fetching and WhatsApp
send/receive. Both exist in `shared/` (`ecourts_client`, `whatsapp_delivery`). The
question was whether `nm_core` should wrap those libraries as dependencies or
reimplement them.

## Decisions

1. **Reimplement both transports from scratch inside `nm_core`** (no dependency on
   the `shared/` git packages). Rationale: keeps the rebuild dependency-clean and CI
   simple (no private-repo git installs), consistent with how M1 reimplemented
   identity/data-access. The eCourts AES/JWT/parser stack and the Meta client were
   ported faithfully from the `shared/` sources and covered with tests.

2. **`ECOURTS_OFFLINE` synthetic mode.** Because there is no API key to gate on (the
   portal is scraped), dev/tests run against a deterministic offline transport
   (registerable per-CNR) instead of the live portal. Defaults to **False** so prod
   never silently serves fake data.

3. **Synchronous messaging for v1 (RQ deferred).** The Meta send path runs inline in
   the worker/bot with the dedup guards (Redis `SETNX` for ad-hoc alerts, a DB
   per-day slot for daily templates) rather than via an RQ outbound queue. This is
   far simpler and fully testable (fakeredis + respx); the RQ queue + separate
   worker process is a documented later-hardening item for scale.

## Consequences

- `nm_core` depends only on `cryptography` (added), `httpx`, `bs4`/`lxml`, `redis` —
  no `shared/` coupling. CI stays a plain `pip install -e`.
- The eCourts crypto/parsers must track NIC schema drift ourselves (the cost of not
  reusing the shared library); `SchemaChanged` errors surface drift.
- Outbound throughput is bounded by inline sends until RQ lands; acceptable at v1
  scale, revisit in M5 hardening.
