import { FormAnswerValue, FormAnswers, FormFieldSchema, FormRecord, FormSubmissionRecord } from "@/types/form";
import { updateFormSubmissionByUuid } from "@/models/form-submission";
import { runOcrForAsset } from "../ocr/provider";
import { structureOcrResultWithLlm } from "../ocr/structurer";

import { SkillExecutionResult } from "../skill";

function normalizeLookupKey(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\u4e00-\u9fa5]+/g, "_")
    .replace(/^_+|_+$/g, "");
}

function detectConceptAliases(field: FormFieldSchema, template?: string) {
  const source = `${field.key} ${field.label}`.toLowerCase();
  const aliases = new Set<string>();

  const addAliases = (items: string[]) => {
    for (const item of items) {
      aliases.add(normalizeLookupKey(item));
    }
  };

  if (
    /invoice|发票|票号|号码/.test(source) &&
    /no|number|号码|票号|invoice/.test(source)
  ) {
    addAliases(["invoice_no", "invoice_number", "发票号码", "票号"]);
  }

  if (/invoice|发票|代码/.test(source) && /code|代码/.test(source)) {
    addAliases(["invoice_code", "发票代码"]);
  }

  if (/amount|金额|合计|total/.test(source)) {
    addAliases(["amount", "金额", "total_amount", "价税合计"]);
  }

  if (/tax|税额/.test(source)) {
    addAliases(["tax_amount", "税额"]);
  }

  if (/date|日期|时间|开票/.test(source)) {
    addAliases(["date", "invoice_date", "receipt_date", "开票日期", "日期"]);
  }

  if (/time|时间/.test(source)) {
    addAliases(["receipt_time", "time", "时间"]);
  }

  if (/merchant|store|商户|门店/.test(source)) {
    addAliases(["merchant_name", "商户名称", "门店名称"]);
  }

  if (/name|姓名/.test(source)) {
    addAliases(["name", "姓名"]);
  }

  if (/id|证件|身份证/.test(source) && /number|no|号|证件/.test(source)) {
    addAliases(["id_number", "证件号", "身份证号"]);
  }

  if (template === "receipt") {
    if (/merchant|store|商户|门店/.test(source)) {
      addAliases(["merchant_name", "商户名称", "门店名称", "store_name"]);
    }

    if (/payment|支付/.test(source)) {
      addAliases(["payment_method", "支付方式"]);
    }

    if (/order|订单/.test(source)) {
      addAliases(["order_no", "订单号"]);
    }

    if (/date|日期/.test(source)) {
      addAliases(["receipt_date", "日期"]);
    }

    if (/time|时间/.test(source)) {
      addAliases(["receipt_time", "时间"]);
    }
  }

  if (template === "id_card") {
    addAliases([
      "gender",
      "性别",
      "address",
      "地址",
      "birth_date",
      "出生日期",
      "name",
      "姓名",
      "id_number",
      "证件号",
      "身份证号",
      "nationality",
      "民族",
    ]);
  }

  if (template === "invoice") {
    addAliases([
      "invoice_no",
      "invoice_number",
      "invoice_code",
      "发票号码",
      "发票代码",
      "amount",
      "tax_amount",
      "total_amount",
      "invoice_date",
    ]);
  }

  return Array.from(aliases);
}

function isAnswerEmpty(value: FormAnswerValue) {
  return (
    value === null ||
    value === undefined ||
    value === "" ||
    (Array.isArray(value) && value.length === 0)
  );
}

function normalizeAutoFillValue(
  field: FormFieldSchema,
  value: unknown
): FormAnswerValue {
  if (field.type === "checkbox") {
    if (Array.isArray(value)) {
      return value.map((item) => String(item));
    }

    if (typeof value === "string" && value.trim()) {
      return value
        .split(/[，,、]/)
        .map((item) => item.trim())
        .filter(Boolean);
    }

    return [];
  }

  if (field.type === "number") {
    const numericValue =
      typeof value === "number" ? value : Number(String(value || "").trim());
    return Number.isFinite(numericValue) ? numericValue : null;
  }

  if (typeof value === "boolean") {
    return value;
  }

  if (value === null || value === undefined) {
    return null;
  }

  return String(value).trim();
}

