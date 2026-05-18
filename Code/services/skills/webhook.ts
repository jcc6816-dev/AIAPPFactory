import { FormRecord, FormSubmissionRecord } from "@/types/form";

import { SkillExecutionResult } from "../skill";
import { WorkflowRunRecord } from "@/types/workflow";
import { getFormSubmissionByUuid } from "@/models/form-submission";
import { createMockWebhookLog, createWebhookLog, finalizeWebhookLog } from "../webhook-log";
import { decryptSecret } from "@/lib/secure";
import { createHmac } from "node:crypto";
import { getIsoTimestr } from "@/lib/time";

const WEBHOOK_MAX_ATTEMPTS = 3;

function resolvePayloadSubmissionStatus(
  submission: FormSubmissionRecord,
  workflowRun: WorkflowRunRecord
) {
  if (submission.status === "completed" || submission.status === "failed") {
    return submission.status;
  }

  const webhookIndex = workflowRun.steps_json.findIndex(
    (step) => step.code === "webhook"
  );
  if (webhookIndex <= 0) {
    return submission.status;
  }

  const previousSteps = workflowRun.steps_json.slice(0, webhookIndex);
  if (
    previousSteps.length > 0 &&
    previousSteps.every((step) => step.status === "completed")
  ) {
    return "completed";
  }

  return submission.status;
}

function buildWebhookPayload(
  form: FormRecord,
  submission: FormSubmissionRecord,
  workflowRun: WorkflowRunRecord
) {
  return {
    submission_id: submission.uuid,
    form_id: form.uuid,
    form_title: form.title,
    form_share_code: submission.form_share_code,
    submission_status: resolvePayloadSubmissionStatus(submission, workflowRun),
    answers: submission.answers_json,
    files: submission.files_json || [],
    storage_files: submission.storage_files_json || [],
    ocr: {
      status: submission.ocr_status || "not_requested",
      provider: submission.ocr_provider || "",
      result: submission.ocr_result_json || {},
      error_message: submission.ocr_error_message || "",
    },
    submitted_at: submission.created_at || getIsoTimestr(),
  };
}

function shouldRetry(statusCode: number) {
  return statusCode >= 500;
}

function buildPlainTextSummary(form: FormRecord, submission: FormSubmissionRecord) {
  const answerLines = Object.entries(submission.answers_json).map(
    ([key, value]) =>
      `${key}: ${Array.isArray(value) ? value.join(", ") : String(value ?? "")}`
  );
  const fileLines = (submission.storage_files_json || []).map(
    (file) => `File: ${file.file_name}`
  );
  const ocrSummary = submission.ocr_result_json?.summary
    ? [`OCR: ${submission.ocr_result_json.summary}`]
    : [];

  return [
    `Form: ${form.title}`,
    `Submission ID: ${submission.uuid}`,
    ...answerLines,
    ...fileLines,
    ...ocrSummary,
  ].join("\n");
}

function buildWebhookRequest(
  form: FormRecord,
  submission: FormSubmissionRecord,
  workflowRun: WorkflowRunRecord
) {
  const payload = buildWebhookPayload(form, submission, workflowRun);
  const secret = decryptSecret(form.webhook_secret_encrypted);
  const keyword = decryptSecret(form.webhook_keyword_encrypted);
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  let targetUrl = form.webhook_url || "";
  const requestPayload: Record<string, any> = { ...payload };
  const plainTextSummary = buildPlainTextSummary(form, submission);

  switch (form.webhook_provider) {
    case "feishu_bot": {
      for (const key of Object.keys(requestPayload)) {
        delete requestPayload[key];
      }

      requestPayload.msg_type = "text";
      requestPayload.content = {
        text:
          keyword && form.webhook_auth_mode === "keyword"
            ? `${keyword}\n${plainTextSummary}`
            : plainTextSummary,
      };

      if (form.webhook_auth_mode === "signature" && secret) {
        const timestamp = String(Date.now());
        const sign = createHmac("sha256", `${timestamp}\n${secret}`)
          .update("")
          .digest("base64");
        requestPayload.timestamp = timestamp;
        requestPayload.sign = sign;
      }
      break;
    }
    case "dingtalk_bot": {
      for (const key of Object.keys(requestPayload)) {
        delete requestPayload[key];
      }

      requestPayload.msgtype = "text";
      requestPayload.text = {
        content:
          keyword && form.webhook_auth_mode === "keyword"
            ? `${keyword}\n${plainTextSummary}`
            : plainTextSummary,
      };

      if (form.webhook_auth_mode === "signature" && secret) {
        const timestamp = String(Date.now());
        const sign = createHmac("sha256", secret)
          .update(`${timestamp}\n${secret}`)
          .digest("base64");
        const url = new URL(targetUrl);
        url.searchParams.set("timestamp", timestamp);
        url.searchParams.set("sign", sign);
        targetUrl = url.toString();
      }
      break;
    }
    case "wecom_bot": {
      for (const key of Object.keys(requestPayload)) {
        delete requestPayload[key];
      }

      requestPayload.msgtype = "text";
      requestPayload.text = {
        content: plainTextSummary,
      };
      break;
    }
    default: {
      switch (form.webhook_auth_mode) {
        case "query_keyword": {
          if (keyword) {
            const url = new URL(targetUrl);
            url.searchParams.set("keyword", keyword);
            targetUrl = url.toString();
          }
          break;
        }
        case "header_keyword": {
          if (keyword) {
            headers[form.webhook_header_name || "X-Webhook-Keyword"] = keyword;
          }
          break;
        }
        case "body_keyword": {
          if (keyword) {
            requestPayload.keyword = keyword;
          }
          break;
        }
        case "signature": {
          const bodyForSignature = JSON.stringify(requestPayload);
          if (secret) {
            headers["X-AIFactory-Signature"] = createHmac("sha256", secret)
              .update(bodyForSignature)
              .digest("hex");
          }
          break;
        }
        default:
          break;
      }
      break;
    }
  }

  return {
    payload: requestPayload,
    headers,
    targetUrl,
  };
}

