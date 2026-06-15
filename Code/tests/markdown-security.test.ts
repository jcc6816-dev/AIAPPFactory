import { describe, expect, it } from "vitest";
import { sanitizeMarkdownHtml } from "../lib/markdown-sanitizer";

describe("Markdown HTML Sanitizer Security and Policies", () => {
  it("strips out <script> tags and payloads completely", () => {
    const input = "<h1>Title</h1><script>alert('xss')</script><p>Some text</p>";
    const html = sanitizeMarkdownHtml(input);
    expect(html).not.toContain("<script>");
    expect(html).not.toContain("alert");
    expect(html).toContain("<h1>Title</h1>");
    expect(html).toContain("<p>Some text</p>");
  });

  it("removes event handlers like onerror and onclick", () => {
    const input = '<img src="x" onerror="alert(1)" onclick="console.log(2)" />';
    const html = sanitizeMarkdownHtml(input);
    expect(html).toContain('<img src="x"');
    expect(html).not.toContain("onerror");
    expect(html).not.toContain("onclick");
    expect(html).not.toContain("alert");
  });

  it("disarms javascript: protocol links", () => {
    const input = '<a href="javascript:alert(1)">Click Me</a>';
    const html = sanitizeMarkdownHtml(input);
    expect(html).not.toContain("href=\"javascript:");
    expect(html).not.toContain("alert");
  });

  it("removes non-whitelisted iframes entirely", () => {
    const input = '<iframe src="https://evil.com/phishing" width="500"></iframe>';
    const html = sanitizeMarkdownHtml(input);
    expect(html).not.toContain("<iframe");
    expect(html).not.toContain("evil.com");
  });

  it("permits whitelisted YouTube embed iframes", () => {
    const input = '<iframe src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1" width="560" height="315" frameborder="0" allowfullscreen></iframe>';
    const html = sanitizeMarkdownHtml(input);
    expect(html).toContain('<iframe src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1"');
    expect(html).toContain('width="560"');
    expect(html).toContain('height="315"');
    expect(html).toContain('frameborder="0"');
    expect(html).toContain("allowfullscreen");
  });

  it("permits whitelisted Vimeo embed iframes", () => {
    const input = '<iframe src="https://player.vimeo.com/video/12345678" width="560" height="315"></iframe>';
    const html = sanitizeMarkdownHtml(input);
    expect(html).toContain('<iframe src="https://player.vimeo.com/video/12345678"');
  });

  it("removes inline style attributes completely", () => {
    const input = '<div style="color: red; position: absolute; top: 0;">Danger Box</div>';
    const html = sanitizeMarkdownHtml(input);
    expect(html).toContain("<div>Danger Box</div>");
    expect(html).not.toContain("style=");
    expect(html).not.toContain("color: red");
  });

  it("automatically appends rel='noopener noreferrer' to target='_blank' links", () => {
    const input = '<a href="https://example.com" target="_blank">External Link</a>';
    const html = sanitizeMarkdownHtml(input);
    expect(html).toContain('target="_blank"');
    expect(html).toContain('rel="noopener noreferrer"');
  });

  it("preserves safe Tailwind classes on allowed tags", () => {
    const input = '<div class="rounded-lg border border-slate-200 bg-slate-50 p-5">Callout</div>';
    const html = sanitizeMarkdownHtml(input);
    expect(html).toContain('class="rounded-lg border border-slate-200 bg-slate-50 p-5"');
  });
});
