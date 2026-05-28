import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import { handleOrderSession, handleInvoicePaymentSucceeded, handleSubscriptionDeleted } from "./order";
import * as orderModel from "@/models/order";
import * as creditService from "./credit";
import * as affiliateService from "./affiliate";

const mockRetrieve = vi.fn();

// Mock Stripe SDK using class constructor syntax
vi.mock("stripe", () => {
  class MockStripe {
    subscriptions = {
      retrieve: mockRetrieve,
    };
  }
  return {
    default: MockStripe,
  };
});

// Mock Models & Services
vi.mock("@/models/order", () => ({
  findOrderByOrderNo: vi.fn(),
  updateOrderStatus: vi.fn(),
  updateOrderSubscription: vi.fn(),
  findOrderBySubId: vi.fn(),
}));

vi.mock("./credit", () => ({
  updateCreditForOrder: vi.fn(),
}));

vi.mock("./affiliate", () => ({
  updateAffiliateForOrder: vi.fn(),
}));

describe("Stripe Webhook & Subscriptions Lifecycle", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.stubEnv("STRIPE_PRIVATE_KEY", "sk_test_mock");
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("handles checkout.session.completed for non-subscription products", async () => {
    const session = {
      id: "cs_test_1",
      payment_status: "paid",
      mode: "payment",
      metadata: { order_no: "order_123" },
      customer_details: { email: "customer@example.com" },
    };

    const mockOrder = {
      order_no: "order_123",
      status: "created",
      credits: 100,
      user_uuid: "user_uuid_1",
    };

    vi.spyOn(orderModel, "findOrderByOrderNo").mockResolvedValue(mockOrder as any);
    const updateSpy = vi.spyOn(orderModel, "updateOrderStatus").mockResolvedValue({} as any);
    const creditSpy = vi.spyOn(creditService, "updateCreditForOrder").mockResolvedValue(undefined as any);
    const affiliateSpy = vi.spyOn(affiliateService, "updateAffiliateForOrder").mockResolvedValue(undefined as any);

    await handleOrderSession(session as any);

    expect(updateSpy).toHaveBeenCalledWith("order_123", "paid", expect.any(String), "customer@example.com", JSON.stringify(session));
    expect(creditSpy).toHaveBeenCalledWith(mockOrder);
    expect(affiliateSpy).toHaveBeenCalledWith(mockOrder);
  });

  it("handles checkout.session.completed and initiates subscription lifecycle parameters", async () => {
    const session = {
      id: "cs_test_2",
      payment_status: "paid",
      mode: "subscription",
      subscription: "sub_1",
      metadata: { order_no: "order_sub_123" },
      customer_details: { email: "sub@example.com" },
    };

    const mockOrder = {
      order_no: "order_sub_123",
      status: "created",
      credits: 0,
      user_uuid: "user_uuid_2",
    };

    const mockSub = {
      id: "sub_1",
      billing_cycle_anchor: 1234567,
      current_period_start: 1234500,
      current_period_end: 1234900,
      items: {
        data: [{ plan: { interval_count: 1 } }],
      },
    };

    vi.spyOn(orderModel, "findOrderByOrderNo").mockResolvedValue(mockOrder as any);
    const subSpy = vi.spyOn(orderModel, "updateOrderSubscription").mockResolvedValue({} as any);
    mockRetrieve.mockResolvedValue(mockSub);

    await handleOrderSession(session as any);

    expect(mockRetrieve).toHaveBeenCalledWith("sub_1");
    expect(subSpy).toHaveBeenCalledWith(
      "order_sub_123",
      "sub_1",
      1,
      1234567,
      1234900,
      1234500,
      "paid",
      expect.any(String),
      1,
      "sub@example.com",
      JSON.stringify(session)
    );
  });

  it("processes invoice.payment_succeeded for active subscription cycle renewals", async () => {
    const invoice = {
      id: "in_1",
      subscription: "sub_1",
      customer_email: "renew@example.com",
    };

    const mockOrder = {
      order_no: "order_sub_123",
      status: "paid",
      sub_times: 1,
      sub_interval_count: 1,
    };

    const mockSub = {
      id: "sub_1",
      billing_cycle_anchor: 1234567,
      current_period_start: 1234900,
      current_period_end: 1235300,
      items: {
        data: [{ plan: { interval_count: 1 } }],
      },
    };

    vi.spyOn(orderModel, "findOrderBySubId").mockResolvedValue(mockOrder as any);
    const subSpy = vi.spyOn(orderModel, "updateOrderSubscription").mockResolvedValue({} as any);
    mockRetrieve.mockResolvedValue(mockSub);

    await handleInvoicePaymentSucceeded(invoice as any);

    expect(mockRetrieve).toHaveBeenCalledWith("sub_1");
    expect(subSpy).toHaveBeenCalledWith(
      "order_sub_123",
      "sub_1",
      1,
      1234567,
      1235300,
      1234900,
      "paid",
      expect.any(String),
      2, // increment times
      "renew@example.com",
      JSON.stringify(invoice)
    );
  });

  it("downgrades and marks subscription orders as expired when user cancels subscription", async () => {
    const mockSub = {
      id: "sub_1",
    };

    const mockOrder = {
      order_no: "order_sub_123",
      status: "paid",
      paid_at: "2026-05-25T00:00:00.000Z",
      paid_email: "sub@example.com",
    };

    vi.spyOn(orderModel, "findOrderBySubId").mockResolvedValue(mockOrder as any);
    const statusSpy = vi.spyOn(orderModel, "updateOrderStatus").mockResolvedValue({} as any);

    await handleSubscriptionDeleted(mockSub as any);

    expect(statusSpy).toHaveBeenCalledWith(
      "order_sub_123",
      "expired",
      "2026-05-25T00:00:00.000Z",
      "sub@example.com",
      JSON.stringify(mockSub)
    );
  });
});
