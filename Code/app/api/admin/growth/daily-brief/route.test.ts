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
}) as any;

function setAdminEnv(email = "admin@aifactory.ai") {
  mockUserEmail.mockResolvedValue(email);
  process.env.ADMIN_EMAILS = "admin@aifactory.ai";
}

describe("Growth Daily Brief API", () => {
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
    mockUserEmail.mockResolvedValue("user@example.com");
    process.env.ADMIN_EMAILS = "admin@aifactory.ai";

    const res = await GET(new Request("http://localhost/api/admin/growth/daily-brief"));
    const json = await res.json();

    expect(res.status).toBe(403);
    expect(json.code).toBe(403);
  });

  it("returns code 0 and sources not_configured if no credentials are set", async () => {
    setAdminEnv();
    delete process.env.GOOGLE_SERVICE_ACCOUNT_KEY;
    delete process.env.GOOGLE_SERVICE_ACCOUNT_KEY_BASE64;
    delete process.env.GSC_PROPERTY_URL;
    delete process.env.GA4_PROPERTY_ID;
    delete process.env.CLARITY_API_TOKEN;

    const res = await GET(new Request("http://localhost/api/admin/growth/daily-brief"));
    const json = await res.json();

    expect(json.code).toBe(0);
    expect(json.data.sources.gsc.status).toBe("not_configured");
    expect(json.data.sources.ga4.status).toBe("not_configured");
    expect(json.data.sources.clarity.status).toBe("not_configured");
  });

  it("degrades gracefully and returns other ready sources if one fails", async () => {
    setAdminEnv();
    // Configure GSC
    process.env.GOOGLE_SERVICE_ACCOUNT_KEY = JSON.stringify({
      private_key: testPrivateKey,
      client_email: "daily-brief-gsc-test@project.iam.gserviceaccount.com",
    });
    process.env.GSC_PROPERTY_URL = "https://genforms.ai/";
    // Keep GA4/Clarity not configured
    delete process.env.GA4_PROPERTY_ID;
    delete process.env.CLARITY_API_TOKEN;

    // Stub fetch to simulate Google token and GSC analytics failure
    const fetchMock = vi.fn().mockImplementation((url) => {
      if (url === "https://oauth2.googleapis.com/token") {
        return Promise.resolve({
          ok: true,
          status: 200,
          json: () => Promise.resolve({ access_token: "mock-access-token-gsc-brief" }),
        });
      }
      // GSC queries fail
      return Promise.resolve({
        ok: false,
        status: 500,
        text: () => Promise.resolve("Internal Google Error"),
      });
    });
    vi.stubGlobal("fetch", fetchMock);

    const res = await GET(new Request("http://localhost/api/admin/growth/daily-brief"));
    const json = await res.json();

    expect(json.code).toBe(0);
    expect(json.data.sources.gsc.status).toBe("error");
    expect(json.data.sources.gsc.message).toContain("Failed to fetch");
    expect(json.data.sources.ga4.status).toBe("not_configured");
  });

  it("generates recommended actions based on GSC and GA4 mock data", async () => {
    setAdminEnv();
    process.env.GOOGLE_SERVICE_ACCOUNT_KEY = JSON.stringify({
      private_key: testPrivateKey,
      client_email: "daily-brief-success@project.iam.gserviceaccount.com",
    });
    process.env.GSC_PROPERTY_URL = "https://genforms.ai/";
    process.env.GA4_PROPERTY_ID = "123456789";
    process.env.CLARITY_API_TOKEN = "mock-clarity-api-token-brief";

    // Stub fetches
    const fetchMock = vi.fn().mockImplementation((url, init) => {
      if (url === "https://oauth2.googleapis.com/token") {
        return Promise.resolve({
          ok: true,
          status: 200,
          json: () => Promise.resolve({ access_token: "mock-access-token" }),
        });
      }

      if (url.includes("searchAnalytics/query")) {
        const body = JSON.parse(init.body);
        if (!body.dimensions) {
          return Promise.resolve({
            ok: true,
            status: 200,
            json: () => Promise.resolve({ rows: [{ clicks: 20, impressions: 400, ctr: 0.05, position: 12.4 }] }),
          });
        }
        const dim = body.dimensions[0];
        if (dim === "query") {
          return Promise.resolve({
            ok: true,
            status: 200,
            json: () => Promise.resolve({
              rows: [
                // Opportunity query: position 11-20, impressions above average
                { keys: ["free feedback form"], clicks: 2, impressions: 200, ctr: 0.01, position: 14.5 },
                { keys: ["poor query"], clicks: 0, impressions: 50, ctr: 0.00, position: 18.0 }
              ]
            }),
          });
        }
        return Promise.resolve({
          ok: true,
          status: 200,
          json: () => Promise.resolve({ rows: [] }),
        });
      }

      if (url.includes("analyticsdata.googleapis.com")) {
        const body = JSON.parse(init.body);
        const dimensionName = body.dimensions?.[0]?.name;
        if (!dimensionName) {
          // Summary
          return Promise.resolve({
            ok: true,
            status: 200,
            json: () => Promise.resolve({
              rows: [{ metricValues: [{ value: "100" }, { value: "80" }, { value: "70" }, { value: "400" }] }],
            }),
          });
        }
        if (dimensionName === "eventName") {
          // Funnel: demo_start low activation rate (sessions = 100, demo_start = 2)
          return Promise.resolve({
            ok: true,
            status: 200,
            json: () => Promise.resolve({
              rows: [
                { dimensionValues: [{ value: "demo_start" }], metricValues: [{ value: "2" }] },
                { dimensionValues: [{ value: "demo_complete" }], metricValues: [{ value: "0" }] }
              ],
            }),
          });
        }
        return Promise.resolve({
          ok: true,
          status: 200,
          json: () => Promise.resolve({ rows: [] }),
        });
      }

      if (url.includes("clarity.ms")) {
        // Clarity URL insights
        return Promise.resolve({
          ok: true,
          status: 200,
          json: () => Promise.resolve([
            {
              metricName: "rageclickcount",
              information: [
                { URL: "https://genforms.ai/f/contact", sessionsCount: 15 }
              ]
            }
          ]),
        });
      }

      return Promise.reject(new Error("Unknown URL"));
    });
    vi.stubGlobal("fetch", fetchMock);

    const res = await GET(new Request("http://localhost/api/admin/growth/daily-brief?numOfDays=28"));
    const json = await res.json();

    expect(json.code).toBe(0);
    expect(json.data.sources.gsc.status).toBe("ready");
    expect(json.data.sources.ga4.status).toBe("ready");
    expect(json.data.sources.clarity.status).toBe("ready");
    expect(json.data.sources.clarity.actualNumOfDays).toBe(3); // capped

    const actions = json.data.brief.recommendedActions;
    expect(actions.length).toBeGreaterThan(0);

    // GSC rule opportunity check
    const queryAction = actions.find((a: any) => a.id.includes("opt-query"));
    expect(queryAction).toBeDefined();
    expect(queryAction.priority).toBe("P1");
    expect(queryAction.category).toBe("seo");

    // GA4 low activation rate check (sessions = 100, demo_start = 2)
    const activationAction = actions.find((a: any) => a.id === "brief-low-demo-start");
    expect(activationAction).toBeDefined();
    expect(activationAction.priority).toBe("P1");

    // Clarity rage clicks check
    const clarityAction = actions.find((a: any) => a.id.includes("clarity-rage"));
    expect(clarityAction).toBeDefined();
    expect(clarityAction.priority).toBe("P0");
    expect(clarityAction.source).toBe("clarity");
  });

  it("ensures no credentials or sensitive tokens are returned in response", async () => {
    setAdminEnv();
    process.env.GOOGLE_SERVICE_ACCOUNT_KEY = JSON.stringify({
      private_key: testPrivateKey,
      client_email: "desensitize@project.iam.gserviceaccount.com",
    });
    process.env.GSC_PROPERTY_URL = "https://genforms.ai/";

    const fetchMock = vi.fn().mockImplementation((url) => {
      if (url === "https://oauth2.googleapis.com/token") {
        return Promise.resolve({
          ok: true,
          status: 200,
          json: () => Promise.resolve({ access_token: "super-secret-access-token-desensitize" }),
        });
      }
      return Promise.resolve({ ok: true, status: 200, json: () => Promise.resolve({ rows: [] }) });
    });
    vi.stubGlobal("fetch", fetchMock);

    const res = await GET(new Request("http://localhost/api/admin/growth/daily-brief"));
    const rawText = await res.text();

    expect(rawText).not.toContain("super-secret-access-token-desensitize");
    expect(rawText).not.toContain("desensitize@project.iam.gserviceaccount.com");
    expect(rawText).not.toContain((testPrivateKey as string).substring(0, 30));
  });

  it("ensures OAuth credentials are used and desensitized in daily-brief response", async () => {
    setAdminEnv();
    process.env.GOOGLE_OAUTH_CLIENT_ID = "brief-oauth-client-id";
    process.env.GOOGLE_OAUTH_CLIENT_SECRET = "brief-oauth-client-secret";
    process.env.GOOGLE_OAUTH_REFRESH_TOKEN = "brief-oauth-refresh-token";
    process.env.GSC_PROPERTY_URL = "https://genforms.ai/";
    process.env.GA4_PROPERTY_ID = "123456789";

    const fetchMock = vi.fn().mockImplementation((url) => {
      if (url === "https://oauth2.googleapis.com/token") {
        return Promise.resolve({
          ok: true,
          status: 200,
          json: () => Promise.resolve({ access_token: "brief-oauth-access-token-secret" }),
        });
      }
      return Promise.resolve({ ok: true, status: 200, json: () => Promise.resolve({ rows: [] }) });
    });
    vi.stubGlobal("fetch", fetchMock);

    const res = await GET(new Request("http://localhost/api/admin/growth/daily-brief"));
    const rawText = await res.text();

    expect(rawText).not.toContain("brief-oauth-client-secret");
    expect(rawText).not.toContain("brief-oauth-refresh-token");
    expect(rawText).not.toContain("brief-oauth-access-token-secret");
  });

  it("handles GSC/GA4 OAuth token exchange errors gracefully by reporting error status without leaking secrets", async () => {
    setAdminEnv();
    process.env.GOOGLE_OAUTH_CLIENT_ID = "brief-oauth-client-id-fail";
    process.env.GOOGLE_OAUTH_CLIENT_SECRET = "brief-oauth-client-secret-fail";
    process.env.GOOGLE_OAUTH_REFRESH_TOKEN = "brief-oauth-refresh-token-fail";
    process.env.GSC_PROPERTY_URL = "https://genforms.ai/";
    process.env.GA4_PROPERTY_ID = "123456789";

    const fetchMock = vi.fn().mockResolvedValue({
      ok: false,
      status: 401,
      text: () => Promise.resolve("invalid_grant: bad credentials leak secret"),
    });
    vi.stubGlobal("fetch", fetchMock);

    const res = await GET(new Request("http://localhost/api/admin/growth/daily-brief"));
    const json = await res.json();
    const rawText = JSON.stringify(json);

    expect(json.code).toBe(0);
    expect(json.data.sources.gsc.status).toBe("error");
    expect(json.data.sources.gsc.message).toContain("Failed to authenticate with Google OAuth");
    expect(json.data.sources.ga4.status).toBe("error");
    expect(json.data.sources.ga4.message).toContain("Failed to authenticate with Google OAuth");
    
    // Safety check
    expect(rawText).not.toContain("invalid_grant");
    expect(rawText).not.toContain("bad credentials leak secret");
    expect(rawText).not.toContain("brief-oauth-client-secret");
  });
});
