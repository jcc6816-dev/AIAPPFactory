import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { GET } from "./route";

const snapshotMocks = vi.hoisted(() => ({
  getLatestSnapshotMock: vi.fn(),
}));

vi.mock("@/models/growth-metric-snapshot", () => ({
  getLatestSnapshot: snapshotMocks.getLatestSnapshotMock,
}));

function request(headers?: HeadersInit, url = "http://localhost/api/admin/growth/daily-brief-agent") {
  return new Request(url, { method: "GET", headers }) as any;
}

describe("Growth daily brief agent API", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.stubEnv("GROWTH_DAILY_BRIEF_API_KEY", "brief_secret");
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("rejects requests without bearer token", async () => {
    const res = await GET(request());
    const json = await res.json();

    expect(res.status).toBe(401);
    expect(json.code).toBe(401);
    expect(snapshotMocks.getLatestSnapshotMock).not.toHaveBeenCalled();
  });

  it("does not accept api key in query string", async () => {
    const res = await GET(request(undefined, "http://localhost/api/admin/growth/daily-brief-agent?key=brief_secret"));
    const json = await res.json();

    expect(res.status).toBe(401);
    expect(json.code).toBe(401);
    expect(snapshotMocks.getLatestSnapshotMock).not.toHaveBeenCalled();
  });

  it("returns aggregated snapshot data with valid bearer token", async () => {
    snapshotMocks.getLatestSnapshotMock.mockImplementation(async (source: string, range: string) => {
      if (source === "gsc" && range === "28d") {
        return {
          snapshot_date: "2026-06-13",
          fetched_at: "2026-06-15T00:00:00Z",
          metrics_json: { impressions: 100, clicks: 2 },
          details_json: { queries: [{ key: "ai form builder", impressions: 20 }] },
        };
      }
      return null;
    });

    const res = await GET(request({ authorization: "Bearer brief_secret" }));
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.code).toBe(0);
    expect(json.data.gsc.gsc_28d.metrics.impressions).toBe(100);
    expect(snapshotMocks.getLatestSnapshotMock).toHaveBeenCalled();
  });
});
