# GenForms First Success Loop UX Audit

Date: 2026-07-01

## Scope

Reviewed the current path from a scenario/template entry into `/forms/new`, then checked the implemented publish, test submission, and submissions code paths. No product code or prototype was created.

Target loop:

`scenario/template -> generate -> publish -> test submission -> first result`

## Evidence

- `01-template-entry-desktop.png`: customer service request template entry.
- `02-forms-new-desktop.png`: initial `/forms/new` state before template application completed.
- `03-forms-new-mobile.png`: 390 x 844 inherited-template state.
- `04-forms-new-inherited-desktop.png`: 1440 x 1000 inherited-template state.
- Authenticated `/forms`, publish, and submissions pages could not be captured because the local route entered a redirect loop. Those states were assessed from current source code.

## Strengths

- The template context eventually becomes visible and the generated preview uses real customer-service-request fields.
- The workspace already exposes Preview and Publish and distinguishes phone/desktop and step/long form modes.
- The publish page already has public-link, QR, test, and submissions destinations, so the main UX work is prioritization and state orchestration rather than a new product surface.

## Primary Findings

1. Context inheritance is delayed and ambiguous. The initial state says `new form scenario` and shows a generic demo before switching to the selected template. The persistent header later names the scenario, but does not explain source, intent, or recommended fields.
2. The generated workspace has many equal-weight controls and no state-aware next-step rail. Preview, schema, device, layout, theme, visual direction, effects, demo mode, save, and publish compete for attention.
3. The current test concepts conflict. Demo mode does not persist; opening the public form creates a normal submission, charges credits, and can run downstream actions. Neither behavior matches a free, persisted, side-effect-suppressed test.
4. Publish success is not success-first. Artifact/readiness content precedes the test and sharing tasks; public link and QR appear after the test card, and WhatsApp sharing is absent.
5. Empty submissions only explains that no records exist. It does not provide the action needed to create the first result.
6. Mobile has horizontal overflow and clipping in the top context, action buttons, and preview-control row. The user sees many controls before a single recommended next action.
7. Internationalization is not structurally ready. Runtime locales are only `en` and `zh`, the font setup loads the Latin subset of Inter, and fixed-width controls will not tolerate Spanish, Japanese, or Traditional Chinese copy expansion.

## Accessibility Risks

- Horizontal scrolling hides controls and weakens predictable keyboard/focus order on mobile.
- Small, low-contrast secondary labels and icon-heavy controls need accessible names and 44 px touch targets.
- Status changes such as template inherited, generated, published, test stored, and external notifications suppressed need persistent text plus `aria-live`, not toast-only confirmation.
- The Action Rail must preserve logical DOM order and visible focus when it becomes sticky or collapses into a mobile bottom bar.

## Must-Fix Prototype Requirements

- Add a persistent context banner with template name, scenario intent, source, recommended fields, and Change/Clear actions.
- Add a state-aware Action Rail. Draft: Preview and Publish. Published/no test: Send free test as primary, with Open, Copy link, QR, and WhatsApp. Test complete: View first result as primary.
- Implement a creator-only test submission contract using the real runtime and storage with `is_test=true`, no credits/quota usage, and external email/Webhook/WhatsApp suppressed by default.
- Label test rows and result details as Test, then route directly to the saved result detail after submission.
- Move public link, share actions, and the test CTA to the top of publish success; move readiness, history, integrations, and logs below.
- Replace the empty submissions dead end with Send test submission.
- Use content-sized responsive controls, a collapsible advanced-controls sheet, locale-aware font stacks, and pseudo-localization/200% text-expansion checks.

## Low-Fidelity Flow And Page List

1. Context-loaded `/forms/new`: context banner, prompt/editor, real field preview, primary Generate/Use template action.
2. Generated draft: real preview plus state-aware rail with Preview and Publish; advanced visual controls are secondary.
3. Publish success: success status, public URL, Copy/Open/QR/Share, primary Send free test, then readiness/history below.
4. Test runner: clear Test mode banner explaining free, saved to results, and no external notifications; submit and return to result.
5. First result: Test badge, answers, stored status, and next actions; the preceding empty state uses the same Send test submission CTA.

## Decision

Proceed to low-fidelity UX prototype. Do not proceed directly to implementation until the test-submission contract and the five-state hierarchy are agreed.
