# M4 plan — Continuity (Bet #2) + full practice ops

> Scope confirmed: continuity handoff **plus all** of calendar/analytics, teams/RBAC,
> documents, growth, billing scaffolding, OnlyOffice DOCX editing, voice, admin.
> This is the largest milestone — delivered as **sequenced, individually-tested
> sub-waves**, not one push. Teams/RBAC is sequenced early because it changes the
> access model every later feature queries. No data migration (clean launch).

## Sequence & rationale

| Sub-wave | Why here |
|---|---|
| M4a Continuity handoff | Independent, high-value (Bet #2), low risk → first. |
| M4b Teams/RBAC + access scoping | Changes case/thread/notification ownership → must land **before** features that query them, or we refactor twice. Highest architectural risk. |
| M4c Calendar + analytics | Pure read-models over (now account-scoped) cases. |
| M4d Documents | Order-PDF storage + AI summaries; new AI tool. |
| M4e Growth | Onboarding, bilingual EN/HI, re-engagement, email. |
| M4f Billing scaffolding | Built, **not enforced**; isolated. |
| M4g Voice I/O | Client-side; isolated. |
| M4h Admin dashboard | Internal ops view. |
| M4i OnlyOffice DOCX editing | External Document Server infra → heaviest, last. |

---

## M4a — Continuity handoff (Bet #2)

Phone-canonical identity already makes a WhatsApp user and web user with the same
phone **one account** (shared cases/alerts/threads). The missing piece is the
authenticated handoff.

- **identity**: `create_link_token(user_id)` → short-TTL (~10 min) JWT with
  `purpose:"link"`; `exchange_link_token(token)` → mints access+refresh. The normal
  access-token decoder rejects `purpose:"link"` (and vice-versa).
- **web**: `POST /api/auth/link`; SPA route `/link#token=…&next=…` auto-logs-in and
  deep-navigates. `WEB_BASE_URL` setting.
- **bot**: replies carry "📱 Continue on web" links — generic, per-case
  (`/cases/{cnr}`), per-chat.
- **tests**: create→exchange round-trip; expiry; purpose cross-rejection; bot embeds.
- *Hardening (M5):* single-use link tokens (DB jti) — v1 relies on short TTL.

## M4b — Teams / RBAC (the access-model change)

**Decision:** every user gets a **personal `Account`** at signup; cases/threads/
notifications carry `account_id`; access = **membership** in that account; role
(`owner`/`editor`/`viewer`) gates writes. Personal use = a one-member account, so
there is a single code path. (Clean launch → no backfill.)

- **models**: `Account`, `Membership(account_id, user_id, role)`; add `account_id` to
  `Case` (+ threads/notifications as needed). Migration 0006.
- **access layer**: `accessible_account_ids(user)` + repository queries scoped by
  account, not raw `user_id`. A `require_role` dependency for write endpoints.
- **flows**: create/rename account, invite by phone (creates membership; invitee
  onboards via OTP), list members, change role, leave.
- **web**: a Team settings view + an account switcher; bot stays personal-account
  scoped for v1.
- **risk/tests**: every existing case/notification/chat query must be re-pointed at
  account scope — covered by access-control tests (viewer can't write, non-member
  can't read).

## M4c — Calendar + portfolio analytics

- **web API**: `GET /api/calendar?from&to` (hearings in range, account-scoped);
  `GET /api/analytics` (counts by stage/court/portal, upcoming-7/30-day load,
  alerts-by-type).
- **SPA**: a month calendar view + a dashboard of cards/simple charts.
- Pure reads over existing data; tests assert grouping + range filters.

## M4d — Documents

- **storage**: a small `Storage` interface (`put/get/url`), default local dir
  (`STORAGE_DIR`), S3-compatible later. Worker downloads new order PDFs via
  `ecourts.fetch_pdf` → stores → records `file_path`/`page_count` on `CaseOrder`.
- **summaries**: text extraction (pdfplumber for text PDFs; image-only/OCR deferred)
  → `ai.summarize_order()` → store `descriptive_name`/`summary`. Surface in case
  detail + a new AI tool `get_order_text(cnr, order_id)` so the Munshi can quote orders.
- **tests**: offline (fake storage + a sample text PDF); summary persisted; tool works.

## M4e — Growth

- **onboarding**: first-run web wizard (name, locale, add first case) + WhatsApp
  `/start` flow; `onboarded_at` on User.
- **bilingual EN/HI**: `User.locale` drives a finite i18n string set — SPA dictionary,
  bot replies, and WhatsApp template language. (Translate the bounded string set.)
- **re-engagement**: worker cron — nudge dormant users (no activity in N days),
  opt-out respected; `re_engage_*` fields.
- **email**: pluggable provider (SMTP/SES/Resend); transactional onboarding + a daily
  digest email mirroring the WhatsApp digest. `EMAIL_*` settings, prod-safety as needed.

## M4f — Billing scaffolding (built, NOT enforced)

- **models**: `Subscription(account_id, tier, status, period_*)`; tiers
  `advocate/counsel/chambers/free`. Migration.
- **logic**: `effective_tier(account)`; `feature_allowed(...)` returns **True for all**
  in v1 (no paywall). Provider abstraction (Razorpay) behind an interface, stubbed.
- Keeps monetization a config-flip later; zero user-facing gating now.

## M4g — Voice I/O

- **SPA only**: Web Speech API — mic dictation into the Ask-Munshi input;
  text-to-speech read-back of answers. Feature-detected; no backend. (Server TTS later.)

## M4h — Admin dashboard

- **gate**: `User.is_admin`; `require_admin` dependency.
- **API/UI**: users, cases, outbound delivery health (queue/slot/failures), circuit
  state, recent audit events — the observability seed that M5 expands.

## M4i — OnlyOffice DOCX editing (heaviest; external infra)

- **infra**: an OnlyOffice **Document Server** (container) — a deployment dependency;
  add to `deploy/` compose.
- **integration**: `Document` model (account-scoped); web editor config + JWT +
  save callback endpoint; storage via the M4d `Storage`. Create/edit/list DOCX.
- Flagged as the largest lift; lands last so it can't block the rest.

---

## Cross-cutting
- Each sub-wave: tests + migration land **with** the feature; ruff/mypy/CI stay green.
- Account-scoping (M4b) is the load-bearing refactor — do it before M4c/d.
- Billing unenforced; OnlyOffice gated behind its infra being present.
- Observability hooks added in M4h feed the M5 hardening milestone.
