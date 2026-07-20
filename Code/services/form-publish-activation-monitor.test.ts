import { describe, expect, it } from "vitest";

import { buildFormPublishActivationMonitor } from "./form-publish-activation-monitor";

const now = new Date("2026-07-10T08:00:00.000Z");

function form(overrides: Record<string, unknown> = {}) {
  return {
    uuid: "form_1",
    title: "Event Registration Form",
    description: "",
    theme: "business",
    status: "draft",
    share_code: "share_1",
    user_uuid: "user_1",
    schema_json: { fields: [] },
    created_at: "2026-07-10T07:00:00.000Z",
    updated_at: "2026-07-10T07:00:00.000Z",
    ...overrides,
  } as any;
}

describe("buildFormPublishActivationMonitor", () => {
  it("lists drafts older than the grace period with their creation attribution", () => {
    const monitor = buildFormPublishActivationMonitor(
      [form()],
      [{
        uuid: "event_1",
        event_name: "form_created",
        visitor_id: "visitor_1",
        form_uuid: "form_1",
        source: "organic_search",
        metadata_json: { attribution: { template_id: "event-registration" } },
        created_at: "2026-07-10T07:00:00.000Z",
      }],
      { now, hours: 24, pendingAfterMinutes: 30 }
    );

    expect(monitor.decision).toBe("wait");
    expect(monitor.totals.pending_publish_forms).toBe(1);
    expect(monitor.pending_publish_forms[0]).toMatchObject({
      form_uuid: "form_1",
      source: "organic_search",
      template_id: "event-registration",
      age_minutes: 60,
    });
  });

  it("does not flag published forms or recent drafts", () => {
    const monitor = buildFormPublishActivationMonitor(
      [
        form({ uuid: "published", status: "published" }),
        form({ uuid: "recent", created_at: "2026-07-10T07:45:00.000Z" }),
      ],
      [],
      { now, pendingAfterMinutes: 30 }
    );

    expect(monitor.decision).toBe("pass");
    expect(monitor.totals.pending_publish_forms).toBe(0);
  });
});
