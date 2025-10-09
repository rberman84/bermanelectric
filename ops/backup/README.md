# Backup and Restore Playbook

This directory contains the operational tooling required to achieve the "full restore in <15 minutes" objective.

## Nightly automation

Run `nightly-backup.sh` via cron (UTC 04:00 recommended) on a hardened runner with access to the production database and storage credentials.

```
0 4 * * * /opt/berman/ops/nightly-backup.sh >> /var/log/berman/nightly-backup.log 2>&1
```

The script will:

1. Create a point-in-time PostgreSQL dump using `pg_dump` in custom format.
2. Generate an object storage manifest via `asset-manifest.ts` (Supabase storage buckets, CDN assets, marketing uploads).
3. Package the dump + manifest + metadata into a versioned archive.
4. Upload the archive to S3 (or any S3-compatible target) and keep the latest copy locally for fast restores.

## Restore workflow (<15 minutes)

1. Fetch the desired backup artifact from S3 (or use the latest local archive).
2. Run `restore.sh /path/to/archive.tar.gz`. The script will:
   - Stop application traffic (optional hook you can customize).
   - Restore the PostgreSQL dump with `pg_restore --clean --if-exists`.
   - Rehydrate Supabase storage assets listed in the manifest.
   - Warm caches and run a health check endpoint.
3. Re-enable traffic.

On a t3.medium-sized runner the end-to-end workflow completes in ~9 minutes for the current dataset (validated via chaos testing harness in `scripts/chaos/` — see documentation there).

## Requirements

- `pg_dump`, `pg_restore`, `tar`, `gzip`
- `aws` CLI (or any tool capable of uploading to S3)
- `deno` ≥ 1.43 (for the manifest generator)
- Environment variables documented inline in each script (`DATABASE_URL`, `BACKUP_BUCKET`, `SUPABASE_URL`, etc.)

## Verification

After each backup the script writes a JSON status report to `${BACKUP_STATUS_PATH:-/var/log/berman/backup-status.json}`. Hook your monitoring to that file and alert on `status !== "ok"` or stale timestamps.
