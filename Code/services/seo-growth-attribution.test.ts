import { describe, expect, it } from "vitest";
import type { FormRecord, FormSubmissionRecord } from "@/types/form";
import { buildSeoGrowthAttributionSummary } from "./seo-growth-attribution";

function form(uuid: string, overrides: Partial<FormRecord> = {}): FormRecord {
  return {
    uuid, user_uuid: "user_1", title: uuid, theme: "minimal",
    schema_json: { fields: [] }, status: "draft", share_code: `share_${uuid}`,
    created_at: "2026-07-02T00:00:00.000Z", ...overrides,
  };
}

function submission(uuid: string, formUuid: string, overrides: Partial<FormSubmissionRecord> = {}): FormSubmissionRecord {
  return {
    uuid, form_uuid: formUuid, form_title: formUuid, form_share_code: `share_${formUuid}`,
    answers_json: {}, files_json: [], status: "submitted",
    created_at: "2026-07-03T00:00:00.000Z", ...overrides,
  };
}

describe("SEO growth attribution summary", () => {
  it("counts database outcomes once and excludes internal/test activity", () => {
    const attribution = {
      channel: "organic_search" as const, search_engine: "google" as const,
      content_source: "usecase_qr", intent: "qr_form",
    };
    const result = buildSeoGrowthAttributionSummary([
      form("organic", {
        status: "published",
        generation_meta_json: {
          attribution,
          artifact: {
            kind: "form",
            artifactVersion: 1,
            status: "published",
            visualSettings: {
              theme: "minimal", layout: "single", themeVariant: "default", preferredDevice: "phone",
            },
            history: [{ id: "pub_1", type: "published", summary: "Published", createdAt: "2026-07-03T00:00:00.000Z" }],
          },
        },
      }),
      form("unattributed"),
      form("internal", { generation_meta_json: { attribution: { channel: "internal", content_source: "admin_check" } } }),
    ], [
      submission("real_1", "organic"), submission("real_2", "organic"),
      submission("test_1", "organic", { is_test: true }),
    ], { from: "2026-07-01T00:00:00.000Z", to: "2026-07-04T00:00:00.000Z" });

    expect(result.summary).toMatchObject({
      eligibleForms: 2, organicAttributedCreated: 1, organicAttributedPublished: 1,
      organicAttributedCreators: 1, organicPublishedWithin7d: 1,
      organicPublishedCreatorsWithin7d: 1, organicAttributedValueRealized: 1,
      organicValueRealizedCreators: 1, unattributedForms: 1,
      unattributedRate: 0.5, internalExcluded: 1, qualifiedLead: null,
    });
    expect(result.breakdown[0]).toMatchObject({ contentSource: "usecase_qr", created: 1, valueRealized: 1 });
  });

  it("does not count submissions outside the 28-day value window", () => {
    const result = buildSeoGrowthAttributionSummary([
      form("organic", { status: "published", generation_meta_json: { attribution: { channel: "organic_search" } } }),
    ], [submission("late", "organic", { created_at: "2026-08-01T00:00:00.000Z" })],
    { from: "2026-07-01T00:00:00.000Z", to: "2026-07-04T00:00:00.000Z" });
    expect(result.summary.organicAttributedValueRealized).toBe(0);
  });
});
