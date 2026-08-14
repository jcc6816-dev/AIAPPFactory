import { afterEach, describe, expect, it, vi } from "vitest";

import { GET, PATCH } from "./route";
import { encryptSecret } from "@/lib/secure";

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

  it("requires authentication before a form can be published", async () => {
    routeMocks.getUserUuidMock.mockResolvedValue("");

    const res = await PATCH(
      new Request("http://test.local/api/forms/form_1", {
        method: "PATCH",
        body: JSON.stringify({ status: "published" }),
      }),
      { params: Promise.resolve({ id: "form_1" }) }
    );

    expect(res.status).toBe(401);
    expect(routeMocks.getFormByUuidForUserMock).not.toHaveBeenCalled();
    expect(routeMocks.updateFormDraftMock).not.toHaveBeenCalled();
  });

  it("does not return webhook secrets or the full URL", async () => {
    routeMocks.getUserUuidMock.mockResolvedValue("user_1");
    routeMocks.getFormByUuidForUserMock.mockResolvedValue({
      uuid: "form_1",
      user_uuid: "user_1",
      title: "Webhook form",
      theme: "minimal",
      schema_json: { fields: [] },
      status: "draft",
      share_code: "share_1",
      webhook_url_encrypted: encryptSecret(
        "https://hooks.slack.com/services/T/B/SECRET"
      ),
      webhook_secret_encrypted: encryptSecret("secret"),
      webhook_keyword_encrypted: encryptSecret("keyword"),
    });

    const res = await GET(new Request("http://test.local/api/forms/form_1"), {
      params: Promise.resolve({ id: "form_1" }),
    });
    const json = await res.json();

    expect(json.code).toBe(0);
    expect(json.data.webhook_url).toBeUndefined();
    expect(json.data.webhook_url_encrypted).toBeUndefined();
    expect(json.data.webhook_secret_encrypted).toBeUndefined();
    expect(json.data.webhook_keyword_encrypted).toBeUndefined();
    expect(json.data.webhook_url_configured).toBe(true);
    expect(json.data.webhook_url_masked).toBe("https://hooks.slack.com/***");
  });

  it("keeps the published status when patching a form", async () => {
    routeMocks.getUserUuidMock.mockResolvedValue("user_1");
    routeMocks.getFormByUuidForUserMock.mockResolvedValue({
      uuid: "form_1",
      status: "draft",
    });
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
    routeMocks.getFormByUuidForUserMock.mockResolvedValue({
      uuid: "form_1",
      status: "draft",
    });
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
