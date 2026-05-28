import { FormRecord, FormSubmissionRecord } from "@/types/form";
import { SkillExecutionResult } from "../skill";
import { updateFormSubmissionByUuid } from "@/models/form-submission";

function cleanTextValue(key: string, value: string) {
  const compact = value.trim().replace(/\s+/g, " ");
  const lowerKey = key.toLowerCase();

  if (lowerKey.includes("email") || lowerKey.includes("mail")) {
    return compact.toLowerCase();
  }

  if (
    lowerKey.includes("phone") ||
    lowerKey.includes("mobile") ||
    lowerKey.includes("tel") ||
    lowerKey.includes("手机号") ||
    lowerKey.includes("电话")
  ) {
    return compact.replace(/[\s-]/g, "");
  }

  return compact;
}

export async function runMockDataCleaningSkill(
  form: FormRecord,
  submission: FormSubmissionRecord
): Promise<SkillExecutionResult> {
  const config =
    form.generation_meta_json?.artifact?.skillSettings?.data_cleaning?.config ||
    {};
  const normalizePhone = config.normalize_phone !== false;
  const normalizeEmail = config.normalize_email !== false;
  const trimWhitespace = config.trim_whitespace !== false;
  const originalAnswers = submission.answers_json || {};
  const cleanedAnswers: Record<string, any> = {};
  const changedFields: string[] = [];

  for (const [key, value] of Object.entries(originalAnswers)) {
    let nextValue = value;

    if (typeof value === "string") {
      const lowerKey = key.toLowerCase();
      const shouldNormalizeEmail =
        normalizeEmail &&
        (lowerKey.includes("email") || lowerKey.includes("mail"));
      const shouldNormalizePhone =
        normalizePhone &&
        (lowerKey.includes("phone") ||
          lowerKey.includes("mobile") ||
          lowerKey.includes("tel") ||
          lowerKey.includes("手机号") ||
          lowerKey.includes("电话"));

      if (trimWhitespace || shouldNormalizeEmail || shouldNormalizePhone) {
        nextValue = cleanTextValue(key, value);
      }
    }

    cleanedAnswers[key] = nextValue;
    if (nextValue !== value) {
      changedFields.push(key);
    }
  }

  await updateFormSubmissionByUuid(submission.uuid, {
    answers_json: cleanedAnswers,
    ocr_result_json: {
      ...(submission.ocr_result_json || {}),
      structured_data: {
        ...(submission.ocr_result_json?.structured_data || {}),
        data_cleaning: {
          changed_fields: changedFields,
          normalized_at: new Date().toISOString(),
        },
      },
    },
  });

  return {
    code: "data_cleaning",
    title: "AI Data Cleaning",
    status: "completed",
    detail:
      changedFields.length > 0
        ? `Data Cleaning Succeeded: Normalized ${changedFields.length} field(s): ${changedFields.join(", ")}.`
        : "Data Cleaning Succeeded: No dirty values detected; submission data is already normalized.",
    outputPayload: {
      changed_fields: changedFields,
      answers_json: cleanedAnswers,
    },
  };
}
