# Demo Request Subcluster Build Audit

## Decision

Demo Request enters the Lead Capture Topic as a focused subcluster. The owning intent is collecting B2B qualification context before sales follow-up, not scheduling a calendar meeting.

## Assets

- Use Case: `/use-cases/demo-request-form-builder`
- Template: `/templates/demo-request`
- Parent: `/use-cases/ai-lead-capture-form-builder`
- Support Post: `/posts/saas-lead-capture-form`
- Workflow support: `/use-cases/webhook-form-builder-retry-logs`
- CTA intent: `demo_request`

No Solution, Alternative, new Post or pSEO pages were added in this Build.

## Product boundaries

The public pages explicitly avoid promises for real-time calendar slots, calendar sync, meeting invitations, redirect-on-submit, production email confirmations, automatic lead scoring, native CRM sync, payments, iframe embed, spam protection or unlimited free.

## Verification

- Five focused test files: 35 tests passed.
- Production build: passed; static route count increased from 90 to 92.
- Browser verification: English and Chinese Use Case pages, English template page, eight fields, CTA query context, hero preview, no horizontal overflow.
- Structured data: SoftwareApplication, FAQPage and BreadcrumbList present.
- Canonical and hreflang: English, Chinese and x-default verified locally.
- Production: four English/Chinese Use Case and Template URLs returned 200; sitemap, canonical/hreflang, SEO Gate and Release State Gate passed.

## Observe

Freeze for 7-14 days after production deployment. Observe:

- `demo request form builder`
- `demo request form template`
- `request a demo form`
- owning URL impressions, clicks, CTR and position
- `intent=demo_request` create, generate, publish and submit events
