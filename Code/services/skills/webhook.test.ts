import { afterEach, describe, expect, it, vi } from "vitest";

import { FormRecord, FormSubmissionRecord } from "@/types/form";
import { WorkflowRunRecord } from "@/types/workflow";
import { encryptSecret } from "@/lib/secure";
import { runMockWebhookSkill } from "./webhook";

const webhookLogMocks = vi.hoisted(() => ({
  createWebhookLogMock: vi.fn(),
  finalizeWebhookLogMock: vi.fn(),
  createMockWebhookLogMock: vi.fn(),
  getFormSubmissionByUuidMock: vi.fn(),
}));

vi.mock("../webhook-log", () => ({
  createWebhookLog: webhookLogMocks.createWebhookLogMock,
  finalizeWebhookLog: webhookLogMocks.finalizeWebhookLogMock,
  createMockWebhookLog: webhookLogMocks.createMockWebhookLogMock,
}));

vi.mock("@/models/form-submission", () => ({
  getFormSubmissionByUuid: webhookLogMocks.getFormSubmissionByUuidMock,
}));

const form: FormRecord = {
  uuid: "form_test",
  user_uuid: "user_test",
  title: "Webhook Test Form",
  description: "A form for webhook tests",
  theme: "minimal",
  schema_json: {
    fields: [],
  },
  status: "draft",
  share_code: "share_test",
  webhook_enabled: true,
  webhook_url: "https://example.com/webhook",
  webhook_secret_encrypted: encryptSecret("secret"),
};

const submission: FormSubmissionRecord = {
  uuid: "sub_test",
  form_uuid: "form_test",
  form_title: "Webhook Test Form",
  form_share_code: "share_test",
  answers_json: {
    email: "demo@example.com",
  },
  files_json: [],
  storage_files_json: [
    {
      field_key: "invoice",
      file_name: "invoice.png",
      file_url: "https://example.com/invoice.png",
      mime_type: "image/png",
      storage_provider: "s3",
    },
  ],
  status: "completed",
  ocr_status: "completed",
  ocr_provider: "baidu",
  ocr_result_json: {
    raw_text: "Invoice 123",
    summary: "Invoice 123, amount 288.5",
    structured_data: {
      document_type: "invoice",
      fields: {
        invoice_no: "INV-123",
      },
    },
  },
  created_at: "2026-05-09T03:38:14.586+00:00",
};

const workflowRun: WorkflowRunRecord = {
  uuid: "run_test",
  form_uuid: "form_test",
  form_submission_uuid: "sub_test",
  status: "processing",
  steps_json: [
    {
      code: "submission_recorded",
      title: "Submission Recorded",
      status: "completed",
      detail: "",
    },
    {
      code: "ocr",
      title: "OCR Skill",
      status: "completed",
      detail: "",
    },
    {
      code: "excel_export",
      title: "Excel Export",
      status: "completed",
      detail: "",
    },
    {
      code: "webhook",
      title: "Webhook Push",
      status: "pending",
      detail: "",
    },
  ],
  created_at: "2026-05-09T03:38:15.302+00:00",
};

