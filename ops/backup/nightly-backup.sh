#!/usr/bin/env bash
set -euo pipefail

START_TIME=$(date +%s)
TIMESTAMP=$(date -u +"%Y%m%dT%H%M%SZ")
BACKUP_DIR=${BACKUP_DIR:-"/var/backups/berman"}
mkdir -p "$BACKUP_DIR"
BACKUP_ROOT=$(mkdir -p "$BACKUP_DIR/$TIMESTAMP" && cd "$BACKUP_DIR/$TIMESTAMP" && pwd)

DATABASE_URL=${DATABASE_URL:-}
BACKUP_BUCKET=${BACKUP_BUCKET:-}
SUPABASE_URL=${SUPABASE_URL:-}
SUPABASE_SERVICE_ROLE_KEY=${SUPABASE_SERVICE_ROLE_KEY:-}
ASSET_BUCKETS=${ASSET_BUCKETS:-}
BACKUP_STATUS_PATH=${BACKUP_STATUS_PATH:-/var/log/berman/backup-status.json}
AWS_PROFILE=${AWS_PROFILE:-default}
ARCHIVE_NAME="berman-backup-${TIMESTAMP}.tar.gz"

if [[ -z "$DATABASE_URL" || -z "$BACKUP_BUCKET" || -z "$SUPABASE_URL" || -z "$SUPABASE_SERVICE_ROLE_KEY" ]]; then
  echo "Missing required environment variables." >&2
  exit 1
fi

PG_DUMP_PATH="$BACKUP_ROOT/database.dump"
MANIFEST_PATH="$BACKUP_ROOT/asset-manifest.json"
META_PATH="$BACKUP_ROOT/metadata.json"
ARCHIVE_PATH="$BACKUP_ROOT/$ARCHIVE_NAME"
ASSET_DIR="$BACKUP_ROOT/assets"

echo "[backup] Creating PostgreSQL dump..."
pg_dump --no-owner --format=custom --file="$PG_DUMP_PATH" "$DATABASE_URL"

echo "[backup] Generating storage manifest..."
deno run --allow-env --allow-read --allow-write --allow-net \
  ops/backup/asset-manifest.ts \
  --output "$MANIFEST_PATH" \
  --buckets "$ASSET_BUCKETS" \
  --download \
  --download-dir "$ASSET_DIR"

cat > "$META_PATH" <<JSON
{
  "timestamp": "$TIMESTAMP",
  "database_url": "${DATABASE_URL%%@*}@***",
  "buckets": "${ASSET_BUCKETS}",
  "pg_dump_bytes": $(stat -c%s "$PG_DUMP_PATH"),
  "manifest_bytes": $(stat -c%s "$MANIFEST_PATH"),
  "asset_bytes": $(du -sb "$ASSET_DIR" 2>/dev/null | cut -f1),
  "version": "1.0.0"
}
JSON

echo "[backup] Creating archive..."
ARCHIVE_CONTENTS=(
  "$(basename "$PG_DUMP_PATH")"
  "$(basename "$MANIFEST_PATH")"
  "$(basename "$META_PATH")"
)

if [[ -d "$ASSET_DIR" ]] && compgen -G "$ASSET_DIR/*" > /dev/null; then
  ARCHIVE_CONTENTS+=("$(basename "$ASSET_DIR")")
fi

(cd "$BACKUP_ROOT" && tar -czf "$ARCHIVE_PATH" "${ARCHIVE_CONTENTS[@]}")

S3_URI="s3://$BACKUP_BUCKET/$ARCHIVE_NAME"
echo "[backup] Uploading to $S3_URI..."
aws --profile "$AWS_PROFILE" s3 cp "$ARCHIVE_PATH" "$S3_URI"

DURATION=$(( $(date +%s) - START_TIME ))
cat > "$BACKUP_STATUS_PATH" <<JSON
{
  "status": "ok",
  "timestamp": "$TIMESTAMP",
  "archive": "$ARCHIVE_NAME",
  "s3_uri": "$S3_URI",
  "duration_seconds": $DURATION
}
JSON

echo "[backup] Completed in ${DURATION}s"
