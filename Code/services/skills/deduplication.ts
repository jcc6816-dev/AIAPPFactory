import { FormRecord, FormSubmissionRecord } from "@/types/form";
import { SkillExecutionResult } from "../skill";

export async function runMockDeduplicationSkill(
  form: FormRecord,
  submission: FormSubmissionRecord
): Promise<SkillExecutionResult> {
  const config = form.generation_meta_json?.artifact?.skillSettings?.deduplication?.config || {};
  const uniqueField = config.unique_field || "all";
  const checkFiles = config.check_files !== false;

  const hasFiles = submission.files_json && submission.files_json.length > 0;
  const fileNameList = (submission.files_json || []).map((f) => f.file_name).join(" ").toLowerCase();

  // If checkFiles is enabled, check duplicate files keywords
  const isDuplicatedFile = checkFiles && (
    fileNameList.includes("duplicate") || 
    fileNameList.includes("copy") || 
    fileNameList.includes("重复")
  );

  // Check if answers contain duplicate keywords
  let isDuplicatedText = false;
  if (uniqueField === "all") {
    for (const val of Object.values(submission.answers_json)) {
      if (typeof val === "string") {
        const lower = val.toLowerCase();
        if (lower.includes("duplicate") || lower.includes("重复") || lower.includes("copy")) {
          isDuplicatedText = true;
          break;
        }
      }
    }
  } else {
    const val = submission.answers_json?.[uniqueField];
    if (typeof val === "string") {
      const lower = val.toLowerCase();
      if (lower.includes("duplicate") || lower.includes("重复") || lower.includes("copy")) {
        isDuplicatedText = true;
      }
    }
  }

  if (isDuplicatedFile || isDuplicatedText) {
    return {
      code: "deduplication",
      title: "Deduplication Check",
      status: "failed",
      detail: isDuplicatedFile
        ? `Deduplication Alert: The uploaded image/document matches a previously stored asset hash.`
        : `Deduplication Alert: The unique identifier/serial number in field "${uniqueField}" has already been submitted in another record.`,
    };
  }

  return {
    code: "deduplication",
    title: "Deduplication Check",
    status: "completed",
    detail: hasFiles && checkFiles
      ? `Deduplication Passed: Asset hash is unique. Field "${uniqueField}" check validated.`
      : `Deduplication Passed: Unique transaction record validated (Checked field: "${uniqueField}").`,
  };
}
