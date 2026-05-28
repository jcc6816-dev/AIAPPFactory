import { afterEach, describe, expect, it, vi } from "vitest";

import { POST } from "./route";

const routeMocks = vi.hoisted(() => ({
  getUserUuidMock: vi.fn(),
  createFormMock: vi.fn(),
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
    createForm: routeMocks.createFormMock,
  };
});

function jsonRequest(body: unknown) {
  return new Request("http://test.local/api/forms", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  });
}

const basePayload = {
  title: "Lead Capture",
  description: "Collect leads",
  theme: "business",
  status: "draft",
  schema: {
    fields: [
      {
        key: "name",
        label: "Name",
        type: "text",
        required: true,
      },
    ],
  },
};

describe("forms API", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it("requires authentication before creating forms", async () => {
    routeMocks.getUserUuidMock.mockResolvedValue("");

    const res = await POST(jsonRequest(basePayload));
    const json = await res.json();

    expect(json.code).toBe(-2);
    expect(routeMocks.createFormMock).not.toHaveBeenCalled();
  });

  it("surfaces the free plan form creation limit from the service layer", async () => {
    routeMocks.getUserUuidMock.mockResolvedValue("user_free");
    routeMocks.createFormMock.mockRejectedValue(
      new Error("free plan users have reached the current form limit")
    );

    const res = await POST(jsonRequest(basePayload));
    const json = await res.json();

    expect(routeMocks.createFormMock).toHaveBeenCalledWith(
      "user_free",
      expect.objectContaining({
        title: "Lead Capture",
        status: "draft",
      })
    );
    expect(json.code).toBe(-1);
    expect(json.message).toBe("free plan users have reached the current form limit");
  });
});
