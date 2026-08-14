import { describe, expect, it } from "vitest";
import { getCreationCanvasState } from "./form-creation-canvas-state";

describe("getCreationCanvasState", () => {
  it("shows the composer before any draft is generated", () => {
    expect(getCreationCanvasState({ generated: null, isGenerating: false })).toBe("brief");
  });

  it("shows generation status while the agent is working", () => {
    expect(getCreationCanvasState({ generated: null, isGenerating: true })).toBe("generating");
  });

  it("prioritizes the completed draft once it is available", () => {
    expect(getCreationCanvasState({ generated: { schema: { fields: [] } } as any, isGenerating: true })).toBe("complete");
  });
});
