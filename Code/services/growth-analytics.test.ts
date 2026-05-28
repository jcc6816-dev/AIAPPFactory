import { describe, expect, it } from "vitest";

import { buildGrowthAnalyticsSummary } from "./growth-analytics";
import { GrowthEventRecord } from "@/types/growth-event";

function event(
  event_name: string,
  overrides: Partial<GrowthEventRecord> = {}
): GrowthEventRecord {
  return {
    uuid: `evt_${event_name}_${Math.random()}`,
    event_name,
    visitor_id: "visitor_1",
    path: "/templates/lead-capture",
    source: "google",
    template_id: "lead-capture",
    duration_ms: 0,
    created_at: new Date().toISOString(),
    ...overrides,
  };
}

describe("growth analytics", () => {
  it("summarizes visitor, funnel, template, source, and duration signals", () => {
    const summary = buildGrowthAnalyticsSummary([
      event("page_view"),
      event("page_view", { visitor_id: "visitor_2", path: "/pricing", source: "direct" }),
      event("page_leave", { duration_ms: 20_000 }),
      event("template_viewed"),
      event("template_viewed"),
      event("template_used"),
      event("form_created"),
      event("form_published"),
      event("public_form_submitted"),
      event("checkout_started"),
      event("support_ticket_created"),
    ]);

    expect(summary.totals.visitors).toBe(2);
    expect(summary.totals.pageViews).toBe(2);
    expect(summary.totals.averageDurationSeconds).toBe(20);
    expect(summary.funnel.find((step) => step.key === "template_used")?.count).toBe(1);
    expect(summary.topTemplates[0]).toMatchObject({
      key: "lead-capture",
      views: 2,
      uses: 1,
      conversionRate: 50,
    });
    expect(summary.topSources[0].key).toBe("google");
  });
});
