#!/usr/bin/env bash
# Restores your MySQL database from seed_data.sql

set -euo pipefail

# Project root and paths
PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
SEED_FILE="${PROJECT_ROOT}/seed_data.sql"

# Load environment (just once)
source "${PROJECT_ROOT}/.env"

# Run the restore
mysql -h "$DB_HOST" -P "${DB_PORT:-3306}" -u "$DB_USER" -p"$DB_PASSWORD" "$DB_NAME" < "$SEED_FILE"
echo "Database restored from seed_data.sql"