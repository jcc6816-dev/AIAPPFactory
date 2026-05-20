import { afterEach, describe, expect, it, vi } from "vitest";

import { FormRecord, FormSubmissionRecord, WebhookLogRecord } from "@/types/form";
import { WorkflowRunRecord } from "@/types/workflow";
import { retryWebhookLog } from "./webhook-log";

const mocks = vi.hoisted(() => ({
  getWebhookLogByUuid: vi.fn(),
  getFormSubmissionByUuid: vi.fn(),
  findWorkflowRunByUuid: vi.fn(),
  runMockWebhookSkill: vi.fn(),
}));

vi.mock("@/models/webhook-log", () => ({
  getWebhookLogByUuid: mocks.getWebhookLogByUuid,
  getWebhookLogsByFormUuid: vi.fn(),
  insertWebhookLog: vi.fn(),
  updateWebhookLogByUuid: vi.fn(),
}));

vi.mock("@/models/form-submission", () => ({
  getFormSubmissionByUuid: mocks.getFormSubmissionByUuid,
}));

vi.mock("@/models/workflow", () => ({
  findWorkflowRunByUuid: mocks.findWorkflowRunByUuid,
}));

vi.mock("./skills/webhook", () => ({
  runMockWebhookSkill: mocks.runMockWebhookSkill,
}));

const form: FormRecord = {
  uuid: "form_1",
  user_uuid: "user_1",
  title: "Webhook Retry Form",
  description: "",
  theme: "minimal",
  schema_json: { fields: [] },
  status: "draft",
  share_code: "share_1",
  webhook_enabled: true,
  webhook_url: "https://example.com/webhook",
};

const log: WebhookLogRecord = {
  uuid: "wh_1",
  form_uuid: "form_1",
  submission_uuid: "sub_1",
  workflow_run_uuid: "run_1",
  target_url: "https://example.com/webhook",
  request_body_json: {},
  response_status: 500,
  response_body: "error",
  attempt_count: 3,
  status: "failed",
};

const submission: FormSubmissionRecord = {
  uuid: "sub_1",
  form_uuid: "form_1",
  form_title: "Webhook Retry Form",
  form_share_code: "share_1",
  answers_json: {},
  files_json: [],
  status: "completed",
};

const workflowRun: WorkflowRunRecord = {
  uuid: "run_1",
  form_uuid: "form_1",
  form_submission_uuid: "sub_1",
  status: "completed",
  steps_json: [],
};

describe("retryWebhookLog", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it("replays a failed webhook log through the webhook skill", async () => {
    mocks.getWebhookLogByUuid.mockResolvedValue(log);
    mocks.getFormSubmissionByUuid.mockResolvedValue(submission);
    mocks.findWorkflowRunByUuid.mockResolvedValue(workflowRun);
    mocks.runMockWebhookSkill.mockResolvedValue({
      code: "webhook",
      title: "Webhook Push",
      status: "completed",
      detail: "delivered",
    });

    const result = await retryWebhookLog(form, log.uuid);

    expect(result.status).toBe("completed");
    expect(mocks.runMockWebhookSkill).toHaveBeenCalledWith(
      form,
      submission,
      workflowRun
    );
  });

  it("rejects logs that do not belong to the form", async () => {
    mocks.getWebhookLogByUuid.mockResolvedValue({
      ...log,
      form_uuid: "other_form",
    });

    await expect(retryWebhookLog(form, log.uuid)).rejects.toThrow(
      "webhook log not found"
    );
    expect(mocks.runMockWebhookSkill).not.toHaveBeenCalled();
  });

  it("only allows failed logs to be retried", async () => {
    mocks.getWebhookLogByUuid.mockResolvedValue({
      ...log,
      status: "completed",
    });

    await expect(retryWebhookLog(form, log.uuid)).rejects.toThrow(
      "only failed webhook logs can be retried"
    );
    expect(mocks.runMockWebhookSkill).not.toHaveBeenCalled();
  });
});
