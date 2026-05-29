# Nowlez Munshi — Engineering Spec v1

> Turns `PRODUCT_v1.md` into buildable detail. Resolution: domain model + schema,
> bounded-context contracts, canonical flows, surface inventory, cross-cutting
> rules, and M1 acceptance criteria. Later milestones get their own spec sections
> as we reach them. This is a **clean redesign** informed by — not copied from —
> the existing `data_access` models (no `legacy_*` columns, no dual-write, no
> uuid5 placeholders, no brand-extension split).

---

## 1. Domain model & schema

One `User` (phone-canonical) — no per-brand extension tables; the unified product
has one kind of account. Teams arrive in M4 via `Account` + `Membership`.

### Identity & access
- **User** — `id` (uuid pk), `phone` (unique, E.164), `name`, `email` (nullable,
  unique), `locale` (`en`|`hi`), `timezone` (default `Asia/Kolkata`), `is_active`,
  `last_login_at`, `created_at`, `updated_at`.
- **OtpCode** — `id`, `phone`, `code_hash` (argon2id), `channel` (`whatsapp`|`sms`),
  `attempts_remaining` (default 3), `expires_at` (+10 min), `used_at`, `created_at`.
- **AuthSession** — `id`, `user_id` fk, `refresh_token_hash` (sha256), `user_agent`,
  `ip_address`, `created_at`, `expires_at` (+30 d), `revoked_at`.
- **Account** *(M4, teams)* — `id`, `name`, `owner_user_id`, `created_at`.
- **Membership** *(M4)* — `account_id`, `user_id`, `role` (`owner`|`editor`|`viewer`).

### Cases
- **Case** — `id` (uuid pk), `user_id` fk (owner), `cnr` (16-char, unique per user),
  `portal` (`district`|`highcourt`), `title`, `parties` (json), `court`, `judge`,
  `stage`, `case_status`, `next_hearing_date`, `acts` (json), `history` (json),
  `refresh_enabled` (default true), `added_via` (`web`|`whatsapp`),
  `last_refreshed_at`, `last_change_at`, `raw_response` (json), `created_at`,
  `updated_at`. Unique `(user_id, cnr)`; indexes on `user_id`, `cnr`,
  `next_hearing_date`. Full-text on title/parties (Postgres tsvector; M2).
- **CaseOrder** — `id`, `case_id` fk, `order_id` (eCourts id, unique per case),
  `order_date`, `descriptive_name` (AI-named), `summary` (AI), `file_path`,
  `page_count`, `created_at`.
- **CasePreference** — `(user_id, cnr)`, `alert_level` (`all`|`new_orders`|
  `digest_only`), `snooze_until`, `digest_enabled`, `label`.

### Messaging & notifications
- **Notification** — `id`, `user_id` fk, `case_id` (nullable), `type`
  (`status_change`|`hearing_date_change`|`new_orders`|`disposal_change`|`transfer`),
  `title`, `body`, `channels_sent` (json), `read_at`, `created_at`.
- **InboundMessageLog** — `id`, `provider_message_id` (unique — Meta dedup),
  `user_id`, `handler_name`, `status`, `error`, `processed_at`. (Idempotency.)
- **OutboundMessage** — `id`, `to_phone`, `template`, `provider_message_id`
  (wamid), `dedup_key`, `send_date_ist`, `status` (`pending`|`sent`|`delivered`|
  `read`|`failed`), `error_code`, `created_at`.

### Cross-cutting
- **AuditLog** — `id`, `user_id` (nullable), `event_type`, `source`, `metadata`
  (json), `ip_address`, `created_at`.
- **Subscription** *(built, NOT enforced in v1)* — `id`, `user_id`, `tier`,
  `status`, `period_start`, `period_end`, `provider_ref`. Present so monetization
  can switch on later without schema change.

---

## 2. Bounded-context contracts (`nm_core.*`)

