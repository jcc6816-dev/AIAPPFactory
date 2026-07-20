#!/bin/bash

set -u

BASE_URL="${1:-https://genforms.ai}"
FAILED=0

pass() {
  printf "PASS  %s\n" "$1"
}

fail() {
  printf "FAIL  %s\n" "$1"
  FAILED=1
}

body_contains() {
  local url="$1"
  local pattern="$2"
  local label="$3"
  local body
  body="$(curl -s -L "$url")"
  if printf "%s" "$body" | grep -Eq "$pattern"; then
    pass "$label"
  else
    fail "$label"
  fi
}

body_absent() {
  local url="$1"
  local pattern="$2"
  local label="$3"
  local body
  body="$(curl -s -L "$url")"
  if printf "%s" "$body" | grep -Eq "$pattern"; then
    fail "$label"
  else
    pass "$label"
  fi
}

status_is() {
  local url="$1"
  local expected="$2"
  local label="$3"
  local status
  status="$(curl -s -o /dev/null -w "%{http_code}" "$url")"
  if [ "$status" = "$expected" ]; then
    pass "$label"
  else
    fail "$label: got $status, expected $expected"
  fi
}

echo "=== GenForms.ai Release State Verification ==="
echo "Base URL: $BASE_URL"

status_is "$BASE_URL/" "200" "homepage returns 200"
status_is "$BASE_URL/api/auth/session" "200" "auth session endpoint returns 200"

body_contains "$BASE_URL/" '<title>AI Form Builder \| GenForms\.ai</title>' "homepage Bing-safe title is live"
body_contains "$BASE_URL/" 'href="/solutions"' "homepage exposes Solutions nav"
body_contains "$BASE_URL/" 'href="/posts"' "homepage exposes Resources nav"
body_absent "$BASE_URL/" 'AI Form SaaS V2\.0|View Delivery Path' "homepage legacy badge and delivery CTA are absent"

body_contains "$BASE_URL/en/forms/new?template=event-registration" 'Your event registration form is ready|Create this form' "/forms/new template-arrival shell is reachable"
body_absent "$BASE_URL/en/forms/new?template=event-registration" 'Free allowance reached|Upgrade Now|免费额度已用完|立即升级' "guest /forms/new does not show top allowance upgrade banner"

for path in \
  /api/admin/gsc/summary \
  /api/admin/ga4/summary \
  /api/admin/pagespeed/summary \
  /api/admin/clarity/summary \
  /api/admin/growth/daily-brief \
  /api/admin/growth/seo-attribution
do
  status_is "$BASE_URL$path" "403" "$path exists and is admin-protected"
done

if [ "$FAILED" -ne 0 ]; then
  echo
  echo "Release state verification failed."
  exit 1
fi

echo
echo "Release state verification passed."
