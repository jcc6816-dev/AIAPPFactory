import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { GET } from "./route";

const userMocks = vi.hoisted(() => ({
  getUserUuidMock: vi.fn(),
  getUserEmailMock: vi.fn(),
}));

const mockList = vi.fn();
const mockPortalCreate = vi.fn();

// Mock Stripe SDK using class constructor syntax
vi.mock("stripe", () => {
  class MockStripe {
    customers = {
      list: mockList,
    };
    billingPortal = {
      sessions: {
        create: mockPortalCreate,
      },
    };
  }
  return {
    default: MockStripe,
  };
});

// Mock User Service
vi.mock("@/services/user", () => ({
  getUserUuid: userMocks.getUserUuidMock,
  getUserEmail: userMocks.getUserEmailMock,
}));

function getRequest(url = "http://test.local/api/billing/portal?locale=en") {
  return new Request(url, {
    method: "GET",
  });
}

describe("billing portal redirect API", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.stubEnv("STRIPE_PRIVATE_KEY", "sk_test_mock");
    vi.stubEnv("NEXT_PUBLIC_WEB_URL", "http://test.local");
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("redirects unauthenticated users to the signin page", async () => {
    userMocks.getUserUuidMock.mockResolvedValue("");

    const res = await GET(getRequest());
    
    expect(res.status).toBe(302);
    expect(res.headers.get("location")).toBe("http://test.local/en/auth/signin");
  });

  it("redirects users with no Stripe customer history back to settings with error query", async () => {
    userMocks.getUserUuidMock.mockResolvedValue("user_123");
    userMocks.getUserEmailMock.mockResolvedValue("no-customer@example.com");
    mockList.mockResolvedValue({ data: [] });

    const res = await GET(getRequest());

    expect(res.status).toBe(302);
    expect(res.headers.get("location")).toBe("http://test.local/en/settings?error=no_billing_history");
  });

  it("creates billing portal session and redirects paid subscribers successfully", async () => {
    userMocks.getUserUuidMock.mockResolvedValue("user_456");
    userMocks.getUserEmailMock.mockResolvedValue("customer@example.com");
    mockList.mockResolvedValue({ data: [{ id: "cus_mock_123" }] });
    mockPortalCreate.mockResolvedValue({ url: "https://billing.stripe.com/p/session/mock_456" });

    const res = await GET(getRequest("http://test.local/api/billing/portal?locale=zh"));

    expect(mockList).toHaveBeenCalledWith({ email: "customer@example.com", limit: 1 });
    expect(mockPortalCreate).toHaveBeenCalledWith({
      customer: "cus_mock_123",
      return_url: "http://test.local/zh/settings",
    });
    expect(res.status).toBe(302);
    expect(res.headers.get("location")).toBe("https://billing.stripe.com/p/session/mock_456");
  });
});
