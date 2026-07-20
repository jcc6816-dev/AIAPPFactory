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

check_redirect_any() {
  local url="$1"
  local expected_absolute="$2"
  local expected_relative="$3"
  local headers
  headers="$(curl -s -I "$url")"
  if printf "%s" "$headers" | grep -Eqi "^location: ($expected_absolute|$expected_relative)[[:space:]]*$"; then
    pass "$url redirects to canonical path"
  else
    fail "$url does not redirect to canonical path"
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

check_body_absent_ere() {
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

check_canonical_page() {
  local path="$1"
  local canonical="$2"
  local zh_alternate="$3"
  local x_default="$4"
  local url="$BASE_URL$path"

  check_body "$url" "<link rel=\"canonical\" href=\"$canonical\"" "$path exposes canonical URL"
  check_body "$url" "hrefLang=\"en\" href=\"$canonical\"" "$path exposes English hreflang"
  if [ "$zh_alternate" != "-" ]; then
    check_body "$url" "hrefLang=\"zh\" href=\"$zh_alternate\"" "$path exposes Chinese hreflang"
  fi
  check_body "$url" "hrefLang=\"x-default\" href=\"$x_default\"" "$path exposes x-default hreflang"
}

check_no_legacy_en_links() {
  local path="$1"
  local url="$BASE_URL$path"
  check_body_absent_ere "$url" 'href="/en/(forms/new|templates|posts|use-cases|solutions)([/?"][^"]*)?' "$path does not expose legacy /en public links"
}

check_redirect "$HTTP_URL" "$BASE_URL/"
check_redirect "$WWW_URL" "$BASE_URL/"
check_status "$BASE_URL/zh" "200"
check_status "$BASE_URL/sitemap.xml" "200"
check_status "$BASE_URL/robots.txt" "200"
check_body "$BASE_URL/sitemap.xml" "$BASE_URL/zh/templates/lead-capture" "sitemap contains template URLs"
check_body "$BASE_URL/sitemap.xml" "$BASE_URL/solutions/job-application-form-builder" "sitemap contains new solution URLs"
check_body "$BASE_URL/sitemap.xml" "$BASE_URL/solutions/website-contact-form-template" "sitemap contains website contact solution URL"
check_body "$BASE_URL/sitemap.xml" "$BASE_URL/use-cases/demo-request-form-builder" "sitemap contains demo request use case URL"
check_body "$BASE_URL/sitemap.xml" "$BASE_URL/templates/demo-request" "sitemap contains demo request template URL"
check_body_absent_ere "$BASE_URL/sitemap.xml" "$BASE_URL/solutions/(lead-magnet-download-form|newsletter-signup-form-builder|community-application-form-template)" "sitemap excludes retired Lead Magnet, Newsletter, and Community solutions"
check_body_absent_ere "$BASE_URL/sitemap.xml" "$BASE_URL/en/" "sitemap excludes legacy /en URLs"
check_body "$BASE_URL/robots.txt" "Sitemap: $BASE_URL/sitemap.xml" "robots.txt references sitemap"
check_body "$BASE_URL/$GOOGLE_VERIFICATION_FILE" "google-site-verification: $GOOGLE_VERIFICATION_FILE" "Google verification file is reachable"
check_body "$BASE_URL/zh" '"@type":"SoftwareApplication"' "homepage exposes SoftwareApplication JSON-LD"
check_body "$BASE_URL/zh/templates/lead-capture" '"@type":"BreadcrumbList"' "template detail exposes BreadcrumbList JSON-LD"
check_body "$BASE_URL/posts" '"@type":"CollectionPage"' "/posts exposes CollectionPage JSON-LD"
check_body "$BASE_URL/posts" '"@type":"ItemList"' "/posts exposes ItemList JSON-LD"
check_body "$BASE_URL/use-cases" '"@type":"CollectionPage"' "/use-cases exposes CollectionPage JSON-LD"
check_body "$BASE_URL/use-cases" '"@type":"ItemList"' "/use-cases exposes ItemList JSON-LD"
check_body "$BASE_URL/solutions" '"@type":"CollectionPage"' "/solutions exposes CollectionPage JSON-LD"
check_body "$BASE_URL/solutions" '"@type":"ItemList"' "/solutions exposes ItemList JSON-LD"
check_body "$BASE_URL/templates" '"@type":"CollectionPage"' "/templates exposes CollectionPage JSON-LD"
check_body "$BASE_URL/templates" '"@type":"ItemList"' "/templates exposes ItemList JSON-LD"
check_body "$BASE_URL/zh/auth/signin" "GenForms.ai" "sign-in page uses GenForms.ai branding"

check_canonical_page "/" "$BASE_URL" "$BASE_URL/zh" "$BASE_URL"
check_canonical_page "/posts" "$BASE_URL/posts" "$BASE_URL/zh/posts" "$BASE_URL/posts"
check_canonical_page "/use-cases" "$BASE_URL/use-cases" "$BASE_URL/zh/use-cases" "$BASE_URL/use-cases"
check_canonical_page "/solutions" "$BASE_URL/solutions" "$BASE_URL/zh/solutions" "$BASE_URL/solutions"
check_canonical_page "/templates" "$BASE_URL/templates" "$BASE_URL/zh/templates" "$BASE_URL/templates"
check_canonical_page "/posts/form-builder-with-webhook" "$BASE_URL/posts/form-builder-with-webhook" "-" "$BASE_URL/posts/form-builder-with-webhook"
check_canonical_page "/use-cases/typeform-alternative-webhooks" "$BASE_URL/use-cases/typeform-alternative-webhooks" "$BASE_URL/zh/use-cases/typeform-alternative-webhooks" "$BASE_URL/use-cases/typeform-alternative-webhooks"
check_canonical_page "/use-cases/webhook-form-builder-retry-logs" "$BASE_URL/use-cases/webhook-form-builder-retry-logs" "$BASE_URL/zh/use-cases/webhook-form-builder-retry-logs" "$BASE_URL/use-cases/webhook-form-builder-retry-logs"
check_canonical_page "/use-cases/ai-lead-capture-form-builder" "$BASE_URL/use-cases/ai-lead-capture-form-builder" "$BASE_URL/zh/use-cases/ai-lead-capture-form-builder" "$BASE_URL/use-cases/ai-lead-capture-form-builder"
check_canonical_page "/use-cases/demo-request-form-builder" "$BASE_URL/use-cases/demo-request-form-builder" "$BASE_URL/zh/use-cases/demo-request-form-builder" "$BASE_URL/use-cases/demo-request-form-builder"
check_canonical_page "/solutions/saas-lead-capture-form-builder" "$BASE_URL/solutions/saas-lead-capture-form-builder" "$BASE_URL/zh/solutions/saas-lead-capture-form-builder" "$BASE_URL/solutions/saas-lead-capture-form-builder"
check_canonical_page "/solutions/job-application-form-builder" "$BASE_URL/solutions/job-application-form-builder" "$BASE_URL/zh/solutions/job-application-form-builder" "$BASE_URL/solutions/job-application-form-builder"
check_canonical_page "/solutions/portfolio-submission-form-template" "$BASE_URL/solutions/portfolio-submission-form-template" "$BASE_URL/zh/solutions/portfolio-submission-form-template" "$BASE_URL/solutions/portfolio-submission-form-template"
check_canonical_page "/solutions/website-contact-form-template" "$BASE_URL/solutions/website-contact-form-template" "$BASE_URL/zh/solutions/website-contact-form-template" "$BASE_URL/solutions/website-contact-form-template"
check_canonical_page "/templates/lead-capture" "$BASE_URL/templates/lead-capture" "$BASE_URL/zh/templates/lead-capture" "$BASE_URL/templates/lead-capture"
check_canonical_page "/templates/demo-request" "$BASE_URL/templates/demo-request" "$BASE_URL/zh/templates/demo-request" "$BASE_URL/templates/demo-request"

check_redirect_any "$BASE_URL/en/posts/form-builder-with-webhook" "$BASE_URL/posts/form-builder-with-webhook" "/posts/form-builder-with-webhook"
check_redirect_any "$BASE_URL/en/use-cases/typeform-alternative-webhooks" "$BASE_URL/use-cases/typeform-alternative-webhooks" "/use-cases/typeform-alternative-webhooks"
check_redirect_any "$BASE_URL/en/use-cases/webhook-form-builder-retry-logs" "$BASE_URL/use-cases/webhook-form-builder-retry-logs" "/use-cases/webhook-form-builder-retry-logs"
check_redirect_any "$BASE_URL/en/use-cases/ai-lead-capture-form-builder" "$BASE_URL/use-cases/ai-lead-capture-form-builder" "/use-cases/ai-lead-capture-form-builder"
check_redirect_any "$BASE_URL/en/solutions/saas-lead-capture-form-builder" "$BASE_URL/solutions/saas-lead-capture-form-builder" "/solutions/saas-lead-capture-form-builder"

check_no_legacy_en_links "/"
check_no_legacy_en_links "/posts/form-builder-with-webhook"
check_no_legacy_en_links "/use-cases/typeform-alternative-webhooks"
check_no_legacy_en_links "/use-cases/webhook-form-builder-retry-logs"
check_no_legacy_en_links "/use-cases/ai-lead-capture-form-builder"
check_no_legacy_en_links "/use-cases/demo-request-form-builder"
check_no_legacy_en_links "/solutions/saas-lead-capture-form-builder"
check_no_legacy_en_links "/solutions/job-application-form-builder"
check_no_legacy_en_links "/solutions/customer-testimonial-collection-form"
check_no_legacy_en_links "/solutions/portfolio-submission-form-template"
check_no_legacy_en_links "/solutions/website-contact-form-template"
check_no_legacy_en_links "/templates/lead-capture"
check_no_legacy_en_links "/templates/demo-request"
check_no_legacy_en_links "/templates"

check_body "$BASE_URL/templates/content-download" "Lead Magnet Access Request Form" "content download template is scoped to access requests"
check_body_absent_ere "$BASE_URL/templates/content-download" 'Which email should we send the PDF to\?|No, just the PDF please' "content download template does not promise PDF delivery"
check_body "$BASE_URL/templates/newsletter-signup" "Does GenForms send newsletters or manage double opt-in?" "newsletter template states the email-platform boundary"
check_redirect_any "$BASE_URL/solutions/lead-magnet-download-form" "$BASE_URL/use-cases/ai-lead-capture-form-builder" "/use-cases/ai-lead-capture-form-builder"
check_redirect_any "$BASE_URL/zh/solutions/lead-magnet-download-form" "$BASE_URL/zh/use-cases/ai-lead-capture-form-builder" "/zh/use-cases/ai-lead-capture-form-builder"
check_redirect_any "$BASE_URL/solutions/newsletter-signup-form-builder" "$BASE_URL/templates/newsletter-signup" "/templates/newsletter-signup"
check_redirect_any "$BASE_URL/zh/solutions/newsletter-signup-form-builder" "$BASE_URL/zh/templates/newsletter-signup" "/zh/templates/newsletter-signup"
check_redirect_any "$BASE_URL/solutions/customer-testimonial-collection-form" "$BASE_URL/templates/customer-testimonial-form" "/templates/customer-testimonial-form"
check_redirect_any "$BASE_URL/zh/solutions/customer-testimonial-collection-form" "$BASE_URL/zh/templates/customer-testimonial-form" "/zh/templates/customer-testimonial-form"
check_body "$BASE_URL/solutions/course-registration-form-builder" "Does GenForms collect tuition or course payments?" "course solution states payment boundary"
check_body "$BASE_URL/solutions/course-registration-form-builder" "intent=course_registration" "course solution carries course registration intent"
check_body "$BASE_URL/templates/community-application" "Are community applications approved automatically?" "community template states manual review boundary"
check_body "$BASE_URL/templates/community-application" "intent=community_application" "community template carries community application intent"
check_redirect_any "$BASE_URL/solutions/community-application-form-template" "$BASE_URL/templates/community-application" "/templates/community-application"
check_redirect_any "$BASE_URL/en/solutions/community-application-form-template" "$BASE_URL/templates/community-application" "/templates/community-application"
check_redirect_any "$BASE_URL/zh/solutions/community-application-form-template" "$BASE_URL/zh/templates/community-application" "/zh/templates/community-application"

if [ "$FAILED" -ne 0 ]; then
  printf "\nProduction SEO verification failed.\n"
  exit 1
fi

printf "\nProduction SEO verification passed.\n"
