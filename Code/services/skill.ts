import { FormRecord, FormSubmissionRecord } from "@/types/form";
import { WorkflowRunRecord } from "@/types/workflow";

import { runMockExcelExportSkill } from "./skills/excel-export";
import { runMockOcrSkill } from "./skills/ocr";
import { runMockWebhookSkill } from "./skills/webhook";

export interface SkillExecutionResult {
  code: string;
  title: string;
  status: "completed" | "failed";
  detail: string;
}

export async function executeMockSkill(
  code: string,
  form: FormRecord,
  submission: FormSubmissionRecord,
  workflowRun: WorkflowRunRecord
): Promise<SkillExecutionResult> {
  switch (code) {
    case "ocr":
      return runMockOcrSkill(form, submission);
    case "excel_export":
      return runMockExcelExportSkill(form, submission);
    case "webhook":
      return runMockWebhookSkill(form, submission, workflowRun);
    default:
      return {
        code,
        title: code,
        status: "failed",
        detail: `Unknown skill: ${code}`,
      };
  }
}
