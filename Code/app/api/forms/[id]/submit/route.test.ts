import { afterEach, describe, expect, it, vi } from "vitest";

import { POST } from "./route";

const submitRouteMocks = vi.hoisted(() => ({
  findFormByUuidMock: vi.fn(),
  findFormByShareCodeMock: vi.fn(),
  submitFormMock: vi.fn(),
  persistSubmissionFilesMock: vi.fn(),
}));

vi.mock("@/models/form", async () => {
  const actual = await vi.importActual<typeof import("@/models/form")>(
    "@/models/form"
  );
  return {
    ...actual,
    findFormByUuid: submitRouteMocks.findFormByUuidMock,
    findFormByShareCode: submitRouteMocks.findFormByShareCodeMock,
  };
});

vi.mock("@/services/form-runtime", () => ({
  submitForm: submitRouteMocks.submitFormMock,
}));

vi.mock("@/services/submission-file", () => ({
  persistSubmissionFiles: submitRouteMocks.persistSubmissionFilesMock,
}));

const baseForm = {
  uuid: "form_1",
  user_uuid: "user_1",
  title: "Lead Capture",
  share_code: "share_1",
  status: "published",
  schema_json: {
    fields: [{ key: "name", label: "Name", type: "text", required: true }],
  },
};

function jsonRequest(body: unknown) {
  return new Request("http://test.local/api/forms/form_1/submit", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  });
}

describe("form submit API", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it("rejects submissions for draft forms", async () => {
    submitRouteMocks.findFormByUuidMock.mockResolvedValue({
      ...baseForm,
      status: "draft",
    });

    const res = await POST(jsonRequest({ answers: { name: "Ada" } }), {
      params: Promise.resolve({ id: "form_1" }),
    });
    const json = await res.json();

    expect(json.code).toBe(-1);
    expect(json.message).toBe("form is not published");
    expect(submitRouteMocks.submitFormMock).not.toHaveBeenCalled();
  });

  it("submits answers for published forms", async () => {
    submitRouteMocks.findFormByUuidMock.mockResolvedValue(baseForm);
    submitRouteMocks.submitFormMock.mockResolvedValue({
      uuid: "sub_1",
      form_uuid: "form_1",
      answers_json: { name: "Ada" },
    });

    const res = await POST(jsonRequest({ answers: { name: "Ada" } }), {
      params: Promise.resolve({ id: "form_1" }),
    });
    const json = await res.json();

    expect(submitRouteMocks.submitFormMock).toHaveBeenCalledWith(
      baseForm,
      expect.objectContaining({
        answers: { name: "Ada" },
        files: [],
        storage_files: [],
      })
    );
    expect(json.code).toBe(0);
    expect(json.data.uuid).toBe("sub_1");
  });

  it("accepts published forms resolved by share code", async () => {
    submitRouteMocks.findFormByUuidMock.mockResolvedValue(undefined);
    submitRouteMocks.findFormByShareCodeMock.mockResolvedValue(baseForm);
    submitRouteMocks.submitFormMock.mockResolvedValue({
      uuid: "sub_2",
      form_uuid: "form_1",
      answers_json: { name: "Grace" },
    });

    const res = await POST(jsonRequest({ answers: { name: "Grace" } }), {
      params: Promise.resolve({ id: "share_1" }),
    });
    const json = await res.json();

    expect(submitRouteMocks.findFormByShareCodeMock).toHaveBeenCalledWith(
      "share_1"
    );
    expect(json.code).toBe(0);
    expect(json.data.uuid).toBe("sub_2");
  });
});
