import { describe, expect, it } from "vitest";
import {
  GROWTH_SESSION_TIMEOUT_MS,
  mergeGrowthAttribution,
  normalizeGrowthTraffic,
  resolveGrowthSession,
  sanitizeGrowthAttribution,
  sanitizeGrowthReferrer,
} from "./growth-attribution";

describe("growth attribution", () => {
  it("normalizes search, referral, internal and direct traffic", () => {
    expect(normalizeGrowthTraffic({ referrer: "https://www.google.com/search?q=forms" })).toEqual({
      channel: "organic_search", search_engine: "google",
    });
    expect(normalizeGrowthTraffic({ referrer: "https://example.com/post" })).toEqual({ channel: "referral" });
    expect(normalizeGrowthTraffic({ currentHostname: "genforms.ai", referrer: "https://genforms.ai/en" })).toEqual({ channel: "internal" });
    expect(normalizeGrowthTraffic({})).toEqual({ channel: "direct" });
  });

  it("starts a new session after 30 minutes of inactivity", () => {
    const now = Date.parse("2026-07-03T10:00:00.000Z");
    expect(resolveGrowthSession(
      { id: "session_old", last_activity_at: now - GROWTH_SESSION_TIMEOUT_MS - 1 },
      () => "session_new", now
    ).id).toBe("session_new");
    expect(resolveGrowthSession(
      { id: "session_current", last_activity_at: now - 1000 },
      () => "unused", now
    ).id).toBe("session_current");
  });

  it("keeps first touch on direct navigation and updates last non-direct touch", () => {
    const first = mergeGrowthAttribution(undefined, {
      channel: "organic_search", search_engine: "google", landing_path: "/use-cases/qr",
    }, Date.parse("2026-07-01T00:00:00.000Z"));
    const direct = mergeGrowthAttribution(first, {
      channel: "direct", content_source: "usecase_qr", intent: "qr_form",
    }, Date.parse("2026-07-01T01:00:00.000Z"));
    const campaign = mergeGrowthAttribution(direct, {
      channel: "campaign", content_source: "launch",
    }, Date.parse("2026-07-02T00:00:00.000Z"));

    expect(direct.channel).toBe("organic_search");
    expect(direct.first_touch_at).toBe("2026-07-01T00:00:00.000Z");
    expect(direct.content_source).toBe("usecase_qr");
    expect(campaign.channel).toBe("campaign");
    expect(campaign.landing_path).toBe("/use-cases/qr");
    expect(campaign.last_non_direct_at).toBe("2026-07-02T00:00:00.000Z");
  });

  it("allowlists fields and removes sensitive URL parameters", () => {
    expect(sanitizeGrowthAttribution({
      channel: "organic_search",
      landing_path: "/forms/new?source=seo&prompt=secret&email=a%40b.com&token=x",
      content_source: "usecase_qr",
      prompt: "must not persist",
      answers: { email: "private@example.com" },
    })).toEqual({
      channel: "organic_search",
      landing_path: "/forms/new?source=seo",
      content_source: "usecase_qr",
    });
    expect(sanitizeGrowthReferrer("https://www.google.com/search?q=private+query")).toBe(
      "https://www.google.com/search"
    );
  });
});
