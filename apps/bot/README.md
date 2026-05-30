# apps/bot — the WhatsApp door

A **FastAPI** app that receives Meta's WhatsApp Cloud API webhooks and replies through the
`nm_core.messaging` send queue. Inbound text/commands and QR-image case intake live here;
all business logic delegates to `nm_core`.

## Layout

```
nm_bot/
  app.py          webhook GET verify + POST receive; image→CNR resolution
  commands.py     the slash-command router, onboarding, STOP/START, WhatsApp→web deep-links
  search_flow.py  the guided eCourts search state machine (party / case-number / FIR)
```

## How it works

- **Verification** — `GET` handshake echoes `hub.challenge` against `META_VERIFY_TOKEN`.
- **Authenticity** — `POST` bodies are verified via the `X-Hub-Signature-256` HMAC using
  `META_APP_SECRET`.
- **Delivery** — outbound replies go through the RQ send queue (at-least-once, idempotent);
  the `apps/worker` `send_worker` drains it. Text, **interactive buttons/lists**, and
  **document (PDF)** sends are supported. Set `RQ_SYNC=1` to send inline in dev.
- **Intake** — a bare **CNR** tracks a case; an **image** is fetched from the Media API and
  its **QR** is decoded to a CNR (a friendly fallback message if unreadable).
- **Onboarding & consent** — a first greeting / `/start` shows a language picker + demo
  card; a bare **STOP**/**START** opts out of / back into proactive messages (DPDP),
  audited and enforced across all batch send paths.
- **Guided search** — `/search` runs an in-chat state machine
  (`search_flow.py` + `nm_core.conversation`): mode → state → district → court complex
  (→ police station for FIR) → query → tap a result to track. Carries the establishment
  code (`est_code`) to every eCourts call, and expires gracefully after the conversation TTL.
- **Commands** — `/start` `/help` `/web` `/search` `/saved` `/today` `/this_week`
  `/portfolio` `/label` `/refresh` `/alerts` `/snooze` `/forget` `/digest_on` `/digest_off`.
  Free text → the AI Munshi; some commands return a short-lived deep-link into the web app.

## Run locally

```bash
uvicorn nm_bot.app:app --reload --port 8001
```

Point your Meta webhook (or a tunnel) at `/webhook`. With offline defaults you can also
exercise the command router directly in tests.

## Test

```bash
pytest apps/bot
```
