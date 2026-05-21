import { describe, expect, it } from "vitest";

import {
  answerWorkspaceAgentQuery,
  buildWorkspaceAgentResponses,
} from "./workspace-agent";
import type { FormDashboardMetrics } from "./form-dashboard";
import type { FormRecord } from "@/types/form";

const forms: FormRecord[] = [
  {
    uuid: "form_1",
    user_uuid: "user_1",
    title: "发票收集",
    theme: "business",
    schema_json: { fields: [{ key: "invoice", label: "发票", type: "image" }] },
    status: "draft",
    share_code: "share_1",
    updated_at: "2026-05-20T10:00:00.000Z",
  },
];

const metrics: FormDashboardMetrics = {
  totalSubmissions: 8,
  completedSubmissions: 6,
  failedSubmissions: 2,
  ocrCompletedCount: 5,
  ocrFailedCount: 1,
  autoFilledSubmissionCount: 4,
  webhookCompletedCount: 3,
  webhookFailedCount: 1,
};

describe("workspace-agent", () => {
  it("builds workspace overview and anomaly responses", () => {
    const responses = buildWorkspaceAgentResponses(forms, metrics, true);

    expect(responses.overview).toContain("当前共有 1 个场景");
    expect(responses.overview).toContain("OCR 成功率 83%");
    expect(responses.anomalies).toContain("2 条失败提交");
    expect(responses.nextActions).toContain("Webhook 日志页");
    expect(responses.creation).toContain("可以继续创建新场景");
  });

  it("answers workspace queries by intent without using an LLM", () => {
    const responses = buildWorkspaceAgentResponses(forms, metrics, false);

    expect(answerWorkspaceAgentQuery("总结工作台", responses)).toContain(
      "累计 8 条提交"
    );
    expect(answerWorkspaceAgentQuery("有没有异常告警", responses)).toContain(
      "当前需要关注"
    );
    expect(answerWorkspaceAgentQuery("下一步做什么", responses)).toContain(
      "建议下一步"
    );
    expect(answerWorkspaceAgentQuery("还能创建新场景吗", responses)).toContain(
      "创建额度已满"
    );
  });
});
