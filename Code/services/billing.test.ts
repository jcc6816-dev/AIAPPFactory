import {
  DEV_INITIAL_FORM_CREDITS,
  DEV_MIN_FORM_CREDITS,
  hasEnoughCredits,
} from "./billing";
import { describe, expect, it } from "vitest";

describe("billing", () => {
  it("checks whether credits are enough for a fixed cost", () => {
    expect(hasEnoughCredits(10, 1)).toBe(true);
    expect(hasEnoughCredits(0, 1)).toBe(false);
  });

  it("keeps a deterministic dev initial wallet constant", () => {
    expect(DEV_INITIAL_FORM_CREDITS).toBe(20);
  });

  it("keeps a deterministic dev wallet floor constant", () => {
    expect(DEV_MIN_FORM_CREDITS).toBe(20);
  });
});
