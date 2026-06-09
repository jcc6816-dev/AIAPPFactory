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
});
