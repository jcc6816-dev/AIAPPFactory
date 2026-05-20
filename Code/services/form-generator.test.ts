import { describe, expect, it } from "vitest";

import {
  buildFallbackGeneratedForm,
  buildFallbackRevisedForm,
  normalizeGeneratedSchema,
} from "./form-generator";

describe("form-generator", () => {
  it("normalizes generated schema and keeps supported options", () => {
    const schema = normalizeGeneratedSchema({
      fields: [
        {
          key: "Applicant Name",
          label: "Applicant Name",
          type: "text",
          required: true,
          placeholder: "Enter your name",
        },
        {
          key: "channel",
          label: "Channel",
          type: "select",
          options: [
            { label: "Online", value: "online" },
            { label: "Offline", value: "offline" },
          ],
        },
      ],
    });

    expect(schema.fields).toHaveLength(2);
    expect(schema.fields[0].key).toBe("applicant_name");
    expect(schema.fields[0].required).toBe(true);
    expect(schema.fields[1].options).toEqual([
      { label: "Online", value: "online" },
      { label: "Offline", value: "offline" },
    ]);
  });

  it("builds a receipt-oriented fallback draft for invoice prompts", () => {
    const draft = buildFallbackGeneratedForm(
      "帮我生成一个发票报销资料收集表单",
      "business"
    );

    expect(draft.theme).toBe("business");
    expect(draft.title).toContain("票据");
    expect(draft.schema.fields.some((field) => field.type === "image")).toBe(
      true
    );
  });

  it("builds a registration-oriented fallback draft for booking prompts", () => {
    const draft = buildFallbackGeneratedForm("创建一个活动报名登记表单");

    expect(draft.title).toContain("报名");
    expect(draft.schema.fields.some((field) => field.key === "attendee_count")).toBe(true);
    expect(draft.schema.fields.some((field) => field.type === "number")).toBe(true);
  });

  it("builds a feedback-oriented fallback draft for survey prompts", () => {
    const draft = buildFallbackGeneratedForm("帮我生成一个客户满意度反馈问卷");

    expect(draft.title).toContain("反馈");
    expect(draft.schema.fields.some((field) => field.key === "satisfaction_level")).toBe(true);
    expect(draft.schema.fields.some((field) => field.type === "radio")).toBe(true);
  });

  it("preserves an existing draft when revision fallback adds a common field", () => {
    const draft = buildFallbackRevisedForm(
      "增加一个手机号字段",
      "business",
      "deepseek",
      "deepseek-chat",
      {
        layout: "single",
        fields: [
          {
            key: "contact_name",
            label: "怎么称呼你？",
            type: "text",
            required: true,
          },
        ],
      },
      "线索收集表",
      "适合收集客户线索"
    );

    expect(draft.title).toBe("线索收集表");
    expect(draft.description).toBe("适合收集客户线索");
    expect(draft.schema.layout).toBe("single");
    expect(draft.schema.fields.map((field) => field.key)).toEqual([
      "contact_name",
      "contact_mobile",
    ]);
  });

  it("keeps an existing draft unchanged when revision fallback cannot infer an edit", () => {
    const draft = buildFallbackRevisedForm(
      "帮我优化一下",
      "minimal",
      "openai",
      "gpt-test",
      {
        fields: [
          {
            key: "feedback",
            label: "你有什么建议？",
            type: "textarea",
          },
        ],
      },
      "反馈表"
    );

    expect(draft.title).toBe("反馈表");
    expect(draft.schema.fields).toHaveLength(1);
    expect(draft.schema.fields[0].key).toBe("feedback");
  });
});
