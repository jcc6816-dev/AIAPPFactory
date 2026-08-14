import { expect, test, type Page } from "@playwright/test";

import { signInWithDevUser } from "./helpers";

async function expectNoHorizontalOverflow(page: Page) {
  await expect
    .poll(() =>
      page.evaluate(
        () => document.documentElement.scrollWidth <= document.documentElement.clientWidth
      )
    )
    .toBe(true);
}

async function expectPhonePreviewHasSafeBounds(page: Page) {
  const switchBox = await page.getByTestId("preview-device-switch").boundingBox();
  const canvasBox = await page.getByTestId("creation-canvas").boundingBox();
  const phoneBox = await page
    .getByTestId("creation-canvas")
    .locator("article")
    .boundingBox();

  expect(switchBox).not.toBeNull();
  expect(phoneBox).not.toBeNull();
  expect(canvasBox).not.toBeNull();

  if (!switchBox || !phoneBox || !canvasBox) return;

  // Phone 预览必须紧随设备切换器，不被底部裁切，也不能贴边。
  expect(phoneBox.y).toBeGreaterThanOrEqual(switchBox.y + switchBox.height);
  expect(phoneBox.y - (switchBox.y + switchBox.height)).toBeLessThanOrEqual(56);
  expect(canvasBox.y + canvasBox.height - (phoneBox.y + phoneBox.height)).toBeGreaterThanOrEqual(16);
  // Keep a portrait device silhouette. A wide, short rectangle reads as a card,
  // not as a phone, on 1366×768 laptop viewports.
  expect(phoneBox.height / phoneBox.width).toBeGreaterThanOrEqual(1.7);

  const phoneTitle = page.getByTestId("phone-form-preview").getByRole("heading");
  await expect.poll(() => phoneTitle.evaluate((element) => element.scrollHeight <= element.clientHeight + 1)).toBe(true);
}

async function expectPreviewPrimaryActionVisible(page: Page, device: "phone" | "desktop") {
  const preview = page.getByTestId(
    device === "phone" ? "phone-form-preview" : "desktop-form-preview"
  );
  const action = preview.getByRole("button", { name: /Preview next question|预览下一题/ });
  const viewport = page.viewportSize();
  const actionBox = await action.boundingBox();

  expect(actionBox).not.toBeNull();
  expect(viewport).not.toBeNull();
  if (!actionBox || !viewport) return;

  expect(actionBox.y).toBeGreaterThanOrEqual(0);
  expect(actionBox.y + actionBox.height).toBeLessThanOrEqual(viewport.height);
}

async function expectDesktopPreviewHasBottomBoundary(page: Page) {
  const canvasBox = await page.getByTestId("creation-canvas").boundingBox();
  const desktopBox = await page.getByTestId("desktop-form-preview").boundingBox();

  expect(canvasBox).not.toBeNull();
  expect(desktopBox).not.toBeNull();
  if (!canvasBox || !desktopBox) return;

  // Desktop is a full-page preview, but it still needs a visible bottom edge
  // rather than appearing to run into the browser viewport.
  expect(canvasBox.y + canvasBox.height - (desktopBox.y + desktopBox.height)).toBeGreaterThanOrEqual(16);
}

async function expectVisibleInViewport(page: Page, locator: ReturnType<Page["getByRole"]>) {
  await locator.scrollIntoViewIfNeeded();
  const viewport = page.viewportSize();
  const box = await locator.boundingBox();
  expect(viewport).not.toBeNull();
  expect(box).not.toBeNull();
  if (!viewport || !box) return;
  expect(box.y).toBeGreaterThanOrEqual(0);
  expect(box.y + box.height).toBeLessThanOrEqual(viewport.height);
}

async function expectPreviewVisibleBesideAdjustmentPanel(page: Page) {
  const panelBox = await page.getByTestId("form-adjustment-panel").boundingBox();
  const previewBox = await page.getByTestId("phone-form-preview").boundingBox();
  expect(panelBox).not.toBeNull();
  expect(previewBox).not.toBeNull();
  if (!panelBox || !previewBox) return;

  // On desktop the editing sheet stays on the creator side, so the respondent
  // preview remains visible for immediate before/after confirmation.
  expect(panelBox.x + panelBox.width).toBeLessThanOrEqual(previewBox.x);
}

