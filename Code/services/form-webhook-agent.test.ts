import { describe, expect, it } from "vitest";

import type { FormRecord, WebhookLogRecord } from "@/types/form";
import {
  answerFormWebhookAgentQuery,
  buildFormWebhookAgentResponses,
  buildFormWebhookAgentSummary,
} from "./form-webhook-agent";

const form: FormRecord = {
  uuid: "form_1",
  user_uuid: "user_1",
  title: "发票收集表",
  theme: "business",
  schema_json: { fields: [] },
  status: "draft",
  share_code: "share_1",
};

const logs: WebhookLogRecord[] = [
  {
    uuid: "wh_success",
    form_uuid: "form_1",
    submission_uuid: "sub_1",
    workflow_run_uuid: "run_1",
    target_url: "https://example.com/webhook",
    request_body_json: {},
    response_status: 200,
    response_body: "ok",
    attempt_count: 1,
    status: "completed",
  },
  {
    uuid: "wh_failed",
    form_uuid: "form_1",
    submission_uuid: "sub_2",
    workflow_run_uuid: "run_2",
    target_url: "https://example.com/webhook",
    request_body_json: {},
    response_status: 500,
    response_body: "server error",
    attempt_count: 3,
    status: "failed",
    error_message: "Webhook returned status 500.",
  },
  {
    uuid: "wh_processing",
    form_uuid: "form_1",
    submission_uuid: "sub_3",
    workflow_run_uuid: "run_3",
    target_url: "mock://webhook-endpoint",
    request_body_json: {},
    response_status: 0,
    response_body: "",
    attempt_count: 1,
    status: "processing",
  },
];

describe("form-webhook-agent", () => {
  it("builds a deterministic webhook log summary", () => {
    const summary = buildFormWebhookAgentSummary(form, logs);

    expect(summary.totalLogs).toBe(3);
    expect(summary.completedCount).toBe(1);
    expect(summary.failedCount).toBe(1);
    expect(summary.processingCount).toBe(1);
    expect(summary.retryableFailedCount).toBe(1);
    expect(summary.recentFailures[0]).toMatchObject({
      logUuid: "wh_failed",
      submissionUuid: "sub_2",
      responseStatus: 500,
      target: "example.com",
      reason: "Webhook returned status 500.",
      attemptCount: 3,
    });
    expect(summary.recommendedActions.some((item) => item.includes("重试"))).toBe(true);
  });

  it("builds readable webhook agent responses", () => {
    const summary = buildFormWebhookAgentSummary(form, logs);
    const responses = buildFormWebhookAgentResponses(summary);

    expect(responses.overview).toContain("共有 3 条 Webhook 日志");
    expect(responses.failures).toContain("Webhook returned status 500");
    expect(responses.retry).toContain("手动重试");
    expect(responses.lookup).toContain("wh_faile");
    expect(responses.defaultResponse).toContain("不会自动触发");
  });

  it("answers webhook log queries by intent without using an LLM", () => {
    const summary = buildFormWebhookAgentSummary(form, logs);

    expect(answerFormWebhookAgentQuery("分析失败原因", summary)).toContain("最近失败记录");
    expect(answerFormWebhookAgentQuery("重试失败请求", summary)).toContain("手动重试");
    expect(answerFormWebhookAgentQuery("查询特定推送", summary)).toContain("日志 ID");
    expect(answerFormWebhookAgentQuery("总结当前状态", summary)).toContain("共有 3 条");
  });
});
