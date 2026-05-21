import type { FormRecord, WebhookLogRecord } from "@/types/form";

export interface FormPublishAgentResponses {
  readiness: string;
  share: string;
  webhook: string;
  ocr: string;
  defaultResponse: string;
}

function countByStatus(logs: WebhookLogRecord[], status: string) {
  return logs.filter((log) => log.status === status).length;
}

function describeWebhookProvider(provider?: string) {
  switch (provider) {
    case "feishu_bot":
      return "飞书群机器人";
    case "dingtalk_bot":
      return "钉钉群机器人";
    case "wecom_bot":
      return "企业微信群机器人";
    case "generic":
    case "":
    case undefined:
      return "通用 Webhook";
    default:
      return provider;
  }
}

function describeAuthMode(mode?: string) {
  switch (mode) {
    case "keyword":
      return "关键词";
    case "query_keyword":
      return "URL 参数关键词";
    case "header_keyword":
      return "请求头关键词";
    case "body_keyword":
      return "请求体关键词";
    case "signature":
      return "签名校验";
    default:
      return "无认证";
  }
}

function buildReadinessIssues(form: FormRecord, webhookLogs: WebhookLogRecord[]) {
  const issues: string[] = [];

  if (!form.share_code) {
    issues.push("缺少分享码，分享链接无法生成。");
  }

  if (form.webhook_enabled && !form.webhook_url) {
    issues.push("已启用 Webhook，但还没有填写目标地址。");
  }

  if (!form.webhook_enabled) {
    issues.push("Webhook 未启用，提交数据不会自动推送到外部系统。");
  }

  if (countByStatus(webhookLogs, "failed") > 0) {
    issues.push("存在失败的 Webhook 日志，建议修复配置后到日志页重试。");
  }

  if (!form.ocr_template) {
    issues.push("OCR 模板未显式配置，将使用默认通用图片识别。");
  }

  return issues;
}

export function buildFormPublishAgentResponses(
  form: FormRecord,
  webhookLogs: WebhookLogRecord[],
  shareUrl: string
): FormPublishAgentResponses {
  const completedCount = countByStatus(webhookLogs, "completed");
  const failedCount = countByStatus(webhookLogs, "failed");
  const issues = buildReadinessIssues(form, webhookLogs);
  const latestFailedLog = webhookLogs.find((log) => log.status === "failed");
  const provider = describeWebhookProvider(form.webhook_provider);
  const authMode = describeAuthMode(form.webhook_auth_mode);

  return {
    readiness:
      issues.length > 0
        ? [
            `当前发布检查发现 ${issues.length} 个注意点：`,
            ...issues.map((issue, index) => `${index + 1}. ${issue}`),
            `分享链接：${shareUrl}`,
          ].join("\n")
        : `当前发布配置看起来可用于演示。分享链接：${shareUrl}`,
    share: [
      `当前分享链接为：${shareUrl}`,
      "你可以把链接或二维码发给外部填写人。若后续要正式对外发布，建议先完成一次测试提交并检查数据页是否收到记录。",
    ].join("\n"),
    webhook: form.webhook_enabled
      ? [
          `Webhook 已启用，类型为 ${provider}，安全模式为 ${authMode}。`,
          form.webhook_url
            ? `目标地址已配置。最近日志：${completedCount} 次成功 / ${failedCount} 次失败。`
            : "目标地址未配置，当前无法真实推送。",
          latestFailedLog
            ? `最近失败日志 ${latestFailedLog.uuid.slice(0, 8)}：HTTP ${latestFailedLog.response_status || "-"}，${latestFailedLog.error_message || latestFailedLog.response_body || "未记录失败原因"}。`
            : "当前没有失败日志。",
        ].join("\n")
      : "Webhook 当前未启用。若你需要把提交数据推送到飞书、钉钉、企微或自有系统，需要先打开 Webhook 并配置目标地址。",
    ocr: [
      `当前 OCR 模板：${form.ocr_template || "general_image"}。`,
      "如果表单包含发票、票据或证件图片，建议选择对应模板，并在分享页完成一次带图测试提交。",
    ].join("\n"),
    defaultResponse:
      "这一版发布页 Agent 先支持发布检查、分享链接说明、Webhook 配置诊断和 OCR 配置提示，不会自动修改配置或外发测试事件。",
  };
}

export function answerFormPublishAgentQuery(
  query: string,
  responses: FormPublishAgentResponses
) {
  const normalized = query.toLowerCase();

  if (
    ["检查", "发布", "上线", "准备", "配置"].some((keyword) =>
      normalized.includes(keyword)
    )
  ) {
    return responses.readiness;
  }

  if (
    ["分享", "链接", "二维码"].some((keyword) =>
      normalized.includes(keyword)
    )
  ) {
    return responses.share;
  }

  if (
    ["webhook", "推送", "钉钉", "飞书", "企微", "企业微信"].some((keyword) =>
      normalized.includes(keyword)
    )
  ) {
    return responses.webhook;
  }

  if (
    ["ocr", "识别", "图片", "票据", "发票", "证件"].some((keyword) =>
      normalized.includes(keyword)
    )
  ) {
    return responses.ocr;
  }

  return responses.defaultResponse;
}
