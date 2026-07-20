import { afterEach, describe, expect, it, vi } from "vitest";
import { POST } from "./route";

const routeMocks = vi.hoisted(() => ({
  createGrowthEventMock: vi.fn(),
  getUserUuidMock: vi.fn(),
  getUserEmailMock: vi.fn(),
}));

vi.mock("@/models/growth-event", () => ({
  createGrowthEvent: routeMocks.createGrowthEventMock,
}));

vi.mock("@/services/user", () => ({
  getUserUuid: routeMocks.getUserUuidMock,
  getUserEmail: routeMocks.getUserEmailMock,
}));

function createRequest(body: unknown) {
  return new Request("http://test.local/api/growth/events", {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify(body),
  });
}

describe("growth events API route", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it("rejects request if event_name is missing or invalid", async () => {
    const res = await POST(createRequest({ visitor_id: "visitor_1" }));
    const json = await res.json();

    expect(json.code).toBe(-1);
    expect(json.message).toBe("invalid event");
    expect(routeMocks.createGrowthEventMock).not.toHaveBeenCalled();
  });

  it("rejects request if event_name is not in ALLOWED_EVENTS", async () => {
    const res = await POST(createRequest({ event_name: "unsupported_event", visitor_id: "visitor_1" }));
    const json = await res.json();

    expect(json.code).toBe(-1);
    expect(json.message).toBe("invalid event");
    expect(routeMocks.createGrowthEventMock).not.toHaveBeenCalled();
  });

  it("rejects request if visitor_id is missing", async () => {
    const res = await POST(createRequest({ event_name: "demo_started" }));
    const json = await res.json();

    expect(json.code).toBe(-1);
    expect(json.message).toBe("visitor_id is required");
    expect(routeMocks.createGrowthEventMock).not.toHaveBeenCalled();
  });

  it("records a valid event 'demo_started' successfully", async () => {
    routeMocks.getUserUuidMock.mockResolvedValue("user_1");
    routeMocks.getUserEmailMock.mockResolvedValue("user@example.com");
    routeMocks.createGrowthEventMock.mockResolvedValue({ uuid: "event_1" });

    const res = await POST(createRequest({ event_name: "demo_started", visitor_id: "visitor_1" }));
    const json = await res.json();

    expect(json.code).toBe(0);
    expect(json.data.uuid).toBe("event_1");
    expect(routeMocks.createGrowthEventMock).toHaveBeenCalledWith(expect.objectContaining({
      event_name: "demo_started",
      visitor_id: "visitor_1",
      user_uuid: "user_1",
      user_email: "user@example.com",
    }));
  });

  it("records a valid event 'demo_completed' successfully", async () => {
    routeMocks.getUserUuidMock.mockResolvedValue(null);
    routeMocks.createGrowthEventMock.mockResolvedValue({ uuid: "event_2" });

    const res = await POST(createRequest({ event_name: "demo_completed", visitor_id: "visitor_2" }));
    const json = await res.json();

    expect(json.code).toBe(0);
    expect(json.data.uuid).toBe("event_2");
    expect(routeMocks.createGrowthEventMock).toHaveBeenCalledWith(expect.objectContaining({
      event_name: "demo_completed",
      visitor_id: "visitor_2",
      user_uuid: null,
      user_email: "",
    }));
  });

  it("records client-side forms/new activation intent events", async () => {
    routeMocks.getUserUuidMock.mockResolvedValue(null);
    routeMocks.createGrowthEventMock.mockResolvedValue({ uuid: "event_3" });

    for (const eventName of [
      "forms_new_primary_action_viewed",
      "forms_new_primary_action_clicked",
      "guest_login_intent_started",
      "guest_login_intent_returned",
    ]) {
      const res = await POST(createRequest({
        event_name: eventName,
        visitor_id: "visitor_3",
        template_id: "event-registration",
        metadata: {
          primary_action: "publish_form",
          prompt: "private prompt",
          email: "private@example.com",
        },
      }));
      const json = await res.json();

      expect(json.code).toBe(0);
      expect(json.data.uuid).toBe("event_3");
    }

    expect(routeMocks.createGrowthEventMock).toHaveBeenCalledTimes(4);
    expect(routeMocks.createGrowthEventMock).toHaveBeenLastCalledWith(expect.objectContaining({
      event_name: "guest_login_intent_returned",
      visitor_id: "visitor_3",
      template_id: "event-registration",
      metadata_json: expect.not.objectContaining({
        prompt: expect.anything(),
        email: expect.anything(),
      }),
    }));
  });

  it("records pricing funnel events", async () => {
    routeMocks.getUserUuidMock.mockResolvedValue(null);
    routeMocks.createGrowthEventMock.mockResolvedValue({ uuid: "event_pricing" });

    for (const eventName of ["pricing_viewed", "pricing_plan_selected"]) {
      const res = await POST(createRequest({
        event_name: eventName,
        visitor_id: "visitor_pricing",
        metadata: { pricing_group: "yearly" },
      }));
      const json = await res.json();

      expect(json.code).toBe(0);
      expect(json.data.uuid).toBe("event_pricing");
    }
  });

  it("rejects trusted first-success completion events from the client", async () => {
    routeMocks.getUserUuidMock.mockResolvedValue("user_1");
    routeMocks.getUserEmailMock.mockResolvedValue("user@example.com");

    const res = await POST(createRequest({
      event_name: "first_result_viewed",
      visitor_id: "visitor_3",
      form_uuid: "form_1",
      metadata: {
        submission_uuid: "sub_1",
        is_test: true,
        prompt: "private prompt",
        answers: { email: "private@example.com" },
      },
    }));
    const json = await res.json();

    expect(json.code).toBe(-1);
    expect(json.message).toBe("invalid event");
    expect(routeMocks.createGrowthEventMock).not.toHaveBeenCalled();

    const activationRes = await POST(createRequest({
      event_name: "activation_completed",
      visitor_id: "visitor_3",
      form_uuid: "form_1",
    }));
    expect((await activationRes.json()).message).toBe("invalid event");
  });

  it("rejects business-state events that must come from server routes", async () => {
    for (const eventName of [
      "form_created",
      "form_published",
      "public_form_submitted",
      "test_submission_completed",
      "publish_succeeded",
    ]) {
      const response = await POST(
        createRequest({ event_name: eventName, visitor_id: "visitor_4" })
      );
      expect((await response.json()).message).toBe("invalid event");
    }
    expect(routeMocks.createGrowthEventMock).not.toHaveBeenCalled();
  });

  it("allowlists attribution fields and removes sensitive query parameters", async () => {
    routeMocks.getUserUuidMock.mockResolvedValue(null);
    routeMocks.createGrowthEventMock.mockResolvedValue({ uuid: "event_4" });

    await POST(createRequest({
      event_name: "page_view",
      visitor_id: "visitor_4",
      metadata: {
        attribution: {
          channel: "organic_search",
          search_engine: "google",
          landing_path: "/forms/new?source=seo&prompt=private&token=secret",
          content_source: "usecase_qr",
          email: "private@example.com",
        },
      },
    }));

    expect(routeMocks.createGrowthEventMock).toHaveBeenCalledWith(expect.objectContaining({
      source: "organic_search",
      metadata_json: {
        attribution: {
          channel: "organic_search",
          search_engine: "google",
          landing_path: "/forms/new?source=seo",
          content_source: "usecase_qr",
        },
      },
    }));
  });
});
