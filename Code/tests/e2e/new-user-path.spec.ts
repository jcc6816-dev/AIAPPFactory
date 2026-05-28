import { expect, test } from "@playwright/test";

test.describe("new user acquisition path", () => {
  test("connects homepage, template gallery, template detail, and protected creation", async ({
    page,
  }) => {
    await page.goto("/");
    await expect(
      page.getByRole("heading", {
        name: "Generate publishable data-collection scenarios with AI and templates",
      })
    ).toBeVisible();

    await page.goto("/templates");
    await expect(page.getByText("Template Gallery")).toBeVisible();
    await expect(page.getByRole("link", { name: "View Details" }).first()).toBeVisible();

    await page.goto("/templates/lead-capture");
    await expect(page.getByRole("link", { name: "Use This Template" })).toBeVisible();
    await expect(page.locator(".aiff-phone-preview-frame")).toBeVisible();

    await page.getByRole("link", { name: "Use This Template" }).click();
    await expect(page).toHaveURL(/\/auth\/signin/);
    await expect(page.getByText("Development Sign In")).toBeVisible();
  });
});
