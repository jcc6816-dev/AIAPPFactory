# Topic Pre-Research: job_application_form_before_ats

- **Topic**: job_application_form_before_ats
- **Queries**: `job application form builder`, `job application form template`, `simple job application form without ATS`
- **Evidence Files**: 
  - `evidence/job_application_form_builder.html`, `.png`
  - `evidence/job_application_form_template.html`, `.png`
  - `evidence/simple_job_application_form_without_ATS.html`, `.png`
- **Google Region**: Google US parameterized results (gl=us&hl=en&pws=0). Google footer location unconfirmed.
- **Evidence Confidence**: Medium (Total 18 queries, 149 organic results extracted. JSON rows extracted sequentially, typically 7-10 per query, not strictly ranked Top 10).

## Extracted SERP Data (Representative: job application form builder)
| Rank/Order | Title | URL | Snippet/Competitor |
|---|---|---|---|
| 1 | Free Online Job Application Form Creator & Templates | aidaform.com | AidaForm |
| 2 | Employee Application Form | goformz.com | GoFormz |
| 3 | Job Application Form Builder - Free & Works on Any Website | commoninja.com | Common Ninja |
| 4 | Free Job Application Form Template | typeform.com | Typeform |
| 5 | Easy-To-Use Job Application Form Template | dropbox.com | Dropbox |
| 6 | Free AI Employment Application Form Generator | template.net | Template.net |
| 7 | Create a beautiful online job application form | wispform.com | Wispform |
| 8 | Free AI Employment Application Form Generator | makeform.ai | Makeform.ai |
| 9 | Create Online Job Applications | applicantstack.com | ApplicantStack |

## SERP Type Distribution
- **Form Builders / Templates (80%)**: Typeform, Jotform, Makeform, Aidaform, FormNX offering templates and builders specifically for HR.
- **HR/Employment Advice (20%)**: Indeed, Acas, Harvest providing advice on application forms.

## User Intent & Target
The searcher is a small business or HR team looking for a quick way to collect job applications without a heavy ATS. They expect basic candidate info, contact details, and crucially, a resume/CV file upload field.

## Competitor Analysis
Competitors (Typeform, Jotform, Makeform) natively support file uploads.

## GenForms Correct Owner Baseline
- `/solutions/job-application-form-builder`
- `/templates/job-application`

## Product Fit & Prohibitions
- **Product Truths**: GenForms MVP **DOES** support `file`, `image`, and `pdf` uploads using multipart submission, with server-side persistence to object storage or local fallback. 
- **Prohibitions**: Cannot promise ATS integration, unlimited file storage, conditional logic, CRM native sync, or virus scanning without evidence.
- **Product E2E Need**: The exact production limits, sizes, allowed types, and security boundaries for file uploads require Product E2E verification before making claims.

## Cannibalization Risk
We already have the `/solutions` and `/templates` paths for this. Rebuilding without reviewing them could cannibalize existing owners.

## Provisional Recommendation
**Hold / Product E2E + Existing Owner Review**. 
*Why*: We do support file attachments, so we do not reject it based on file limitations. However, we must first run a Product E2E test to verify file upload size, limits, and security constraints before updating our existing owner URLs (`/solutions/job-application-form-builder`, `/templates/job-application`). Not authorized for Build.
