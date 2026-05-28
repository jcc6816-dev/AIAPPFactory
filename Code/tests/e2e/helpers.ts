import { expect, type Page } from "@playwright/test";

export async function signInWithDevUser(page: Page, targetPath = "/forms/new") {
  await page.goto("/forms/new");

  if (!page.url().includes("/auth/signin")) {
    await page.goto(targetPath);
    await expect(
      page.getByText(/New Form Scenario|Scenario:|My Scenes|我的场景/)
    ).toBeVisible();
    return;
  }

  const csrfResponse = await page.request.get("/api/auth/csrf");
  const { csrfToken } = await csrfResponse.json();
  await page.request.post("/api/auth/callback/dev-login", {
    form: {
      csrfToken,
      email: `playwright-${Date.now()}@local.aifactory`,
      callbackUrl: "/forms",
      json: "true",
    },
  });

  await page.goto(targetPath);
  await expect(
    page.getByText(/New Form Scenario|Scenario:|My Scenes|我的场景/)
  ).toBeVisible();
}

export function testSchema() {
  return {
    layout: "single",
    fields: [
      {
        key: "full_name",
        label: "Full name",
        type: "text",
        required: true,
        placeholder: "Ada Lovelace",
      },
      {
        key: "email",
        label: "Email",
        type: "email",
        required: true,
        placeholder: "ada@example.com",
      },
      {
        key: "company",
        label: "Company",
        type: "text",
        required: false,
        placeholder: "Analytical Engines Ltd",
      },
    ],
  };
}
