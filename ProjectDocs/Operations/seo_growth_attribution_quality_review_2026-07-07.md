# U-062 SEO Growth Attribution Repair — 3-Day Quality Review

> Date: 2026-07-07  
> Owner: Codex  
> Decision: Iterate  
> Scope: Production read-only review; no production writes, no login bypass, no fabricated cohort data.

## Decision

`Iterate`.

U-062 is not stopped: production Forms created after the release are carrying bounded attribution context, the PII allowlist held, and Form/Submission facts can be joined. It is not ready for `Pass` because the required internal cohort was not rerun and one event-vs-fact discrepancy remains.

The Attribution Gate for pSEO Scale remains closed. Counts may be inspected; conversion rates and Scale decisions remain unauthorized.

## Evidence checked

Window: `2026-07-03T00:00:00.000Z` to `2026-07-07T09:33:58.373Z`.

| Check | Result | Notes |
|---|---:|---|
| New Forms since release | 3 | Production `forms`, read-only. |
| External eligible Forms | 3 | No internal-attributed Form in this production window. |
| Attributed external Forms | 3 | Attribution present on all 3 eligible Forms. |
| Unattributed external Forms | 0 | Unattributed rate: `0`. |
| Organic-attributed Forms | 0 | No organic create sample in this window; do not infer conversion. |
| Internal excluded Forms | 0 | No marked internal cohort exists in this window. |
| Published Forms by fact | 1 | Form fact/history indicates publish. |
| Real submissions for release-window Forms | 1 | `is_test=false`. |
| Test submissions for release-window Forms | 0 | No test-submission cohort observed. |
| PII/disallowed attribution keys | 0 | Persisted attribution keys stayed within allowlist. |
| Qualified lead | N/A | Still intentionally null / not instrumented. |

Observed attribution keys:

- `channel`
- `content_source`
- `first_touch_at`
- `intent`
- `landing_path`
- `session_id`
- `template_id`
- `visitor_id`

## Admin API check

- Public request to `https://genforms.ai/api/admin/growth/seo-attribution?from=2026-07-03&to=2026-07-07` returned HTTP `403` with Chinese message `无权访问该归因报表。`
- Chrome had a GenForms tab, but `/api/auth/session` had no user in the available session. A logged-in admin API read was therefore not available.
- No login bypass was attempted.

## Event-vs-fact discrepancy

| Check | Result |
|---|---:|
| `form_created` events for release-window Forms | 4 |
| Form facts in release window | 3 |
| Form facts without `form_created` event | 0 |
| Published Form facts | 1 |
| `publish_succeeded` events for release-window Forms | 0 |
| Published facts without `publish_succeeded` event | 1 |
| `public_form_submitted` events for release-window Forms | 1 |
| Real Submission facts without submit event | 0 |
| Submit events without real Submission fact | 0 |

Interpretation:

- Submission event/fact alignment looks clean for the observed sample.
- Create events have a duplicate relative to Form facts.
- Publish is present in Form fact/history but missing from `publish_succeeded` event.
- The Admin API correctly uses Form/Submission facts for business outcome counts, but event discrepancy remains a diagnostic quality issue.

## Internal cohort status

Required cohort:

`internal entry -> create -> publish -> test submission excluded -> real public submission included`

Status: not rerun.

Reason: current Chrome session did not have a reusable GenForms login session. The available GenForms tab was not logged in. Per rule, no login bypass or direct production-data fabrication was attempted.

## Next required action

Before U-062 can pass:

1. Run one controlled logged-in internal cohort with explicit internal attribution marker.
2. Confirm the created Form is excluded from external attribution summaries.
3. Confirm the test submission is excluded from value-realized counts.
4. Confirm one real public submission is included.
5. Investigate why one published Form fact has no `publish_succeeded` event, and why `form_created` events exceed Form facts in the small release-window sample.

Until then:

- U-062 stays `Iterate`.
- Attribution Gate remains closed.
- `Qualified lead` remains `N/A`.
- SEO/pSEO Scale cannot use product attribution conversion rates.
