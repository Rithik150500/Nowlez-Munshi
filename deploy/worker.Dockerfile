# Background worker: refresh sweep loop (+ document/re-engagement crons). Context = repo root.
FROM python:3.12-slim
WORKDIR /app
COPY packages/nm_core /app/packages/nm_core
COPY apps/worker /app/apps/worker
RUN pip install --no-cache-dir -e /app/packages/nm_core -e /app/apps/worker
# Continuous refresh sweep. Documents (nm_worker.documents) and re-engagement
# (nm_worker.reengage) are scheduled separately (cron / a second worker).
CMD ["python", "-m", "nm_worker.sweep", "--loop", "--interval", "900"]
