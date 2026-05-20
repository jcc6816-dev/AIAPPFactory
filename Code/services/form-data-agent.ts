import type {
  FormRecord,
  FormSubmissionRecord,
  WebhookLogRecord,
} from "@/types/form";

export interface FormDataAgentSummary {
  totalSubmissions: number;
  completedSubmissions: number;
  failedSubmissions: number;
  ocrCompletedCount: number;
  ocrFailedCount: number;
  webhookCompletedCount: number;
  webhookFailedCount: number;
  missingFieldStats: Array<{
    key: string;
    label: string;
    missingCount: number;
  }>;
  recentSubmissionHints: string[];
  recommendedActions: string[];
}

function isMissingAnswer(value: unknown) {
  return (
    value === undefined ||
    value === null ||
    value === "" ||
    (Array.isArray(value) && value.length === 0)
  );
}

function countByStatus<T extends { status?: string }>(items: T[], status: string) {
  return items.filter((item) => item.status === status).length;
}

function buildMissingFieldStats(
  form: FormRecord,
  submissions: FormSubmissionRecord[]
) {
  return form.schema_json.fields
    .map((field) => {
      const missingCount = submissions.filter((submission) =>
        isMissingAnswer(submission.answers_json?.[field.key])
      ).length;

      return {
        key: field.key,
        label: field.label,
        missingCount,
      };
    })
    .filter((item) => item.missingCount > 0)
    .sort((a, b) => b.missingCount - a.missingCount)
    .slice(0, 5);
}

function buildRecentSubmissionHints(submissions: FormSubmissionRecord[]) {
  if (submissions.length === 0) {
    return ["当前还没有提交记录，建议先完成一次测试提交。"];
  }

  const latest = submissions[0];
  const hints = [
    `最近一条提交状态为 ${latest.status || "unknown"}。`,
  ];

  if (latest.ocr_status && latest.ocr_status !== "not_requested") {
    hints.push(`最近一条 OCR 状态为 ${latest.ocr_status}。`);
  }

  if (latest.workflow_run_uuid) {
    hints.push("最近一条已进入工作流处理链路。");
  }

  return hints;
}

function buildRecommendedActions(summary: Omit<FormDataAgentSummary, "recommendedActions">) {
  const actions: string[] = [];

  if (summary.totalSubmissions === 0) {
    actions.push("先用分享页提交一条测试数据，验证字段、OCR 和 Webhook 链路。");
    return actions;
  }

  if (summary.failedSubmissions > 0) {
    actions.push("优先查看失败提交，确认是必填字段、文件上传还是工作流处理问题。");
  }

  if (summary.ocrFailedCount > 0) {
    actions.push("筛选 OCR 失败记录，检查图片质量、OCR 模板和供应商配置。");
  }

  if (summary.webhookFailedCount > 0) {
    actions.push("查看 Webhook 失败日志，确认地址、关键词、安全模式和目标系统响应。");
  }

  if (summary.missingFieldStats.length > 0) {
    actions.push(`优先优化「${summary.missingFieldStats[0].label}」字段的文案或必填策略。`);
  }

  if (actions.length === 0) {
    actions.push("当前数据链路整体健康，可以继续观察提交质量并准备导出分析。");
  }

  return actions;
}

export function buildFormDataAgentSummary(
  form: FormRecord,
  submissions: FormSubmissionRecord[],
  webhookLogs: WebhookLogRecord[]
): FormDataAgentSummary {
  const base = {
    totalSubmissions: submissions.length,
    completedSubmissions: countByStatus(submissions, "completed"),
    failedSubmissions: countByStatus(submissions, "failed"),
    ocrCompletedCount: submissions.filter((item) => item.ocr_status === "completed").length,
    ocrFailedCount: submissions.filter((item) => item.ocr_status === "failed").length,
    webhookCompletedCount: countByStatus(webhookLogs, "completed"),
    webhookFailedCount: countByStatus(webhookLogs, "failed"),
    missingFieldStats: buildMissingFieldStats(form, submissions),
    recentSubmissionHints: buildRecentSubmissionHints(submissions),
  };

  return {
    ...base,
    recommendedActions: buildRecommendedActions(base),
  };
}
