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
  web-push, and the in-app feed — with an **imminent-hearing** carve-out that reaches even
  digest-only users.
- **AI Munshi on both doors** — an agentic (function-calling) clerk answers questions over
  your case book *with citations*, on web chat and WhatsApp, with persisted threads. It can
  **search the web**, **read full judgments by URL**, and **draft legal documents** (DOCX).
- **Guided eCourts search in WhatsApp** — `/search` walks you through party / case-number /
  FIR lookup with tap-to-pick court pickers; **High Court cause-list digests** back-resolve
  listed cases to your book.
- **Monetization** — Munshi **postpaid** (₹/case, anniversary cycles, grace→suspension) and
  Nowlez **subscriptions** (tiers, 30-day trial, coupons, referrals) over a unified,
  replay-safe Razorpay webhook.
- **WhatsApp ⇄ web continuity** — WhatsApp replies deep-link straight into the
  already-authenticated web app (short-lived link tokens), so the two doors are one product.
- **Practice ops** — calendar (+ **ICS export**), portfolio analytics, chambers (teams/RBAC),
  a **document library** (upload → OCR → AI classify + auto-attach, in-browser DOCX editing),
  **library-wide full-text search**, **GDPR data export**, bilingual EN/HI, and an admin console.

### Since v1.1 — the legacy → greenfield port

The bulk of the legacy Nowlez (web) + Munshi (bot) feature surface has now been ported in
five dependency-ordered waves. See [`docs/GAP_ANALYSIS_legacy.md`](docs/GAP_ANALYSIS_legacy.md)
for the full map and what remains deferred.

| Area | What landed |
|---|---|
| WhatsApp | Interactive buttons/lists + document/PDF delivery · **STOP/START opt-out** (DPDP consent) · onboarding (language picker + demo) · `/label`, `/portfolio`, `/refresh` |
| Guided search | In-chat **party / case-number / FIR** search over a Redis conversation-state machine (replaces the old web hand-off) |
| eCourts | **HC cause-list** parsers + nightly indexer + CNR back-resolution + digest union · court-holiday calendar · per-case failure → `manual_review_queue` |
| Billing | Munshi **postpaid** (cycle math, invoices, grace/suspension/resume) · Nowlez **trial** + **cross-product exemption** · **coupons** + **referrals** · unified Razorpay webhook (replay idempotency) · daily billing cron |
| AI | **Tavily web search** + `fetch_url` (full-page extract) · **legal-document drafting** (docx-js via a sandboxed Node runner + 100 tribunal templates) · chat **feedback** (thumbs) + **edit/regenerate** |
| Documents & search | **Universal library search** (Postgres tsvector / SQLite LIKE) · **file library** (tree / rename / reclassify) · **OCR** for scanned PDFs (Gemini) · **AI auto-classify / name / auto-attach** |
| Growth & web | **Drip email** lifecycle (D1–D27, IST day-indexed) · **GDPR ZIP export** · **waitlist + demo** (public, rate-limited) · **ICS** calendar export |

