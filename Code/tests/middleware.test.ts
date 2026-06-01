import { describe, expect, it } from "vitest";
import { sanitizeRedirectUrl } from "../lib/url-helper";

describe("sanitizeRedirectUrl Helper", () => {
  it("strips port numbers from Location headers in production redirection", () => {
    const input = "https://genforms.ai:80/zh/templates";
    const result = sanitizeRedirectUrl(input);
    expect(result).toBe("https://genforms.ai/zh/templates");
  });

  it("upgrades http to https for production redirection", () => {
    const input = "http://genforms.ai:80/zh/templates";
    const result = sanitizeRedirectUrl(input);
    expect(result).toBe("https://genforms.ai/zh/templates");
  });

  it("does not strip ports for localhost development", () => {
    const input = "http://localhost:3000/zh/templates";
    const result = sanitizeRedirectUrl(input);
    expect(result).toBe("http://localhost:3000/zh/templates");
  });

  it("returns null or unmodified for invalid/null inputs", () => {
    expect(sanitizeRedirectUrl(null)).toBeNull();
    expect(sanitizeRedirectUrl("/zh/templates")).toBe("/zh/templates");
  });
});
