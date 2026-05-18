import { describe, expect, it, vi } from "vitest";

import {
  getOcrTemplateGuidance,
  sanitizeOcrRawText,
  shouldStructureOcrRawText,
  structureOcrResultWithLlm,
  trimOcrRawTextForLlm,
} from "./structurer";

describe("ocr structurer", () => {
  it("returns the original OCR result when raw text is empty", async () => {
    const result = await structureOcrResultWithLlm({
      raw_text: "",
      summary: "",
    });

    expect(result.summary).toBe("");
    expect(result.structured_data).toBeUndefined();
  });

  it("builds invoice guidance with invoice-specific fields", () => {
    const guidance = getOcrTemplateGuidance("invoice");

    expect(guidance).toContain("invoice_no");
    expect(guidance).toContain("发票号码");
    expect(guidance).toContain("价税合计");
  });

  it("sanitizes OCR raw text before sending it to LLM", () => {
    expect(sanitizeOcrRawText("A\r\n\r\n\r\nB   C")).toBe("A\n\nB C");
  });

  it("truncates OCR raw text to control token usage", () => {
    const input = "A".repeat(40);
    expect(trimOcrRawTextForLlm(input, 10)).toBe(`${"A".repeat(10)}\n...[truncated]`);
  });

  it("skips LLM structuring when OCR text is too short", async () => {
    vi.stubEnv("DEEPSEEK_API_KEY", "test-key");

    const result = await structureOcrResultWithLlm({
      raw_text: "ok",
      summary: "",
    });

    expect(result.summary).toBe("ok");
    expect(result.structured_data).toBeUndefined();

    vi.unstubAllEnvs();
  });

  it("applies a minimum OCR text threshold before structuring", () => {
    expect(shouldStructureOcrRawText("invoice amount")).toBe(false);
    expect(shouldStructureOcrRawText("invoice amount total date merchant 123456", 10)).toBe(true);
  });
});
