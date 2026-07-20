# Customer Testimonial Product Truth Repair

> Date: 2026-06-29
> Loop transition: Observe -> Decide (P0 product-truth issue) -> Build/Ship -> Observe + Validate

## Trigger

The live `customer-story` template still exposed a `logo_file` image field, and the existing Solution/Post described logo, headshot or screenshot upload. Current GenForms product facts do not support promising file upload in this workflow.

Latest GSC evidence before the repair:

- 28d queries: `ai testimonial collection` 7 impressions / position 71.1; `ai-powered testimonial collection` 5 / position 85.8.
- 28d owning Solution: 20 impressions / 0 clicks / position 72.6.
- No testimonial query or page appeared in the latest 7d stored sample.

This was a product-truth repair, not a ranking-driven rewrite.

## Changes

- Replaced `logo_file` with `company_role` and optional `follow_up_contact` in both locales.
- Reframed consent as a publishing preference for manual review, not a legal release.
- Added visible FAQ explaining no file upload and no replacement for formal release requirements.
- Added `customer_testimonial` creation context to the Template, Solution and existing Post.
- Added a scene-specific Post CTA that starts from `customer-story`.
- Updated the online Post body to route visual assets through the team's existing external process.

No slug, title, canonical, new page or Topic expansion was introduced.

## Verification

- Focused tests: 40 passed.
- Full suite: 73 files / 345 tests passed.
- Production build and controlled release preflight passed.
- PM2 online; auth health check returned 200.
- Production origin verifies all three assets without `logo_file` or upload-field promises and with `customer_testimonial` CTA context.
- Cloudflare public HTML still returned the prior cached version immediately after deployment. Source-of-truth origin is updated; wait for cache expiry or purge through the Cloudflare account before URL Inspection.

## Observation

- Freeze content changes through 2026-07-13 unless a P0 technical issue appears.
- Continue Google US SERP Validate in parallel; research does not authorize new pages during the freeze.

