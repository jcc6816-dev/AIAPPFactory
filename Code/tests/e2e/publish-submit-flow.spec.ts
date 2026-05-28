import { expect, test } from "@playwright/test";

import { signInWithDevUser, testSchema } from "./helpers";

test.describe("published form collection loop", () => {
  test("publishes through the API, accepts a public submission, and shows it in data", async ({
    page,
    request,
  }, testInfo) => {
    test.setTimeout(90_000);
    test.skip(
      testInfo.project.name !== "chromium",
      "Stateful publish loop runs once to avoid duplicate dev data."
    );

    await signInWithDevUser(page);

    const marker = `Playwright Lead ${Date.now()}`;
    const createResponse = await page.request.post("/api/forms", {
      data: {
        title: marker,
        description: "Created by Playwright to verify the MVP publish loop.",
        theme: "business",
        status: "published",
        schema: testSchema(),
        generation: {
          source: "playwright",
          provider: "test",
          model: "e2e",
          prompt: "publish loop smoke test",
        },
      },
    });
    const createJson = await createResponse.json();
    expect(createJson.code).toBe(0);
    expect(createJson.data.status).toBe("published");
    expect(createJson.data.share_code).toBeTruthy();

    const submitResponse = await request.post(
      `/api/forms/${createJson.data.share_code}/submit`,
      {
        data: {
          answers: {
            full_name: marker,
            email: "lead@example.com",
            company: "AI FormFactory",
          },
          files: [],
        },
      }
    );
    const submitJson = await submitResponse.json();
    expect(submitJson.code).toBe(0);

    await page.goto(`/forms/${createJson.data.uuid}/submissions`);
    await expect(page.locator("tbody").getByText(marker)).toBeVisible();
    await expect(page.getByText("AI Data Co-pilot")).toBeVisible();

    await page.goto(`/forms/${createJson.data.uuid}/webhook-logs`);
    await expect(page.getByText("mock://webhook-endpoint")).toBeVisible();
    await expect(page.locator("tbody").getByText("200")).toBeVisible();
  });
});
