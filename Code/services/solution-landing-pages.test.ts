import { describe, expect, it } from "vitest";

import { getSceneTemplateById } from "./form-templates";
import {
  getSolutionLandingPage,
  getSolutionLandingPagesWithTemplates,
  solutionLandingPages,
} from "./solution-landing-pages";

describe("solution landing pages", () => {
  it("keeps industry SEO pages addressable and backed by real templates", () => {
    const slugs = new Set(solutionLandingPages.map((page) => page.slug));

    expect(solutionLandingPages.length).toBeGreaterThanOrEqual(12);
    expect(slugs.size).toBe(solutionLandingPages.length);

    for (const page of solutionLandingPages) {
      expect(page.slug).toMatch(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);
      expect(getSolutionLandingPage(page.slug)).toEqual(page);
      expect(getSceneTemplateById(page.templateId)).toBeTruthy();
      expect(page.keywords.length).toBeGreaterThanOrEqual(3);
      expect(page.zhKeywords.length).toBeGreaterThanOrEqual(3);
    }
  });

  it("keeps bilingual copy, fields, workflow, and FAQ ready for rendering", () => {
    for (const page of solutionLandingPages) {
      expect(page.title).toBeTruthy();
      expect(page.zhTitle).toBeTruthy();
      expect(page.description.length).toBeGreaterThan(50);
      expect(page.zhDescription.length).toBeGreaterThan(20);
      expect(page.searchIntent).toBeTruthy();
      expect(page.zhSearchIntent).toBeTruthy();
      expect(page.recommendedFields.length).toBeGreaterThanOrEqual(5);
      expect(page.zhRecommendedFields).toHaveLength(page.recommendedFields.length);
      expect(page.workflow.length).toBeGreaterThanOrEqual(3);
      expect(page.zhWorkflow).toHaveLength(page.workflow.length);
      expect(page.faq.length).toBeGreaterThanOrEqual(2);
      expect(page.prompt).toBeTruthy();
      expect(page.zhPrompt).toBeTruthy();
    }
  });

  it("returns only solution pages that can render template previews", () => {
    const pagesWithTemplates = getSolutionLandingPagesWithTemplates();

    expect(pagesWithTemplates).toHaveLength(solutionLandingPages.length);
    expect(pagesWithTemplates.every((page) => page.template)).toBe(true);
  });
});
