import { describe, expect, it } from "vitest";

import type { Post } from "@/types/post";
import { getPostActionConfig } from "./post-action-config";

describe("blog detail action config", () => {
  it.each([
    "ai-lead-capture-form-builder-saas",
    "saas-lead-capture-form",
  ])("keeps lead capture context for %s", (slug) => {
    const action = getPostActionConfig({ slug } as Post, "");
    const createUrl = new URL(action!.createHref, "https://genforms.ai");

    expect(action?.templatesHref).toBe(
      "/use-cases/ai-lead-capture-form-builder"
    );
    expect(createUrl.pathname).toBe("/forms/new");
    expect(createUrl.searchParams.get("template")).toBe("lead-capture");
    expect(createUrl.searchParams.get("intent")).toBe("lead_capture");
    expect(createUrl.searchParams.get("source")).toBe(`post_${slug}`);
    expect(createUrl.searchParams.get("prompt")).toContain(
      "SaaS lead capture form"
    );
  });

  it("keeps the locale prefix for Chinese lead capture actions", () => {
    const action = getPostActionConfig(
      { slug: "saas-lead-capture-form" } as Post,
      "/zh"
    );

    expect(action?.templatesHref).toBe(
      "/zh/use-cases/ai-lead-capture-form-builder"
    );
    expect(action?.createHref).toMatch(/^\/zh\/forms\/new\?/);
  });

  it("routes the waitlist guide into a preconfigured waitlist form", () => {
    const action = getPostActionConfig(
      { slug: "waitlist-form-demand-validation" } as Post,
      ""
    );
    const createUrl = new URL(action!.createHref, "https://genforms.ai");

    expect(action?.templatesHref).toBe(
      "/use-cases/waitlist-form-builder-indie-hackers"
    );
    expect(createUrl.pathname).toBe("/forms/new");
    expect(createUrl.searchParams.get("template")).toBe("waitlist");
    expect(createUrl.searchParams.get("intent")).toBe("waitlist");
    expect(createUrl.searchParams.get("source")).toBe(
      "post_waitlist-form-demand-validation"
    );
    expect(createUrl.searchParams.get("prompt")).toContain(
      "pre-launch waitlist form"
    );
  });

  it("routes the testimonial guide into the bounded customer story flow", () => {
    const action = getPostActionConfig(
      { slug: "customer-testimonial-form-guide" } as Post,
      ""
    );
    const createUrl = new URL(action!.createHref, "https://genforms.ai");

    expect(action?.templatesHref).toBe(
      "/templates/customer-testimonial-form"
    );
    expect(createUrl.pathname).toBe("/forms/new");
    expect(createUrl.searchParams.get("template")).toBe("customer-testimonial-form");
    expect(createUrl.searchParams.get("intent")).toBe("customer_testimonial");
    expect(createUrl.searchParams.get("source")).toBe(
      "post_customer-testimonial-form-guide"
    );
    expect(createUrl.searchParams.get("prompt")).toContain(
      "Do not create file"
    );
  });
});
