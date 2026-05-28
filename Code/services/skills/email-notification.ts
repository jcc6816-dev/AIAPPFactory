import { FormRecord, FormSubmissionRecord } from "@/types/form";
import { WorkflowRunRecord } from "@/types/workflow";
import { SkillExecutionResult } from "../skill";

export async function runMockEmailNotificationSkill(
  form: FormRecord,
  submission: FormSubmissionRecord,
  workflowRun?: WorkflowRunRecord
): Promise<SkillExecutionResult> {
  const config = form.generation_meta_json?.artifact?.skillSettings?.email_notification?.config || {};
  const recipientType = config.recipient_type || "creator";
  const customRecipient = config.custom_recipient || "";
  const subject = config.subject || "Form Submission Alert";
  const attachReport = Boolean(config.attach_report);

  let recipient = "creator@example.com";
  if (recipientType === "custom" && customRecipient) {
    recipient = customRecipient;
  } else if (recipientType === "fields") {
    // Attempt to extract from form submission values (e.g. key email)
    const emailField = Object.entries(submission.answers_json || {}).find(
      ([key, val]) =>
        (key.toLowerCase().includes("email") || key.toLowerCase().includes("mail")) &&
        typeof val === "string"
    );
    if (emailField) {
      recipient = emailField[1] as string;
    } else {
      recipient = "submitter@example.com";
    }
  }

  // Check Report Chaining / Integration logic
  let hasReportAttached = false;
  if (attachReport && workflowRun?.steps_json) {
    // Find if report_export step was executed and completed
    const reportStep = workflowRun.steps_json.find(
      (step) => step.code === "report_export" && step.status === "completed"
    );
    if (reportStep) {
      hasReportAttached = true;
    }
  }

  if (hasReportAttached) {
    return {
      code: "email_notification",
      title: "Email Notification",
      status: "completed",
      detail: `Email Send Succeeded: Notification sent to ${recipient}. Subject: "${subject}". Attachment linked: report_dashboard.xlsx. Status: EMAIL_SENT_WITH_ATTACHMENT.`,
    };
  }

  return {
    code: "email_notification",
    title: "Email Notification",
    status: "completed",
    detail: `Email Send Succeeded: Notification sent to ${recipient}. Subject: "${subject}". Status: EMAIL_SENT.`,
  };
}
