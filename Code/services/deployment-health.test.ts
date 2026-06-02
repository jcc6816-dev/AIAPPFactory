import { afterEach, describe, expect, it, vi } from "vitest";

import {
  getDeploymentHealthSections,
  summarizeDeploymentHealth,
} from "./deployment-health";

describe("deployment health", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("flags missing production essentials", () => {
    vi.stubEnv("NEXT_PUBLIC_WEB_URL", "http://localhost:3000");
    vi.stubEnv("AUTH_SECRET", "");
    vi.stubEnv("ADMIN_EMAILS", "");
    vi.stubEnv("SUPABASE_URL", "");
    vi.stubEnv("SUPABASE_SERVICE_ROLE_KEY", "");

    const summary = summarizeDeploymentHealth(getDeploymentHealthSections());

    expect(summary.fail).toBeGreaterThan(0);
    expect(summary.warn).toBeGreaterThan(0);
  });

  it("passes core checks when production values are present", () => {
    vi.stubEnv("NEXT_PUBLIC_WEB_URL", "https://genforms.ai");
    vi.stubEnv("AUTH_SECRET", "secret");
    vi.stubEnv("ADMIN_EMAILS", "admin@example.com");
    vi.stubEnv("SUPABASE_URL", "https://example.supabase.co");
    vi.stubEnv("SUPABASE_SERVICE_ROLE_KEY", "service-role");
    vi.stubEnv("NEXT_PUBLIC_AUTH_GOOGLE_ENABLED", "true");
    vi.stubEnv("AUTH_GOOGLE_ID", "google-id");
    vi.stubEnv("AUTH_GOOGLE_SECRET", "google-secret");
    vi.stubEnv("AUTH_DEV_ENABLED", "false");
    vi.stubEnv("STRIPE_PUBLIC_KEY", "pk_test");
    vi.stubEnv("STRIPE_PRIVATE_KEY", "sk_test");
    vi.stubEnv("STRIPE_WEBHOOK_SECRET", "whsec_test");
    vi.stubEnv("NEXT_PUBLIC_PAY_SUCCESS_URL", "https://genforms.ai/settings");
    vi.stubEnv("NEXT_PUBLIC_PAY_FAIL_URL", "https://genforms.ai/pay-failed");
    vi.stubEnv("NEXT_PUBLIC_PAY_CANCEL_URL", "https://genforms.ai/pay-cancel");

    const sections = getDeploymentHealthSections();
    const failedRequired = sections
      .flatMap((section) => section.checks)
      .filter((check) => check.status === "fail");

    expect(failedRequired).toHaveLength(0);
  });
});
