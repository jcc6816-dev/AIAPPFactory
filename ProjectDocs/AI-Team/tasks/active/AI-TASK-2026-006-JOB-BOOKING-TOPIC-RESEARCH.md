# Gemini Task: Job Application + Booking / Consultation Topic Research

> Date: 2026-06-27  
> Loop stage: Discover -> Validate  
> Owner: Gemini research; Codex evidence review and Decide  
> Output language: Chinese  
> Status: Completed by Gemini; reviewed by Codex on 2026-06-28

## Goal

Use real Google US organic SERP evidence to decide whether either Topic should enter GenForms.ai Architect. Do not assume a Topic is viable because competitors have templates. Search intent, page type, product expectation, and GenForms MVP boundaries must be separated.

## Track A: Job Application Form

Research these six keywords:

1. `job application form`
2. `job application form builder`
3. `job application form template`
4. `online job application form`
5. `employment application form`
6. `AI job application form builder`

Questions to answer:

- Is the dominant intent a lightweight form/template, a legal employment document, an ATS/recruiting platform, or a downloadable PDF?
- Do Top 10 pages require resume/file upload, screening workflow, candidate status management, email automation, e-signature, or compliance language?
- Can GenForms credibly own a narrow “candidate intake form” intent without promising an ATS?
- Should the existing `/templates/job-application` remain only a template, be revised, or gain a Use Case / Solution?

## Track B: Booking / Consultation Request Form

Research these six keywords:

1. `consultation request form`
2. `consultation form template`
3. `booking request form`
4. `appointment request form`
5. `consultation booking form`
6. `demo request form builder`

Questions to answer:

- Is the dominant intent a request/intake form or a real-time calendar scheduling system?
- Which keywords expect availability slots, calendar sync, reminders, rescheduling, payments, or confirmation emails?
- Can GenForms safely own “consultation request” or “demo request” while explicitly excluding calendar booking?
- Does this belong under Lead Capture, Contact Form, or an independent Topic?

## Required Google US capture

For every keyword:

- Use Google US with `gl=us`, `hl=en`, and `pws=0` while the US VPN is active.
- Save the original Google HTML DOM and an actual rendered screenshot. Do not use mock/reconstructed SERP HTML or screenshots.
- Save the exact query URL, capture timestamp with timezone, viewport, user agent, and capture status.
- Record CAPTCHA or partial-capture failures honestly. A failed keyword stays failed; do not synthesize evidence.
- Capture enough page height to verify the organic rows, not only the first viewport or AI Overview.

Evidence directories:

- Track A: `/Users/mike/Documents/AIFactory/SEOData/serp_raw/job_application_batch/`
- Track B: `/Users/mike/Documents/AIFactory/SEOData/serp_raw/consultation_booking_batch/`

Each directory must contain:

- one `.html` per keyword
- one real `.png` per keyword
- one structured JSON summary
- a manifest with query, timestamp, status, and file paths

## Organic result schema

For each verified organic result, save:

- keyword
- organic rank
- title
- exact external URL
- domain
- visible snippet, or `missing`
- page type
- dominant intent
- product expectations
- evidence confidence: high / medium / low
- extraction note when URL restoration or dynamic redirect parsing was required

Do not claim “Top 10 complete” when Google returned fewer verified organic rows. Do not claim “100% accurate” URL restoration. Video view counts, comments, breadcrumbs, Google redirect wrappers, or display text must not be stored as destination URLs.

## Analysis requirements

For each keyword provide:

1. Search intent
2. User's immediate task
3. Verified organic result count
4. Top-result page types
5. Competitor task framing
6. Competitor conversion path
7. Required product expectations
8. GenForms support status: supported / partially supported / unsupported / cannot promise
9. Recommended owning page type
10. Decision: Enter Architect / Merge / Topic Universe / Reject

Then provide one decision per Track, including:

- recommended Topic boundary
- keyword ownership map
- minimum asset package
- redlines
- whether the current template contains claims that must be removed before any SEO expansion

## GenForms current product facts

Supported:

- AI form generation
- mobile-friendly single-question flow
- public share link and QR code
- submission collection and response dashboard
- CSV export
- generic Webhook, logs, failed-delivery retry
- Feishu / DingTalk / WeCom / Slack Bot paths

Do not promise:

- resume, file, photo, PDF, or document upload
- OCR extraction in the current MVP SEO promise
- ATS or candidate pipeline
- employment compliance or e-signature
- calendar availability, calendar sync, scheduling, reminders, or rescheduling
- production-grade email confirmation
- payment, deposit, invoice, or order flow
- CRM native sync
- spam protection
- unlimited free

## Required reports

- Track A: `/Users/mike/Documents/AIFactory/ProjectDocs/AI-Team/reports/gemini/GenForms_SEO_Topic_SERP_Research_Job_Application.md`
- Track B: `/Users/mike/Documents/AIFactory/ProjectDocs/AI-Team/reports/gemini/GenForms_SEO_Topic_SERP_Research_Consultation_Booking.md`

Return to Codex:

- both absolute report paths
- both evidence directory paths
- success/failure keyword counts per Track
- final decision per Track
- all capture limitations
