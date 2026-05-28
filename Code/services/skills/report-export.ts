import { FormRecord, FormSubmissionRecord } from "@/types/form";
import { SkillExecutionResult } from "../skill";

export async function runMockReportExportSkill(
  form: FormRecord,
  submission: FormSubmissionRecord
): Promise<SkillExecutionResult> {
  const config = form.generation_meta_json?.artifact?.skillSettings?.report_export?.config || {};
  const format = (config.file_format || "excel").toUpperCase();
  const sort = config.sort_by === "asc" ? "自定义字段值升序 (Ascending)" : "自定义字段值降序 (Descending)";
  const groupBy = config.group_by_fields || "默认 (None)";

  const hasTableOcrOutput = submission.ocr_result_json?.structured_data?.table_rows;

  if (hasTableOcrOutput) {
    const rowCount = (hasTableOcrOutput as any[]).length;
    return {
      code: "report_export",
      title: "Report Export",
      status: "completed",
      detail: `Report Generator Succeeded: Compiled in ${format} format. Sorted by: ${sort}. Grouping key(s): ${groupBy}. Flat Detail view with ${rowCount} items. Available for download in Data console.`,
    };
  }

  return {
    code: "report_export",
    title: "Report Export",
    status: "completed",
    detail: `Report Generator Succeeded: Compiled in ${format} format. Sorted by: ${sort}. Grouping key(s): ${groupBy}. Excel template assembled for single submission. Available for download.`,
  };
}
