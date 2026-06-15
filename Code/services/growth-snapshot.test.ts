import { describe, it, expect, vi, beforeEach } from "vitest";
import { sanitizeUrl, sanitizeDetailsJson } from "./growth-snapshot";
import { upsertGrowthMetricSnapshot, getGrowthMetricSnapshot } from "../models/growth-metric-snapshot";
import { readDevGrowthSnapshots, writeDevGrowthSnapshots } from "@/lib/dev-growth-snapshot-store";
import { hasSupabaseConfig, getSupabaseClient } from "../models/db";

// Mock the dev growth snapshot store using the alias path matching the model's import
const mockMemoryDb: any[] = [];
vi.mock("@/lib/dev-growth-snapshot-store", () => {
  return {
    readDevGrowthSnapshots: vi.fn(async () => mockMemoryDb),
    writeDevGrowthSnapshots: vi.fn(async (data) => {
      const copy = [...data];
      mockMemoryDb.length = 0;
      mockMemoryDb.push(...copy);
    })
  };
});

// Mock the db configuration module using relative path matching the model's import
vi.mock("../models/db", () => {
  return {
    hasSupabaseConfig: vi.fn(() => false), // Default to false
    getSupabaseClient: vi.fn(),
  };
});

describe("Growth Metrics Snapshot Sanitizer", () => {
  it("should remove sensitive query parameters from URLs and paths", () => {
    // Relative path tests
    expect(sanitizeUrl("/forms/new?email=test@test.com&token=secret123&locale=zh")).toBe("/forms/new?locale=zh");
    expect(sanitizeUrl("/templates?prompt=create+survey&template=waitlist")).toBe("/templates?template=waitlist");

    // Full URL tests
    expect(sanitizeUrl("https://genforms.ai/posts/typeform-alternatives?utm_source=bing&utm_content=sensitive_ad&locale=en"))
      .toBe("https://genforms.ai/posts/typeform-alternatives?locale=en");

    // Whitelisted params check
    expect(sanitizeUrl("/forms/new?locale=en&page=2&tab=metrics&template=waitlist&source=gsc"))
      .toBe("/forms/new?locale=en&page=2&tab=metrics&template=waitlist&source=gsc");

    // Fallback if URL is malformed
    expect(sanitizeUrl("/malformed?email=test@test.com?token=xyz")).toBe("/malformed");

    // Strict value checks
    // Email value in whitelist key should be deleted
    expect(sanitizeUrl("/forms/new?template=mike@gmail.com")).toBe("/forms/new");
    // URL encoded value in whitelist key should be deleted
    expect(sanitizeUrl("/forms/new?template=my%40value")).toBe("/forms/new");
    // Long parameter (>50 chars) in whitelist key should be deleted
    expect(sanitizeUrl("/forms/new?template=a".repeat(51))).toBe("/forms/new");
    // Spaces / prompt text in whitelist key should be deleted
    expect(sanitizeUrl("/forms/new?template=my+survey+template")).toBe("/forms/new");
  });

  it("should deep sanitize GSC, GA4, and Clarity details JSON payloads", () => {
    // GSC Page sanitization
    const gscDetails = {
      pages: [
        { key: "https://genforms.ai/forms/new?email=test@test.com&locale=zh", clicks: 10 },
        { key: "/templates?prompt=make_form", clicks: 5 }
      ]
    };
    const cleanGsc = sanitizeDetailsJson("gsc", gscDetails);
    expect(cleanGsc.pages[0].key).toBe("https://genforms.ai/forms/new?locale=zh");
    expect(cleanGsc.pages[1].key).toBe("/templates");

    // GA4 Landing page sanitization
    const ga4Details = {
      landingPages: [
        { key: "/forms/new?token=123456&source=google", sessions: 50 }
      ]
    };
    const cleanGa4 = sanitizeDetailsJson("ga4", ga4Details);
    expect(cleanGa4.landingPages[0].key).toBe("/forms/new?source=google");

    // Clarity URL sanitization
    const clarityDetails = {
      url: [
        { key: "https://genforms.ai/solutions?email=test@test.com", sessions: 120 }
      ]
    };
    const cleanClarity = sanitizeDetailsJson("clarity", clarityDetails);
    expect(cleanClarity.url[0].key).toBe("https://genforms.ai/solutions");
  });
});

