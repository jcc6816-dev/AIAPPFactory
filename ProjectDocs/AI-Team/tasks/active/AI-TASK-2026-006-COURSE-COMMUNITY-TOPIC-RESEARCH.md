# AI Task: Course Registration + Community Application Topic Research

> Status: Completed by Gemini and reviewed by Codex on 2026-06-28. Final decisions: Course Registration enters Architect under Event Registration / Education & Training; Community Application is Template-only. See `ProjectDocs/AI-Team/reports/codex-review/GenForms_SEO_Topic_SERP_Research_Course_Community_review.md`.

## Goal

Validate two GenForms Topic candidates with real Google US SERP evidence. Do not create or modify public pages.

Track A:

- Course Registration Form

Track B:

- Community Application Form

## Why now

- GSC 28d contains `course form` with 23 impressions.
- `/solutions/course-registration-form-builder` has 42 impressions in GSC 28d.
- Community Application is a competitor-validated template category and provides a useful comparison against the stronger Course signal.

## Required keywords

Track A:

1. `course registration form`
2. `course registration form template`
3. `class registration form`
4. `training registration form`
5. `workshop registration form`
6. `online course registration form`

Track B:

1. `community application form`
2. `community membership application form`
3. `online community application form`
4. `club membership application form`
5. `creator community application form`
6. `private community application form`

## Google evidence requirements

- Use Google US with `gl=us&hl=en` through the approved US network path.
- Save the raw response HTML, full-page PNG screenshot, structured result JSON, and manifest for every keyword.
- A screenshot that shows only an AI Overview, image pack, or first viewport does not count as full organic-result coverage.
- Do not create or render mock Google SERP HTML. CAPTCHA or failed captures must remain marked as failed.
- Each claimed Top 10 row must include rank, title, exact target URL, domain, snippet when present, result type, and intent classification.
- Every report row must be traceable to the saved HTML/JSON. Do not silently normalize a generic domain URL into a more specific canonical URL.
- Record success/failure counts and all CAPTCHA, location, personalization, and missing-snippet limitations.

## Analysis requirements

For every keyword, analyze:

1. dominant and secondary search intent
2. user main task
3. SERP composition and page types
4. recurring competitor patterns
5. expected product capabilities
6. GenForms entry angle
7. capability gaps and overclaim risks
8. suggested asset type
9. Topic ownership and overlap
10. priority and decision

## Product boundaries

GenForms can currently claim:

- AI form generation
- public share link
- QR access
- submission collection
- response dashboard
- CSV export
- generic Webhook configuration, logs, and retry
- Feishu, DingTalk, WeCom, and Slack Bot paths
- mobile one-question flow

Do not claim:

- payment or tuition collection
- seat or capacity inventory
- ticketing or check-in
- calendar scheduling
- production-grade email confirmation
- iframe or HTML embed
- file upload
- approval workflow
- membership account provisioning
- native CRM, LMS, ESP, or community-platform synchronization
- certificates or attendance tracking

## Required decision

Give exactly one decision per Track:

- `Enter Architect`
- `Merge into existing Topic`
- `Template-only coverage`
- `Reject / Hold`

If merging, name the parent Topic. If entering Architect, identify the smallest honest asset package. Do not recommend pSEO in this Goal.

## Deliverables

- `ProjectDocs/AI-Team/reports/gemini/GenForms_SEO_Topic_SERP_Research_Course_Registration.md`
- `ProjectDocs/AI-Team/reports/gemini/GenForms_SEO_Topic_SERP_Research_Community_Application.md`
- `SEOData/serp_raw/course_registration_batch/`
- `SEOData/serp_raw/community_application_batch/`

Return the absolute report and evidence paths, success/failure counts, final decisions, and evidence limitations to Codex for QA.
