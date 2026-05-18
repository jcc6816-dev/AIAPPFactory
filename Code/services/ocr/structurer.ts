import { generateText } from "ai";
import { z } from "zod";

import { OcrResultPayload } from "@/types/form";
import { getLanguageModel, resolveLlmProviderConfig } from "@/services/llm/provider";

const structuredOcrSchema = z.object({
  summary: z.string().optional().default(""),
  structured_data: z.record(z.any()).optional().default({}),
});

const DEFAULT_OCR_LLM_MAX_CHARS = 2500;
const DEFAULT_OCR_LLM_MIN_CHARS = 20;

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

export function getOcrTemplateGuidance(template?: string) {
  switch (template) {
    case "invoice":
      return `
请优先提取并放入 structured_data.fields：
- invoice_no / 发票号码
- invoice_code / 发票代码
- amount / 金额
- tax_amount / 税额
- total_amount / 价税合计
- invoice_date / 开票日期
- payee / 销售方
- purchaser / 购买方
`;
    case "receipt":
      return `
请优先提取并放入 structured_data.fields：
- merchant_name / 商户名称
- amount / 金额
- receipt_date / 日期
- receipt_time / 时间
- order_no / 订单号
- payment_method / 支付方式
`;
    case "id_card":
      return `
请优先提取并放入 structured_data.fields：
- name / 姓名
- id_number / 证件号
- gender / 性别
- nationality / 民族
- birth_date / 出生日期
- address / 地址
`;
    default:
      return `
请优先提取最清晰、最稳定的字段，并统一放入 structured_data.fields。
如果无法判断文档类型，请将 document_type 设为 unknown。
`;
  }
}

function getStructuredFieldHints(template?: string) {
  switch (template) {
    case "invoice":
      return [
        "invoice_no",
        "invoice_code",
        "amount",
        "tax_amount",
        "total_amount",
        "invoice_date",
        "payee",
        "purchaser",
      ];
    case "receipt":
      return [
        "merchant_name",
        "amount",
        "receipt_date",
        "receipt_time",
        "order_no",
        "payment_method",
      ];
    case "id_card":
      return [
        "name",
        "id_number",
        "gender",
        "nationality",
        "birth_date",
        "address",
      ];
    default:
      return ["document_type", "fields"];
  }
}

export function sanitizeOcrRawText(rawText: string) {
  return rawText
    .replace(/\r/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .replace(/[ \t]{2,}/g, " ")
    .trim();
}

export function trimOcrRawTextForLlm(
  rawText: string,
  maxChars = Number(process.env.OCR_LLM_MAX_CHARS || DEFAULT_OCR_LLM_MAX_CHARS)
) {
  const cleaned = sanitizeOcrRawText(rawText);
  if (cleaned.length <= maxChars) {
    return cleaned;
  }

  return `${cleaned.slice(0, Math.max(0, maxChars)).trim()}\n...[truncated]`;
}

export function shouldStructureOcrRawText(
  rawText: string,
  minChars = Number(process.env.OCR_LLM_MIN_CHARS || DEFAULT_OCR_LLM_MIN_CHARS)
) {
  return sanitizeOcrRawText(rawText).length >= minChars;
}

export async function structureOcrResultWithLlm(
  result: OcrResultPayload,
  options?: {
    template?: string;
  }
): Promise<OcrResultPayload> {
  const rawText = trimOcrRawTextForLlm(result.raw_text || "");
  if (!rawText) {
    return result;
  }

  if (!shouldStructureOcrRawText(rawText)) {
    return {
      ...result,
      raw_text: rawText,
      summary: result.summary || rawText,
    };
  }

  const providerConfig = resolveLlmProviderConfig({
    provider: "deepseek",
  });

  if (!providerConfig.isConfigured) {
    return result;
  }

  try {
    const { text } = await generateText({
      model: getLanguageModel(providerConfig),
      prompt: `
你是一个 OCR 文档结构化助手。请基于给出的 OCR 原始文本，输出严格 JSON，不要输出任何解释、Markdown 或额外文字。
当前文档模板：${options?.template || "general_image"}。
${getOcrTemplateGuidance(options?.template)}
请只返回最小必要字段，优先使用这些 keys：
${getStructuredFieldHints(options?.template).join(", ")}
返回格式：
{
  "summary": "一句话摘要",
  "structured_data": {
    "document_type": "可选，例如 invoice/receipt/form/unknown",
    "fields": {
      "key": "value"
    }
  }
}

OCR 原始文本：
${rawText}
`,
    });

    const parsed = structuredOcrSchema.parse(
      JSON.parse(extractJsonPayload(text))
    );

    return {
      ...result,
      summary: parsed.summary || result.summary || "",
      structured_data: parsed.structured_data || {},
      provider_payload: {
        ...(result.provider_payload || {}),
        llm_provider: providerConfig.provider,
        llm_model: providerConfig.model,
      },
    };
  } catch (error) {
    console.log("structure OCR result with LLM failed:", error);
    return result;
  }
}
