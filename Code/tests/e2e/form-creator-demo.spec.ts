import { expect, test } from "@playwright/test";

import { signInWithDevUser } from "./helpers";

test.describe("form creator focused preview", () => {
  test("switches the approved creation canvas between phone and desktop", async ({ page }, testInfo) => {
    test.skip(
      testInfo.project.name !== "chromium",
      "Creator workspace smoke test runs on desktop only."
    );

    await signInWithDevUser(
      page,
      "/forms/new?template=lead-capture"
    );

    await expect(page.getByTestId("creation-canvas")).toBeVisible();
    await page.getByRole("button", { name: "Phone" }).click();
    await expect(page.getByTestId("phone-form-preview")).toBeVisible();

    await page.getByRole("button", { name: "Desktop" }).click();
    await expect(page.getByTestId("desktop-form-preview")).toBeVisible();
  });
});
