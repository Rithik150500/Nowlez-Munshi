#!/usr/bin/env bash
# Idempotent dev setup for Claude Code web sessions:
#   venv -> editable shared packages -> app deps -> seed demo data.
# Fast on re-runs; never hard-fails the session.
set -u
cd "$(dirname "$0")/.." || exit 0

if [ ! -d .venv ]; then
  python3 -m venv .venv || exit 0
fi
# shellcheck disable=SC1091
. .venv/bin/activate
python -m pip install -q --upgrade pip >/dev/null 2>&1 || true

# Prefer LOCAL editable shared packages when present (offline-friendly; the web
# sandbox has /home/user/shared checked out). Falls back to the pinned git
# installs in requirements.txt only if the local checkout is missing.
if [ -d /home/user/shared/data-access ]; then
  pip install -q \
    -e /home/user/shared/data-access \
    -e /home/user/shared/ecourts_client \
    -e /home/user/shared/whatsapp_delivery \
    -e /home/user/shared/identity \
    -e /home/user/shared/case-billing >/dev/null 2>&1 || true
  pip install -q fastapi "uvicorn[standard]" python-multipart httpx pytest >/dev/null 2>&1 || true
else
  pip install -q -r requirements-dev.txt >/dev/null 2>&1 || true
fi

export DEV_MODE=1
export MUNSHI_DATABASE_URL="${MUNSHI_DATABASE_URL:-sqlite:///./nowlez_munshi.db}"
export JWT_SECRET_KEY="${JWT_SECRET_KEY:-dev-secret-not-for-prod}"

python scripts/seed_demo.py >/dev/null 2>&1 || true

echo "Nowlez Munshi ready. Run:  uvicorn app.main:app --reload  (then open http://localhost:8000/)"
