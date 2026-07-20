# Website / Business Enquiry Form Decide

> Date: 2026-06-29
> Loop transition: Discover -> Validate -> Decide -> Merge / Observe
> Decision: Merge into Contact Form Cluster; no new URL

## Evidence

### Google US live SERP sample

Two highest-signal queries were inspected live with `gl=us&hl=en&pws=0`:

1. `enquiry form template`
   - Organic results were led by 123FormBuilder Inquiry templates, Typeform Inquiry Form Template, SurveyMonkey General Inquiry Contact Form, Jotform Inquiry Form Template, LimeSurvey and Zoho Product Enquiry Template.
   - Google US normalized much of the British `enquiry` spelling to American `inquiry` results.
   - Result type was predominantly Template, with a smaller document/design tail.
2. `website enquiry form`
   - Organic results were led by Jotform Inquiry Form Template, SurveyMonkey General Inquiry Contact Form, Typeform Inquiry Form Template, 123FormBuilder, a contact-form guide and Formplus Website Enquiry Form Template.
   - The task is still a contact/inquiry intake form; no distinct workflow or feature expectation appeared.

This two-query sample is sufficient for a conservative Merge/no-build decision. It is not treated as a complete six-keyword ranking report and does not authorize content tuning.

### GSC query x page evidence

Search Console API, 2026-06-01 through 2026-06-27:

- `/solutions/website-contact-form-template` owned 23 enquiry/inquiry query-page rows and 62 impressions.
- Strongest rows included:
  - `web enquiry form`: 10 impressions, position 59.6;
  - `enquiry form template`: 9, position 54.9;
  - `website enquiry form`: 5, position 69.4;
  - `create with ai a fully functional inquiry form for website`: 5, position 23.8;
  - `inquiry form template`: 4, position 52.8.
- `/use-cases/contact-form-builder-for-websites` appeared once for the long AI inquiry query at position 15.
- `/solutions/real-estate-inquiry-form-template` appeared once for `property enquiry form`; this is a separate vertical qualifier, not cannibalization of the generic cluster.

## Ownership

- Builder/tool intent: `/use-cases/contact-form-builder-for-websites`.
- Website/business enquiry template intent: `/solutions/website-contact-form-template`.
- Reusable product starter: `/templates/contact-us`.

The existing split matches the original Contact Form brief. The mainline board's temporary statement that the Use Case owned all enquiry variants was too broad and is corrected by current query×page evidence.

## Decision

- `Merge into Contact Form Cluster`.
- Do not create an Enquiry Use Case, Solution, Template, Post or pSEO page.
- Keep the Contact Pillar and existing Solution frozen.
- After the freeze, only consider a small copy/FAQ synonym adjustment if the enquiry/inquiry cluster continues gaining impressions but remains 0-click. Do not change URL ownership.

## Product Boundary

Position this as lightweight inquiry collection and manual follow-up. Do not promise website embed code, spam protection, a shared inbox, ticketing, automatic routing, SLA, live chat, native CRM sync or production email automation.
