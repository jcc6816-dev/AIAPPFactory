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

  it("rewrites 0.0.0.0 bind-host redirects to the request host (Next 15.2 standalone)", () => {
    const input = "https://0.0.0.0/forms/new?template=event-registration";
    const result = sanitizeRedirectUrl(input, "genforms.ai");
    expect(result).toBe("https://genforms.ai/forms/new?template=event-registration");
  });

  it("upgrades http and rewrites host for 0.0.0.0 redirects", () => {
    const input = "http://0.0.0.0/admin";
    const result = sanitizeRedirectUrl(input, "genforms.ai");
    expect(result).toBe("https://genforms.ai/admin");
  });

  it("keeps http and port when the request host is local", () => {
    const input = "http://0.0.0.0/forms/new";
    const result = sanitizeRedirectUrl(input, "127.0.0.1:3099");
    expect(result).toBe("http://127.0.0.1:3099/forms/new");
  });

  it("leaves 0.0.0.0 redirects untouched when no request host is provided", () => {
    const input = "https://0.0.0.0/forms/new";
    expect(sanitizeRedirectUrl(input)).toBe(input);
  });

  it("strips internal listen port after rewriting host for public domains", () => {
    const input = "https://0.0.0.0/forms/new?template=event-registration";
    const result = sanitizeRedirectUrl(input, "genforms.ai:80");
    expect(result).toBe("https://genforms.ai/forms/new?template=event-registration");
  });
});
