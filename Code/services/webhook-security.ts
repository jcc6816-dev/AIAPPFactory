import { FormRecord, WebhookLogRecord } from "@/types/form";

import { decryptSecret } from "@/lib/secure";

const SECRET_URL_PATTERN = /https?:\/\/[^\s"'<>]+/gi;
const SENSITIVE_KEY_PATTERN = /(authorization|token|secret|webhook_url|webhookurl)/i;

export function resolveWebhookUrl(
  form: Pick<FormRecord, "webhook_url" | "webhook_url_encrypted">
) {
  const encryptedUrl = decryptSecret(form.webhook_url_encrypted);
  return encryptedUrl || form.webhook_url?.trim() || "";
}

export function maskWebhookUrl(value?: string) {
  if (!value) {
    return "";
  }

  try {
    const url = new URL(value);
    return `${url.protocol}//${url.host}/***`;
  } catch {
    return "***";
  }
}

export function redactWebhookText(value?: string, targetUrl?: string) {
  if (!value) {
    return "";
  }

  let redacted = value;
  if (targetUrl) {
    redacted = redacted.split(targetUrl).join(maskWebhookUrl(targetUrl));
  }

  return redacted.replace(SECRET_URL_PATTERN, (url) => maskWebhookUrl(url));
}

export function sanitizeWebhookLog(log: WebhookLogRecord): WebhookLogRecord {
  return {
    ...log,
    target_url: maskWebhookUrl(log.target_url),
    response_body: redactWebhookText(log.response_body, log.target_url),
    error_message: redactWebhookText(log.error_message, log.target_url),
  };
}

export function sanitizeWebhookPayload(
  value: unknown,
  key = ""
): unknown {
  if (SENSITIVE_KEY_PATTERN.test(key)) {
    return "[REDACTED]";
  }
  if (Array.isArray(value)) {
    return value.map((item) => sanitizeWebhookPayload(item));
  }
  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value).map(([childKey, childValue]) => [
        childKey,
        sanitizeWebhookPayload(childValue, childKey),
      ])
    );
  }
  if (typeof value === "string") {
    return redactWebhookText(value);
  }
  return value;
}

export function serializeFormForClient(form: FormRecord): FormRecord {
  const webhookUrl = resolveWebhookUrl(form);
  const {
    webhook_url: _webhookUrl,
    webhook_url_encrypted: _webhookUrlEncrypted,
    webhook_secret_encrypted: _webhookSecretEncrypted,
    webhook_keyword_encrypted: _webhookKeywordEncrypted,
    ...safeForm
  } = form;

  return {
    ...safeForm,
    webhook_url_configured: Boolean(webhookUrl),
    webhook_url_masked: maskWebhookUrl(webhookUrl),
  };
}
