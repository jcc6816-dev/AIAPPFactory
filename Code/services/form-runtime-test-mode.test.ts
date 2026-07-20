import { afterEach, describe, expect, it, vi } from "vitest";

const runtimeMocks = vi.hoisted(() => ({
  getUserCredits: vi.fn(),
  getFormSubmissions: vi.fn(),
  chargeCredits: vi.fn(),
  insertSubmission: vi.fn(),
  updateSubmission: vi.fn(),
  createWorkflow: vi.fn(),
  executeWorkflow: vi.fn(),
}));

vi.mock("@/models/form-submission", () => ({
  FormSubmissionStatus: { Submitted: "submitted" },
  getFormSubmissionsByFormUuid: runtimeMocks.getFormSubmissions,
  insertFormSubmission: runtimeMocks.insertSubmission,
  updateFormSubmissionByUuid: runtimeMocks.updateSubmission,
}));

vi.mock("./billing", () => ({
  chargeFormSubmissionCredits: runtimeMocks.chargeCredits,
}));

vi.mock("./credit", () => ({
  getUserCredits: runtimeMocks.getUserCredits,
}));

vi.mock("./workflow", () => ({
  createWorkflowRunForSubmission: runtimeMocks.createWorkflow,
  executeMockWorkflowRun: runtimeMocks.executeWorkflow,
}));

import { submitForm } from "./form-runtime";

const form = {
  uuid: "form_1",
  user_uuid: "user_1",
  title: "Client intake",
  share_code: "share_1",
  schema_json: {
    fields: [
      { key: "name", label: "Name", type: "text", required: true },
    ],
  },
} as any;

describe("test submission runtime", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it("stores a completed test result without quota, billing, OCR, or workflow side effects", async () => {
    runtimeMocks.insertSubmission.mockImplementation(async (submission) => submission);

    const result = await submitForm(
      form,
      { answers: { name: "Ada" } },
      { mode: "test" }
    );

    expect(result).toEqual(
      expect.objectContaining({
        form_uuid: "form_1",
        answers_json: { name: "Ada" },
        is_test: true,
        status: "completed",
        ocr_status: "not_requested",
      })
    );
    expect(runtimeMocks.getUserCredits).not.toHaveBeenCalled();
    expect(runtimeMocks.getFormSubmissions).not.toHaveBeenCalled();
    expect(runtimeMocks.chargeCredits).not.toHaveBeenCalled();
    expect(runtimeMocks.createWorkflow).not.toHaveBeenCalled();
    expect(runtimeMocks.executeWorkflow).not.toHaveBeenCalled();
    expect(runtimeMocks.updateSubmission).not.toHaveBeenCalled();
  });

  it("still validates required answers before storing a test result", async () => {
    await expect(
      submitForm(form, { answers: {} }, { mode: "test" })
    ).rejects.toThrow("Name is required");

    expect(runtimeMocks.insertSubmission).not.toHaveBeenCalled();
  });

  it("does not count stored test results against the public free limit", async () => {
    runtimeMocks.getUserCredits.mockResolvedValue({ is_recharged: false });
    runtimeMocks.getFormSubmissions.mockResolvedValue(
      Array.from({ length: 50 }, (_, index) => ({
        uuid: `test_${index}`,
        is_test: true,
      }))
    );
    runtimeMocks.chargeCredits.mockResolvedValue(undefined);
    runtimeMocks.insertSubmission.mockImplementation(async (submission) => submission);
    runtimeMocks.createWorkflow.mockResolvedValue({ uuid: "workflow_1" });
    runtimeMocks.updateSubmission.mockImplementation(
      async (_uuid, updates) => ({ ...updates, uuid: "sub_public_1" })
    );
    runtimeMocks.executeWorkflow.mockResolvedValue({
      uuid: "workflow_1",
      status: "completed",
    });

    await expect(
      submitForm(form, { answers: { name: "Ada" } })
    ).resolves.toEqual(expect.objectContaining({ status: "completed" }));
  });
});
