import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { POST } from "./route";

const mocks = vi.hoisted(() => ({
  getUserUuid: vi.fn(),
  getUserEmail: vi.fn(),
  findUserByUuid: vi.fn(),
  insertOrder: vi.fn(),
  updateOrderSession: vi.fn(),
  createGrowthEventSafely: vi.fn(),
  getSnowId: vi.fn(),
  createCheckoutSession: vi.fn(),
}));

vi.mock("@/services/user", () => ({
  getUserUuid: mocks.getUserUuid,
  getUserEmail: mocks.getUserEmail,
}));
vi.mock("@/models/user", () => ({ findUserByUuid: mocks.findUserByUuid }));
vi.mock("@/models/order", () => ({
  insertOrder: mocks.insertOrder,
  updateOrderSession: mocks.updateOrderSession,
}));
vi.mock("@/models/growth-event", () => ({
  createGrowthEventSafely: mocks.createGrowthEventSafely,
}));
vi.mock("@/lib/hash", () => ({ getSnowId: mocks.getSnowId }));
vi.mock("stripe", () => {
  class MockStripe {
    checkout = { sessions: { create: mocks.createCheckoutSession } };
  }
  return { default: MockStripe };
});

function request(body: unknown) {
  return new Request("http://test.local/api/checkout", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  });
}

describe("checkout API", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.stubEnv("NEXT_PUBLIC_WEB_URL", "http://test.local");
    vi.stubEnv("STRIPE_PRIVATE_KEY", "sk_test_mock");
    mocks.getUserUuid.mockResolvedValue("user_1");
    mocks.getUserEmail.mockResolvedValue("user@example.com");
    mocks.getSnowId.mockReturnValue("order_1");
    mocks.createCheckoutSession.mockResolvedValue({ id: "cs_test_1" });
  });

  afterEach(() => vi.unstubAllEnvs());

  it("charges the catalog monthly amount even if browser values are tampered", async () => {
    const res = await POST(request({
      product_id: "premium",
      amount: 1,
      credits: 999999,
      currency: "cny",
      interval: "year",
      valid_months: 99,
      product_name: "Anything",
      locale: "zh",
    }));
    const json = await res.json();

    expect(json.code).toBe(0);
    expect(mocks.insertOrder).toHaveBeenCalledWith(expect.objectContaining({
      amount: 900,
      currency: "usd",
      interval: "month",
      valid_months: 1,
      credits: 1000,
      product_name: "GenForms.ai Pro Monthly",
    }));
    expect(mocks.createCheckoutSession).toHaveBeenCalledWith(expect.objectContaining({
      line_items: [expect.objectContaining({
        price_data: expect.objectContaining({
          currency: "usd",
          unit_amount: 900,
          recurring: { interval: "month" },
        }),
      })],
      success_url: "http://test.local/zh/pay-success/{CHECKOUT_SESSION_ID}",
      cancel_url: "http://test.local/zh/pay-cancel",
    }));
  });

  it("uses the catalog yearly plan", async () => {
    const res = await POST(request({ product_id: "premium_yearly", locale: "en" }));
    const json = await res.json();

    expect(json.code).toBe(0);
    expect(mocks.insertOrder).toHaveBeenCalledWith(expect.objectContaining({
      amount: 9000,
      interval: "year",
      valid_months: 12,
    }));
  });

  it("rejects arbitrary product ids before creating an order", async () => {
    const res = await POST(request({ product_id: "free" }));
    const json = await res.json();

    expect(json.code).toBe(-1);
    expect(json.message).toBe("invalid params");
    expect(mocks.insertOrder).not.toHaveBeenCalled();
  });
});
