# WhatsApp bot webhook. Build context = repo root.
FROM python:3.12-slim
WORKDIR /app
COPY packages/nm_core /app/packages/nm_core
COPY apps/bot /app/apps/bot
RUN pip install --no-cache-dir -e /app/packages/nm_core -e /app/apps/bot
ENV PORT=8000
CMD ["sh", "-c", "uvicorn nm_bot.app:app --host 0.0.0.0 --port ${PORT}"]
