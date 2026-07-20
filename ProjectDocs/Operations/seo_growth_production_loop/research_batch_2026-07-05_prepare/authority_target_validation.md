# Authority Target Validation

- **Target Sites**: TinyCommand, Formgrid, AlternativeTo, SaaSHub
- **Objective**: Validate whether they are still operational, whether they allow external submissions, and outline the correct path for "Typeform Alternatives" inclusion without violating our rules.
- **Rules**: We cannot pay for dofollow links, fake reviews, or undisclosed sponsorships. No solving CAPTCHA, no submitting, no logging in.

## 1. TinyCommand (https://tinycommand.com)
- **Status**: Operational, but it is a Competitor Product, not an Authority Directory.
- **Evidence**: `evidence/Authority_Repair_TinyCommand_Pricing.html`, `.png`
- **Submission/Update**: Not applicable.
- **Pricing Policy**: "One platform. One bill. Your whole stack. Forms, tables, workflows, agents and email." It charges $19/mo. 
- **Recommendation**: **Reject**. TinyCommand is a first-party SaaS product (form builder), not an independent aggregator. We cannot submit to it.

## 2. Formgrid (https://formgrid.com)
- **Status**: Operational, but it is a Competitor Product.
- **Evidence**: `evidence/Authority_Repair_Formgrid_Pricing.html`, `.png`, `evidence/Authority_Repair_Formgrid_Typeform_Alternatives.html`
- **Submission/Update**: Not applicable.
- **Pricing Policy**: The site navigation shows "Create form", indicating it is a first-party form product itself. It is running its own "Typeform Alternatives" landing page for SEO.
- **Recommendation**: **Reject**. Formgrid is a first-party form product. Per rules, we cannot call it an independent aggregator or expect them to neutrally list us.

## 3. AlternativeTo (https://alternativeto.net)
- **Status**: Blocked / Page Not Found.
- **Evidence**: `evidence/Authority_Repair_AlternativeTo_AddSoftware.html`, `.png`
- **Submission/Update**: Attempted to access `/about/submit-software/` but hit a 404 "Could not find this page" and previous scans hit Cloudflare. We cannot use search snippets or homepage text to assume the rules.
- **Pricing Policy**: Unknown / Blocked.
- **Recommendation**: **Blocked**. We could not directly verify the submission or pricing rules on the target page without logging in or bypassing protection.

## 4. SaaSHub (https://www.saashub.com)
- **Status**: Operational.
- **Evidence**: `evidence/Authority_Repair_SaaSHub_Submit.html`, `.png`
- **Submission/Update**: Verified `/submit` page is live and accepts submissions.
- **Pricing Policy**: Explicitly states "This is our free marketing tool... FREE." Free to submit software.
- **Recommendation**: **Go**. The submission page and free policy are confirmed via direct visit.

## Summary
- **Go**: SaaSHub (Submit page and free policy confirmed).
- **Reject**: Formgrid (1st party product), TinyCommand (1st party product).
- **Blocked**: AlternativeTo (404 / Cloudflare on submission pages).
- **Note**: No code, emails, or actual submissions were executed per instructions.
