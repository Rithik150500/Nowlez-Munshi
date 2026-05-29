# Deploying Nowlez Munshi

Three services on one core: **web** (API + SPA), **bot** (WhatsApp webhook), **worker**
(refresh/cron), backed by **Postgres** + **Redis**. Clean launch — **no data
migration**; the stack starts fresh and the web container runs `alembic upgrade head`
on boot.

## Quick start (compose)

```bash
cp .env.example .env      # then fill the required vars below
docker compose -f deploy/compose.yml up --build
# web → http://localhost:8000   bot webhook → http://localhost:8001/webhook
```

## Required environment (prod)

The app **hard-fails on boot** if any of these is unsafe (see `nm_core.config`):

| Var | Why |
|---|---|
| `DATABASE_URL` | must be set (not the localhost dev default) |
| `REDIS_URL` | must be set in prod |
| `JWT_SECRET_KEY` | must NOT be the `change-me-in-prod` default; ≥32 bytes |
| `DEV_MODE=0` | `1` exposes credential-free `/auth/dev-login` — refused in prod |
| `ENV=production` | (or a Railway marker) activates the hard-fails |

Integration credentials (features degrade/disable without them, no crash):

| Var | Enables |
|---|---|
| `META_ACCESS_TOKEN`, `META_PHONE_NUMBER_ID` | WhatsApp sends |
| `META_VERIFY_TOKEN`, `META_APP_SECRET` | webhook handshake + signature verification |
| `MSG91_AUTH_KEY`, `MSG91_OTP_TEMPLATE_ID` | SMS OTP fallback |
| `GEMINI_API_KEY` | real LLM (else the deterministic offline agent) |
| `ECOURTS_OFFLINE=0` | live eCourts (default `0` in prod; `1` serves synthetic data) |
| `WEB_BASE_URL` | WhatsApp→web continuity deep-links |
| `ONLYOFFICE_SERVER_URL`, `ONLYOFFICE_JWT_SECRET` | in-browser DOCX editing (see `deploy/onlyoffice.compose.yml`) |
| `SENTRY_DSN`, `ALERT_WEBHOOK_URL` | error reporting + alerts |

## Operations

- **Migrations**: the web container runs `alembic upgrade head` before serving;
  run manually with `alembic -c packages/nm_core/alembic.ini upgrade head`.
- **Scaling**: web/bot are stateless — scale horizontally behind a load balancer.
  Run a single refresh `worker` (or shard by case range); schedule
  `python -m nm_worker.documents` and `python -m nm_worker.reengage` via cron.
- **Health**: `GET /api/health` (deep DB check); `GET /api/admin/overview` (admin-only)
  exposes refresh lag, outbound delivery status, and the metrics snapshot.
- **Observability**: set `SENTRY_DSN`; alert on `ecourts.circuit_open`,
  `whatsapp.send.failed`, and refresh-lag growth.
