# GenForms First Success Loop Low-Fidelity UX Prototype

Date: 2026-07-01

## Scope

This prototype covers exactly five states:

1. Context-loaded `/forms/new`
2. Generated Draft
3. Publish Success
4. Test Runner
5. First Result

It does not redesign the site, add Workflow, add a WhatsApp Bot, add Smart PDF, or expand the form editor.

## Flow

`Context loaded -> Generate -> Generated draft -> Publish -> Publish success -> Send free test -> Test runner -> Submit test -> First result`

Alternate entry from an empty submissions panel:

`Empty submissions -> Send test submission -> Test runner -> First result`

## State 1: Context-loaded `/forms/new`

### Desktop

- Persistent Context Banner across the top of the workspace.
- Banner contains template name, scenario intent, entry source, recommended fields, and Change/Clear actions.
- Main area uses a two-column layout: prompt/editor on the left and a real field preview on the right.
- Advanced visual settings remain collapsed.
- Primary CTA: **Generate this form**.

### Mobile

- Context Banner becomes a compact summary with a Details disclosure.
- Real field preview appears before advanced settings.
- Primary CTA is a sticky bottom action.
- Primary CTA: **Generate this form**.

## State 2: Generated Draft

### Desktop

- Context Banner remains visible.
- Form preview is the visual center.
- Action Rail shows state `Draft ready` and makes Publish the only primary action.
- Preview, Save draft, Edit fields, and Advanced settings are secondary.
- Primary CTA: **Publish form**.

### Mobile

- Preview is shown first.
- Secondary actions move into a More sheet.
- Sticky bottom action remains visible without covering content.
- Primary CTA: **Publish form**.

## State 3: Publish Success

### Desktop

- Success status and public URL appear first.
- Share actions are grouped with the URL: Copy, Open, QR, WhatsApp.
- WhatsApp means public-link sharing only.
- Action Rail marks Publish complete and highlights the next task.
- Readiness, Artifact history, integrations, and delivery logs sit below the first viewport.
- Primary CTA: **Send free test**.

### Mobile

- Public URL is readable and copyable without horizontal scrolling.
- A Share action uses the Web Share API when available; QR and WhatsApp remain explicit secondary actions.
- Primary CTA: **Send free test**.

## State 4: Test Runner

### Desktop

- A persistent Test mode banner states three guarantees: free, saved to results, no external notifications.
- The real public-form runtime and fields are used.
- Email, Webhook, WhatsApp, paid AI Skill, OCR, and other external automation do not run.
- Primary CTA: **Submit test response**.

### Mobile

- Test mode guarantee remains visible while scrolling.
- Fields use a single-column layout and 44 px minimum tap targets.
- Primary CTA: **Submit test response**.

## State 5: First Result

### Desktop

- The creator lands directly on the saved result detail.
- A visible Test badge appears beside the submission status.
- Answers and saved status are highlighted.
- The next activation task is sharing the public form.
- Primary CTA: **Share public form**.

### Mobile

- Test badge, saved confirmation, and key answers appear before metadata.
- Share uses the platform share sheet when available.
- Primary CTA: **Share public form**.

### Empty Submissions Variant

- Empty state explains that no responses exist yet.
- It does not show analytics, logs, or configuration as the first action.
- Primary CTA: **Send test submission**.

## State-Driven Action Rail

| State | Completed | Current | Primary CTA | Secondary actions |
| --- | --- | --- | --- | --- |
| Context loaded | Template inherited | Generate | Generate this form | Change template, Clear context |
| Generated Draft | Generate | Publish | Publish form | Preview, Save draft, Edit fields |
| Publish Success | Generate, Publish | Test | Send free test | Copy, Open, QR, WhatsApp |
| Test Runner | Generate, Publish | Submit test | Submit test response | Exit test |
| First Result | Generate, Publish, Test | Share | Share public form | Copy link, Open form, View all results |

## Locale And Text Expansion

- Use a locale-aware UI stack: Latin scripts use Inter; Simplified Chinese, Traditional Chinese, and Japanese use system CJK sans-serif fallbacks.
- Buttons and segmented controls use content-sized min/max widths, not fixed widths.
- Labels wrap before shrinking; no negative letter spacing.
- Mobile action labels allow two lines where necessary while keeping a 44 px minimum target.
- Prototype QA includes English, Simplified Chinese, Traditional Chinese, Japanese, Spanish, and 200% pseudo-localized strings.
- Language switching preserves the current state and does not discard the prompt, draft, or test answers.

## Must Fix Before Development

1. Agree the creator-only `is_test=true` runtime and persistence contract.
2. Confirm test submissions do not consume Credits or free-plan quota.
3. Confirm all external side effects are suppressed by default.
4. Define the direct redirect to the saved result detail.
5. Define the Action Rail state machine and one-primary-CTA rule.
6. Confirm WhatsApp is link sharing, not integration or notification.
7. Confirm responsive behavior for the Context Banner and mobile bottom action.
8. Add copy-expansion and locale-font acceptance criteria to implementation tickets.

## Development Recommendation

Proceed to development only after the five Founder-led walkthroughs pass without a critical misunderstanding of inherited context, the next action, test cost, saved results, or external notifications.
