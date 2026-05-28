import { describe, expect, it } from "vitest";

import { generateSparklinePoints } from "./sparkline";

describe("sparkline utility", () => {
  it("returns empty string for empty or single-value datasets", () => {
    expect(generateSparklinePoints([])).toBe("");
    expect(generateSparklinePoints([42])).toBe("");
  });

  it("plots two data points correctly", () => {
    // Two points scaled to width 100, height 50
    // min = 10, max = 20. range = 10.
    // pt 1 (10): x = 0, y = 50 - (0/10)*(50-6) - 3 = 47.
    // pt 2 (20): x = 100, y = 50 - (10/10)*(50-6) - 3 = 3.
    const result = generateSparklinePoints([10, 20], 100, 50);
    expect(result).toBe("0.0,47.0 100.0,3.0");
  });

  it("handles flat dataset values without division by zero errors", () => {
    // min = 5, max = 5. range fallback = 1.
    // pt 1 (5): x = 0, y = 30 - 0*24 - 3 = 27.
    // pt 2 (5): x = 120, y = 30 - 0*24 - 3 = 27.
    const result = generateSparklinePoints([5, 5], 120, 30);
    expect(result).toBe("0.0,27.0 120.0,27.0");
  });
});
