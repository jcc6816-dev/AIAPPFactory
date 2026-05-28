import { describe, expect, it, vi } from "vitest";
import { FormRecord, FormSubmissionRecord } from "@/types/form";
import { runMockTableOcrSkill } from "./table-ocr";

// Mock the model layer call to prevent Supabase connection issues
vi.mock("@/models/form-submission", () => ({
  updateFormSubmissionByUuid: vi.fn().mockResolvedValue(true),
}));

const form: FormRecord = {
  uuid: "form_test",
  user_uuid: "user_test",
  title: "Test Form",
  theme: "minimal",
  schema_json: {
    fields: [
      { key: "item_list", label: "清单明细", type: "textarea" }
    ]
  },
  status: "draft",
  share_code: "share_test",
};

describe("Table OCR Skill", () => {
  it("skips extraction when no files are uploaded", async () => {
    const submission: FormSubmissionRecord = {
      uuid: "sub_test",
      form_uuid: "form_test",
      form_title: "Test Form",
      form_share_code: "share_test",
      answers_json: {},
      files_json: [],
      status: "submitted",
    };

    const result = await runMockTableOcrSkill(form, submission);
    expect(result.status).toBe("completed");
    expect(result.detail).toContain("No files uploaded");
  });

  it("extracts and auto-populates list answers when files exist", async () => {
    const submission: FormSubmissionRecord = {
      uuid: "sub_test",
      form_uuid: "form_test",
      form_title: "Test Form",
      form_share_code: "share_test",
      answers_json: {},
      files_json: [{ field_key: "bill", file_name: "receipt.png" }],
      status: "submitted",
    };

    const result = await runMockTableOcrSkill(form, submission);
    expect(result.status).toBe("completed");
    expect(result.detail).toContain("Table OCR Succeeded");
    expect(submission.answers_json["item_list"]).toContain("MacBook Pro 16");
  });
});
