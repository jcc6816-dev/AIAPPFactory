import { afterEach, describe, expect, it, vi } from "vitest";

import { POST } from "./route";

const mocks = vi.hoisted(() => ({
  getUserUuid: vi.fn(),
  getFormByUuidForUser: vi.fn(),
  sendWebhookTest: vi.fn(),
  createGrowthEventSafely: vi.fn(),
}));

vi.mock("@/services/user", () => ({ getUserUuid: mocks.getUserUuid }));
vi.mock("@/services/form", () => ({
  getFormByUuidForUser: mocks.getFormByUuidForUser,
}));
vi.mock("@/services/skills/webhook", () => ({
  sendWebhookTest: mocks.sendWebhookTest,
}));
vi.mock("@/models/growth-event", () => ({
  createGrowthEventSafely: mocks.createGrowthEventSafely,
}));

const form = {
  uuid: "form_1",
  user_uuid: "user_1",
  share_code: "share_1",
  webhook_enabled: true,
  webhook_provider: "slack_bot",
};

describe("Slack webhook test-send API", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it("requires authentication", async () => {
    mocks.getUserUuid.mockResolvedValue("");

    const response = await POST(
      new Request("http://test.local/api/forms/form_1/webhook-test", {
        method: "POST",
      }),
      { params: Promise.resolve({ id: "form_1" }) }
    );
    const json = await response.json();

    expect(json.code).toBe(-2);
    expect(mocks.sendWebhookTest).not.toHaveBeenCalled();
  });

  it("sends only the server-defined test message and records the result", async () => {
    mocks.getUserUuid.mockResolvedValue("user_1");
    mocks.getFormByUuidForUser.mockResolvedValue(form);
    mocks.sendWebhookTest.mockResolvedValue({
      ok: true,
      status: 200,
      attemptCount: 1,
      body: "ok",
      errorMessage: "",
    });

    const response = await POST(
      new Request("http://test.local/api/forms/form_1/webhook-test", {
        method: "POST",
        body: JSON.stringify({ text: "user-controlled payload" }),
      }),
      { params: Promise.resolve({ id: "form_1" }) }
    );
    const json = await response.json();

    expect(json.code).toBe(0);
    expect(mocks.sendWebhookTest).toHaveBeenCalledWith(form);
    expect(mocks.createGrowthEventSafely).toHaveBeenCalledWith(
      expect.objectContaining({ event_name: "webhook_test_sent" })
    );
    expect(mocks.createGrowthEventSafely).toHaveBeenCalledWith(
      expect.objectContaining({
        event_name: "webhook_delivery_succeeded",
        metadata_json: expect.objectContaining({ is_test: true }),
      })
    );
  });

  it("returns a sanitized failure without exposing provider response bodies", async () => {
    mocks.getUserUuid.mockResolvedValue("user_1");
    mocks.getFormByUuidForUser.mockResolvedValue(form);
    mocks.sendWebhookTest.mockResolvedValue({
      ok: false,
      status: 404,
      attemptCount: 1,
      body: "https://hooks.slack.com/services/T/B/SECRET",
      errorMessage: "secret response",
    });

    const response = await POST(
      new Request("http://test.local/api/forms/form_1/webhook-test", {
        method: "POST",
      }),
      { params: Promise.resolve({ id: "form_1" }) }
    );
    const json = await response.json();

    expect(json.code).toBe(-1);
    expect(json.message).toBe("test send failed with status 404");
    expect(JSON.stringify(json)).not.toContain("hooks.slack.com");
    expect(JSON.stringify(json)).not.toContain("secret response");
  });
});
