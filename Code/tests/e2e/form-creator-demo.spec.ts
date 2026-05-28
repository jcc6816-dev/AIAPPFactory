import { expect, test } from "@playwright/test";

import { signInWithDevUser } from "./helpers";

test.describe("form creator demo mode", () => {
  test("opens and closes a realistic demo preview", async ({ page }, testInfo) => {
    test.skip(
      testInfo.project.name !== "chromium",
      "Creator workspace smoke test runs on desktop only."
    );

    await signInWithDevUser(
      page,
      "/forms/new?template=lead-capture&theme=neon&visualDirection=creator-launch&themeVariant=gradient-flow&device=phone&layout=single"
    );

    await page.getByRole("button", { name: "JSON Schema" }).click();
    await expect(page.getByText('"visualDirection": "creator-launch"')).toBeVisible();
    await expect(page.getByText('"themeVariant": "gradient-flow"')).toBeVisible();
    await page.getByRole("button", { name: "Preview", exact: true }).click();

    await page.getByRole("button", { name: "Phone Preview" }).click();
    await page.getByRole("button", { name: "Step Flow", exact: true }).click();
    await page.getByRole("combobox", { name: "Direction" }).click();
    await page.getByRole("option", { name: "Creator Launch" }).click();

    await expect(page.getByRole("combobox", { name: "Visual FX" })).toBeVisible();
    await page.getByRole("combobox", { name: "Visual FX" }).click();
    await page.getByRole("option", { name: /Aurora Flow/ }).click();
    await page.getByRole("button", { name: "JSON Schema" }).click();
    await expect(page.getByText('"visualDirection": "creator-launch"')).toBeVisible();
    await expect(page.getByText('"themeVariant": "gradient-flow"')).toBeVisible();
    await expect(page.getByText('"preferredDevice": "phone"')).toBeVisible();
    await page.getByRole("button", { name: "Preview", exact: true }).click();

    await page.getByRole("button", { name: "Demo Mode" }).click();

    await expect(page.getByText("Demo Preview")).toBeVisible();
    await expect(page.getByText("Phone-sized live experience")).toBeVisible();
    await expect(page.locator(".fixed .w-\\[390px\\].h-\\[844px\\]")).toBeVisible();

    await page.getByRole("button", { name: "Close demo preview" }).click();
    await expect(page.getByText("Demo Preview")).toBeHidden();
  });
});
