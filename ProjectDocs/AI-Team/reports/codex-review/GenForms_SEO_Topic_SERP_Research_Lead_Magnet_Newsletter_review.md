# Codex Review: Lead Magnet / Content Download + Newsletter Signup

## Review verdict

The two directional decisions are accepted, but Gemini's evidence-quality claims and one product-capability claim are rejected.

Final decisions:

| Track | Final decision | Public asset ownership |
|---|---|---|
| Lead Magnet / Content Download | `Merge into existing Lead Capture` | Keep `/templates/content-download` as a request template; retire the standalone Solution and redirect it to `/use-cases/ai-lead-capture-form-builder` |
| Newsletter Signup | `Template-only coverage` | Keep `/templates/newsletter-signup`; retire the standalone Solution and redirect it to the template |

Neither Track enters Architect. No new Use Case, Solution, Post, Alternative or pSEO page should be created in this round.

## Dataset and grain

- Track A: 6 queries, 50 extracted result rows.
- Track B: 6 queries, 49 extracted result rows.
- Grain: one extracted organic-result candidate per query and rank.
- Source files: one HTML and one PNG per query, plus one results JSON and one manifest per Track.

## Evidence QA

| Check | Track A | Track B | Judgment |
|---|---:|---:|---|
| Queries | 6 | 6 | Complete |
| Extracted rows | 50 | 49 | Complete for the saved parser output |
| Missing snippets | 16 | 10 | Gemini's `0 missing` claim is false |
| Exact titles found in saved HTML | 44/50 | 44/49 | Partial traceability |
| Exact URLs found in saved HTML | 29/50 | 28/49 | Insufficient for a `100% aligned` claim |
| Domain found in HTML | 49/50 | 49/49 | Strong domain-level traceability |
| Screenshot dimensions | 756x469 for all six | 756x469 for all six | First viewport only; does not cover cited Top 8/9 rows |
| Manifest request URL/browser details | Missing | Missing | Query URLs exist in results JSON, not in manifest as claimed |

Examples of report/raw mismatch:

- Lead Magnet report lists the Zendesk canonical article URL, while the JSON stores a generic `https://www.zendesk.com/Blog/Sales` path.
- Newsletter report lists Jotform at rank 4 for `newsletter signup form`, while the saved JSON lists Formstack at rank 4.
- The `lead magnet form` screenshot shows AI Overview only; the `newsletter signup form` screenshot shows an image pack only. Neither screenshot proves the cited organic rows below the fold.

Evidence status: suitable for directional intent and repeated-domain analysis, not suitable for claiming an exact, screenshot-proven Google Top 10. Row-level confidence is medium; Track-level intent confidence is high because the repeated patterns are consistent across six queries.

## Product-fact correction

Gemini states that GenForms supports configurable `Redirect on Submit` and a thank-you card containing Dropbox or Google Drive download links. Current product code does not prove this claim:

- the public submission API returns the submission record only;
- no form setting for a configurable success redirect or thank-you download URL was found;
- the only generic `redirect_url` handler is unrelated block-form infrastructure and is not wired to the current GenForms public-form configuration.

Therefore Track A cannot be justified as a complete immediate-download workflow. GenForms can currently close only the access-request and lead-capture part; file delivery remains external.

## Track A decision

Decision: `Merge into existing Lead Capture`.

Why:

- The extracted set repeatedly contains form templates, lead-generation products and guides.
- Contact, company, role, resource interest and consent overlap heavily with Lead Capture.
- Immediate delivery, embed, email automation and file hosting are common adjacent expectations that GenForms cannot currently promise.

Asset rule:

- keep the real `content-download` template as a resource-access request form;
- preserve explicit external-delivery boundaries;
- retire `/solutions/lead-magnet-download-form` with a permanent redirect to the Lead Capture Pillar;
- do not change the frozen Lead Capture body until its observation window ends; gated-content wording can be considered in the next evidence-based tuning round.

## Track B decision

Decision: `Template-only coverage`.

Why:

- Product/ESP pages dominate the extracted dataset: Mailchimp, Brevo, Mailjet, MailerLite and related tools repeat across queries.
- Website placement, inline/popup embed, list hosting, double opt-in, unsubscribe handling and campaign delivery are core expectations.
- GenForms can collect signup interest through a public link or QR code but cannot fulfill the dominant website/ESP workflow.

Asset rule:

- keep `/templates/newsletter-signup` with explicit boundaries;
- retire `/solutions/newsletter-signup-form-builder` with a permanent redirect to the template;
- no Newsletter Pillar, Solution expansion, Post cluster or pSEO trial until embed and ESP capabilities materially change.

## Required observation

- Track A stays under Lead Capture; observe `lead_magnet_request` template-create events separately.
- Track B remains Template-only; observe `newsletter_signup` template-create events, but do not infer market fit from low-volume template traffic.
- Any future capability change must restart Validate before restoring a Solution URL.
