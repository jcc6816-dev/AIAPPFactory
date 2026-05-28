import { describe, expect, it } from "vitest";

import {
  normalizeSupportTicketCategory,
  normalizeSupportTicketStatus,
} from "./support-ticket";

describe("support ticket model helpers", () => {
  it("normalizes unknown categories to general", () => {
    expect(normalizeSupportTicketCategory("webhook")).toBe("webhook");
    expect(normalizeSupportTicketCategory("unknown")).toBe("general");
    expect(normalizeSupportTicketCategory()).toBe("general");
  });

  it("normalizes unknown statuses to open", () => {
    expect(normalizeSupportTicketStatus("replied")).toBe("replied");
    expect(normalizeSupportTicketStatus("closed")).toBe("closed");
    expect(normalizeSupportTicketStatus("bad")).toBe("open");
    expect(normalizeSupportTicketStatus()).toBe("open");
  });
});
