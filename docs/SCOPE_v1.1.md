# Scope — v1.1 (post-launch iteration)

v1 (M1–M5) is feature-complete and deployable. v1.1 turns the deliberate v1 cuts and
the surviving review findings into the next iteration. Grouped by theme; pick per
priority.

## A. Scale & reliability
- **RQ outbound queue.** v1 sends WhatsApp inline (bot reply is at-least-once via the
  single-transaction trick). Move sends to a Redis/RQ queue + dedicated worker with
  retry/backoff so the webhook acks instantly and sends survive restarts. (Deferred from
  M5b.)
- **Bot transaction shape.** Move the eCourts/AI network calls *outside* the inbound DB
  transaction (currently the txn is held across them) once the queue lands.
- **Single-use link/doc tokens.** Add a `jti` + replay store so continuity and doc
  capability tokens are one-shot, not just short-TTL.
- **Observability dashboards.** Ship Grafana/Prometheus wiring + alert rules for the
  metrics already emitted (circuit-open, send-failed, refresh lag); structured JSON logs.

## B. Coverage & features
- **eCourts: live validation + canary.** Default is offline-synthetic. Add a recorded-
  fixture integration suite and a scheduled canary against the real portal (captcha/geo
  handling, schema-drift detection via `SchemaChanged`).
- **OCR for scanned orders.** `extract_text` handles text PDFs only; add OCR
  (Tesseract) so image-only orders get real summaries instead of the placeholder.
- **Cause-list digests.** Port the eCourts cause-list parsers and wire the nightly
  tomorrow-hearings / weekly-summary digest templates end-to-end (worker cron →
  daily-slot dedup is already there).
- **Search commands.** Party-name / case-number / FIR search (eCourts search endpoints)
  on web + bot; QR-image CNR intake on WhatsApp.
- **Email + push.** Digest/onboarding email parity with WhatsApp; FCM/web-push as a
  third alert channel (notifications fan-out already abstracts channels).
- **Shared-case writes.** v1 keeps refresh/prefs owner-scoped; consider account-scoped
  shared-case actions (with RBAC) for chambers.

## C. Polish & product
- **Full i18n.** Only `/help` is localized today — complete the EN/HI string set across
  bot replies and the SPA; add an onboarding language picker.
- **Billing turn-on.** Scaffolding exists, unenforced. Wire the Razorpay provider and
  flip `feature_allowed` to a real tier check when pricing is decided.
- **PWA.** Installable SPA + offline shell + web push.
- **Account switcher / chamber UX.** Polish the teams UI (active-account switch,
  per-case owner labels, member roles management).

## Suggested v1.1 cut
Smallest high-value slice: **A (RQ queue + dashboards)** for production reliability,
plus **B (eCourts live canary + cause-list digests)** for the daily-driver value
advocates feel most. Everything else is incremental.
