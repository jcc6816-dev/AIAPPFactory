import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { GET } from "./route";
import { pageSpeedCache } from "./cache";

const userMocks = vi.hoisted(() => ({
  getUserEmailMock: vi.fn(),
}));

vi.mock("@/services/user", () => ({
  getUserEmail: userMocks.getUserEmailMock,
}));

function getRequest(url = "http://localhost:3000/api/admin/pagespeed/summary?url=https://genforms.ai/&strategy=mobile") {
  return new Request(url, {
    method: "GET"
  });
}

describe("PageSpeed Insights summary API", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.restoreAllMocks();
    pageSpeedCache.clear();
    vi.stubEnv("ADMIN_EMAILS", "admin@genforms.ai,mike@genforms.ai");
    vi.stubEnv("PAGESPEED_API_KEY", "mock_pagespeed_api_key_12345");
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("returns 403 for unauthorized non-admin users", async () => {
    userMocks.getUserEmailMock.mockResolvedValue("guest@genforms.ai");

    const res = await GET(getRequest());
    const json = await res.json();

    expect(res.status).toBe(403);
    expect(json.code).toBe(403);
    expect(json.message).toBe("unauthorized");
  });

  it("returns 403 for unauthenticated users", async () => {
    userMocks.getUserEmailMock.mockResolvedValue("");

    const res = await GET(getRequest());
    const json = await res.json();

    expect(res.status).toBe(403);
    expect(json.code).toBe(403);
    expect(json.message).toBe("unauthorized");
  });

  it("returns error code 1 when PAGESPEED_API_KEY is not configured", async () => {
    userMocks.getUserEmailMock.mockResolvedValue("admin@genforms.ai");
    vi.stubEnv("PAGESPEED_API_KEY", "");

    const res = await GET(getRequest());
    const json = await res.json();

    expect(json.code).toBe(1);
    expect(json.message).toContain("Key 未配置");
  });

  it("returns error code 1/status 400 when requested URL is not in whitelist", async () => {
    userMocks.getUserEmailMock.mockResolvedValue("admin@genforms.ai");

    const badReq = getRequest("http://localhost:3000/api/admin/pagespeed/summary?url=https://baidu.com");
    const res = await GET(badReq);
    const json = await res.json();

    expect(res.status).toBe(400);
    expect(json.code).toBe(1);
    expect(json.message).toContain("不在允许巡检范围内");
  });

  it("successfully retrieves, parses, and maps Google PageSpeed API response", async () => {
    userMocks.getUserEmailMock.mockResolvedValue("admin@genforms.ai");

    const mockGoogleResponse = {
      lighthouseResult: {
        categories: {
          performance: { score: 0.81 },
          accessibility: { score: 0.92 },
          "best-practices": { score: 0.75 },
          seo: { score: 1.0 }
        },
        audits: {
          "first-contentful-paint": { displayValue: "1.2 s" },
          "largest-contentful-paint": { displayValue: "3.1 s" },
          "total-blocking-time": { displayValue: "120 ms" },
          "cumulative-layout-shift": { displayValue: "0.01" },
          interactive: { displayValue: "4.5 s" },
          "speed-index": { displayValue: "2.3 s" },
          "total-byte-weight": { displayValue: "850 KiB" },
          "network-requests": {
            details: {
              items: [{}, {}, {}] // 3 requests
            }
          },
          "unused-javascript": {
            title: "Reduce unused JavaScript",
            displayValue: "Est savings of 250 KiB",
            details: {
              type: "opportunity",
              overallSavingsMs: 500
            }
          },
          "offscreen-images": {
            title: "Defer offscreen images",
            displayValue: "Est savings of 120 KiB",
            details: {
              type: "opportunity",
              overallSavingsMs: 200
            }
          }
        }
      }
    };

    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => mockGoogleResponse
    });
    vi.stubGlobal("fetch", fetchMock);

    const res = await GET(getRequest());
    const json = await res.json();

    expect(fetchMock).toHaveBeenCalled();
    expect(json.code).toBe(0);
    expect(json.data.url).toBe("https://genforms.ai/");
    expect(json.data.strategy).toBe("mobile");
    expect(json.data.scores.performance).toBe(81);
    expect(json.data.scores.accessibility).toBe(92);
    expect(json.data.scores.bestPractices).toBe(75);
    expect(json.data.scores.seo).toBe(100);
    expect(json.data.metrics.fcp).toBe("1.2 s");
    expect(json.data.metrics.lcp).toBe("3.1 s");
    expect(json.data.metrics.tbt).toBe("120 ms");
    expect(json.data.metrics.cls).toBe("0.01");
    expect(json.data.opportunities.length).toBe(2);
    expect(json.data.opportunities[0].id).toBe("unused-javascript");
    expect(json.data.opportunities[0].title).toBe("Reduce unused JavaScript");
    expect(json.data.diagnostics.totalByteWeight).toBe("850 KiB");
    expect(json.data.diagnostics.numRequests).toBe(3);
    expect(json.data.fromCache).toBe(false);
  });

  it("handles Google API errors gracefully without leaking keys", async () => {
    userMocks.getUserEmailMock.mockResolvedValue("admin@genforms.ai");

    const fetchMock = vi.fn().mockResolvedValue({
      ok: false,
      status: 403,
      text: async () => "Forbidden (Quota Exceeded)"
    });
    vi.stubGlobal("fetch", fetchMock);

    const res = await GET(getRequest("http://localhost:3000/api/admin/pagespeed/summary?url=https://genforms.ai/templates&strategy=desktop"));
    const json = await res.json();

    expect(json.code).toBe(2);
    expect(json.message).toContain("Google PageSpeed API 调用失败");
    expect(json.message).not.toContain("mock_pagespeed_api_key_12345");
  });

  it("serves subsequent requests from memory cache and respects strategy changes", async () => {
    userMocks.getUserEmailMock.mockResolvedValue("admin@genforms.ai");

    const mockGoogleResponse = {
      lighthouseResult: {
        categories: {
          performance: { score: 0.95 },
          accessibility: { score: 1.0 },
          "best-practices": { score: 0.90 },
          seo: { score: 1.0 }
        },
        audits: {}
      }
    };

    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => mockGoogleResponse
    });
    vi.stubGlobal("fetch", fetchMock);

    // First request (Cache miss)
    const res1 = await GET(getRequest());
    const json1 = await res1.json();
    expect(json1.data.fromCache).toBe(false);
    expect(fetchMock).toHaveBeenCalledTimes(1);

    // Second request (Cache hit)
    const res2 = await GET(getRequest());
    const json2 = await res2.json();
    expect(json2.data.fromCache).toBe(true);
    expect(fetchMock).toHaveBeenCalledTimes(1); // Still 1

    // Third request with desktop strategy (Cache miss for new key)
    const res3 = await GET(getRequest("http://localhost:3000/api/admin/pagespeed/summary?url=https://genforms.ai/&strategy=desktop"));
    const json3 = await res3.json();
    expect(json3.data.fromCache).toBe(false);
    expect(fetchMock).toHaveBeenCalledTimes(2); // Incremented
  });
});
