import type { FormRecord, WebhookLogRecord } from "@/types/form";

export interface FormWebhookAgentSummary {
  formTitle: string;
  totalLogs: number;
  completedCount: number;
  failedCount: number;
  processingCount: number;
  retryableFailedCount: number;
  recentFailures: Array<{
    logUuid: string;
    submissionUuid: string;
    responseStatus: number;
    target: string;
    reason: string;
    attemptCount: number;
  }>;
  recommendedActions: string[];
}

export interface FormWebhookAgentResponses {
  overview: string;
  failures: string;
  retry: string;
  lookup: string;
  defaultResponse: string;
}

function countByStatus(logs: WebhookLogRecord[], status: string) {
  return logs.filter((log) => log.status === status).length;
}

function describeTarget(targetUrl: string) {
  try {
    const url = new URL(targetUrl);
    return url.host || targetUrl;
  } catch {
    return targetUrl || "未记录目标地址";
  }
}

function describeFailureReason(log: WebhookLogRecord) {
  return log.error_message || log.response_body || "未记录具体失败原因";
}

function buildRecommendedActions(summary: Omit<FormWebhookAgentSummary, "recommendedActions">) {
  const actions: string[] = [];

  if (summary.totalLogs === 0) {
    actions.push("先在发布页配置 Webhook，并提交一条测试数据来生成推送日志。");
    return actions;
  }

  if (summary.failedCount > 0) {
    actions.push("优先检查失败日志的 HTTP 状态码、目标地址和目标系统响应正文。");
  }

  if (summary.retryableFailedCount > 0) {
    actions.push("修复配置后，可以在日志列表中对失败记录逐条点击“重试”。");
  }

  if (summary.processingCount > 0) {
    actions.push("存在处理中日志，如长时间不结束，建议检查服务端网络或目标系统超时。");
  }

  if (actions.length === 0) {
    actions.push("当前推送日志整体稳定，可以继续观察下一批提交的外发结果。");
  }

  return actions;
}

export function buildFormWebhookAgentSummary(
  form: FormRecord,
  logs: WebhookLogRecord[]
): FormWebhookAgentSummary {
  const base = {
    formTitle: form.title,
    totalLogs: logs.length,
    completedCount: countByStatus(logs, "completed"),
    failedCount: countByStatus(logs, "failed"),
    processingCount: countByStatus(logs, "processing"),
    retryableFailedCount: logs.filter((log) => log.status === "failed").length,
    recentFailures: logs
      .filter((log) => log.status === "failed")
      .slice(0, 3)
      .map((log) => ({
        logUuid: log.uuid,
        submissionUuid: log.submission_uuid,
        responseStatus: log.response_status,
        target: describeTarget(log.target_url),
        reason: describeFailureReason(log),
        attemptCount: log.attempt_count,
      })),
  };

  return {
    ...base,
    recommendedActions: buildRecommendedActions(base),
  };
}

export function buildFormWebhookAgentResponses(
  summary: FormWebhookAgentSummary
): FormWebhookAgentResponses {
  const recentFailureText =
    summary.recentFailures.length > 0
      ? summary.recentFailures
          .map(
            (item) =>
              `${item.logUuid.slice(0, 8)} / 提交 ${item.submissionUuid.slice(0, 8)} / ${item.target} / HTTP ${item.responseStatus || "-"} / 第 ${item.attemptCount} 次：${item.reason}`
          )
          .join("\n")
      : "当前没有失败日志。";

  return {
    overview: [
      `当前表单「${summary.formTitle}」共有 ${summary.totalLogs} 条 Webhook 日志。`,
      `成功 ${summary.completedCount} 条，失败 ${summary.failedCount} 条，处理中 ${summary.processingCount} 条。`,
      `建议：${summary.recommendedActions.join(" ")}`,
    ].join("\n"),
    failures:
      summary.failedCount > 0
        ? [`最近失败记录：`, recentFailureText].join("\n")
        : "当前没有 Webhook 失败记录，推送链路暂时稳定。",
    retry:
      summary.retryableFailedCount > 0
        ? `当前有 ${summary.retryableFailedCount} 条失败日志可以在列表中手动重试。请先确认目标地址、关键词/签名和目标系统已恢复，再点击对应行的“重试”。`
        : "当前没有可重试的失败日志。若要验证重试能力，可以先配置测试 Webhook 并制造一条失败记录。",
    lookup:
      summary.recentFailures.length > 0
        ? `你可以复制日志 ID 或提交 ID 在表格中定位。最近失败日志如下：\n${recentFailureText}`
        : "当前没有失败日志可定位。你可以在表格中复制任意日志 ID，用于后续人工排查。",
    defaultResponse:
      "这一版 Webhook 日志 Agent 先支持日志概览、失败原因摘要、重试建议和日志定位说明，不会自动触发外发重试。",
  };
}

export function answerFormWebhookAgentQuery(
  query: string,
  summary: FormWebhookAgentSummary
) {
  const normalized = query.toLowerCase();
  const responses = buildFormWebhookAgentResponses(summary);

  if (["重试", "retry", "再推", "重新推送"].some((keyword) => normalized.includes(keyword))) {
    return responses.retry;
  }

  if (["失败", "原因", "报错", "错误", "异常"].some((keyword) => normalized.includes(keyword))) {
    return responses.failures;
  }

  if (["查询", "查一下", "定位", "特定", "日志", "id"].some((keyword) => normalized.includes(keyword))) {
    return responses.lookup;
  }

  if (["分析", "概览", "总结", "情况", "状态", "统计"].some((keyword) => normalized.includes(keyword))) {
    return responses.overview;
  }

  return responses.defaultResponse;
}
