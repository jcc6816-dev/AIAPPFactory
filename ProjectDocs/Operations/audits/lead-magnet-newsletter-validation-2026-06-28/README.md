# Lead Magnet / Newsletter Topic Validate Baseline

## Goal

Validate two Lead Capture-adjacent Topics with real Google US SERP evidence and strict GenForms product boundaries:

- Lead Magnet / Content Download Form
- Newsletter Signup Form

## Evidence status

The two Gemini reports and evidence directories were received and reviewed on 2026-06-28. Gemini's `100% aligned` claim was rejected: snippets are missing, exact URL traceability is partial, and all screenshots cover only the first 756x469 viewport. The repeated intent patterns are still strong enough for Track-level decisions.

Required task:

`ProjectDocs/AI-Team/tasks/active/AI-TASK-2026-006-LEAD-MAGNET-NEWSLETTER-TOPIC-RESEARCH.md`

## Existing-product audit

### Lead Magnet / Content Download

Severity: P0 product-truth issue.

The existing template previously asked `Which email should we send the PDF to?`, offered `No, just the PDF please`, and described download notifications. GenForms currently has no production-grade email or automatic file-delivery capability.

Repair applied:

- Reframed the template as a lead magnet access request form.
- Replaced delivery language with work-contact and resource-request language.
- Added visible FAQ boundaries: GenForms collects and routes the request; the team handles file delivery through its existing process.
- Preserved the template URL and redirected the retired Solution URL after the Google US evidence determined final Topic ownership.

### Newsletter Signup

Severity: P1 boundary gap, not a confirmed overclaim.

The current template and Solution collect email, interest, segment, consent and frequency preferences. They do not directly claim Campaign sending, but they do not explicitly distinguish signup-intent collection from:

- hosted email-list management
- double opt-in and unsubscribe workflows
- campaign or welcome-email sending
- deliverability
- native Mailchimp / ConvertKit / HubSpot synchronization

The SERP evidence confirmed that the dominant intent expects a fuller email-marketing workflow. Keep template-only coverage and do not create a Solution, Use Case, Post, or pSEO expansion for this Topic.

## Local verification

- Focused tests: 29 passed.
- Production build: passed, 88 static pages after retiring two Solution pages in two locales.
- `/templates/content-download`: new title, five request fields, visible FAQ boundary, no old PDF-delivery wording.
- `/templates/newsletter-signup`: visible no-embed, no-campaign, no-double-opt-in and no-native-ESP boundary.
- `/solutions/lead-magnet-download-form` and its Chinese route return 308 to the Lead Capture Pillar.
- `/solutions/newsletter-signup-form-builder` and its Chinese route return 308 to the Newsletter template.
- Production deployment completed on 2026-06-28. Both retained templates return 200, all four retired Solution routes return 308, sitemap excludes both retired slugs, and protected growth-data endpoints still return 403 without an admin session.

## Final decisions

- Lead Magnet / Content Download: Merge into Lead Capture; keep Template and retire the standalone Solution.
- Newsletter Signup: Template-only; retire the standalone Solution and do not enter Architect or pSEO.
- Both Topics entered Observe on 2026-06-28 and are frozen through 2026-07-12 unless a P0 technical SEO issue appears.

See `ProjectDocs/AI-Team/reports/codex-review/GenForms_SEO_Topic_SERP_Research_Lead_Magnet_Newsletter_review.md` for evidence QA and product-fact corrections.
