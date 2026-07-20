import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const routeMocks = vi.hoisted(() => ({
  getUserUuid: vi.fn(),
  getFormByUuidForUser: vi.fn(),
  getFormSubmissionByUuid: vi.fn(),
  isFirstSuccessLoopEnabled: vi.fn(),
  recordTrustedFirstResultView: vi.fn(),
}));

vi.mock("@/services/user", () => ({ getUserUuid: routeMocks.getUserUuid }));
vi.mock("@/services/form", () => ({
  getFormByUuidForUser: routeMocks.getFormByUuidForUser,
}));
vi.mock("@/models/form-submission", () => ({
  getFormSubmissionByUuid: routeMocks.getFormSubmissionByUuid,
}));
vi.mock("@/services/first-success", () => ({
  isFirstSuccessLoopEnabled: routeMocks.isFirstSuccessLoopEnabled,
  recordTrustedFirstResultView: routeMocks.recordTrustedFirstResultView,
}));

import { POST } from "./route";

function request(submissionUuid = "sub_test_1") {
  return new Request("http://test.local/api/forms/form_1/result-view", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ submission_uuid: submissionUuid }),
  });
}

const form = { uuid: "form_1", share_code: "share_1" };
const submission = { uuid: "sub_test_1", form_uuid: "form_1", is_test: true };

describe("trusted result view API", () => {
  beforeEach(() => {
    routeMocks.isFirstSuccessLoopEnabled.mockReturnValue(true);
  });

  afterEach(() => vi.clearAllMocks());

  it("requires authentication", async () => {
    routeMocks.getUserUuid.mockResolvedValue("");
    const response = await POST(request(), {
      params: Promise.resolve({ id: "form_1" }),
    });
    expect((await response.json()).code).toBe(-2);
  });

  it("does not trust a form the user does not own", async () => {
    routeMocks.getUserUuid.mockResolvedValue("user_1");
    routeMocks.getFormByUuidForUser.mockResolvedValue(undefined);
    const response = await POST(request(), {
      params: Promise.resolve({ id: "form_1" }),
    });
    expect((await response.json()).message).toBe("form not found");
    expect(routeMocks.getFormSubmissionByUuid).not.toHaveBeenCalled();
  });

  it("rejects a submission belonging to another form", async () => {
    routeMocks.getUserUuid.mockResolvedValue("user_1");
    routeMocks.getFormByUuidForUser.mockResolvedValue(form);
    routeMocks.getFormSubmissionByUuid.mockResolvedValue({
      ...submission,
      form_uuid: "form_other",
    });
    const response = await POST(request(), {
      params: Promise.resolve({ id: "form_1" }),
    });
    expect((await response.json()).message).toBe("submission not found");
    expect(routeMocks.recordTrustedFirstResultView).not.toHaveBeenCalled();
  });

  it("records a verified result view and returns activation state", async () => {
    routeMocks.getUserUuid.mockResolvedValue("user_1");
    routeMocks.getFormByUuidForUser.mockResolvedValue(form);
    routeMocks.getFormSubmissionByUuid.mockResolvedValue(submission);
    routeMocks.recordTrustedFirstResultView.mockResolvedValue({
      firstResultRecorded: true,
      activationCompleted: true,
      activationRecorded: true,
    });

    const response = await POST(request(), {
      params: Promise.resolve({ id: "form_1" }),
    });
    const json = await response.json();

    expect(routeMocks.recordTrustedFirstResultView).toHaveBeenCalledWith({
      userUuid: "user_1",
      formUuid: "form_1",
      shareCode: "share_1",
      submission,
    });
    expect(json.data.activation_completed).toBe(true);
  });

  it("honors the emergency kill switch without writing events", async () => {
    routeMocks.getUserUuid.mockResolvedValue("user_1");
    routeMocks.isFirstSuccessLoopEnabled.mockReturnValue(false);
    const response = await POST(request(), {
      params: Promise.resolve({ id: "form_1" }),
    });
    const json = await response.json();

    expect(json.data.disabled).toBe(true);
    expect(routeMocks.recordTrustedFirstResultView).not.toHaveBeenCalled();
  });
});
