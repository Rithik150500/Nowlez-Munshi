# Nowlez Munshi — Target Architecture (greenfield, consolidated, hardened)

> The blueprint for the final product: a single monorepo containing a rewritten
> domain **core** and the apps that sit on it. Same proven stack (Python 3.12 ·
> FastAPI · SQLAlchemy 2 · Alembic · Postgres · Redis/RQ · React 19 + Vite), new
> clean code. Decisions are marked **[D]**; open items **[?]**.

## 1. Principles (the "hardened" mandate)

1. **One repo, one core, one schema, one Alembic chain.** No cross-repo pins, no
   `uuid5` bridge, no dual-write — those were migration artifacts and the
   greenfield has no legacy store to bridge to.
2. **The core is pure domain.** `nm_core` has no FastAPI/HTTP/React knowledge. Apps
   depend on the core; the core depends on nothing app-specific.
3. **Channel-agnostic services.** The Munshi AI brain and notification dispatch are
   domain services callable identically by web, bot, and worker. The "same clerk,
   both doors" thesis is expressed *structurally*, not bolted on.
4. **Typed config with prod-safety hard-fails.** Carry forward the May-2026 lesson:
   refuse to boot in prod with dev-default DB/Redis URLs.
5. **Idempotency & resilience are designed in**, not patched: inbound dedup,
   outbound dedup, single-use OTP, the eCourts resilience registry.
6. **Every silent-failure mode we mapped gets a metric + alert.** Outbound queue
   depth & drain rate, eCourts circuit state, cache staleness, refresh lag.
7. **Always shippable.** Phased build; the legacy system keeps serving prod until a
   planned cutover.

## 2. Monorepo layout **[D]**

```
nowlez-munshi/
  pyproject.toml                  workspace tooling: ruff, mypy, pytest, coverage
  packages/
    nm_core/                      THE rewritten domain core (replaces shared/*)
      config/                     typed settings, secrets, prod-safety hard-fails
      db/                         SA2 base, engine factory, session, ONE Alembic chain
      observability/              logging, metrics, sentry, audit
      identity/                   OTP, password, JWT, sessions  (auth domain)
      ecourts/                    district + HC client, resilience registry, parsers
      cases/                      case model + repository, sync, change-detection
      messaging/                  Meta WhatsApp client, templates, SMS, outbound queue
      notifications/              channel-agnostic dispatch (in-app/email/whatsapp/push)
      billing/                    Razorpay subscriptions + postpaid invoicing
      ai/                         the "Munshi" brain: agentic chat over case data
  apps/
    web/                          FastAPI API + React 19 SPA (Nowlez web)
    bot/                          FastAPI WhatsApp webhook + dispatch registry
    worker/                       jobs/crons: refresh, monitoring, digests, re-engage, billing
  deploy/                         Dockerfiles, compose, CI, infra
  docs/                           this file, STATE_OF_THE_UNION, ADRs, runbooks
  tests/                          e2e + cross-cutting; unit/integration live by package
```

`web`, `bot`, `worker` are **separate process types / deployables** sharing the
core by import — independent scale & fault isolation, zero pin coordination.

## 3. Domain core boundaries

- **Repository pattern over raw DAOs.** Each context (`cases`, `identity`, `billing`)
  exposes a repository + domain services; SQLAlchemy stays an implementation detail.
- **`messaging.outbound`** owns the WhatsApp send queue. In a monorepo the
  producer/consumer seam is one tested module boundary — the worker consuming it is
  a **monitored liveness invariant**, killing Flow 1's silent-failure class.
- **`ai.munshi`** exposes `ask(user, question, *, ctx) -> Answer` as a pure service
  (single-turn now; agentic loop behind a stable interface later). Web, bot, worker
  all call the same function. (PR #1's thin MVP proved this shape end-to-end; it
  becomes the real `nm_core.ai` contract.)
- **`notifications.dispatch`** is the one fan-out path (in-app + email + whatsapp +
  push) with policy (high-impact gating, opt-out, kill-switch) in the core.

## 4. Data & schema **[D]**

- One clean Postgres schema authored fresh (no dual-write columns, no `legacy_*`
  forensic columns, no uuid5 placeholders). SQLite-variant types only for fast unit
  tests; integration tests run real Postgres.
- One Alembic chain from migration 0001.
- **Data migration is a first-class workstream:** a one-time ETL from the current
  production `data_access` schema → the new schema, with validation, dry-run, and a
  reversible cutover. Planned in Phase 8.

## 5. Build phases (each independently shippable, behind tests)

| Phase | Deliverable |
|---|---|
| **0** | Monorepo skeleton, tooling (ruff/mypy/pytest), CI, deploy scaffolding, ADR-0001 (this architecture). |
| **1** | `nm_core`: `config` + `db` + `observability` + `identity`. Foundation + auth, fully tested. |
| **2** | `nm_core.ecourts` + `nm_core.cases` (client, resilience, sync, change-detection). |
| **3** | `nm_core.messaging` (Meta/SMS + outbound queue) + `nm_core.notifications` dispatch. |
| **4** | `nm_core.ai` — the Munshi brain (channel-agnostic, graceful offline fallback). |
| **5** | `nm_core.billing` (Razorpay subscriptions + postpaid). |
| **6** | `apps/web`: FastAPI API + React SPA on the core. |
| **7** | `apps/bot` (webhook + handlers) + `apps/worker` (jobs/crons) on the core. |
| **8** | Production data ETL + cutover plan + parity verification against legacy. |
| **9** | Observability dashboards/alerts for every mapped failure mode; decommission legacy repos. |

Strangler-style: legacy keeps running through Phase 8; cutover is the only big-bang
moment, and it's reversible.

## 6. Deploy **[?]**

Converge on **one platform** (today: web on Railway, bot on a DO VPS). Leading
candidate: Docker Compose on a VPS (the bot's current, cheaper, lower-latency-to-NIC
model) with `web`/`bot`/`worker`/`cron` as compose services + Caddy + supercronic.
Final pick deferred to a deploy ADR.

## 7. Locked decisions & open questions

**Locked [D]:** monorepo (Option A); rewrite core + apps; same stack; one
Postgres/one Alembic chain; channel-agnostic AI + dispatch; adopt the
`Nowlez-Munshi` repo as the monorepo home.

**Open [?]:**
- Deploy platform (VPS Compose vs container platform).
- `apps/web` + `apps/bot` strictly separate, or a single FastAPI app with two
  routers + separate worker process? (Leaning separate for fault isolation.)
- Disposition of PR #1's thin MVP: fold its `ask_munshi` contract into `nm_core.ai`
  and remove the standalone app, or keep it as a `docs/` thesis reference.
- Brand/naming surface (one app "Nowlez Munshi", or "Nowlez" web + "Munshi" channel).

## 8. The payoff

Every fragility in `STATE_OF_THE_UNION.md` §"breaks" is **structurally eliminated**,
not patched: pin skew (one repo), uuid5 bridge (no legacy store), silent unsent
WhatsApp (in-repo tested seam + worker-liveness alert), mid-migration shims (clean
core), web-only AI (channel-agnostic service), split ops (one deploy model),
weak observability (alerts on every mapped failure mode).
