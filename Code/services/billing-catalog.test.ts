import { describe, expect, it } from "vitest";
import { getBillingPlan } from "./billing-catalog";

describe("billing catalog", () => {
  it("returns the permanent $9 monthly Pro plan", () => {
    expect(getBillingPlan("premium")).toMatchObject({
      amount: 900,
      currency: "usd",
      interval: "month",
      valid_months: 1,
      credits: 1000,
    });
  });

  it("returns the $90 yearly Pro plan", () => {
    expect(getBillingPlan("premium_yearly")).toMatchObject({
      amount: 9000,
      currency: "usd",
      interval: "year",
      valid_months: 12,
      credits: 12000,
    });
  });

  it("does not expose free, business, or arbitrary browser product ids as purchasable", () => {
    expect(getBillingPlan("free")).toBeNull();
    expect(getBillingPlan("business")).toBeNull();
    expect(getBillingPlan("premium_custom")).toBeNull();
  });
});
