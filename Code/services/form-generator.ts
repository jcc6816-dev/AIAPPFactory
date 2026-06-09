import fs from "fs";
import path from "path";

import {
  GeneratedFormDraft,
  FormFieldSchema,
  FormSchema,
  LlmProvider,
  FormTheme,
} from "@/types/form";

import { generateText } from "ai";
import { z } from "zod";

import {
  getLanguageModel,
  resolveLlmProviderConfig,
} from "./llm/provider";
import { buildFormArtifactMetadata } from "./form-artifact";

function buildDraftArtifact(input: {
  prompt: string;
  theme: FormTheme;
  schema: FormSchema;
  source: GeneratedFormDraft["source"];
  provider?: LlmProvider;
  model?: string;
  clarifications?: Record<string, string>;
}) {
  return buildFormArtifactMetadata({
    schema: input.schema,
    theme: input.theme,
    status: "draft",
    generation: {
      source: input.source,
      provider: input.provider,
      model: input.model,
      prompt: input.prompt,
      clarification_answers: input.clarifications,
    },
  });
}

const formFieldOptionSchema = z.object({
  label: z.string().min(1),
  value: z.string().min(1),
});

const illustrationKeySchema = z.enum([
  "aurora-sphere",
  "ai-planet-pass",
  "3d-emoji-nps",
  "radar-scan",
  "cozy-calendar",
  "invoice-stack",
  "terminal-log",
  "waitlist-rocket",
]);

const formThemeSchema = z.enum([
  "minimal",
  "business",
  "dark",
  "brutalism",
  "retro",
  "moss",
  "sunset",
  "neon",
]);

const visualDirectionSchema = z.enum([
  "premium-event",
  "corporate-intake",
  "creator-launch",
  "finance-ops",
  "warm-feedback",
]);

const formFieldSchema = z.object({
  key: z.string().min(1),
  label: z.string().min(1),
  type: z.enum([
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
  ]),
  required: z.boolean().optional().default(false),
  placeholder: z.string().optional().default(""),
  help_text: z.string().optional().default(""),
  options: z.array(formFieldOptionSchema).optional().default([]),
  image: illustrationKeySchema.optional(),
  imagePosition: z.enum(["left", "right"]).optional(),
});

const aspectsSchema = z.object({
  welcomeImage: illustrationKeySchema.optional(),
  welcomeImagePosition: z.enum(["left", "right"]).optional(),
  themeVariant: z.enum(["default", "glass", "gradient-flow"]).optional(),
  visualDirection: visualDirectionSchema.optional(),
  preferredDevice: z.enum(["phone", "desktop"]).optional(),
});

const generatedFormSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional().default(""),
  theme: formThemeSchema.optional().default("minimal"),
  schema: z.object({
    layout: z.enum(["single", "long"]).optional().default("single"),
    fields: z.array(formFieldSchema).min(1).max(12),
    aspects: aspectsSchema.optional(),
  }),
});

function buildFieldKey(label: string, index: number) {
  const normalized = label
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\u4e00-\u9fa5]+/g, "_")
    .replace(/^_+|_+$/g, "");

  return normalized || `field_${index + 1}`;
}

function sanitizeField(field: FormFieldSchema, index: number): FormFieldSchema {
  const nextField: FormFieldSchema = {
    key: buildFieldKey(field.key || field.label, index),
    label: field.label.trim(),
    type: field.type,
    required: Boolean(field.required),
  };

  if (field.placeholder) {
    nextField.placeholder = field.placeholder.trim();
  }

  if (field.help_text) {
    nextField.help_text = field.help_text.trim();
  }

  if (
    (field.type === "select" || field.type === "radio" || field.type === "checkbox") &&
    field.options &&
    field.options.length > 0
  ) {
    nextField.options = field.options
      .filter((option) => option.label && option.value)
      .map((option) => ({
        label: option.label.trim(),
        value: option.value.trim(),
      }));
  }

  if (field.image) {
    nextField.image = field.image;
  }

  if (field.imagePosition) {
    nextField.imagePosition = field.imagePosition;
  }

  return nextField;
}

export function normalizeGeneratedSchema(input: unknown): FormSchema {
  const parsed = z
    .object({
      layout: z.enum(["single", "long"]).optional().default("single"),
      fields: z.array(formFieldSchema).min(1).max(12),
      aspects: aspectsSchema.optional(),
    })
    .parse(input);

  return {
    layout: parsed.layout,
    fields: parsed.fields.map((field, index) => sanitizeField(field, index)),
    aspects: parsed.aspects,
  };
}

function inferTitle(prompt: string) {
  if (/票据|发票|报销|invoice|receipt/i.test(prompt)) {
    return "票据识别与资料收集";
  }

  if (/报名|预约|登记|registration|booking/i.test(prompt)) {
    return "报名与预约信息收集";
  }

  if (/反馈|满意度|评价|survey|feedback/i.test(prompt)) {
    return "反馈与满意度收集";
  }

  return "AI 生成信息收集表单";
}

function inferFallbackDescription(prompt: string) {
  return `根据需求“${prompt.trim()}”生成的表单草稿，可继续调整字段。`;
}

