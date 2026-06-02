#!/bin/bash

set -u

BASE_URL="${1:-https://genforms.ai}"
HTTP_URL="${BASE_URL/https:\/\//http://}"
WWW_URL="${BASE_URL/https:\/\//https://www.}"
GOOGLE_VERIFICATION_FILE="googleca44529186a6a835.html"
FAILED=0

pass() {
  printf "PASS  %s\n" "$1"
}

fail() {
  printf "FAIL  %s\n" "$1"
  FAILED=1
}

check_status() {
  local url="$1"
  local expected="$2"
  local status
  status="$(curl -s -o /dev/null -w "%{http_code}" "$url")"
  if [ "$status" = "$expected" ]; then
    pass "$url returns $expected"
  else
    fail "$url returns $status, expected $expected"
  fi
}

check_redirect() {
  local url="$1"
  local expected_location="$2"
  local headers
  headers="$(curl -s -I "$url")"
  if printf "%s" "$headers" | grep -qi "^location: $expected_location"; then
    pass "$url redirects to $expected_location"
  else
    fail "$url does not redirect to $expected_location"
  fi
}

check_body() {
  local url="$1"
  local expected="$2"
  local label="$3"
  local body
  body="$(curl -s -L "$url")"
  if printf "%s" "$body" | grep -q "$expected"; then
    pass "$label"
  else
    fail "$label"
  fi
}

check_redirect "$HTTP_URL" "$BASE_URL/"
check_redirect "$WWW_URL" "$BASE_URL/"
check_status "$BASE_URL/zh" "200"
check_status "$BASE_URL/sitemap.xml" "200"
check_status "$BASE_URL/robots.txt" "200"
check_body "$BASE_URL/sitemap.xml" "$BASE_URL/zh/templates/lead-capture" "sitemap contains template URLs"
check_body "$BASE_URL/robots.txt" "Sitemap: $BASE_URL/sitemap.xml" "robots.txt references sitemap"
check_body "$BASE_URL/$GOOGLE_VERIFICATION_FILE" "google-site-verification: $GOOGLE_VERIFICATION_FILE" "Google verification file is reachable"
check_body "$BASE_URL/zh" '"@type":"SoftwareApplication"' "homepage exposes SoftwareApplication JSON-LD"
check_body "$BASE_URL/zh/templates/lead-capture" '"@type":"BreadcrumbList"' "template detail exposes BreadcrumbList JSON-LD"
check_body "$BASE_URL/zh/auth/signin" "GenForms.ai" "sign-in page uses GenForms.ai branding"

if [ "$FAILED" -ne 0 ]; then
  printf "\nProduction SEO verification failed.\n"
  exit 1
fi

printf "\nProduction SEO verification passed.\n"
