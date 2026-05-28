import { expect, test } from "@playwright/test";

test.describe("template detail preview", () => {
  test("switches device, flow, and theme controls", async ({ page }) => {
    await page.goto("/templates/lead-capture");

    await expect(
      page.getByText("Interactive High-Fidelity Preview")
    ).toBeVisible();
    await expect(page.locator(".aiff-phone-preview-frame")).toBeVisible();

    await page.getByRole("button", { name: "Desktop" }).click();
    await expect(page.locator(".aiff-desktop-preview-frame")).toBeVisible();

    await page.getByRole("button", { name: "Long Form" }).click();
    await expect(page.getByRole("button", { name: "Long Form" })).toHaveClass(
      /bg-emerald-500/
    );

    await page.getByRole("button", { name: "Step Flow" }).click();
    await expect(page.getByRole("button", { name: "Step Flow" })).toHaveClass(
      /bg-emerald-500/
    );

    await page.getByRole("combobox", { name: "Theme" }).click();
    await page.getByRole("option", { name: /Dark/ }).click();
    await expect(page.getByRole("combobox", { name: "Theme" })).toContainText(
      /Dark/
    );

    await page.getByRole("combobox", { name: "Direction" }).click();
    await page.getByRole("option", { name: /Creator Launch/ }).click();
    await expect(
      page.getByRole("combobox", { name: "Visual FX" })
    ).toContainText(/Aurora Flow/);
    await expect
      .poll(async () =>
        page.evaluate(() =>
          window.sessionStorage.getItem(
            "aiff-template-preferences:lead-capture"
          )
        )
      )
      .toContain("creator-launch");

    await expect(page.getByRole("link", { name: "Use This Template" })).toHaveAttribute(
      "href",
      /template=lead-capture.*theme=neon.*visualDirection=creator-launch.*themeVariant=gradient-flow.*device=phone.*layout=single/
    );
  });
});
