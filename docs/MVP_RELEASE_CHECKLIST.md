# AI FormFactory MVP Release Checklist

## Scope

This checklist covers the current MVP only: AI form generation, template-based creation, publishing, public collection, submissions, Webhook delivery logs, basic plan limits, and SEO-ready template pages.

For the customer-facing demo story and launch packaging narrative, use `docs/MVP_LAUNCH_PLAYBOOK.md`.

## Release Gate

- [ ] Homepage and template gallery clearly lead users to create a form.
- [ ] Template detail pages render independently and expose a working high-fidelity preview.
- [ ] `Use This Template` carries current preview preferences into `/forms/new`.
- [ ] Auth-protected workspace pages redirect anonymous users to sign in.
- [ ] AI/template creation can save drafts and publish forms.
- [ ] Publish readiness catches missing title, empty fields, invalid choice options, and enabled Webhook without URL.
- [ ] Published public form links accept submissions.
- [ ] Submission data appears in the data workspace.
- [ ] Webhook delivery logs appear after submission, including mock logs when no target URL is configured.
- [ ] Free users are blocked by the configured form-count limit on the backend.
- [ ] Paid users are not blocked by the free form-count limit.

## Verification Commands

Run these from `Code/`:

```bash
npm test
PLAYWRIGHT_SKIP_WEBSERVER=1 PLAYWRIGHT_PORT=3010 npx playwright test --reporter=line
npm run build
```

Avoid running `npm run build` while the same `.next` directory is being served by `next dev`; restart the dev server after a build.

## Manual Smoke Test

1. Open `/templates/lead-capture`.
2. Change device, flow, theme, direction, and visual effect.
3. Click `Use This Template`.
4. Generate or review the draft in `/forms/new`.
5. Save as draft, then publish.
6. Copy the public link or open the public page.
7. Submit one response.
8. Confirm the response appears in Data.
9. Confirm Webhook Logs show a delivery row.

## Known MVP Boundaries

- No workflow builder or Skill marketplace.
- No visual drag-and-drop editor.
- No multi-tenant administration.
- Webhook test and retry are intentionally lightweight.
- OCR remains a basic MVP integration point, not a full document processing suite.
