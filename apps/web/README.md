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
                  admin documents i18n search library public push
frontend/         React + Vite SPA (manifest + service worker → installable PWA)
```

## Routers

`auth` · `cases` · `notifications` · `ask` (AI Munshi) · `teams` · `insights` ·
`billing` · `admin` · `documents` · `i18n` · `search` (eCourts portal) · `library`
(the user's own data) · `public` · `push`.

Notable endpoints added by the port:

- **AI / library** — `GET /api/library/search` (universal full-text over the user's
  docs/cases/orders, billing-gated).
- **Documents** — `GET /api/documents/tree`, `PUT /api/documents/{id}/rename`,
  `PUT /api/documents/{id}/reclassify` (the file library).
- **Billing** — `POST /api/billing/validate-coupon`, `POST /api/billing/trial`,
  `GET /api/billing/invoices`; admin `GET|POST /api/admin/coupons` +
  `POST /api/admin/coupons/{id}/deactivate`.
- **Account** — `GET /api/auth/me/referral` (code + stats), `POST /api/auth/me/export`
  (GDPR ZIP, 1/hour).
- **Calendar** — `GET /api/calendar/export.ics`.
- **Public (no auth)** — `POST /api/waitlist`, `GET /api/waitlist/count`,
  `POST /api/demo-request` (IP rate-limited).

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
