import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { GET } from "./route";

const mocks = vi.hoisted(() => ({
  getForms: vi.fn(),
  listGrowthEvents: vi.fn(),
}));

vi.mock("@/models/form", () => ({ getForms: mocks.getForms }));
vi.mock("@/models/growth-event", () => ({ listGrowthEvents: mocks.listGrowthEvents }));

function request(headers?: HeadersInit, query = "") {
  return new Request(
    `http://localhost/api/admin/growth/form-publish-activation-monitor${query}`,
    { headers }
  );
}

describe("Form publish activation monitor API", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.stubEnv("HERMES_MONITOR_API_KEY", "monitor_secret");
    mocks.getForms.mockResolvedValue([]);
    mocks.listGrowthEvents.mockResolvedValue([]);
  });

  afterEach(() => vi.unstubAllEnvs());

  it("rejects requests without the Hermes bearer token", async () => {
    const res = await GET(request());

    expect(res.status).toBe(401);
    expect(mocks.getForms).not.toHaveBeenCalled();
  });

  it("returns an empty passing monitor for an authenticated request", async () => {
    const res = await GET(
      request({ authorization: "Bearer monitor_secret" }, "?hours=24&pending_after_minutes=30")
    );
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.code).toBe(0);
    expect(json.data.decision).toBe("pass");
    expect(mocks.getForms).toHaveBeenCalledWith(1, 500);
    expect(mocks.listGrowthEvents).toHaveBeenCalledWith(5000);
  });

  it("rejects out-of-range monitor parameters", async () => {
    const res = await GET(
      request({ authorization: "Bearer monitor_secret" }, "?pending_after_minutes=2")
    );

    expect(res.status).toBe(400);
    expect(mocks.getForms).not.toHaveBeenCalled();
  });
});
