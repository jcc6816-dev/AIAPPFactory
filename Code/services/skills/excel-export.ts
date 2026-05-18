import { FormRecord, FormSubmissionRecord } from "@/types/form";

import { SkillExecutionResult } from "../skill";

export async function runMockExcelExportSkill(
  form: FormRecord,
  submission: FormSubmissionRecord
): Promise<SkillExecutionResult> {
  const answerCount = Object.keys(submission.answers_json).length;

  return {
    code: "excel_export",
    title: "Excel Export",
    status: "completed",
    detail: `Mock Excel export prepared ${answerCount} answers for form ${form.title}.`,
  };
}
