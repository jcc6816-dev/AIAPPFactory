import { afterEach, describe, expect, it, vi } from "vitest";

import {
  createForm,
  ensureFormCreationAllowed,
  getFormCreationAllowance,
  inferOcrTemplate,
  isFormPublished,
  normalizeFormStatus,
  updateFormDraft,
} from "./form";

const formMocks = vi.hoisted(() => ({
  getFormsByUserUuidMock: vi.fn(),
  insertFormMock: vi.fn(),
  findFormByUuidMock: vi.fn(),
  updateFormByUuidMock: vi.fn(),
  getUserCreditsMock: vi.fn(),
}));

vi.mock("@/models/form", async () => {
  const actual = await vi.importActual<typeof import("@/models/form")>(
    "@/models/form"
  );
  return {
    ...actual,
    getFormsByUserUuid: formMocks.getFormsByUserUuidMock,
    insertForm: formMocks.insertFormMock,
    findFormByUuid: formMocks.findFormByUuidMock,
    updateFormByUuid: formMocks.updateFormByUuidMock,
  };
});

vi.mock("./credit", () => ({
  getUserCredits: formMocks.getUserCreditsMock,
}));

describe("form creation allowance", () => {
  afterEach(() => {
    vi.clearAllMocks();
    vi.unstubAllEnvs();
  });

  it("blocks free users after they reach the configured development limit", async () => {
    vi.stubEnv("NODE_ENV", "development");
    vi.stubEnv("DEV_FREE_FORM_LIMIT", "2");
    formMocks.getFormsByUserUuidMock.mockResolvedValue([
      { uuid: "form_1" },
      { uuid: "form_2" },
    ]);
    formMocks.getUserCreditsMock.mockResolvedValue({
      left_credits: 10,
      is_recharged: false,
    });

    await expect(ensureFormCreationAllowed("user_free")).rejects.toThrow(
      "free plan users have reached the current form limit"
    );
  });

  it("allows paid users to create more than one form", async () => {
    formMocks.getFormsByUserUuidMock.mockResolvedValue([
      { uuid: "form_1" },
      { uuid: "form_2" },
    ]);
    formMocks.getUserCreditsMock.mockResolvedValue({
      left_credits: 10,
      is_recharged: true,
    });

    const allowance = await getFormCreationAllowance("user_paid");
    expect(allowance.canCreate).toBe(true);
    expect(allowance.isPaidUser).toBe(true);
    expect(allowance.maxForms).toBeNull();
  });

  it("defaults free users to 100 forms in development", async () => {
    vi.stubEnv("NODE_ENV", "development");
    formMocks.getFormsByUserUuidMock.mockResolvedValue(
      Array.from({ length: 5 }, (_, index) => ({ uuid: `form_${index}` }))
    );
    formMocks.getUserCreditsMock.mockResolvedValue({
      left_credits: 10,
      is_recharged: false,
    });

    const allowance = await getFormCreationAllowance("user_free");
    expect(allowance.maxForms).toBe(100);
    expect(allowance.canCreate).toBe(true);
  });

  it("infers invoice OCR template from form semantics", () => {
    expect(
      inferOcrTemplate({
        title: "报销发票收集",
        description: "上传发票图片并识别金额",
      })
    ).toBe("invoice");
  });

  it("normalizes form status to the publishable MVP states", () => {
    expect(normalizeFormStatus("published")).toBe("published");
    expect(normalizeFormStatus("draft")).toBe("draft");
    expect(normalizeFormStatus("archived")).toBe("draft");
    expect(normalizeFormStatus(undefined)).toBe("draft");
  });

  it("checks whether a form is publicly published", () => {
    expect(isFormPublished({ status: "published" })).toBe(true);
    expect(isFormPublished({ status: "draft" })).toBe(false);
    expect(isFormPublished(null)).toBe(false);
  });

  it("persists template OCR and webhook presets when creating a form", async () => {
    formMocks.getFormsByUserUuidMock.mockResolvedValue([]);
    formMocks.getUserCreditsMock.mockResolvedValue({
      left_credits: 10,
      is_recharged: true,
    });
    formMocks.insertFormMock.mockImplementation(async (form) => form);

    const form = await createForm("user_paid", {
      title: "发票票据收集表",
      theme: "business",
      schema: {
        layout: "single",
        aspects: {
          visualDirection: "finance-ops",
          themeVariant: "glass",
          preferredDevice: "desktop",
        },
        fields: [
          {
            key: "invoice_image",
            label: "请上传发票",
            type: "image",
            required: true,
          },
        ],
      },
      ocr_template: "invoice",
      webhook: {
        enabled: false,
        provider: "dingtalk_bot",
      },
      generation: {
        source: "fallback",
        prompt: "帮我生成发票票据收集表",
        clarification_answers: {
          need_upload: "required_image",
        },
      },
    });

    expect(form.ocr_template).toBe("invoice");
    expect(form.webhook_provider).toBe("dingtalk_bot");
    expect(form.webhook_enabled).toBe(false);
    expect(form.generation_meta_json?.artifact).toMatchObject({
      kind: "form",
      artifactVersion: 1,
      status: "draft",
      sourcePrompt: "帮我生成发票票据收集表",
      clarificationAnswers: {
        need_upload: "required_image",
      },
      visualSettings: {
        theme: "business",
        layout: "single",
        themeVariant: "glass",
        preferredDevice: "desktop",
        visualDirection: "finance-ops",
      },
    });
    expect(form.generation_meta_json?.artifact?.history?.[0]).toMatchObject({
      type: "generated",
      snapshot: {
        status: "draft",
      },
    });
  });

  it("appends visual history when updating a draft", async () => {
    formMocks.findFormByUuidMock.mockResolvedValue({
      uuid: "form_1",
      user_uuid: "user_paid",
      title: "Lead Form",
      description: "",
      theme: "minimal",
      status: "draft",
      share_code: "share_1",
      schema_json: {
        layout: "single",
        fields: [
          {
            key: "name",
            label: "Name",
            type: "text",
          },
        ],
      },
      generation_meta_json: {
        source: "template",
        artifact: {
          kind: "form",
          artifactVersion: 1,
          status: "draft",
          visualSettings: {
            theme: "minimal",
            layout: "single",
            themeVariant: "default",
            preferredDevice: "phone",
          },
          createdAt: "2026-05-25T00:00:00.000Z",
          updatedAt: "2026-05-25T00:00:00.000Z",
          history: [
            {
              id: "created",
              type: "template_applied",
              summary: "Created form artifact from a template.",
              createdAt: "2026-05-25T00:00:00.000Z",
            },
          ],
        },
      },
    });
    formMocks.updateFormByUuidMock.mockImplementation(async (_uuid, updates) => ({
      uuid: "form_1",
      ...updates,
    }));

    const updated = await updateFormDraft("user_paid", "form_1", {
      theme: "neon",
      schema: {
        layout: "single",
        aspects: {
          themeVariant: "gradient-flow",
          visualDirection: "creator-launch",
          preferredDevice: "phone",
        },
        fields: [
          {
            key: "name",
            label: "Name",
            type: "text",
          },
        ],
      },
    });

    expect(updated?.generation_meta_json?.artifact?.history?.map((event) => event.type)).toEqual([
      "template_applied",
      "visual_changed",
    ]);
    expect(updated?.generation_meta_json?.artifact?.visualSettings).toMatchObject({
      theme: "neon",
      themeVariant: "gradient-flow",
      visualDirection: "creator-launch",
    });
  });

  it("blocks publishing forms that fail the publish readiness check", async () => {
    formMocks.getFormsByUserUuidMock.mockResolvedValue([]);
    formMocks.getUserCreditsMock.mockResolvedValue({
      left_credits: 10,
      is_recharged: true,
    });
    formMocks.insertFormMock.mockImplementation(async (form) => form);

    await expect(
      createForm("user_paid", {
        title: "选择题缺少选项",
        status: "published",
        schema: {
          fields: [
            {
              key: "interest",
              label: "请选择感兴趣的方向",
              type: "select",
              required: true,
            },
          ],
        },
      })
    ).rejects.toThrow("发布前检查未通过");
    expect(formMocks.insertFormMock).not.toHaveBeenCalled();
  });

  it("persists enabled form skills into artifact metadata", async () => {
    formMocks.getUserCreditsMock.mockResolvedValue({
      left_credits: 10,
      is_recharged: true,
    });
    formMocks.findFormByUuidMock.mockResolvedValue({
      uuid: "form_1",
      user_uuid: "user_paid",
      title: "Expense Form",
      description: "",
      theme: "minimal",
      status: "draft",
      share_code: "share_1",
      schema_json: {
        fields: [{ key: "amount", label: "Amount", type: "number" }],
      },
      generation_meta_json: {
        source: "template",
        artifact: {
          kind: "form",
          artifactVersion: 1,
          status: "draft",
          visualSettings: {
            theme: "minimal",
            layout: "single",
            themeVariant: "default",
            preferredDevice: "phone",
          },
          history: [],
        },
      },
    });
    formMocks.updateFormByUuidMock.mockImplementation(async (_uuid, updates) => ({
      uuid: "form_1",
      ...updates,
    }));

    const updated = await updateFormDraft("user_paid", "form_1", {
      skill_settings: {
        deduplication: { enabled: true },
        table_ocr: { enabled: true },
      },
    });

    expect(updated?.generation_meta_json?.artifact?.skillSettings).toMatchObject({
      deduplication: { enabled: true, tier: "free" },
      table_ocr: { enabled: true, tier: "pro" },
    });
    expect(updated?.generation_meta_json?.artifact?.history?.at(-1)?.type).toBe(
      "skill_changed"
    );
  });

  it("blocks free users from enabling pro skills on the backend", async () => {
    formMocks.getUserCreditsMock.mockResolvedValue({
      left_credits: 10,
      is_recharged: false,
    });
    formMocks.findFormByUuidMock.mockResolvedValue({
      uuid: "form_1",
      user_uuid: "user_free",
      title: "Expense Form",
      description: "",
      theme: "minimal",
      status: "draft",
      share_code: "share_1",
      schema_json: {
        fields: [{ key: "amount", label: "Amount", type: "number" }],
      },
      generation_meta_json: {
        artifact: {
          kind: "form",
          artifactVersion: 1,
          status: "draft",
          visualSettings: {
            theme: "minimal",
            layout: "single",
            themeVariant: "default",
            preferredDevice: "phone",
          },
        },
      },
    });

    await expect(
      updateFormDraft("user_free", "form_1", {
        skill_settings: {
          ai_pre_audit: { enabled: true },
        },
      })
    ).rejects.toThrow("pro skill requires an active paid plan");
  });

  it("persists skill settings on form creation", async () => {
    formMocks.getFormsByUserUuidMock.mockResolvedValue([]);
    formMocks.getUserCreditsMock.mockResolvedValue({
      left_credits: 10,
      is_recharged: true,
    });
    formMocks.insertFormMock.mockImplementation(async (form) => form);

    const form = await createForm("user_paid", {
      title: "表单",
      schema: {
        fields: [{ key: "f", label: "Field", type: "text" }],
      },
      skill_settings: {
        deduplication: {
          enabled: true,
          config: { check_files: true },
        },
      },
    });

    expect(form.generation_meta_json?.artifact?.skillSettings?.deduplication).toMatchObject({
      enabled: true,
      config: { check_files: true },
    });
  });
});
