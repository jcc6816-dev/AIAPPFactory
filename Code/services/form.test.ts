import { afterEach, describe, expect, it, vi } from "vitest";

import {
  ensureFormCreationAllowed,
  getFormCreationAllowance,
  inferOcrTemplate,
} from "./form";

const formMocks = vi.hoisted(() => ({
  getFormsByUserUuidMock: vi.fn(),
  getUserCreditsMock: vi.fn(),
}));

vi.mock("@/models/form", async () => {
  const actual = await vi.importActual<typeof import("@/models/form")>(
    "@/models/form"
  );
  return {
    ...actual,
    getFormsByUserUuid: formMocks.getFormsByUserUuidMock,
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
});
