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

  it("replaces a phone field with an email field in revision fallback", () => {
    const draft = buildFallbackRevisedForm(
      "把电话字段改成邮箱",
      "minimal",
      "deepseek",
      "deepseek-chat",
      {
        fields: [
          {
            key: "contact_mobile",
            label: "你的手机号是？",
            type: "text",
            required: true,
          },
          {
            key: "remark",
            label: "备注",
            type: "textarea",
          },
        ],
      }
    );

    expect(draft.schema.fields.map((field) => field.key)).toEqual([
      "contact_email",
      "remark",
    ]);
    expect(draft.schema.fields[0]).toMatchObject({
      label: "你的邮箱是？",
      type: "email",
      required: true,
    });
  });

  it("removes requested fields in revision fallback", () => {
    const draft = buildFallbackRevisedForm(
      "删除备注字段",
      "minimal",
      "openai",
      "gpt-test",
      {
        fields: [
          { key: "name", label: "怎么称呼你？", type: "text" },
          { key: "remark", label: "备注", type: "textarea" },
        ],
      }
    );

    expect(draft.schema.fields.map((field) => field.key)).toEqual(["name"]);
  });

  it("limits fields in revision fallback", () => {
    const draft = buildFallbackRevisedForm(
      "精简到 3 个问题",
      "minimal",
      "openai",
      "gpt-test",
      {
        fields: [
          { key: "f1", label: "字段 1", type: "text" },
          { key: "f2", label: "字段 2", type: "text" },
          { key: "f3", label: "字段 3", type: "text" },
          { key: "f4", label: "字段 4", type: "text" },
          { key: "f5", label: "字段 5", type: "text" },
        ],
      }
    );

    expect(draft.schema.fields.map((field) => field.key)).toEqual([
      "f1",
      "f2",
      "f3",
    ]);
  });

  it("updates a matched field required rule in revision fallback", () => {
    const draft = buildFallbackRevisedForm(
      "把邮箱字段改成选填",
      "minimal",
      "openai",
      "gpt-test",
      {
        fields: [
          { key: "contact_email", label: "你的邮箱是？", type: "email", required: true },
          { key: "name", label: "怎么称呼你？", type: "text", required: true },
        ],
      }
    );

    expect(draft.schema.fields[0].required).toBe(false);
    expect(draft.schema.fields[1].required).toBe(true);
  });

  it("updates all required rules in revision fallback", () => {
    const draft = buildFallbackRevisedForm(
      "所有字段都设为必填",
      "minimal",
      "openai",
      "gpt-test",
      {
        fields: [
          { key: "name", label: "怎么称呼你？", type: "text", required: false },
          { key: "remark", label: "备注", type: "textarea", required: false },
        ],
      }
    );

    expect(draft.schema.fields.every((field) => field.required)).toBe(true);
  });

  it("updates a matched field type in revision fallback", () => {
    const draft = buildFallbackRevisedForm(
      "把预算字段改成单选",
      "minimal",
      "openai",
      "gpt-test",
      {
        fields: [
          { key: "budget", label: "你的预算是多少？", type: "text" },
          { key: "name", label: "怎么称呼你？", type: "text" },
        ],
      }
    );

    expect(draft.schema.fields[0].type).toBe("radio");
    expect(draft.schema.fields[0].options).toEqual([
      { label: "是", value: "yes" },
      { label: "否", value: "no" },
    ]);
    expect(draft.schema.fields[1].type).toBe("text");
  });

  it("updates an attachment field to image upload in revision fallback", () => {
    const draft = buildFallbackRevisedForm(
      "把附件字段改成图片上传",
      "minimal",
      "openai",
      "gpt-test",
      {
        fields: [
          { key: "attachment_file", label: "请上传附件", type: "file" },
          { key: "remark", label: "备注", type: "textarea" },
        ],
      }
    );

    expect(draft.schema.fields[0].type).toBe("image");
    expect(draft.schema.fields[0].options).toBeUndefined();
  });
});
