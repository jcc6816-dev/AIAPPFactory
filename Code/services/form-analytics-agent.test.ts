import { describe, expect, it } from "vitest";

import {
  answerFormAnalyticsAgentQuery,
  buildFormAnalyticsAgentResponses,
} from "./form-analytics-agent";
import { FormDashboardMetrics } from "./form-dashboard";

const metrics: FormDashboardMetrics = {
  totalSubmissions: 10,
  completedSubmissions: 8,
  failedSubmissions: 2,
  ocrCompletedCount: 6,
  ocrFailedCount: 2,
  autoFilledSubmissionCount: 5,
  webhookCompletedCount: 7,
  webhookFailedCount: 1,
};

describe("form-analytics-agent", () => {
  it("builds deterministic analytics responses from metrics", () => {
    const responses = buildFormAnalyticsAgentResponses(metrics);

    expect(responses.overview).toContain("完成率约 80%");
    expect(responses.ocr).toContain("成功率 75%");
    expect(responses.webhook).toContain("成功率 88%");
    expect(responses.funnel).toContain("真实转化漏斗");
  });

  it("answers analytics queries by intent without using an LLM", () => {
    expect(answerFormAnalyticsAgentQuery("分析整体表现", metrics)).toContain(
      "当前共有 10 条提交"
    );
    expect(answerFormAnalyticsAgentQuery("OCR 成功率怎么样", metrics)).toContain(
      "OCR 共处理 8 条"
    );
    expect(answerFormAnalyticsAgentQuery("Webhook 推送稳定吗", metrics)).toContain(
      "Webhook 共推送 8 次"
    );
    expect(answerFormAnalyticsAgentQuery("查看转化漏斗", metrics)).toContain(
      "MVP 阶段暂未记录真实访问"
    );
  });
});
