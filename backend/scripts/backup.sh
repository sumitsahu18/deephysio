#!/usr/bin/env bash
# Roz ka backup: database (mongodump) + uploaded images. 14 din purane backups delete.
# VPS par cron:  0 2 * * * /var/www/deephysio/server/scripts/backup.sh >> /var/log/deephysio-backup.log 2>&1
set -euo pipefail
cd "$(dirname "$0")/.."  # backend folder
source <(grep -E '^(MONGODB_URI|UPLOAD_DIR)=' .env | sed 's/^/export /')
DEST="${BACKUP_DIR:-$HOME/backups/deephysio}/$(date +%F_%H%M)"
mkdir -p "$DEST"
mongodump --uri="$MONGODB_URI" --archive="$DEST/db.archive.gz" --gzip
tar -czf "$DEST/uploads.tar.gz" "${UPLOAD_DIR:-uploads}"
find "$(dirname "$DEST")" -mindepth 1 -maxdepth 1 -type d -mtime +14 -exec rm -rf {} +
echo "Backup OK: $DEST"
