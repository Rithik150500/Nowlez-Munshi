# Nowlez Munshi

**Your chamber's AI munshi — every case, every hearing, every order, tracked and
answered, on web and WhatsApp, over one account and one case book.**

*Munshi* (मुंशी) is the traditional legal clerk. This is the consolidated, greenfield
rebuild of the Nowlez (web) and Munshi (WhatsApp) products into **one core with two
front doors** — phone-canonical, so a web user and a WhatsApp user with the same
number are the same account.

## Layout (monorepo)

```
packages/nm_core/        the domain core — pure, no HTTP/UI knowledge
  config db identity ecourts cases messaging notifications ai
  teams billing documents growth observability storage tracking email
apps/web/                FastAPI REST API + React SPA (the web door)
apps/bot/                WhatsApp webhook + command router (the WhatsApp door)
apps/worker/             refresh sweep, document processing, re-engagement crons
docs/                    state-of-the-union, architecture, product + per-milestone plans
deploy/                  deployment compose (incl. OnlyOffice document server)
```

## What it does

- **Unified case book + cross-channel alerts** — add a case anywhere (CNR on
  WhatsApp or the web), it's tracked and auto-refreshed; status / hearing-date /
  new-order / disposal / transfer changes are pushed to WhatsApp and the in-app feed.
- **AI Munshi on both doors** — an agentic (function-calling) clerk answers questions
  over your case book with citations, on web chat and WhatsApp, with persisted threads.
- **Continuity** — WhatsApp replies deep-link into the already-authenticated web app.
- **Practice ops** — calendar + portfolio analytics, chambers (teams/RBAC), order-PDF
  summaries + in-browser DOCX editing, bilingual EN/HI, voice, admin, billing
  scaffolding (not enforced in v1).

## Develop

```bash
python -m venv .venv && . .venv/bin/activate
pip install -e "packages/nm_core[test]" -e apps/web -e apps/bot -e apps/worker
DATABASE_URL=sqlite:///./dev.db python -m alembic -c packages/nm_core/alembic.ini upgrade head
pytest packages/nm_core/tests apps          # offline; no creds needed
```

Everything runs **offline** by default: `ECOURTS_OFFLINE=1` serves synthetic cases and
the AI falls back to a deterministic agent when `GEMINI_API_KEY` is unset, so the full
suite and a local demo work with no external services.

See `docs/` for the architecture, product spec, and milestone plans (M1–M5). Prod
configuration is enforced by hard-fails (see `nm_core.config`); deployment is in
`docs/DEPLOY.md`.
