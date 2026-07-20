# Topic: lead capture form with webhook

## Evidence status

`Captured / Codex transcription repaired`

- Capture date: 2026-06-30
- Evidence: 3 full-page Google screenshots
- Location shown by Google: Los Angeles, California, inferred from IP
- Limitation: the screenshots show a Chinese Google interface and do not visibly prove `hl=en&pws=0&num=10`. Use them for intent and first-page composition, not as a perfectly reproducible US-English rank record.
- Repair note: the original WorkBuddy table contained domain substitutions and called eight visible results “Top 10.” The tables below are re-read directly from the screenshots.

## Queries captured

| # | Query | Evidence file |
|---|---|---|
| 1 | `lead capture form with webhook` | `screenshots/lead_capture_form_with_webhook_q1_lead_capture_form_with_webhook.jpg` |
| 2 | `lead generation form webhook` | `screenshots/lead_capture_form_with_webhook_q2_lead_generation_form_webhook.jpg` |
| 3 | `send lead form submissions to webhook` | `screenshots/lead_capture_form_with_webhook_q3_send_lead_form_submissions_to_webhook.jpg` |

## Screenshot-grounded SERP reading

### Query 1: `lead capture form with webhook`

Visible features: AI Overview and a four-item video carousel.

| Visible organic order | Source | Visible title |
|---:|---|---|
| 1 | LeadCapture.io | How to Setup a Webhook to Post Leads into Another System |
| 2 | Tapform | Webhooks for Lead Capture Forms: Instant Lead Delivery |
| 3 | Google for Developers | Overview \| Lead Form Webhook |
| 4 | Zapier | Send form submissions to webhook for lead processing |
| 5 | n8n | Capture and deduplicate inbound leads with webhooks ... |
| 6 | ServiceMinder Knowledge Base / KnowledgeOwl | Lead Capture Forms - ServiceMinder's Knowledge Base! |
| 7 | LeadsBridge | A guide to Google lead form extension webhook integrations |
| 8 | Reform.app | How to Set Up Webhooks for Lead Forms |

### Query 2: `lead generation form webhook`

Visible features: AI Overview, a video carousel, related questions and related searches. Two organic results appear before the video block.

| Visible organic order | Source | Visible title |
|---:|---|---|
| 1 | Google for Developers | Overview \| Lead Form Webhook |
| 2 | Google Help | How to set up a webhook integration for a lead form |
| 3 | Meta for Developers | Leads - Webhooks from Meta |
| 4 | LeadsBridge | A guide to Google lead form extension webhook integrations |
| 5 | Zapier | Create lead webhook from landing-page forms for campaigns |
| 6 | Reddit / r/n8n | Looking for a lead gen tool that can trigger a webhook with ... |
| 7 | Reform.app | How to Set Up Webhooks for Lead Forms |
| 8 | CustomJS | Build Smart Forms with Webhooks: Automate Lead ... |

### Query 3: `send lead form submissions to webhook`

Visible features: AI Overview, a video carousel and related searches.

| Visible organic order | Source | Visible title |
|---:|---|---|
| 1 | Google for Developers | Overview \| Lead Form Webhook |
| 2 | Zapier | Send form submissions to webhook for lead processing |
| 3 | Google Help | How to set up a webhook integration for a lead form |
| 4 | HubSpot Community | Re: Trigger webhook by form submit |
| 5 | Reform.app | How to Set Up Webhooks for Lead Forms |
| 6 | Medium | Sending a Webhook for each Google Forms Submission |
| 7 | Reddit / r/FacebookAds | How can I connect Facebook Lead Ads instant forms ... |
| 8 | Unbounce | Using a Webhook |

## Codex intent and ownership decision

The stable intent is technical setup: trigger an HTTP request after a lead-form submission, map fields, and send the payload to a CRM or another system. Documentation, platform-specific guides and middleware dominate; this is not a template-first or broad alternative query.

GenForms already has the relevant owner assets:

- `/posts/send-form-submissions-to-webhook`
- `/posts/form-builder-with-webhook`
- `/use-cases/webhook-form-builder-retry-logs`
- `/use-cases/ai-lead-capture-form-builder`

Decision: `Merge / Existing Webhook cluster / No new page`.

Do not create a separate lead-webhook landing page. Keep the existing Webhook and Lead Capture assets frozen and use later GSC query-to-page evidence to decide whether a small internal-link or FAQ adjustment is justified.
