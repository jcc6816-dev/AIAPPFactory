# Codex Review: Course Registration + Community Application Topic Research

Review date: 2026-06-28

## Executive decision

| Track | Gemini decision | Codex decision | Parent / ownership |
|---|---|---|---|
| Course Registration | Enter Architect as Lead Capture subcluster | **Enter Architect** | Event Registration / Education & Training subcluster |
| Community Application | Template-only coverage | **Template-only coverage** | Template library only; retire the standalone Solution after implementation review |

No new public page is approved by this review. Course Architect should work from the existing Solution and Template. Community should consolidate to the existing Template rather than keep two competing landing pages.

## Dataset and grain

Course evidence:

- 6 Google US query captures.
- 56 extracted organic rows.
- 6 HTML files and 6 PNG screenshots.
- Query parameters include `hl=en&gl=us&pws=0`.

Community evidence:

- 6 Google US query captures.
- 58 extracted organic rows.
- 6 HTML files and 6 PNG screenshots.
- Query parameters include `hl=en&gl=us&pws=0`.

Intended grain: one extracted organic result row per query and reported rank.

## Evidence QA findings

### High: the `100% aligned` claim is false

Course:

- 11 of 56 rows have a missing snippet: 19.6%.
- 48 of 56 exact titles appear in the corresponding HTML: 85.7%.
- 40 of 56 exact URLs appear in the corresponding HTML: 71.4%.
- 32 JSON rows are absent from the report's cited URL tables.

Community:

- 14 of 58 rows have a missing snippet: 24.1%.
- 49 of 58 exact titles appear in the corresponding HTML: 84.5%.
- 53 of 58 exact URLs appear in the corresponding HTML: 91.4%.
- 39 JSON rows are absent from the report's cited URL tables.
- One extracted row contains an invalid target: `https://2.1K+views·2yearsago`.

Impact: the reports cannot be treated as exact Google Top 10 exports. They are acceptable for repeated Topic-level pattern detection, but not for rank-by-rank competitor claims.

### High: screenshots do not cover the cited organic rows

All 12 PNG files are 756x469 first-viewport captures.

- The representative Course screenshot shows an Images block and no cited organic rows.
- The representative Community screenshot shows one result and part of an AI Overview.

Impact: screenshots prove that a Google result page was rendered, but do not verify the complete result tables.

### Medium: manifest lineage is incomplete

The manifests record query, timestamp, status, HTML path, and PNG path. They do not record the query URL, browser build, network exit, final response URL, or content hash. Query URLs are present in the result JSON, but the report's Chrome 120 and complete screenshot claims are not independently proven by the manifest.

### Medium: page-type labels are noisy

Course JSON labels 19 rows as `product`, including university PDFs and registrar forms. Community labels 32 rows as `product`, including government documents, Pinterest, and unrelated application pages.

Impact: page-type percentages should not drive decisions without manual intent grouping.

## Search-intent assessment

### Course Registration

Observed composition:

- 33/56 rows are labeled template.
- 4/56 are labeled guide.
- Repeated domains include SurveyMonkey, Jotform, 123FormBuilder, Tally, AidaForm, and other form/template providers.
- University registrar PDFs and administrative forms create a secondary academic-document intent.

The dominant addressable task is straightforward: create or reuse a form that collects student details, course/class/workshop choice, experience, learning goal, and contact information.

The report overstates payment and capacity as universal hard requirements:

- Only one extracted snippet explicitly mentions payment upfront.
- Only one extracted snippet explicitly mentions capacity.

Payment, seat limits, confirmation email, attendance, and LMS integration are important capability gaps, but the evidence does not show they dominate all six SERPs.

### Community Application

Observed composition:

- 22/58 rows are labeled template.
- 4/58 are labeled guide.
- The broad `community application` and `private community application` queries are heavily polluted by government, education, housing/planning, caste-certificate, and generic application results.
- Membership-qualified queries contain useful form-template intent from Jotform, Typeform, Paperform, MightyForms, and 123FormBuilder.

The addressable task is collecting applicant identity, background, motivation, contribution, and rule consent. Approval workflow and platform invite automation are meaningful product gaps, but only the Paperform snippets explicitly mention automated approvals and Discord/Slack communities. The raw evidence does not establish those capabilities as universal requirements.

## Product-fact corrections

The Course report incorrectly lists the following as supported:

- Success Redirect to Stripe, Paddle, Calendly, or an LMS.

The current GenForms public-form submission route returns the submission record and no configurable post-submit redirect field was found in the form model or creation settings. Redirect must remain unsupported until the product implements and verifies it.

Current supported claims for Course:

- AI-generated registration/intake fields.
- public link and QR sharing.
- response collection, dashboard, and CSV export.
- generic Webhook and supported bot notification paths.
- mobile one-question flow.

Current unsupported Course claims:

- payment or tuition collection.
- seat/capacity enforcement.
- automatic confirmation email.
- attendance/certificate management.
- native LMS or calendar integration.
- configurable Success Redirect.

Current supported claims for Community:

- application/intake data collection.
- public link and QR sharing.
- dashboard and CSV export.
- generic Webhook and supported bot notifications.

Current unsupported Community claims:

- approve/reject workflow.
- automatic Discord/Slack invite generation.
- membership provisioning.
- payment/subscription handling.
- native community-platform synchronization.

## Final decisions

### Course Registration: Enter Architect

Ownership correction: place it under Event Registration / Education & Training, not Lead Capture.

Rationale:

1. Google US repeatedly returns form templates for course, class, training, and workshop registration.
2. GenForms supports the central data-collection task without needing payment or capacity management.
3. GSC already shows 42 impressions for the existing Solution and 23 impressions for `course form` over 28 days.
4. Workshop registration overlaps the Event Registration Topic and QR sharing path.

Smallest honest asset package:

- keep and refine `/solutions/course-registration-form-builder`.
- keep `/templates/course-registration`.
- link to the Event Registration / QR Topic where relevant.
- do not create a new Use Case, Post, Integration, Alternative, or pSEO batch in the first Architect round.
- explicitly state that GenForms collects registrations but does not process tuition, enforce seat limits, send production email confirmations, or sync to an LMS.

### Community Application: Template-only coverage

Rationale:

1. Broad queries are materially polluted and do not consistently mean an online creator/private community.
2. Membership-qualified queries prove a lightweight form-template need, which the existing Template can satisfy.
3. First-party signal is extremely weak: only two page impressions in the latest 28-day snapshot and no matching stored query sample.
4. A separate Solution risks cannibalizing the Template while implying approval/invite automation.

Action after implementation review:

- keep `/templates/community-application`.
- narrow visible copy to manual application collection and review.
- retire `/solutions/community-application-form-template` with a permanent redirect to the Template.
- do not create a Use Case, Post, Alternative, Integration, or pSEO expansion.

## Evidence confidence

- Google page capture authenticity: medium-high.
- Rank-by-rank table fidelity: low-medium.
- Course Topic-level intent: high.
- Community Topic-level intent pollution: high.
- Course payment/capacity-as-dominant claim: low.
- Community approval/sync-as-universal claim: low.
