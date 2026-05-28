import { describe, expect, it } from "vitest";
import { FormRecord, FormSubmissionRecord } from "@/types/form";
import { runMockDeduplicationSkill } from "./deduplication";

const form: FormRecord = {
  uuid: "form_test",
  user_uuid: "user_test",
  title: "Test Form",
  theme: "minimal",
  schema_json: { fields: [] },
  status: "draft",
  share_code: "share_test",
};

describe("Deduplication Skill", () => {
  it("passes when submission payload is unique", async () => {
    const submission: FormSubmissionRecord = {
      uuid: "sub_test",
      form_uuid: "form_test",
      form_title: "Test Form",
      form_share_code: "share_test",
      answers_json: { device_name: "MacBook Pro" },
      files_json: [{ field_key: "file", file_name: "receipt.jpg" }],
      status: "submitted",
    };

    const result = await runMockDeduplicationSkill(form, submission);
    expect(result.status).toBe("completed");
    expect(result.detail).toContain("Deduplication Passed");
  });

  it("fails when file name contains duplicate keyword", async () => {
    const submission: FormSubmissionRecord = {
      uuid: "sub_test",
      form_uuid: "form_test",
      form_title: "Test Form",
      form_share_code: "share_test",
      answers_json: { device_name: "MacBook Pro" },
      files_json: [{ field_key: "file", file_name: "receipt-copy.jpg" }],
      status: "submitted",
    };

    const result = await runMockDeduplicationSkill(form, submission);
    expect(result.status).toBe("failed");
    expect(result.detail).toContain("Deduplication Alert");
  });

  it("fails when answer text contains duplicate keyword", async () => {
    const submission: FormSubmissionRecord = {
      uuid: "sub_test",
      form_uuid: "form_test",
      form_title: "Test Form",
      form_share_code: "share_test",
      answers_json: { reason: "This is a duplicate submission request" },
      files_json: [],
      status: "submitted",
    };

    const result = await runMockDeduplicationSkill(form, submission);
    expect(result.status).toBe("failed");
    expect(result.detail).toContain("Deduplication Alert");
  });
});
