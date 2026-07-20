# GenForms.ai SEO / Growth Readout

> Date: 2026-06-29
> Decision: are the recent SEO Topic and page changes moving in the right direction?

## 1. Today's Judgment

**Directionally yes, but not yet conversion-proven.**

Google is testing GenForms against the intended Contact Form, Typeform Alternative, Lead Capture, Webhook, Waitlist, Course and Feedback themes. Search visibility and recent average position improved, and the Webhook content produced one attributable Google click with a long reading session. However, most target pages remain outside the top 20, clicks are still sparse, and the activation dataset cannot yet isolate organic visitors reliably.

The correct operating response is:

- keep recently shipped Topic assets frozen;
- restore the Google data credential before the next decision cycle;
- improve attribution/data hygiene before judging SEO-to-create conversion;
- continue Topic Research and relevant backlink work in parallel.

## 2. Data Quality And Freshness

| Source | Latest usable data | Status | Decision impact |
|---|---|---|---|
| GSC | through 2026-06-26 | Usable historical snapshot; normal two-day lag | Does not include most 2026-06-27/28 deployments |
| GA4 | through 2026-06-27 | Usable, but includes Admin/internal and non-organic traffic | Cannot treat total sessions as SEO traffic |
| Growth Events | through current database records | Useful for session evidence, but `google.com` is not normalized to `google`; development events are stored with `is_dev=true` | Organic activation attribution is incomplete |
| Clarity | 2026-06-27 | 21 sessions recorded; rage-click and script-error totals both also equal 21 because the current aggregation uses session counts | Sessions can be supporting context; error/rage totals are excluded from decisions |
| PageSpeed | 2026-06-29 | Fresh | Lab evidence, not field conversion evidence |

Manual production refresh on 2026-06-29 attempted to collect GSC 2026-06-27 and GA4 2026-06-28. All six Google jobs failed with `invalid_grant`: the OAuth refresh token is expired or revoked.

The token was renewed approximately seven days ago. This timing is consistent with an external OAuth consent screen left in `Testing`, where refresh tokens commonly expire after seven days. This is a likely cause, not yet confirmed from the Cloud Console state. See Google's [OAuth refresh token expiration guidance](https://developers.google.com/identity/protocols/oauth2#expiration).

## 3. Search Evidence

### Portfolio-level movement

| Metric | Earlier baseline | Latest usable | Movement |
|---|---:|---:|---:|
| GSC 7d impressions | 415 on 2026-06-21 | 654 on 2026-06-26 | +57.6% |
| GSC 7d clicks | 2 | 1 | Too sparse for trend judgment |
| GSC 7d average position | 51.21 | 46.13 | Improved by 5.08 positions |
| GSC 28d impressions | 1,667 on 2026-06-21 | 2,321 on 2026-06-26 | +39.2% |
| GSC 28d clicks | 4 | 5 | +1 click |
| GSC 28d CTR | 0.24% | 0.22% | Essentially flat at low volume |
| GSC 28d average position | 46.55 | 46.43 | Flat |

Interpretation:

- Exposure breadth is expanding and the recent seven-day ranking mix is improving.
- Google has not yet promoted the site broadly into click-producing positions.
- This is an early authority/ranking problem, not evidence that the Topic strategy is wrong.

### Strongest positive signals

| Signal | Evidence | Interpretation |
|---|---|---|
| Webhook tutorial earned a click | `/posts/form-builder-with-webhook`: 7d 4 impressions, 1 click, position 6.75 | Small sample, but the intended technical Topic can rank and attract a click |
| Search visitor read the Webhook tutorial | First Google session stayed about 98 seconds before leaving | The click was not an immediate mismatch |
| Contact Form is receiving meaningful tests | Pillar: 7d 96 impressions, position 49.7; query `contact form builder`: 24 impressions, position 45.8 | Google understands the Topic, but authority/content competition still limits rank |
| Typeform intent is recognized | Alternatives Post: 7d 72 impressions, position 65.1 versus 28d position 73.7 | Recent position mix improved, but it remains an authority-heavy cluster |
| Lead Capture has a near-opportunity query | `lead form ai`: 13 impressions, position 18.9 | Candidate for later Golden Tuning after the current freeze and URL ownership check |

### Risks and watch items

- Feishu/DingTalk Post has 46 impressions at average position 23.2 in the latest 7d but no click. Specific documentation-style queries still rank around 9-10, so intent may be narrower than the page's product CTA.
- Waitlist Use Case and Post show weaker recent average positions than their 28d averages. Keep frozen until 2026-07-11 and distinguish ranking loss from query-mix changes before editing.
- Course, Community, Quote, Demo and the newest Event/Feedback changes do not yet have a valid post-deployment GSC window. No conclusion should be drawn from their current zeros or tiny samples.

## 4. Activation Evidence

Latest usable GA4 7d snapshot:

- 187 sessions.
- 3 demo starts and 3 demo completes.
- 2 template-use clicks.
- 1 form generation.
- 0 form publishes and 0 form submits.

These totals are not an organic funnel: top landing pages include Admin traffic, duplicate homepage rows and unknown/not-set entries. Growth Events also show BetaList/direct traffic and development QA events. Therefore, the only defensible SEO activation statement is:

> We have evidence of several Google visits and one high-quality Webhook reading session, but no reliable evidence yet that organic visitors reached form generation or publication.

This is a measurement and sample-size limitation, not proof of a product conversion failure.

## 5. Performance Guardrail

Fresh PageSpeed lab results:

| Page | Mobile performance | Mobile LCP | SEO score |
|---|---:|---:|---:|
| Homepage | 84-91 | 3.3-3.8s | 100 |
| Templates | 68 | 5.7s | 100 |
| Typeform Alternatives | 90 | 3.6s | 100 |
| `/forms/new` | 64 | 6.5s | 58 |

`/forms/new` is intentionally not an SEO landing page, so its SEO score is not the issue. Its mobile LCP and the Templates mobile LCP are conversion guardrails: once organic traffic begins clicking CTAs, these pages may slow activation. Treat this as a product-performance candidate, not a reason to rewrite SEO pages.

## 6. Actions

1. **Mike - P0 data access:** move the Google OAuth consent screen to `In production` if it is still in Testing, generate a new refresh token, and replace the local secret file. Do not send the token in chat.
2. **Codex - after token renewal:** update local and production credentials, rerun GSC/GA4 for the failed dates, verify 1d/7d/28d rows, then run an organic-only landing/funnel report.
3. **Codex - data hygiene Goal:** normalize `google.com` to `google`, exclude `is_dev` and Admin activity from stakeholder growth summaries, and preserve Topic `source/intent` attribution.
4. **SEO operating decision:** do not change frozen Topic pages from this readout. Continue Batch 3 research and relevant backlink work while waiting for post-deployment data.
5. **Product guardrail:** prepare a focused mobile performance diagnosis for Templates and `/forms/new`; do not begin a broad redesign from lab data alone.

## 7. Confidence

- Search-direction judgment: **medium confidence**.
- Page-level ranking judgment: **low to medium confidence**, because samples are small.
- Organic activation judgment: **low confidence** until OAuth and attribution are repaired.
