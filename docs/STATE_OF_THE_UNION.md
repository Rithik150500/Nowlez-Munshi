# Nowlez Munshi — State of the Union (pre-rewrite assessment)

> Honest assessment of the existing three-repo system (`casepilot` = Nowlez web,
> `ecourts-bot` = Munshi, `shared`) as the basis for deciding what the greenfield
> rewrite keeps, discards, and must do better. Written from a full read of all
> three repos.

## TL;DR

The product *works*, but it's **caught between two architectures**. Eight weeks of
prototyping migrated two independently-built apps onto a shared spine (Sub-projects
A→G), and the system is currently *mid-migration*: clean core in places, legacy
shims and cross-repo coupling in others. The "slight breaks all across" are almost
all symptoms of that in-between state — not deep design flaws. A consolidated
greenfield core is the right way to *finish the thought* the migration started.

## What is genuinely solid (promote the ideas, rewrite the code)

| Asset | Why it's worth carrying forward |
|---|---|
| **Phone-canonical identity** | OTP + argon2id + JWT + opaque refresh, WhatsApp-first with SMS fallback. The model is right. |
| **Unified `cases` domain** | One case schema serving both channels, with change-tracking (`last_change_at`). Correct shape. |
| **eCourts resilience layer** | Registry-driven circuit-breaker + retry + semaphore; deliberate exclusion of double-wrapped paths. Hard-won; keep the design. |
| **Channel-agnostic dispatch** | High-impact change → in-app + email + WhatsApp + push fan-out with graceful fallback. Good pattern. |
| **Config prod-safety hard-fails** | The May-2026 audit (hard-fail on dev-default DB/Redis URLs) encodes a real outage lesson. Carry it forward as a first-class rule. |
| **Idempotency discipline** | `message_log` unique constraint (inbound), Redis SETNX + per-day slot (outbound), single-use OTP. Designed-in, keep. |
| **Billing model** | Razorpay subscriptions (web) + postpaid per-case (bot) + cross-product exemption. The domain logic is sound. |

## Where the breaks concentrate (what the rewrite must fix)

1. **Cross-repo coupling is the root cause of fragility.**
   - **SHA-pin skew** — `casepilot@3d25eb4` vs `ecourts-bot@b5994ea` pin different `shared` commits; a migration in the gap can break the lagging app's Alembic chain. (See `docs` audit.)
   - **The `uuid5` placeholder bridge** — a constant that must match byte-for-byte across `shared/migrations` and `casepilot/backend/helpers.py`, guarded only by a test. One edit out of sync → duplicate case rows.
   - **The WhatsApp producer/consumer seam** — web *enqueues* sends; only the bot's worker *consumes*. If the worker is down, every Nowlez WhatsApp notification queues into Redis and is **silently never sent** (web reports success). This is the system's highest-value silent-failure surface.
   - *All three vanish in a monorepo with one core* — they are artifacts of the repo boundary, not the domain.

2. **Mid-migration debt.**
   - Dual-write + Sub-project G (SQLite → Postgres) is half-finished; `g_dual_write.py` / `g_observability.py` / reconciliation cron are transitional scaffolding.
   - Legacy shims: `backend/ecourts.py` (gutted adapter), the `0304/` Playwright scraper (pending retirement in "PR 7"), dropped-table negative tests.
   - Cutover scripts, HANDOFF docs, and `T_DAY_LAUNCH` orchestration indicate a system being *operated through* a migration rather than living in a settled architecture.

3. **The AI "Munshi" brain is web-only.** The agentic chat (Gemini over case data) lives in `casepilot/backend/chat.py` and isn't a channel-agnostic domain service — so WhatsApp can't use it. The product thesis (same clerk, both channels) isn't structurally expressed.

4. **Two deploy targets, two ops models.** Web on Railway; bot on a DO VPS via Docker Compose + Ansible + supercronic. Two scheduling systems (web's in-process scheduler vs the bot's RQ + cron). Operationally split.

5. **Observability is the weak link.** Most failure modes degrade *silently but safely* (push fallback, rate-limit messages, SMS fallback). Good for users, bad for operators — there's no single pane showing "is the outbound queue draining," "is the cache stale," "is dual-write diverging."

## The strategic read

The team didn't build one messy app — it built **one backend with two front doors, while the backend was still being assembled underneath it.** The greenfield rewrite's job is not to invent a new product; it's to **collapse the three-repo, mid-migration reality into one settled architecture** where the good ideas above are expressed cleanly and the coupling-induced breaks are designed out of existence.

That is why "rewrite the core too" is defensible here: the core's *current* messiness is migration residue (dual-write, uuid5 bridge, pin coordination), not essential complexity. A clean core sheds all of it — at the cost of a one-time data migration, which we plan for explicitly.
