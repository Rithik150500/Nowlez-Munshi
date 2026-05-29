# Web: FastAPI API + the built React SPA. Build context = repo root.
# Stage 1 — build the SPA.
FROM node:22-slim AS spa
WORKDIR /spa
COPY apps/web/frontend/package*.json ./
RUN npm install --no-audit --no-fund
COPY apps/web/frontend/ ./
RUN npm run build

# Stage 2 — Python API serving the built SPA.
FROM python:3.12-slim
WORKDIR /app
COPY packages/nm_core /app/packages/nm_core
COPY apps/web /app/apps/web
RUN pip install --no-cache-dir -e /app/packages/nm_core -e /app/apps/web
COPY --from=spa /spa/dist /app/apps/web/frontend/dist
ENV PORT=8000
# Run migrations on boot, then serve.
CMD ["sh", "-c", "cd /app/packages/nm_core && alembic -c alembic.ini upgrade head && cd /app && uvicorn nm_web.app:app --host 0.0.0.0 --port ${PORT}"]
