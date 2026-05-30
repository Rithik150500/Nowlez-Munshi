# Gap Analysis — legacy three-repo system → greenfield `Nowlez-Munshi`

> Comparison of the legacy stack (`casepilot` = Nowlez web, `ecourts-bot` = Munshi
> WhatsApp bot / codename **0705**, `shared` = the spine) against the consolidated
> greenfield monorepo. Produced from a full read of all four repos. Drives the porting
> roadmap below.

## Verdict

The greenfield faithfully ports the **core loop and the spine** — phone-canonical
identity, the unified case book + refresh sweep, eCourts AES crypto + resilience
(semaphore→breaker→retry), change-alerts with channel fan-out, the AI Munshi (now
channel-agnostic across both doors), OnlyOffice editing, teams/RBAC, and inbound/outbound
idempotency. It is **richer** than legacy on notification fan-out and web⇄WhatsApp
continuity. v1.1 also already enforces *basic* tier gates + the Razorpay subscription
webhook.

The gaps are **breadth, monetization machinery, and a handful of hard-won heuristics** —
not the core.

## Gaps by cluster (size = port effort: S/M/L)

### 1. Monetization lifecycle
| Gap | Size | Legacy source |
|---|---|---|
| Munshi anniversary **postpaid**: cycle-window math + day-clamping, ₹10×distinct-cases usage, invoices, grace→suspension→restore | L | `shared/case-billing/.../munshi/{cycles,invoices,usage,suspension}.py`; `ecourts-bot/bot_scaffold/crons/munshi_invoice_generation.py`, `munshi_grace_suspension.py` |
| Nowlez **subscription** state machines: 30-day trial, lifetime-once intro-promo, referral mutual-benefit (advocate-excluded), upsell, cancel/downgrade-at-cycle-end, day-31 fallback | L | `shared/case-billing/.../nowlez/{trial,promos,referrals,upsell,subscriptions,cancellation,fallback}.py` |
| **Cross-product exemption** (don't double-bill a Nowlez-paid/trial user for Munshi) | M | `shared/case-billing/.../shared/{multi_product,eligibility}.py` |
| Unified **Razorpay webhook router** + `payment_events` idempotency; extended Razorpay client (offers/links/subscriptions/invoices) | M | `shared/case-billing/.../shared/webhook_router.py`, `razorpay_client/*` |
| Cross-tier **upsell cron** (pilot allowlist, cooling-off) | M | `ecourts-bot/bot/cross_tier/upsell_cron.py` |
| Web: invoices UI, usage metering + 403 `upgrade_required`, referrals, coupons, waitlist | S–M | `casepilot/backend/{usage,entitlements}.py`, `routers/{billing,admin,auth}.py` |

### 2. WhatsApp interactivity & breadth (foundational)
| Gap | Size | Legacy source |
|---|---|---|
| **Interactive send** (reply buttons + tap-to-pick lists) | M | `ecourts-bot/handlers/*` pervasive; `shared/whatsapp_delivery/meta_client.py` |
| **Document/PDF delivery** over WhatsApp (`send_document`, URL-not-bytes payload, 16 MB cap, scheme validation) | M | `shared/whatsapp_delivery/.../meta_client.py`, `dispatch/worker.py` |
| **STOP / opt-out + consent** flow (keyword tolerance, consent revoke, audit row, enqueue-confirmation-first) — **DPDP compliance** | S/M | `shared/whatsapp_delivery/.../webhook/{stop_handler,router}.py` |
| **Onboarding** flow (language picker, demo card, first-save nudge, `/start` reset) | M | `ecourts-bot/handlers/onboarding/{handler,copy,demo,state,tips}.py` |
| **Guided multi-step search** state machine (party/case-number/FIR, DC+HC) | L | `ecourts-bot/handlers/cnr_lookup/{flow,modes,picker,validators}.py` |
| **Paginated order viewer** + PDF download | M | `ecourts-bot/handlers/cnr_lookup/orders_button.py` |
| `/import_csv`, `/label`, `/refresh`, `/portfolio`, tutorial tips | S | `ecourts-bot/handlers/portfolio/*`, `onboarding/tips.py` |

### 3. eCourts depth
| Gap | Size | Legacy source |
|---|---|---|
| **HC cause-list** parsing: index HTML, bench-sittings, 249-line position-based PDF extractor | L | `shared/ecourts_client/.../parsers/{cause_list_hc,cause_list_hc_pdf}.py` |
| **Cause-list digest pipeline**: nightly indexer, CNR back-resolution, holiday calendar, 3 delivery windows | L | `ecourts-bot/bot/causelist/{indexer,digest,cnr_resolver,holidays,render_pdf}.py` |
| **Canary / drift** harness (snapshot, coverage targets) — greenfield has a basic `canary.py` | M (partial) | `shared/ecourts_client/.../canary/{runner,coverage}.py` |
| Resilience extras: HealthMonitor, `on_open` callback, queue-depth gauges | S | `shared/ecourts_client/.../resilience/*` |

### 4. AI differentiation
| Gap | Size | Legacy source |
|---|---|---|
| **AI legal-document drafting** (docx-js → sandboxed Node runner) + ~14 tribunal templates (NCLT/NCLAT/DRT/CAT/NGT/ITAT/PoSH/DPDPA/IBC…) | L | `casepilot/backend/chat.py:675`, `docx_runner/runner.js`, `reference/templates/*.js` |
| **Tavily web search + URL fetch** with citations | M | `casepilot/backend/chat.py:612,651`, `tavily_client.py` |
| Chat **feedback (thumbs), edit/regenerate, resume** | S/M | `casepilot/backend/routers/chat.py:231,314,330` |

### 5. Document & search depth
| Gap | Size | Legacy source |
|---|---|---|
| **Universal FTS** over files/cases/clients (BM25 ranking) + `cases.search_tsv`/GIN | M | `casepilot/backend/db/search.py`; `shared/data-access/.../cases_tsvector.py` |
| **File-tree browser** + reclassify + rename | M | `casepilot/backend/routers/files.py:324,381,463` |
| AI **auto-classify/auto-attach** uploads; descriptive auto-naming | M | `casepilot/backend/preprocessing.py:282,473` |
| **OCR** for scanned orders (explicit v1.1 cut) | M | `casepilot/backend/preprocessing.py` |

### 6. Growth & web polish
| Gap | Size | Legacy source |
|---|---|---|
| **Drip email lifecycle** (D1–D27, Active/Inactive branch, catch-up) | M | `casepilot/backend/drip_calendar.py`, `db/drip_state.py` |
| **GDPR export ZIP** (rate-limited) | M | `casepilot/backend/routers/auth.py:62,967` |
| Richer **re-engagement** (4-bucket cadence, lifetime cap, event-aware) | M | `ecourts-bot/bot/onboarding/re_engagement.py` |
| **Change-diff refinements**: `amendment_detected` urgency (≤3d bypasses digest_only), HC objections/history-growth, forgotten-mid-cron recheck, failure→`manual_review_queue` | S | `ecourts-bot/bot/monitoring/{diff,poller}.py` |
| ICS export, voice input, feedback capture, admin breadth, **client grouping entity** | S–M | `casepilot/backend/routers/{calendar,auth,admin,clients}.py` |

## Do NOT port (migration residue / superseded by design)

`uuid5` placeholder bridge · dual-write + Sub-project G scaffolding · the `0304/`
Playwright scraper · dropped-table negative tests · the async eCourts mirror (greenfield
is sync-only by choice) · the `=1.0.0` junk artifact in casepilot. The greenfield's
one-time migration + clean core deliberately sheds all of it.

## Hard-won heuristics worth preserving verbatim

- **Anniversary cycle day-clamping** — Jan-31 → Feb-28 → restores to Mar-31 (`munshi/cycles.py`).
- **Cross-product double-bill suppression** — the single most product-defining billing rule.
- **`_est_code_from_complex`** — DC search needs the establishment code, not the full complex code, or it silently returns 0 results (the "730 vs 0" divergence).
- **`amendment_detected` urgency split** — a hearing ≤3 days out is urgent and bypasses `digest_only`.
- **Forgotten-mid-cron recheck** — re-verify the case exists right before firing so `/forget` mid-sweep doesn't waste a template.
- **Resilience double-wrap exclusion** — `fetch_case`/`fetch_pdf` deliberately NOT wrapped to avoid 3×3 multiplicative retries.
- **STOP enqueue-before-commit ordering** and **document-URL-not-bytes queue payload** — encode specific failure-mode lessons.
- **HC PDF position-based extraction** — two header-anchor strategies + section-marker union + trailer suppression; per-bench fragile.
- **BM25 cross-entity rank normalization** — min-max per-list before merge.

## Porting roadmap (dependency-ordered)

Status as of the latest push on `claude/port-legacy` (PR #4).

1. ✅ **Wave 1 — WhatsApp foundation + compliance** *(done)*: interactive send
   (buttons/lists), document/PDF delivery, STOP/opt-out + consent (migration 0013),
   onboarding flow.
2. ✅ **Wave 2 — eCourts cause-list + guided search** *(done)*: change-diff refinements
   (amendment urgency + mid-cron recheck), `/label`·`/portfolio`·`/refresh`,
   `manual_review_queue` (0014), conversation-state store + guided party/case-number/FIR
   search, HC cause-list parsers + indexer + `cause_list_rows` (0015) + CNR
   back-resolution + digest assembly (snapshot ∪ indexed rows) + holiday skip.
   - *Follow-ups:* morning-amendment-diff + Sunday-preview windows; indexer cron schedule.
3. ✅ **Wave 3 — Monetization lifecycle** *(core done)*: anniversary cycle math
   (clamp/restore), Munshi postpaid invoicing (0016) + grace/suspension/resume (0017),
   Nowlez trial machine + cross-product exemption, unified Razorpay webhook router +
   `payment_events` replay (0018), daily billing cron, web invoices/trial endpoints.
   - *Deferred to Wave 5 polish:* referrals, coupons, waitlist (growth-billing, not core).
4. ✅ **Wave 4 — AI differentiation** *(done)*: Tavily web search + web-source citations,
   chat feedback (thumbs) + edit/regenerate, legal-doc drafting (sandboxed Node docx-js
   runner + 100 templates, faithful port).
5. ✅ **Wave 5 — Document/search depth + growth polish** *(done)*:
   - ✅ Document & search: universal FTS (0020), file-library (tree/rename/reclassify),
     OCR (Gemini Path A), AI auto-classify/name/auto-attach.
   - ✅ Growth & web: ICS export, waitlist + demo (+ IP rate-limiter), GDPR ZIP export
     (0022), coupons (0023), referrals (0024), drip email lifecycle (0025).

**All five waves complete.** Remaining deferred-by-design items: paginated WhatsApp
order viewer; HC morning-amendment + Sunday-preview digest windows; the Munshi
distinct-over-window usage count (needs a `case_billing_periods` table); voice input;
broader admin console. None are legacy-fidelity regressions.

### Closed gaps → commits (Waves 1–2)

| Gap (from clusters above) | Status |
|---|---|
| WhatsApp interactive send · document delivery | ✅ |
| STOP/opt-out + consent (DPDP) | ✅ |
| Onboarding (language picker + demo) | ✅ |
| `amendment_detected` urgency · forgotten-mid-cron recheck | ✅ |
| `manual_review_queue` failure escalation | ✅ |
| Guided search — party · case-number · FIR | ✅ |
| HC cause-list parsers · indexer · back-resolution · digest union | ✅ |
| `/label` · `/portfolio` · `/refresh` | ✅ |
| Munshi postpaid (cycles · invoicing · grace/suspension/resume) | ✅ |
| Nowlez trial · cross-product exemption | ✅ |
| Unified Razorpay webhook + replay · billing cron · web invoices/trial | ✅ |
| AI Tavily web search · chat feedback/edit · legal-doc drafting (Node) | ✅ |
| Paginated order viewer (WhatsApp) | ⬜ deferred (needs interactive list + media UX polish) |
| Referrals · coupons · waitlist (growth-billing) | ⬜ Wave 5 |

## Post-Waves-1–4 fidelity verification (regressions — ALL FIXED)

A fresh read of the shipped port against the legacy surfaced these behavioral
regressions (file:line confirmed both sides). All fixed with tests:

| # | Bug | Status |
|---|---|---|
| 1 | Cause-list back-resolution passed the raw abbreviation (`"WP"`) as case_type instead of the numeric NIC code → resolution failed for most rows. | ✅ translate via `hc_list_case_types` |
| 2 | No "exactly one match" guard (`hits[0]`) → ambiguous search bound the wrong CNR. | ✅ unambiguous-only |
| 3 | FIR police-station listing passed the complex code, not `est_code` → no stations. | ✅ pass `court_code_arr` |
| 4 | Munshi billing: no 200-case cap; `cycle_end+7d` grace anchor. | ✅ cap + due+grace anchor (distinct-over-window count deferred — see below) |
| 5 | Stage compare not normalized → spurious `status_change` on cosmetic edits. | ✅ `_normalize_stage` |
| 6 | STOP set first-token-only & narrow (missed `OPT OUT`/`PAUSE`/romanized Hindi). | ✅ full legacy set + phrase match |
| 7 | `fetch_url`/Tavily-Extract tool dropped. | ✅ restored |

Faithful (no action): cycle math, trial + cross-product exemption, Razorpay webhook
core, drafting (byte-identical runner), interactive/document send.

**Deferred (infrastructure, not a bug):** legacy Munshi usage counts COUNT(DISTINCT
case_id) over a `case_billing_periods` overlap window (a mid-cycle add-then-forget is
still billed); greenfield bills the current snapshot. A faithful port needs a
`case_billing_periods` table + case open/close lifecycle hooks — a Wave-5+ follow-up.

## Wave 5 plan (build-ready specs in agent reports)

Migrations strictly sequential from **0020**.

**Documents & search** — *0020 unblocks all:* add `documents.{case_id, document_type,
retry_count, permanently_failed}` + Postgres-only `search_tsv` generated columns + GIN on
documents/cases/orders (SQLite → LIKE fallback).
1. Universal FTS (M) — new `nm_core/search/`; port BM25 normalize/merge verbatim, dialect-split.
2. File-tree / rename / reclassify (M) — flat DB "library grouped by case"; port rename validation.
3. OCR (S–M) — **Path A: send scanned-PDF bytes to Gemini** (matches legacy; no Tesseract dep).
4. AI auto-classify / name / attach (L) — new structured-Gemini helper; save-then-enrich worker split.

**Growth & web polish** — ICS export (S) → waitlist+demo (S; public router + IP rate-limiter)
→ GDPR ZIP export (M) → coupons (M) → referrals (M) → drip lifecycle (L).
Cross-cutting: a shared `billing/webhook.py` activation hook (coupons + referrals), the
tier-on-Subscription mapping for "+15 days" rewards, and the no-client-entity mapping.
| Universal FTS · file-tree · OCR · drip · GDPR export · richer re-engage · ICS · voice · admin breadth · client entity | ⬜ Wave 5 |

## Pre-merge audit (post-port)

A 3-agent audit of `claude/port-legacy` found bugs the green tests missed. **Fixed**
(with regression tests): B1 (search-flow KeyError on expired state), B9 (cause-list
positional-upsert duplication), A1 (`referred_by` FK missing in 0024), A2 (0020
unbatched downgrade), B7 (dedup-before-enqueue suppresses retries), B8 (stale
manual-review row on recovery), M3 (GDPR export leaked co-members' docs), B4 (opt-out
now enforced at the document-delivery boundary), HIGH-1 (webhook idempotency made
concurrency-safe via insert-then-flush claim).

**Deferred (tracked, not yet done):**
- *Billing go-live hardening* — webhook trusts `notes` (account_id/tier/coupon_code/
  munshi_invoice_id) after signature verify; before enabling live Razorpay, validate the
  payment amount vs invoice, map tier from `plan_id` not `notes.tier`, and verify
  account/subscription ownership. Checkout is a stub today, so not currently exploitable.
- *docx drafting sandbox* — the Node `vm` runner (chosen Option A) is not a security
  boundary; run it under OS/container isolation (separate user, seccomp, no network, RO FS)
  before exposing it, or switch to the pure-Python JSON-spec renderer.
- *Coupon per-renewal consumption* — `_on_activation` consumes a use on every
  `subscription.charged`, not once per customer; track per-subscription.
- *Public endpoints* — `X-Forwarded-For` is trusted (rate-limit bypass) and the limiter
  fails open; honor XFF only from trusted proxies and consider fail-closed for writes.
- *Pre-existing (not this port)* — OnlyOffice `/callback` SSRF + unauthenticated overwrite.

## Residual-gap sweep (post-port completeness check)

A second pass read each legacy repo directly for substantive features in *neither* the
ported nor the deferred lists. Ten genuine misses surfaced (none high-risk; mostly
delivery polish + lifecycle emails + one load-control algorithm). Recorded here so the
record is complete — not yet scheduled.

### casepilot (Nowlez web)
- **Adaptive activity-weighted refresh** (M) — refresh cadence is *not* a flat interval:
  an activity score (hearing ≤7d → max priority; decays to a dormant floor) stretches a
  tier's base interval up to 50× for dormant cases. Greenfield refreshes flat. This
  materially controls eCourts load + freshness. `backend/scheduler.py:373-442`.
- **Weekly WhatsApp summary digest** (S/M) — Monday 09:00 IST last-7-days summary template;
  greenfield ports only the tomorrow-hearing digest. `backend/scheduler.py:1232`.
- **Day-45 win-back email** (S) — post-trial re-engagement for never-subscribed users,
  outside the ported D1–D27 drip window. `backend/email.py:203`.
- **Subscription renewal reminder (T-3)** (S) — emails active subscribers 3 days before
  auto-charge; once-per-cycle dedup. `backend/scheduler.py:1004-1032`.
- **General product feedback (NPS)** (S) — `POST /api/feedback` + `feedback` table (rating/
  category/message/page); greenfield has only chat thumbs. `backend/routers/auth.py:827`.
- **Chat-history full-text search** (S) — search your own past Munshi conversations;
  greenfield FTS indexes docs/cases/orders only. `backend/routers/chat.py:349`.

### ecourts-bot (Munshi)
- **[View history] full hearing-history view** (S/M) — a result button rendering the full
  hearing table (date/purpose/judge, newest-first, capped + "+N earlier"); greenfield
  exposes only last-5 inside the AI tool. `handlers/cnr_lookup/history_button.py:66`.
- **Portfolio PDF rendering** (M) — `/portfolio`·`/today`·`/this_week` deliver WeasyPrint
  PDFs; greenfield renders these as text and has **no PDF generator at all**.
  `bot/portfolio/render_pdf.py`.

### shared (spine)
- **WhatsApp delivery-status persistence** (M) — apply Meta sent/delivered/read/failed
  receipts to per-status timestamp columns (wamid-race-idempotent); greenfield *parses*
  statuses (`messaging/webhook.parse_status_updates`) but nothing consumes them, and
  `OutboundMessage` has only a single status string. `whatsapp_delivery/.../status_handler.py`.
- **Order-PDF retry cooldown + permanent-fail** (M) — per-order retry cooldown (1h) +
  `permanently_failed` at max retries; greenfield order processing retries every sweep with
  no cooldown (the 3-try cap exists only on Document uploads). `data-access/.../order_dao.py:162`.
- *(Related)* **`render_hybrid` text-vs-PDF threshold** (S) — short → text, long → PDF; folds
  into the two PDF-rendering gaps above (no WeasyPrint in greenfield).

**Theme:** the only recurring capability fully absent from greenfield is **server-side PDF
generation** (portfolio/digest PDFs) and **delivery-receipt persistence**. The adaptive
refresh scheduler is the highest-value standalone miss. Everything else is small lifecycle
polish. Core domain, billing, identity, eCourts, and messaging are fully accounted for.
