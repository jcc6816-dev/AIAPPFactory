# Course Registration / Community Application Build Audit

Date: 2026-06-28

## Decision

- Course Registration: keep the existing Solution and Template, improve truthful registration-task coverage, then enter `Ship / Observe`.
- Community Application: keep the Template as the only owning page, retire the duplicate Solution with localized permanent redirects, then enter `Ship / Observe / Template-only`.
- No new SEO page was created for either Topic.

## Course Registration

- Added a real course-registration hero preview using the existing template fields.
- Added `course_registration` creation context and bounded English/Chinese prompts.
- Removed payment, confirmation, notification, reservation, capacity, calendar, email and LMS implications.
- Clarified that session/time is only a preference and learning-support information is optional without medical diagnosis.
- Reordered the page to Hero -> recommended fields -> workflow -> FAQ -> Event/QR/Webhook links.
- Added visible FAQ content aligned with FAQPage JSON-LD.

## Community Application

- Added contact details and manual follow-up consent to the real template.
- Replaced approval/invitation implications with manual team review and external follow-up boundaries.
- Added `community_application` creation context, bounded prompts, metadata and visible FAQ aligned with FAQPage JSON-LD.
- Retired the duplicate Solution and configured localized permanent redirects:
  - `/solutions/community-application-form-template` -> `/templates/community-application`
  - `/en/solutions/community-application-form-template` -> `/templates/community-application`
  - `/zh/solutions/community-application-form-template` -> `/zh/templates/community-application`
- Removed the retired Solution from sitemap generation.

## Verification

- Focused tests: 6 files, 37 tests passed.
- TypeScript: `npx tsc --noEmit --pretty false` passed.
- Production build: `npm run build` passed; static page count decreased by two as expected after retiring the localized Community Solution pages.
- Local desktop/mobile QA passed for Course and Community; no horizontal overflow or console errors.
- Course secondary CTA scrolls to `#recommended-fields` with the section visible below the header.
- Production retained URLs return 200; all three retired Community Solution paths return the expected 308 targets.
- Production CTA intents, FAQPage schema, related links and sitemap inclusion/exclusion checks passed.
- `verify-production-seo.sh` and `verify-release-state.sh` passed.

## Observation Window

- Freeze both Topics through 2026-07-12 unless a P0 technical SEO or product-truth issue appears.
- Course: watch course/class/training registration queries, Solution versus Template ownership, CTR and `course_registration` creation events.
- Community: watch Template indexing, community application queries, CTR, `community_application` events and old-URL signal migration.
