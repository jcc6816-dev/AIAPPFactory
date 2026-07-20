# WorkBuddy SERP Topic Loop Review — 2026-06-30

> Scope: review WorkBuddy outputs under `ProjectDocs/Operations/gemini_keyword_research_loop/workbuddy_serp_captures/`.
> Purpose: convert returned SERP captures into Topic Loop decisions without treating a SERP report as automatic permission to build.

## Executive decision

The Loop can continue, but not as eleven new builds.

WorkBuddy produced 18 topic files. Eleven topics now have usable real Google screenshot evidence; 7 remain blocked by CAPTCHA and must stay `Hold / Evidence blocked`.

Of the 11 captured topics:

| Topic | Evidence status | Codex decision | Action |
|---|---:|---|---|
| `user interview recruitment form` | Captured | Existing asset already ranks; protect and observe | No new page. Treat as Golden Tuning candidate only if GSC confirms stable impressions/click gap. |
| `event feedback survey` | Captured | Existing template is already live | No new URL. Consider template-only tuning after Event cluster freeze data. |
| `customer feedback form with QR code` | Captured | Valid product angle, but overlaps frozen Customer Feedback + QR cluster | Record as support evidence. Do not build during freeze. |
| `google forms alternative with webhooks` | Captured | Commercially interesting, but belongs to Alternatives/Webhook backlog | No immediate build. Reassess after Typeform/Webhook cluster authority data. |
| `tally alternative` | Captured | High-intent but too competitive and free-tier mismatch is material | Hold / Backlog. No build this cycle. |
| `lead capture form with webhook` | Captured / Codex repaired | Technical setup intent; existing Webhook + Lead Capture assets already own it | Merge. No new page; await query-to-page evidence before any tune. |
| `form notification workflow` | Captured / Codex repaired | SERP expects workflow/email/task automation beyond MVP | Hold. Do not create a workflow page. |
| `public form link / shareable form` | Captured / Codex repaired | Broad help/category intent; sharing is a baseline capability | Merge into product education and current QR/share assets. No new page. |
| `portfolio submission form` | Captured / Codex reviewed | Existing Solution is already visible on page one for the exact template query | Observe / Golden Tuning candidate after GSC confirmation. No new page. |
| `form submissions to WeCom` | Captured / Codex reviewed | Existing notification Use Case ranks first for the product-relevant query | Merge / Observe. No dedicated WeCom page. |
| `mobile-friendly form builder` | Captured / Codex reviewed | Broad commercial/mobile-operations expectations exceed MVP | Reject standalone Topic; retain supporting mobile-friendly copy. |

## Evidence quality notes

- Real evidence is primarily the `.jpg` screenshot set. The earlier `.png` files may contain failed CAPTCHA/sorry pages from prior automation and must not be used as final evidence.
- WorkBuddy says the browser UI rendered in Simplified Chinese while query parameters used `gl=us&hl=en`. Treat results as usable US-oriented SERP screenshots, but not perfect full-fidelity HTML captures.
- Only `html/gfaw_q1.html` and `html/gfaw_q1_v2.html` exist. Do not claim full rendered HTML coverage for all 5 topics.
- The original WorkBuddy index marked the first 5 as `Build`. The repaired index now carries Codex decisions because `Build` requires product truth, existing asset mapping, freeze-window checks, and Loop capacity.
- In the second 3-topic batch, screenshots are genuine full-page Google captures, but the original markdown transcription substituted several domains and counted video-carousel items as organic rankings. Codex repaired all three files directly from the screenshots.
- The second-batch screenshots show Los Angeles, California as the IP-inferred location, but the Google UI is Chinese and the address bars do not visibly prove `hl=en&pws=0&num=10`. They are sufficient for intent/composition decisions, not exact reproducible rank tracking.
- The third-batch screenshots are stronger evidence: English Google UI, Los Angeles IP-derived location, full-page coverage through pagination, no login and no CAPTCHA. Mike captured all nine; Codex performed the transcription directly.

## Topic decisions

### 1. User Interview Recruitment Form

WorkBuddy reports GenForms ranking on the main query. Screenshot inspection shows the visible GenForms result is the existing Solution page path (`/solutions/user-interview-recruitment-form`), not a ranking 404 template URL.

Production URL check:

- `https://genforms.ai/solutions/user-interview-recruitment-form` → 200
- `https://genforms.ai/templates/user-interview-recruitment` → 200
- `https://genforms.ai/templates/user-interview-recruitment-form` → 404

Decision:

- Do not create a new page.
- Do not add a redirect solely from WorkBuddy's markdown URL typo.
- Add to Golden Tuning watchlist only after GSC confirms the same query/page relationship and there is a CTR or content gap.

### 2. Event Feedback Survey

SERP evidence shows a real template/example/how-to intent for post-event survey and conference feedback form templates.

Product/asset check:

- Existing template `event-feedback` is present in `Code/services/form-templates.ts`.
- Production `https://genforms.ai/templates/event-feedback` → 200.
- Production `https://genforms.ai/zh/templates/event-feedback` → 200.

Decision:

- No new `/templates/post-event-survey` or duplicate URL now.
- Keep as `Template-only / Architect Backlog`.
- After Event Registration / QR Event freeze data returns, decide whether to tune the existing `event-feedback` template page title/FAQ/internal links, not create a second page.

