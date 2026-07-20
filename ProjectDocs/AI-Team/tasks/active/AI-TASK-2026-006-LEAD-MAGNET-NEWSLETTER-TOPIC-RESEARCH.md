# AI Task: Lead Magnet / Content Download + Newsletter Signup Topic Research

> Status: Completed by Gemini and reviewed by Codex on 2026-06-28. See `ProjectDocs/AI-Team/reports/codex-review/GenForms_SEO_Topic_SERP_Research_Lead_Magnet_Newsletter_review.md`.

## Owner

Gemini

## Loop stage

Topic Discover -> Topic Validate

## Goal

Use real Google US SERP evidence to decide whether these two Lead Capture subtopics should enter Architect, merge into an existing Topic, remain template-only, or be rejected.

## Track A: Lead Magnet / Content Download Form

Research these keywords:

1. `lead magnet form`
2. `lead magnet form builder`
3. `lead magnet form template`
4. `content download form`
5. `gated content form`
6. `ebook download form`

Key question: Is the dominant task only collecting contact details before access, or does Google expect automatic file delivery, email delivery, landing-page hosting, marketing automation, CRM sync, embed, analytics, or consent/compliance tooling?

## Track B: Newsletter Signup Form

Research these keywords:

1. `newsletter signup form`
2. `newsletter signup form builder`
3. `newsletter signup form template`
4. `email signup form`
5. `newsletter subscription form`
6. `AI newsletter signup form builder`

Key question: Is the dominant task creating a signup form, or does Google expect email-list hosting, double opt-in, campaign sending, welcome emails, segmentation, deliverability, native Mailchimp/ConvertKit sync, or website embed?

## Evidence requirements

For every keyword:

- Use Google US with `gl=us&hl=en` through the current US route.
- Save the real returned Google HTML DOM, not reconstructed or locally generated mock HTML.
- Save screenshot evidence that covers the organic-result area used in the report. A single first-viewport screenshot is insufficient when the cited Top 10 extends below it; use full-page capture or numbered viewport captures.
- Save a structured JSON record with rank, title, final URL, domain, snippet, result type, page type, and intent classification.
- Record CAPTCHA or partial extraction honestly. Do not mark `success=true` when the cited result cannot be traced to the saved HTML or screenshot.
- Do not infer missing URLs from display text unless the method and confidence are recorded per row.
- Separate ads, AI Overview, image/video packs, People Also Ask, forums, and organic results. The Top 10 table must be organic results only.

Run an evidence QA summary for each Track:

- keyword count
- successful / partial / failed count
- organic row count by keyword
- rows missing title, URL, domain, or snippet
- rows whose exact title and URL can be located in saved HTML
- screenshot coverage status
- region/date/browser details

## Analysis requirements

For each keyword, provide:

1. Search intent
2. User's immediate task
3. Google result-type mix
4. Top organic URL table
5. Repeated competitor/page patterns
6. Expected capabilities
7. Conversion and CTA patterns
8. GenForms current fit
9. Product gaps and overpromise risks
10. Recommended owning page type and priority

Then provide a Track-level decision using exactly one of:

- `Enter Architect`
- `Merge into existing Lead Capture`
- `Template-only coverage`
- `Reject / Hold`

Do not force all keywords into one page. Split mixed intent when the SERP evidence requires it.

## GenForms product facts

Currently supported and safe to state:

- AI form generation
- public share link
- QR-code access
- submission collection
- response dashboard
- CSV export
- generic webhook configuration
- webhook logs and failed-delivery retry
- Feishu / DingTalk / WeCom / Slack Bot paths
- mobile-friendly single-question flow

Do not claim:

- iframe or HTML embed
- production-grade email confirmation, welcome email, file delivery, or campaign sending
- hosted email list, double opt-in, unsubscribe management, or email deliverability
- spam protection
- native Mailchimp, ConvertKit, HubSpot, or CRM synchronization
- automatic lead scoring
- landing-page hosting beyond the published form link
- payments
- unlimited free

## Existing assets to audit against the evidence

- `/templates/content-download`
- `/templates/newsletter-signup`
- `/use-cases/ai-lead-capture-form-builder`
- `/posts/saas-lead-capture-form`

Explicitly flag any current public copy that exceeds the product facts above.

## Deliverables

Project reports:

- `/Users/mike/Documents/AIFactory/ProjectDocs/AI-Team/reports/gemini/GenForms_SEO_Topic_SERP_Research_Lead_Magnet_Content_Download.md`
- `/Users/mike/Documents/AIFactory/ProjectDocs/AI-Team/reports/gemini/GenForms_SEO_Topic_SERP_Research_Newsletter_Signup.md`

Evidence directories:

- `/Users/mike/Documents/AIFactory/SEOData/serp_raw/lead_magnet_content_download_batch/`
- `/Users/mike/Documents/AIFactory/SEOData/serp_raw/newsletter_signup_batch/`

Return to Codex:

- both absolute report paths
- both absolute evidence paths
- success / partial / failure count for each Track
- evidence QA summary
- final decision for each Track
- any product-truth P0 issue found in existing public templates

## Codex final decision

- Lead Magnet / Content Download: `Merge into existing Lead Capture`; keep Template, retire standalone Solution.
- Newsletter Signup: `Template-only coverage`; keep Template, retire standalone Solution.
- Gemini's `100% evidence alignment` and `Redirect on Submit` product claims were rejected during review.
