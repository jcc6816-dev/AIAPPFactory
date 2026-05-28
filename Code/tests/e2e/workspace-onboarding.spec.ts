import { expect, test } from "@playwright/test";

import { signInWithDevUser } from "./helpers";

test.describe("workspace onboarding", () => {
  test("shows a first-run activation path for a new user", async ({ page }) => {
    await signInWithDevUser(page, "/forms");

    await expect(page.getByText("First Run Path")).toBeVisible();
    await expect(page.getByRole("link", { name: "Start From Templates" }).first()).toBeVisible();
    await expect(page.getByRole("link", { name: "Generate From Prompt" })).toBeVisible();
    await expect(page.getByText("Pick Template")).toBeVisible();
    await expect(page.getByRole("heading", { name: "Publish", exact: true })).toBeVisible();
  });
});