### 3. Customer Feedback Form with QR Code

SERP evidence confirms a real QR-code feedback form task: users want a feedback form that can be opened from a QR code for stores, counters, events, receipts, and offline touchpoints.

Product/asset check:

- GenForms has public share link and QR code sharing in the publish/admin experience.
- Existing assets already cover most of the intent:
  - `/use-cases/customer-feedback-form-builder`
  - `/use-cases/qr-code-form-builder`
  - `/templates/satisfaction-survey`

Decision:

- Do not create a new page during the Customer Feedback freeze window.
- Record this as supporting evidence for future Customer Feedback + QR internal-link/FAQ tuning after 2026-07-11.

### 4. Google Forms Alternative with Webhooks

SERP evidence is commercially meaningful: users want a Google Forms replacement with native webhook support instead of Apps Script workarounds.

Product/asset check:

- U-061 is complete: Slack Incoming Webhook product gate is now Pass, and generic webhook support already exists.
- Existing assets include Webhook Form, Typeform Alternative, and Google Forms comparison content.

Decision:

- Keep in `Alternatives / Webhook Architect Backlog`.
- No independent landing page this cycle.
- Reassess after Typeform/Webhook clusters show enough query authority or after GSC shows Google Forms + webhook queries landing on existing assets.

### 5. Tally Alternative

SERP evidence confirms high commercial intent, but it is crowded by Tally, Fillout, Typeform, Tripetto, G2/Zapier/listicles, and Reddit.

Decision:

- Hold / Backlog.
- Do not build a Tally Alternative page this cycle.
- Reason: Tally's generous free tier creates a poor near-term positioning fight for GenForms; GenForms has a better current wedge around webhook/task-specific forms than broad competitor-alternative pages.

### 6. Lead Capture Form with Webhook

The repaired screenshots show documentation and technical setup guides from Google, Zapier, platform vendors and middleware. The intent is payload delivery and field mapping, not a new template or alternative landing page.

Existing owners already cover the task:

- `/posts/send-form-submissions-to-webhook`
- `/posts/form-builder-with-webhook`
- `/use-cases/webhook-form-builder-retry-logs`
- `/use-cases/ai-lead-capture-form-builder`

Decision:

- Merge into the existing Webhook + Lead Capture cluster.
- Do not create a separate page.
- Keep frozen; use future GSC query-to-page evidence before any internal-link or FAQ tune.

### 7. Form Notification Workflow

The repaired screenshots are dominated by Microsoft Forms + Power Automate, HubSpot, Google Forms add-ons and Jotform. Users commonly expect conditional routing, native email/task actions or a workflow builder.

Decision:

- Hold / no workflow page.
- GenForms may describe generic Webhook and supported Incoming Webhook notification delivery only.
- Do not imply workflow orchestration, conditional workflow building, native email automation or task creation.

### 8. Public Form Link / Shareable Form

The repaired screenshots split between platform help content and broad form-builder discovery. Google, Microsoft, Canva, Tally, Zoho and Jotform dominate. Public links are a real GenForms capability but not a differentiated standalone Topic.

Decision:

- Merge into product education, onboarding/help and existing QR/share assets.
- Do not create a standalone SEO page.
- Reconsider only if GSC later exposes a narrower query with a clear owning asset.

### 9. Portfolio Submission Form

The SERP mixes form-template intent with admissions portfolio guidance. The exact `portfolio submission form template` query already shows GenForms' existing Solution on page one.

Existing owners:

- `/templates/portfolio-submission`
- `/solutions/portfolio-submission-form-template`

Decision:

- Existing asset / Observe / Golden Tuning candidate.
- Do not create another URL.
- Confirm the query-to-page relationship in GSC before changing the existing asset.

### 10. Form Submissions to WeCom

The most product-relevant query shows `/use-cases/feishu-dingtalk-form-notifications` as the first visible organic result. The webhook-specific query is technical documentation; the WeChat Work notification query is noisy and mostly off-intent.

Decision:

- Existing asset / Merge / Observe.
- Do not create a dedicated WeCom landing page.
- Keep the capability wording bounded to WeCom Incoming Webhook/group-bot delivery.

### 11. Mobile-Friendly Form Builder

The SERP expects responsive drag-and-drop builders and often native mobile apps, offline operation, field workflows, e-signatures or deep customization. GenForms supports mobile-friendly public filling, links and QR, but not the broader suite.

Decision:

- Reject standalone Topic.
- Keep mobile-friendly as supporting copy on task-specific pages.
- Do not compete with a generic mobile form-builder page.

## Blocked topics

The remaining 7 topic files remain blocked by CAPTCHA. They are not evidence-complete and cannot drive Build/Architect decisions.

The Loop may request another manual capture batch later, but only for specific topics that become decision-blocking. Do not ask WorkBuddy/Gemini to repair all 13 at once unless a new capacity plan is approved.

## Next Loop action

1. Use `seo_topic_loop_cursor_2026-06-30.md` as the active Topic Loop cursor.
2. Keep Active Build at zero until a topic clears product truth, freeze-window, and existing-asset ownership checks.
3. The third 3-topic evidence batch is closed with no Build target.
4. Do not select another Topic until `seo_topic_loop_cursor_2026-06-30.md` explicitly opens the next batch.
