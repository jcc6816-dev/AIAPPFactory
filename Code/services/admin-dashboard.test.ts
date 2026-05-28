import { afterEach, describe, expect, it, vi } from "vitest";

import {
  formatRevenue,
  getAdminDashboardMetrics,
} from "./admin-dashboard";

const dashboardMocks = vi.hoisted(() => ({
  getUsersMock: vi.fn(),
  getFormsMock: vi.fn(),
  getFormSubmissionsMock: vi.fn(),
  getWebhookLogsMock: vi.fn(),
  getPaiedOrdersMock: vi.fn(),
  listSupportTicketsMock: vi.fn(),
}));

vi.mock("@/models/user", () => ({
  getUsers: dashboardMocks.getUsersMock,
}));

vi.mock("@/models/form", () => ({
  getForms: dashboardMocks.getFormsMock,
}));

vi.mock("@/models/form-submission", () => ({
  getFormSubmissions: dashboardMocks.getFormSubmissionsMock,
}));

vi.mock("@/models/webhook-log", () => ({
  getWebhookLogs: dashboardMocks.getWebhookLogsMock,
}));

vi.mock("@/models/order", () => ({
  getPaiedOrders: dashboardMocks.getPaiedOrdersMock,
}));

vi.mock("@/models/support-ticket", () => ({
  listSupportTickets: dashboardMocks.listSupportTicketsMock,
}));

describe("admin dashboard metrics", () => {
  afterEach(() => {
    vi.clearAllMocks();
    vi.useRealTimers();
  });

  it("aggregates MVP operational signals", async () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-05-25T12:00:00.000Z"));

    dashboardMocks.getUsersMock.mockResolvedValue([
      { uuid: "user_1", email: "a@test.com", created_at: "2026-05-25T08:00:00.000Z" },
      { uuid: "user_2", email: "b@test.com", created_at: "2026-05-25T09:00:00.000Z" },
    ]);
    dashboardMocks.getFormsMock.mockResolvedValue([
      { uuid: "form_1", title: "Draft", status: "draft", created_at: "2026-05-25T08:00:00.000Z" },
      { uuid: "form_2", title: "Published", status: "published", created_at: "2026-05-25T09:00:00.000Z" },
    ]);
    dashboardMocks.getFormSubmissionsMock.mockResolvedValue([
      { uuid: "sub_1", form_title: "Published", status: "submitted", created_at: "2026-05-25T09:10:00.000Z" },
    ]);
    dashboardMocks.getWebhookLogsMock.mockResolvedValue([
      { uuid: "wh_1", status: "completed", created_at: "2026-05-25T09:10:00.000Z" },
      { uuid: "wh_2", status: "failed", created_at: "2026-05-25T09:11:00.000Z" },
    ]);
    dashboardMocks.getPaiedOrdersMock.mockResolvedValue([
      { order_no: "order_1", amount: 1900, currency: "usd", created_at: "2026-05-25T09:12:00.000Z" },
    ]);
    dashboardMocks.listSupportTicketsMock.mockResolvedValue([
      { uuid: "ticket_1", title: "Help", status: "open", created_at: "2026-05-25T09:13:00.000Z" },
      { uuid: "ticket_2", title: "Done", status: "closed", created_at: "2026-05-25T09:14:00.000Z" },
    ]);

    const metrics = await getAdminDashboardMetrics();

    expect(metrics.totals).toMatchObject({
      users: 2,
      forms: 2,
      publishedForms: 1,
      submissions: 1,
      paidOrders: 1,
      revenueCents: 1900,
      webhookFailed: 1,
      openTickets: 1,
    });
    expect(metrics.sparklines?.users).toEqual([0, 0, 0, 0, 0, 0, 2]);
    expect(metrics.sparklines?.forms).toEqual([0, 0, 0, 0, 0, 0, 2]);
    expect(metrics.sparklines?.submissions).toEqual([0, 0, 0, 0, 0, 0, 1]);
    expect(metrics.recent.users[0].uuid).toBe("user_2");
    expect(metrics.recent.webhookFailures[0].uuid).toBe("wh_2");
  });

  it("formats revenue for admin display", () => {
    expect(formatRevenue(1900)).toBe("$19");
  });
});
