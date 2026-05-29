# apps/web — the web door

A **FastAPI** REST API plus a **React/Vite** single-page app. The FastAPI app mounts the
routers and, when the SPA has been built, serves the static `frontend/dist/`.

## Layout

```
nm_web/
  app.py          FastAPI app: mounts routers, serves the built SPA, /api/health
  deps.py         request dependencies (DB session, current user)
  serializers.py  response models
  routers/        auth cases notifications ask teams insights billing
                  admin documents i18n search push
frontend/         React + Vite SPA (manifest + service worker → installable PWA)
```

## Routers

`auth` · `cases` · `notifications` · `ask` (AI Munshi) · `teams` · `insights` ·
`billing` · `admin` · `documents` · `i18n` · `search` · `push`.

## Run locally

```bash
# API (serves the built SPA from frontend/dist if present)
uvicorn nm_web.app:app --reload --port 8000

# SPA dev server with hot reload (separate terminal)
cd apps/web/frontend && npm install && npm run dev
# production build the API will serve:
npm run build
```

With `DEV_MODE=1`, `POST /auth/dev-login` issues a session with no SMS/WhatsApp round-trip.
`GET /api/health` checks the DB connection.

## Test

```bash
pytest apps/web
```
