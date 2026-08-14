import { expect, test } from "@playwright/test";

import { signInWithDevUser, testSchema } from "./helpers";

test.describe("first-success UI flow", () => {
  test("takes the homepage event prompt through publish, test submission, and results", async ({ page }, testInfo) => {
    test.setTimeout(90_000);
    test.skip(
      testInfo.project.name !== "chromium",
      "The stateful first-success flow runs once against the isolated candidate environment."
    );
    const pageErrors: string[] = [];
    page.on("pageerror", (error) => pageErrors.push(error.message));

    // Candidate and production must reject direct unauthenticated writes even
    // though the creation page itself is available for inspection.
    const unauthenticatedCreate = await page.request.post("/api/forms", {
      data: {
        title: "Unauthenticated candidate form",
        description: "must not persist",
        theme: "minimal",
        status: "draft",
        schema: testSchema(),
      },
    });
    expect(unauthenticatedCreate.status()).toBe(401);

    const unauthenticatedPublish = await page.request.patch("/api/forms/not-owned", {
      data: { status: "published" },
    });
    expect(unauthenticatedPublish.status()).toBe(401);

    // Start where a visitor starts. The regular homepage prompt must select the
    // event-registration context rather than dropping into an unrelated draft.
    await page.goto("/");
    const prompt = page.getByPlaceholder("e.g. Design an event signup form for a tech summit...");
    await expect(prompt).toBeVisible();
    await prompt.fill("Design an event signup form for a tech summit");
    await page.getByRole("button", { name: "Generate my form for free" }).click();
    await expect(page).toHaveURL(/\/forms\/new\?.*template=event-registration/);

    // External OAuth is not part of a deterministic candidate test. Establish
    // the approved local dev session, then continue on the exact creation URL.
    const creationPath = new URL(page.url()).pathname + new URL(page.url()).search;
    await signInWithDevUser(page, creationPath);
    await expect(page.getByTestId("creation-canvas")).toBeVisible();
    // The homepage passes autogenerate=1, so login recovery must land on the
    // generated draft directly. Waiting here avoids racing the generator and
    // prevents the test from masking a broken recovery by generating twice.
    await expect(
      page.getByRole("heading", { name: "Your draft is ready to publish" })
    ).toBeVisible({ timeout: 20_000 });

    // The creator must be able to make a small, truthful adjustment before
    // publishing. This protects against a generated draft that looks editable
    // but silently publishes its original content.
    await page.getByRole("button", { name: "Adjust form" }).click();
    await page.getByLabel("Form title").fill("Tech summit registration");
    await page.getByRole("button", { name: "Required" }).first().click();
    await page.keyboard.press("Escape");
    await expect(page.getByRole("heading", { name: "Tech summit registration" }).last()).toBeVisible();

    await page.getByRole("button", { name: "Publish and get link" }).click();
    await expect(page).toHaveURL(/\/forms\/[^/]+\/publish/);
    await expect(page.getByRole("heading", { name: "Next: complete a test" })).toBeVisible();
    await expect(page.getByText(/\/f\/share_/)).toBeVisible();
    await expect(page.getByRole("link", { name: "Open public form in a new window" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Copy public form link" })).toBeVisible();
    await expect(page.locator("aside img").first()).toBeVisible();

    // The action that starts TEST must remain immediately usable on a phone;
    // publishing a link is not the end of the first-success loop.
    await page.setViewportSize({ width: 390, height: 844 });
    await expect(page.getByRole("link", { name: "Start free form test" })).toBeVisible();
    await page.getByRole("link", { name: "Start free form test" }).click();
    await expect(page).toHaveURL(/\/forms\/[^/]+\/test/);
    await expect(page.getByText("Test mode:")).toBeVisible();
    await expect(page.locator('[data-test-primary="true"]')).toBeVisible();

    // A generated event form can contain text-like and single-choice fields.
    // Complete either visible control until the real TEST submission redirects
    // to the results panel. The cap protects against a stuck loop.
    let submitted = false;
    for (let step = 0; step < 8; step += 1) {
      const input = page.locator("input:not([type=hidden]), textarea").first();
      const choice = page.getByRole("button", { name: /Tap to continue/ }).first();
      const hasInput = await input.isVisible().catch(() => false);

      if (hasInput) {
        const type = await input.getAttribute("type");
        if (type === "file") {
          await input.setInputFiles({
            name: "candidate-test.txt",
            mimeType: "text/plain",
            buffer: Buffer.from("candidate test attachment"),
          });
        } else {
          await input.fill(
            type === "email"
              ? "qa@example.com"
              : type === "number"
                ? "2"
                : `Candidate user ${step + 1}`
          );
        }
      } else {
        await expect(choice).toBeVisible();
        await choice.click();
      }
      const primaryAction = page.locator('[data-test-primary="true"]');
      const actionText = await primaryAction.innerText();
      if (actionText.includes("Submit test response")) {
        await Promise.all([
          page.waitForURL(/\/forms\/[^/]+\/submissions\?submission=/),
          primaryAction.click(),
        ]);
        submitted = true;
        break;
      }
      await primaryAction.click();
      await page.waitForTimeout(180);
    }

    expect(submitted).toBe(true);
    await expect(page).toHaveURL(/\/forms\/[^/]+\/submissions\?submission=/);
    await expect(page.getByText("Your first test result is saved")).toBeVisible();
    await expect(page.getByText("Test").first()).toBeVisible();
    expect(pageErrors).toEqual([]);
  });
});
