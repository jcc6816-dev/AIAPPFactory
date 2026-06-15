#!/bin/bash

set -u

FAILED=0
WARNED=0
SKIP_BUILD=0
ALLOW_DIRTY="${RELEASE_ALLOW_DIRTY:-0}"

while [ $# -gt 0 ]; do
  case "$1" in
    --skip-build)
      SKIP_BUILD=1
      shift
      ;;
    --allow-dirty)
      ALLOW_DIRTY=1
      shift
      ;;
    *)
      echo "Unknown option: $1"
      exit 2
      ;;
  esac
done

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
REPO_ROOT="$(dirname "$PROJECT_ROOT")"

cd "$PROJECT_ROOT" || exit 1

pass() {
  printf "${GREEN}PASS${NC}  %s\n" "$1"
}

warn() {
  printf "${YELLOW}WARN${NC}  %s\n" "$1"
  WARNED=1
}

fail() {
  printf "${RED}FAIL${NC}  %s\n" "$1"
  FAILED=1
}

require_file() {
  if [ -f "$1" ]; then
    pass "required file exists: $1"
  else
    fail "required file missing: $1"
  fi
}

require_dir() {
  if [ -d "$1" ]; then
    pass "required directory exists: $1"
  else
    fail "required directory missing: $1"
  fi
}

require_grep() {
  local pattern="$1"
  local file="$2"
  local label="$3"
  if grep -E -q -- "$pattern" "$file"; then
    pass "$label"
  else
    fail "$label"
  fi
}

forbid_grep() {
  local pattern="$1"
  local target="$2"
  local label="$3"
  if grep -R -E -q -- "$pattern" "$target" 2>/dev/null; then
    fail "$label"
  else
    pass "$label"
  fi
}

echo -e "${GREEN}=== GenForms.ai Release Preflight ===${NC}"

if git -C "$REPO_ROOT" rev-parse --is-inside-work-tree >/dev/null 2>&1; then
  GIT_STATUS="$(git -C "$REPO_ROOT" status --porcelain -- Code ProjectDocs/Operations README.md AGENTS.md AI_EXECUTION_CHECKLIST.md COLLABORATION_SUPPLEMENT.md 2>/dev/null || true)"
  if [ -n "$GIT_STATUS" ]; then
    if [ "$ALLOW_DIRTY" = "1" ]; then
      warn "working tree is dirty; proceeding because RELEASE_ALLOW_DIRTY=1 or --allow-dirty was provided"
      printf "%s\n" "$GIT_STATUS" | sed -n '1,80p'
    else
      fail "working tree is dirty. Commit/stash changes, or rerun with RELEASE_ALLOW_DIRTY=1 after Mike/Codex explicitly approves a controlled dirty release."
      printf "%s\n" "$GIT_STATUS" | sed -n '1,80p'
    fi
  else
    pass "working tree is clean for release-scoped paths"
  fi
else
  warn "not inside a Git worktree; skipping Git cleanliness check"
fi

require_file "scripts/deploy-pm2.sh"
require_file "scripts/production-start-guard.js"
require_file "scripts/verify-production-seo.sh"

require_grep '--exclude="/\.env\.local"' "scripts/deploy-pm2.sh" "deploy script excludes production .env.local"
require_grep 'production-start-guard\.js' "scripts/deploy-pm2.sh" "deploy script starts through production-start-guard"
require_grep 'PORT=80' "scripts/deploy-pm2.sh" "deploy script starts PM2 on PORT=80"
require_grep 'pm2 start scripts/production-start-guard\.js' "scripts/deploy-pm2.sh" "deploy script does not start server.js directly"
if grep -E -q '(scp|rsync).*(\.env\.local|\.env)' "scripts/deploy-pm2.sh"; then
  fail "deploy script appears to upload env files"
else
  pass "deploy script does not upload env files"
fi

if [ "$SKIP_BUILD" = "0" ]; then
  echo -e "${YELLOW}Running production build...${NC}"
  npm run build
  if [ $? -ne 0 ]; then
    fail "npm run build failed"
  else
    pass "npm run build succeeded"
  fi
else
  warn "skipping npm run build; validating existing .next output"
fi

require_dir ".next/standalone"
require_file ".next/standalone/server.js"
require_file ".next/standalone/.next/server/app/[locale]/(workspace)/forms/new/page.js"
require_file ".next/standalone/.next/server/app/[locale]/(default)/page.js"
require_file ".next/standalone/.next/server/app/api/admin/gsc/summary/route.js"
require_file ".next/standalone/.next/server/app/api/admin/ga4/summary/route.js"
require_file ".next/standalone/.next/server/app/api/admin/pagespeed/summary/route.js"
require_file ".next/standalone/.next/server/app/api/admin/clarity/summary/route.js"
require_file ".next/standalone/.next/server/app/api/admin/growth/daily-brief/route.js"

forbid_grep 'AI Form SaaS V2\.0|View Delivery Path' "i18n/pages/landing components/blocks/hero" "homepage legacy CTA/badge strings are absent from source"
require_grep '"buttons": \[\]' "i18n/pages/landing/en.json" "English homepage header extra buttons are empty"
require_grep '"buttons": \[\]' "i18n/pages/landing/zh.json" "Chinese homepage header extra buttons are empty"
require_grep '!isGuest && !canCreate' "components/forms/form-creation-manager.tsx" "guest /forms/new does not show plan-upgrade allowance banner"
require_grep 'forms_new_view' "components/forms/form-creation-manager.tsx" "/forms/new view tracking is present"
require_grep 'workspace_preview_ready' "components/forms/form-generator.tsx" "workspace preview-ready tracking is present"

forbid_grep 'AI Form SaaS V2\.0|View Delivery Path' ".next/standalone/.next/server/app/[locale]/(default)/page.js" "homepage legacy CTA/badge strings are absent from built homepage"
if grep -E -q -- 'Free allowance reached|Upgrade Now|免费额度已用完|立即升级' ".next/standalone/.next/server/app/[locale]/(workspace)/forms/new/page.js" &&
   ! grep -E -q -- '!R&&!e|!R&&' ".next/standalone/.next/server/app/[locale]/(workspace)/forms/new/page.js"; then
  fail "built /forms/new appears to show allowance banner without guest-safe gating"
else
  pass "built /forms/new contains guest-safe allowance gating"
fi

if [ "$FAILED" -ne 0 ]; then
  echo -e "${RED}Release preflight failed. Do not deploy.${NC}"
  exit 1
fi

if [ "$WARNED" -ne 0 ]; then
  echo -e "${YELLOW}Release preflight passed with warnings. Proceed only if this is an approved controlled release.${NC}"
else
  echo -e "${GREEN}Release preflight passed.${NC}"
fi
