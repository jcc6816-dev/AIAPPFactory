import { describe, expect, it } from "vitest";
import { FormRecord, FormSubmissionRecord } from "@/types/form";
import { runMockAiPreAuditSkill } from "./ai-pre-audit";

const form: FormRecord = {
  uuid: "form_test",
  user_uuid: "user_test",
  title: "Procurement Form",
  theme: "minimal",
  schema_json: { fields: [] },
  status: "draft",
  share_code: "share_test",
};

describe("AI Compliance Pre-audit Skill", () => {
  it("passes when amounts are below threshold", async () => {
    const submission: FormSubmissionRecord = {
      uuid: "sub_test",
      form_uuid: "form_test",
      form_title: "Procurement Form",
      form_share_code: "share_test",
      answers_json: { total_amount: "1500" },
      files_json: [],
      status: "submitted",
    };

    const result = await runMockAiPreAuditSkill(form, submission);
    expect(result.status).toBe("completed");
    expect(result.detail).toContain("AI Audit PASSED");
  });

  it("triggers warning alert when cost exceeds 5000 limit", async () => {
    const submission: FormSubmissionRecord = {
      uuid: "sub_test",
      form_uuid: "form_test",
      form_title: "Procurement Form",
      form_share_code: "share_test",
      answers_json: { total_amount: "6200" },
      files_json: [],
      status: "submitted",
    };

    const result = await runMockAiPreAuditSkill(form, submission);
    expect(result.status).toBe("completed");
    expect(result.detail).toContain("AI Audit WARNING");
  });
});
