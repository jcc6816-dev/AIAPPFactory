import { describe, expect, it } from "vitest";
import type {
  FormRecord,
  FormSubmissionRecord,
  WebhookLogRecord,
} from "@/types/form";

import {
  answerFormDataAgentQuery,
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
      { key: "invoice_image", label: "发票图片", type: "image", required: true },
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
    files_json: [
      {
        field_key: "invoice_image",
        file_name: "invoice.png",
        file_type: "image/png",
      },
    ],
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
    ocr_error_message: "OCR provider timeout",
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
    error_message: "Webhook returned status 500.",
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
    expect(summary.recentOcrFailures[0]).toEqual({
      submissionUuid: "sub_2",
      reason: "OCR provider timeout",
    });
    expect(summary.recentWebhookFailures[0]).toMatchObject({
      logUuid: "wh_2",
      submissionUuid: "sub_2",
      responseStatus: 500,
    });
    expect(summary.fileFieldStats[0]).toEqual({
      key: "invoice_image",
      label: "发票图片",
      missingCount: 1,
    });
    expect(summary.recentMissingFileSubmissions[0]).toEqual({
      submissionUuid: "sub_2",
      fieldLabel: "发票图片",
    });
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
    expect(responses.ocrFailures).toContain("OCR provider timeout");
    expect(responses.webhookFailures).toContain("点击“重试”");
    expect(responses.missingFields).toContain("你的手机号是？缺失 1 次");
    expect(responses.fileIssues).toContain("发票图片缺失 1 次");
    expect(responses.defaultResponse).toContain("这一版数据页 Agent");
  });

  it("answers data agent queries by intent without using an LLM", () => {
    const summary = buildFormDataAgentSummary(form, submissions, webhookLogs);

    expect(answerFormDataAgentQuery("总结最近提交情况", summary)).toContain(
      "当前共有 2 条提交"
    );
    expect(answerFormDataAgentQuery("哪些字段缺失最多", summary)).toContain(
      "字段缺失"
    );
    expect(answerFormDataAgentQuery("Webhook 失败原因", summary)).toContain(
      "Webhook 失败"
    );
    expect(answerFormDataAgentQuery("哪些提交没有上传发票", summary)).toContain(
      "发票图片缺失 1 次"
    );
    expect(answerFormDataAgentQuery("OCR 识别失败", summary)).toContain(
      "OCR provider timeout"
    );
  });
});
