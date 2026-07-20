import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const routeMocks = vi.hoisted(() => ({
  getUserUuid: vi.fn(),
  getFormByUuidForUser: vi.fn(),
  isFormPublished: vi.fn(),
  parseSubmitRequest: vi.fn(),
  submitForm: vi.fn(),
  createGrowthEvent: vi.fn(),
  deleteTestFormSubmission: vi.fn(),
  isFirstSuccessLoopEnabled: vi.fn(),
  checkFirstSuccessRateLimit: vi.fn(),
}));

vi.mock("@/services/user", () => ({
  getUserUuid: routeMocks.getUserUuid,
}));

vi.mock("@/services/form", () => ({
  getFormByUuidForUser: routeMocks.getFormByUuidForUser,
  isFormPublished: routeMocks.isFormPublished,
}));

vi.mock("@/services/form-submission-request", () => ({
  parseSubmitRequest: routeMocks.parseSubmitRequest,
}));

vi.mock("@/services/form-runtime", () => ({
  submitForm: routeMocks.submitForm,
}));

vi.mock("@/models/growth-event", () => ({
  createGrowthEventSafely: routeMocks.createGrowthEvent,
}));

vi.mock("@/models/form-submission", () => ({
  deleteTestFormSubmission: routeMocks.deleteTestFormSubmission,
}));

vi.mock("@/services/first-success", () => ({
  isFirstSuccessLoopEnabled: routeMocks.isFirstSuccessLoopEnabled,
  checkFirstSuccessRateLimit: routeMocks.checkFirstSuccessRateLimit,
}));

import { DELETE, POST } from "./route";

const form = {
  uuid: "form_1",
  user_uuid: "user_1",
  title: "Client intake",
  share_code: "share_1",
  status: "published",
};

function request() {
  return new Request("http://test.local/api/forms/form_1/test-submission", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ answers: { name: "Ada" } }),
  });
}

describe("test submission API", () => {
  beforeEach(() => {
    routeMocks.isFirstSuccessLoopEnabled.mockReturnValue(true);
    routeMocks.checkFirstSuccessRateLimit.mockReturnValue(true);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("requires an authenticated creator", async () => {
    routeMocks.getUserUuid.mockResolvedValue("");

    const response = await POST(request(), {
      params: Promise.resolve({ id: "form_1" }),
    });

    expect((await response.json()).code).toBe(-2);
    expect(routeMocks.getFormByUuidForUser).not.toHaveBeenCalled();
  });

  it("rejects forms the creator does not own", async () => {
    routeMocks.getUserUuid.mockResolvedValue("user_1");
    routeMocks.getFormByUuidForUser.mockResolvedValue(undefined);

    const response = await POST(request(), {
      params: Promise.resolve({ id: "form_1" }),
    });

    expect((await response.json()).message).toBe("form not found");
    expect(routeMocks.submitForm).not.toHaveBeenCalled();
  });

  it("rejects unpublished forms", async () => {
    routeMocks.getUserUuid.mockResolvedValue("user_1");
    routeMocks.getFormByUuidForUser.mockResolvedValue(form);
    routeMocks.isFormPublished.mockReturnValue(false);

    const response = await POST(request(), {
      params: Promise.resolve({ id: "form_1" }),
    });

    expect((await response.json()).message).toBe("form is not published");
    expect(routeMocks.submitForm).not.toHaveBeenCalled();
  });

  it("stops new test submissions when the kill switch is disabled", async () => {
    routeMocks.getUserUuid.mockResolvedValue("user_1");
    routeMocks.isFirstSuccessLoopEnabled.mockReturnValue(false);

    const response = await POST(request(), {
      params: Promise.resolve({ id: "form_1" }),
    });

    expect((await response.json()).message).toBe(
      "first success loop is disabled"
    );
    expect(routeMocks.getFormByUuidForUser).not.toHaveBeenCalled();
  });

  it("rate limits repeated test submissions for one owner and form", async () => {
    routeMocks.getUserUuid.mockResolvedValue("user_1");
    routeMocks.getFormByUuidForUser.mockResolvedValue(form);
    routeMocks.isFormPublished.mockReturnValue(true);
    routeMocks.checkFirstSuccessRateLimit.mockReturnValue(false);

    const response = await POST(request(), {
      params: Promise.resolve({ id: "form_1" }),
    });

    expect((await response.json()).message).toContain("too many test submissions");
    expect(routeMocks.submitForm).not.toHaveBeenCalled();
  });

  it("stores a published form submission in isolated test mode", async () => {
    routeMocks.getUserUuid.mockResolvedValue("user_1");
    routeMocks.getFormByUuidForUser.mockResolvedValue(form);
    routeMocks.isFormPublished.mockReturnValue(true);
    routeMocks.parseSubmitRequest.mockResolvedValue({
      answers: { name: "Ada" },
      files: [],
      storage_files: [],
    });
    routeMocks.submitForm.mockResolvedValue({
      uuid: "sub_test_1",
      is_test: true,
    });

    const response = await POST(request(), {
      params: Promise.resolve({ id: "form_1" }),
    });
    const json = await response.json();

    expect(routeMocks.getFormByUuidForUser).toHaveBeenCalledWith(
      "user_1",
      "form_1"
    );
    expect(routeMocks.submitForm).toHaveBeenCalledWith(
      form,
      expect.objectContaining({ answers: { name: "Ada" } }),
      { mode: "test" }
    );
    expect(routeMocks.createGrowthEvent).toHaveBeenCalledWith(
      expect.objectContaining({
        event_name: "test_submission_completed",
        metadata_json: { submission_uuid: "sub_test_1" },
      })
    );
    expect(json.code).toBe(0);
    expect(json.data.uuid).toBe("sub_test_1");
  });

  it("deletes only through the test-only model contract", async () => {
    routeMocks.getUserUuid.mockResolvedValue("user_1");
    routeMocks.getFormByUuidForUser.mockResolvedValue(form);
    routeMocks.deleteTestFormSubmission.mockResolvedValue(true);
    const deleteRequest = new Request(
      "http://test.local/api/forms/form_1/test-submission",
      {
        method: "DELETE",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ submission_uuid: "sub_test_1" }),
      }
    );

    const response = await DELETE(deleteRequest, {
      params: Promise.resolve({ id: "form_1" }),
    });

    expect(routeMocks.deleteTestFormSubmission).toHaveBeenCalledWith(
      "form_1",
      "sub_test_1"
    );
    expect((await response.json()).code).toBe(0);
  });

  it("does not report a real or missing submission as deleted", async () => {
    routeMocks.getUserUuid.mockResolvedValue("user_1");
    routeMocks.getFormByUuidForUser.mockResolvedValue(form);
    routeMocks.deleteTestFormSubmission.mockResolvedValue(false);
    const deleteRequest = new Request(
      "http://test.local/api/forms/form_1/test-submission",
      {
        method: "DELETE",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ submission_uuid: "sub_real_1" }),
      }
    );

    const response = await DELETE(deleteRequest, {
      params: Promise.resolve({ id: "form_1" }),
    });

    expect((await response.json()).message).toBe("test submission not found");
  });
});
