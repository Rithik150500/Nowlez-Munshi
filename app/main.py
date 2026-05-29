"""Nowlez Munshi API entrypoint.

  uvicorn app.main:app --reload
"""
from __future__ import annotations

from contextlib import asynccontextmanager
from pathlib import Path

from fastapi import Depends, FastAPI
from fastapi.staticfiles import StaticFiles

from .db import get_db, init_db
from .deps import get_current_user
from .routers import auth, cases, munshi, whatsapp


@asynccontextmanager
async def lifespan(app: FastAPI):
    init_db()
    yield


app = FastAPI(title="Nowlez Munshi", version="0.1.0", lifespan=lifespan)


@app.get("/health", tags=["meta"])
def health():
    return {"status": "ok", "service": "nowlez-munshi"}


@app.get("/me", tags=["auth"])
def me(user=Depends(get_current_user)):
    return {"id": str(user.id), "phone": user.phone, "locale": user.locale}


# API routes are registered before the static mount so they always win.
app.include_router(auth.router)
app.include_router(cases.router)
app.include_router(munshi.router)
app.include_router(whatsapp.router)

_WEB_DIR = Path(__file__).resolve().parent.parent / "web"
if _WEB_DIR.is_dir():
    app.mount("/", StaticFiles(directory=str(_WEB_DIR), html=True), name="web")
