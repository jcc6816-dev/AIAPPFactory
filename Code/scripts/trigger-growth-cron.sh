#!/bin/bash

# ==============================================================================
# GenForms.ai - Growth Snapshot Cron Trigger Script
# ==============================================================================

# 1. Base directory
APP_DIR="/app/aiform-factory"
ENV_FILE="$APP_DIR/.env.local"

# 2. Check if .env.local exists
if [ ! -f "$ENV_FILE" ]; then
  echo "Error: $ENV_FILE not found."
  exit 1
fi

# 3. Load GROWTH_CRON_SECRET from .env.local
GROWTH_CRON_SECRET=$(grep -E "^GROWTH_CRON_SECRET[[:space:]]*=" "$ENV_FILE" | cut -d'=' -f2- | tr -d '"' | tr -d "'" | tr -d '[:space:]')

if [ -z "$GROWTH_CRON_SECRET" ]; then
  echo "Error: GROWTH_CRON_SECRET is not defined in $ENV_FILE."
  exit 1
fi

# 4. Get source parameter (default to 'google')
SOURCE=${1:-"google"}

# 5. Trigger the cron endpoint on localhost
echo "=$(date '+%Y-%m-%d %H:%M:%S')= Triggering growth snapshot cron (source: $SOURCE)..."
RESPONSE=$(curl -s -w "\nHTTP_STATUS:%{http_code}" \
  -H "Authorization: Bearer $GROWTH_CRON_SECRET" \
  "http://127.0.0.1/api/admin/growth/snapshots/cron?source=$SOURCE")

# 6. Extract status and body
BODY=$(echo "$RESPONSE" | grep -v "HTTP_STATUS:")
STATUS=$(echo "$RESPONSE" | grep "HTTP_STATUS:" | cut -d':' -f2)

echo "Response Status: $STATUS"
echo "Response Body: $BODY"

if [ "$STATUS" -eq 200 ] || [ "$STATUS" -eq 207 ]; then
  echo "Success: Cron job triggered successfully."
  exit 0
else
  echo "Error: Cron job failed with status $STATUS."
  exit 2
fi
