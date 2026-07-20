import { describe, expect, it } from "vitest";

import { getGeneratorFooterHint } from "./form-generator-hints";

describe("getGeneratorFooterHint", () => {
  it("游客（匿名）且 canCreate=false 时显示登录引导，而不是配额已满（中文）", () => {
    // 回归用例：/forms/new 对游客恒为 canCreate=false，
    // 修复前此处会误显示“配额达到上限 (请升级)”。
    const hint = getGeneratorFooterHint({ isGuest: true, canCreate: false, isZh: true });
    expect(hint).toBe("登录后可保存并发布表单");
    expect(hint).not.toContain("配额");
  });

  it("游客（匿名）且 canCreate=false 时显示登录引导（英文）", () => {
    const hint = getGeneratorFooterHint({ isGuest: true, canCreate: false, isZh: false });
    expect(hint).toBe("Sign in to save and publish your form");
    expect(hint).not.toContain("Quota");
  });

  it("登录用户配额可用时显示可创建提示", () => {
    expect(getGeneratorFooterHint({ isGuest: false, canCreate: true, isZh: true })).toBe(
      "可创建并保存表单",
    );
    expect(getGeneratorFooterHint({ isGuest: false, canCreate: true, isZh: false })).toBe(
      "Ready to create and save forms",
    );
  });

  it("登录免费用户达到上限时保留配额升级提示", () => {
    expect(getGeneratorFooterHint({ isGuest: false, canCreate: false, isZh: true })).toBe(
      "配额达到上限 (请升级)",
    );
    expect(getGeneratorFooterHint({ isGuest: false, canCreate: false, isZh: false })).toBe(
      "Quota limit reached (Please upgrade)",
    );
  });
});
