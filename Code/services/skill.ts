import { FormRecord, FormSubmissionRecord } from "@/types/form";
import { WorkflowRunRecord } from "@/types/workflow";

import { runMockExcelExportSkill } from "./skills/excel-export";
import { runMockOcrSkill } from "./skills/ocr";
import { runMockWebhookSkill } from "./skills/webhook";
import { runMockDeduplicationSkill } from "./skills/deduplication";
import { runMockTableOcrSkill } from "./skills/table-ocr";
import { runMockAiPreAuditSkill } from "./skills/ai-pre-audit";
import { runMockReportExportSkill } from "./skills/report-export";
import { runMockEmailNotificationSkill } from "./skills/email-notification";
import { runMockDataCleaningSkill } from "./skills/data-cleaning";
import { runMockAiInsightsSkill } from "./skills/ai-insights";

export interface SkillExecutionResult {
  code: string;
  title: string;
  status: "completed" | "failed";
  detail: string;
  outputPayload?: any;
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
    case "deduplication":
      return runMockDeduplicationSkill(form, submission);
    case "table_ocr":
      return runMockTableOcrSkill(form, submission);
    case "ai_pre_audit":
      return runMockAiPreAuditSkill(form, submission);
    case "report_export":
      return runMockReportExportSkill(form, submission);
    case "email_notification":
      return runMockEmailNotificationSkill(form, submission, workflowRun);
    case "data_cleaning":
      return runMockDataCleaningSkill(form, submission);
    case "ai_insights":
      return runMockAiInsightsSkill(form, submission, workflowRun);
    default:
      return {
        code,
        title: code,
        status: "failed",
        detail: `Unknown skill: ${code}`,
      };
  }
}
