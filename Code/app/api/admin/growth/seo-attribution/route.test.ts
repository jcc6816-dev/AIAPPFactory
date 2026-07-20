import { afterEach, describe, expect, it, vi } from "vitest";
import { GET } from "./route";

const mocks = vi.hoisted(() => ({ getUserEmail: vi.fn(), getSummary: vi.fn() }));

vi.mock("@/services/user", () => ({ getUserEmail: mocks.getUserEmail }));
vi.mock("@/services/seo-growth-attribution", () => ({
  getSeoGrowthAttributionSummary: mocks.getSummary,
}));

describe("SEO attribution admin API", () => {
  afterEach(() => {
    vi.clearAllMocks();
    vi.unstubAllEnvs();
  });

  it("requires an administrator", async () => {
    vi.stubEnv("ADMIN_EMAILS", "admin@genforms.ai");
    mocks.getUserEmail.mockResolvedValue("guest@example.com");
    const response = await GET(new Request("http://test.local/api/admin/growth/seo-attribution"));
    expect(response.status).toBe(403);
    expect(mocks.getSummary).not.toHaveBeenCalled();
  });

  it("rejects an invalid range", async () => {
    vi.stubEnv("ADMIN_EMAILS", "admin@genforms.ai");
    mocks.getUserEmail.mockResolvedValue("admin@genforms.ai");
    const response = await GET(new Request("http://test.local/api/admin/growth/seo-attribution?from=bad-date"));
    expect(response.status).toBe(400);
  });

  it("returns filters and reports database failures", async () => {
    vi.stubEnv("ADMIN_EMAILS", "admin@genforms.ai");
    mocks.getUserEmail.mockResolvedValue("admin@genforms.ai");
    mocks.getSummary.mockResolvedValueOnce({ summary: { organicAttributedCreated: 1 } });
    const response = await GET(new Request(
      "http://test.local/api/admin/growth/seo-attribution?from=2026-07-01&to=2026-07-03&content_source=usecase_qr"
    ));
    expect(response.status).toBe(200);
    expect(mocks.getSummary).toHaveBeenCalledWith(expect.objectContaining({ contentSource: "usecase_qr" }));

    mocks.getSummary.mockRejectedValueOnce(new Error("db unavailable"));
    const failed = await GET(new Request(
      "http://test.local/api/admin/growth/seo-attribution?from=2026-07-01&to=2026-07-03"
    ));
    expect(failed.status).toBe(500);
  });
});