export async function runMockWebhookSkill(
  form: FormRecord,
  submission: FormSubmissionRecord,
  workflowRun: WorkflowRunRecord
): Promise<SkillExecutionResult> {
  const latestSubmission =
    (await getFormSubmissionByUuid(submission.uuid)) || submission;

  if (!form.webhook_enabled || !form.webhook_url) {
    const webhookLog = await createMockWebhookLog(form, latestSubmission, workflowRun);

    return {
      code: "webhook",
      title: "Webhook Push",
      status: "completed",
      detail: `Mock webhook payload prepared for submission ${latestSubmission.uuid} of form ${form.title}. Log: ${webhookLog.uuid}.`,
    };
  }

  const request = buildWebhookRequest(form, latestSubmission, workflowRun);
  const body = JSON.stringify(request.payload);

  let lastStatus = 0;
  let lastBody = "";
  let lastError = "";

  const webhookLog = await createWebhookLog({
    form,
    submission: latestSubmission,
    workflowRun,
    targetUrl: request.targetUrl,
    payload: request.payload,
  });

  for (let attempt = 1; attempt <= WEBHOOK_MAX_ATTEMPTS; attempt += 1) {
    try {
      const response = await fetch(request.targetUrl, {
        method: "POST",
        headers: request.headers,
        body,
      });

      lastStatus = response.status;
      lastBody = await response.text();
      lastError = "";

      if (response.ok || !shouldRetry(response.status) || attempt === WEBHOOK_MAX_ATTEMPTS) {
        const status = response.ok ? "completed" : "failed";

        await finalizeWebhookLog(webhookLog.uuid, {
          attempt_count: attempt,
          response_status: response.status,
          response_body: lastBody,
          status,
          error_message: response.ok
            ? ""
            : `Webhook returned status ${response.status}.`,
        });

        return {
          code: "webhook",
          title: "Webhook Push",
          status: response.ok ? "completed" : "failed",
          detail: response.ok
            ? `Webhook delivered to ${request.targetUrl}. Log: ${webhookLog.uuid}.`
            : `Webhook failed with status ${response.status}. Log: ${webhookLog.uuid}.`,
        };
      }
    } catch (error: any) {
      lastError = error?.message || "Webhook request failed";

      if (attempt === WEBHOOK_MAX_ATTEMPTS) {
        await finalizeWebhookLog(webhookLog.uuid, {
          attempt_count: attempt,
          response_status: lastStatus,
          response_body: lastBody,
          status: "failed",
          error_message: lastError,
        });

        return {
          code: "webhook",
          title: "Webhook Push",
          status: "failed",
          detail: `Webhook failed after ${attempt} attempts. Log: ${webhookLog.uuid}.`,
        };
      }
    }
  }

  const fallbackLog = await createMockWebhookLog(form, submission, workflowRun);

  return {
    code: "webhook",
    title: "Webhook Push",
    status: "failed",
    detail: `Webhook failed unexpectedly. Log: ${fallbackLog.uuid}. ${lastError}`,
  };
}
