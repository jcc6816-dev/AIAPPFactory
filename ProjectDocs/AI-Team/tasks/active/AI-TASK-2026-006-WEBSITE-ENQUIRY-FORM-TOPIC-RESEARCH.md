# AI-TASK-2026-006: Website Enquiry Form Topic Research

Owner: Gemini
Reviewer: Codex
Date: 2026-06-29
Status: Closed by Codex live SERP + GSC ownership evidence; do not execute unless reopened
Region: Google US (`gl=us&hl=en`)
Output language: Chinese summary with English keyword evidence

## Objective

Determine whether Website / Business Enquiry Form should merge into the existing Contact Form Topic, be owned by a Template, or be rejected. This is research only and does not authorize page creation.

## Required Keywords

1. `enquiry form template`
2. `website enquiry form`
3. `business enquiry form`
4. `enquiry form for website`
5. `online enquiry form`
6. `enquiry form builder`

## Evidence Requirements

- Save raw HTML, screenshot and structured JSON for every keyword.
- Report success/partial/failure honestly; preserve CAPTCHA evidence and do not synthesize missing rows.
- For each organic result capture rank, title, URL, domain, page type, snippet and CTA/product expectation.
- Separate Template, Builder/Product, Guide, Code/Embed and PDF/Document intent.
- Identify whether US results actually prefer the spelling `inquiry` over `enquiry`, and whether that changes owner selection.
- Compare top-result expectations against the product boundary in `seo_goal_website_enquiry_form_validate.md`.

## Mandatory Decision Output

Return exactly one primary decision:

- `Merge into Contact Form`
- `Template-only`
- `Architect Candidate`
- `Reject / Hold`

Also state:

- recommended owning URL;
- whether any existing URL would cannibalize it;
- product gaps;
- exact FAQ/copy boundaries;
- whether the live Contact page should remain frozen.

Do not recommend a new page merely because a keyword exists. The repeated GSC cluster is a Validate trigger, not Build permission.

## Closure

The primary decision is `Merge into Contact Form`. Current GSC query×page evidence proves `/solutions/website-contact-form-template` already owns enquiry/inquiry Template intent. The Builder/tool owner remains `/use-cases/contact-form-builder-for-websites`. No new asset or content edit is authorized.
