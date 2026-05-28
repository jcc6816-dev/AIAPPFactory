import type { FormFieldSchema, FormRecord, FormSchema } from "@/types/form";

export type PublishCheckSeverity = "error" | "warning";

export interface PublishCheckIssue {
  severity: PublishCheckSeverity;
  code: string;
  message: string;
  fieldKey?: string;
}

export interface PublishCheckResult {
  ready: boolean;
  issues: PublishCheckIssue[];
}

const supportedFieldTypes = new Set([
  "text",
  "textarea",
  "number",
  "email",
  "date",
  "select",
  "radio",
  "checkbox",
  "file",
  "image",
  "pdf",
]);

function hasValue(value?: string | null) {
  return Boolean(value && value.trim());
}

function checkChoiceOptions(field: FormFieldSchema): PublishCheckIssue[] {
  if (!["select", "radio", "checkbox"].includes(field.type)) {
    return [];
  }

  if (!field.options?.length) {
    return [
      {
        severity: "error",
        code: "choice_options_required",
        message: `字段「${field.label || field.key}」是选择题，但还没有配置选项。`,
        fieldKey: field.key,
      },
    ];
  }

  return field.options.flatMap((option, index) => {
    if (hasValue(option.label) && hasValue(option.value)) {
      return [];
    }

    return [
      {
        severity: "error" as const,
        code: "choice_option_incomplete",
        message: `字段「${field.label || field.key}」的第 ${index + 1} 个选项不完整。`,
        fieldKey: field.key,
      },
    ];
  });
}

export function validateFormSchemaForPublish(input: {
  title?: string;
  schema?: FormSchema;
  webhookEnabled?: boolean;
  webhookUrl?: string;
}): PublishCheckResult {
  const issues: PublishCheckIssue[] = [];
  const schema = input.schema;

  if (!hasValue(input.title)) {
    issues.push({
      severity: "error",
      code: "title_required",
      message: "发布前请先填写表单标题。",
    });
  }

  if (!schema || !Array.isArray(schema.fields) || schema.fields.length === 0) {
    issues.push({
      severity: "error",
      code: "fields_required",
      message: "发布前至少需要保留一个可填写字段。",
    });
  }

  const keys = new Set<string>();
  for (const field of schema?.fields || []) {
    if (!hasValue(field.key)) {
      issues.push({
        severity: "error",
        code: "field_key_required",
        message: "存在字段缺少内部标识 key，请先修复字段配置。",
      });
      continue;
    }

    if (keys.has(field.key)) {
      issues.push({
        severity: "error",
        code: "duplicate_field_key",
        message: `字段 key「${field.key}」重复，请确保每个字段都有唯一标识。`,
        fieldKey: field.key,
      });
    }
    keys.add(field.key);

    if (!hasValue(field.label)) {
      issues.push({
        severity: "error",
        code: "field_label_required",
        message: `字段「${field.key}」缺少对用户可见的问题文案。`,
        fieldKey: field.key,
      });
    }

    if (!supportedFieldTypes.has(field.type)) {
      issues.push({
        severity: "error",
        code: "unsupported_field_type",
        message: `字段「${field.label || field.key}」使用了暂不支持的类型。`,
        fieldKey: field.key,
      });
    }

    issues.push(...checkChoiceOptions(field));
  }

  if (input.webhookEnabled && !hasValue(input.webhookUrl)) {
    issues.push({
      severity: "error",
      code: "webhook_url_required",
      message: "已启用 Webhook，但还没有配置目标地址。",
    });
  }

  return {
    ready: !issues.some((issue) => issue.severity === "error"),
    issues,
  };
}

export function validateFormRecordForPublish(form: FormRecord) {
  return validateFormSchemaForPublish({
    title: form.title,
    schema: form.schema_json,
    webhookEnabled: form.webhook_enabled,
    webhookUrl: form.webhook_url,
  });
}

export function assertFormReadyToPublish(input: {
  title?: string;
  schema?: FormSchema;
  webhookEnabled?: boolean;
  webhookUrl?: string;
}) {
  const result = validateFormSchemaForPublish(input);
  if (!result.ready) {
    const message = result.issues
      .filter((issue) => issue.severity === "error")
      .map((issue) => issue.message)
      .join(" ");

    throw new Error(`发布前检查未通过：${message}`);
  }

  return result;
}
