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

  it("retires solution pages that conflict with validated topic ownership", () => {
    expect(getSolutionLandingPage("lead-magnet-download-form")).toBeUndefined();
    expect(getSolutionLandingPage("newsletter-signup-form-builder")).toBeUndefined();
    expect(getSolutionLandingPage("community-application-form-template")).toBeUndefined();
    expect(getSolutionLandingPage("customer-testimonial-collection-form")).toBeUndefined();
    expect(solutionLandingPages.map((page) => page.slug)).not.toEqual(
      expect.arrayContaining([
        "lead-magnet-download-form",
        "newsletter-signup-form-builder",
        "community-application-form-template",
        "customer-testimonial-collection-form",
      ])
    );
  });

  it("keeps course registration focused on supported education intake", () => {
    const page = getSolutionLandingPage("course-registration-form-builder");

    expect(page).toBeTruthy();
    expect(page?.templateId).toBe("course-registration");
    expect(page?.creationIntent).toBe("course_registration");
    expect(page?.recommendedFields).toEqual(
      expect.arrayContaining([
        "Student name",
        "Email or phone",
        "Learning goal",
        "Follow-up consent",
      ])
    );

    const publicCopy = `${page?.description} ${page?.recommendedFields.join(" ")} ${page?.workflow.join(" ")}`;
    expect(publicCopy).not.toMatch(
      /payment or confirmation status|success redirect|stripe|calendly|seat inventory|automatic email/i
    );
    expect(page?.prompt).toContain("Do not promise payment");
    expect(page?.faq.some((item) => item.answer.includes("does not process tuition"))).toBe(true);
    expect(page?.faq.some((item) => item.answer.includes("does not count or lock seats"))).toBe(true);
  });

  it("keeps the web design client intake page focused on supported intake collection", () => {
    const page = getSolutionLandingPage("web-design-client-intake-form-template");

    expect(page).toBeTruthy();
    expect(page?.templateId).toBe("contact-us");
    expect(page?.creationIntent).toBe("client_intake");
    expect(page?.keywords).toEqual(
      expect.arrayContaining([
        "web design client intake form",
        "website design questionnaire",
      ]),
    );
    expect(page?.faq.some((item) => item.answer.includes("does not promise file upload"))).toBe(true);
    expect(`${page?.title} ${page?.description} ${page?.prompt}`).not.toMatch(
      /upload|e-signature|contract|project management software/i,
    );
  });

  it("keeps the QR event solution scoped to scan-to-register instead of ticketing", () => {
    const page = getSolutionLandingPage("event-registration-form-with-qr-code");

    expect(page).toBeTruthy();
    expect(page?.templateId).toBe("event-registration");
    expect(page?.searchIntent).toMatch(/scan-to-register/i);
    expect(page?.recommendedFields).toEqual(
      expect.arrayContaining(["Attendance preference", "Session or topic interest"])
    );
    expect(page?.recommendedFields.join(" ")).not.toMatch(/ticket|seat/i);
    expect(`${page?.searchIntent} ${page?.prompt} ${page?.zhKeywords.join(" ")}`).not.toMatch(
      /check-in|ticket type|票种|签到/
    );
  });

});