function buildInvoiceFallbackFields(): FormFieldSchema[] {
  return [
    {
      key: "applicant_name",
      label: "申请人姓名",
      type: "text",
      required: true,
      placeholder: "请输入申请人姓名",
    },
    {
      key: "contact_mobile",
      label: "联系电话",
      type: "text",
      required: true,
      placeholder: "请输入联系电话",
    },
    {
      key: "invoice_image",
      label: "票据图片",
      type: "image",
      required: true,
      help_text: "支持上传票据或发票图片。",
    },
    {
      key: "remark",
      label: "补充说明",
      type: "textarea",
      required: false,
      placeholder: "请输入报销说明或补充信息",
    },
  ];
}

function buildRegistrationFallbackFields(): FormFieldSchema[] {
  return [
    {
      key: "participant_name",
      label: "姓名",
      type: "text",
      required: true,
      placeholder: "请输入姓名",
    },
    {
      key: "contact_mobile",
      label: "联系电话",
      type: "text",
      required: true,
      placeholder: "请输入联系电话",
    },
    {
      key: "attendee_count",
      label: "参与人数",
      type: "number",
      required: true,
      placeholder: "请输入参与人数",
    },
    {
      key: "remark",
      label: "备注",
      type: "textarea",
      required: false,
      placeholder: "请输入补充说明",
    },
  ];
}

function buildFeedbackFallbackFields(): FormFieldSchema[] {
  return [
    {
      key: "customer_name",
      label: "姓名",
      type: "text",
      required: false,
      placeholder: "请输入姓名",
    },
    {
      key: "contact_email",
      label: "联系邮箱",
      type: "email",
      required: false,
      placeholder: "请输入联系邮箱",
    },
    {
      key: "satisfaction_level",
      label: "满意度",
      type: "radio",
      required: true,
      options: [
        { label: "非常满意", value: "very_satisfied" },
        { label: "满意", value: "satisfied" },
        { label: "一般", value: "neutral" },
        { label: "需改进", value: "needs_improvement" },
      ],
    },
    {
      key: "feedback_content",
      label: "反馈内容",
      type: "textarea",
      required: true,
      placeholder: "请填写你的反馈或建议",
    },
  ];
}

function buildGenericFallbackFields(): FormFieldSchema[] {
  return [
    {
      key: "applicant_name",
      label: "姓名",
      type: "text",
      required: true,
      placeholder: "请输入姓名",
    },
    {
      key: "contact_mobile",
      label: "联系电话",
      type: "text",
      required: true,
      placeholder: "请输入联系电话",
    },
    {
      key: "attachment_file",
      label: "附件文件",
      type: "file",
      required: false,
      help_text: "如有附件，可一并上传。",
    },
    {
      key: "remark",
      label: "补充说明",
      type: "textarea",
      required: false,
      placeholder: "请输入补充说明",
    },
  ];
}

function inferFallbackFields(prompt: string): FormFieldSchema[] {
  if (/票据|发票|报销|invoice|receipt/i.test(prompt)) {
    return buildInvoiceFallbackFields();
  }

  if (/报名|预约|登记|registration|booking/i.test(prompt)) {
    return buildRegistrationFallbackFields();
  }

  if (/反馈|满意度|评价|survey|feedback/i.test(prompt)) {
    return buildFeedbackFallbackFields();
  }

  return buildGenericFallbackFields();
}

export function buildFallbackGeneratedForm(
  prompt: string,
  theme: FormTheme = "minimal",
  provider: LlmProvider = "openai",
  model?: string,
  clarifications?: Record<string, string>
): GeneratedFormDraft {
  const title = inferTitle(prompt);
  let fields = inferFallbackFields(prompt);

  // Apply customizations dynamically based on local fallback Q&A selections
  if (clarifications) {
    if (clarifications["need_upload"] === "required_image") {
      if (!fields.some((f) => f.type === "image")) {
        fields.push({
          key: "invoice_image",
          label: "请上传票据或发票图片",
          type: "image",
          required: true,
          help_text: "支持上传票据、发票或收据图片。",
        });
      } else {
        fields = fields.map((f) => (f.type === "image" ? { ...f, required: true } : f));
      }
    } else if (clarifications["need_upload"] === "required_pdf") {
      if (!fields.some((f) => f.type === "pdf")) {
        fields.push({
          key: "invoice_pdf",
          label: "请上传 PDF 电子凭证",
          type: "pdf",
          required: true,
          help_text: "请上传发票或收据的 PDF 电子文件。",
        });
      }
    } else if (clarifications["need_upload"] === "optional") {
      fields = fields.map((f) =>
        f.type === "image" || f.type === "pdf" || f.type === "file"
          ? { ...f, required: false }
          : f
      );
    }

    if (clarifications["need_contact"] === "phone_and_email") {
      if (!fields.some((f) => f.type === "email" || f.key.includes("email"))) {
        fields.push({ key: "email", label: "电子邮箱", type: "email", required: true });
      }
      if (!fields.some((f) => f.label.includes("电话") || f.key.includes("phone"))) {
        fields.push({ key: "phone", label: "联系电话", type: "text", required: true });
      }
    } else if (clarifications["need_contact"] === "phone_only") {
      fields = fields.filter((f) => !(f.type === "email" || f.key.includes("email")));
      if (!fields.some((f) => f.label.includes("电话") || f.key.includes("phone"))) {
        fields.push({ key: "phone", label: "联系电话", type: "text", required: true });
      }
    } else if (clarifications["need_contact"] === "wechat_only") {
      fields = fields.filter((f) => !(f.type === "email" || f.key.includes("email")));
      if (!fields.some((f) => f.label.includes("微信") || f.key.includes("wechat"))) {
        fields.push({
          key: "wechat",
          label: "微信号",
          type: "text",
          required: true,
          placeholder: "请输入微信号以方便邀请入群",
        });
      }
    }
  }

  const schema = normalizeGeneratedSchema({
    fields,
  });
  const source = "fallback";

  return {
    title,
    description: inferFallbackDescription(prompt),
    theme,
    schema,
    source,
    provider,
    model,
    artifact: buildDraftArtifact({
      prompt,
      theme,
      schema,
      source,
      provider,
      model,
      clarifications,
    }),
  };
}

