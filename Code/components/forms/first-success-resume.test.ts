import { describe, expect, it } from "vitest";

import {
  resumeActionForTrigger,
  shouldAutoResumeGuestIntent,
} from "./first-success-resume";

const NOW = 1_800_000_000_000;
const freshIntent = { trigger: "create_form", stored_at: NOW - 60_000 };

describe("shouldAutoResumeGuestIntent", () => {
  it("登录回跳且草稿就绪时恢复 create_form 意图", () => {
    expect(
      shouldAutoResumeGuestIntent({
        intent: freshIntent,
        isGuest: false,
        hasDraft: true,
        isSaving: false,
        now: NOW,
      }),
    ).toBe(true);
  });

  it("publish_form 意图同样可以恢复", () => {
    expect(
      shouldAutoResumeGuestIntent({
        intent: { trigger: "publish_form", stored_at: NOW - 60_000 },
        isGuest: false,
        hasDraft: true,
        isSaving: false,
        now: NOW,
      }),
    ).toBe(true);
  });

  it("没有待处理意图时不恢复", () => {
    expect(
      shouldAutoResumeGuestIntent({
        intent: null,
        isGuest: false,
        hasDraft: true,
        isSaving: false,
        now: NOW,
      }),
    ).toBe(false);
  });

  it("仍然是游客时不恢复（登录未完成）", () => {
    expect(
      shouldAutoResumeGuestIntent({
        intent: freshIntent,
        isGuest: true,
        hasDraft: true,
        isSaving: false,
        now: NOW,
      }),
    ).toBe(false);
  });

  it("草稿未就绪时不恢复（等待模板草稿构建）", () => {
    expect(
      shouldAutoResumeGuestIntent({
        intent: freshIntent,
        isGuest: false,
        hasDraft: false,
        isSaving: false,
        now: NOW,
      }),
    ).toBe(false);
  });

  it("正在保存时不恢复（防止重复提交）", () => {
    expect(
      shouldAutoResumeGuestIntent({
        intent: freshIntent,
        isGuest: false,
        hasDraft: true,
        isSaving: true,
        now: NOW,
      }),
    ).toBe(false);
  });

  it("非创建/发布类触发不恢复（如 save_draft 以外的浏览意图）", () => {
    expect(
      shouldAutoResumeGuestIntent({
        intent: { trigger: "preview_fields", stored_at: NOW - 60_000 },
        isGuest: false,
        hasDraft: true,
        isSaving: false,
        now: NOW,
      }),
    ).toBe(false);
  });

  it("过期意图不恢复（默认 30 分钟有效期）", () => {
    expect(
      shouldAutoResumeGuestIntent({
        intent: { trigger: "create_form", stored_at: NOW - 31 * 60_000 },
        isGuest: false,
        hasDraft: true,
        isSaving: false,
        now: NOW,
      }),
    ).toBe(false);
  });

  it("缺少 stored_at 或时间戳异常时不恢复", () => {
    expect(
      shouldAutoResumeGuestIntent({
        intent: { trigger: "create_form" },
        isGuest: false,
        hasDraft: true,
        isSaving: false,
        now: NOW,
      }),
    ).toBe(false);
    expect(
      shouldAutoResumeGuestIntent({
        intent: { trigger: "create_form", stored_at: NOW + 60_000 },
        isGuest: false,
        hasDraft: true,
        isSaving: false,
        now: NOW,
      }),
    ).toBe(false);
  });
});

describe("resumeActionForTrigger", () => {
  it("create_form 映射为草稿创建动作", () => {
    expect(resumeActionForTrigger("create_form")).toEqual({
      status: "draft",
      override: "create_form",
    });
  });

  it("publish_form 映射为发布动作", () => {
    expect(resumeActionForTrigger("publish_form")).toEqual({
      status: "published",
      override: "publish_form",
    });
  });

  it("未知触发返回 null", () => {
    expect(resumeActionForTrigger("save_draft")).toBeNull();
    expect(resumeActionForTrigger(undefined)).toBeNull();
  });
});
