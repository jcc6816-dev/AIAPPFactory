# AI FormFactory MVP Release Checklist

## Scope

This checklist covers the current MVP only: AI form generation, template-based creation, publishing, public collection, submissions, Webhook delivery logs, basic plan limits, and SEO-ready template pages.

For the customer-facing demo story and launch packaging narrative, use `docs/MVP_LAUNCH_PLAYBOOK.md`.

## Release Gate

- [ ] Homepage prompt maps the intended scenario to the correct creation context (for example, event signup → event-registration).
- [ ] Homepage and template gallery clearly lead users to create a form.
- [ ] Template detail pages render independently and expose a working high-fidelity preview.
- [ ] `Use This Template` carries current preview preferences into `/forms/new`.
- [ ] A visitor can inspect `/forms/new` as a guest; saving or publishing requires login and resumes the expressed intent after login.
- [ ] AI/template creation can save drafts and publish forms.
- [ ] Publish readiness catches missing title, empty fields, invalid choice options, and enabled Webhook without URL.
- [ ] Published public form links accept submissions.
- [ ] Submission data appears in the data workspace.
- [ ] Webhook delivery logs appear after submission, including mock logs when no target URL is configured.
- [ ] Free users are blocked by the configured form-count limit on the backend.
- [ ] Paid users are not blocked by the free form-count limit.
- [ ] Candidate UI flow passes: homepage → login fixture → generate → publish → TEST submission → result panel.
- [ ] Visual V1–V6 evidence is attached for English/Chinese and Phone/Desktop creation previews.

## Verification Commands

Run these from `Code/`:

```bash
# Candidate/local only. It owns a localhost server and may create dev TEST data.
pnpm test:quality-gates

# Required for a controlled release; the UI gates run before the production build.
bash scripts/release-preflight.sh
```

Avoid running `npm run build` while the same `.next` directory is being served by `next dev`; restart the dev server after a build.

## Manual Smoke Test

1. From the homepage, enter the event-signup prompt and confirm it opens the event-registration creation context.
2. Repeat through `/templates/event-registration`; both entries must use the same creation canvas.
3. Generate or review the draft in `/forms/new`, then verify Phone and Desktop previews at the approved V1–V6 viewports.
4. Publish and confirm the public link plus QR code are visible and usable.
5. Start the free test, complete every field, and confirm the TEST result appears in the result panel.
6. Submit one public response and confirm it appears in Data; verify the intended Webhook delivery/log behavior separately.

## Known MVP Boundaries

- No workflow builder or Skill marketplace.
- No visual drag-and-drop editor.
- No multi-tenant administration.
- Webhook test and retry are intentionally lightweight.
- No OCR, workflow builder, or Skill marketplace is part of this MVP release.
