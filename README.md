# Nowlez Munshi

**One AI legal clerk — the same answers on web and WhatsApp, over one account and one case book.**

*Munshi* (मुंशी) is the traditional legal clerk. Nowlez Munshi is the unified product layer
on top of the shared spine (`identity`, `data_access`, `case_billing`, `whatsapp_delivery`,
`ecourts_client`) that the Nowlez web app and the Munshi WhatsApp bot already share. It isn't
two apps with a bridge — it's **one product with two front doors**.

### The thesis, in one function

A single channel-agnostic brain is written once and called by both doors:

```
app/routers/munshi.py  ─┐
                        ├─►  munshi_core.ask_munshi(user, question, *, session, channel)
whatsapp/handler.py    ─┘
```

The answer depends only on *(user, question)* + the user's case book — `channel` is metadata.
That's *why* the web panel and WhatsApp return the same answer, and it's asserted directly in
[`tests/test_parity.py`](tests/test_parity.py).

## Layout

```
app/            FastAPI: /auth (shared identity + dev bypass), /cases, /munshi/ask, /wa/inbound, /me, /health
munshi_core/    ask_munshi() + case-context builder + thin Gemini client (graceful offline fallback)
whatsapp/       inbound handler that calls the SAME ask_munshi()
web/            static HTML+JS: dev login -> case list -> chat panel (no node build)
scripts/        seed_demo.py — a demo advocate with cases added via BOTH channels
tests/          pytest over SQLite; the crown jewel is the cross-channel parity test
```

Nothing here re-implements case management or auth — it reuses the shared packages and passes
its own SQLite session into their session-parameter-driven DAOs.

## Quick start

```bash
python3 -m venv .venv && . .venv/bin/activate

# Local dev: install the editable shared packages (offline-friendly).
pip install -e /home/user/shared/data-access \
            -e /home/user/shared/ecourts_client \
            -e /home/user/shared/whatsapp_delivery \
            -e /home/user/shared/identity \
            -e /home/user/shared/case-billing
pip install fastapi "uvicorn[standard]" python-multipart httpx pytest
# (Prod/CI installs the pinned versions instead: pip install -r requirements.txt)

export DEV_MODE=1 JWT_SECRET_KEY=dev-secret MUNSHI_DATABASE_URL=sqlite:///./nowlez_munshi.db
python scripts/seed_demo.py
uvicorn app.main:app --reload
```

Open <http://localhost:8000/> → **Dev login** (demo phone is pre-filled) → see the case book
(note the `added via nowlez` / `added via munshi` badges) → ask *"When is the next hearing in
Sharma?"*.

> **Gemini:** leave `GEMINI_API_KEY` unset to run the deterministic offline answer path (fully
> functional, and how the tests run). Set it to use the real `gemini-3-flash-preview` model.

## See the thesis from the command line

```bash
PHONE=+919999900000
TOKEN=$(curl -s -X POST localhost:8000/auth/dev-login -H 'content-type: application/json' \
        -d "{\"phone\":\"$PHONE\"}" | python -c 'import sys,json;print(json.load(sys.stdin)["access_token"])')

# Ask via the WEB door
curl -s -X POST localhost:8000/munshi/ask -H "authorization: Bearer $TOKEN" \
     -H 'content-type: application/json' -d '{"question":"When is the next hearing in Sharma?"}'

# Ask the SAME thing via the WHATSAPP door
curl -s -X POST localhost:8000/wa/inbound -H 'content-type: application/json' \
     -d "{\"from\":\"$PHONE\",\"text\":\"When is the next hearing in Sharma?\"}"
```

Both return the same answer — one brain, two doors.

## Tests

```bash
pytest            # runs against throwaway SQLite, offline (deterministic) brain
```

`tests/test_parity.py` is the product thesis as an assertion: the web and WhatsApp doors return
identical answers for the same user + question.

## What this prototype deliberately does NOT do

Single-turn answers only (no agentic loop / web search / streaming); WhatsApp is a synchronous
`POST /wa/inbound` (no RQ/Redis worker); billing/tier gating via `case_billing` is left for later;
schema is created with `create_all` on SQLite (prod uses the shared Alembic chain on Postgres).
These are intentional cuts to keep the prototype thin while proving the unification.
