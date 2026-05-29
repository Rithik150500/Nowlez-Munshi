# Nowlez Munshi

[![CI](https://github.com/Rithik150500/Nowlez-Munshi/actions/workflows/ci.yml/badge.svg)](https://github.com/Rithik150500/Nowlez-Munshi/actions/workflows/ci.yml)

**Your chamber's AI munshi — every case, every hearing, every order, tracked and
answered, on web and WhatsApp, over one account and one case book.**

*Munshi* (मुंशी) is the traditional legal clerk. Nowlez Munshi is the consolidated,
greenfield rebuild of the Nowlez (web) and Munshi (WhatsApp) products into **one core
with two front doors** — *phone-canonical*, so a web user and a WhatsApp user with the
same number are the **same account** with the **same case book**.

---

## Highlights

- **Unified case book + cross-channel alerts** — add a case anywhere (a CNR on WhatsApp
  or the web, or an eCourts QR photo), and it's tracked and auto-refreshed. Status /
  hearing-date / new-order / disposal / transfer changes are pushed to WhatsApp, email,
  web-push, and the in-app feed.
- **AI Munshi on both doors** — an agentic (function-calling) clerk answers questions over
  your case book *with citations*, on web chat and WhatsApp, with persisted threads.
- **WhatsApp ⇄ web continuity** — WhatsApp replies deep-link straight into the
  already-authenticated web app (short-lived link tokens), so the two doors are one product.
- **Practice ops** — calendar + portfolio analytics, chambers (teams/RBAC), order-PDF
  summaries + in-browser DOCX editing, bilingual EN/HI, voice, and an admin console.

### New in v1.1

| Area | What landed |
|---|---|
| eCourts | `/search` by party/advocate + **QR-image CNR intake** (photo a cause-list/notice, we decode the CNR) |
| Notifications | **Email** + **Web-Push** channels, and an installable **PWA** (manifest + service worker) |
| Billing | Tier gates are now **enforced** (boolean features + numeric case/member limits) with **Razorpay** subscriptions + webhooks |
| i18n | Full **EN/HI** localization across both doors |
| Delivery | **RQ** send queue (at-least-once, idempotent) instead of inline sends |
| Reliability | Live-eCourts **canary**, scheduled **cause-list digests**, and **re-engagement** nudges |
| Documents | Order/judgment **uploads** + processing |

---

## Architecture

```
                  ┌──────────────┐         ┌──────────────┐
   web users  ───▶│  apps/web     │         │  apps/bot     │◀───  WhatsApp users
  (React SPA)     │  FastAPI REST │         │  Meta webhook │
                  └──────┬───────┘         └──────┬───────┘
                         │                         │
                         ▼                         ▼
                  ┌─────────────────────────────────────────┐
                  │            packages/nm_core               │
                  │  pure domain core — no HTTP / UI knowledge│
                  │  identity · cases · ecourts · messaging   │
                  │  notifications · ai · teams · billing ·   │
                  │  documents · push · email · observability │
                  └──────┬───────────────┬──────────┬────────┘
                         │               │          │
              ┌──────────┘     ┌─────────┘   ┌──────┴───────┐
              ▼                ▼             ▼              ▼
        Postgres / SQLite   Redis (RQ)   eCourts portal   Meta Graph
                                         · Gemini · SMTP · Razorpay
                                                  ▲
                                          apps/worker (crons + RQ)
```

```
packages/nm_core/   the domain core — pure, no HTTP/UI knowledge
  config db identity ecourts cases messaging notifications ai
  teams billing documents push email growth observability storage tracking i18n
apps/web/           FastAPI REST API + React/Vite SPA (the web door)
apps/bot/           WhatsApp webhook + command router (the WhatsApp door)
apps/worker/        crons + RQ workers: sweep · send_worker · digest · canary · reengage · documents
docs/               product spec, architecture, scope, deploy + ADRs
deploy/             deployment compose (incl. OnlyOffice document server)
```

Each app and the core carries its own README — see
[`packages/nm_core`](packages/nm_core/README.md),
[`apps/web`](apps/web/README.md),
[`apps/bot`](apps/bot/README.md),
[`apps/worker`](apps/worker/README.md).

---

## Quickstart (offline, credential-free)

Everything runs **offline** by default: `ECOURTS_OFFLINE=1` serves synthetic cases, the
AI falls back to a **deterministic** agent when `GEMINI_API_KEY` is unset, and `DEV_MODE=1`
exposes `/auth/dev-login` — so the full test suite and a local demo work with **no external
services**.

```bash
# 1. Environment
python -m venv .venv && . .venv/bin/activate
pip install -e "packages/nm_core[test]" -e apps/web -e apps/bot -e apps/worker
cp .env.example .env                     # the defaults are already dev-ready

# 2. Database (SQLite for dev) — run from the package dir; Alembic's script path is relative
(cd packages/nm_core && DATABASE_URL=sqlite:///../../dev.db python -m alembic -c alembic.ini upgrade head)

# 3. Tests (offline; no creds needed)
pytest packages/nm_core/tests apps

# 4. Run a door locally
uvicorn nm_web.app:app --reload --port 8000      # web API + SPA
uvicorn nm_bot.app:app --reload --port 8001      # WhatsApp webhook
python -m nm_worker.sweep                         # refresh sweep (one shot)
```

The React SPA lives in `apps/web/frontend` (`npm install && npm run build`); the FastAPI
app serves the built `dist/`. See [`apps/web/README.md`](apps/web/README.md) for the dev
workflow with Vite's hot reload.

---

## Configuration

All settings are typed in `nm_core.config` and read from the environment (see
[`.env.example`](.env.example) for the annotated set). When a **production** environment is
detected (`ENV=production` or a common prod indicator var), `nm_core.config` **hard-fails**
to boot rather than run unsafely.

| Group | Keys | Notes |
|---|---|---|
| **Core** | `DEV_MODE`, `ENV`, `DATABASE_URL`, `REDIS_URL`, `JWT_SECRET_KEY` | Prod hard-fails if `DEV_MODE=1`, `JWT_SECRET_KEY` is the default, or DB/Redis are still localhost defaults |
| **AI (Gemini)** | `GEMINI_API_KEY`, `GEMINI_MODEL`, `AI_*` | Unset key → deterministic offline agent |
| **eCourts** | `ECOURTS_OFFLINE`, `ECOURTS_*` (base URLs, timeouts, circuit/retry) | `0` = live portal (prod); `1` = synthetic cases |
| **WhatsApp / Meta** | `META_ACCESS_TOKEN`, `META_PHONE_NUMBER_ID`, `META_VERIFY_TOKEN`, `META_APP_SECRET`, `WHATSAPP_DISABLED`, `MSG91_*` | `META_APP_SECRET` verifies the `X-Hub-Signature-256`; `WHATSAPP_DISABLED` is an outbound kill-switch |
| **Continuity** | `WEB_BASE_URL`, `LINK_TOKEN_TTL_MINUTES` | Empty `WEB_BASE_URL` disables WhatsApp→web deep-links |
| **Documents** | `STORAGE_DIR`, `ONLYOFFICE_SERVER_URL`, `ONLYOFFICE_JWT_SECRET` | In-browser DOCX editing via OnlyOffice |
| **Billing** | `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`, `RAZORPAY_WEBHOOK_SECRET` | Subscriptions + signed webhooks |
| **Web-Push** | `VAPID_PUBLIC_KEY`, `VAPID_PRIVATE_KEY`, `VAPID_SUBJECT` | Set **both** VAPID keys or neither — a half-config hard-fails |
| **Email** | `EMAIL_PROVIDER` (`console`\|`smtp`), `EMAIL_FROM`, `SMTP_*` | `console` prints to logs (dev) |
| **Observability** | `SENTRY_DSN`, `ALERT_WEBHOOK_URL` | Optional |

---

## The two front doors

**Web** (`apps/web`) — a React SPA over a FastAPI REST API: case book, calendar, portfolio
insights, AI chat, documents, teams/RBAC, billing, admin, and search. Bilingual EN/HI,
installable as a PWA.

**WhatsApp** (`apps/bot`) — send a **CNR** (or a **photo** of a QR-bearing notice) to track a
case; everything else is slash-commands:

| Command | Does |
|---|---|
| `/start`, `/help` | Onboarding + command list |
| `/web` | Deep-link into the authenticated web app |
| `/search` | Open party/advocate search on the web |
| `/saved`, `/today`, `/this_week` | Your cases / today's & this week's hearings |
| `/alerts`, `/snooze`, `/forget` | Manage tracking + alerts for a case |
| `/digest_on`, `/digest_off` | Toggle scheduled cause-list digests |

Free-text questions are routed to the AI Munshi.

---

## Testing & CI

[CI](.github/workflows/ci.yml) runs three jobs on every push/PR:

- **core** — `ruff check`, `mypy`, and `pytest packages/nm_core/tests apps` (pinned
  `ruff==0.15.15`, `mypy==2.1.0`, Python 3.12). Fully offline & deterministic.
- **frontend** — builds the React SPA (`apps/web/frontend`) to catch build/type errors.
- **migrations-postgres** — runs the dialect-aware Alembic chain `upgrade head` →
  `downgrade base` against **Postgres 16**, validating the production dialect.

---

## Deploy

Production runs the three apps + worker against Postgres and Redis. The compose stack
(including the OnlyOffice document server) is in [`deploy/compose.yml`](deploy/compose.yml);
the full runbook — env hardening, migrations, the worker/cron set, and the prod-safety
hard-fails — is in [`docs/DEPLOY.md`](docs/DEPLOY.md).

---

## Docs

| Doc | What |
|---|---|
| [`docs/PRODUCT_v1.md`](docs/PRODUCT_v1.md) | Product definition |
| [`docs/SPEC_v1.md`](docs/SPEC_v1.md) | v1 functional spec |
| [`docs/SCOPE_v1.1.md`](docs/SCOPE_v1.1.md) | v1.1 scope (the features above) |
| [`docs/TARGET_ARCHITECTURE.md`](docs/TARGET_ARCHITECTURE.md) | Target architecture |
| [`docs/DEPLOY.md`](docs/DEPLOY.md) | Deployment runbook |
| [`docs/adr/`](docs/adr), [`docs/ADR-0002-m2-transport-and-messaging.md`](docs/ADR-0002-m2-transport-and-messaging.md) | Architecture decision records |
| [`docs/STATE_OF_THE_UNION.md`](docs/STATE_OF_THE_UNION.md) | *Historical* — pre-rewrite assessment of the old three-repo system |
| `docs/PLAN_M4.md`, `docs/PLAN_M5.md` | *Historical* — milestone plans |

---

## License

This project does not yet carry a license file, so all rights are reserved by default.
Add a `LICENSE` (e.g. MIT, Apache-2.0, or proprietary) before distributing.