test.describe("creator visual quality gates", () => {
  test("keeps a template's selected device, title, and baseline fields after first generation", async ({
    page,
  }, testInfo) => {
    test.skip(
      testInfo.project.name !== "chromium",
      "The gate runs once against the isolated candidate environment."
    );
    test.setTimeout(90_000);

    await page.setViewportSize({ width: 1366, height: 768 });
    await signInWithDevUser(page, "/zh/forms/new?template=event-registration");
    await page.getByRole("button", { name: "手机预览" }).click();
    await page.getByRole("button", { name: "生成表单" }).click();

    await expect(
      page.getByRole("heading", { name: /表单.*已经准备好了/ })
    ).toBeVisible({ timeout: 20_000 });
    await expect(page.getByTestId("phone-form-preview")).toBeVisible();
    await expect(page.getByRole("heading", { name: "活动报名表" }).last()).toBeVisible();
    await expect(page.getByText("1 / 6", { exact: true })).toBeVisible();

    await page.getByRole("button", { name: "调整表单" }).click();
    await expect(page.getByTestId("form-adjustment-panel")).toBeVisible();
    await expect(page.getByText("已同步预览 · 发布时保存", { exact: true })).toBeVisible();
    await expectPreviewVisibleBesideAdjustmentPanel(page);
    await page.getByLabel("表单标题").fill("科技峰会报名表");
    await page.getByLabel("字段 1").fill("怎么称呼你？");
    await page.getByRole("button", { name: "必填" }).first().click();
    await expect(page.getByRole("button", { name: "选填" }).first()).toBeVisible();
    await page.getByRole("button", { name: "下移怎么称呼你？" }).click();
    await expect(page.getByLabel("字段 2")).toHaveValue("怎么称呼你？");
    await page.getByRole("button", { name: "添加字段" }).click();
    await expect(page.getByLabel("字段 7")).toBeVisible();
    await page.getByText("外观（可选）", { exact: true }).click();
    await page.getByRole("button", { name: "商务" }).click();
    await expect(page.getByTestId("phone-form-preview")).toHaveAttribute("data-theme", "business");
    await expectVisibleInViewport(page, page.getByRole("button", { name: "根据当前说明重新生成" }));

    await page.setViewportSize({ width: 390, height: 844 });
    await expectVisibleInViewport(page, page.getByRole("button", { name: "根据当前说明重新生成" }));
    await page.keyboard.press("Escape");
    await page.setViewportSize({ width: 1366, height: 768 });
    await expect(page.getByTestId("phone-form-preview").getByRole("heading", { name: "科技峰会报名表" })).toBeVisible();
    await page.getByTestId("phone-form-preview").getByRole("button", { name: "预览下一题" }).click();
    await expect(page.getByTestId("phone-form-preview").getByText("怎么称呼你？", { exact: true })).toBeVisible();
  });

  test("keeps generated creation previews aligned, unclipped, and locale-consistent", async ({
    page,
  }, testInfo) => {
    test.skip(
      testInfo.project.name !== "chromium",
      "The gate runs once with fixed desktop and mobile viewports."
    );
    test.setTimeout(90_000);

    await page.setViewportSize({ width: 1440, height: 900 });
    await signInWithDevUser(
      page,
      "/forms/new?template=event-registration&prompt=Design%20an%20event%20signup%20form%20for%20a%20tech%20summit&autogenerate=1"
    );

    await expect(page.getByText("Event registration", { exact: true }).first()).toBeVisible();
    await expect(page.getByText("AI 生成信息收集表单", { exact: true })).toHaveCount(0);
    await page.getByRole("button", { name: "Phone" }).click();
    await expect(page.getByTestId("phone-form-preview")).toBeVisible();
    await expectNoHorizontalOverflow(page);
    await expectPhonePreviewHasSafeBounds(page);
    await testInfo.attach("creator-en-desktop-phone.png", {
      body: await page.screenshot(),
      contentType: "image/png",
    });

    await page.getByRole("button", { name: "Desktop" }).click();
    await expect(page.getByTestId("creation-canvas").locator("article")).toBeVisible();
    await expectDesktopPreviewHasBottomBoundary(page);
    await expectNoHorizontalOverflow(page);
    await testInfo.attach("creator-en-desktop-desktop.png", {
      body: await page.screenshot(),
      contentType: "image/png",
    });

    // This is the smallest desktop viewport reported by the product review.
    // It protects the Phone preview from being visually complete at 1440×900
    // yet clipping the first response action on a regular laptop.
    await page.setViewportSize({ width: 1366, height: 768 });
    await page.getByRole("button", { name: "Phone" }).click();
    await expect(page.getByTestId("phone-form-preview")).toBeVisible();
    await expectPhonePreviewHasSafeBounds(page);
    await expectPreviewPrimaryActionVisible(page, "phone");
    await expectNoHorizontalOverflow(page);
    await testInfo.attach("creator-en-1366-phone.png", {
      body: await page.screenshot(),
      contentType: "image/png",
    });

    // A tall desktop viewport must use the available right-pane space without
    // clipping the Phone shell or its primary action at the bottom.
    await page.setViewportSize({ width: 1920, height: 1040 });
    await expectPhonePreviewHasSafeBounds(page);
    await expectPreviewPrimaryActionVisible(page, "phone");

    await page.getByRole("button", { name: "Desktop" }).click();
    await expect(page.getByTestId("desktop-form-preview")).toBeVisible();
    await expectPreviewPrimaryActionVisible(page, "desktop");
    await expectDesktopPreviewHasBottomBoundary(page);
    await expectNoHorizontalOverflow(page);
    await testInfo.attach("creator-en-1366-desktop.png", {
      body: await page.screenshot(),
      contentType: "image/png",
    });

    await page.setViewportSize({ width: 1440, height: 900 });

    await page.goto(
      "/zh/forms/new?template=event-registration&prompt=%E8%AE%BE%E8%AE%A1%E4%B8%80%E4%B8%AA%E7%A7%91%E6%8A%80%E5%B3%B0%E4%BC%9A%E6%B4%BB%E5%8A%A8%E6%8A%A5%E5%90%8D%E8%A1%A8&autogenerate=1"
    );

    await expect(
      page.getByRole("heading", { name: /表单.*已经准备好了/ })
    ).toBeVisible();
    await expect(page.getByText("Event registration", { exact: true })).toHaveCount(0);
    await page.getByRole("button", { name: "手机预览" }).click();
    await expect(page.getByTestId("phone-form-preview")).toBeVisible();
    await expectNoHorizontalOverflow(page);
    await expectPhonePreviewHasSafeBounds(page);
    await testInfo.attach("creator-zh-desktop-phone.png", {
      body: await page.screenshot(),
      contentType: "image/png",
    });

    await page.getByRole("button", { name: "桌面预览" }).click();
    await expect(page.getByTestId("creation-canvas").locator("article")).toBeVisible();
    await expectDesktopPreviewHasBottomBoundary(page);
    await expectNoHorizontalOverflow(page);
    await testInfo.attach("creator-zh-desktop-desktop.png", {
      body: await page.screenshot(),
      contentType: "image/png",
    });

    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(
      "/forms/new?template=event-registration&prompt=Design%20an%20event%20signup%20form%20for%20a%20tech%20summit&autogenerate=1"
    );
    await expect(page.getByText("Event registration", { exact: true }).first()).toBeVisible();
    await expectNoHorizontalOverflow(page);
    await testInfo.attach("creator-en-mobile.png", {
      body: await page.screenshot(),
      contentType: "image/png",
    });

    await page.goto(
      "/zh/forms/new?template=event-registration&prompt=%E8%AE%BE%E8%AE%A1%E4%B8%80%E4%B8%AA%E7%A7%91%E6%8A%80%E5%B3%B0%E4%BC%9A%E6%B4%BB%E5%8A%A8%E6%8A%A5%E5%90%8D%E8%A1%A8&autogenerate=1"
    );
    await expect(
      page.getByRole("heading", { name: /表单.*已经准备好了/ })
    ).toBeVisible();
    await expectNoHorizontalOverflow(page);
    await testInfo.attach("creator-zh-mobile.png", {
      body: await page.screenshot(),
      contentType: "image/png",
    });
  });
});
