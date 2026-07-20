# Customer Feedback Form Builder UX Review

Date: 2026-06-27
Surface: `http://localhost:3100/zh/use-cases/customer-feedback-form-builder`
Mode: UX and responsive accessibility risk review

## Audit scope

Review the SEO entry page as a path from search intent to immediate form creation. The check covers the desktop hero, mobile hero, recommended fields section, and the handoff into `/zh/forms/new`.

## User goal

A product, service, retail, or delivery team wants to create a short customer feedback form, share it by link or QR code, collect responses, and route useful feedback into follow-up work.

## Step review

1. Desktop entry and hero - Healthy
   - Screenshot: `01-desktop-hero.png`
   - The H1, task summary, primary CTA, and customer-feedback preview agree with one another.
   - The primary CTA is visually dominant and appears before supporting detail.
   - The preview communicates rating plus open feedback quickly.

2. Mobile entry and hero - Mostly healthy
   - Screenshot: `03-mobile-hero.png`
   - CTA hierarchy remains clear and there is no horizontal overflow at 390 px.
   - The H1 leaves the final Chinese character on its own line, weakening first-screen polish.
   - Both CTAs meet a comfortable touch height, but the hero becomes tall before the first supporting content appears.

3. Recommended fields - Healthy, with expectation risk
   - Screenshots: `04-mobile-fields.png`, `05-desktop-fields.png`
   - The nine fields are relevant to lightweight customer feedback and the order is understandable.
   - The page correctly limits the promise around NPS benchmarks and advanced CX analytics.
   - The create handoff currently starts from a five-field `satisfaction-survey` template, so the landing page's nine-field list can read as a stronger default than the user actually receives.

4. CTA handoff into the builder - Healthy
   - Screenshot: `06-create-handoff.png`
   - The URL preserves `template=satisfaction-survey`, `source=usecase_customer-feedback-form-builder`, `intent=customer_feedback`, and the full task prompt.
   - The builder loads the customer satisfaction survey draft and keeps the customer-feedback prompt available for refinement.
   - This is a credible continuation of the landing page rather than a generic blank form.

## Strengths

- Search intent, H1, preview, CTA, and builder template are aligned.
- The page stays within current product capabilities: AI generation, public links, QR sharing, mobile single-question flow, response dashboard, CSV export, and Webhook-ready follow-up.
- Product boundaries around professional NPS benchmarking and advanced CX analytics are explicit.
- Responsive layout has no observed horizontal overflow at 390 px.

## Conversion risks

1. Public copy exposes internal SEO/page-planning language.
   - Examples include `用户搜的不是产品名，而是具体问题`, `让用户一眼确认这就是他要找的工作流`, `不是静态营销页，是可进入产品的场景入口`, and `围绕这个搜索意图的关键问题`.
   - This makes the page feel like an internal brief rather than a customer-facing solution and is the largest trust issue.

2. The preview's `提交反馈` control looks active but produces no visible result.
   - This is a false affordance. Either make the preview non-interactive, give the control a clear preview treatment, or route it to the real template/create path.

3. The mobile H1 has an orphan final character.
   - Use a deliberate mobile line break or balanced wrapping so `表单生成器` stays together.

4. The recommended-field promise is broader than the initial template.
   - Clarify that the nine items are recommended additions, or ensure the prompt is automatically applied so the generated draft includes the promised structure.

## Accessibility risks

- The star rating in the hero preview is presented as generic visual characters rather than an explained interactive or decorative group. If decorative, hide it from assistive technology; if interactive, give each rating an accessible label and state.
- The no-op `提交反馈` button remains keyboard-focusable despite having no observable outcome.
- Screenshot review cannot confirm keyboard focus visibility, semantic heading behavior under screen readers, contrast ratios, or zoom behavior above 100%; these require implementation-level testing.

## Recommendation and release call

Direction: Agree.

Release call: Conditional go. Fix the internal-facing copy and the no-op preview button before production. The mobile title wrap is a small but worthwhile pre-release fix. Other layout and content-density changes can wait for real traffic data.
