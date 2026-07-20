# GenForms.ai SEO Topic Goal 2 - Customer Feedback / Satisfaction / NPS Validate

> Created: 2026-06-26
> Loop stage: Validate
> Current owner: Gemini
> Next owner: Codex review
> Status: Pending Gemini SERP Research

## 1. Goal

Validate whether `Customer Feedback / Satisfaction / NPS` should enter the GenForms.ai SEO mainline.

This Goal is not a Build task. Do not create or modify production pages before the research is reviewed.

Final decision options:

- Enter Architect: evidence is strong enough to design a Topic asset package.
- Continue Validate: evidence is promising but incomplete or fragmented.
- Defer: market demand exists, but GenForms cannot currently support the expected user task without overpromising.

## 2. Topic Scope

Research these keywords as a cluster, not as isolated one-off keywords:

| Keyword | Expected angle to verify |
|---|---|
| `customer feedback form` | Form/template intent versus survey platform intent |
| `product feedback form` | Product team feedback collection and feature/request intake |
| `satisfaction survey` | CSAT/survey methodology versus template intent |
| `NPS survey form` | NPS-specific tool/methodology versus simple form intent |
| `website feedback form` | Website visitor feedback widget/form intent |
| `event feedback form` | Post-event feedback collection and survey template intent |

Optional supporting keywords if time allows:

- `customer feedback form template`
- `customer satisfaction survey template`
- `NPS survey template`
- `feedback form builder`

## 3. Gemini Task Prompt

Please perform Google US SERP search intent research for GenForms.ai.

Topic:

`Customer Feedback / Satisfaction / NPS`

Core keywords:

- customer feedback form
- product feedback form
- satisfaction survey
- NPS survey form
- website feedback form
- event feedback form

Optional supporting keywords:

- customer feedback form template
- customer satisfaction survey template
- NPS survey template
- feedback form builder

Research requirements:

1. Use real Google US SERP samples.
2. Save raw evidence for each keyword:
   - SERP screenshot
   - HTML or DOM capture if available
   - SERP query URL or clear query metadata
3. Extract the Top 10 traditional organic results for each core keyword.
   - Do not count ads as organic results.
   - Do not replace organic results with AI Overview summaries.
   - If Google shows modules such as People Also Ask, template packs, video, or comparison blocks, record them separately.
4. For each organic result, record:
   - keyword
   - rank
   - title
   - URL
   - domain
   - snippet
   - page type: product landing / template / blog / support doc / survey platform / marketplace / comparison / glossary
   - intent interpretation
5. Analyze how Google understands this topic:
   - Does the user want to immediately create a feedback form?
   - Does the user want a template?
   - Does the user want survey methodology, such as NPS or CSAT explanation?
   - Does the user expect a professional survey analytics platform?
   - Does the user expect website widget behavior?
6. Analyze competitor patterns, especially:
   - Jotform
   - Typeform
   - Tally
   - Fillout
   - SurveyMonkey
   - Google Forms
   - Zoho Forms
   - Formstack or 123FormBuilder if they appear
7. For competitor pages, identify:
   - first-screen promise
   - CTA wording
   - template entry or product creation path
   - fields/questions shown
   - whether they emphasize free, template, no-code, analytics, reporting, integrations, AI, widget, NPS benchmark, or survey logic
8. Evaluate GenForms fit using strict product boundaries.

GenForms can truthfully promise:

- AI-generated forms
- public share links
- QR code sharing
- mobile-friendly single-question flow
- submission collection
- response dashboard
- CSV export
- webhook configuration, webhook logs, failed delivery retry
- generic webhook and bot notification paths such as Feishu / DingTalk / WeCom / Slack Bot

GenForms must not currently promise:

- complex survey analytics
- professional NPS benchmark platform
- advanced CSAT reporting
- email distribution campaigns
- CRM-native sync
- production-grade email notifications
- spam protection
- anonymous survey permission systems
- website feedback widget injection
- unlimited free usage
- complex branching logic unless verified from current product

Output file:

`GenForms_SEO_Topic_SERP_Research_Feedback_NPS.md`

Required report structure:

1. Executive conclusion
2. Method and evidence paths
3. Keyword-by-keyword SERP Top 10 tables
4. Google search intent interpretation
5. Competitor page pattern analysis
6. GenForms fit and product boundary assessment
7. Recommended Topic priority: P0 / P1 / P2
8. Recommended asset package:
   - Pillar Page
   - Template Page
   - Use Case Page
   - Blog/Post
   - Integration / Webhook support page
   - Internal links
9. Recommendation:
   - Enter Architect
   - Continue Validate
   - Defer
10. Raw evidence appendix:
   - screenshot paths
   - HTML/DOM paths
   - source SERP URLs or query metadata

Important:

Do not recommend pages that require GenForms to overpromise unsupported capabilities. If the SERP is dominated by professional survey analytics tools, say so clearly and recommend a narrower entry point such as `customer feedback form template` or `event feedback form`.

## 4. Codex Acceptance Checklist

Codex should not treat the Gemini report as complete unless all required evidence exists.

| Requirement | Acceptance condition |
|---|---|
| Google US SERP evidence | Each core keyword has screenshot or raw HTML/DOM evidence |
| Top 10 extraction | Each core keyword has traditional organic Top 10 or a clear reason if fewer results were extractable |
| Query coverage | All 6 core keywords are covered |
| Page type classification | Every Top 10 result has page type classification |
| Intent analysis | The report separates template/form intent from survey analytics/methodology intent |
| Competitor analysis | At least 5 relevant competitors are analyzed from actual SERP results or public pages |
| Product boundary | Unsupported GenForms capabilities are explicitly excluded |
| Priority decision | P0/P1/P2 is assigned with reasons |
| Asset package | Suggested asset package is concrete and not just "write a page" |
| Final decision | Report states Enter Architect / Continue Validate / Defer |

## 5. Codex Review Questions After Gemini Returns

When Gemini returns the report, Codex should answer:

1. Is this Topic one market, or multiple different markets that should be split?
2. Which keyword is the best first entry point for GenForms?
3. Is the SERP more template-led, tool-led, methodology-led, or enterprise survey-platform-led?
4. Can GenForms satisfy the primary user task today without overpromising?
5. Should the first asset be a Use Case, Template, Solution, or Blog/Post?
6. Does this Topic support existing clusters such as Event, Typeform Alternative, Webhook, or Lead Capture?
7. Should the Topic enter Architect now?

## 6. Current Status Log

| Date | Status | Owner | Notes |
|---|---|---|---|
| 2026-06-26 | Pending Gemini SERP Research | Gemini | Codex created research task package and acceptance checklist. |
| 2026-06-26 | Needs Gemini Evidence Supplement | Gemini | Codex reviewed `GenForms_SEO_Topic_SERP_Research_Feedback_NPS.md` and did not accept it. Raw JSON shows all 6 core keywords failed with empty `results`; report also drifts into RSVP/Event conclusions. |
| 2026-06-26 | Enter Architect | Codex | Gemini supplemented the evidence chain. Codex verified 6 core keywords with `success:true`, 10 result rows each, HTML/PNG files for each keyword, and a corrected report without Event drift. Evidence caveat: PNG/HTML files are local renderings from structured SERP data, not raw Google screenshots. |
| 2026-06-27 | Architect Complete / Ready for Build | Codex | Created `seo_brief_customer_product_feedback.md`. The first Build is narrowed to a Customer Feedback Pillar using the existing `satisfaction-survey` handoff. Product Feedback remains a P1 child topic; NPS/CSAT remain template-level; Website Feedback is deferred because of widget intent. |
