import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { GET } from "./route";

const growthEventMocks = vi.hoisted(() => ({
  listGrowthEventsMock: vi.fn(),
}));

vi.mock("@/models/growth-event", () => ({
  listGrowthEvents: growthEventMocks.listGrowthEventsMock,
}));

function request(
  headers?: HeadersInit,
  url = "http://localhost/api/admin/growth/forms-new-activation-monitor"
) {
  return new Request(url, { method: "GET", headers }) as any;
}

describe("Forms-new activation monitor API", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.stubEnv("HERMES_MONITOR_API_KEY", "monitor_secret");
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-07-06T12:00:00.000Z"));
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllEnvs();
  });

  it("rejects requests without bearer token", async () => {
    const res = await GET(request());
    const json = await res.json();

    expect(res.status).toBe(401);
    expect(json.code).toBe(401);
    expect(growthEventMocks.listGrowthEventsMock).not.toHaveBeenCalled();
  });

  it("does not accept api key in query string", async () => {
    const res = await GET(
      request(
        undefined,
        "http://localhost/api/admin/growth/forms-new-activation-monitor?key=monitor_secret"
      )
    );
    const json = await res.json();

    expect(res.status).toBe(401);
    expect(json.code).toBe(401);
    expect(growthEventMocks.listGrowthEventsMock).not.toHaveBeenCalled();
  });

  it("returns an aggregated monitor payload with valid bearer token", async () => {
    growthEventMocks.listGrowthEventsMock.mockResolvedValue([
      {
        uuid: "event_1",
        event_name: "workspace_preview_ready",
        visitor_id: "visitor_1",
        session_id: "session_1",
        path: "/forms/new?template=event-registration",
        source: "organic",
        template_id: "event-registration",
        metadata_json: {},
        created_at: "2026-07-06T11:55:00.000Z",
      },
      {
        uuid: "event_2",
        event_name: "forms_new_primary_action_clicked",
        visitor_id: "visitor_1",
        session_id: "session_1",
        path: "/forms/new?template=event-registration",
        source: "organic",
        template_id: "event-registration",
        metadata_json: {},
        created_at: "2026-07-06T11:56:00.000Z",
      },
      {
        uuid: "event_3",
        event_name: "guest_login_intent_started",
        visitor_id: "visitor_1",
        session_id: "session_1",
        path: "/forms/new?template=event-registration",
        source: "organic",
        template_id: "event-registration",
        metadata_json: {},
        created_at: "2026-07-06T11:57:00.000Z",
      },
    ]);

    const res = await GET(
      request(
        { authorization: "Bearer monitor_secret" },
        "http://localhost/api/admin/growth/forms-new-activation-monitor?hours=24&limit=100"
      )
    );
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.code).toBe(0);
    expect(json.data.decision).toBe("pass");
    expect(json.data.totals.qualified_sessions).toBe(1);
    expect(growthEventMocks.listGrowthEventsMock).toHaveBeenCalledWith(100);
  });

  it("rejects invalid query bounds", async () => {
    const res = await GET(
      request(
        { authorization: "Bearer monitor_secret" },
        "http://localhost/api/admin/growth/forms-new-activation-monitor?hours=999"
      )
    );
    const json = await res.json();

    expect(res.status).toBe(400);
    expect(json.code).toBe(400);
    expect(growthEventMocks.listGrowthEventsMock).not.toHaveBeenCalled();
  });
});
