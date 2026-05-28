import { afterEach, describe, expect, it, vi } from "vitest";

import { GET, POST } from "./route";

const routeMocks = vi.hoisted(() => ({
  getUserUuidMock: vi.fn(),
  getUserEmailMock: vi.fn(),
  createSupportTicketMock: vi.fn(),
  listSupportTicketsByUserMock: vi.fn(),
}));

vi.mock("@/services/user", () => ({
  getUserUuid: routeMocks.getUserUuidMock,
  getUserEmail: routeMocks.getUserEmailMock,
}));

vi.mock("@/models/support-ticket", () => ({
  createSupportTicket: routeMocks.createSupportTicketMock,
  listSupportTicketsByUser: routeMocks.listSupportTicketsByUserMock,
}));

function jsonRequest(body: unknown) {
  return new Request("http://test.local/api/support/tickets", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  });
}

describe("support tickets API", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it("requires authentication before listing tickets", async () => {
    routeMocks.getUserUuidMock.mockResolvedValue("");

    const res = await GET();
    const json = await res.json();

    expect(json.code).toBe(-1);
    expect(routeMocks.listSupportTicketsByUserMock).not.toHaveBeenCalled();
  });

  it("lists only the current user's tickets", async () => {
    routeMocks.getUserUuidMock.mockResolvedValue("user_1");
    routeMocks.listSupportTicketsByUserMock.mockResolvedValue([
      { uuid: "ticket_1", user_uuid: "user_1" },
    ]);

    const res = await GET();
    const json = await res.json();

    expect(routeMocks.listSupportTicketsByUserMock).toHaveBeenCalledWith("user_1");
    expect(json.code).toBe(0);
    expect(json.data.tickets).toHaveLength(1);
  });

  it("validates title and message before creating a ticket", async () => {
    routeMocks.getUserUuidMock.mockResolvedValue("user_1");

    const res = await POST(jsonRequest({ title: "", message: "" }));
    const json = await res.json();

    expect(json.code).toBe(-1);
    expect(routeMocks.createSupportTicketMock).not.toHaveBeenCalled();
  });

  it("creates a support ticket for the current user", async () => {
    routeMocks.getUserUuidMock.mockResolvedValue("user_1");
    routeMocks.getUserEmailMock.mockResolvedValue("user@example.com");
    routeMocks.createSupportTicketMock.mockResolvedValue({
      uuid: "ticket_1",
      status: "open",
    });

    const res = await POST(
      jsonRequest({
        category: "webhook",
        title: "Webhook failed",
        message: "DingTalk returns 401",
      })
    );
    const json = await res.json();

    expect(routeMocks.createSupportTicketMock).toHaveBeenCalledWith({
      user_uuid: "user_1",
      user_email: "user@example.com",
      category: "webhook",
      title: "Webhook failed",
      message: "DingTalk returns 401",
    });
    expect(json.code).toBe(0);
    expect(json.data.ticket.uuid).toBe("ticket_1");
  });
});