function hasField(schema: FormSchema, key: string) {
  return schema.fields.some((field) => field.key === key);
}

function cloneField(field: FormFieldSchema): FormFieldSchema {
  return {
    ...field,
    options: field.options ? field.options.map((option) => ({ ...option })) : undefined,
  };
}

function normalizeTextForMatch(value: string) {
  return value.toLowerCase().replace(/\s+/g, "");
}

function fieldMatchesPrompt(field: FormFieldSchema, prompt: string) {
  const normalizedPrompt = normalizeTextForMatch(prompt);
  const candidates = [
    field.key,
    field.label,
    field.placeholder || "",
    field.help_text || "",
  ]
    .filter(Boolean)
    .map(normalizeTextForMatch);

  return candidates.some((candidate) => candidate && normalizedPrompt.includes(candidate));
}

function fieldSemanticallyMatchesPrompt(field: FormFieldSchema, prompt: string) {
  if (fieldMatchesPrompt(field, prompt)) {
    return true;
  }

  const isEmailField =
    field.type === "email" ||
    /email|mail/i.test(field.key) ||
    /邮箱|邮件/.test(field.label);
  if (isEmailField && /邮箱|邮件|email/i.test(prompt)) {
    return true;
  }

  const isPhoneField =
    /phone|mobile|tel/i.test(field.key) ||
    /电话|手机|手机号|联系电话/.test(field.label);
  if (isPhoneField && /电话|手机|手机号|联系电话|phone|mobile/i.test(prompt)) {
    return true;
  }

  const isBudgetField =
    /budget|price|cost|fee/i.test(field.key) ||
    /预算|价格|费用/.test(field.label);
  if (isBudgetField && /预算|价格|费用|budget|price|cost/i.test(prompt)) {
    return true;
  }

  const isAttachmentField =
    ["file", "image", "pdf"].includes(field.type) ||
    /file|attachment|invoice|receipt|image|pdf/i.test(field.key) ||
    /附件|文件|合同|发票|票据|图片|照片|上传/.test(field.label);
  if (isAttachmentField && /附件|文件|合同|发票|票据|图片|照片|上传|file|attachment|image|pdf/i.test(prompt)) {
    return true;
  }

  return false;
}

function inferRequestedFieldLimit(prompt: string) {
  if (!/精简|减少|保留|控制|只要|最多|limit|shorten/i.test(prompt)) {
    return undefined;
  }

  const match = prompt.match(/(\d+)\s*(?:个|道|项|题|fields?|questions?)/i);
  if (!match?.[1]) {
    return undefined;
  }

  const limit = Number(match[1]);
  if (!Number.isFinite(limit) || limit < 1) {
    return undefined;
  }

  return Math.min(limit, 12);
}

function hasRemoveFieldIntent(prompt: string) {
  return /删除|移除|去掉|不要|删掉|remove|delete/i.test(prompt);
}

function hasFieldTypeIntent(prompt: string) {
  return (
    /改成|改为|换成|设为|设置为|类型|replace|change/i.test(prompt) &&
    /单选|多选|下拉|选择|文本|多行|数字|邮箱|日期|附件|文件|图片|照片|pdf|radio|checkbox|select|text|textarea|number|email|date|file|image/i.test(prompt)
  );
}

function hasFieldCopyIntent(prompt: string) {
  return (
    /文案|问题|标题|label|占位|placeholder|提示|帮助|help/i.test(prompt) &&
    /改成|改为|换成|设为|设置为|replace|change/i.test(prompt)
  );
}

function hasChoiceOptionsIntent(prompt: string) {
  return (
    /选项|options?/i.test(prompt) &&
    /改成|改为|换成|设为|设置为|增加|新增|添加|replace|change|add/i.test(prompt)
  );
}

export function isInspectionOnlyFormRevision(prompt: string) {
  return (
    /检查|评估|分析|建议|诊断|看看|是否|有没有|太长|过长|check|review|inspect|analy[sz]e/i.test(prompt) &&
    /表单|字段|问题|体验|太长|过长|移动端|填写|schema|form|field|question/i.test(prompt) &&
    !/新增|增加|添加|删除|移除|去掉|不要|改成|改为|换成|设为|设置为|必填|选填|add|remove|delete|replace|change|required|optional/i.test(prompt)
  );
}

function removeRequestedFields(prompt: string, fields: FormFieldSchema[]) {
  if (!/删除|移除|去掉|不要|删掉|remove|delete/i.test(prompt)) {
    return fields;
  }

  const nextFields = fields.filter((field) => !fieldMatchesPrompt(field, prompt));
  return nextFields.length > 0 ? nextFields : fields;
}

function isReplacingPhoneWithEmail(prompt: string) {
  return (
    /邮箱|邮件|email/i.test(prompt) &&
    /电话|手机|手机号|联系电话|phone|mobile/i.test(prompt) &&
    /改成|改为|替换|换成|replace|change/i.test(prompt)
  );
}

