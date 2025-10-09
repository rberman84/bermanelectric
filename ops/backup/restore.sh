#!/usr/bin/env bash
set -euo pipefail

if [[ $# -lt 1 ]]; then
  echo "Usage: $0 /path/to/berman-backup-YYYYMMDDTHHMMSSZ.tar.gz" >&2
  exit 1
fi

ARCHIVE_PATH=$1
DATABASE_URL=${DATABASE_URL:-}
SUPABASE_URL=${SUPABASE_URL:-}
SUPABASE_SERVICE_ROLE_KEY=${SUPABASE_SERVICE_ROLE_KEY:-}
ASSET_BUCKET_OVERRIDE=${ASSET_BUCKET_OVERRIDE:-}
RESTORE_WORKDIR=${RESTORE_WORKDIR:-"${TMPDIR:-/tmp}/berman-restore"}

if [[ -z "$DATABASE_URL" || -z "$SUPABASE_URL" || -z "$SUPABASE_SERVICE_ROLE_KEY" ]]; then
  echo "Missing required environment variables (DATABASE_URL, SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)." >&2
  exit 1
fi

mkdir -p "$RESTORE_WORKDIR"
cd "$RESTORE_WORKDIR"
rm -rf ./current && mkdir -p current && cd current

echo "[restore] Extracting $ARCHIVE_PATH..."
tar -xzf "$ARCHIVE_PATH"

if [[ ! -f database.dump ]]; then
  echo "database.dump missing in archive" >&2
  exit 1
fi

MANIFEST_PATH=${MANIFEST_PATH:-asset-manifest.json}
if [[ ! -f "$MANIFEST_PATH" ]]; then
  echo "asset-manifest.json missing in archive" >&2
  exit 1
fi

ASSET_DIR=${ASSET_DIR:-assets}
ASSETS_PRESENT=true
if [[ ! -d "$ASSET_DIR" ]]; then
  echo "[restore] Asset directory missing; continuing with database-only restore"
  ASSETS_PRESENT=false
fi

echo "[restore] Restoring PostgreSQL database..."
pg_restore --clean --if-exists --no-owner --single-transaction --dbname="$DATABASE_URL" database.dump

if [[ "$ASSETS_PRESENT" == true ]]; then
  echo "[restore] Restoring storage assets..."
  deno run --allow-env --allow-read --allow-net \
    ops/backup/restore-assets.ts \
    --manifest "$MANIFEST_PATH" \
    --assets "$ASSET_DIR" \
    ${ASSET_BUCKET_OVERRIDE:+--only-buckets "$ASSET_BUCKET_OVERRIDE"}
else
  echo "[restore] Skipping asset restore step"
fi

echo "[restore] Running post-restore health check..."
if [[ -n "${HEALTHCHECK_URL:-}" ]]; then
  curl --fail --silent "$HEALTHCHECK_URL" >/dev/null && echo "Health check passed" || echo "Health check failed" >&2
fi

echo "[restore] Restore complete"
