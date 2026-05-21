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

const formFieldOptionSchema = z.object({
  label: z.string().min(1),
  value: z.string().min(1),
});

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
});

const generatedFormSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional().default(""),
  theme: z.enum(["minimal", "business", "dark", "brutalism", "retro"]).optional().default("minimal"),
  schema: z.object({
    layout: z.enum(["single", "long"]).optional().default("single"),
    fields: z.array(formFieldSchema).min(1).max(12),
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

  return nextField;
}

export function normalizeGeneratedSchema(input: unknown): FormSchema {
  const parsed = z
    .object({
      layout: z.enum(["single", "long"]).optional().default("single"),
      fields: z.array(formFieldSchema).min(1).max(12),
    })
    .parse(input);

  return {
    layout: parsed.layout,
    fields: parsed.fields.map((field, index) => sanitizeField(field, index)),
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
  model?: string
): GeneratedFormDraft {
  const title = inferTitle(prompt);
  const schema = normalizeGeneratedSchema({
    fields: inferFallbackFields(prompt),
  });

  return {
    title,
    description: inferFallbackDescription(prompt),
    theme,
    schema,
    source: "fallback",
    provider,
    model,
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

function hasFieldLimitIntent(prompt: string) {
  return inferRequestedFieldLimit(prompt) !== undefined;
}

function hasRemoveFieldIntent(prompt: string) {
  return /删除|移除|去掉|不要|删掉|remove|delete/i.test(prompt);
}

function hasAddCommonFieldIntent(prompt: string) {
  return /手机|手机号|电话|联系电话|phone|mobile|邮箱|邮件|email|预算|价格|费用|budget|price|简历|resume|cv|附件|文件|合同|file|attachment|发票|票据|invoice|receipt/i.test(prompt);
}

function hasRequiredRuleIntent(prompt: string) {
  return /必填|必传|required|选填|非必填|可不填|optional/i.test(prompt);
}

function hasFieldTypeIntent(prompt: string) {
  return (
    /改成|改为|换成|设为|设置为|类型|replace|change/i.test(prompt) &&
    /单选|多选|下拉|选择|文本|多行|数字|邮箱|日期|附件|文件|图片|照片|pdf|radio|checkbox|select|text|textarea|number|email|date|file|image/i.test(prompt)
  );
}

function hasDeterministicRevisionIntent(prompt: string) {
  return (
    isReplacingPhoneWithEmail(prompt) ||
    hasRemoveFieldIntent(prompt) ||
    hasFieldLimitIntent(prompt) ||
    hasAddCommonFieldIntent(prompt) ||
    hasRequiredRuleIntent(prompt) ||
    hasFieldTypeIntent(prompt)
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

function inferRevisionFallbackFields(
  prompt: string,
  existingSchema: FormSchema
): FormFieldSchema[] {
  let fields: FormFieldSchema[] = existingSchema.fields.map(cloneField);

  fields = replacePhoneFieldWithEmail(prompt, fields);
  fields = removeRequestedFields(prompt, fields);
  fields = updateRequiredRules(prompt, fields);
  fields = updateFieldTypes(prompt, fields);

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
  return {
    title: existingTitle?.trim() || "已更新的表单草稿",
    description:
      existingDescription?.trim() ||
      `根据修改需求“${prompt.trim()}”保留并调整的表单草稿。`,
    theme,
    schema: normalizeGeneratedSchema({
      layout: existingSchema.layout || "single",
      fields: inferRevisionFallbackFields(prompt, existingSchema),
    }),
    source: "fallback",
    provider,
    model,
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
  }
): Promise<GeneratedFormDraft> {
  const trimmedPrompt = prompt.trim();
  if (!trimmedPrompt) {
    throw new Error("prompt is required");
  }

  const providerConfig = resolveLlmProviderConfig(options);

  if (options?.existingSchema && hasDeterministicRevisionIntent(trimmedPrompt)) {
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
      providerConfig.model
    );
  }

  try {
    const { text } = await generateText({
      model: getLanguageModel(providerConfig),
      prompt: `
你是一个 AI 表单设计助手。请根据用户需求输出严格 JSON，不要输出解释。
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
返回格式必须包含 "title"、"description"、"theme" 和 "schema" 四个顶级字段。
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
用户需求：${trimmedPrompt}
`,
    });

    const parsed = generatedFormSchema.parse(
      JSON.parse(extractJsonPayload(text))
    );

    return {
      title: parsed.title.trim(),
      description: parsed.description.trim(),
      theme: parsed.theme,
      schema: normalizeGeneratedSchema(parsed.schema),
      source: "ai",
      provider: providerConfig.provider,
      model: providerConfig.model,
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
      providerConfig.model
    );
  }
}
