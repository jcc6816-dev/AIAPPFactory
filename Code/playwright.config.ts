import { defineConfig, devices } from "@playwright/test";

const PORT = Number(process.env.PLAYWRIGHT_PORT || 3100);
const BASE_URL = `http://localhost:${PORT}`;

export default defineConfig({
  testDir: "./tests/e2e",
  timeout: 45_000,
  expect: {
    timeout: 10_000,
  },
  fullyParallel: false,
  workers: 1,
  retries: process.env.CI ? 2 : 0,
  reporter: process.env.CI ? "github" : "list",
  use: {
    baseURL: BASE_URL,
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
  },
  webServer: process.env.PLAYWRIGHT_SKIP_WEBSERVER === "1" ? undefined : {
    command: `NEXT_PUBLIC_WEB_URL=${BASE_URL} AUTH_URL=${BASE_URL} NEXTAUTH_URL=${BASE_URL} AUTH_TRUST_HOST=true AUTH_SECRET=aiff-playwright-secret AUTH_DEV_ENABLED=true NEXT_PUBLIC_AUTH_DEV_ENABLED=true NEXT_PUBLIC_AUTH_DEV_EMAIL=playwright@local.aifactory ./node_modules/.bin/next dev --hostname localhost --port ${PORT}`,
    url: `${BASE_URL}/templates`,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"], viewport: { width: 1440, height: 960 } },
    },
    {
      name: "mobile",
      use: {
        ...devices["Pixel 5"],
        browserName: "chromium",
      },
    },
  ],
});
