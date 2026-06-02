export type DeploymentHealthStatus = "pass" | "warn" | "fail";

export interface DeploymentHealthCheck {
  key: string;
  label: string;
  description: string;
  status: DeploymentHealthStatus;
  detail: string;
}

export interface DeploymentHealthSection {
  key: string;
  title: string;
  checks: DeploymentHealthCheck[];
}

function hasValue(name: string) {
  return Boolean(process.env[name]?.trim());
}

function isEnabled(name: string) {
  return process.env[name] === "true";
}

function envCheck(input: {
  key: string;
  label: string;
  description: string;
  envs: string[];
  optional?: boolean;
  detail?: string;
}): DeploymentHealthCheck {
  const missing = input.envs.filter((name) => !hasValue(name));
  const ok = missing.length === 0;

  return {
    key: input.key,
    label: input.label,
    description: input.description,
    status: ok ? "pass" : input.optional ? "warn" : "fail",
    detail: ok
      ? input.detail || "Configured"
      : `Missing: ${missing.join(", ")}`,
  };
}

function authProviderCheck(): DeploymentHealthCheck {
  const googleReady =
    isEnabled("NEXT_PUBLIC_AUTH_GOOGLE_ENABLED") &&
    hasValue("AUTH_GOOGLE_ID") &&
    hasValue("AUTH_GOOGLE_SECRET");
  const githubReady =
    isEnabled("NEXT_PUBLIC_AUTH_GITHUB_ENABLED") &&
    hasValue("AUTH_GITHUB_ID") &&
    hasValue("AUTH_GITHUB_SECRET");
  const devEnabled = isEnabled("AUTH_DEV_ENABLED");

  return {
    key: "auth-provider",
    label: "Production Auth Provider",
    description: "At least one production OAuth provider should be ready.",
    status: googleReady || githubReady ? "pass" : devEnabled ? "warn" : "fail",
    detail: googleReady || githubReady
      ? "OAuth provider configured"
      : devEnabled
        ? "Only development login is enabled"
        : "No OAuth provider configured",
  };
}

function webUrlCheck(): DeploymentHealthCheck {
  const url = process.env.NEXT_PUBLIC_WEB_URL || "";
  const isLocal = /localhost|127\.0\.0\.1/.test(url);

  return {
    key: "web-url",
    label: "Public Web URL",
    description: "Used for share links, SEO canonical URLs, checkout redirects, and webhooks.",
    status: url && !isLocal ? "pass" : url ? "warn" : "fail",
    detail: url ? (isLocal ? "Localhost URL configured" : "Public URL configured") : "Missing NEXT_PUBLIC_WEB_URL",
  };
}

export function getDeploymentHealthSections(): DeploymentHealthSection[] {
  return [
    {
      key: "core",
      title: "Core Runtime",
      checks: [
        webUrlCheck(),
        envCheck({
          key: "auth-secret",
          label: "Auth Secret",
          description: "Required by NextAuth session signing.",
          envs: ["AUTH_SECRET"],
        }),
        envCheck({
          key: "admin-emails",
          label: "Admin Emails",
          description: "Controls access to the admin console.",
          envs: ["ADMIN_EMAILS"],
        }),
      ],
    },
    {
      key: "data",
      title: "Data Storage",
      checks: [
        envCheck({
          key: "supabase",
          label: "Supabase",
          description: "Required for production users, forms, submissions, orders, and support tickets.",
          envs: ["SUPABASE_URL", "SUPABASE_SERVICE_ROLE_KEY"],
        }),
      ],
    },
    {
      key: "auth",
      title: "Authentication",
      checks: [
        authProviderCheck(),
        {
          key: "dev-login",
          label: "Development Login",
          description: "Should be disabled in production.",
          status: isEnabled("AUTH_DEV_ENABLED") ? "warn" : "pass",
          detail: isEnabled("AUTH_DEV_ENABLED")
            ? "Development login is enabled"
            : "Development login disabled",
        },
      ],
    },
    {
      key: "billing",
      title: "Billing",
      checks: [
        envCheck({
          key: "stripe-api-keys",
          label: "Stripe API Keys",
          description: "Required for initializing checkout sessions.",
          envs: ["STRIPE_PUBLIC_KEY", "STRIPE_PRIVATE_KEY"],
        }),
        envCheck({
          key: "stripe-webhook-secret",
          label: "Stripe Webhook Secret",
          description: "Required for verifying incoming webhook events (checkout.session.completed, etc.).",
          envs: ["STRIPE_WEBHOOK_SECRET"],
          optional: true,
        }),
        envCheck({
          key: "payment-redirects",
          label: "Payment Redirect URLs",
          description: "Success, failure, and cancellation routes should be configured.",
          envs: [
            "NEXT_PUBLIC_PAY_SUCCESS_URL",
            "NEXT_PUBLIC_PAY_FAIL_URL",
            "NEXT_PUBLIC_PAY_CANCEL_URL",
          ],
        }),
      ],
    },
    {
      key: "ai",
      title: "AI & OCR",
      checks: [
        {
          key: "llm-provider",
          label: "LLM Provider",
          description: "At least one generation provider should be configured.",
          status: hasValue("OPENAI_API_KEY") || hasValue("DEEPSEEK_API_KEY") ? "pass" : "warn",
          detail:
            hasValue("OPENAI_API_KEY") || hasValue("DEEPSEEK_API_KEY")
              ? "Generation provider configured"
              : "No LLM API key configured; fallback generation may be used",
        },
        {
          key: "ocr-provider",
          label: "OCR Provider",
          description: "Optional for MVP unless OCR templates are promoted as a paid capability.",
          status:
            hasValue("BAIDU_OCR_API_KEY") ||
            hasValue("BAIDU_OCR_SECRET_KEY") ||
            hasValue("GOOGLE_VISION_API_KEY")
              ? "pass"
              : "warn",
          detail:
            hasValue("BAIDU_OCR_API_KEY") ||
            hasValue("BAIDU_OCR_SECRET_KEY") ||
            hasValue("GOOGLE_VISION_API_KEY")
              ? "OCR provider configured"
              : "No OCR provider configured",
        },
      ],
    },
  ];
}

export function summarizeDeploymentHealth(sections: DeploymentHealthSection[]) {
  const checks = sections.flatMap((section) => section.checks);
  return {
    total: checks.length,
    pass: checks.filter((check) => check.status === "pass").length,
    warn: checks.filter((check) => check.status === "warn").length,
    fail: checks.filter((check) => check.status === "fail").length,
  };
}
