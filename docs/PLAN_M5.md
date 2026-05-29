# M5 plan — harden + go-live

> The final v1 milestone: make every silent-failure mode loud, close the
> reliability/consistency gaps surfaced in review, decommission the throwaway
> thin-MVP, and ship deployable artifacts. Sequenced sub-waves, each tested + CI-green.

## M5a — Observability (make silent failures loud)

Per `SPEC_v1 §5`, every failure mode that can rot silently gets a metric + alert.

- **`nm_core.observability`**: structured logging (`get_logger`), a tiny metrics
  facade (counters/gauges; Prometheus-style `/metrics` or StatsD), `init_sentry()`,
  and `audit(...)` (already have AuditLog).
- **Instrument the invariants**: outbound-queue depth + drain rate, refresh-sweep lag
  (oldest `last_refreshed_at`), eCourts circuit state/open events, OTP/WhatsApp
  delivery-failure rate, AI fallback rate.
- **Surface**: extend `/api/admin/overview` into a health panel (queue depth, refresh
  lag, circuit state, recent failures); a `/api/health` deep-check (db + redis).
- **Alerting**: circuit-open and queue-stall fire to a webhook (Sentry/Slack).

## M5b — Reliability (RQ outbound queue + review fixes)

- **RQ outbound queue** (addresses review #3): move WhatsApp sends to a Redis/RQ
  queue with retry (1m/5m/15m) + the existing dedup; bot/notifications/worker
  *enqueue* instead of sending inline. The bot webhook becomes claim→handle→**enqueue
  reply** in one transaction, so a transient Meta failure retries instead of losing the
  reply. `apps/worker` runs the send worker.
- **Order reprocess (review #4)**: track summarization state independently of
  `file_path` (e.g. `summarized_at` / retry when summary == "no extractable text"), so a
  transient bad first fetch doesn't permanently strand an order.
- **AI team-scoping (review #5)**: make the Munshi tool layer use
  `accessible_user_ids` so chamber members can ask about co-members' shared cases —
  consistent with the M4b case book.
- **Endpoint consistency (review #7, #8)**: `set_prefs` 404s for inaccessible CNRs;
  `refresh`/`process-orders` use `get_visible` like `get_case`.

## M5c — Correctness & CI hardening

- **Schema-drift guard (review #6)**: add server_defaults to the models that drifted
  (`is_personal`, `role`, `tier`, `status`) **and** a CI step that fails if
  `alembic revision --autogenerate` would produce a non-empty diff (ORM == migrations).
- **Coverage gate** on `nm_core`; keep the Postgres migration job + the SPA build job.
- **Security pass**: require `META_APP_SECRET` (and, if OnlyOffice enabled,
  `ONLYOFFICE_JWT_SECRET`) in prod via the prod-safety hard-fail; review OTP/login
  rate limits end-to-end.

## M5d — Decommission the thin-MVP

The greenfield rebuild fully supersedes the prototype. Remove `app/`, `web/`,
`whatsapp/`, `munshi_core/`, root `tests/`, `scripts/seed_demo.py`, the legacy
`nowlez_munshi.db`, and the shared-pinned root `requirements.txt`; drop the ruff
`extend-exclude` for those paths so the whole repo is linted. The rebuild becomes the
entire repository.

## M5e — Go-live artifacts

- **Containers**: Dockerfiles for `apps/web` (API + built SPA), `apps/bot`,
  `apps/worker`; a `deploy/compose.yml` wiring web + bot + worker + Postgres + Redis
  (+ optional OnlyOffice), with the SPA built in the web image.
- **Migrations on boot**: `alembic upgrade head` as a release step.
- **Runbook + env checklist** (`docs/DEPLOY.md`): every required prod env var (the
  hard-fails enumerate them), scaling notes, and the clean-launch cutover (no data
  migration — start fresh).

## Exit criteria
Alerts exist for each silent-failure mode; the outbound path is at-least-once with
retry; ORM == migrations is CI-enforced; the thin-MVP is gone and the whole repo is
linted/typed/tested green; `docker compose up` brings the stack live and
`alembic upgrade head` is clean on Postgres. That is v1.
