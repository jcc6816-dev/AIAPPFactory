import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { GET } from "./route";

const mockUserEmail = vi.fn();

vi.mock("@/services/user", () => ({
  getUserEmail: () => mockUserEmail(),
}));

describe("Clarity Admin Summary API", () => {
  const originalEnv = { ...process.env };

  beforeEach(() => {
    vi.restoreAllMocks();
    vi.clearAllMocks();
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = { ...originalEnv };
  });

  it("parses the official metricName + information response structure via GET request", async () => {
    mockUserEmail.mockResolvedValue("admin@aifactory.ai");
    process.env.ADMIN_EMAILS = "admin@aifactory.ai";
    process.env.CLARITY_API_TOKEN = "token-official";

    const mockRawData = [
      {
        metricName: "Traffic",
        information: [
          { "Device": "PC", "totalSessionCount": "150" },
          { "Device": "Mobile", "totalSessionCount": "80" },
        ]
      },
      {
        metricName: "Scroll Depth",
        information: [
          { "Device": "PC", "averageScrollDepth": "60" },
        ]
      },
      {
        metricName: "Engagement Time",
        information: [
          { "Device": "PC", "averageEngagementTime": "120" },
        ]
      },
      {
        metricName: "Dead Click Count",
        information: [
          { "Device": "PC", "sessionsCount": "4" }
        ]
      },
      {
        metricName: "Rage Click Count",
        information: [
          { "Device": "PC", "sessionsCount": "2" }
        ]
      },
      {
        metricName: "Quickback Click",
        information: [
          { "Device": "Mobile", "sessionsCount": "5" }
        ]
      },
      {
        metricName: "Script Error Count",
        information: [
          { "Device": "PC", "sessionsCount": "1" }
        ]
      }
    ];

    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: () => Promise.resolve(mockRawData),
    });
    vi.stubGlobal("fetch", fetchMock);

    const req = new Request("http://localhost/api/admin/clarity/summary?numOfDays=1");
    const res = await GET(req);
    const json = await res.json();

    expect(json.code).toBe(0);
    expect(json.data.device).toHaveLength(2);

    const pc = json.data.device.find((r: any) => r.key === "PC")!;
    const mobile = json.data.device.find((r: any) => r.key === "Mobile")!;

    expect(pc).toBeDefined();
    expect(pc.sessions).toBe(150);
    expect(pc.scrollDepth).toBe(60);
    expect(pc.engagementTime).toBe(120);
    expect(pc.deadClicks).toBe(4);
    expect(pc.rageClicks).toBe(2);
    expect(pc.quickBacks).toBe(0);
    expect(pc.scriptErrors).toBe(1);

    expect(mobile).toBeDefined();
    expect(mobile.sessions).toBe(80);
    expect(mobile.quickBacks).toBe(5);
  });

  it("parses Clarity URL records that use Url casing and metric helper fields", async () => {
    mockUserEmail.mockResolvedValue("admin@aifactory.ai");
    process.env.ADMIN_EMAILS = "admin@aifactory.ai";
    process.env.CLARITY_API_TOKEN = "token-url-casing";

    const mockRawData = [
      {
        metricName: "Traffic",
        information: [
          {
            sessionsCount: "18",
            sessionsWithMetricPercentage: "12.5",
            sessionsWithoutMetricPercentage: "87.5",
            pagesViews: "24",
            subTotal: "18",
            Url: "https://genforms.ai/zh",
          },
        ],
      },
      {
        metricName: "DeadClickCount",
        information: [
          {
            sessionsCount: "3",
            sessionsWithMetricPercentage: "16.7",
            sessionsWithoutMetricPercentage: "83.3",
            pagesViews: "24",
            subTotal: "3",
            Url: "https://genforms.ai/zh",
          },
        ],
      },
    ];

    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: () => Promise.resolve(mockRawData),
    });
    vi.stubGlobal("fetch", fetchMock);

    const req = new Request("http://localhost/api/admin/clarity/summary?numOfDays=1");
    const res = await GET(req);
    const json = await res.json();

    const homepage = json.data.url.find((row: any) => row.key === "https://genforms.ai/zh");
    expect(homepage).toBeDefined();
    expect(homepage.sessions).toBe(18);
    expect(homepage.deadClicks).toBe(3);
    expect(json.data.url.some((row: any) => row.key === "12.5")).toBe(false);
    expect(json.data.url.some((row: any) => row.key === "18")).toBe(false);
  });

  it("returns 403 unauthorized if not logged in or email not in admin emails", async () => {
    mockUserEmail.mockResolvedValue("");
    process.env.ADMIN_EMAILS = "admin@aifactory.ai,admin2@aifactory.ai";

    const req = new Request("http://localhost/api/admin/clarity/summary");
    const res = await GET(req);
    const json = await res.json();

    expect(res.status).toBe(403);
    expect(json.code).toBe(403);
    expect(json.message).toBe("unauthorized");
  });

  it("returns 403 unauthorized if email is not configured in ADMIN_EMAILS", async () => {
    mockUserEmail.mockResolvedValue("user@example.com");
    process.env.ADMIN_EMAILS = "admin@aifactory.ai";

    const req = new Request("http://localhost/api/admin/clarity/summary");
    const res = await GET(req);
    const json = await res.json();

    expect(res.status).toBe(403);
    expect(json.code).toBe(403);
  });

  it("returns code 1 config missing if token is not set", async () => {
    mockUserEmail.mockResolvedValue("admin@aifactory.ai");
    process.env.ADMIN_EMAILS = "admin@aifactory.ai";
    delete process.env.CLARITY_API_TOKEN;

    const req = new Request("http://localhost/api/admin/clarity/summary");
    const res = await GET(req);
    const json = await res.json();

    expect(json.code).toBe(1);
    expect(json.message).toContain("CLARITY_API_TOKEN");
  });

  it("returns code 2 if Clarity API returns an error", async () => {
    mockUserEmail.mockResolvedValue("admin@aifactory.ai");
    process.env.ADMIN_EMAILS = "admin@aifactory.ai";
    process.env.CLARITY_API_TOKEN = "token-error";

    const fetchMock = vi.fn().mockResolvedValue({
      ok: false,
      status: 429,
      text: () => Promise.resolve("Rate Limit Exceeded"),
    });
    vi.stubGlobal("fetch", fetchMock);

    const req = new Request("http://localhost/api/admin/clarity/summary?numOfDays=1");
    const res = await GET(req);
    const json = await res.json();

    expect(json.code).toBe(2);
    expect(json.message).toContain("Failed to fetch data from Clarity API (HTTP 429)");
    expect(json.message).not.toContain("Rate Limit Exceeded"); // Check desensitization
  });

  it("fetches data and returns it with code 0 on success", async () => {
    mockUserEmail.mockResolvedValue("admin@aifactory.ai");
    process.env.ADMIN_EMAILS = "admin@aifactory.ai";
    process.env.CLARITY_API_TOKEN = "token-success";

    const dummyData = [
      {
        metricName: "Traffic",
        information: [
          { "Device": "PC", "totalSessionCount": "100" }
        ]
      }
    ];

    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: () => Promise.resolve(dummyData),
    });
    vi.stubGlobal("fetch", fetchMock);

    const req = new Request("http://localhost/api/admin/clarity/summary?numOfDays=2");
    const res = await GET(req);
    const json = await res.json();

    expect(json.code).toBe(0);
    expect(json.data.fromCache).toBe(false);
    expect(json.data.device).toHaveLength(1);
    expect(json.data.device[0]).toMatchObject({
      key: "PC",
      sessions: 100,
    });
    expect(fetchMock).toHaveBeenCalledTimes(3);
    expect(fetchMock.mock.calls[0][0]).toContain("numOfDays=2");
  });

  it("serves from cache on subsequent calls within TTL", async () => {
    mockUserEmail.mockResolvedValue("admin@aifactory.ai");
    process.env.ADMIN_EMAILS = "admin@aifactory.ai";
    process.env.CLARITY_API_TOKEN = "token-cache";

    const dummyData = [
      {
        metricName: "Traffic",
        information: [
          { "Device": "PC", "totalSessionCount": "50" }
        ]
      }
    ];

    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: () => Promise.resolve(dummyData),
    });
    vi.stubGlobal("fetch", fetchMock);

    // First call (fetches from API)
    const req1 = new Request("http://localhost/api/admin/clarity/summary?numOfDays=3");
    const res1 = await GET(req1);
    const json1 = await res1.json();
    expect(json1.data.fromCache).toBe(false);

    // Second call (should hit cache)
    const req2 = new Request("http://localhost/api/admin/clarity/summary?numOfDays=3");
    const res2 = await GET(req2);
    const json2 = await res2.json();
    expect(json2.data.fromCache).toBe(true);

    // Total fetch calls should still be 3 (from the first request only)
    expect(fetchMock).toHaveBeenCalledTimes(3);
  });

  it("does not serve from cache if token is missing in the new request", async () => {
    mockUserEmail.mockResolvedValue("admin@aifactory.ai");
    process.env.ADMIN_EMAILS = "admin@aifactory.ai";
    
    // First request with token: caches data
    process.env.CLARITY_API_TOKEN = "token-missing";
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: () => Promise.resolve([
        { metricName: "Traffic", information: [{ "Device": "PC", "totalSessionCount": "5" }] }
      ]),
    });
    vi.stubGlobal("fetch", fetchMock);

    const req1 = new Request("http://localhost/api/admin/clarity/summary?numOfDays=1");
    const res1 = await GET(req1);
    const json1 = await res1.json();
    expect(json1.code).toBe(0);
    expect(json1.data.fromCache).toBe(false);

    // Second request: remove token (should NOT serve from cache, must return code 1)
    delete process.env.CLARITY_API_TOKEN;
    const req2 = new Request("http://localhost/api/admin/clarity/summary?numOfDays=1");
    const res2 = await GET(req2);
    const json2 = await res2.json();

    expect(json2.code).toBe(1);
    expect(json2.message).toContain("CLARITY_API_TOKEN");
  });

  it("does not reuse cache from a different token when token changes", async () => {
    mockUserEmail.mockResolvedValue("admin@aifactory.ai");
    process.env.ADMIN_EMAILS = "admin@aifactory.ai";

    // First request with token1
    process.env.CLARITY_API_TOKEN = "token-change-1";
    let fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: () => Promise.resolve([
        { metricName: "Traffic", information: [{ "Device": "PC", "totalSessionCount": "10" }] }
      ]),
    });
    vi.stubGlobal("fetch", fetchMock);

    const req1 = new Request("http://localhost/api/admin/clarity/summary?numOfDays=1");
    const res1 = await GET(req1);
    const json1 = await res1.json();
    expect(json1.code).toBe(0);
    expect(json1.data.fromCache).toBe(false);
    expect(fetchMock).toHaveBeenCalledTimes(3);

    // Second request: change token to token-change-2
    process.env.CLARITY_API_TOKEN = "token-change-2";
    fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: () => Promise.resolve([
        { metricName: "Traffic", information: [{ "Device": "PC", "totalSessionCount": "20" }] }
      ]),
    });
    vi.stubGlobal("fetch", fetchMock);

    const req2 = new Request("http://localhost/api/admin/clarity/summary?numOfDays=1");
    const res2 = await GET(req2);
    const json2 = await res2.json();

    // Should fetch again (fromCache: false) because of token fingerprint mismatch
    expect(json2.code).toBe(0);
    expect(json2.data.fromCache).toBe(false);
    expect(fetchMock).toHaveBeenCalledTimes(3);
  });
});
