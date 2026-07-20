# Slack Incoming Webhook Product Gate

> Date: 2026-06-29
> Owner: Product / Engineering
> SEO dependency: `seo_goal_slack_incoming_webhook_validate.md`

## Current Decision

`Pass`. The implementation now closes encryption, redaction, 429, timeout, fixed Test Send, event tracking and public naming gaps. Production schema migration is complete, the controlled Slack fixed Test Send passed on 2026-06-30, and the deployed real-form-submission E2E passed on 2026-06-30. See `slack_incoming_webhook_gate_report_2026-06-29.md`.

## Required Product Checks

1. Send a real GenForms submission to a controlled Slack workspace through an Incoming Webhook.
2. Verify success plus invalid URL, revoked URL, 400/403/404, 429, 5xx and network-timeout behavior.
3. Implement or document `Retry-After` behavior for 429 responses.
4. Add an explicit request timeout and final failure state.
5. Decide how the Slack Incoming Webhook URL is encrypted at rest and redacted from delivery logs, errors and UI responses.
6. Add a safe test-send action or provide a verified submission-based test path.
7. Add events for provider selection, test send, delivery success, delivery failure and manual retry.
8. Replace user-facing `Slack Bot` wording with `Slack Incoming Webhook` wherever the current label could imply OAuth or a native App.

## Release Gate

SEO may only open Architect after Product returns:

- the E2E test date and result;
- screenshots or logs with the secret URL redacted;
- the exact supported error/retry behavior;
- confirmation of the final public product name;
- a list of remaining limitations that must appear in FAQ and CTA copy.

SERP ownership is now decided as `Merge into existing Webhook Topic / Post-only`. A dedicated Slack landing page is rejected. A narrow technical Post may enter Architect if it states that GenForms supports Slack Incoming Webhook notifications, not Slack OAuth, channel discovery, interactive messages, approvals, or Block Kit customization.