function replacePhoneFieldWithEmail(prompt: string, fields: FormFieldSchema[]) {
  if (!isReplacingPhoneWithEmail(prompt)) {
    return fields;
  }

  let replaced = false;
  const nextFields = fields.map((field) => {
    const isPhoneField =
      /phone|mobile|tel/i.test(field.key) ||
      /电话|手机|手机号/.test(field.label);

    if (!isPhoneField || replaced) {
      return field;
    }

    replaced = true;
    return {
      ...field,
      key: "contact_email",
      label: "你的邮箱是？",
      type: "email" as const,
      required: field.required ?? true,
      placeholder: "请输入常用邮箱",
      help_text: field.help_text || "用于接收后续通知或办理进度。",
      options: undefined,
    };
  });

  return nextFields;
}

function inferRequiredValue(prompt: string) {
  if (/选填|非必填|可不填|optional/i.test(prompt)) {
    return false;
  }

  if (/必填|必传|required/i.test(prompt)) {
    return true;
  }

  return undefined;
}

function hasAllFieldsIntent(prompt: string) {
  return /所有|全部|每个|全都|all/i.test(prompt);
}

function updateRequiredRules(prompt: string, fields: FormFieldSchema[]) {
  const requiredValue = inferRequiredValue(prompt);
  if (requiredValue === undefined) {
    return fields;
  }

  if (hasAllFieldsIntent(prompt)) {
    return fields.map((field) => ({
      ...field,
      required: requiredValue,
    }));
  }

  let updated = false;
  const nextFields = fields.map((field) => {
    if (!fieldSemanticallyMatchesPrompt(field, prompt)) {
      return field;
    }

    updated = true;
    return {
      ...field,
      required: requiredValue,
    };
  });

  return updated ? nextFields : fields;
}

function inferRequestedFieldType(prompt: string): FormFieldSchema["type"] | undefined {
  if (/多选|checkbox/i.test(prompt)) {
    return "checkbox";
  }

  if (/单选|radio/i.test(prompt)) {
    return "radio";
  }

  if (/下拉|select/i.test(prompt)) {
    return "select";
  }

  if (/多行|长文本|textarea/i.test(prompt)) {
    return "textarea";
  }

  if (/数字|金额|number/i.test(prompt)) {
    return "number";
  }

  if (/邮箱|邮件|email/i.test(prompt)) {
    return "email";
  }

  if (/日期|date/i.test(prompt)) {
    return "date";
  }

  if (/图片|照片|image/i.test(prompt)) {
    return "image";
  }

  if (/pdf/i.test(prompt)) {
    return "pdf";
  }

  if (/附件|文件|file/i.test(prompt)) {
    return "file";
  }

  if (/文本|text/i.test(prompt)) {
    return "text";
  }

  return undefined;
}

function defaultOptionsForType(type: FormFieldSchema["type"]) {
  if (type === "checkbox") {
    return [
      { label: "选项 A", value: "option_a" },
      { label: "选项 B", value: "option_b" },
    ];
  }

  if (type === "radio" || type === "select") {
    return [
      { label: "是", value: "yes" },
      { label: "否", value: "no" },
    ];
  }

  return undefined;
}

function updateFieldTypes(prompt: string, fields: FormFieldSchema[]) {
  if (!hasFieldTypeIntent(prompt)) {
    return fields;
  }

  const requestedType = inferRequestedFieldType(prompt);
  if (!requestedType) {
    return fields;
  }

  let updated = false;
  const nextFields = fields.map((field) => {
    if (!fieldSemanticallyMatchesPrompt(field, prompt)) {
      return field;
    }

    updated = true;
    const options = defaultOptionsForType(requestedType);
    return {
      ...field,
      type: requestedType,
      options,
    };
  });

  return updated ? nextFields : fields;
}

