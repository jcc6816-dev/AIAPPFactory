import { describe, expect, it } from "vitest";
import type {
  FormRecord,
  FormSubmissionRecord,
  WebhookLogRecord,
} from "@/types/form";

import {
  buildFormDataAgentResponses,
  buildFormDataAgentSummary,
} from "./form-data-agent";

const form: FormRecord = {
  uuid: "form_test",
  user_uuid: "user_test",
  title: "线索收集表",
  theme: "business",
  schema_json: {
    fields: [
      { key: "name", label: "怎么称呼你？", type: "text", required: true },
      { key: "phone", label: "你的手机号是？", type: "text", required: true },
    ],
  },
  status: "draft",
  share_code: "share_test",
};

const submissions: FormSubmissionRecord[] = [
  {
    uuid: "sub_1",
    form_uuid: "form_test",
    form_title: "线索收集表",
    form_share_code: "share_test",
    answers_json: { name: "Mike", phone: "13800138000" },
    files_json: [],
    status: "completed",
    ocr_status: "completed",
    workflow_run_uuid: "run_1",
  },
  {
    uuid: "sub_2",
    form_uuid: "form_test",
    form_title: "线索收集表",
    form_share_code: "share_test",
    answers_json: { name: "Anna" },
    files_json: [],
    status: "failed",
    ocr_status: "failed",
  },
];

const webhookLogs: WebhookLogRecord[] = [
  {
    uuid: "wh_1",
    form_uuid: "form_test",
    submission_uuid: "sub_1",
    target_url: "https://example.com/webhook",
    request_body_json: {},
    response_status: 200,
    response_body: "ok",
    attempt_count: 1,
    status: "completed",
  },
  {
    uuid: "wh_2",
    form_uuid: "form_test",
    submission_uuid: "sub_2",
    target_url: "https://example.com/webhook",
    request_body_json: {},
    response_status: 500,
    response_body: "error",
    attempt_count: 3,
    status: "failed",
  },
];

describe("form-data-agent", () => {
  it("builds a deterministic data health summary", () => {
    const summary = buildFormDataAgentSummary(form, submissions, webhookLogs);

    expect(summary.totalSubmissions).toBe(2);
    expect(summary.completedSubmissions).toBe(1);
    expect(summary.failedSubmissions).toBe(1);
    expect(summary.ocrFailedCount).toBe(1);
    expect(summary.webhookFailedCount).toBe(1);
    expect(summary.missingFieldStats[0]).toEqual({
      key: "phone",
      label: "你的手机号是？",
      missingCount: 1,
    });
    expect(summary.recommendedActions.some((item) => item.includes("Webhook"))).toBe(true);
  });

  it("recommends a test submission when there is no data", () => {
    const summary = buildFormDataAgentSummary(form, [], []);

    expect(summary.totalSubmissions).toBe(0);
    expect(summary.recentSubmissionHints[0]).toContain("还没有提交记录");
    expect(summary.recommendedActions[0]).toContain("测试数据");
  });

  it("builds deterministic static responses for the data agent", () => {
    const summary = buildFormDataAgentSummary(form, submissions, webhookLogs);
    const responses = buildFormDataAgentResponses(summary);

    expect(responses.summary).toContain("当前共有 2 条提交");
    expect(responses.ocrFailures).toContain("OCR 失败");
    expect(responses.webhookFailures).toContain("Webhook 失败");
    expect(responses.defaultResponse).toContain("这一版数据页 Agent");
  });
});