export function applyStructuredDataToAnswers(
  form: FormRecord,
  currentAnswers: FormAnswers,
  structuredData?: Record<string, any>
) {
  const nextAnswers: FormAnswers = {
    ...currentAnswers,
  };
  const autoFilledFields: Record<string, FormAnswerValue> = {};

  const fieldCandidates =
    structuredData?.fields && typeof structuredData.fields === "object"
      ? structuredData.fields
      : structuredData || {};

  const lookup = new Map<string, unknown>();
  for (const [key, value] of Object.entries(fieldCandidates)) {
    lookup.set(normalizeLookupKey(key), value);
  }

  for (const field of form.schema_json.fields) {
    if (
      field.type === "file" ||
      field.type === "image" ||
      field.type === "pdf"
    ) {
      continue;
    }

    if (!isAnswerEmpty(currentAnswers[field.key])) {
      continue;
    }

    const candidateKeys = [
      normalizeLookupKey(field.key),
      normalizeLookupKey(field.label),
      ...detectConceptAliases(field, form.ocr_template),
    ];
    const matchedValue = candidateKeys
      .map((key) => lookup.get(key))
      .find((value) => value !== undefined);

    if (matchedValue === undefined) {
      continue;
    }

    const normalized = normalizeAutoFillValue(field, matchedValue);
    if (isAnswerEmpty(normalized)) {
      continue;
    }

    nextAnswers[field.key] = normalized;
    autoFilledFields[field.key] = normalized;
  }

  return {
    answers: nextAnswers,
    autoFilledFields,
  };
}

export async function runMockOcrSkill(
  form: FormRecord,
  submission: FormSubmissionRecord
): Promise<SkillExecutionResult> {
  const fileNames = submission.files_json.map((file) => file.file_name).join(", ");
  const hasFiles = submission.files_json.length > 0;

  if (!submission.storage_files_json?.length) {
    await updateFormSubmissionByUuid(submission.uuid, {
      ocr_status: hasFiles ? "uploaded" : "not_requested",
      ocr_provider: "mock",
      ocr_result_json: {
        raw_text: "",
        summary: hasFiles
          ? `OCR queued for ${fileNames}.`
          : "No uploaded file was available for OCR.",
        processed_at: new Date().toISOString(),
        processed_files: hasFiles
          ? submission.files_json.map((file) => file.file_name)
          : [],
      },
      ocr_error_message: "",
    });

    return {
      code: "ocr",
      title: "OCR Skill",
      status: "completed",
      detail: hasFiles
        ? `Mock OCR processed file metadata for: ${fileNames}.`
        : "Mock OCR completed without file input; no uploaded file was available.",
    };
  }

  await updateFormSubmissionByUuid(submission.uuid, {
    ocr_status: "processing",
  });

  const primaryAsset = submission.storage_files_json[0];
  const result = await runOcrForAsset(primaryAsset);
  const shouldUseLlmStructuring =
    result.status === "completed" &&
    result.provider !== "mock" &&
    Boolean((result.result.raw_text || "").trim());
  const structuredResult =
    shouldUseLlmStructuring
      ? await structureOcrResultWithLlm(result.result, {
          template: form.ocr_template,
        })
      : result.result;
  const autoFillResult = applyStructuredDataToAnswers(
    form,
    submission.answers_json,
    structuredResult.structured_data
  );
  const enrichedStructuredData = {
    ...(structuredResult.structured_data || {}),
    auto_filled_fields: autoFillResult.autoFilledFields,
  };

  await updateFormSubmissionByUuid(submission.uuid, {
    ocr_status: result.status === "completed" ? "completed" : "failed",
    ocr_provider: result.provider,
    answers_json: autoFillResult.answers,
    ocr_result_json: {
      ...structuredResult,
      structured_data: enrichedStructuredData,
    },
    ocr_error_message: result.errorMessage || "",
  });

  submission.answers_json = autoFillResult.answers;
  submission.ocr_provider = result.provider;
  submission.ocr_status = result.status === "completed" ? "completed" : "failed";
  submission.ocr_result_json = {
    ...structuredResult,
    structured_data: enrichedStructuredData,
  };
  submission.ocr_error_message = result.errorMessage || "";

  return {
    code: "ocr",
    title: "OCR Skill",
    status: result.status,
    detail:
      result.status === "completed"
        ? result.provider === "mock"
          ? `Mock OCR reserved for uploaded file ${primaryAsset.file_name}.`
          : Object.keys(autoFillResult.autoFilledFields).length > 0
            ? `OCR completed with ${result.provider} for ${primaryAsset.file_name} and auto-filled ${Object.keys(autoFillResult.autoFilledFields).length} field(s).`
            : `OCR completed with ${result.provider} for ${primaryAsset.file_name}.`
        : result.errorMessage || "OCR failed.",
  };
}
