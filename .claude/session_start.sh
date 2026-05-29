#!/usr/bin/env bash
# Idempotent dev setup for Claude Code web sessions (greenfield rebuild).
#   venv -> editable nm_core[test] + apps. Fast on re-runs; never hard-fails.
set -u
cd "$(dirname "$0")/.." || exit 0

if [ ! -d .venv ]; then
  python3 -m venv .venv || exit 0
fi
# shellcheck disable=SC1091
. .venv/bin/activate
python -m pip install -q --upgrade pip >/dev/null 2>&1 || true

pip install -q -e "packages/nm_core[test]" >/dev/null 2>&1 || true
pip install -q -e apps/web -e apps/bot -e apps/worker >/dev/null 2>&1 || true
pip install -q ruff==0.15.15 mypy==2.1.0 >/dev/null 2>&1 || true

# Dev defaults: SQLite + offline integrations so everything runs without creds.
export DEV_MODE=1
export DATABASE_URL="${DATABASE_URL:-sqlite:///./dev.db}"
export JWT_SECRET_KEY="${JWT_SECRET_KEY:-dev-secret-not-for-prod}"
export ECOURTS_OFFLINE="${ECOURTS_OFFLINE:-1}"

( cd packages/nm_core && DATABASE_URL="$DATABASE_URL" \
    python -m alembic -c alembic.ini upgrade head >/dev/null 2>&1 || true )

echo "Nowlez Munshi (rebuild) ready. Tests: pytest packages/nm_core/tests apps"
