# Topic Pre-Research: portfolio_submission_form

- **Topic**: portfolio_submission_form
- **Queries**: `portfolio submission form`, `portfolio submission form template`, `creative portfolio submission form`
- **Evidence Files**: 
  - `evidence/portfolio_submission_form.html`, `.png`
  - `evidence/portfolio_submission_form_template.html`, `.png`
  - `evidence/creative_portfolio_submission_form.html`, `.png`
- **Google Region**: Google US parameterized results (gl=us&hl=en&pws=0). Google footer location unconfirmed.
- **Evidence Confidence**: Medium (Total 18 queries, 149 organic results extracted. JSON rows extracted sequentially, typically 7-10 per query, not strictly ranked Top 10).

## Extracted SERP Data (Representative: portfolio submission form template)
| Rank/Order | Title | URL | Snippet/Competitor |
|---|---|---|---|
| 1 | Professional Portfolio Submission Form Template | jotform.com | Jotform |
| 2 | Online Portfolio Submission Form Template | responsly.com | Responsly |
| 3 | Portfolio Submission Form Template - GenForms.ai | genforms.ai | GenForms |
| 4 | ENGLISH DEPARTMENT PORTFOLIO SUBMISSION FORM | wilkes.edu | Wilkes |
| 5 | Free and customizable portfolio templates | canva.com | Canva |
| 6 | Evidence Portfolio Submission Form Template | jotform.com | Jotform |
| 7 | What is a portfolio? Examples and tips | adobe.com | Adobe Express |
| 8 | What Is a Work Portfolio? | indeed.com | Indeed |

## SERP Type Distribution
- **University/College Official Pages (40%)**: NYU, MIT, MICA, FIT NYC, Stanford explaining how to submit portfolios via systems like SlideRoom.
- **Form Builders (30%)**: Jotform, Responsly providing file upload form templates.
- **Advice/Guides (30%)**: Canva, Adobe, Indeed.

## User Intent & Target
Searchers are looking for ways to collect creative portfolios (images, PDFs, design files).

## GenForms Correct Owner Baseline
- `/solutions/portfolio-submission-form-template`

## Product Fit & Prohibitions
- **Product Truths**: GenForms MVP **DOES** support `file`, `image`, and `pdf` uploads. The previous assumption that GenForms lacks file upload capabilities is incorrect.
- **Prohibitions**: Cannot promise portfolio management features, ATS, or virus scanning. Cannot make claims about unlimited file sizes.
- **Product E2E Need**: The exact file size limits, allowed MIME types, and security constraints of the multipart upload feature need explicit verification.

## Cannibalization Risk
We already have an owner URL (`/solutions/portfolio-submission-form-template`). Creating a new page would cannibalize it.

## Provisional Recommendation
**Hold / Product Truth Audit**. 
*Why*: We do support file attachments, so we cannot use "No file upload" as the rejection reason anymore. However, we already have an existing owner. We must audit this existing page against the verified product file upload truths (size limits, etc.) before taking action. Not authorized for Build.
