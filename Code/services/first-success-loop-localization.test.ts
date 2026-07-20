import { describe, expect, it } from "vitest";

import en from "@/i18n/messages/en.json";
import zh from "@/i18n/messages/zh.json";

const requiredKeys = [
  "publish_success_title",
  "send_free_test",
  "send_free_test_helper",
  "share_whatsapp",
  "test_runner_title",
  "test_runner_description",
  "test_submit",
] as const;

describe("first success loop localization contract", () => {
  it.each([
    ["en", en.forms],
    ["zh", zh.forms],
  ])("provides complete, bounded copy for %s", (_locale, forms) => {
    for (const key of requiredKeys) {
      const value = forms[key];
      expect(value.trim().length).toBeGreaterThan(0);
      expect(value.length).toBeLessThan(240);
    }
  });

  it("keeps the WhatsApp URL interpolation token in both locales", () => {
    expect(en.forms.whatsapp_share_message).toContain("{url}");
    expect(zh.forms.whatsapp_share_message).toContain("{url}");
  });
});
