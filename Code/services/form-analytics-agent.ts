import { FormDashboardMetrics } from "./form-dashboard";

export interface FormAnalyticsAgentResponses {
  overview: string;
  ocr: string;
  webhook: string;
  funnel: string;
  defaultResponse: string;
}

function percentage(part: number, total: number) {
  return total ? Math.round((part / total) * 100) : 0;
}

export function buildFormAnalyticsAgentResponses(
  metrics: FormDashboardMetrics
): FormAnalyticsAgentResponses {
  const ocrTotal = metrics.ocrCompletedCount + metrics.ocrFailedCount;
  const webhookTotal =
    metrics.webhookCompletedCount + metrics.webhookFailedCount;
  const completionRate = percentage(
    metrics.completedSubmissions,
    metrics.totalSubmissions
  );
  const ocrRate = percentage(metrics.ocrCompletedCount, ocrTotal);
  const webhookRate = percentage(metrics.webhookCompletedCount, webhookTotal);
  const autoFillRate = percentage(
    metrics.autoFilledSubmissionCount,
    metrics.totalSubmissions
  );

  return {
    overview: [
      `当前共有 ${metrics.totalSubmissions} 条提交，完成率约 ${completionRate}%。`,
      `OCR 成功率 ${ocrRate}%，Webhook 成功率 ${webhookRate}%，自动填充覆盖率 ${autoFillRate}%。`,
      metrics.failedSubmissions > 0
        ? `当前有 ${metrics.failedSubmissions} 条失败提交，建议优先从数据页定位失败原因。`
        : "当前没有失败提交，整体运行状态较稳定。",
    ].join("\n"),
    ocr:
      ocrTotal > 0
        ? `OCR 共处理 ${ocrTotal} 条，成功 ${metrics.ocrCompletedCount} 条，失败 ${metrics.ocrFailedCount} 条，成功率 ${ocrRate}%。${
            metrics.ocrFailedCount > 0
              ? "建议检查图片清晰度、上传字段是否必填，以及 OCR 服务配置。"
              : "当前 OCR 链路表现稳定，可以继续观察自动填充质量。"
          }`
        : "当前还没有 OCR 处理记录。若要验证 OCR，请提交带图片或票据文件的数据。",
    webhook:
      webhookTotal > 0
        ? `Webhook 共推送 ${webhookTotal} 次，成功 ${metrics.webhookCompletedCount} 次，失败 ${metrics.webhookFailedCount} 次，成功率 ${webhookRate}%。${
            metrics.webhookFailedCount > 0
              ? "建议前往 Webhook 日志页查看失败原因，修复配置后点击重试。"
              : "当前 Webhook 推送稳定。"
          }`
        : "当前还没有 Webhook 推送记录。可以在发布页配置 Webhook 后提交一条测试数据。",
    funnel:
      metrics.totalSubmissions > 0
        ? `MVP 阶段暂未记录真实访问和开始填写事件，因此当前漏斗只能以提交数据估算：完成提交 ${metrics.completedSubmissions} 条，失败 ${metrics.failedSubmissions} 条。后续如要做真实转化漏斗，需要增加访问、开始填写、字段停留等事件埋点。`
        : "当前没有提交数据，漏斗分析暂不可用。建议先完成一条测试提交。",
    defaultResponse:
      "这一版分析页 Agent 先基于提交、OCR、Webhook 和自动填充指标做规则解释，不接大模型，也不消耗 Token。",
  };
}

export function answerFormAnalyticsAgentQuery(
  query: string,
  metrics: FormDashboardMetrics
) {
  const normalized = query.toLowerCase();
  const responses = buildFormAnalyticsAgentResponses(metrics);

  if (
    ["ocr", "识别", "自动填充"].some((keyword) =>
      normalized.includes(keyword)
    )
  ) {
    return responses.ocr;
  }

  if (
    ["webhook", "推送", "通知"].some((keyword) =>
      normalized.includes(keyword)
    )
  ) {
    return responses.webhook;
  }

  if (
    ["漏斗", "转化", "完成率"].some((keyword) =>
      normalized.includes(keyword)
    )
  ) {
    return responses.funnel;
  }

  if (
    ["分析", "概览", "总结", "趋势", "异常", "比例"].some((keyword) =>
      normalized.includes(keyword)
    )
  ) {
    return responses.overview;
  }

  return responses.defaultResponse;
}
