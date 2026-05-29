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
3. ⬜ **Wave 3 — Monetization lifecycle:** billing schema, Munshi postpaid, Nowlez
   subscription machines, cross-product exemption, unified webhook + crons, web billing UI.
4. ⬜ **Wave 4 — AI differentiation:** Tavily search, legal-doc drafting + templates, chat
   feedback/edit/resume.
5. ⬜ **Wave 5 — Document/search depth + growth polish:** universal FTS, file-tree, OCR,
   drip email, GDPR export, richer re-engagement, ICS/voice/feedback/admin/client entity.

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
| Paginated order viewer (WhatsApp) | ⬜ deferred (needs interactive list + media UX polish) |
| Monetization lifecycle (all) | ⬜ Wave 3 |
| AI differentiation (Tavily, drafting, chat feedback) | ⬜ Wave 4 |
| Universal FTS · file-tree · OCR · drip · GDPR export · richer re-engage · ICS · voice · admin breadth · client entity | ⬜ Wave 5 |
