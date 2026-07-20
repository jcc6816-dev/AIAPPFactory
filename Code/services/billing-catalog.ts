export type BillingPlan = {
  product_id: "premium" | "premium_yearly";
  product_name: string;
  amount: number;
  currency: "usd";
  credits: number;
  interval: "month" | "year";
  valid_months: number;
};

// Checkout requests originate in the browser, so the browser must never set
// a charge amount, credits, or billing interval. This is the single source of
// truth for purchasable plans.
const BILLING_CATALOG: Record<BillingPlan["product_id"], BillingPlan> = {
  premium: {
    product_id: "premium",
    product_name: "GenForms.ai Pro Monthly",
    amount: 900,
    currency: "usd",
    credits: 1000,
    interval: "month",
    valid_months: 1,
  },
  premium_yearly: {
    product_id: "premium_yearly",
    product_name: "GenForms.ai Pro Yearly",
    amount: 9000,
    currency: "usd",
    credits: 12000,
    interval: "year",
    valid_months: 12,
  },
};

export function getBillingPlan(productId: unknown): BillingPlan | null {
  if (typeof productId !== "string") {
    return null;
  }

  return BILLING_CATALOG[productId as BillingPlan["product_id"]] || null;
}
