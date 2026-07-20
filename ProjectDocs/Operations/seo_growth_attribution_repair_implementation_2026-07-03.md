# U-062 SEO Growth Attribution Repair — Implementation Record

> Date: 2026-07-03  
> Owner: Codex  
> State: Deployed / Iterate  
> Decision gate: Reviewed on 2026-07-07; Attribution Gate remains closed

## Outcome

U-062 is live for newly created forms. Organic/content context can now be carried from the browser into `forms.generation_meta_json.attribution`, then joined to Form and non-test Submission facts without summing duplicate client/server outcome events.

This release did not add a database column, third-party package, SEO page, or qualified-lead event.

## Implemented contract

- Visitor ID remains first-party and persistent.
- Session ID rolls after 30 minutes of inactivity.
- First/last non-direct attribution expires after 30 days; direct/internal navigation does not overwrite a valid non-direct channel.
- `source` URL context is treated as `content_source`, not as a traffic channel.
- Google, Bing and Baidu referrers normalize to organic search; full referrer query strings are not stored.
- Attribution accepts only bounded non-PII fields. Prompt, email, token, answers and clarification data are rejected from the attribution object.
- Create, current publish status, seven-day published history, and 28-day value realization are computed from Form/Submission facts.
- API returns both Form counts and unique creator counts.
- Upgrade intent and qualified lead remain `null` until their source-of-truth contracts exist.

## Production API

`GET /api/admin/growth/seo-attribution`

Query parameters:

- `from`, `to`: valid range up to 90 days; default is 28 days.
- optional `content_source`.
- optional `intent`.

The API is admin protected and returns Chinese-first error messages. It never returns prompt, email, answers or submission content.

## Verification

- Targeted attribution/API tests: passed.
- Full Vitest suite: 81 files, 382 tests passed.
- TypeScript: passed.
- Next.js 15 production build: passed; route `/api/admin/growth/seo-attribution` present.
- Release preflight: passed with the approved controlled-dirty warning.
- PM2 `aiform-factory`: online; startup guard passed; `/api/auth/session` returned 200.
- New Admin API: public and origin requests returned expected 403 without an admin session.
- Release-state verification: passed.
- Production SEO verification: passed.

## Open gate

The in-app browser had no reusable logged-in tab and timed out while opening the controlled entry URL. No login bypass or direct production DB write was attempted. One explicit internal cohort still needs to run through:

`internal entry -> create -> publish -> test submission excluded -> real public submission included`

Until that cohort and the three-day quality review pass, product attribution may be inspected as counts but must not authorize pSEO Scale.

## Three-day observation

Review on 2026-07-07:

1. unattributed rate for newly created Forms;
2. internal exclusion count and any mislabeled controlled activity;
3. Admin API errors or query latency;
4. duplicate outcome discrepancy between events and Form/Submission facts;
5. presence of prohibited fields in persisted attribution;
6. internal cohort result.

Decision: `Pass`, `Iterate`, or `Stop`. Only `Pass` opens the Attribution Gate for pSEO Scale decisions.

### 2026-07-07 quality review

Decision: `Iterate`.

Review record: [seo_growth_attribution_quality_review_2026-07-07.md](/Users/mike/Documents/AIFactory/ProjectDocs/Operations/seo_growth_attribution_quality_review_2026-07-07.md)

Read-only production checks showed:

- 3 new production Forms since the U-062 release window; all 3 external eligible Forms had bounded attribution context.
- External unattributed rate was `0`.
- Persisted attribution keys stayed inside the PII allowlist; no prompt, email, token, answer or clarification keys were found.
- Public Admin API access returned the expected 403 Chinese error; available Chrome session had no logged-in GenForms user, so logged-in Admin API and internal cohort could not be rerun.
- Submission event/fact alignment was clean in the sample, but one published Form fact had no matching `publish_succeeded` event and `form_created` events exceeded Form facts in the small release-window sample.
- Required internal cohort remains incomplete.

Attribution Gate remains closed. Product attribution may still be inspected as counts only; it must not authorize pSEO Scale or conversion-rate decisions. Qualified lead remains `N/A`.
