import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { GET } from "./route";
import crypto from "crypto";

const mockUserEmail = vi.fn();

vi.mock("@/services/user", () => ({
  getUserEmail: () => mockUserEmail(),
}));

// 动态生成一个用于测试的真实有效 RSA 密钥对，避免 Node crypto 解码报错
const { privateKey: testPrivateKey } = crypto.generateKeyPairSync("rsa" as any, {
  modulusLength: 1024,
  privateKeyEncoding: {
    type: "pkcs8",
    format: "pem"
  }
});

describe("GSC Admin Summary API", () => {
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

    const req = new Request("http://localhost/api/admin/gsc/summary");
    const res = await GET(req);
    const json = await res.json();

    expect(res.status).toBe(403);
    expect(json.code).toBe(403);
  });

  it("returns code 1 config missing if no service account key or property url", async () => {
    mockUserEmail.mockResolvedValue("admin@aifactory.ai");
    process.env.ADMIN_EMAILS = "admin@aifactory.ai";
    delete process.env.GOOGLE_SERVICE_ACCOUNT_KEY;
    delete process.env.GOOGLE_SERVICE_ACCOUNT_KEY_BASE64;
    delete process.env.GSC_PROPERTY_URL;

    const req = new Request("http://localhost/api/admin/gsc/summary");
    const res = await GET(req);
    const json = await res.json();

    expect(json.code).toBe(1);
    expect(json.message).toContain("Google Service Account credentials");
  });

  it("returns code 1 if credentials JSON is invalid", async () => {
    mockUserEmail.mockResolvedValue("admin@aifactory.ai");
    process.env.ADMIN_EMAILS = "admin@aifactory.ai";
    process.env.GOOGLE_SERVICE_ACCOUNT_KEY = "invalid-json";
    process.env.GSC_PROPERTY_URL = "https://genforms.ai/";

    const req = new Request("http://localhost/api/admin/gsc/summary");
    const res = await GET(req);
    const json = await res.json();

    expect(json.code).toBe(1);
    expect(json.message).toContain("not a valid JSON string");
  });

  it("returns code 2 desensitized error when Google OAuth fails", async () => {
    mockUserEmail.mockResolvedValue("admin@aifactory.ai");
    process.env.ADMIN_EMAILS = "admin@aifactory.ai";
    process.env.GOOGLE_SERVICE_ACCOUNT_KEY = JSON.stringify({
      private_key: testPrivateKey,
      client_email: "test@project.iam.gserviceaccount.com"
    });
    process.env.GSC_PROPERTY_URL = "https://genforms.ai/";

    const fetchMock = vi.fn().mockResolvedValue({
      ok: false,
      status: 400,
      text: () => Promise.resolve("invalid_grant: Invalid JWT Signature"),
    });
    vi.stubGlobal("fetch", fetchMock);

    const req = new Request("http://localhost/api/admin/gsc/summary");
    const res = await GET(req);
    const json = await res.json();

    expect(json.code).toBe(2);
    expect(json.message).toContain("Failed to authenticate");
    expect(json.message).not.toContain("Invalid JWT Signature");
  });

  it("fetches, parses and returns GSC summary and dimensions on success", async () => {
    mockUserEmail.mockResolvedValue("admin@aifactory.ai");
    process.env.ADMIN_EMAILS = "admin@aifactory.ai";
    // 使用专门的不冲突 Token 避开缓存干扰
    const credentials = {
      private_key: testPrivateKey,
      client_email: "success@project.iam.gserviceaccount.com"
    };
    process.env.GOOGLE_SERVICE_ACCOUNT_KEY = JSON.stringify(credentials);
    process.env.GSC_PROPERTY_URL = "https://genforms.ai/";

    const fetchMock = vi.fn().mockImplementation((url, init) => {
      // OAuth token exchange request
      if (url === "https://oauth2.googleapis.com/token") {
        return Promise.resolve({
          ok: true,
          status: 200,
          json: () => Promise.resolve({ access_token: "mock-access-token" }),
        });
      }
      // GSC queries request
      if (url.includes("searchAnalytics/query")) {
        const body = JSON.parse(init.body);
        if (!body.dimensions) {
          // Summary call
          return Promise.resolve({
            ok: true,
            status: 200,
            json: () => Promise.resolve({
              rows: [{ clicks: 1000, impressions: 20000, ctr: 0.05, position: 10.5 }]
            }),
          });
        }
        const dim = body.dimensions[0];
        return Promise.resolve({
          ok: true,
          status: 200,
          json: () => Promise.resolve({
            rows: [
              { keys: [`key-${dim}-1`], clicks: 100, impressions: 2000, ctr: 0.05, position: 5.2 }
            ]
          }),
        });
      }
      return Promise.reject(new Error("Unknown URL"));
    });
    vi.stubGlobal("fetch", fetchMock);

    const req = new Request("http://localhost/api/admin/gsc/summary?numOfDays=28");
    const res = await GET(req);
    const json = await res.json();

    expect(json.code).toBe(0);
    expect(json.data.fromCache).toBe(false);
    expect(json.data.summary).toMatchObject({
      clicks: 1000,
      impressions: 20000,
      ctr: 5,
      position: 10.5,
    });
    expect(json.data.queries[0]).toMatchObject({
      key: "key-query-1",
      clicks: 100,
      impressions: 2000,
      ctr: 5,
      position: 5.2,
    });
    expect(json.data.pages[0].key).toBe("key-page-1");
  });

  it("serves GSC data from cache on subsequent requests", async () => {
    mockUserEmail.mockResolvedValue("admin@aifactory.ai");
    process.env.ADMIN_EMAILS = "admin@aifactory.ai";
    const credentials = {
      private_key: testPrivateKey,
      client_email: "cache@project.iam.gserviceaccount.com"
    };
    process.env.GOOGLE_SERVICE_ACCOUNT_KEY = JSON.stringify(credentials);
    process.env.GSC_PROPERTY_URL = "https://genforms.ai/";

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

    // Call 1
    const req1 = new Request("http://localhost/api/admin/gsc/summary?numOfDays=7");
    const res1 = await GET(req1);
    const json1 = await res1.json();
    expect(json1.data.fromCache).toBe(false);

    // Call 2 (should hit cache)
    const req2 = new Request("http://localhost/api/admin/gsc/summary?numOfDays=7");
    const res2 = await GET(req2);
    const json2 = await res2.json();
    expect(json2.data.fromCache).toBe(true);
  });

  it("returns desensitized error when GSC API fails", async () => {
    mockUserEmail.mockResolvedValue("admin@aifactory.ai");
    process.env.ADMIN_EMAILS = "admin@aifactory.ai";
    const credentials = {
      private_key: testPrivateKey,
      client_email: "fail@project.iam.gserviceaccount.com"
    };
    process.env.GOOGLE_SERVICE_ACCOUNT_KEY = JSON.stringify(credentials);
    process.env.GSC_PROPERTY_URL = "https://genforms.ai/";

    const fetchMock = vi.fn().mockImplementation((url) => {
      if (url === "https://oauth2.googleapis.com/token") {
        return Promise.resolve({
          ok: true,
          status: 200,
          json: () => Promise.resolve({ access_token: "mock-access-token" }),
        });
      }
      // Simulate Google Search Console API rate limit error
      return Promise.resolve({
        ok: false,
        status: 429,
        text: () => Promise.resolve("Quota exceeded for quota metric 'Queries' and limit 'Queries per day' of service 'webmasters.googleapis.com'"),
      });
    });
    vi.stubGlobal("fetch", fetchMock);

    const req = new Request("http://localhost/api/admin/gsc/summary?numOfDays=28");
    const res = await GET(req);
    const json = await res.json();

    expect(json.code).toBe(2);
    expect(json.message).toContain("Failed to fetch data from Google Search Console (HTTP 429)");
    // Should NOT contain quota details or project information in the message
    expect(json.message).not.toContain("webmasters.googleapis.com");
    expect(json.message).not.toContain("Quota exceeded");
  });

  it("uses OAuth refresh token flow when OAuth credentials are fully configured", async () => {
    mockUserEmail.mockResolvedValue("admin@aifactory.ai");
    process.env.ADMIN_EMAILS = "admin@aifactory.ai";
    process.env.GOOGLE_OAUTH_CLIENT_ID = "gsc-client-id";
    process.env.GOOGLE_OAUTH_CLIENT_SECRET = "gsc-client-secret";
    process.env.GOOGLE_OAUTH_REFRESH_TOKEN = "gsc-refresh-token";
    process.env.GSC_PROPERTY_URL = "https://genforms.ai/";

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

    const res = await GET(new Request("http://localhost/api/admin/gsc/summary"));
    const json = await res.json();

    expect(json.code).toBe(0);
    const tokenCall = fetchMock.mock.calls.find(c => c[0] === "https://oauth2.googleapis.com/token");
    expect(tokenCall).toBeDefined();
    expect(tokenCall![1]!.body.toString()).toContain("client_id=gsc-client-id");
    expect(tokenCall![1]!.body.toString()).toContain("grant_type=refresh_token");
  });

  it("returns code 1 when OAuth variables are partially configured", async () => {
    mockUserEmail.mockResolvedValue("admin@aifactory.ai");
    process.env.ADMIN_EMAILS = "admin@aifactory.ai";
    process.env.GOOGLE_OAUTH_CLIENT_ID = "gsc-client-id";
    delete process.env.GOOGLE_OAUTH_CLIENT_SECRET;
    delete process.env.GOOGLE_OAUTH_REFRESH_TOKEN;
    process.env.GSC_PROPERTY_URL = "https://genforms.ai/";

    const res = await GET(new Request("http://localhost/api/admin/gsc/summary"));
    const json = await res.json();

    expect(json.code).toBe(1);
    expect(json.message).toContain("Google OAuth variables are partially configured");
  });

  it("returns code 2 desensitized error when OAuth refresh fails and does not fallback to Service Account", async () => {
    mockUserEmail.mockResolvedValue("admin@aifactory.ai");
    process.env.ADMIN_EMAILS = "admin@aifactory.ai";
    process.env.GOOGLE_OAUTH_CLIENT_ID = "gsc-client-id-fail";
    process.env.GOOGLE_OAUTH_CLIENT_SECRET = "gsc-client-secret-fail";
    process.env.GOOGLE_OAUTH_REFRESH_TOKEN = "gsc-refresh-token-fail";
    process.env.GOOGLE_SERVICE_ACCOUNT_KEY = JSON.stringify({
      private_key: testPrivateKey,
      client_email: "test@project.iam.gserviceaccount.com"
    });
    process.env.GSC_PROPERTY_URL = "https://genforms.ai/";

    const fetchMock = vi.fn().mockResolvedValue({
      ok: false,
      status: 400,
      text: () => Promise.resolve("invalid_grant: Invalid refresh token"),
    });
    vi.stubGlobal("fetch", fetchMock);

    const res = await GET(new Request("http://localhost/api/admin/gsc/summary"));
    const json = await res.json();

    expect(json.code).toBe(2);
    expect(json.message).toContain("Failed to authenticate with Google OAuth");
    expect(json.message).not.toContain("invalid_grant");
    expect(json.message).not.toContain("gsc-client-secret");
    expect(json.message).not.toContain("gsc-refresh-token");
  });

  it("does not return client_secret or refresh_token in response text", async () => {
    mockUserEmail.mockResolvedValue("admin@aifactory.ai");
    process.env.ADMIN_EMAILS = "admin@aifactory.ai";
    process.env.GOOGLE_OAUTH_CLIENT_ID = "gsc-secret-client-id";
    process.env.GOOGLE_OAUTH_CLIENT_SECRET = "gsc-secret-client-secret";
    process.env.GOOGLE_OAUTH_REFRESH_TOKEN = "gsc-secret-refresh-token";
    process.env.GSC_PROPERTY_URL = "https://genforms.ai/";

    const fetchMock = vi.fn().mockImplementation((url) => {
      if (url === "https://oauth2.googleapis.com/token") {
        return Promise.resolve({
          ok: true,
          status: 200,
          json: () => Promise.resolve({ access_token: "super-secret-gsc-access-token" }),
        });
      }
      return Promise.resolve({
        ok: true,
        status: 200,
        json: () => Promise.resolve({ rows: [] }),
      });
    });
    vi.stubGlobal("fetch", fetchMock);

    const res = await GET(new Request("http://localhost/api/admin/gsc/summary"));
    const rawText = await res.text();

    expect(rawText).not.toContain("gsc-secret-client-secret");
    expect(rawText).not.toContain("gsc-secret-refresh-token");
    expect(rawText).not.toContain("super-secret-gsc-access-token");
  });
});
