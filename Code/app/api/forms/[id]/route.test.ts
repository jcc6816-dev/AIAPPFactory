import { afterEach, describe, expect, it, vi } from "vitest";

import { PATCH } from "./route";

const routeMocks = vi.hoisted(() => ({
  getUserUuidMock: vi.fn(),
  getFormByUuidForUserMock: vi.fn(),
  updateFormDraftMock: vi.fn(),
}));

vi.mock("@/services/user", () => ({
  getUserUuid: routeMocks.getUserUuidMock,
}));

vi.mock("@/services/form", async () => {
  const actual = await vi.importActual<typeof import("@/services/form")>(
    "@/services/form"
  );
  return {
    ...actual,
    getFormByUuidForUser: routeMocks.getFormByUuidForUserMock,
    updateFormDraft: routeMocks.updateFormDraftMock,
  };
});

describe("form detail API", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it("keeps the published status when patching a form", async () => {
    routeMocks.getUserUuidMock.mockResolvedValue("user_1");
    routeMocks.updateFormDraftMock.mockResolvedValue({
      uuid: "form_1",
      status: "published",
    });

    const res = await PATCH(
      new Request("http://test.local/api/forms/form_1", {
        method: "PATCH",
        body: JSON.stringify({ status: "published" }),
      }),
      { params: Promise.resolve({ id: "form_1" }) }
    );
    const json = await res.json();

    expect(routeMocks.updateFormDraftMock).toHaveBeenCalledWith(
      "user_1",
      "form_1",
      expect.objectContaining({ status: "published" })
    );
    expect(json.code).toBe(0);
    expect(json.data.status).toBe("published");
  });

  it("normalizes unsupported statuses to draft before saving", async () => {
    routeMocks.getUserUuidMock.mockResolvedValue("user_1");
    routeMocks.updateFormDraftMock.mockResolvedValue({
      uuid: "form_1",
      status: "draft",
    });

    const res = await PATCH(
      new Request("http://test.local/api/forms/form_1", {
        method: "PATCH",
        body: JSON.stringify({ status: "archived" }),
      }),
      { params: Promise.resolve({ id: "form_1" }) }
    );
    const json = await res.json();

    expect(routeMocks.updateFormDraftMock).toHaveBeenCalledWith(
      "user_1",
      "form_1",
      expect.objectContaining({ status: "draft" })
    );
    expect(json.code).toBe(0);
  });
});
