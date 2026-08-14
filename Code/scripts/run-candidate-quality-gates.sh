#!/bin/bash

# Runs checks that are safe only in the local/candidate Playwright environment.
# It deliberately launches the app on localhost and may create dev-only forms
# and TEST submissions. It never accepts an external target URL.
set -euo pipefail

PORT="${PLAYWRIGHT_PORT:-3102}"
DIST_DIR=".next-playwright-${PORT}"

if [ "${PLAYWRIGHT_SKIP_WEBSERVER:-0}" = "1" ]; then
  echo "Refusing to run candidate quality gates with PLAYWRIGHT_SKIP_WEBSERVER=1."
  echo "Use the isolated localhost server managed by playwright.config.ts."
  exit 2
fi

case "$PORT" in
  *[!0-9]*|"")
    echo "PLAYWRIGHT_PORT must be a local numeric port."
    exit 2
    ;;
esac

# The candidate server must never reuse the developer or production build
# cache. Limit cleanup to the deterministic local Playwright output only.
case "$DIST_DIR" in
  .next-playwright-[0-9]*) ;;
  *)
    echo "Refusing to clear an unexpected Playwright dist directory."
    exit 2
    ;;
esac

rm -rf "$DIST_DIR"
trap 'rm -rf "$DIST_DIR"' EXIT

echo "=== GenForms.ai candidate quality gates (localhost:${PORT}) ==="
pnpm exec tsc --noEmit
pnpm test -- --runInBand
PLAYWRIGHT_PORT="$PORT" NEXT_DIST_DIR="$DIST_DIR" pnpm exec playwright test --project=chromium --reporter=line
