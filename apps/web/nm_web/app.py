"""Web app: mounts the REST API and (if built) serves the React SPA."""
from __future__ import annotations

from pathlib import Path

from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles

from nm_web.routers import admin, ask, auth, billing, cases, insights, notifications, teams

app = FastAPI(title="Nowlez Munshi — web")
app.include_router(auth.router)
app.include_router(cases.router)
app.include_router(notifications.router)
app.include_router(ask.router)
app.include_router(teams.router)
app.include_router(insights.router)
app.include_router(billing.router)
app.include_router(admin.router)


@app.get("/api/health")
def health() -> dict:
    return {"status": "ok"}


# Serve the built SPA when present (apps/web/frontend/dist). html=True falls back to
# index.html for client-side routes.
_DIST = Path(__file__).resolve().parent.parent / "frontend" / "dist"
if _DIST.is_dir():
    app.mount("/", StaticFiles(directory=str(_DIST), html=True), name="spa")
