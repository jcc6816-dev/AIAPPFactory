import { describe, expect, it } from "vitest";

import {
  getClarityMetricCount,
  getClarityNumber,
} from "./clarity-metrics";

describe("Clarity metric semantics", () => {
  it("uses subTotal as the metric count instead of sessionsCount", () => {
    expect(
      getClarityMetricCount({
        sessionsCount: "7",
        sessionsWithMetricPercentage: 0,
        subTotal: "0",
      })
    ).toBe(0);
    expect(
      getClarityMetricCount({
        sessionsCount: "3",
        sessionsWithMetricPercentage: 33.33,
        subTotal: "2",
      })
    ).toBe(2);
  });

  it("supports metric-specific and legacy response shapes", () => {
    expect(getClarityMetricCount({ rageClickCount: "4" }, ["rageClickCount"])).toBe(4);
    expect(getClarityMetricCount({ sessionsCount: "5" })).toBe(5);
  });

  it("normalizes empty and invalid numeric fields", () => {
    expect(getClarityNumber(null)).toBe(0);
    expect(getClarityNumber("not-a-number")).toBe(0);
    expect(getClarityNumber("12.5")).toBe(12.5);
  });
});
