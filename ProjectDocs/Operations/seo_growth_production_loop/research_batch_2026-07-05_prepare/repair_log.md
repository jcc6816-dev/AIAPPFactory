# Evidence Repair Log

**Date**: 2026-07-03
**Context**: Executed a strict Evidence Repair Pass to correct product facts and authority validations without re-running Google Queries.

## 1. Product Truth & Topic Report Corrections

The following product truth was integrated: GenForms MVP **does support** `file`, `image`, and `pdf` uploads. It does not support ATS, iframe Embed, or Production Email alerts. 

Corrected Topic Reports:
- `job_application_form_before_ats.md`: Replaced "Reject due to no file upload" with "Hold / Product E2E + Existing Owner Review". Added correct owner URLs.
- `portfolio_submission_form.md`: Replaced "Reject due to no file upload" with "Hold / Product Truth Audit". Added correct owner URL.
- `customer_testimonial_form.md`: Corrected owner URLs. Changed to "Frozen Observe" as we already own the intent and must wait out the freeze period.
- `short_customer_feedback_form.md`: Added correct owner URL. Changed to "Existing Tune / Frozen Observe" to prevent synonym pages.
- `website_contact_form_checklist.md`: Changed to "Hold / Authority" due to lack of embed and production email, acknowledging the existing owner pages.
- `form_submission_webhook_notification.md`: Retained official doc intent but added all correct owner URLs. Changed to "Existing Tune / Hold".

## 2. Evidence Level Downgrade

- Updated all Topic Reports and `index.md` to reflect **Medium** confidence.
- Clarified that exactly 149 rows exist in `serp_data.json` across 18 queries, extracted sequentially.
- Clarified that we used `gl=us&hl=en&pws=0` but cannot confirm the physical Google US location (Google US parameterized results).

## 3. Authority Target Re-validation

Re-navigated to exact policy pages using Playwright (headless=True) without solving CAPTCHAs.

- **SaaSHub**: Successfully validated the `/submit` page. Free policy confirmed. Status: **Go**.
- **TinyCommand**: Validated `/pricing`. Found it is a $19/mo SaaS form product, not a directory. Status: **Reject**.
- **Formgrid**: Validated `/pricing`. Found it is a first-party form builder running its own alternative pages. Status: **Reject**.
- **AlternativeTo**: Attempted `/about/submit-software/` and hit a 404 Page Not Found. Could not verify rules without bypassing protection. Status: **Blocked**.

## 4. Added Evidence Files
- `evidence/Authority_Repair_SaaSHub_Submit.html` & `.png`
- `evidence/Authority_Repair_AlternativeTo_AddSoftware.html` & `.png`
- `evidence/Authority_Repair_AlternativeTo_Pricing.html` & `.png`
- `evidence/Authority_Repair_TinyCommand_Pricing.html` & `.png`
- `evidence/Authority_Repair_Formgrid_Pricing.html` & `.png`
- `evidence/Authority_Repair_Formgrid_Typeform_Alternatives.html` & `.png`

## 5. Exclusions
- Did not re-run the 18 Google Queries.
- Did not delete or overwrite the original HTML/PNG/JSON files.
- Did not solve CAPTCHAs, register accounts, or submit forms.
- Did not authorize any new Builds or URLs.
