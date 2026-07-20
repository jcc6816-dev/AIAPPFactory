import { describe, expect, it } from "vitest";

import { encryptSecret } from "@/lib/secure";
import {
  maskWebhookUrl,
  resolveWebhookUrl,
  sanitizeWebhookPayload,
  serializeFormForClient,
} from "./webhook-security";
import { FormRecord } from "@/types/form";

const form: FormRecord = {
  uuid: "form_1",
  user_uuid: "user_1",
  title: "Secure webhook",
  theme: "minimal",
  schema_json: { fields: [] },
  status: "draft",
  share_code: "share_1",
  webhook_url: "https://legacy.example.com/hooks/plaintext",
  webhook_url_encrypted: encryptSecret(
    "https://hooks.slack.com/services/T000/B000/SECRET"
  ),
  webhook_secret_encrypted: encryptSecret("signing-secret"),
  webhook_keyword_encrypted: encryptSecret("keyword"),
};

describe("webhook security", () => {
  it("prefers the encrypted URL and falls back to the legacy plaintext URL", () => {
    expect(resolveWebhookUrl(form)).toContain("hooks.slack.com/services/");
    expect(
      resolveWebhookUrl({ webhook_url: form.webhook_url, webhook_url_encrypted: "" })
    ).toBe(form.webhook_url);
  });

  it("returns only configuration state and a host-level mask to clients", () => {
    const safe = serializeFormForClient(form);
    expect(safe.webhook_url).toBeUndefined();
    expect(safe.webhook_url_encrypted).toBeUndefined();
    expect(safe.webhook_secret_encrypted).toBeUndefined();
    expect(safe.webhook_keyword_encrypted).toBeUndefined();
    expect(safe.webhook_url_configured).toBe(true);
    expect(safe.webhook_url_masked).toBe("https://hooks.slack.com/***");
  });

  it("redacts URLs and token-like fields before logs are stored", () => {
    expect(maskWebhookUrl(form.webhook_url)).toBe("https://legacy.example.com/***");
    expect(
      sanitizeWebhookPayload({
        webhook_url: form.webhook_url,
        nested: { authorization: "Bearer secret", note: form.webhook_url },
      })
    ).toEqual({
      webhook_url: "[REDACTED]",
      nested: {
        authorization: "[REDACTED]",
        note: "https://legacy.example.com/***",
      },
    });
  });
});
