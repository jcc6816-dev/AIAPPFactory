import { WebhookLogRecord } from "@/types/form";
import {
  getWebhookLogByUuid,
  getWebhookLogsByFormUuid,
  insertWebhookLog,
  updateWebhookLogByUuid,
} from "@/models/webhook-log";

import { FormRecord } from "@/types/form";
import { FormSubmissionRecord } from "@/types/form";
import { WorkflowRunRecord } from "@/types/workflow";
import { findWorkflowRunByUuid } from "@/models/workflow";
import { getFormSubmissionByUuid } from "@/models/form-submission";
import { getIsoTimestr } from "@/lib/time";
import { getUniSeq } from "@/lib/hash";
import { runMockWebhookSkill } from "./skills/webhook";

export async function createMockWebhookLog(
  form: FormRecord,
  submission: FormSubmissionRecord,
  workflowRun: WorkflowRunRecord
): Promise<WebhookLogRecord> {
  const now = getIsoTimestr();
  const payload = {
    form_uuid: form.uuid,
    form_title: form.title,
    submission_uuid: submission.uuid,
    answers: submission.answers_json,
  };

  return insertWebhookLog({
    uuid: getUniSeq("wh_"),
    form_uuid: form.uuid,
    submission_uuid: submission.uuid,
    workflow_run_uuid: workflowRun.uuid,
    target_url: "mock://webhook-endpoint",
    request_body_json: payload,
    response_status: 200,
    response_body: "mock webhook accepted",
    attempt_count: 1,
    status: "completed",
    error_message: "",
    created_at: now,
    last_attempt_at: now,
  });
}

export async function createWebhookLog(input: {
  form: FormRecord;
  submission: FormSubmissionRecord;
  workflowRun: WorkflowRunRecord;
  targetUrl: string;
  payload: Record<string, any>;
  attemptCount?: number;
}) {
  const now = getIsoTimestr();

  return insertWebhookLog({
    uuid: getUniSeq("wh_"),
    form_uuid: input.form.uuid,
    submission_uuid: input.submission.uuid,
    workflow_run_uuid: input.workflowRun.uuid,
    target_url: input.targetUrl,
    request_body_json: input.payload,
    response_status: 0,
    response_body: "",
    attempt_count: input.attemptCount || 1,
    status: "processing",
    error_message: "",
    created_at: now,
    last_attempt_at: now,
  });
}

export async function finalizeWebhookLog(
  uuid: string,
  updates: Partial<WebhookLogRecord>
) {
  return updateWebhookLogByUuid(uuid, {
    ...updates,
    last_attempt_at: updates.last_attempt_at || getIsoTimestr(),
  });
}

export async function listWebhookLogs(form: FormRecord) {
  return getWebhookLogsByFormUuid(form.uuid);
}

export async function retryWebhookLog(form: FormRecord, logUuid: string) {
  const log = await getWebhookLogByUuid(logUuid);
  if (!log || log.form_uuid !== form.uuid) {
    throw new Error("webhook log not found");
  }

  if (log.status !== "failed") {
    throw new Error("only failed webhook logs can be retried");
  }

  const submission = await getFormSubmissionByUuid(log.submission_uuid);
  if (!submission || submission.form_uuid !== form.uuid) {
    throw new Error("submission not found");
  }

  if (!log.workflow_run_uuid) {
    throw new Error("workflow run not found");
  }

  const workflowRun = await findWorkflowRunByUuid(log.workflow_run_uuid);
  if (!workflowRun || workflowRun.form_uuid !== form.uuid) {
    throw new Error("workflow run not found");
  }

  return runMockWebhookSkill(form, submission, workflowRun);
}
