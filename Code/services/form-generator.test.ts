import { describe, expect, it, vi } from "vitest";

const mockGenerateText = vi.fn().mockResolvedValue({
  text: JSON.stringify({
    title: "Revised Form",
    description: "Revised description",
    theme: "minimal",
    schema: {
      layout: "single",
      fields: [
        {
          key: "revised_field",
          label: "Revised Field",
          type: "text",
          required: true,
        }
      ]
    }
  })
});

vi.mock("ai", () => ({
  generateText: (...args: any[]) => mockGenerateText(...args),
}));

import {
  buildFallbackGeneratedForm,
  buildFallbackRevisedForm,
  generateFormSchemaFromPrompt,
  normalizeGeneratedSchema,
  generateClarificationQuestions,
} from "./form-generator";


describe("form-generator", () => {
  it("normalizes generated schema and keeps supported options", () => {
    const schema = normalizeGeneratedSchema({
      aspects: {
        welcomeImage: "aurora-sphere",
        welcomeImagePosition: "left",
        themeVariant: "glass",
        visualDirection: "premium-event",
        preferredDevice: "desktop",
      },
      fields: [
        {
          key: "Applicant Name",
          label: "Applicant Name",
          type: "text",
          required: true,
          placeholder: "Enter your name",
          image: "ai-planet-pass",
          imagePosition: "right",
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
    expect(schema.fields[0].image).toBe("ai-planet-pass");
    expect(schema.fields[0].imagePosition).toBe("right");
    expect(schema.aspects).toEqual({
      welcomeImage: "aurora-sphere",
      welcomeImagePosition: "left",
      themeVariant: "glass",
      visualDirection: "premium-event",
      preferredDevice: "desktop",
    });
    expect(schema.fields[1].options).toEqual([
      { label: "Online", value: "online" },
      { label: "Offline", value: "offline" },
    ]);
  });

  it("builds a receipt-oriented fallback draft for invoice prompts", () => {
    const draft = buildFallbackGeneratedForm(
      "帮我生成一个发票报销资料收集表单",
      "business",
      "openai",
      undefined,
      { need_upload: "required_image" }
    );

    expect(draft.theme).toBe("business");
    expect(draft.title).toContain("票据");
    expect(draft.schema.fields.some((field) => field.type === "image")).toBe(
      true
    );
    expect(draft.artifact).toMatchObject({
      kind: "form",
      status: "draft",
      sourcePrompt: "帮我生成一个发票报销资料收集表单",
      clarificationAnswers: { need_upload: "required_image" },
      visualSettings: {
        theme: "business",
        layout: "single",
        themeVariant: "default",
        preferredDevice: "phone",
      },
    });
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

  it("updates matched field label copy in revision fallback", () => {
    const draft = buildFallbackRevisedForm(
      "把姓名字段文案改成怎么称呼你？",
      "minimal",
      "openai",
      "gpt-test",
      {
        fields: [
          { key: "name", label: "姓名", type: "text" },
          { key: "remark", label: "备注", type: "textarea" },
        ],
      }
    );

    expect(draft.schema.fields[0].label).toBe("怎么称呼你？");
    expect(draft.schema.fields[1].label).toBe("备注");
  });

  it("updates matched field placeholder in revision fallback", () => {
    const draft = buildFallbackRevisedForm(
      "把邮箱字段占位提示改成请输入你的工作邮箱",
      "minimal",
      "openai",
      "gpt-test",
      {
        fields: [
          {
            key: "contact_email",
            label: "邮箱",
            type: "email",
            placeholder: "请输入邮箱",
          },
        ],
      }
    );

    expect(draft.schema.fields[0].placeholder).toBe("请输入你的工作邮箱");
  });

  it("updates matched choice options in revision fallback", () => {
    const draft = buildFallbackRevisedForm(
      "把满意度选项改成非常满意、满意、一般、不满意",
      "minimal",
      "openai",
      "gpt-test",
      {
        fields: [
          {
            key: "satisfaction_level",
            label: "满意度",
            type: "radio",
            options: [
              { label: "好", value: "good" },
              { label: "差", value: "bad" },
            ],
          },
        ],
      }
    );

    expect(draft.schema.fields[0].options).toEqual([
      { label: "非常满意", value: "非常满意" },
      { label: "满意", value: "满意" },
      { label: "一般", value: "一般" },
      { label: "不满意", value: "不满意" },
    ]);
  });

  it("keeps the schema unchanged for inspection-only revision prompts", () => {
    const existingSchema = {
      layout: "single" as const,
      fields: Array.from({ length: 9 }, (_, index) => ({
        key: `field_${index + 1}`,
        label: `字段 ${index + 1}`,
        type: "text" as const,
      })),
    };

    const draft = buildFallbackRevisedForm(
      "帮我检查这个表单是否太长",
      "minimal",
      "deepseek",
      "deepseek-chat",
      existingSchema,
      "测试表单"
    );

    expect(draft.title).toBe("测试表单");
    expect(draft.schema.fields.map((field) => field.key)).toEqual(
      existingSchema.fields.map((field) => field.key)
    );
    expect(draft.schema.fields.map((field) => field.type)).toEqual(
      existingSchema.fields.map((field) => field.type)
    );
  });

  it("does not call an LLM or alter fields for vague revision prompts", async () => {
    const draft = await generateFormSchemaFromPrompt("帮我优化一下", "minimal", {
      provider: "deepseek",
      model: "deepseek-chat",
      existingTitle: "反馈表",
      existingSchema: {
        fields: [
          {
            key: "feedback",
            label: "你有什么建议？",
            type: "textarea",
          },
        ],
      },
    });

    expect(draft.source).toBe("fallback");
    expect(draft.title).toBe("反馈表");
    expect(draft.schema.fields.map((field) => field.key)).toEqual(["feedback"]);
  });

  it("generates clarification questions for different vague prompts in fallback mode", async () => {
    const receiptQs = await generateClarificationQuestions("帮我做一个报销单表单");
    expect(receiptQs).toHaveLength(2);
    expect(receiptQs[0].id).toBe("invoice_type");
    expect(receiptQs[1].id).toBe("need_upload");

    const bookingQs = await generateClarificationQuestions("生成一个活动报名表");
    expect(bookingQs).toHaveLength(2);
    expect(bookingQs[0].id).toBe("event_type");
    expect(bookingQs[1].id).toBe("need_contact");

    const feedbackQs = await generateClarificationQuestions("生成一个用户满意度调查表");
    expect(feedbackQs).toHaveLength(2);
    expect(feedbackQs[0].id).toBe("survey_target");
    expect(feedbackQs[1].id).toBe("rating_format");

    const generalQs = await generateClarificationQuestions("帮我做个表单");
    expect(generalQs).toHaveLength(2);
    expect(generalQs[0].id).toBe("form_layout");
  });

  it("builds fallback form with adjustments from clarifications", () => {
    const draft = buildFallbackGeneratedForm("报销表单", "minimal", "openai", "test", {
      need_upload: "required_image",
    });
    expect(draft.schema.fields.some((f) => f.type === "image" && f.required)).toBe(true);

    const draftPdf = buildFallbackGeneratedForm("报销表单", "minimal", "openai", "test", {
      need_upload: "required_pdf",
    });
    expect(draftPdf.schema.fields.some((f) => f.type === "pdf" && f.required)).toBe(true);

    const draftWechat = buildFallbackGeneratedForm("报名活动", "minimal", "openai", "test", {
      need_contact: "wechat_only",
    });
    expect(draftWechat.schema.fields.some((f) => f.key === "wechat" && f.required)).toBe(true);
    expect(draftWechat.schema.fields.some((f) => f.type === "email")).toBe(false);
  });

  it("calls the LLM to revise when existingSchema is present and LLM is configured", async () => {
    const originalKey = process.env.OPENAI_API_KEY;
    process.env.OPENAI_API_KEY = "mock-api-key";

    try {
      const draft = await generateFormSchemaFromPrompt("在现有表单上加个微信号", "minimal", {
        provider: "openai",
        model: "gpt-4o-mini",
        existingTitle: "现有表单",
        existingDescription: "现有描述",
        existingSchema: {
          layout: "single",
          fields: [
            {
              key: "name",
              label: "姓名",
              type: "text",
              required: true,
            }
          ]
        }
      });

      expect(draft.source).toBe("ai");
      expect(draft.title).toBe("Revised Form");
      expect(draft.description).toBe("Revised description");
      expect(draft.schema.fields[0].key).toBe("revised_field");
      expect(draft.schema.fields[0].label).toBe("Revised Field");
    } finally {
      process.env.OPENAI_API_KEY = originalKey;
    }
  });
});

