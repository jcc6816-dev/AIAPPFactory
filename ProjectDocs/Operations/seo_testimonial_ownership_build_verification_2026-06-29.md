# Customer Testimonial Ownership Build Verification

> Date: 2026-06-29
> Loop state: Architect -> Build complete -> Verify complete -> Ship blocked
> Ship blocker: U-061 shared production schema prerequisite

## Implemented

- Renamed the product-entry Template from `customer-story` to `customer-testimonial-form`.
- Kept `customer-story` as an internal creation alias for backward-compatible query links.
- Retired `/solutions/customer-testimonial-collection-form` from Solution rendering and sitemap generation.
- Added permanent localized redirects from all old Template and Solution routes to the new Template.
- Changed the existing Post CTA to link directly to the new Template and `customer_testimonial` create path.
- Added the new Template to `templateOnlyTopicIds`; no Solution promotion is rendered.

## Verification

- Focused ownership tests: 43 passed.
- Full suite: 75 files / 360 tests passed.
- TypeScript validation: passed.
- Next.js production build: passed; generated Solution paths decreased from 27 to 25 localized entries, matching one retired bilingual Solution.
- Local production checks:
  - six old English, `/en`, and Chinese Template/Solution routes return 308 to the correct localized Template;
  - new English and Chinese Template routes render the expected title, canonical, `template=customer-testimonial-form` and `customer_testimonial` context;
  - sitemap contains the new English/Chinese Template and existing Post, and excludes the old Template/Solution URLs.

## Release State

Not deployed. The same build also contains the Slack encrypted-URL implementation, while production still lacks `forms.webhook_url_encrypted`. Deploying before U-061 would break new form writes. After U-061 is complete, deploy once, verify origin/public redirects, then submit only the new Template and retained Post for recrawl.
