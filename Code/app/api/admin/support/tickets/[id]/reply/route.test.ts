import { afterEach, describe, expect, it, vi } from "vitest";

import { POST } from "./route";

const routeMocks = vi.hoisted(() => ({
  getUserEmailMock: vi.fn(),
  replySupportTicketMock: vi.fn(),
}));

vi.mock("@/services/user", () => ({
  getUserEmail: routeMocks.getUserEmailMock,
}));

vi.mock("@/models/support-ticket", () => ({
  replySupportTicket: routeMocks.replySupportTicketMock,
}));

function jsonRequest(body: unknown) {
  return new Request("http://test.local/api/admin/support/tickets/ticket_1/reply", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  });
}

describe("admin support ticket reply API", () => {
  afterEach(() => {
    vi.clearAllMocks();
    vi.unstubAllEnvs();
  });

  it("blocks non-admin users", async () => {
    vi.stubEnv("ADMIN_EMAILS", "admin@example.com");
    routeMocks.getUserEmailMock.mockResolvedValue("user@example.com");

    const res = await POST(jsonRequest({ reply: "Checking" }), {
      params: Promise.resolve({ id: "ticket_1" }),
    });
    const json = await res.json();

    expect(json.code).toBe(-1);
    expect(routeMocks.replySupportTicketMock).not.toHaveBeenCalled();
  });

  it("allows admins to reply to support tickets", async () => {
    vi.stubEnv("ADMIN_EMAILS", "admin@example.com");
    routeMocks.getUserEmailMock.mockResolvedValue("admin@example.com");
    routeMocks.replySupportTicketMock.mockResolvedValue({
      uuid: "ticket_1",
      status: "replied",
    });

    const res = await POST(jsonRequest({ reply: "Please retry.", status: "replied" }), {
      params: Promise.resolve({ id: "ticket_1" }),
    });
    const json = await res.json();

    expect(routeMocks.replySupportTicketMock).toHaveBeenCalledWith({
      uuid: "ticket_1",
      admin_email: "admin@example.com",
      reply: "Please retry.",
      status: "replied",
    });
    expect(json.code).toBe(0);
    expect(json.data.ticket.status).toBe("replied");
  });
});
