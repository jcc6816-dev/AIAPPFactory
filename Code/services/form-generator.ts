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
  }
): Promise<GeneratedFormDraft> {
  const trimmedPrompt = prompt.trim();
  if (!trimmedPrompt) {
    throw new Error("prompt is required");
  }

  const providerConfig = resolveLlmProviderConfig(options);

  if (!providerConfig.isConfigured) {
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
${JSON.stringify({ schema: options.existingSchema }, null, 2)}
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
    return buildFallbackGeneratedForm(
      trimmedPrompt,
      theme,
      providerConfig.provider,
      providerConfig.model
    );
  }
}
