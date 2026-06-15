import { describe, expect, it } from "vitest";

import { getSceneTemplateById } from "./form-templates";
import {
  getUseCaseLandingPage,
  getUseCaseLandingPagesWithTemplates,
  useCaseLandingPages,
} from "./use-case-landing-pages";

describe("use case landing pages", () => {
  it("keeps every SEO landing page addressable and backed by a real template", () => {
    const slugs = new Set(useCaseLandingPages.map((page) => page.slug));

    expect(useCaseLandingPages.length).toBeGreaterThanOrEqual(4);
    expect(slugs.size).toBe(useCaseLandingPages.length);

    for (const page of useCaseLandingPages) {
      expect(page.slug).toMatch(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);
      expect(getUseCaseLandingPage(page.slug)).toEqual(page);
      expect(getSceneTemplateById(page.templateId)).toBeTruthy();
      expect(page.relatedSlugs.length).toBeGreaterThanOrEqual(2);

      for (const relatedSlug of page.relatedSlugs) {
        expect(relatedSlug).not.toBe(page.slug);
        expect(slugs.has(relatedSlug)).toBe(true);
      }
    }
  });

  it("keeps bilingual copy and growth keywords ready for public pages", () => {
    for (const page of useCaseLandingPages) {
      expect(page.title).toBeTruthy();
      expect(page.zhTitle).toBeTruthy();
      expect(page.description.length).toBeGreaterThan(40);
      expect(page.zhDescription.length).toBeGreaterThan(20);
      expect(page.searchIntent).toBeTruthy();
      expect(page.zhSearchIntent).toBeTruthy();
      expect(page.painPoints.length).toBeGreaterThanOrEqual(3);
      expect(page.zhPainPoints).toHaveLength(page.painPoints.length);
      expect(page.workflow.length).toBeGreaterThanOrEqual(3);
      expect(page.zhWorkflow).toHaveLength(page.workflow.length);
      expect(page.proofPoints.length).toBeGreaterThanOrEqual(3);
      expect(page.zhProofPoints).toHaveLength(page.proofPoints.length);
      expect(page.keywords.length).toBeGreaterThanOrEqual(3);
      expect(page.zhKeywords.length).toBeGreaterThanOrEqual(3);
    }
  });

  it("returns only landing pages that can render template previews", () => {
    const pagesWithTemplates = getUseCaseLandingPagesWithTemplates();

    expect(pagesWithTemplates).toHaveLength(useCaseLandingPages.length);
    expect(pagesWithTemplates.every((page) => page.template)).toBe(true);
  });
});
