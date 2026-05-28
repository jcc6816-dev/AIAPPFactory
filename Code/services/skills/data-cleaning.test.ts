import { describe, expect, it, vi } from "vitest";
import { FormRecord, FormSubmissionRecord } from "@/types/form";
import { runMockDataCleaningSkill } from "./data-cleaning";

const mocks = vi.hoisted(() => ({
  updateFormSubmissionByUuid: vi.fn().mockResolvedValue(true),
}));

vi.mock("@/models/form-submission", () => ({
  updateFormSubmissionByUuid: mocks.updateFormSubmissionByUuid,
}));

const form: FormRecord = {
  uuid: "form_test",
  user_uuid: "user_test",
  title: "Lead Form",
  theme: "minimal",
  schema_json: { fields: [] },
  status: "draft",
  share_code: "share_test",
};

describe("Data Cleaning Skill", () => {
  it("normalizes email, phone and whitespace values", async () => {
    const submission: FormSubmissionRecord = {
      uuid: "sub_test",
      form_uuid: "form_test",
      form_title: "Lead Form",
      form_share_code: "share_test",
      answers_json: {
        email: "  Sales@Example.COM ",
        phone: " 138-0000 1234 ",
        name: "  Ada   Lovelace ",
      },
      files_json: [],
      status: "submitted",
    };

    const result = await runMockDataCleaningSkill(form, submission);

    expect(result.status).toBe("completed");
    expect(result.detail).toContain("Normalized 3 field");
    expect(mocks.updateFormSubmissionByUuid).toHaveBeenCalledWith(
      "sub_test",
      expect.objectContaining({
        answers_json: {
          email: "sales@example.com",
          phone: "13800001234",
          name: "Ada Lovelace",
        },
      })
    );
  });
});
