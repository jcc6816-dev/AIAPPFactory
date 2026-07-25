import { describe, expect, it } from "vitest";
import { generateBriefActions } from "./admin-growth-daily-brief";

describe("generateBriefActions", () => {
  it("uses the confirmed form_saved event when checking publish drop-off", () => {
    const actions = generateBriefActions(
      { status: "not_configured" },
      {
        status: "ready",
        data: {
          summary: { sessions: 24 },
          funnel: [
            { eventName: "form_saved", eventCount: 4 },
            { eventName: "form_generate", eventCount: 0 },
            { eventName: "form_publish", eventCount: 1 },
            { eventName: "form_submit", eventCount: 0 },
          ],
        },
      },
      { status: "not_configured" },
      true
    );

    expect(actions).toEqual(expect.arrayContaining([
      expect.objectContaining({ id: "brief-low-publish", source: "ga4" }),
    ]));
  });
});
