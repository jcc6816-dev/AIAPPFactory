import { describe, expect, it } from "vitest";
import { getResumableGuestLoginPrompt } from "./form-login-resume";

describe("getResumableGuestLoginPrompt", () => {
  const now = 1_000_000;

  it("restores a recent prompt and trims whitespace", () => {
    expect(
      getResumableGuestLoginPrompt(
        { prompt: "  创建产品工作坊报名表  ", stored_at: now - 1_000 },
        now
      )
    ).toBe("创建产品工作坊报名表");
  });

  it("rejects expired, blank, and malformed values", () => {
    expect(getResumableGuestLoginPrompt({ prompt: "创建报名表", stored_at: now - 30 * 60 * 1000 - 1 }, now)).toBeUndefined();
    expect(getResumableGuestLoginPrompt({ prompt: " ", stored_at: now }, now)).toBeUndefined();
    expect(getResumableGuestLoginPrompt({ prompt: "创建报名表" }, now)).toBeUndefined();
  });
});