describe("Growth Metrics Snapshot Model & Fallback Behavior", () => {
  beforeEach(() => {
    mockMemoryDb.length = 0;
    vi.clearAllMocks();
  });

  it("should use local JSON fallback store when Supabase config is missing", async () => {
    vi.mocked(hasSupabaseConfig).mockReturnValue(false);

    const snapshot = await upsertGrowthMetricSnapshot({
      snapshot_date: "2026-06-15",
      source: "gsc",
      range: "28d",
      segment: "default",
      metrics_json: { clicks: 150 },
      details_json: { queries: [] },
      status: "success",
      error_message: ""
    });

    expect(snapshot.uuid).toBeDefined();
    expect(snapshot.snapshot_date).toBe("2026-06-15");
    expect(snapshot.metrics_json.clicks).toBe(150);

    // Verify it is written to mock store
    expect(readDevGrowthSnapshots).toHaveBeenCalled();
    expect(writeDevGrowthSnapshots).toHaveBeenCalled();

    // Query it back
    const retrieved = await getGrowthMetricSnapshot("2026-06-15", "gsc", "28d", "default");
    expect(retrieved).not.toBeNull();
    expect(retrieved?.metrics_json.clicks).toBe(150);
  });

  it("should perform upsert on conflicting snapshot key instead of duplicate appends", async () => {
    vi.mocked(hasSupabaseConfig).mockReturnValue(false);

    // 1. Save first version
    await upsertGrowthMetricSnapshot({
      snapshot_date: "2026-06-15",
      source: "ga4",
      range: "1d",
      segment: "default",
      metrics_json: { sessions: 100 },
      details_json: {},
      status: "success",
      error_message: ""
    });

    // 2. Upsert updated version for same date/source/range/segment
    await upsertGrowthMetricSnapshot({
      snapshot_date: "2026-06-15",
      source: "ga4",
      range: "1d",
      segment: "default",
      metrics_json: { sessions: 250 },
      details_json: {},
      status: "success",
      error_message: ""
    });

    // 3. Query back and assert it is updated
    const retrieved = await getGrowthMetricSnapshot("2026-06-15", "ga4", "1d", "default");
    expect(retrieved?.metrics_json.sessions).toBe(250);

    // Assert only 1 record exists in store
    const all = await readDevGrowthSnapshots();
    expect(all.length).toBe(1);
  });

  it("should throw error in production environment when Supabase fails", async () => {
    vi.mocked(hasSupabaseConfig).mockReturnValue(true);

    // Mock getSupabaseClient to return a client that throws error
    const mockSupabase = {
      from: () => ({
        select: () => ({
          eq: () => ({
            eq: () => ({
              eq: () => ({
                eq: () => ({
                  maybeSingle: async () => ({ data: null, error: null })
                })
              })
            })
          })
        }),
        upsert: () => ({
          select: () => ({
            single: async () => ({ data: null, error: new Error("Supabase Database Connection Error") })
          })
        })
      })
    };
    vi.mocked(getSupabaseClient).mockReturnValue(mockSupabase as any);

    // Expect upsert to throw database error rather than falling back silently
    await expect(
      upsertGrowthMetricSnapshot({
        snapshot_date: "2026-06-15",
        source: "clarity",
        range: "1d",
        segment: "default",
        metrics_json: {},
        details_json: {},
        status: "success",
        error_message: ""
      })
    ).rejects.toThrow("Supabase Database Connection Error");

    // Confirm dev store was never written to
    expect(writeDevGrowthSnapshots).not.toHaveBeenCalled();
  });

  it("should preserve the uuid of the existing record on Supabase upsert", async () => {
    vi.mocked(hasSupabaseConfig).mockReturnValue(true);

    const mockSupabase = {
      from: (table: string) => {
        return {
          select: () => ({
            eq: () => ({
              eq: () => ({
                eq: () => ({
                  eq: () => ({
                    maybeSingle: async () => ({ data: { uuid: "gms_stable_uuid" }, error: null })
                  })
                })
              })
            })
          }),
          upsert: (record: any) => ({
            select: () => ({
              single: async () => {
                // Check that the uuid passed to upsert is the preserved one
                expect(record.uuid).toBe("gms_stable_uuid");
                return { data: record, error: null };
              }
            })
          })
        };
      }
    };

    vi.mocked(getSupabaseClient).mockReturnValue(mockSupabase as any);

    const result = await upsertGrowthMetricSnapshot({
      snapshot_date: "2026-06-15",
      source: "gsc",
      range: "28d",
      segment: "default",
      metrics_json: {},
      details_json: {},
      status: "success",
      error_message: ""
    });

    expect(result.uuid).toBe("gms_stable_uuid");
  });

  it("should default segment to 'default' if not provided and preserve uuid", async () => {
    vi.mocked(hasSupabaseConfig).mockReturnValue(true);

    const mockSupabase = {
      from: (table: string) => {
        return {
          select: () => ({
            eq: (col: string, val: any) => {
              return {
                eq: () => ({
                  eq: () => ({
                    eq: () => ({
                      maybeSingle: async () => ({ data: { uuid: "gms_stable_uuid_default" }, error: null })
                    })
                  })
                })
              };
            }
          }),
          upsert: (record: any) => ({
            select: () => ({
              single: async () => {
                expect(record.segment).toBe("default");
                expect(record.uuid).toBe("gms_stable_uuid_default");
                return { data: record, error: null };
              }
            })
          })
        };
      }
    };

    vi.mocked(getSupabaseClient).mockReturnValue(mockSupabase as any);

    const result = await upsertGrowthMetricSnapshot({
      snapshot_date: "2026-06-15",
      source: "gsc",
      range: "28d",
      // segment is omitted
      metrics_json: {},
      details_json: {},
      status: "success",
      error_message: ""
    } as any);

    expect(result.uuid).toBe("gms_stable_uuid_default");
    expect(result.segment).toBe("default");
  });
});