describe("webhook skill", () => {
  afterEach(() => {
    vi.restoreAllMocks();
    vi.clearAllMocks();
    webhookLogMocks.createWebhookLogMock.mockResolvedValue({ uuid: "wh_test" });
    webhookLogMocks.finalizeWebhookLogMock.mockResolvedValue(undefined);
    webhookLogMocks.createMockWebhookLogMock.mockResolvedValue({ uuid: "wh_mock" });
    webhookLogMocks.getFormSubmissionByUuidMock.mockResolvedValue(undefined);
  });

  it("delivers a real webhook request and finalizes the log", async () => {
    webhookLogMocks.createWebhookLogMock.mockResolvedValue({ uuid: "wh_success" });
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      text: () => Promise.resolve("accepted"),
    });
    vi.stubGlobal("fetch", fetchMock);

    const result = await runMockWebhookSkill(form, submission, workflowRun);

    expect(result.status).toBe("completed");
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(fetchMock.mock.calls[0][0]).toBe(form.webhook_url);
    expect(fetchMock.mock.calls[0][1]?.headers).toMatchObject({
      "Content-Type": "application/json",
    });
    expect(JSON.parse(fetchMock.mock.calls[0][1]?.body as string)).toMatchObject({
      submission_id: submission.uuid,
      files: expect.any(Array),
      ocr: expect.objectContaining({
        status: "completed",
        provider: "baidu",
      }),
    });
    expect(webhookLogMocks.finalizeWebhookLogMock).toHaveBeenCalledWith(
      "wh_success",
      expect.objectContaining({
        attempt_count: 1,
        response_status: 200,
        status: "completed",
      })
    );
  });

  it("uses the latest submission snapshot when webhook payload is built", async () => {
    webhookLogMocks.createWebhookLogMock.mockResolvedValue({ uuid: "wh_latest" });
    webhookLogMocks.getFormSubmissionByUuidMock.mockResolvedValue({
      ...submission,
      status: "completed",
    });
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      text: () => Promise.resolve("accepted"),
    });
    vi.stubGlobal("fetch", fetchMock);

    await runMockWebhookSkill(form, { ...submission, status: "queued" }, workflowRun);

    expect(JSON.parse(fetchMock.mock.calls[0][1]?.body as string)).toMatchObject({
      submission_status: "completed",
    });
  });

  it("infers a completed payload status when webhook is the last pending step", async () => {
    webhookLogMocks.createWebhookLogMock.mockResolvedValue({ uuid: "wh_inferred" });
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      text: () => Promise.resolve("accepted"),
    });
    vi.stubGlobal("fetch", fetchMock);

    await runMockWebhookSkill(form, { ...submission, status: "queued" }, workflowRun);

    expect(JSON.parse(fetchMock.mock.calls[0][1]?.body as string)).toMatchObject({
      submission_status: "completed",
    });
  });

  it("adds signature header in signature mode", async () => {
    webhookLogMocks.createWebhookLogMock.mockResolvedValue({
      uuid: "wh_signature",
    });
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      text: () => Promise.resolve("accepted"),
    });
    vi.stubGlobal("fetch", fetchMock);

    await runMockWebhookSkill(
      {
        ...form,
        webhook_auth_mode: "signature",
      },
      submission,
      workflowRun
    );

    expect(fetchMock.mock.calls[0][1]?.headers).toHaveProperty(
      "X-AIFactory-Signature"
    );
  });

  it("appends keyword in query mode when configured", async () => {
    webhookLogMocks.createWebhookLogMock.mockResolvedValue({ uuid: "wh_query" });
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      text: () => Promise.resolve("accepted"),
    });
    vi.stubGlobal("fetch", fetchMock);

    await runMockWebhookSkill(
      {
        ...form,
        webhook_auth_mode: "query_keyword",
        webhook_keyword_encrypted: encryptSecret("abc123"),
      },
      submission,
      workflowRun
    );

    expect(fetchMock.mock.calls[0][0]).toContain("keyword=abc123");
  });

  it("sends keyword in header mode when configured", async () => {
    webhookLogMocks.createWebhookLogMock.mockResolvedValue({ uuid: "wh_header" });
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      text: () => Promise.resolve("accepted"),
    });
    vi.stubGlobal("fetch", fetchMock);

    await runMockWebhookSkill(
      {
        ...form,
        webhook_auth_mode: "header_keyword",
        webhook_keyword_encrypted: encryptSecret("abc123"),
        webhook_header_name: "X-Custom-Key",
      },
      submission,
      workflowRun
    );

    expect(fetchMock.mock.calls[0][1]?.headers).toMatchObject({
      "X-Custom-Key": "abc123",
    });
  });

  it("formats Feishu bot payload with keyword in message body", async () => {
    webhookLogMocks.createWebhookLogMock.mockResolvedValue({ uuid: "wh_feishu" });
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      text: () => Promise.resolve("accepted"),
    });
    vi.stubGlobal("fetch", fetchMock);

    await runMockWebhookSkill(
      {
        ...form,
        webhook_provider: "feishu_bot",
        webhook_auth_mode: "keyword",
        webhook_keyword_encrypted: encryptSecret("审批提醒"),
      },
      submission,
      workflowRun
    );

    expect(JSON.parse(fetchMock.mock.calls[0][1]?.body as string)).toMatchObject({
      msg_type: "text",
      content: {
        text: expect.stringContaining("审批提醒"),
      },
    });
  });

  it("formats Slack bot payload with plainTextSummary in text field", async () => {
    webhookLogMocks.createWebhookLogMock.mockResolvedValue({ uuid: "wh_slack" });
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      text: () => Promise.resolve("ok"),
    });
    vi.stubGlobal("fetch", fetchMock);

    await runMockWebhookSkill(
      {
        ...form,
        webhook_provider: "slack_bot",
        webhook_auth_mode: "none",
      },
      submission,
      workflowRun
    );

    expect(JSON.parse(fetchMock.mock.calls[0][1]?.body as string)).toEqual({
      text: expect.stringContaining("Form: Webhook Test Form"),
    });
  });

  it("retries server errors and marks the webhook as failed", async () => {
    webhookLogMocks.createWebhookLogMock.mockResolvedValue({ uuid: "wh_failure" });
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce({
        ok: false,
        status: 500,
        text: () => Promise.resolve("server error"),
      })
      .mockResolvedValueOnce({
        ok: false,
        status: 502,
        text: () => Promise.resolve("bad gateway"),
      })
      .mockResolvedValueOnce({
        ok: false,
        status: 503,
        text: () => Promise.resolve("unavailable"),
      })
      .mockResolvedValueOnce({
        ok: false,
        status: 504,
        text: () => Promise.resolve("gateway timeout"),
      });
    vi.stubGlobal("fetch", fetchMock);

    const result = await runMockWebhookSkill(form, submission, workflowRun);

    expect(result.status).toBe("failed");
    expect(fetchMock).toHaveBeenCalledTimes(4);
    expect(webhookLogMocks.finalizeWebhookLogMock).toHaveBeenCalledWith(
      "wh_failure",
      expect.objectContaining({
        attempt_count: 4,
        response_status: 504,
        status: "failed",
      })
    );
  });
});