function cleanInstructionValue(value: string) {
  return value
    .trim()
    .replace(/^["'“”‘’「」『』]+|["'“”‘’「」『』。；;]+$/g, "")
    .trim();
}

function extractChangedValue(prompt: string) {
  const match = prompt.match(
    /(?:改成|改为|换成|设为|设置为|replace(?:\s+with)?|change(?:\s+to)?)\s*["'“「『]?(.+?)["'”」』]?\s*$/i
  );

  return match?.[1] ? cleanInstructionValue(match[1]) : "";
}

function updateFieldCopy(prompt: string, fields: FormFieldSchema[]) {
  if (!hasFieldCopyIntent(prompt)) {
    return fields;
  }

  const value = extractChangedValue(prompt);
  if (!value) {
    return fields;
  }

  let updated = false;
  const nextFields = fields.map((field) => {
    if (!fieldSemanticallyMatchesPrompt(field, prompt)) {
      return field;
    }

    updated = true;
    if (/占位|placeholder/i.test(prompt)) {
      return {
        ...field,
        placeholder: value,
      };
    }

    if (/提示|帮助|help/i.test(prompt)) {
      return {
        ...field,
        help_text: value,
      };
    }

    return {
      ...field,
      label: value,
    };
  });

  return updated ? nextFields : fields;
}

function buildOptionValue(label: string, index: number) {
  const normalized = label
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\u4e00-\u9fa5]+/g, "_")
    .replace(/^_+|_+$/g, "");

  return normalized || `option_${index + 1}`;
}

function extractRequestedOptions(prompt: string) {
  const raw = extractChangedValue(prompt);
  if (!raw) {
    return [];
  }

  return raw
    .split(/[、,，/|；;]/)
    .map(cleanInstructionValue)
    .filter(Boolean)
    .slice(0, 8)
    .map((label, index) => ({
      label,
      value: buildOptionValue(label, index),
    }));
}

function updateChoiceOptions(prompt: string, fields: FormFieldSchema[]) {
  if (!hasChoiceOptionsIntent(prompt)) {
    return fields;
  }

  const requestedOptions = extractRequestedOptions(prompt);
  if (requestedOptions.length === 0) {
    return fields;
  }

  let updated = false;
  const nextFields = fields.map((field) => {
    if (!fieldSemanticallyMatchesPrompt(field, prompt)) {
      return field;
    }

    updated = true;
    const nextType = ["radio", "select", "checkbox"].includes(field.type)
      ? field.type
      : "radio";

    return {
      ...field,
      type: nextType,
      options: requestedOptions,
    };
  });

  return updated ? nextFields : fields;
}

function inferRevisionFallbackFields(
  prompt: string,
  existingSchema: FormSchema
): FormFieldSchema[] {
  let fields: FormFieldSchema[] = existingSchema.fields.map(cloneField);

  fields = replacePhoneFieldWithEmail(prompt, fields);
  fields = removeRequestedFields(prompt, fields);
  fields = updateRequiredRules(prompt, fields);
  fields = updateFieldTypes(prompt, fields);
  fields = updateFieldCopy(prompt, fields);
  fields = updateChoiceOptions(prompt, fields);

  const candidates: FormFieldSchema[] = [];

  if (
    !isReplacingPhoneWithEmail(prompt) &&
    /手机|手机号|电话|联系电话|phone|mobile/i.test(prompt) &&
    !hasField({ fields }, "contact_mobile")
  ) {
    candidates.push({
      key: "contact_mobile",
      label: "你的手机号是？",
      type: "text",
      required: true,
      placeholder: "请输入方便联系的手机号",
    });
  }

  if (/邮箱|邮件|email/i.test(prompt) && !hasField({ fields }, "contact_email")) {
    candidates.push({
      key: "contact_email",
      label: "你的邮箱是？",
      type: "email",
      required: true,
      placeholder: "请输入常用邮箱",
    });
  }

  if (/预算|价格|费用|budget|price/i.test(prompt) && !hasField({ fields }, "budget_range")) {
    candidates.push({
      key: "budget_range",
      label: "你的预算范围大概是？",
      type: "radio",
      required: false,
      options: [
        { label: "先免费试用", value: "trial" },
        { label: "低预算", value: "low" },
        { label: "中等预算", value: "medium" },
        { label: "预算充足", value: "high" },
      ],
    });
  }

  if (/简历|resume|cv/i.test(prompt) && !hasField({ fields }, "resume_file")) {
    candidates.push({
      key: "resume_file",
      label: "请上传简历。",
      type: "pdf",
      required: true,
      help_text: "建议上传 PDF 格式简历。",
    });
  } else if (/附件|文件|合同|file|attachment/i.test(prompt) && !hasField({ fields }, "attachment_file")) {
    candidates.push({
      key: "attachment_file",
      label: "请上传相关附件。",
      type: "file",
      required: false,
      help_text: "如有补充材料，可一并上传。",
    });
  }

  if (/发票|票据|invoice|receipt/i.test(prompt) && !hasField({ fields }, "invoice_image")) {
    candidates.push({
      key: "invoice_image",
      label: "请上传票据或发票图片。",
      type: "image",
      required: true,
      help_text: "支持上传票据、发票或收据图片。",
    });
  }

  const remainingSlots = Math.max(0, 12 - fields.length);
  fields = fields.concat(candidates.slice(0, remainingSlots));

  const requestedLimit = inferRequestedFieldLimit(prompt);
  if (requestedLimit) {
    fields = fields.slice(0, requestedLimit);
  }

  return fields;
}

export function buildFallbackRevisedForm(
  prompt: string,
  theme: FormTheme,
  provider: LlmProvider,
  model: string | undefined,
  existingSchema: FormSchema,
  existingTitle?: string,
  existingDescription?: string
): GeneratedFormDraft {
  const inspectionOnly = isInspectionOnlyFormRevision(prompt);
  const schema = normalizeGeneratedSchema({
    layout: existingSchema.layout || "single",
    fields: inspectionOnly
      ? existingSchema.fields.map(cloneField)
      : inferRevisionFallbackFields(prompt, existingSchema),
    aspects: existingSchema.aspects,
  });
  const source = "fallback";

  return {
    title: existingTitle?.trim() || "已更新的表单草稿",
    description:
      existingDescription?.trim() ||
      `根据修改需求“${prompt.trim()}”保留并调整的表单草稿。`,
    theme,
    schema,
    source,
    provider,
    model,
    artifact: buildDraftArtifact({
      prompt,
      theme,
      schema,
      source,
      provider,
      model,
    }),
  };
}

function extractJsonPayload(text: string) {
  const fencedMatch = text.match(/```json\s*([\s\S]*?)```/i);
  if (fencedMatch?.[1]) {
    return fencedMatch[1].trim();
  }

  const firstBrace = text.indexOf("{");
  const lastBrace = text.lastIndexOf("}");
  if (firstBrace >= 0 && lastBrace > firstBrace) {
    return text.slice(firstBrace, lastBrace + 1);
  }

  return text;
}

export async function generateFormSchemaFromPrompt(
  prompt: string,
  theme: FormTheme = "minimal",
  options?: {
    provider?: LlmProvider;
    model?: string;
    existingSchema?: FormSchema;
    existingTitle?: string;
    existingDescription?: string;
    clarifications?: Record<string, string>;
    locale?: string;
  }
): Promise<GeneratedFormDraft> {
  const trimmedPrompt = prompt.trim();
  if (!trimmedPrompt) {
    throw new Error("prompt is required");
  }

  const providerConfig = resolveLlmProviderConfig(options);

  if (!providerConfig.isConfigured) {
    if (options?.existingSchema) {
      return buildFallbackRevisedForm(
        trimmedPrompt,
        theme,
        providerConfig.provider,
        providerConfig.model,
        options.existingSchema,
        options.existingTitle,
        options.existingDescription
      );
    }

    return buildFallbackGeneratedForm(
      trimmedPrompt,
      theme,
      providerConfig.provider,
      providerConfig.model,
      options?.clarifications
    );
  }


  const isEn = options?.locale?.toLowerCase().startsWith("en") ?? false;

  const clarificationsText =
    options?.clarifications && Object.keys(options.clarifications).length > 0
      ? (isEn
          ? `\nHere are the selections made by the user to clarify their requirements. You must strictly follow these constraints when generating/modifying the form:\n` +
            Object.entries(options.clarifications)
              .map(([qId, ansVal]) => `- Clarification for Question "${qId}": user chose "${ansVal}"`)
              .join("\n")
          : `\n以下是根据用户针对此需求的引导问题做出的选择，你在生成/修改表单时必须严格遵守以下限制：\n` +
            Object.entries(options.clarifications)
              .map(([qId, ansVal]) => `- 问题ID为 "${qId}" 的需求澄清，用户的回答选择是 "${ansVal}"`)
              .join("\n")) +
        "\n"
      : "";

  try {
    const systemInstruction = isEn
      ? `You are an AI form design assistant. Please output STRICT JSON based on the user's requirements without any explanation or Markdown wrapping.
${
  options?.existingSchema
    ? `The existing JSON Schema is as follows:
${JSON.stringify(
  {
    title: options.existingTitle,
    description: options.existingDescription,
    schema: options.existingSchema,
  },
  null,
  2
)}
Based on the existing Schema, adjust it according to the user's revision requirements (adding, deleting, or modifying fields), and return the completely updated JSON.
The return format MUST contain four top-level fields: "title", "description", "theme", and "schema".
The current value of theme is "${theme}".`
    : `Return Format:
{
  "title": "Form Title",
  "description": "A form description explaining the value of filling it out",
  "theme": "${theme}",
  "schema": {
    "layout": "single",
    "fields": [
      {
        "key": "field_key",
        "label": "A natural question label like a real conversational product",
        "type": "text|textarea|number|email|date|select|radio|checkbox|file|image|pdf",
        "required": true,
        "placeholder": "An engaging placeholder text",
        "help_text": "Short, concrete help text to lower form completion anxiety",
        "options": [{"label":"Option 1","value":"option_1"}]
      }
    ]
  }
}`
}
Design Constraints:
1. Generate mobile-friendly single-question flow forms by default, prioritizing "single" for schema.layout.
2. Keep the number of fields between 4 and 8, unless the user explicitly requests more.
3. Field labels should be natural questions in Typeform/v0 style. Avoid short, mechanical labels like "Name" or "Phone". Instead, use "What should we call you?".
4. Try to provide help_text or placeholder for each important field, so the user knows why they are filling it out.
5. Multiple-choice options should be short, clear, mutually exclusive, and use stable English values.
6. Choose theme automatically based on the scenario: minimal for premium meetings/salons, business for corporate/finance/government, dark for AI/tech/geek events, brutalism for trendy/youthful activities, retro for coffee/bookstore/handcraft/vintage scenes.
7. Do not output explanations, do not output Markdown. Only output valid JSON.
${clarificationsText}
User Requirements: ${trimmedPrompt}`
      : `你是一个 AI 表单设计助手。请根据用户需求输出严格 JSON，不要输出解释。
${
  options?.existingSchema
    ? `现有的 JSON Schema 如下：
${JSON.stringify(
  {
    title: options.existingTitle,
    description: options.existingDescription,
    schema: options.existingSchema,
  },
  null,
  2
)}
请基于上述现有的 Schema，根据用户的修改需求（增加、删除或修改字段）进行调整，并返回完整更新后的 JSON。
返回格式必须包含 "title"、"description"、"theme" 和 "schema" 各个顶级字段。
主题 theme 的当前值为 "${theme}"。`
    : `返回格式：
{
  "title": "表单标题",
  "description": "一句能解释填写价值的表单描述",
  "theme": "${theme}",
  "schema": {
    "layout": "single",
    "fields": [
      {
        "key": "field_key",
        "label": "像真实产品一样自然的提问文案",
        "type": "text|textarea|number|email|date|select|radio|checkbox|file|image|pdf",
        "required": true,
        "placeholder": "有引导感的占位文本",
        "help_text": "简短、具体、能降低填写焦虑的帮助文案",
        "options": [{"label":"选项1","value":"option_1"}]
      }
    ]
  }
}`
}
设计约束：
1. 默认生成移动端友好的单题流表单，schema.layout 优先使用 "single"。
2. 字段数量控制在 4 到 8 个，除非用户明确要求更多。
3. 字段 label 要像 Typeform/v0 风格的自然提问，避免“姓名”“电话”这种过短机械标签，可写成“怎么称呼你？”。
4. 每个重要字段都尽量提供 help_text 或 placeholder，让用户知道为什么要填。
5. 选择题选项要短、清晰、互斥，并使用稳定英文 value。
6. 根据场景自动选择 theme：高端会议/沙龙用 minimal，企业/金融/政务用 business，AI/科技/极客活动用 dark，潮流年轻活动用 brutalism，咖啡/书店/手作/复古场景用 retro。
7. 不要输出解释，不要输出 Markdown，只输出 JSON。
${clarificationsText}
用户需求：${trimmedPrompt}`;

    const { text } = await generateText({
      model: getLanguageModel(providerConfig),
      prompt: systemInstruction,
    });

    const parsed = generatedFormSchema.parse(
      JSON.parse(extractJsonPayload(text))
    );

    const schema = normalizeGeneratedSchema(parsed.schema);
    const source = "ai";

    return {
      title: parsed.title.trim(),
      description: parsed.description.trim(),
      theme: parsed.theme,
      schema,
      source,
      provider: providerConfig.provider,
      model: providerConfig.model,
      artifact: buildDraftArtifact({
        prompt: trimmedPrompt,
        theme: parsed.theme,
        schema,
        source,
        provider: providerConfig.provider,
        model: providerConfig.model,
        clarifications: options?.clarifications,
      }),
    };
  } catch (error) {
    console.log(
      `generate form schema failed with ${providerConfig.provider}, fallback used:`,
      error
    );
    if (options?.existingSchema) {
      return buildFallbackRevisedForm(
        trimmedPrompt,
        theme,
        providerConfig.provider,
        providerConfig.model,
        options.existingSchema,
        options.existingTitle,
        options.existingDescription
      );
    }

    return buildFallbackGeneratedForm(
      trimmedPrompt,
      theme,
      providerConfig.provider,
      providerConfig.model,
      options?.clarifications
    );
  }
}

function getLocalFallbackQuestions(prompt: string, locale: string = "zh") {
  const trimmed = prompt.toLowerCase();
  const isEn = locale.toLowerCase().startsWith("en");

  if (/票据|发票|报销|invoice|receipt/i.test(trimmed)) {
    return isEn
      ? [
          {
            id: "invoice_type",
            text: "What type of expenses is this reimbursement form mainly targeting?",
            options: [
              { label: "Travel, Transportation & Lodging", value: "travel" },
              { label: "Daily Office Purchase & Supplies", value: "office_supplies" },
              { label: "Meals & Customer Hospitality", value: "hospitality" },
            ],
          },
          {
            id: "need_upload",
            text: "Do users need to upload a receipt or invoice attachment?",
            options: [
              { label: "Yes, upload a receipt image", value: "required_image" },
              { label: "Yes, upload a PDF document", value: "required_pdf" },
              { label: "No, record the amount only", value: "optional" },
            ],
          },
        ]
      : [
          {
            id: "invoice_type",
            text: "此报销表单主要针对哪种类型的支出？",
            options: [
              { label: "差旅交通与住宿费报销", value: "travel" },
              { label: "日常办公采购及耗材", value: "office_supplies" },
              { label: "餐饮与客户招待支出", value: "hospitality" },
            ],
          },
          {
            id: "need_upload",
            text: "是否需要报销人强制上传发票/收据附件？",
            options: [
              { label: "需要上传发票图片", value: "required_image" },
              { label: "需要上传 PDF 文件", value: "required_pdf" },
              { label: "仅登记金额，不强制上传", value: "optional" },
            ],
          },
        ];
  }

  if (/报名|预约|登记|registration|booking/i.test(trimmed)) {
    return isEn
      ? [
          {
            id: "event_type",
            text: "What type of event is this registration form for?",
            options: [
              { label: "Offline Lectures / Salons / Gatherings", value: "offline_event" },
              { label: "Online Webinars / Livestreams / Courses", value: "online_webinar" },
              { label: "Internal Corporate Training / Team Building", value: "internal_event" },
            ],
          },
          {
            id: "need_contact",
            text: "How would you prefer to reach out to the participants?",
            options: [
              { label: "Collect both mobile numbers and emails", value: "phone_and_email" },
              { label: "Collect mobile numbers only (for SMS alerts)", value: "phone_only" },
              { label: "Collect WeChat IDs only (to invite into groups)", value: "wechat_only" },
            ],
          },
        ]
      : [
          {
            id: "event_type",
            text: "这是一次什么类型的报名活动？",
            options: [
              { label: "线下讲座/沙龙/聚会", value: "offline_event" },
              { label: "线上研讨会/直播/网课", value: "online_webinar" },
              { label: "企业内训/团建活动", value: "internal_event" },
            ],
          },
          {
            id: "need_contact",
            text: "您希望如何联系到报名的参与者？",
            options: [
              { label: "同时收集手机号和邮箱", value: "phone_and_email" },
              { label: "仅收集手机号，方便短信通知", value: "phone_only" },
              { label: "仅收集微信号，方便加群拉人", value: "wechat_only" },
            ],
          },
        ];
  }

  if (/反馈|满意度|评价|survey|feedback/i.test(trimmed)) {
    return isEn
      ? [
          {
            id: "survey_target",
            text: "Who is the primary target audience of this satisfaction survey?",
            options: [
              { label: "Customers who purchased/used our products", value: "product_users" },
              { label: "Customers who just completed a service/consultation", value: "service_customers" },
              { label: "Internal employees (regarding projects/canteen/management)", value: "internal_staff" },
            ],
          },
          {
            id: "rating_format",
            text: "What rating and feedback mechanism do you prefer?",
            options: [
              { label: "Star Ratings (1-5 stars/NPS) + Suggestions text", value: "stars_and_text" },
              { label: "Multi-choice Rating grids", value: "multi_choice" },
              { label: "Detailed text suggestions only", value: "text_only" },
            ],
          },
        ]
      : [
          {
            id: "survey_target",
            text: "此满意度调查的对象是？",
            options: [
              { label: "购买并使用了我们产品的客户", value: "product_users" },
              { label: "刚刚完成某次服务/接待的顾客", value: "service_customers" },
              { label: "公司内部员工（针对项目/食堂/管理）", value: "internal_staff" },
            ],
          },
          {
            id: "rating_format",
            text: "您倾向于哪种评价和反馈机制？",
            options: [
              { label: "打分（1-5星/NPS净推荐值）+ 建议", value: "stars_and_text" },
              { label: "纯文字多维度建议", value: "text_only" },
              { label: "多项选择题打分", value: "multi_choice" },
            ],
          },
        ];
  }

  return isEn
    ? [
        {
          id: "form_layout",
          text: "Under what environment will users mainly fill out this form?",
          options: [
            { label: "Mobile-first (Single question flow layout)", value: "mobile_single" },
            { label: "PC/Desktop web (PC Long-scroll form layout)", value: "pc_long" },
            { label: "Hybrid environments (balanced compatibility)", value: "hybrid" },
          ],
        },
        {
          id: "collect_frequency",
          text: "What is the expected data collection frequency?",
          options: [
            { label: "One-time small-scale collection (e.g., class registry)", value: "one_time" },
            { label: "Long-term steady collection (e.g., product feedback)", value: "long_term" },
            { label: "High-burst traffic collection (e.g., flash ticketing)", value: "high_burst" },
          ],
        },
      ]
    : [
        {
          id: "form_layout",
          text: "该表单的填写人群通常在什么环境下使用？",
          options: [
            { label: "手机移动端为主（极简单题流展示）", value: "mobile_single" },
            { label: "电脑网页端为主（平铺长表单展示）", value: "pc_long" },
            { label: "混合环境，追求高度兼容", value: "hybrid" },
          ],
        },
        {
          id: "collect_frequency",
          text: "您对该表单的数据收集频率有何预期？",
          options: [
            { label: "一次性小规模收集（如班级登记、会务统计）", value: "one_time" },
            { label: "长期稳定的大量收集（如企业线索、用户反馈）", value: "long_term" },
            { label: "临时高并发收集（如限时抢票、预约限流）", value: "high_burst" },
          ],
        },
      ];
}

export async function generateClarificationQuestions(
  prompt: string,
  options?: {
    provider?: LlmProvider;
    model?: string;
    locale?: string;
  }
): Promise<Array<{ id: string; text: string; options: Array<{ label: string; value: string }> }>> {
  const trimmedPrompt = prompt.trim();
  if (!trimmedPrompt) {
    throw new Error("prompt is required");
  }

  const providerConfig = resolveLlmProviderConfig(options);
  const locale = options?.locale || "zh";
  const isEn = locale.toLowerCase().startsWith("en");

  if (!providerConfig.isConfigured) {
    return getLocalFallbackQuestions(trimmedPrompt, locale);
  }

  try {
    let systemPrompt = `你是一个专业的 AI 表单分析专家。请根据用户想生成的表单需求（一句话需求）：“{{PROMPT}}”，分析其中含糊不清、需要补充的地方，生成 2 到 3 个针对该表单场景的澄清单选题，以便能够辅助表单生成器设计出高精准度的字段。

返回格式必须是严格 JSON 数组，每个元素包含：
- id: 问题的唯一标识字符串，如 "q1", "q2"
- text: 题干文案，必须简明扼要且非常贴合特定业务场景
- options: 选项数组，每个选项包含 label（用户看得到的选项文本）和 value（系统处理的值，简短英文/拼音）

示例输出格式：
[
  {
    "id": "invoice_type",
    "text": "您主要用于哪种报销场景？",
    "options": [
      {"label": "差旅报销（含机票/酒店/打车）", "value": "travel"},
      {"label": "日常办公采购（办公用品/设备）", "value": "office"},
      {"label": "餐饮/招待费报销", "value": "entertainment"}
    ]
  }
]

请仅输出 JSON，不要有任何 Markdown 或前导解释。`;

    try {
      const fileName = isEn ? "clarify_en.txt" : "clarify.txt";
      const promptFilePath = path.join(process.cwd(), "services/prompts", fileName);
      if (fs.existsSync(promptFilePath)) {
        systemPrompt = fs.readFileSync(promptFilePath, "utf-8");
      }
    } catch (e) {
      console.error("Failed to read clarify prompt file, using default fallback:", e);
    }

    const llmPrompt = systemPrompt.replace("{{PROMPT}}", trimmedPrompt);

    const { text } = await generateText({
      model: getLanguageModel(providerConfig),
      prompt: llmPrompt,
    });

    const parsed = z
      .array(
        z.object({
          id: z.string().min(1),
          text: z.string().min(1),
          options: z
            .array(
              z.object({
                label: z.string().min(1),
                value: z.string().min(1),
              })
            )
            .min(1),
        })
      )
      .parse(JSON.parse(extractJsonPayload(text)));

    return parsed;
  } catch (error) {
    console.error("AI generateClarificationQuestions failed, using fallback:", error);
    return getLocalFallbackQuestions(trimmedPrompt, locale);
  }
}
