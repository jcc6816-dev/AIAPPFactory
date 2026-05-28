import { describe, expect, it, vi } from "vitest";
import { FormRecord, FormSubmissionRecord } from "@/types/form";
import { runMockAiInsightsSkill } from "./ai-insights";

const mocks = vi.hoisted(() => ({
  updateFormSubmissionByUuid: vi.fn().mockResolvedValue(true),
}));

vi.mock("@/models/form-submission", () => ({
  updateFormSubmissionByUuid: mocks.updateFormSubmissionByUuid,
}));

const form: FormRecord = {
  uuid: "form_test",
  user_uuid: "user_test",
  title: "Procurement Form",
  theme: "minimal",
  schema_json: { fields: [] },
  status: "draft",
  share_code: "share_test",
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
      skillSettings: {
        ai_insights: {
          enabled: true,
          tier: "pro",
          config: {
            high_value_threshold: 5000,
            summary_style: "risk",
          },
        },
      },
    },
  },
};

describe("AI Insights Skill", () => {
  it("generates summary and risk hints for high value submissions", async () => {
    const submission: FormSubmissionRecord = {
      uuid: "sub_test",
      form_uuid: "form_test",
      form_title: "Procurement Form",
      form_share_code: "share_test",
      answers_json: {
        total_amount: "6800",
        reason: "Laptop purchase",
      },
      files_json: [],
      status: "submitted",
    };

    const result = await runMockAiInsightsSkill(form, submission);

    expect(result.status).toBe("completed");
    expect(result.detail).toContain("Generated risk summary");
    expect(mocks.updateFormSubmissionByUuid).toHaveBeenCalledWith(
      "sub_test",
      expect.objectContaining({
        ocr_result_json: expect.objectContaining({
          structured_data: expect.objectContaining({
            ai_insights: expect.objectContaining({
              risk_hints: expect.arrayContaining([
                expect.stringContaining("High value detected"),
              ]),
            }),
          }),
        }),
      })
    );
  });
});
