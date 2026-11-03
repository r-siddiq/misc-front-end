#!/usr/bin/env bash
# Restore DB data only (no DROP/CREATE) from seed_data.sql

set -euo pipefail

LOG_TAG="[restore_db]"
log(){ printf "%s %s %s\n" "$(date +'%Y-%m-%d %H:%M:%S')" "$LOG_TAG" "$*"; }

# Resolve paths safely (supports spaces)
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$SCRIPT_DIR"
SEED_FILE="$PROJECT_ROOT/seed_data.sql"
INS_FILE="$PROJECT_ROOT/seed_inserts_only.sql"

# mysql client (override at runtime: MYSQL_BIN=/path/to/mysql ./restore_db.sh)
MYSQL_BIN="${MYSQL_BIN:-$(command -v mysql || true)}"
[[ -n "$MYSQL_BIN" ]] || { log "ERROR: mysql client not found"; exit 1; }
[[ -f "$SEED_FILE" ]] || { log "ERROR: $SEED_FILE not found"; exit 1; }

# ---- 1) Build inserts-only file from seed_data.sql (capture full multi-line INSERTs) ----
log "Extracting INSERT statements → seed_inserts_only.sql ..."
awk '
  BEGIN{IGNORECASE=1; cap=0}
  # Start capturing when we see INSERT INTO (case-insensitive, anywhere in line)
  /(^|[[:space:]])INSERT[[:space:]]+INTO[[:space:]]/ { cap=1 }
  # If capturing, print the line
  cap { print }
  # Stop capturing when a statement-terminating semicolon is seen at end
  cap && /;[[:space:]]*$/ { cap=0 }
' "$SEED_FILE" > "$INS_FILE"

# Sanity: bail if no INSERTs were captured
if ! grep -q . "$INS_FILE"; then
  log "ERROR: No INSERT statements found in $SEED_FILE (or extractor failed)."
  log "       Ensure seed_data.sql contains data rows (INSERT INTO ... VALUES ...;)."
  exit 1
fi

INS_COUNT=$(grep -ci 'INSERT[[:space:]]\+INTO' "$INS_FILE" || true)
log "Captured $INS_COUNT INSERT statement(s)."

# ---- 2) Choose credentials source (no .env) ----
CFG=()
if [[ -f "$HOME/.my.cnf" ]]; then
  chmod 600 "$HOME/.my.cnf" || true
  CFG=(--defaults-extra-file="$HOME/.my.cnf")
elif [[ -f "$PROJECT_ROOT/.my.cnf" ]]; then
  chmod 600 "$PROJECT_ROOT/.my.cnf" || true
  CFG=(--defaults-extra-file="$PROJECT_ROOT/.my.cnf")
else
  log "No .my.cnf found; prompting for credentials ..."
  read -r -p "Host: " DB_HOST
  read -r -p "Port [3306]: " DB_PORT; DB_PORT="${DB_PORT:-3306}"
  read -r -p "User: " DB_USER
  read -r -s -p "Password: " DB_PASSWORD; echo
  DB_PASSWORD="${DB_PASSWORD%$'\r'}"   # trim CR on Windows Git Bash
  read -r -p "Database: " DB_NAME

  export MYSQL_PWD="$DB_PASSWORD"       # avoid -p prompt & “using password: NO”
  CFG=(-h "$DB_HOST" -P "$DB_PORT" -u "$DB_USER" "$DB_NAME")
fi

# ---- 3) Data reset (delete child first, then parent) ----
log "Clearing existing rows ..."
"$MYSQL_BIN" "${CFG[@]}" -e "SET FOREIGN_KEY_CHECKS=0;
  DELETE FROM q_quotes;
  DELETE FROM q_authors;
  SET FOREIGN_KEY_CHECKS=1;" || log "WARNING: delete phase may have failed (check privileges)."

# ---- 4) Insert seed rows (data-only) ----
log "Inserting data from $INS_FILE ..."
"$MYSQL_BIN" "${CFG[@]}" < "$INS_FILE"

# ---- 5) Smoke checks ----
log "Row counts after restore:"
"$MYSQL_BIN" "${CFG[@]}" -N -e \
  "SELECT 'q_quotes',COUNT(*) FROM q_quotes;
   SELECT 'q_authors',COUNT(*) FROM q_authors;" || true

log "Restore (data-only) complete."