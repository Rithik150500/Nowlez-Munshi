# Nowlez Munshi — Product v1 (definition + roadmap)

> Product decisions locked via brainstorm (see also ADR-0001). This maps the
> feature scope onto the architecture phases in `TARGET_ARCHITECTURE.md`.

## 1. Definition

- **Who:** practicing **advocates & small chambers** in India (Nowlez's paying ICP —
  power users who manage many cases). Litigants/juniors can still onboard via
  WhatsApp and convert, but the product is designed for the advocate.
- **What:** *Your chamber's AI munshi* — every case, every hearing, every order,
  tracked and answered, on **web and WhatsApp**, over one account and one case book.
- **Scope:** **near-full port** of both existing apps' capabilities — but delivered in
  hardened waves (each wave tested + observable before the next), so breadth never
  outruns polish (the failure mode behind "breaks all across").
- **Monetization:** **deferred to post-launch.** The `billing` context is built but
  **not enforced** in v1 — no paywall — and stays pluggable so pricing can be turned
  on later without rework.

## 2. The three headline bets (all in for v1)

1. **AI Munshi on WhatsApp** — the agentic clerk answers case questions on WhatsApp,
   not just web (today it's web-only). The differentiator.
2. **WhatsApp → web continuity** — one phone-canonical account; WhatsApp deep-links
   into web; start light, deepen in the power tool.
3. **Unified case book + cross-channel alerts** — add anywhere, get pinged on
   WhatsApp, ask on either channel.

## 3. The "two doors" rule

- **Both doors:** account, case tracking & refresh, lookup, save/monitor, alerts,
  digests, the AI Munshi, the unified case book.
- **Web-only (depth):** DOCX editing, teams/RBAC, calendar, analytics, admin, voice.
  WhatsApp **deep-links** into these rather than reimplementing them.

## 4. Feature scope → milestone (near-full port; nothing dropped, only sequenced)

| Feature | Channel | Milestone |
|---|---|---|
| Phone-OTP account (identity) | both | M1 |
| Case add/track + automated daily refresh | both | M1 |
| CNR lookup (text / QR / party / FIR) | WhatsApp (+web search) | M2 |
| Save/monitor, snooze, alert-levels | both | M2 |
| Change alerts → in-app/email/push/WhatsApp | both | M2 |
| Cause-list digests (evening/amendment/weekly) | WhatsApp (+web) | M2 |
| Unified case book / portfolio list | both | M2 |
| **AI Munshi: agentic Q&A w/ citations** | **web + WhatsApp** | **M3** |
| Order-PDF AI naming + summaries | web (feeds AI) | M3 |
| Continuity: one account, WhatsApp→web deep-links | both | M4 |
| Calendar (hearings) | web | M4 |
| Portfolio analytics (/today, /this_week, labels, CSV import) | both | M4 |
| Teams + RBAC (owner/editor/viewer), shared clients | web | M4 |
| In-browser DOCX editing (OnlyOffice) | web | M4 |
| Onboarding (EN/HI) + bilingual | both | M4 |
| Re-engagement lifecycle | WhatsApp | M4 |
| Email (transactional + campaigns) | backend | M4 |
| PWA / push / installable | web | M4 |
| Voice I/O | web | M4 |
| Admin dashboard | web | M4 |
| Observability dashboards + alerts; clean go-live | — | M5 |
| Monetization (subscriptions/postpaid) | — | post-launch |

## 5. Milestones ↔ architecture phases

| Milestone | Delivers | Status |
|---|---|---|
| **M1 — Spine + tracking** | config, db, identity (phone-OTP, JWT, refresh) | ✅ done |
| **M2 — Both doors + alerts** | ecourts, cases + change classifier, messaging, notifications; worker (refresh sweep), bot (WhatsApp commands), web (REST API + React SPA), unified alerts → **Bet 3** | ✅ done |
| **M3 — AI Munshi everywhere** | agentic (function-calling) Q&A + threads on web **and** WhatsApp, citations, offline agent, parity test → **Bet 1** | ✅ done |
| **M4 — Continuity + full practice ops** | deep-link handoff (**Bet 2**), teams/RBAC, calendar+analytics, documents (PDF summaries + OnlyOffice DOCX), growth (onboarding/bilingual/re-engagement/email), billing scaffolding, voice, admin | ✅ done |
| **M5 — Harden + go-live** | observability/alerts, at-least-once bot reply, schema-drift guard, thin-MVP decommissioned, Docker/compose + deploy runbook | ✅ done |

## 6. Guiding principle

Port everything the advocate needs — but **one hardened wave at a time**, with tests
and observability landing *with* each feature, not after. The legacy apps keep
serving until M5's clean go-live (no data migration).
