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
  recentOcrFailures: Array<{
    submissionUuid: string;
    reason: string;
  }>;
  recentWebhookFailures: Array<{
    logUuid: string;
    submissionUuid: string;
    responseStatus: number;
    reason: string;
  }>;
  fileFieldStats: Array<{
    key: string;
    label: string;
    missingCount: number;
  }>;
  recentMissingFileSubmissions: Array<{
    submissionUuid: string;
    fieldLabel: string;
  }>;
  missingFieldStats: Array<{
    key: string;
    label: string;
    missingCount: number;
  }>;
  recentSubmissionHints: string[];
  recommendedActions: string[];
}

export interface FormDataAgentResponses {
  summary: string;
  ocrFailures: string;
  webhookFailures: string;
  missingFields: string;
  fileIssues: string;
  defaultResponse: string;
}

export interface FormDataAgentFilterResult {
  type:
    | "ocr_failed"
    | "webhook_failed"
    | "missing_file"
    | "missing_answer"
    | "submission_status";
  label: string;
  matchedSubmissionUuids: string[];
  matchedCount: number;
  reason: string;
}

export interface FormDataAgentQueryResult {
  answer: string;
  summary: FormDataAgentSummary;
  filter?: FormDataAgentFilterResult;
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
    .filter((field) => !isFileField(field.type))
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

function isFileField(type: string) {
  return type === "file" || type === "image" || type === "pdf";
}

function submissionHasFileForField(
  submission: FormSubmissionRecord,
  fieldKey: string
) {
  return (
    submission.files_json?.some((file) => file.field_key === fieldKey) ||
    submission.storage_files_json?.some((file) => file.field_key === fieldKey)
  );
}

function formatSubmissionRefs(submissionUuids: string[]) {
  if (submissionUuids.length === 0) {
    return "无匹配提交";
  }

  return submissionUuids
    .slice(0, 8)
    .map((uuid) => `#${uuid.slice(0, 8)}`)
    .join("、");
}

function normalizeForMatch(value: string) {
  return value.toLowerCase().replace(/\s+/g, "");
}

function fieldMatchesQuery(field: FormRecord["schema_json"]["fields"][number], query: string) {
  const normalizedQuery = normalizeForMatch(query);
  const candidates = [
    field.key,
    field.label,
    field.placeholder || "",
    field.help_text || "",
  ].map(normalizeForMatch);

  if (candidates.some((candidate) => candidate && normalizedQuery.includes(candidate))) {
    return true;
  }

  if (
    /发票|票据|receipt|invoice/i.test(query) &&
    /发票|票据|receipt|invoice/i.test(`${field.key} ${field.label}`)
  ) {
    return true;
  }

  if (
    /电话|手机|手机号|phone|mobile/i.test(query) &&
    /电话|手机|手机号|phone|mobile/i.test(`${field.key} ${field.label}`)
  ) {
    return true;
  }

  if (
    /邮箱|邮件|email/i.test(query) &&
    /邮箱|邮件|email/i.test(`${field.key} ${field.label}`)
  ) {
    return true;
  }

  return false;
}

function findQueriedField(
  form: FormRecord,
  query: string,
  predicate?: (field: FormRecord["schema_json"]["fields"][number]) => boolean
) {
  return form.schema_json.fields.find(
    (field) => (!predicate || predicate(field)) && fieldMatchesQuery(field, query)
  );
}

function buildFileFieldStats(
  form: FormRecord,
  submissions: FormSubmissionRecord[]
) {
  return form.schema_json.fields
    .filter((field) => isFileField(field.type))
    .map((field) => {
      const missingCount = submissions.filter(
        (submission) => !submissionHasFileForField(submission, field.key)
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

function buildRecentMissingFileSubmissions(
  form: FormRecord,
  submissions: FormSubmissionRecord[]
) {
  const fileFields = form.schema_json.fields.filter((field) =>
    isFileField(field.type)
  );
  const missingItems: Array<{ submissionUuid: string; fieldLabel: string }> = [];

  for (const submission of submissions) {
    for (const field of fileFields) {
      if (!submissionHasFileForField(submission, field.key)) {
        missingItems.push({
          submissionUuid: submission.uuid,
          fieldLabel: field.label,
        });
      }

      if (missingItems.length >= 3) {
        return missingItems;
      }
    }
  }

  return missingItems;
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

function buildRecentOcrFailures(submissions: FormSubmissionRecord[]) {
  return submissions
    .filter((submission) => submission.ocr_status === "failed")
    .slice(0, 3)
    .map((submission) => ({
      submissionUuid: submission.uuid,
      reason: submission.ocr_error_message || "未记录具体 OCR 错误",
    }));
}

function buildRecentWebhookFailures(webhookLogs: WebhookLogRecord[]) {
  return webhookLogs
    .filter((log) => log.status === "failed")
    .slice(0, 3)
    .map((log) => ({
      logUuid: log.uuid,
      submissionUuid: log.submission_uuid,
      responseStatus: log.response_status,
      reason: log.error_message || log.response_body || "未记录具体 Webhook 错误",
    }));
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

  if (summary.fileFieldStats.length > 0) {
    actions.push(`检查「${summary.fileFieldStats[0].label}」上传要求，减少 OCR 前置数据缺失。`);
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
    recentOcrFailures: buildRecentOcrFailures(submissions),
    recentWebhookFailures: buildRecentWebhookFailures(webhookLogs),
    fileFieldStats: buildFileFieldStats(form, submissions),
    recentMissingFileSubmissions: buildRecentMissingFileSubmissions(form, submissions),
    missingFieldStats: buildMissingFieldStats(form, submissions),
    recentSubmissionHints: buildRecentSubmissionHints(submissions),
  };

  return {
    ...base,
    recommendedActions: buildRecommendedActions(base),
  };
}

export function buildFormDataAgentResponses(
  summary: FormDataAgentSummary
): FormDataAgentResponses {
  const missingFields =
    summary.missingFieldStats.length > 0
      ? summary.missingFieldStats
          .map((item) => `${item.label}缺失 ${item.missingCount} 次`)
          .join("，")
      : "暂未发现明显字段缺失";
  const recentOcrFailureText =
    summary.recentOcrFailures.length > 0
      ? ` 最近失败提交：${summary.recentOcrFailures
          .map((item) => `${item.submissionUuid.slice(0, 8)}（${item.reason}）`)
          .join("；")}。`
      : "";
  const recentWebhookFailureText =
    summary.recentWebhookFailures.length > 0
      ? ` 最近失败日志：${summary.recentWebhookFailures
          .map(
            (item) =>
              `${item.logUuid.slice(0, 8)} / 提交 ${item.submissionUuid.slice(0, 8)} / HTTP ${item.responseStatus || "-"}（${item.reason}）`
          )
          .join("；")}。`
      : "";
  const fileIssueText =
    summary.fileFieldStats.length > 0
      ? `文件字段缺失 Top ${summary.fileFieldStats.length}：${summary.fileFieldStats
          .map((item) => `${item.label}缺失 ${item.missingCount} 次`)
          .join("，")}。`
      : "当前没有明显的文件/图片字段缺失。";
  const recentMissingFileText =
    summary.recentMissingFileSubmissions.length > 0
      ? ` 最近缺失记录：${summary.recentMissingFileSubmissions
          .map((item) => `${item.submissionUuid.slice(0, 8)} 未上传「${item.fieldLabel}」`)
          .join("；")}。`
      : "";

  return {
    summary: [
      `当前共有 ${summary.totalSubmissions} 条提交，其中 ${summary.completedSubmissions} 条已完成，${summary.failedSubmissions} 条失败。`,
      `字段质量方面：${missingFields}。`,
      `建议：${summary.recommendedActions.join(" ")}`,
    ].join("\n"),
    ocrFailures:
      summary.ocrFailedCount > 0
        ? `当前有 ${summary.ocrFailedCount} 条 OCR 失败记录。${recentOcrFailureText}建议优先检查上传图片质量、OCR 模板选择和 OCR 服务配置。`
        : "当前没有 OCR 失败记录。可以继续观察后续提交，如果要验证 OCR，建议提交一张清晰的票据或证件图片。",
    webhookFailures:
      summary.webhookFailedCount > 0
        ? `当前有 ${summary.webhookFailedCount} 条 Webhook 失败记录。${recentWebhookFailureText}建议检查目标地址、关键词/签名安全模式、目标系统是否返回 2xx 状态码；修复后可在 Webhook 日志页点击“重试”。`
        : "当前没有 Webhook 失败记录。若要进一步验证，可以在发布页配置测试 Webhook 并提交一条测试数据。",
    missingFields:
      summary.missingFieldStats.length > 0
        ? `字段缺失 Top ${summary.missingFieldStats.length}：${summary.missingFieldStats
            .map((item) => `${item.label}缺失 ${item.missingCount} 次`)
            .join("，")}。建议优先优化缺失最多字段的说明、占位提示或必填策略。`
        : "当前没有明显字段缺失，字段填写质量暂时稳定。",
    fileIssues: `${fileIssueText}${recentMissingFileText}如果这些文件用于 OCR，建议在表单文案里明确图片清晰度、文件类型和必传要求。`,
    defaultResponse:
      "这一版数据页 Agent 先支持规则摘要、OCR 失败、Webhook 失败和字段缺失分析。更复杂的自然语言筛选会在后续接入。",
  };
}

export function buildFormDataAgentFilterResult(
  form: FormRecord,
  submissions: FormSubmissionRecord[],
  webhookLogs: WebhookLogRecord[],
  query: string
): FormDataAgentFilterResult | undefined {
  const normalized = query.toLowerCase();

  if (/ocr|识别/.test(normalized) && /失败|异常|failed|error/.test(normalized)) {
    const matchedSubmissionUuids = submissions
      .filter((submission) => submission.ocr_status === "failed")
      .map((submission) => submission.uuid);

    return {
      type: "ocr_failed",
      label: "OCR 失败记录",
      matchedSubmissionUuids,
      matchedCount: matchedSubmissionUuids.length,
      reason: "筛选 ocr_status 为 failed 的提交。",
    };
  }

  if (/webhook|推送|通知/.test(normalized) && /失败|异常|failed|error/.test(normalized)) {
    const matchedSubmissionUuids = Array.from(
      new Set(
        webhookLogs
          .filter((log) => log.status === "failed")
          .map((log) => log.submission_uuid)
      )
    );

    return {
      type: "webhook_failed",
      label: "Webhook 失败记录",
      matchedSubmissionUuids,
      matchedCount: matchedSubmissionUuids.length,
      reason: "筛选存在 failed Webhook 日志的提交。",
    };
  }

  const asksMissing =
    /没有|未|没|缺失|漏|为空|空值|missing|empty/i.test(query);
  const asksFile = /文件|图片|上传|发票|票据|附件|pdf|file|image|receipt|invoice/i.test(query);

  if (asksMissing && asksFile) {
    const fileField = findQueriedField(form, query, (field) =>
      isFileField(field.type)
    );
    const fileFields = fileField
      ? [fileField]
      : form.schema_json.fields.filter((field) => isFileField(field.type));

    const matchedSubmissionUuids = submissions
      .filter((submission) =>
        fileFields.some((field) => !submissionHasFileForField(submission, field.key))
      )
      .map((submission) => submission.uuid);
    const fieldLabel = fileField?.label || "文件/图片字段";

    return {
      type: "missing_file",
      label: `未上传${fieldLabel}`,
      matchedSubmissionUuids,
      matchedCount: matchedSubmissionUuids.length,
      reason: `筛选缺少「${fieldLabel}」上传文件的提交。`,
    };
  }

  if (asksMissing || /字段|漏填|没填|缺失|为空|空值/i.test(query)) {
    const answerField = findQueriedField(
      form,
      query,
      (field) => !isFileField(field.type)
    );
    const answerFields = answerField
      ? [answerField]
      : form.schema_json.fields.filter((field) => !isFileField(field.type));

    const matchedSubmissionUuids = submissions
      .filter((submission) =>
        answerFields.some((field) =>
          isMissingAnswer(submission.answers_json?.[field.key])
        )
      )
      .map((submission) => submission.uuid);
    const fieldLabel = answerField?.label || "普通字段";

    return {
      type: "missing_answer",
      label: `${fieldLabel}缺失记录`,
      matchedSubmissionUuids,
      matchedCount: matchedSubmissionUuids.length,
      reason: `筛选「${fieldLabel}」为空或缺失的提交。`,
    };
  }

  if (/失败|failed|异常/.test(normalized)) {
    const matchedSubmissionUuids = submissions
      .filter((submission) => submission.status === "failed")
      .map((submission) => submission.uuid);

    return {
      type: "submission_status",
      label: "失败提交",
      matchedSubmissionUuids,
      matchedCount: matchedSubmissionUuids.length,
      reason: "筛选 status 为 failed 的提交。",
    };
  }

  if (/完成|成功|completed|success/.test(normalized)) {
    const matchedSubmissionUuids = submissions
      .filter((submission) => submission.status === "completed")
      .map((submission) => submission.uuid);

    return {
      type: "submission_status",
      label: "已完成提交",
      matchedSubmissionUuids,
      matchedCount: matchedSubmissionUuids.length,
      reason: "筛选 status 为 completed 的提交。",
    };
  }

  return undefined;
}

function buildFilterAnswer(filter: FormDataAgentFilterResult) {
  return [
    `已按「${filter.label}」筛选，匹配 ${filter.matchedCount} 条提交。`,
    `匹配记录：${formatSubmissionRefs(filter.matchedSubmissionUuids)}。`,
    `筛选依据：${filter.reason}`,
    "当前版本先返回可解释筛选结果；后续可以把这份 filter 结果联动到右侧表格高亮或过滤。",
  ].join("\n");
}

export function answerFormDataAgentQueryWithContext(
  query: string,
  form: FormRecord,
  submissions: FormSubmissionRecord[],
  webhookLogs: WebhookLogRecord[]
): FormDataAgentQueryResult {
  const summary = buildFormDataAgentSummary(form, submissions, webhookLogs);
  const filter = buildFormDataAgentFilterResult(
    form,
    submissions,
    webhookLogs,
    query
  );

  if (filter) {
    return {
      answer: buildFilterAnswer(filter),
      summary,
      filter,
    };
  }

  return {
    answer: answerFormDataAgentQuery(query, summary),
    summary,
  };
}

export function answerFormDataAgentQuery(
  query: string,
  summary: FormDataAgentSummary
) {
  const normalized = query.toLowerCase();
  const responses = buildFormDataAgentResponses(summary);

  if (
    ["ocr", "识别"].some((keyword) =>
      normalized.includes(keyword)
    )
  ) {
    return responses.ocrFailures;
  }

  if (
    ["webhook", "推送", "通知", "失败原因"].some((keyword) =>
      normalized.includes(keyword)
    )
  ) {
    return responses.webhookFailures;
  }

  if (
    ["文件", "图片", "上传", "发票", "票据", "附件", "pdf"].some((keyword) =>
      normalized.includes(keyword)
    )
  ) {
    return responses.fileIssues;
  }

  if (
    ["缺失", "字段", "漏填", "没填"].some((keyword) =>
      normalized.includes(keyword)
    )
  ) {
    return responses.missingFields;
  }

  if (
    ["总结", "最近", "提交", "情况", "数据", "统计"].some((keyword) =>
      normalized.includes(keyword)
    )
  ) {
    return responses.summary;
  }

  return responses.defaultResponse;
}
