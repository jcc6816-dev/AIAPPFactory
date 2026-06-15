import crypto from "crypto";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { GET } from "./route";

const mockUserEmail = vi.fn();

vi.mock("@/services/user", () => ({
  getUserEmail: () => mockUserEmail(),
}));

const { privateKey: testPrivateKey } = crypto.generateKeyPairSync("rsa" as any, {
  modulusLength: 1024,
  privateKeyEncoding: {
    type: "pkcs8",
    format: "pem",
  },
});

function setAdminEnv(email = "admin@aifactory.ai") {
  mockUserEmail.mockResolvedValue(email);
  process.env.ADMIN_EMAILS = "admin@aifactory.ai";
}

function setGa4Env(clientEmail = "ga4@project.iam.gserviceaccount.com") {
  process.env.GOOGLE_SERVICE_ACCOUNT_KEY = JSON.stringify({
    private_key: testPrivateKey,
    client_email: clientEmail,
  });
  process.env.GA4_PROPERTY_ID = "123456789";
}

describe("GA4 Admin Summary API", () => {
  const originalEnv = { ...process.env };

  beforeEach(() => {
    vi.restoreAllMocks();
    vi.clearAllMocks();
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = { ...originalEnv };
  });

  it("returns 403 unauthorized if not admin", async () => {
    setAdminEnv("user@example.com");

    const res = await GET(new Request("http://localhost/api/admin/ga4/summary"));
    const json = await res.json();

    expect(res.status).toBe(403);
    expect(json.code).toBe(403);
  });

  it("returns code 1 if configuration is missing", async () => {
    setAdminEnv();
    delete process.env.GOOGLE_SERVICE_ACCOUNT_KEY;
    delete process.env.GOOGLE_SERVICE_ACCOUNT_KEY_BASE64;
    delete process.env.GA4_PROPERTY_ID;

    const res = await GET(new Request("http://localhost/api/admin/ga4/summary"));
    const json = await res.json();

    expect(json.code).toBe(1);
    expect(json.message).toContain("GA4 property ID");
  });

  it("returns code 2 desensitized error when Google OAuth fails", async () => {
    setAdminEnv();
    setGa4Env("oauth-fail@project.iam.gserviceaccount.com");

    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: false,
        status: 400,
        text: () => Promise.resolve("invalid_grant with sensitive details"),
      })
    );

    const res = await GET(new Request("http://localhost/api/admin/ga4/summary"));
    const json = await res.json();

    expect(json.code).toBe(2);
    expect(json.message).toContain("Failed to authenticate");
    expect(json.message).not.toContain("invalid_grant");
  });

  it("fetches, parses and returns GA4 summary and dimensions on success", async () => {
    setAdminEnv();
    setGa4Env("success@project.iam.gserviceaccount.com");

    const fetchMock = vi.fn().mockImplementation((url, init) => {
      if (url === "https://oauth2.googleapis.com/token") {
        return Promise.resolve({
          ok: true,
          status: 200,
          json: () => Promise.resolve({ access_token: "mock-access-token" }),
        });
      }

      const body = JSON.parse(init.body);
      const dimensionName = body.dimensions?.[0]?.name;
      const metricNames = body.metrics?.map((metric: { name: string }) => metric.name) || [];

      if (dimensionName === "sourceMedium" && metricNames.includes("eventCount")) {
        return Promise.resolve({
          ok: false,
          status: 400,
          json: () =>
            Promise.resolve({
              error: {
                message: "sourceMedium and eventCount are incompatible",
              },
            }),
        });
      }

      if (!dimensionName) {
        return Promise.resolve({
          ok: true,
          status: 200,
          json: () =>
            Promise.resolve({
              rows: [
                {
                  metricValues: [
                    { value: "120" },
                    { value: "80" },
                    { value: "70" },
                    { value: "540" },
                  ],
                },
              ],
            }),
        });
      }

      if (dimensionName === "eventName") {
        return Promise.resolve({
          ok: true,
          status: 200,
          json: () =>
            Promise.resolve({
              rows: [
                {
                  dimensionValues: [{ value: "demo_start" }],
                  metricValues: [{ value: "12" }],
                },
                {
                  dimensionValues: [{ value: "form_generate" }],
                  metricValues: [{ value: "3" }],
                },
              ],
            }),
        });
      }

      return Promise.resolve({
        ok: true,
        status: 200,
        json: () =>
          Promise.resolve({
            rows: [
              {
                dimensionValues: [{ value: `key-${dimensionName}` }],
                metricValues: metricNames.map((name: string) => ({
                  value: name === "eventCount" ? "40" : name === "activeUsers" ? "8" : "10",
                })),
              },
            ],
          }),
      });
    });
    vi.stubGlobal("fetch", fetchMock);

    const res = await GET(new Request("http://localhost/api/admin/ga4/summary?numOfDays=28"));
    const json = await res.json();

    expect(json.code).toBe(0);
    expect(json.data.summary).toMatchObject({
      sessions: 120,
      activeUsers: 80,
      newUsers: 70,
      eventCount: 540,
    });
    expect(json.data.funnel).toContainEqual({
      eventName: "demo_start",
      eventCount: 12,
    });
    expect(json.data.funnel).toContainEqual({
      eventName: "form_publish",
      eventCount: 0,
    });
    expect(json.data.sources[0]).toMatchObject({
      key: "key-sourceMedium",
      sessions: 10,
      activeUsers: 8,
      eventCount: 0,
    });
  });

  it("serves GA4 data from cache on subsequent requests", async () => {
    setAdminEnv();
    setGa4Env("cache@project.iam.gserviceaccount.com");

    const fetchMock = vi.fn().mockImplementation((url) => {
      if (url === "https://oauth2.googleapis.com/token") {
        return Promise.resolve({
          ok: true,
          status: 200,
          json: () => Promise.resolve({ access_token: "mock-access-token" }),
        });
      }

      return Promise.resolve({
        ok: true,
        status: 200,
        json: () => Promise.resolve({ rows: [] }),
      });
    });
    vi.stubGlobal("fetch", fetchMock);

    const req = new Request("http://localhost/api/admin/ga4/summary?numOfDays=7");
    const first = await (await GET(req)).json();
    const second = await (await GET(req)).json();

    expect(first.data.fromCache).toBe(false);
    expect(second.data.fromCache).toBe(true);
  });

  it("returns desensitized error when GA4 API fails", async () => {
    setAdminEnv();
    setGa4Env("ga4-fail@project.iam.gserviceaccount.com");

    vi.stubGlobal(
      "fetch",
      vi.fn().mockImplementation((url) => {
        if (url === "https://oauth2.googleapis.com/token") {
          return Promise.resolve({
            ok: true,
            status: 200,
            json: () => Promise.resolve({ access_token: "mock-access-token" }),
          });
        }

        return Promise.resolve({
          ok: false,
          status: 429,
          text: () => Promise.resolve("Quota exceeded with project metadata"),
        });
      })
    );

    const res = await GET(new Request("http://localhost/api/admin/ga4/summary?numOfDays=28"));
    const json = await res.json();

    expect(json.code).toBe(2);
    expect(json.message).toContain("Google Analytics Data API (HTTP 429)");
    expect(json.message).not.toContain("Quota exceeded");
  });

  it("uses OAuth refresh token flow when OAuth credentials are fully configured for GA4", async () => {
    setAdminEnv();
    process.env.GOOGLE_OAUTH_CLIENT_ID = "ga4-client-id";
    process.env.GOOGLE_OAUTH_CLIENT_SECRET = "ga4-client-secret";
    process.env.GOOGLE_OAUTH_REFRESH_TOKEN = "ga4-refresh-token";
    process.env.GA4_PROPERTY_ID = "123456789";

    const fetchMock = vi.fn().mockImplementation((url) => {
      if (url === "https://oauth2.googleapis.com/token") {
        return Promise.resolve({
          ok: true,
          status: 200,
          json: () => Promise.resolve({ access_token: "oauth-mock-access-token" }),
        });
      }
      return Promise.resolve({
        ok: true,
        status: 200,
        json: () => Promise.resolve({ rows: [] }),
      });
    });
    vi.stubGlobal("fetch", fetchMock);

    const res = await GET(new Request("http://localhost/api/admin/ga4/summary"));
    const json = await res.json();

    expect(json.code).toBe(0);
    const tokenCall = fetchMock.mock.calls.find(c => c[0] === "https://oauth2.googleapis.com/token");
    expect(tokenCall).toBeDefined();
    expect(tokenCall![1]!.body.toString()).toContain("client_id=ga4-client-id");
    expect(tokenCall![1]!.body.toString()).toContain("grant_type=refresh_token");
  });

  it("returns code 1 when OAuth variables are partially configured for GA4", async () => {
    setAdminEnv();
    process.env.GOOGLE_OAUTH_CLIENT_ID = "ga4-client-id";
    delete process.env.GOOGLE_OAUTH_CLIENT_SECRET;
    delete process.env.GOOGLE_OAUTH_REFRESH_TOKEN;
    process.env.GA4_PROPERTY_ID = "123456789";

    const res = await GET(new Request("http://localhost/api/admin/ga4/summary"));
    const json = await res.json();

    expect(json.code).toBe(1);
    expect(json.message).toContain("Google OAuth variables are partially configured");
  });

  it("returns code 2 desensitized error when OAuth refresh fails for GA4 and does not fallback to Service Account", async () => {
    setAdminEnv();
    process.env.GOOGLE_OAUTH_CLIENT_ID = "ga4-client-id-fail";
    process.env.GOOGLE_OAUTH_CLIENT_SECRET = "ga4-client-secret-fail";
    process.env.GOOGLE_OAUTH_REFRESH_TOKEN = "ga4-refresh-token-fail";
    setGa4Env("ga4-test@project.iam.gserviceaccount.com");
    process.env.GA4_PROPERTY_ID = "123456789";

    const fetchMock = vi.fn().mockResolvedValue({
      ok: false,
      status: 400,
      text: () => Promise.resolve("invalid_grant: Invalid refresh token"),
    });
    vi.stubGlobal("fetch", fetchMock);

    const res = await GET(new Request("http://localhost/api/admin/ga4/summary"));
    const json = await res.json();

    expect(json.code).toBe(2);
    expect(json.message).toContain("Failed to authenticate with Google OAuth");
    expect(json.message).not.toContain("invalid_grant");
    expect(json.message).not.toContain("ga4-client-secret");
    expect(json.message).not.toContain("ga4-refresh-token");
  });

  it("does not return client_secret or refresh_token in GA4 response text", async () => {
    setAdminEnv();
    process.env.GOOGLE_OAUTH_CLIENT_ID = "ga4-secret-client-id";
    process.env.GOOGLE_OAUTH_CLIENT_SECRET = "ga4-secret-client-secret";
    process.env.GOOGLE_OAUTH_REFRESH_TOKEN = "ga4-secret-refresh-token";
    process.env.GA4_PROPERTY_ID = "123456789";

    const fetchMock = vi.fn().mockImplementation((url) => {
      if (url === "https://oauth2.googleapis.com/token") {
        return Promise.resolve({
          ok: true,
          status: 200,
          json: () => Promise.resolve({ access_token: "super-secret-ga4-access-token" }),
        });
      }
      return Promise.resolve({
        ok: true,
        status: 200,
        json: () => Promise.resolve({ rows: [] }),
      });
    });
    vi.stubGlobal("fetch", fetchMock);

    const res = await GET(new Request("http://localhost/api/admin/ga4/summary"));
    const rawText = await res.text();

    expect(rawText).not.toContain("ga4-secret-client-secret");
    expect(rawText).not.toContain("ga4-secret-refresh-token");
    expect(rawText).not.toContain("super-secret-ga4-access-token");
  });
});
