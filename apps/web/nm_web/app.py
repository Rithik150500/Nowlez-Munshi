"""Web app: mounts the REST API and (if built) serves the React SPA."""
from __future__ import annotations

from pathlib import Path

from fastapi import Depends, FastAPI, Response
from fastapi.staticfiles import StaticFiles
from sqlalchemy import text
from sqlalchemy.orm import Session

from nm_core import observability
from nm_web.deps import get_db
from nm_web.routers import (
    admin,
    ask,
    auth,
    billing,
    cases,
    documents,
    i18n,
    insights,
    notifications,
    search,
    teams,
)

observability.init_sentry()
app = FastAPI(title="Nowlez Munshi — web")
app.include_router(auth.router)
app.include_router(cases.router)
app.include_router(notifications.router)
app.include_router(ask.router)
app.include_router(teams.router)
app.include_router(insights.router)
app.include_router(billing.router)
app.include_router(admin.router)
app.include_router(documents.router)
app.include_router(i18n.router)
app.include_router(search.router)


@app.get("/api/health")
def health(db: Session = Depends(get_db)) -> dict:
    """Deep check: the API is up and the database is reachable."""
    db_ok = True
    try:
        db.execute(text("SELECT 1"))
    except Exception:  # noqa: BLE001
        db_ok = False
    return {"status": "ok" if db_ok else "degraded", "db": db_ok}


@app.get("/metrics")
def metrics() -> Response:
    """Prometheus text exposition of the in-process metrics registry."""
    snap = observability.snapshot()
    lines: list[str] = []
    for bucket in (snap["counters"], snap["gauges"]):
        for name, value in bucket.items():
            lines.append(f"nm_{name.replace('.', '_')} {value}")
    return Response("\n".join(lines) + "\n", media_type="text/plain; version=0.0.4")


# Serve the built SPA when present (apps/web/frontend/dist). html=True falls back to
# index.html for client-side routes.
_DIST = Path(__file__).resolve().parent.parent / "frontend" / "dist"
if _DIST.is_dir():
    app.mount("/", StaticFiles(directory=str(_DIST), html=True), name="spa")
