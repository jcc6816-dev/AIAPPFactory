import { expect, test } from "@playwright/test";

import { signInWithDevUser } from "./helpers";

test.describe("workspace onboarding", () => {
  test("shows a first-run activation path for a new user", async ({ page }) => {
    await signInWithDevUser(page, "/forms");

    await expect(page.getByRole("heading", { name: "Create your first form" })).toBeVisible();
    await expect(page.getByRole("link", { name: "New form" })).toBeVisible();
    await expect(page.getByText("Start here", { exact: true })).toBeVisible();
    await expect(
      page.getByRole("heading", { name: "Choose a template close to your need" })
    ).toBeVisible();
    await expect(page.getByRole("link", { name: "Generate with one sentence" })).toBeVisible();
  });
});
