# nm_core — the domain core

The pure domain core of Nowlez Munshi. It owns the data model, business rules, and all
integrations (eCourts, Meta, Gemini, Razorpay, SMTP). It has **no HTTP or UI knowledge** —
both front doors (`apps/web`, `apps/bot`) and the `apps/worker` crons import it.

## Module tour

| Module | Responsibility |
|---|---|
| `config` | Typed settings + the production-safety **hard-fails** (refuses to boot unsafely) |
| `db` | SQLAlchemy engine, session scope, dialect-aware Alembic chain |
| `identity` | Phone-canonical accounts, OTP, JWT, dev-login, WhatsApp→web link tokens |
| `ecourts` | District/HC portal clients, retries + circuit breaker, **offline** synthetic source, QR/CNR parsing; **HC cause-list** parsers (`cause_list_hc`) |
| `cases` | Case book: tracking, hearings, orders, change detection (incl. the imminent-hearing urgency split) |
| `cause_lists` | HC cause-list **indexer** + CNR back-resolution into `cause_list_rows` |
| `messaging` | Meta Graph client (text / interactive buttons+lists / document upload→send), inbound parsing, the RQ outbound send **queue** |
| `consent`, `conversation` | DPDP STOP/START opt-out; per-user Redis conversation state for the guided-search flow |
| `notifications` | Cross-channel fan-out (WhatsApp, email, web-push, in-app feed) |
| `ai` | The agentic Munshi (`tools`, `gemini`, offline) + `tavily` web search/fetch · `drafting` (docx-js) |
| `teams` | Chambers: membership + RBAC |
| `billing` | Tier gates + trials + cross-product exemption (`__init__`) · `cycles` · `munshi` (postpaid) · `coupons` · `referrals` · unified `webhook` |
| `documents` | Order/upload storage + OnlyOffice editing · `ocr` (Gemini) · `classify` (AI name/type/auto-attach) |
| `search` | Universal full-text search over the user's docs/cases/orders (PG tsvector / SQLite LIKE) |
| `export` | GDPR data-export ZIP builder · `waitlist` public signup · `ratelimit` (Redis IP limiter) |
| `push`, `email` | Web-push (VAPID) and email (console/SMTP) transports |
| `digests`, `drip`, `growth`, `tracking`, `holidays` | Cause-list/hearing digests, the D1–D27 drip campaign, re-engagement, the refresh sweep, the court-holiday calendar |
| `i18n`, `observability`, `storage`, `replay` | EN/HI strings, Sentry/alerts, blob storage, idempotent replay |

## Offline seams (how tests + a credless demo run)

- `ECOURTS_OFFLINE=1` → synthetic cases instead of the live portal.
- `GEMINI_API_KEY` unset → the deterministic offline AI agent.
- `TAVILY_API_KEY` unset → the `search_web` tool is hidden (case-book answers only).
- No Node runtime → the `draft_document` tool is hidden (drafting disabled).
- `fakeredis` + `RQ_SYNC=1` → no Redis/worker process needed.
- `respx` stubs outbound HTTP in tests.

## Legal-document drafting (Node)

`ai/drafting.py` renders AI-emitted [docx-js](https://docx.js.org) JavaScript to a DOCX
via a sandboxed Node subprocess (`ai/docx_runner/runner.js`; restricted `require`, no
fs/process). The ~100 reference templates live in `ai/reference/templates/`. The runner's
npm deps are **not** vendored — install them where the worker/web runs:

```bash
cd packages/nm_core/nm_core/ai/docx_runner && npm install --omit=dev
```

## Develop

```bash
pip install -e "packages/nm_core[test]"            # test extras: pytest, respx, fakeredis
# Migrations run from this package dir (Alembic's script path is relative):
(cd packages/nm_core && DATABASE_URL=sqlite:///../../dev.db python -m alembic -c alembic.ini upgrade head)
pytest packages/nm_core/tests
```
