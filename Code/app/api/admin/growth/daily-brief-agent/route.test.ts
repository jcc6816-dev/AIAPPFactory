import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { GET } from "./route";

const snapshotMocks = vi.hoisted(() => ({
  getLatestSnapshotMock: vi.fn(),
  getGrowthMetricSnapshotMock: vi.fn(),
  listGrowthMetricSnapshotsByDateRangeMock: vi.fn(),
}));

vi.mock("@/models/growth-metric-snapshot", () => ({
  getLatestSnapshot: snapshotMocks.getLatestSnapshotMock,
  getGrowthMetricSnapshot: snapshotMocks.getGrowthMetricSnapshotMock,
  listGrowthMetricSnapshotsByDateRange: snapshotMocks.listGrowthMetricSnapshotsByDateRangeMock,
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
      if (source === "gsc" && range === "1d") {
        return {
          snapshot_date: "2026-06-13",
          fetched_at: "2026-06-15T00:00:00Z",
          metrics_json: { impressions: 41, clicks: 0 },
          details_json: { queries: [{ key: "ai form generator", impressions: 2 }] },
        };
      }
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
    expect(json.data.gsc.gsc_1d.metrics.impressions).toBe(41);
    expect(json.data.gsc.gsc_28d.metrics.impressions).toBe(100);
    expect(snapshotMocks.getLatestSnapshotMock).toHaveBeenCalled();
  });

  it("returns exact-date snapshot data when date is provided", async () => {
    snapshotMocks.getGrowthMetricSnapshotMock.mockImplementation(async (date: string, source: string, range: string) => {
      if (date === "2026-06-14" && source === "ga4" && range === "1d") {
        return {
          snapshot_date: "2026-06-14",
          fetched_at: "2026-06-15T00:00:00Z",
          metrics_json: { sessions: 29 },
          details_json: { funnel: [{ eventName: "demo_start", eventCount: 1 }] },
        };
      }
      return null;
    });

    const res = await GET(
      request(
        { authorization: "Bearer brief_secret" },
        "http://localhost/api/admin/growth/daily-brief-agent?date=2026-06-14"
      )
    );
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.data.snapshot_metadata.mode).toBe("date");
    expect(json.data.snapshot_metadata.date).toBe("2026-06-14");
    expect(json.data.ga4.ga4_1d.metrics.sessions).toBe(29);
    expect(snapshotMocks.getLatestSnapshotMock).not.toHaveBeenCalled();
  });

  it("returns range history when from and to are provided", async () => {
    snapshotMocks.listGrowthMetricSnapshotsByDateRangeMock.mockResolvedValue([
      {
        snapshot_date: "2026-06-14",
        source: "gsc",
        range: "7d",
        segment: "default",
        status: "success",
        fetched_at: "2026-06-15T00:00:00Z",
        metrics_json: { impressions: 41 },
        details_json: { queries: [] },
        error_message: "",
      },
    ]);

    const res = await GET(
      request(
        { authorization: "Bearer brief_secret" },
        "http://localhost/api/admin/growth/daily-brief-agent?from=2026-06-10&to=2026-06-14&source=gsc"
      )
    );
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.data.snapshot_metadata.mode).toBe("range");
    expect(json.data.snapshots[0].metrics.impressions).toBe(41);
    expect(snapshotMocks.listGrowthMetricSnapshotsByDateRangeMock).toHaveBeenCalledWith({
      from: "2026-06-10",
      to: "2026-06-14",
      source: "gsc",
      range: undefined,
      limit: 200,
    });
  });

  it("rejects invalid date format", async () => {
    const res = await GET(
      request(
        { authorization: "Bearer brief_secret" },
        "http://localhost/api/admin/growth/daily-brief-agent?date=2026/06/14"
      )
    );
    const json = await res.json();

    expect(res.status).toBe(400);
    expect(json.code).toBe(400);
  });
});
