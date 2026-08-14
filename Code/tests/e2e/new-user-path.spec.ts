import { expect, test } from "@playwright/test";

import { signInWithDevUser } from "./helpers";

test.describe("new user acquisition path", () => {
  test("connects homepage, template gallery, template detail, and guest creation", async ({
    page,
  }) => {
    await page.goto("/");
    await expect(
      page.getByRole("heading", {
        name: "Generate a form in one sentence, then publish it",
      })
    ).toBeVisible();

    await page.goto("/templates");
    await expect(page.getByText("Template Gallery")).toBeVisible();
    await expect(page.getByRole("link", { name: "View Details" }).first()).toBeVisible();

    await page.goto("/templates/lead-capture");
    await expect(
      page.getByRole("link", { name: "Use the lead capture template" })
    ).toBeVisible();
    await expect(page.locator(".aiff-phone-preview-frame")).toBeVisible();

    await page.getByRole("link", { name: "Use the lead capture template" }).click();
    await expect(page).toHaveURL(/\/forms\/new\?.*template=lead-capture/);
    await expect(page.getByTestId("creation-canvas")).toBeVisible();
  });

  test("starts a gallery template without leaving the user at an empty prompt", async ({
    page,
  }, testInfo) => {
    test.skip(
      testInfo.project.name !== "chromium",
      "The stateful template start runs once against the isolated candidate environment."
    );

    await page.goto("/templates");
    await page.getByRole("link", { name: "Use This Template" }).first().click();
    await expect(page).toHaveURL(/\/forms\/new\?template=.*autogenerate=1/);

    const creationPath = new URL(page.url()).pathname + new URL(page.url()).search;
    await signInWithDevUser(page, creationPath);
    await expect(page.getByRole("heading", { name: "Your draft is ready to publish" })).toBeVisible({
      timeout: 20_000,
    });
  });
});