Each context exposes a small public surface; SQLAlchemy stays internal.

- **config** — `Settings` (pydantic-settings), `get_settings()`. Prod-safety:
  `assert_production_ready()` hard-fails if dev-default DB/Redis URLs are live in a
  prod env. Sections: db, redis, jwt, otp, meta/sms, gemini, sentry.
- **db** — `Base`, `make_engine(url)`, `make_session_factory(engine)`,
  `session_scope()` (commit/rollback ctx). Single Alembic chain in `db/migrations/`.
  SQLite-variant types for unit tests; Postgres for integration.
- **observability** — `get_logger(name)`, `metrics` (counters/gauges),
  `init_sentry()`, `audit(event_type, ...)`.
- **identity** — `start_phone_login(s, *, phone, ip)`, `verify_otp_and_login(s, *,
  otp_id, code, name=None, ...)`, `login_with_password(...)`,
  `refresh_access_token(...)`, `revoke_session(...)`, `encode_access_token(user_id)`,
  `decode_access_token(token)`; `UserRepository`, `SessionRepository`, `OtpRepository`.
- **ecourts** — `get_client_for(cnr)`, `fetch_case(cnr)`, `fetch_pdf(url)`;
  district + HC clients behind the resilience registry (circuit breaker → retry →
  semaphore); `classify_cnr(cnr)`.
- **cases** — `CaseRepository` (CRUD, `list_by_user`, `get_by_cnr`,
  `get_due_for_refresh`), `sync_case(user, cnr)` (fetch → upsert → diff),
  `detect_changes(old, new) -> list[Change]`.
- **messaging** — `WhatsAppClient` (Meta Graph), `SmsClient` (MSG91),
  `TemplateRegistry`, `enqueue_send_text/template/document(...)`,
  `process_send_queue()` (RQ worker entry), `verify_signature()`,
  `parse_incoming()`, `claim_message(provider_id)`.
- **notifications** — `dispatch(user, change, *, s)` → fan-out across in-app +
  email + push + WhatsApp with policy (high-impact gating, opt-out, kill-switch).
