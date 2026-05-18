import { FormRecord, FormSubmissionRecord, WebhookLogRecord } from "@/types/form";

import { getWebhookLogsByFormUuid } from "@/models/webhook-log";
import { listFormSubmissions } from "./form-runtime";

export interface FormDashboardMetrics {
  totalSubmissions: number;
  completedSubmissions: number;
  failedSubmissions: number;
  ocrCompletedCount: number;
  ocrFailedCount: number;
  autoFilledSubmissionCount: number;
  webhookCompletedCount: number;
  webhookFailedCount: number;
}

function countAutoFilledSubmissions(submissions: FormSubmissionRecord[]) {
  return submissions.filter((submission) => {
    const autoFilledFields =
      submission.ocr_result_json?.structured_data?.auto_filled_fields;

    return Boolean(
      autoFilledFields &&
        typeof autoFilledFields === "object" &&
        Object.keys(autoFilledFields).length > 0
    );
  }).length;
}

function countWebhookStatus(logs: WebhookLogRecord[], status: "completed" | "failed") {
  return logs.filter((log) => log.status === status).length;
}

export async function getFormDashboardMetrics(
  forms: FormRecord[]
): Promise<FormDashboardMetrics> {
  const perFormData = await Promise.all(
    forms.map(async (form) => {
      const [submissions, webhookLogs] = await Promise.all([
        listFormSubmissions(form),
        getWebhookLogsByFormUuid(form.uuid),
      ]);

      return {
        submissions,
        webhookLogs,
      };
    })
  );

  const submissions = perFormData.flatMap((item) => item.submissions);
  const webhookLogs = perFormData.flatMap((item) => item.webhookLogs);

  return {
    totalSubmissions: submissions.length,
    completedSubmissions: submissions.filter((item) => item.status === "completed")
      .length,
    failedSubmissions: submissions.filter((item) => item.status === "failed")
      .length,
    ocrCompletedCount: submissions.filter((item) => item.ocr_status === "completed")
      .length,
    ocrFailedCount: submissions.filter((item) => item.ocr_status === "failed").length,
    autoFilledSubmissionCount: countAutoFilledSubmissions(submissions),
    webhookCompletedCount: countWebhookStatus(webhookLogs, "completed"),
    webhookFailedCount: countWebhookStatus(webhookLogs, "failed"),
  };
}
