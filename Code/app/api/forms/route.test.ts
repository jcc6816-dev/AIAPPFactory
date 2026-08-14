import { afterEach, describe, expect, it, vi } from "vitest";

import { POST } from "./route";

const routeMocks = vi.hoisted(() => ({
  getUserUuidMock: vi.fn(),
  createFormMock: vi.fn(),
  createGrowthEventSafelyMock: vi.fn(),
}));

vi.mock("@/services/user", () => ({
  getUserUuid: routeMocks.getUserUuidMock,
}));

vi.mock("@/models/growth-event", () => ({
  createGrowthEventSafely: routeMocks.createGrowthEventSafelyMock,
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

    expect(res.status).toBe(401);
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

  it("sanitizes and persists non-PII attribution without blocking creation", async () => {
    routeMocks.getUserUuidMock.mockResolvedValue("user_1");
    routeMocks.createFormMock.mockResolvedValue({
      ...basePayload,
      uuid: "form_1",
      user_uuid: "user_1",
      schema_json: basePayload.schema,
      share_code: "share_1",
      generation_meta_json: {},
    });

    const res = await POST(jsonRequest({
      ...basePayload,
      generation: {
        source: "ai",
        attribution: {
          channel: "organic_search",
          search_engine: "google",
          landing_path: "/forms/new?source=seo&prompt=private&email=private%40example.com",
          content_source: "usecase_qr",
          visitor_id: "visitor_1",
          session_id: "session_1",
          prompt: "must not be inside attribution",
        },
      },
    }));
    const json = await res.json();

    expect(json.code).toBe(0);
    expect(routeMocks.createFormMock).toHaveBeenCalledWith("user_1", expect.objectContaining({
      generation: expect.objectContaining({
        attribution: {
          channel: "organic_search",
          search_engine: "google",
          landing_path: "/forms/new?source=seo",
          content_source: "usecase_qr",
          visitor_id: "visitor_1",
          session_id: "session_1",
        },
      }),
    }));
    expect(routeMocks.createGrowthEventSafelyMock).toHaveBeenCalledWith(expect.objectContaining({
      visitor_id: "visitor_1",
      session_id: "session_1",
      source: "organic_search",
    }));
  });

  it("drops invalid attribution but still creates the form", async () => {
    routeMocks.getUserUuidMock.mockResolvedValue("user_1");
    routeMocks.createFormMock.mockResolvedValue({
      ...basePayload,
      uuid: "form_2",
      user_uuid: "user_1",
      schema_json: basePayload.schema,
      share_code: "share_2",
      generation_meta_json: {},
    });
    const res = await POST(jsonRequest({
      ...basePayload,
      generation: { source: "ai", attribution: { channel: "invented", email: "private@example.com" } },
    }));
    expect((await res.json()).code).toBe(0);
    expect(routeMocks.createFormMock).toHaveBeenCalledWith("user_1", expect.objectContaining({
      generation: expect.objectContaining({ attribution: undefined }),
    }));
  });

  it("records both trusted creation and publication for a form created published", async () => {
    routeMocks.getUserUuidMock.mockResolvedValue("user_1");
    routeMocks.createFormMock.mockResolvedValue({
      ...basePayload,
      status: "published",
      uuid: "form_published_1",
      user_uuid: "user_1",
      schema_json: basePayload.schema,
      share_code: "share_published_1",
      generation_meta_json: {},
    });

    const response = await POST(
      jsonRequest({ ...basePayload, status: "published" })
    );

    expect((await response.json()).code).toBe(0);
    expect(routeMocks.createGrowthEventSafelyMock).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({ event_name: "form_created" })
    );
    expect(routeMocks.createGrowthEventSafelyMock).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({ event_name: "form_published" })
    );
  });
});
