# Codex Review: Job Application + Consultation / Booking SERP Research

> Review date: 2026-06-28  
> Source reports: `GenForms_SEO_Topic_SERP_Research_Job_Application.md`, `GenForms_SEO_Topic_SERP_Research_Consultation_Booking.md`  
> Overall assessment: Track A share with caveats; Track B needs revision before its broad conclusion can be used.

## 1. Evidence quality

The capture is real Google US HTML with `hl=en&gl=us&pws=0`, and no rendered CAPTCHA page was found in the sampled screenshots. However, the handoff is not 100% complete or 100% accurate.

| Check | Track A | Track B |
|---|---:|---:|
| Keywords marked success | 6/6 | 6/6 |
| Saved organic rows | 53 | 62 |
| Rows per keyword | 8-10 | 9-12 |
| Missing snippets | 13 | 19 |
| Exact result URL found in saved HTML | 31/53 | 45/62 |
| Screenshot size | 756x469 | 756x469 |
| Screenshots proving all organic rows | No | No |

Material defects:

1. Every screenshot is only the first viewport. Some show an image pack or AI Overview and do not visually verify the saved organic rows.
2. Track B still contains invalid video URLs: `https://870+views·3yearsago` and `https://1.1K+views·2yearsago`.
3. Track B report tables do not match the structured JSON. For example, the report lists Tally, Fillout, Paperform and Formsite for `consultation request form`, while the raw JSON is dominated by medical, government and PDF results.
4. Page-type classification is coarse. Government PDFs, legal documents, Pinterest and general information pages are frequently marked `product`.
5. The reports must not claim 100% data completeness or URL accuracy.

## 2. Track A decision: Job Application

### Decision

`Template remediation only`; do not create a new Use Case or Solution.

Supported conclusion:

- Broad `job application form` and `employment application form` SERPs are heavily mixed with printable/legal employment documents.
- Builder/template SERPs include online form tools, but file upload, employment language and ATS expectations are common.
- `AI job application form builder` is ambiguous between employer-side form generation and jobseeker auto-apply tools.

Correction to Gemini:

- Resume upload is common and important, but “100% of modern online recruiting forms must upload a PDF resume” is not proven by this sample.
- LinkedIn, portfolio or GitHub URLs are safe text fields, but they do not make GenForms a complete job-application platform.

Required product correction:

- Keep `/templates/job-application`, but reposition it as a lightweight candidate interest / pre-screening form.
- Remove the PDF resume field, OCR preset, upload claims, resume-download webhook claims, ATS claims and automatic parsing claims.
- Explicitly state that GenForms does not host resume uploads, provide an ATS pipeline, e-signatures or employment-compliance tooling.

## 3. Track B decision: Consultation / Booking

### Decision by sub-intent

| Sub-intent | Decision | Reason |
|---|---|---|
| `demo request form builder` | Enter Architect under Lead Capture | Raw SERP is primarily form templates, lead-generation tools and AI form builders; current product can collect qualification context and route submissions |
| `consultation form template` | Topic Universe / template remediation | Template intent exists, but verticals range from beauty and medical intake to general consulting |
| `consultation request form` | Do not create a generic Pillar | Raw results are dominated by medical, government, legal and PDF meanings; Gemini's P0 conclusion is not supported |
| `booking request form` | Template-only candidate | Request collection is possible, but hotel, venue and reservation expectations are mixed |
| `appointment request form` | Reject owning page | Medical/government appointment and scheduling expectations are strong |
| `consultation booking form` | Reject owning page | Booking, calendar, reminders and scheduling expectations are too strong |

### Product-fact correction

Redirect-on-submit to Calendly, Cal.com or Zoom is not a confirmed GenForms capability and must not appear as a green-line promise. GenForms can currently promise only request collection, dashboard/CSV review, and webhook/bot follow-up.

The existing `booking-consultation` template also needs truthful repositioning: preferred date/time is a request field, not real-time availability or a confirmed booking. Remove calendar-invite and automatic confirmation language.

## 4. Final Loop decisions

- Job Application: `Validate -> Template Remediation / Hold`.
- Consultation / Booking: split the combined Topic instead of advancing it wholesale.
- Demo Request: `Validate -> Architect` as a Lead Capture subcluster.
- Generic Consultation Request: remain in Topic Universe.
- Booking / Appointment: no Pillar and no Solution until scheduling capabilities exist.

## 5. Execution order

1. P0 product-truth repair for public Job Application and Booking Consultation templates.
2. Architect and then Build the Demo Request subcluster.
3. Observe before considering consultation or booking long-tail pages.