> **Production status.** Features are implemented and tested offline, but a few need
> hardening before going live — see [Production hardening](#production-hardening) below.

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
                                  · Gemini · Tavily · Razorpay · SMTP
                                  · Node (docx-js drafting runner)
                                                  ▲
                                          apps/worker (crons + RQ)
```

```
packages/nm_core/   the domain core — pure, no HTTP/UI knowledge
  config db identity ecourts cases messaging notifications ai
  teams billing documents push email growth observability storage tracking i18n
  + cause_lists consent conversation drip export search waitlist ratelimit holidays
apps/web/           FastAPI REST API + React/Vite SPA (the web door)
apps/bot/           WhatsApp webhook + command router (the WhatsApp door)
apps/worker/        crons + RQ: sweep · send_worker · digest · canary · reengage · documents · billing · drip
docs/               product spec, architecture, scope, deploy, ADRs + the legacy gap analysis
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
| **AI (Gemini)** | `GEMINI_API_KEY`, `GEMINI_MODEL`, `AI_*` | Unset key → deterministic offline agent (also powers OCR + document classification) |
| **AI web search** | `TAVILY_API_KEY`, `TAVILY_MAX_RESULTS` | Unset → the `search_web` / `fetch_url` tools are hidden |
| **AI drafting** | `DOCX_NODE_BIN`, `DOCX_SUBPROCESS_TIMEOUT_SECONDS`, `DOCX_SUBPROCESS_MAX_MEMORY_MB`, `DOCX_MAX_CODE_SIZE_BYTES` | No Node runtime (or its `docx` dep) → the `draft_document` tool is hidden. **See [Production hardening](#production-hardening).** |
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

**Web** (`apps/web`) — a React SPA over a FastAPI REST API: case book, calendar (+ ICS export),
portfolio insights, AI chat (with feedback + edit/regenerate), the document library
(upload/tree/rename/reclassify, in-browser DOCX editing), **library-wide full-text search**,
teams/RBAC, billing (tiers, trial, invoices, coupons, referrals), GDPR data export, and admin.
Public, unauthenticated waitlist + demo endpoints. Bilingual EN/HI, installable as a PWA.

**WhatsApp** (`apps/bot`) — send a **CNR** (or a **photo** of a QR-bearing notice) to track a
case; everything else is slash-commands. The first message runs onboarding (a language
picker + a demo card), and a bare **STOP**/**START** opts out of / back into proactive
messages (DPDP consent).

| Command | Does |
|---|---|
| `/start`, `/help` | Onboarding + command list |
| `/web` | Deep-link into the authenticated web app |
| `/search` | **Guided in-chat search** — party / case-number / FIR, with tap-to-pick court pickers |
| `/saved`, `/today`, `/this_week` | Your cases / today's & this week's hearings |
| `/portfolio` | Case book at a glance (active / disposed / next hearing) |
| `/label <CNR> <text>` | Give a case a friendly label |
| `/refresh` | Force-refresh all your cases now (rate-limited) |
| `/alerts`, `/snooze`, `/forget` | Manage tracking + alerts for a case |
| `/digest_on`, `/digest_off` | Toggle scheduled cause-list digests |

Free-text questions are routed to the AI Munshi. A photo of a QR-bearing notice is decoded
to a CNR and tracked.

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

## Production hardening

The port is feature-complete and tested offline, but a few areas need hardening before a
live deployment (tracked in [`docs/GAP_ANALYSIS_legacy.md`](docs/GAP_ANALYSIS_legacy.md)):

- **Billing webhook** — after HMAC verification the handler trusts the payment `notes`
  (`account_id` / `tier` / `coupon_code` / `munshi_invoice_id`). Before enabling **live**
  Razorpay, validate the captured amount against the invoice, derive the tier from the
  `plan_id` (not `notes.tier`), and verify account/subscription ownership. Checkout is a
  stub today, so this isn't currently reachable. (Replay idempotency *is* handled.)
- **Legal-document drafting** — the runner executes AI-emitted docx-js in a Node `vm`,
  which is **not** a security boundary. Run it under OS-level isolation (separate user,
  seccomp, no network, read-only FS / container) before exposing it, or switch to a
  declarative JSON document spec. Disabled by default unless a Node runtime + the runner's
  `docx` dep are present (`cd packages/nm_core/nm_core/ai/docx_runner && npm install --omit=dev`).
- **Public endpoints** — `X-Forwarded-For` is currently trusted for rate-limit keys and the
  limiter fails open; honor XFF only from trusted proxies (and consider fail-closed for the
  unauthenticated write endpoints) behind a real reverse proxy.

---

## Docs

| Doc | What |
|---|---|
| [`docs/GAP_ANALYSIS_legacy.md`](docs/GAP_ANALYSIS_legacy.md) | Legacy → greenfield gap analysis + the porting roadmap (waves 1–5, fixed/deferred items) |
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