- **ai** — `ask(user, question, *, s, channel) -> Answer` (single-turn over the
  user's case book; citations); `build_case_context(cases)`; Gemini client with a
  deterministic offline fallback. (Agentic loop later, behind this interface.)
- **billing** *(deferred)* — `effective_tier(user)`, repositories. Not enforced in v1.

---

## 3. Canonical flows (target state)

1. **Phone-OTP login (both doors).** `start_phone_login` → OTP via WhatsApp (SMS
   fallback) → `verify_otp_and_login` → find-or-create User → JWT (30 m) + refresh
   (30 d). Web stores refresh in HttpOnly cookie; WhatsApp users are implicitly
   authed by phone.
2. **Add & track a case.** Add (web form / WhatsApp `/save`) → `sync_case` (fetch
   via ecourts → upsert Case + orders) → scheduled refresh per cadence; quiet hours
   respected.
3. **Change → unified dispatch.** Refresh detects change → `detect_changes` →
   `notifications.dispatch`: always in-app; email (non-digest); WhatsApp for
   high-impact (gated, opt-out, kill-switch); push fallback. Idempotent per
   `(user, case, type, day)`.
4. **Ask Munshi (both doors, one brain).** Web `POST /ask` and WhatsApp free-text
   both call `ai.ask(user, q, channel=…)`. Same case book → same answer; `channel`
   is metadata. (Asserted by a parity test, as in the thin MVP.)
5. **Cause-list digest.** Nightly indexer pulls tomorrow's lists → `digest` unions
   list rows + monitored cases → WhatsApp template (text/PDF).
6. **WhatsApp → web continuity.** Same phone = same User. WhatsApp replies include
   deep-links (`/cases/{cnr}`, `/chat`) that open the web app already authenticated
   for that user (short-lived signed link → session).

---

## 4. Surface inventory

### Web API (REST, `/api`)
- **auth:** `POST /auth/start`, `/auth/verify`, `/auth/refresh`, `/auth/logout`,
  `GET /me`.
- **cases:** `GET /cases`, `POST /cases`, `GET /cases/{cnr}`, `DELETE /cases/{cnr}`,
  `POST /cases/{cnr}/refresh`, `GET /cases/{cnr}/orders`, `GET /cases/{cnr}/orders/{id}/pdf`.
- **prefs:** `PUT /cases/{cnr}/prefs` (alert_level/snooze/digest/label).
- **ai:** `POST /ask` (single-turn; streaming variant later).
- **notifications:** `GET /notifications`, `POST /notifications/{id}/read`.
- **calendar (M4):** `GET /calendar`. **teams (M4):** `…/accounts`, `…/members`.
  **admin (M4):** `…/admin/*`. **billing (deferred):** `…/billing/*`.

### WhatsApp commands (bot)
- CNR text lookup; `/search` (party/case-type/FIR); QR image.
- `/save`, `/forget`, `/saved`, `/snooze`, `/alerts`.
- `/digest_on`, `/digest_off`; `/portfolio`, `/today`, `/this_week`, `/label`; CSV import.
- **free text → `ai.ask`** (the Munshi brain). `/start`, `/help`, `STOP`.

---

## 5. Cross-cutting rules (the "hardened" contract)

- **Auth:** phone-canonical; JWT HS256 (30 m) + opaque refresh (30 d, hashed);
  argon2id for passwords/OTP. One `JWT_SECRET_KEY` across all process types.
- **Idempotency:** inbound `provider_message_id` unique; outbound Redis `SETNX` +
  per-day delivery slot; OTP single-use + attempt cap.
- **Resilience:** eCourts registry (circuit breaker → retry → semaphore); 6 h case
  cache; the **outbound queue worker is a monitored liveness invariant**.
- **Config:** prod-safety hard-fail on dev-default DB/Redis URLs.
- **Observability (M5 targets, instrumented from M2):** alerts on outbound-queue
  drain rate/depth, refresh lag, eCourts circuit state, cache staleness, OTP
  delivery-failure rate. No silent failures.
- **Channel-agnostic:** `ai` and `notifications` are pure domain services; web, bot,
  worker call identical functions.

---

## 6. M1 acceptance criteria (buildable now)

**`nm_core.config`**
- [ ] `Settings` loads typed sections from env; `get_settings()` is cached.
- [ ] `assert_production_ready()` raises if a prod env marker is set while DB/Redis
      URLs are dev-defaults. Unit-tested both ways.

**`nm_core.db`**
- [ ] `Base`, `make_engine(url)`, `make_session_factory`, `session_scope()`.
- [ ] All M1 models (`User`, `OtpCode`, `AuthSession`, `AuditLog`) created via
      Alembic migration `0001`; `create_all` works on SQLite for tests.
- [ ] UUID + JSON columns round-trip on both SQLite and Postgres.

**`nm_core.identity`**
- [ ] `start_phone_login` issues + stores hashed OTP, routes WhatsApp→SMS, rate-limits
      (5/phone/hr, 20/ip/hr).
- [ ] `verify_otp_and_login` enforces single-use, attempt cap, expiry; find-or-creates
      User; mints JWT + refresh.
- [ ] `encode/decode_access_token` round-trip; `refresh_access_token`,
      `revoke_session` work.
- [ ] A DEV bypass (`dev_login`) mints a valid token without OTP delivery, gated by
      `DEV_MODE`.
- [ ] Tests: OTP happy-path, expiry, reuse, attempt-exhaustion, rate-limit, JWT
      round-trip, refresh + revoke. SQLite, offline.

**Exit:** `pip install -e packages/nm_core`, `alembic upgrade head` (SQLite + a
Postgres CI job), `pytest` green; `ruff`/`mypy` clean.
