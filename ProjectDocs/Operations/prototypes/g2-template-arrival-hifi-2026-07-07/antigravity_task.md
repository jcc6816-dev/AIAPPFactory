# Antigravity Task: G2 `/forms/new?template=...` Template Arrival High-Fidelity Prototype

## Role

You are a UX/UI prototyping agent. Produce high-fidelity static prototypes for GenForms.ai. Do not modify production code.

## Hard boundaries

- Do not edit anything under `/Users/mike/Documents/AIFactory/Code`.
- Do not edit existing docs outside this output directory.
- Only write files under:
  `/Users/mike/Documents/AIFactory/ProjectDocs/Operations/prototypes/g2-template-arrival-hifi-2026-07-07`
- Produce static prototype source, not production React code.
- Do not introduce new product features outside this task.
- Do not show Workflow, Webhook setup, QR code, WhatsApp, test submission, CSV, Data/Analytics, or advanced editor controls in the first screen.
- Do not invent a new brand. Use GenForms.ai.

## Context

G2 Activation Diagnosis found the strongest conversion breakpoint at:

`/forms/new?template=...` template arrival state -> first creation action.

Evidence:

- A Google.hk user reached `/zh/forms/new?template=event-registration`.
- `forms_new_view`, `template_context_loaded`, and `workspace_preview_ready` fired.
- User stayed around 5 minutes but did not create a form.
- Another lead-capture template arrival session previewed and left in around 3.6 seconds.
- Template carrying works; the weak point is that users do not immediately understand what to do next.

UX owner conclusion:

- The breakpoint belongs to the Context-loaded state, not the Generated Draft publish rail.
- The first screen should present a clear template-arrival state and exactly one primary CTA.
- Primary CTA:
  - zh: `使用此模板创建表单`
  - en: `Create this form`
- Secondary action should be low-pressure:
  - zh: `预览字段`
  - en: `Preview fields`
- Login expectation:
  - zh: `需要登录后保存和发布；登录后会回到当前表单。`
  - en: `Sign in is required to save and publish. We’ll bring you back to this form after sign-in.`
- Mobile must show the primary CTA without scrolling.

## Product target

Prototype only this page/state:

- URL/state: `/forms/new?template=event-registration`
- State name: Template Arrival / Context-loaded
- User is not signed in.
- The template has loaded and preview is ready.
- The user has not created a form yet.

User should understand within 3 seconds:

1. This is not a blank form builder.
2. An Event Registration form has already been prepared from a template.
3. They can create it as their own form with one click.
4. Sign-in is required only to save/publish, and the current template will be preserved after sign-in.
5. After creation, they can later publish a link/QR and receive submissions, but do not over-emphasize post-publish features on this first screen.

## Deliverables

Create:

1. `source/index.html`
2. `source/styles.css`
3. `source/app.js` if useful
4. `source/capture.js` for screenshots using local Chrome if possible
5. `README.md` explaining the design
6. PNG screenshots:
   - `screenshots/zh-desktop-1440x900.png`
   - `screenshots/en-desktop-1440x900.png`
   - `screenshots/zh-mobile-390x844.png`
   - `screenshots/en-mobile-390x844.png`

If screenshot automation is blocked, still produce the source and explain the exact command needed.

## Visual requirements

Use a polished SaaS product UI, close enough to production implementation:

- Clean white/slate workspace.
- GenForms.ai brand in header.
- Clear hierarchy.
- No concept-art hallucination.
- No unrelated brand names.
- No generic dashboard clutter.
- No over-designed illustration that distracts from the CTA.

### Desktop layout

Must include:

- Compact top nav/header.
- Main template arrival card above the fold.
- Title:
  - zh: `你的活动报名表已经准备好`
  - en: `Your event registration form is ready`
- Supporting text:
  - zh: `可以先使用此模板创建表单，之后再调整字段、主题和发布设置。`
  - en: `Create it first, then adjust fields, theme, and publishing settings.`
- Primary CTA:
  - zh: `使用此模板创建表单`
  - en: `Create this form`
- Secondary action:
  - zh: `预览字段`
  - en: `Preview fields`
- Login note:
  - zh: `需要登录后保存和发布；登录后会回到当前表单。`
  - en: `Sign in is required to save and publish. We’ll bring you back to this form after sign-in.`
- A compact template evidence block with 4-5 fields:
  - Name
  - Email
  - Session / Event slot
  - Number of attendees
  - Notes
- A preview pane that makes the template feel real but not like a complex editor.
- A right-side first action rail or equivalent, but do not duplicate competing primary CTAs in confusing ways.

### Mobile layout

Must include:

- 390x844 viewport design.
- The template name and 3-4 field chips visible without scrolling.
- Sticky bottom CTA visible without scrolling:
  - zh: `使用此模板创建表单`
  - en: `Create this form`
- Login note must be short enough not to push the CTA below the fold.
- Phone preview must not dominate the first screen.
- No horizontal overflow.

## Variants

Produce exactly two language variants:

- zh
- en

Do not produce Spanish, Japanese, or other languages.

## Acceptance checklist

Before finishing, verify and mention in README:

- Desktop CTA is visible above fold.
- Mobile CTA is visible without scrolling.
- The first screen does not use `Publish` as the main action.
- The first screen does not expose Workflow/Webhook/QR/test submission.
- The user can tell this is Event Registration, not a blank editor.
- zh and en variants have no mixed-language residue.

## Important

This is a design prototype for Mike to judge direction. Do not try to implement React code. Do not change production files.
