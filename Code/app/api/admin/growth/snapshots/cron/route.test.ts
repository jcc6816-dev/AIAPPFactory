import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { GET } from "./route";

const routeMocks = vi.hoisted(() => ({
  getUserEmailMock: vi.fn(),
  runAllSnapshotsMock: vi.fn(),
  runHistoricalGoogleSnapshotsMock: vi.fn(),
}));

vi.mock("@/services/user", () => ({
  getUserEmail: routeMocks.getUserEmailMock,
}));

vi.mock("@/services/growth-snapshot", () => ({
  runAllSnapshots: routeMocks.runAllSnapshotsMock,
  runHistoricalGoogleSnapshots: routeMocks.runHistoricalGoogleSnapshotsMock,
}));

function request(headers?: HeadersInit, url = "http://localhost/api/admin/growth/snapshots/cron") {
  return new Request(url, { method: "GET", headers }) as any;
}

describe("Growth snapshot cron API", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.stubEnv("ADMIN_EMAILS", "admin@genforms.ai");
    vi.stubEnv("GROWTH_CRON_SECRET", "cron_secret");
    routeMocks.getUserEmailMock.mockResolvedValue("");
    routeMocks.runAllSnapshotsMock.mockResolvedValue({
      success: true,
      results: [{ source: "gsc", range: "28d", segment: "default", status: "success" }],
      errors: [],
    });
    routeMocks.runHistoricalGoogleSnapshotsMock.mockResolvedValue({
      success: true,
      results: [{ source: "gsc", range: "1d", segment: "default", status: "success" }],
      errors: [],
    });
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("rejects unauthenticated requests", async () => {
    const res = await GET(request());
    const json = await res.json();

    expect(res.status).toBe(401);
    expect(json.code).toBe(401);
    expect(routeMocks.runAllSnapshotsMock).not.toHaveBeenCalled();
  });

  it("does not accept secret in query string", async () => {
    const res = await GET(request(undefined, "http://localhost/api/admin/growth/snapshots/cron?secret=cron_secret"));
    const json = await res.json();

    expect(res.status).toBe(401);
    expect(json.code).toBe(401);
    expect(routeMocks.runAllSnapshotsMock).not.toHaveBeenCalled();
  });

  it("runs snapshots with valid bearer token", async () => {
    const res = await GET(request({ authorization: "Bearer cron_secret" }));
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.code).toBe(0);
    expect(routeMocks.runAllSnapshotsMock).toHaveBeenCalledWith(false);
  });

  it("allows an active admin session", async () => {
    routeMocks.getUserEmailMock.mockResolvedValue("admin@genforms.ai");

    const res = await GET(request());
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.code).toBe(0);
    expect(routeMocks.runAllSnapshotsMock).toHaveBeenCalledWith(false);
  });

  it("runs historical Google snapshots when date is provided", async () => {
    const res = await GET(
      request(
        { authorization: "Bearer cron_secret" },
        "http://localhost/api/admin/growth/snapshots/cron?date=2026-06-14&force=1"
      )
    );
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.code).toBe(0);
    expect(routeMocks.runHistoricalGoogleSnapshotsMock).toHaveBeenCalledWith("2026-06-14", true);
    expect(routeMocks.runAllSnapshotsMock).not.toHaveBeenCalled();
  });

  it("rejects invalid historical date", async () => {
    const res = await GET(
      request(
        { authorization: "Bearer cron_secret" },
        "http://localhost/api/admin/growth/snapshots/cron?date=2026/06/14"
      )
    );
    const json = await res.json();

    expect(res.status).toBe(400);
    expect(json.code).toBe(400);
    expect(routeMocks.runHistoricalGoogleSnapshotsMock).not.toHaveBeenCalled();
    expect(routeMocks.runAllSnapshotsMock).not.toHaveBeenCalled();
  });
});
