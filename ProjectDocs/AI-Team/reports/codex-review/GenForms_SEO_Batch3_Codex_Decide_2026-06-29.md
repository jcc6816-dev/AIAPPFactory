# GenForms SEO Batch 3 Codex Decide

Date: 2026-06-29

## Overall Assessment

**Product decisions are ready to use; Gemini's exact SERP tables are shareable only with caveats.**

The raw folders contain 18 HTML files, 18 PNG screenshots, three structured result files and three manifests. This is enough to support Topic-level direction. It is not enough to support the reports' claims of complete screenshot coverage or 100% title/URL/snippet alignment.

## Evidence QA

| Track | JSON rows | Missing snippets | Exact URLs found verbatim in saved HTML | Screenshot size | Assessment |
|---|---:|---:|---:|---|---|
| Service Request / Complaint | 60 | 16 (26.7%) | 39/60 | 756x469 for all six | Direction usable; exact rankings and completeness claims not reliable |
| Volunteer Application | 53 | 16 (30.2%) | 37/53 | 756x469 for all six | Direction usable; application vs signup split is clear enough for Template-only |
| Vendor / Supplier | 55 | 23 (41.8%) | 42/55 | 756x469 for all six | Direction usable; compliance and Google-penalty claims require correction |

Additional issues:

- The screenshots are viewport captures, not full-page SERP evidence. Several begin with AI Overview or Sponsored modules.
- Report tables are not always direct transcriptions of JSON. For example, the Volunteer report's `volunteer application form` table places Jotform/Tally/Fillout in ranks that do not match the saved JSON rows.
- URL absence from the raw HTML can sometimes result from Google redirect encoding, so it does not prove a row is fabricated. It does disprove the report's unconditional `100% exact alignment` claim without a documented normalization/reconciliation step.
- Page-type and intent labels are analyst classifications, not raw Google fields. They should be treated as interpretation.

## Policy Correction

The Vendor report's rejection decision is retained, but its rationale is corrected:

- Google's social-engineering policy concerns deceptive or impersonating behavior that tricks users into unsafe actions. Legitimate data collection is not automatically classified as phishing merely because a field is sensitive.
- PCI DSS concerns payment cardholder data and sensitive authentication data. It is not the correct blanket compliance label for W-9 or ordinary bank-account collection.
- GenForms should reject this Topic now because it lacks file upload, sensitive-data governance, procurement approval, document verification, e-signature and ERP/AP workflow support.

Primary references:

- [Google social engineering policy](https://developers.google.com/search/docs/monitor-debug/security/social-engineering)
- [PCI DSS account data scope](https://www.pcisecuritystandards.org/documents/PCI-DSS-v4-0-SAQ-C.pdf)

## Final Loop Decisions

### 1. Volunteer Application

- Priority: P0.
- Decision: `Enter Architect / Template-only`.
- Asset: one `/templates/volunteer-application` page generated from one real template.
- Name: `Volunteer Application Form`, not `Volunteer Signup Form`.
- No Solution, Use Case, Post, Integration, Alternative or pSEO page.
- Build only after Architect Brief product/UX review.

### 2. Service Request / Complaint

- Priority: P1.
- Decision: `Merge into Contact Form / Customer Feedback + Architect Backlog`.
- Future scope: at most one lightweight `Customer Service Request Form` or `Support Request Intake Form` template.
- Exclude `work request`, maintenance dispatch, ticket status, SLA and helpdesk intent.
- No independent SEO page and no active Build while Volunteer is active.

### 3. Vendor / Supplier Registration

- Decision: `Reject` for the current MVP.
- No Template, Solution, Use Case, Post, Integration or pSEO page.
- A future `event vendor application` or non-sensitive vendor-interest Topic would require a new Discover cycle and cannot inherit approval from this batch.

## Next State Transition

```text
Volunteer Application: Validate -> Decide -> Architect
Service Request: Validate -> Decide -> Merge / Architect Backlog
Vendor / Supplier: Validate -> Decide -> Reject
```

Only Volunteer Application becomes the next active Architect item.

