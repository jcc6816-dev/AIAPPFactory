import { describe, expect, it } from "vitest";
import { GrowthEventRecord } from "@/types/growth-event";
import { buildFormsNewActivationMonitor } from "./forms-new-activation-monitor";

const now = new Date("2026-07-06T12:00:00.000Z");

function event(
  eventName: string,
  overrides: Partial<GrowthEventRecord> = {}
): GrowthEventRecord {
  return {
    uuid: `${eventName}-${Math.random()}`,
    event_name: eventName,
    visitor_id: "visitor_1",
    session_id: "session_1",
    path: "/forms/new?template=event-registration",
    source: "organic",
    template_id: "event-registration",
    metadata_json: {},
    created_at: "2026-07-06T11:50:00.000Z",
    ...overrides,
  };
}

describe("buildFormsNewActivationMonitor", () => {
  it("returns pass when a session reaches preview, CTA click, and login intent", () => {
    const monitor = buildFormsNewActivationMonitor(
      [
        event("forms_new_view"),
        event("workspace_preview_ready"),
        event("forms_new_primary_action_viewed"),
        event("forms_new_primary_action_clicked"),
        event("guest_login_intent_started"),
      ],
      { now, hours: 24 }
    );

    expect(monitor.decision).toBe("pass");
    expect(monitor.totals.qualified_sessions).toBe(1);
    expect(monitor.qualified_sessions[0].decision_signal).toBe("activated");
    expect(monitor.totals.event_counts.forms_new_primary_action_clicked).toBe(1);
  });

  it("filters development and internal deployment events", () => {
    const monitor = buildFormsNewActivationMonitor(
      [
        event("forms_new_view", { metadata_json: { is_dev: true } }),
        event("forms_new_primary_action_viewed", { source: "deploy_check" }),
        event("forms_new_primary_action_viewed", {
          path: "/forms/new?template=event-registration&source=codex_verify",
          visitor_id: "visitor_codex_path",
          session_id: "session_codex_path",
        }),
        event("forms_new_primary_action_viewed", {
          visitor_id: "visitor_codex_attribution",
          session_id: "session_codex_attribution",
          metadata_json: {
            attribution: {
              content_source: "codex_verify",
            },
          },
        }),
        event("forms_new_primary_action_viewed", {
          visitor_id: "visitor_real",
          session_id: "session_real",
        }),
      ],
      { now, hours: 24 }
    );

    expect(monitor.totals.raw_events).toBe(5);
    expect(monitor.totals.scoped_events).toBe(1);
    expect(monitor.totals.qualified_sessions).toBe(1);
  });

  it("keeps content source for activation sample sessions", () => {
    const monitor = buildFormsNewActivationMonitor(
      [
        event("forms_new_primary_action_viewed", {
          path: "/forms/new?template=event-registration&source=activation_sample_event",
          metadata_json: {
            source: "activation_sample_event",
            attribution: {
              content_source: "activation_sample_event",
            },
          },
        }),
      ],
      { now, hours: 24 }
    );

    expect(monitor.totals.qualified_sessions).toBe(1);
    expect(monitor.qualified_sessions[0].content_source).toBe(
      "activation_sample_event"
    );
  });

  it("returns iterate when three sessions see CTA but do not click", () => {
    const monitor = buildFormsNewActivationMonitor(
      [1, 2, 3].map((index) =>
        event("forms_new_primary_action_viewed", {
          visitor_id: `visitor_${index}`,
          session_id: `session_${index}`,
        })
      ),
      { now, hours: 24 }
    );

    expect(monitor.decision).toBe("iterate");
    expect(monitor.triggers[0]).toContain("primary CTA");
  });

  it("returns wait when the current window has insufficient evidence", () => {
    const monitor = buildFormsNewActivationMonitor(
      [
        event("forms_new_view", {
          created_at: "2026-07-04T11:50:00.000Z",
        }),
      ],
      { now, hours: 24 }
    );

    expect(monitor.decision).toBe("wait");
    expect(monitor.totals.scoped_events).toBe(0);
  });
});
