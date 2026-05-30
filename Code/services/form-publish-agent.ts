import type { FormRecord, WebhookLogRecord } from "@/types/form";

const supportedPublishLocales = ["en", "zh"];

export interface FormPublishAgentResponses {
  readiness: string;
  share: string;
  webhook: string;
  platformGuide: string;
  testWebhook: string;
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
    case "slack_bot":
      return "Slack 机器人";
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

function inferRequestedWebhookProvider(query: string, currentProvider?: string) {
  if (/飞书|feishu|lark/i.test(query)) {
    return "feishu_bot";
  }

  if (/钉钉|dingtalk/i.test(query)) {
    return "dingtalk_bot";
  }

  if (/企微|企业微信|wecom|wechat work/i.test(query)) {
    return "wecom_bot";
  }

  if (/slack/i.test(query)) {
    return "slack_bot";
  }

  return currentProvider || "generic";
}

function buildWebhookProviderGuide(provider?: string) {
  switch (provider) {
    case "feishu_bot":
      return [
        "飞书群机器人建议选择「飞书群机器人」平台预设。",
        "如果客户不清楚安全模式，优先从「关键词」开始：在飞书机器人安全设置里配置一个自定义关键词，并在本系统填写同一个关键词。",
        "如果客户有更高安全要求，再切换到签名校验；这通常需要客户从飞书机器人配置页复制签名密钥。",
        "配置完成后先提交一条测试数据，再到 Webhook 日志页确认是否返回 2xx。",
      ].join("\n");
    case "dingtalk_bot":
      return [
        "钉钉群机器人建议选择「钉钉群机器人」平台预设。",
        "如果客户不知道该选哪种安全模式，优先选择「关键词」：在钉钉机器人安全设置中添加自定义关键词，并在本系统填写同一个关键词。",
        "如果企业安全要求更高，可以选择签名校验；签名密钥需要客户从钉钉机器人配置页复制。",
        "钉钉对关键词非常敏感，测试消息内容必须包含该关键词，否则可能通知不过去。",
      ].join("\n");
    case "wecom_bot":
      return [
        "企业微信群机器人建议选择「企业微信群机器人」平台预设。",
        "企业微信群机器人通常以机器人 Webhook Key 作为主要安全入口；如果客户额外要求关键词，可以在本系统选择关键词模式并确保消息内容包含关键词。",
        "如果只是 MVP 演示，建议先用平台预设 + 目标 URL 跑通，再逐步增加关键词或签名要求。",
        "配置完成后用测试提交验证日志，不建议让 Agent 自动外发测试消息。",
      ].join("\n");
    case "slack_bot":
      return [
        "Slack 机器人建议选择「Slack 机器人」平台预设。",
        "Slack 机器人通过 Incoming Webhook URL 进行推送，不需要配置额外的签名或关键词，只需在此配置 Webhook 链接即可。",
        "发布前建议提交测试消息，检查 Slack 频道中是否正确展现推送文本信息。",
      ].join("\n");
    default:
      return [
        "通用 Webhook 适合自建系统、Zapier、Make、n8n 或客户自己的 API。",
        "如果目标系统没有鉴权要求，可以选择「无认证」；如果需要简单防误发，优先选择「请求头关键词」或「请求体关键词」。",
        "如果目标系统要求 Bearer Token、签名或特殊 Header，建议先让客户提供接口文档，再配置对应模式。",
        "MVP 阶段建议先用一个可控的测试地址验证请求体和日志，再接正式系统。",
      ].join("\n");
  }
}

function buildWebhookReadinessChecklist(form: FormRecord) {
  const checklist: string[] = [];

  checklist.push(
    form.webhook_enabled
      ? "Webhook 开关：已启用。"
      : "Webhook 开关：未启用，需要先打开。"
  );
  checklist.push(
    form.webhook_url
      ? "目标地址：已填写。"
      : "目标地址：未填写，无法推送。"
  );
  checklist.push(`平台类型：${describeWebhookProvider(form.webhook_provider)}。`);
  checklist.push(`安全模式：${describeAuthMode(form.webhook_auth_mode)}。`);

  if (
    form.webhook_auth_mode &&
    form.webhook_auth_mode !== "none" &&
    !form.webhook_keyword_encrypted &&
    form.webhook_auth_mode !== "signature"
  ) {
    checklist.push("关键词/认证值：当前无法确认已保存，建议重新检查关键词配置。");
  }

  if (form.webhook_auth_mode === "header_keyword" && !form.webhook_header_name) {
    checklist.push("请求头关键词模式需要填写 Header 名称。");
  }

  return checklist;
}

export function resolvePublishAgentLocale(input: {
  bodyLocale?: unknown;
  referer?: string | null;
}) {
  if (
    typeof input.bodyLocale === "string" &&
    supportedPublishLocales.includes(input.bodyLocale)
  ) {
    return input.bodyLocale;
  }

  if (input.referer) {
    try {
      const firstSegment = new URL(input.referer).pathname.split("/").filter(Boolean)[0];
      if (supportedPublishLocales.includes(firstSegment)) {
        return firstSegment;
      }
    } catch {
      // Ignore malformed referers and keep the existing zh fallback.
    }
  }

  return "zh";
}

export function buildFormShareUrl(input: {
  baseUrl?: string;
  locale: string;
  shareCode: string;
}) {
  const baseUrl = input.baseUrl || "";
  return `${baseUrl}/${input.locale}/f/${input.shareCode}`;
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
  const checklist = buildWebhookReadinessChecklist(form);

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
          `配置检查：${checklist.join(" ")}`,
          form.webhook_url
            ? `目标地址已配置。最近日志：${completedCount} 次成功 / ${failedCount} 次失败。`
            : "目标地址未配置，当前无法真实推送。",
          latestFailedLog
            ? `最近失败日志 ${latestFailedLog.uuid.slice(0, 8)}：HTTP ${latestFailedLog.response_status || "-"}，${latestFailedLog.error_message || latestFailedLog.response_body || "未记录失败原因"}。`
            : "当前没有失败日志。",
        ].join("\n")
      : "Webhook 当前未启用。若你需要把提交数据推送到飞书、钉钉、企微或自有系统，需要先打开 Webhook 并配置目标地址。",
    platformGuide: buildWebhookProviderGuide(form.webhook_provider),
    testWebhook: [
      "我不会自动触发测试推送，因为这属于外发数据动作，需要用户明确确认。",
      "建议测试步骤：1. 保存 Webhook 配置；2. 打开分享页提交一条测试数据；3. 回到 Webhook 日志页查看状态码、响应体和失败原因；4. 如失败，修复配置后在日志页手动重试。",
      form.webhook_enabled && form.webhook_url
        ? "当前已具备测试前提：Webhook 已启用且目标地址已填写。"
        : "当前还不具备测试前提：请先启用 Webhook 并填写目标地址。",
    ].join("\n"),
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
  const requestedProvider = inferRequestedWebhookProvider(
    query,
    normalized.includes("webhook") ? undefined : "generic"
  );

  if (
    ["测试", "试推", "试一下", "test"].some((keyword) =>
      normalized.includes(keyword)
    )
  ) {
    return responses.testWebhook;
  }

  if (
    ["分享", "链接", "二维码"].some((keyword) =>
      normalized.includes(keyword)
    )
  ) {
    return responses.share;
  }

  if (
    ["webhook", "推送", "钉钉", "飞书", "企微", "企业微信", "slack"].some((keyword) =>
      normalized.includes(keyword)
    )
  ) {
    if (
      ["钉钉", "飞书", "企微", "企业微信", "dingtalk", "feishu", "lark", "wecom", "slack"].some(
        (keyword) => normalized.includes(keyword)
      )
    ) {
      return buildWebhookProviderGuide(requestedProvider);
    }

    return responses.webhook;
  }

  if (
    ["检查", "发布", "上线", "准备", "配置"].some((keyword) =>
      normalized.includes(keyword)
    )
  ) {
    return responses.readiness;
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
