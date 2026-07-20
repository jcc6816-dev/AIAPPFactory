# Course Registration / Community Application Validate Baseline

## Goal

Validate two existing public Topic candidates before expanding, preserving, merging, or retiring their current assets:

- Course Registration Form
- Community Application Form

No new public page may be created before Google US SERP evidence is reviewed.

## Existing assets

Course Registration:

- `/solutions/course-registration-form-builder`
- `/templates/course-registration`

Community Application:

- `/solutions/community-application-form-template`
- `/templates/community-application`

All four English routes return 200 and are present in the production sitemap as of 2026-06-28.

## GSC baseline

Latest available GSC snapshot: 2026-06-26.

Course Registration, 28d:

- `/solutions/course-registration-form-builder`: 42 impressions, 0 clicks, average position 65.1.
- `course form`: 23 impressions, 0 clicks, average position 69.7.
- `courses form`: 7 impressions, average position 73.6.
- `course forms`: 3 impressions, average position 68.7.
- `course registration automation`: 1 impression, average position 54.

Course Registration, 7d:

- Solution: 7 impressions, average position 79.6.
- `course form`: 6 impressions, average position 79.2.

Community Application, 28d:

- `/templates/community-application`: 1 impression, average position 6.
- `/zh/solutions/community-application-form-template`: 1 impression, average position 20.
- No matching community-application or membership-application query was present in the stored top-query sample.

Interpretation:

- Course has an early but weak market signal and deserves first-priority Validate.
- Community has insufficient first-party signal and remains a comparison Track, not an Architect candidate by default.
- The current query sample is capped and cannot prove that no other long-tail query exists.

## Product-fact baseline

Supported for both Topics:

- AI-generated form fields
- public link and QR sharing
- response collection and dashboard
- CSV export
- generic Webhook and supported bot notification paths
- mobile one-question flow

Unsupported expectations to test against the SERP:

- payment, tuition, checkout, subscriptions, or paid membership processing
- seat and capacity inventory
- ticketing or attendee check-in
- calendar scheduling
- production-grade email confirmation
- iframe or HTML embed
- file upload
- approval workflow
- LMS, CRM, ESP, or community-platform native synchronization
- certificates, attendance tracking, or membership account provisioning

## Existing boundary risks

Course Solution:

- Recommends `Payment or confirmation status` as a field.
- Uses `confirmation status` in the creation prompt.
- The template refers to class-detail delivery and confirmation-message drafting, which must not imply automated email delivery.

Community Solution:

- The paid-community FAQ recommends adding payment status before checkout.
- This may be acceptable as manual qualification metadata, but must not imply that GenForms handles payment or checkout.
- `review applicants before sending invites` must remain a manual process, not an approval or account-provisioning claim.

These risks are documented only. Public positioning will not be changed until the Google US evidence establishes the dominant user task, unless a separate P0 factual overclaim is confirmed.

## Evidence gate

Required Gemini task:

`ProjectDocs/AI-Team/tasks/active/AI-TASK-2026-006-COURSE-COMMUNITY-TOPIC-RESEARCH.md`

Final decisions are limited to:

- `Enter Architect`
- `Merge into existing Topic`
- `Template-only coverage`
- `Reject / Hold`

## Final review

Gemini evidence arrived and Codex completed evidence QA on 2026-06-28.

- Course Registration: `Enter Architect` under Event Registration / Education & Training. Keep the existing Solution and Template; do not add pages in the first Architect round.
- Community Application: `Template-only coverage`. Keep the Template and retire the duplicate Solution after implementation review.

The `100% aligned` evidence claim was rejected because snippets are missing, report tables diverge from the structured JSON, one Community URL is invalid, and all screenshots are first-viewport captures rather than full organic-result evidence.

Full review:

`ProjectDocs/AI-Team/reports/codex-review/GenForms_SEO_Topic_SERP_Research_Course_Community_review.md`
