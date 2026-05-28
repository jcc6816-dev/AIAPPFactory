import { describe, expect, it } from "vitest";
import { FormRecord, FormSubmissionRecord } from "@/types/form";
import { runMockReportExportSkill } from "./report-export";

const form: FormRecord = {
  uuid: "form_test",
  user_uuid: "user_test",
  title: "Test Form",
  theme: "minimal",
  schema_json: { fields: [] },
  status: "draft",
  share_code: "share_test",
};

describe("Report Export Skill", () => {
  it("generates simple export summary by default", async () => {
    const submission: FormSubmissionRecord = {
      uuid: "sub_test",
      form_uuid: "form_test",
      form_title: "Test Form",
      form_share_code: "share_test",
      answers_json: {},
      files_json: [],
      status: "submitted",
    };

    const result = await runMockReportExportSkill(form, submission);
    expect(result.status).toBe("completed");
    expect(result.detail).toContain("Excel template assembled");
  });

  it("references table OCR output rows when available", async () => {
    const submission: FormSubmissionRecord = {
      uuid: "sub_test",
      form_uuid: "form_test",
      form_title: "Test Form",
      form_share_code: "share_test",
      answers_json: {},
      files_json: [],
      ocr_result_json: {
        structured_data: {
          table_rows: [
            { item: "MacBook", qty: 2 },
            { item: "Dell", qty: 4 }
          ]
        }
      },
      status: "submitted",
    };

    const result = await runMockReportExportSkill(form, submission);
    expect(result.status).toBe("completed");
    expect(result.detail).toContain("Flat Detail view with 2 items");
  });
});
