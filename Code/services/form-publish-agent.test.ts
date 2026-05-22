import { describe, expect, it } from "vitest";

import type { FormRecord, WebhookLogRecord } from "@/types/form";
import {
  answerFormPublishAgentQuery,
  buildFormShareUrl,
  buildFormPublishAgentResponses,
  resolvePublishAgentLocale,
} from "./form-publish-agent";

const form: FormRecord = {
  uuid: "form_1",
  user_uuid: "user_1",
  title: "发票收集表",
  theme: "business",
  schema_json: { fields: [] },
  status: "draft",
  share_code: "share_1",
  ocr_template: "invoice",
  webhook_enabled: true,
  webhook_url: "https://example.com/webhook",
  webhook_provider: "dingtalk_bot",
  webhook_auth_mode: "keyword",
};

const logs: WebhookLogRecord[] = [
  {
    uuid: "wh_success",
    form_uuid: "form_1",
    submission_uuid: "sub_1",
    target_url: "https://example.com/webhook",
    request_body_json: {},
    response_status: 200,
    response_body: "ok",
    attempt_count: 1,
    status: "completed",
  },
  {
    uuid: "wh_failed",
    form_uuid: "form_1",
    submission_uuid: "sub_2",
    target_url: "https://example.com/webhook",
    request_body_json: {},
    response_status: 500,
    response_body: "server error",
    attempt_count: 3,
    status: "failed",
    error_message: "Webhook returned status 500.",
  },
];

describe("form-publish-agent", () => {
  it("builds publish readiness and integration responses", () => {
    const responses = buildFormPublishAgentResponses(
      form,
      logs,
      "https://demo.test/zh/f/share_1"
    );

    expect(responses.readiness).toContain("失败的 Webhook 日志");
    expect(responses.share).toContain("https://demo.test/zh/f/share_1");
    expect(responses.webhook).toContain("钉钉群机器人");
    expect(responses.webhook).toContain("配置检查");
    expect(responses.platformGuide).toContain("钉钉群机器人");
    expect(responses.testWebhook).toContain("不会自动触发测试推送");
    expect(responses.webhook).toContain("wh_faile");
    expect(responses.ocr).toContain("invoice");
  });

  it("answers publish queries by intent without using an LLM", () => {
    const responses = buildFormPublishAgentResponses(
      form,
      logs,
      "https://demo.test/zh/f/share_1"
    );

    expect(answerFormPublishAgentQuery("检查发布配置", responses)).toContain(
      "发布检查"
    );
    expect(answerFormPublishAgentQuery("分享链接在哪里", responses)).toContain(
      "当前分享链接"
    );
    expect(answerFormPublishAgentQuery("钉钉推送失败了吗", responses)).toContain(
      "钉钉群机器人"
    );
    expect(answerFormPublishAgentQuery("帮我配置飞书机器人", responses)).toContain(
      "飞书群机器人"
    );
    expect(answerFormPublishAgentQuery("测试一下 Webhook", responses)).toContain(
      "不会自动触发测试推送"
    );
    expect(answerFormPublishAgentQuery("OCR 模板是什么", responses)).toContain(
      "当前 OCR 模板"
    );
  });

  it("resolves publish agent locale from body first and referer second", () => {
    expect(resolvePublishAgentLocale({ bodyLocale: "en", referer: null })).toBe("en");
    expect(
      resolvePublishAgentLocale({
        bodyLocale: undefined,
        referer: "https://demo.test/zh/forms/form_1/publish",
      })
    ).toBe("zh");
    expect(resolvePublishAgentLocale({ bodyLocale: "ja", referer: null })).toBe("zh");
  });

  it("builds locale-aware share urls for publish agent responses", () => {
    expect(
      buildFormShareUrl({
        baseUrl: "https://demo.test",
        locale: "en",
        shareCode: "share_1",
      })
    ).toBe("https://demo.test/en/f/share_1");
  });
});
