import { describe, expect, it } from "vitest";

import { buildBillingPlanSummary } from "./billing";

describe("billing summary", () => {
  it("describes free users with free benefits", () => {
    const summary = buildBillingPlanSummary({
      paidOrders: [],
      leftCredits: 10,
    });

    expect(summary.planName).toBe("Free");
    expect(summary.isPaidUser).toBe(false);
    expect(summary.statusLabel).toBe("Free allowance");
    expect(summary.benefits).toContain("1 published form");
  });

  it("describes paid users from latest order", () => {
    const summary = buildBillingPlanSummary({
      leftCredits: 1000,
      paidOrders: [
        {
          order_no: "order_old",
          created_at: "2026-05-20T00:00:00.000Z",
          user_uuid: "user_1",
          user_email: "user@example.com",
          amount: 1900,
          interval: "month",
          expired_at: "2026-06-20T00:00:00.000Z",
          status: "paid",
          credits: 1000,
          currency: "usd",
        },
        {
          order_no: "order_new",
          created_at: "2026-05-25T00:00:00.000Z",
          user_uuid: "user_1",
          user_email: "user@example.com",
          amount: 1900,
          interval: "month",
          expired_at: "2026-06-25T00:00:00.000Z",
          status: "paid",
          credits: 1000,
          currency: "usd",
        },
      ],
    });

    expect(summary.planName).toBe("Pro");
    expect(summary.latestOrder?.order_no).toBe("order_new");
    expect(summary.renewalLabel).toContain("2026-06-25");
    expect(summary.benefits).toContain("Webhook delivery and retry logs");
  });
});
