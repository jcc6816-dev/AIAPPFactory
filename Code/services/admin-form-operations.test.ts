import { describe, expect, it } from "vitest";

import { buildAdminFormOperationSummary } from "./admin-form-operations";
import { FormRecord, FormSubmissionRecord, WebhookLogRecord } from "@/types/form";

const forms = [
  {
    uuid: "form_1",
    user_uuid: "user_1",
    title: "Lead Form",
    theme: "business",
    status: "published",
    share_code: "share_1",
    schema_json: { fields: [] },
    created_at: "2026-05-01T00:00:00.000Z",
  },
  {
    uuid: "form_2",
    user_uuid: "user_1",
    title: "Draft Form",
    theme: "minimal",
    status: "draft",
    share_code: "share_2",
    schema_json: { fields: [] },
    created_at: "2026-05-02T00:00:00.000Z",
  },
] as FormRecord[];

describe("admin form operations", () => {
  it("builds global form operation counts and rows", () => {
    const summary = buildAdminFormOperationSummary(
      forms,
      [
        {
          uuid: "sub_1",
          form_uuid: "form_1",
          form_title: "Lead Form",
          form_share_code: "share_1",
          answers_json: {},
          files_json: [],
          status: "submitted",
          created_at: "2026-05-03T00:00:00.000Z",
        },
      ] as FormSubmissionRecord[],
      [
        {
          uuid: "log_1",
          form_uuid: "form_1",
          submission_uuid: "sub_1",
          target_url: "https://example.com",
          request_body_json: {},
          response_status: 500,
          attempt_count: 1,
          status: "failed",
          error_message: "failed",
        },
      ] as WebhookLogRecord[],
      [{ uuid: "user_1", email: "founder@example.com" }]
    );

    expect(summary.totals).toMatchObject({
      forms: 2,
      published: 1,
      drafts: 1,
      submissions: 1,
      webhookFailures: 1,
    });
    expect(summary.rows[0]).toMatchObject({
      ownerEmail: "founder@example.com",
      submissions: 1,
      webhookFailures: 1,
    });
  });
});
