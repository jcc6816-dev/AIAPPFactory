import DOMPurify from "isomorphic-dompurify";

// Hook 1: Restrict iframe to specific YouTube/Vimeo embed paths. Remove invalid elements entirely.
DOMPurify.addHook("uponSanitizeElement", (node, data) => {
  if (data.tagName === "iframe") {
    const el = node as Element;
    const src = el.getAttribute("src") || "";
    
    // Whitelist YouTube & Vimeo embed URL paths
    const isYoutubeEmbed = /^https:\/\/www\.youtube\.com\/embed\/[A-Za-z0-9_-]+(\?.*)?$/.test(src);
    const isVimeoEmbed = /^https:\/\/player\.vimeo\.com\/video\/[0-9]+(\?.*)?$/.test(src);
    
    if (!isYoutubeEmbed && !isVimeoEmbed) {
      el.parentNode?.removeChild(el);
    }
  }
});

// Hook 2: Auto-inject rel="noopener noreferrer" for target="_blank" links to prevent reverse-tabnabbing
DOMPurify.addHook("afterSanitizeAttributes", (node) => {
  if (node.tagName === "A") {
    const el = node as Element;
    const target = el.getAttribute("target");
    if (target === "_blank") {
      el.setAttribute("rel", "noopener noreferrer");
    }
  }
});

/**
 * Sanitizes markdown-rendered HTML content with strict tag/attribute whitelist
 * and security hook filters.
 */
export function sanitizeMarkdownHtml(dirtyHtml: string): string {
  return DOMPurify.sanitize(dirtyHtml, {
    ALLOWED_TAGS: [
      "h1", "h2", "h3", "h4", "h5", "h6",
      "p", "div", "span", "strong", "em", "blockquote", "br", "hr", "pre", "code",
      "ul", "ol", "li",
      "table", "thead", "tbody", "tr", "td", "th",
      "a", "img", "iframe"
    ],
    ALLOWED_ATTR: [
      "href", "src", "alt", "title", "class", "id", "target", "rel",
      "width", "height", "frameborder", "allow", "allowfullscreen"
    ],
    ADD_TAGS: ["iframe"],
  });
}
