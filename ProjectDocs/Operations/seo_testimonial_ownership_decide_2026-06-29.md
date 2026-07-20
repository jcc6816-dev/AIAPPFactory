# Customer Testimonial Ownership Decide

> Date: 2026-06-29
> Loop transition: Validate -> Decide -> Architect
> Decision: Template-only; retire Solution, keep educational Post

## Evidence QA

- Google US research succeeded for 3/6 keywords and was CAPTCHA-blocked for the other 3. The successful set is sufficient to classify `customer testimonial form`, `testimonial collection form` and `customer testimonial form template`; it is not sufficient to make strong claims about AI testimonial or case-study-intake intent.
- The successful SERPs are dominated by Template and Guide results. This supports one exact Template owner plus one supporting educational Post.
- Latest GSC 28d snapshot (`2026-06-27`):
  - Solution: 20 impressions, 0 clicks, average position 72.6.
  - English `customer-story` Template: 1 impression, position 10.
  - Chinese `customer-story` Template: 1 impression, position 6.
  - Queries: `ai testimonial collection` 7 impressions / position 71.1; `ai-powered testimonial collection` 5 / position 85.8.
- There is not enough evidence to call the three existing URLs “severe cannibalization.” The ownership change is justified by product fit and exact template intent, not by a proven cannibalization diagnosis.

## Product Boundary

GenForms can collect structured text, outcomes, publishing preferences, company/role context and follow-up contact. It does not provide video testimonials, logo/headshot upload in this workflow, a testimonial wall/widget, automatic website embed, or a substitute for formal release review.

## Ownership Decision

1. `/templates/customer-testimonial-form` becomes the only product-entry owner.
2. `/templates/customer-story` permanently redirects to the new localized Template URL.
3. `/solutions/customer-testimonial-collection-form` is retired and permanently redirects to the localized Template URL.
4. `/posts/customer-testimonial-form-guide` remains online as the educational Guide and links directly to the Template/create path.
5. No new Solution, Use Case, Post or pSEO page is created.

## Acceptance

- New English and Chinese Template routes render with canonical/hreflang and `customer_testimonial` CTA context.
- All old English, `/en`, and Chinese Template/Solution routes return permanent redirects.
- Retired Solution is absent from Solution lists and sitemap generation.
- Post CTA no longer routes to the retired Solution.
- Public copy states the text/manual-review boundary without claiming that uploads/widgets are universal requirements.
