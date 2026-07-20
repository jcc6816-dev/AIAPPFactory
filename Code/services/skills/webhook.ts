import { FormRecord, FormSubmissionRecord } from "@/types/form";

import { SkillExecutionResult } from "../skill";
import { WorkflowRunRecord } from "@/types/workflow";
import { getFormSubmissionByUuid } from "@/models/form-submission";
import { createMockWebhookLog, createWebhookLog, finalizeWebhookLog } from "../webhook-log";
import { decryptSecret } from "@/lib/secure";
import { createHmac } from "node:crypto";
import { getIsoTimestr } from "@/lib/time";
import { createGrowthEventSafely } from "@/models/growth-event";
import {
  redactWebhookText,
  resolveWebhookUrl,
} from "../webhook-security";

const WEBHOOK_MAX_ATTEMPTS = 4;
const DEFAULT_WEBHOOK_TIMEOUT_MS = 10_000;

interface WebhookDeliveryResult {
  ok: boolean;
  status: number;
  body: string;
  attemptCount: number;
  errorMessage: string;
}

function getWebhookTimeoutMs() {
  const configured = Number(process.env.WEBHOOK_REQUEST_TIMEOUT_MS || "");
  if (!Number.isFinite(configured) || configured <= 0) {
    return DEFAULT_WEBHOOK_TIMEOUT_MS;
  }

  return Math.min(Math.max(configured, 100), 60_000);
}

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
  return statusCode === 429 || statusCode >= 500;
}

function parseRetryAfterMs(value: string | null) {
  if (!value) {
    return undefined;
  }

  const seconds = Number(value);
  if (Number.isFinite(seconds) && seconds >= 0) {
    return seconds * 1000;
  }

  const dateMs = Date.parse(value);
  if (Number.isFinite(dateMs)) {
    return Math.max(0, dateMs - Date.now());
  }

  return undefined;
}

function getRetryDelayMs(attempt: number, response?: Response) {
  if (response?.status === 429) {
    const retryAfterMs = parseRetryAfterMs(
      response.headers?.get?.("retry-after") || null
    );
    if (typeof retryAfterMs === "number") {
      return Math.min(retryAfterMs, 60_000);
    }
  }

  return attempt === 1 ? 1000 : attempt === 2 ? 5000 : 15_000;
}

async function waitBeforeRetry(delayMs: number) {
  await new Promise((resolve) =>
    setTimeout(resolve, process.env.NODE_ENV === "test" ? 1 : delayMs)
  );
}

async function fetchWithTimeout(
  targetUrl: string,
  init: RequestInit
): Promise<Response> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), getWebhookTimeoutMs());

  try {
    return await fetch(targetUrl, {
      ...init,
      signal: controller.signal,
    });
  } finally {
    clearTimeout(timeout);
  }
}

async function deliverWebhookRequest(input: {
  targetUrl: string;
  headers: Record<string, string>;
  payload: Record<string, any>;
}): Promise<WebhookDeliveryResult> {
  const body = JSON.stringify(input.payload);
  let lastStatus = 0;
  let lastBody = "";
  let lastError = "";

  for (let attempt = 1; attempt <= WEBHOOK_MAX_ATTEMPTS; attempt += 1) {
    try {
      const response = await fetchWithTimeout(input.targetUrl, {
        method: "POST",
        headers: input.headers,
        body,
      });
      lastStatus = response.status;
      lastBody = redactWebhookText(await response.text(), input.targetUrl);
      lastError = "";

      if (response.ok) {
        return {
          ok: true,
          status: response.status,
          body: lastBody,
          attemptCount: attempt,
          errorMessage: "",
        };
      }

      if (!shouldRetry(response.status) || attempt === WEBHOOK_MAX_ATTEMPTS) {
        return {
          ok: false,
          status: response.status,
          body: lastBody,
          attemptCount: attempt,
          errorMessage: `Webhook returned status ${response.status}.`,
        };
      }

      await waitBeforeRetry(getRetryDelayMs(attempt, response));
    } catch (error: any) {
      const isTimeout = error?.name === "AbortError";
      lastError = isTimeout
        ? `Webhook request timed out after ${getWebhookTimeoutMs()}ms.`
        : redactWebhookText(error?.message || "Webhook request failed", input.targetUrl);

      if (attempt === WEBHOOK_MAX_ATTEMPTS) {
        return {
          ok: false,
          status: lastStatus,
          body: lastBody,
          attemptCount: attempt,
          errorMessage: lastError,
        };
      }

      await waitBeforeRetry(getRetryDelayMs(attempt));
    }
  }

  return {
    ok: false,
    status: lastStatus,
    body: lastBody,
    attemptCount: WEBHOOK_MAX_ATTEMPTS,
    errorMessage: lastError || "Webhook delivery failed.",
  };
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

  let targetUrl = resolveWebhookUrl(form);
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
    case "slack_bot": {
      for (const key of Object.keys(requestPayload)) {
        delete requestPayload[key];
      }

      requestPayload.text = plainTextSummary;
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

  const configuredWebhookUrl = resolveWebhookUrl(form);
  if (!form.webhook_enabled || !configuredWebhookUrl) {
    const webhookLog = await createMockWebhookLog(form, latestSubmission, workflowRun);

    return {
      code: "webhook",
      title: "Webhook Push",
      status: "completed",
      detail: `Mock webhook payload prepared for submission ${latestSubmission.uuid} of form ${form.title}. Log: ${webhookLog.uuid}.`,
    };
  }

  const request = buildWebhookRequest(form, latestSubmission, workflowRun);
  const webhookLog = await createWebhookLog({
    form,
    submission: latestSubmission,
    workflowRun,
    targetUrl: request.targetUrl,
    payload: request.payload,
  });

  const delivery = await deliverWebhookRequest(request);
  const status = delivery.ok ? "completed" : "failed";

  await finalizeWebhookLog(webhookLog.uuid, {
    attempt_count: delivery.attemptCount,
    response_status: delivery.status,
    response_body: delivery.body,
    status,
    error_message: delivery.errorMessage,
  });
  await createGrowthEventSafely({
    event_name: delivery.ok
      ? "webhook_delivery_succeeded"
      : "webhook_delivery_failed",
    visitor_id: "",
    user_uuid: form.user_uuid,
    path: "/internal/webhook-delivery",
    form_uuid: form.uuid,
    share_code: form.share_code,
    source: "product",
    metadata_json: {
      provider: form.webhook_provider || "generic",
      response_status: delivery.status,
      attempt_count: delivery.attemptCount,
      is_test: false,
    },
  });

  return {
    code: "webhook",
    title: "Webhook Push",
    status,
    detail: delivery.ok
      ? `Webhook delivered to the configured endpoint. Log: ${webhookLog.uuid}.`
      : `Webhook failed after ${delivery.attemptCount} attempt(s). Log: ${webhookLog.uuid}.`,
  };
}

export async function sendWebhookTest(form: FormRecord) {
  const targetUrl = resolveWebhookUrl(form);
  if (!form.webhook_enabled || !targetUrl) {
    throw new Error("webhook is not configured");
  }

  const provider = form.webhook_provider || "generic";
  if (provider !== "slack_bot") {
    throw new Error("test send is currently available for Slack Incoming Webhook only");
  }

  const payload = {
    text: "GenForms test notification. Your Slack Incoming Webhook is connected.",
  };

  return deliverWebhookRequest({
    targetUrl,
    headers: { "Content-Type": "application/json" },
    payload,
  });
}
