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

      if (page.intentBlocks) {
        expect(page.zhIntentBlocks).toHaveLength(page.intentBlocks.length);
        for (const [index, block] of page.intentBlocks.entries()) {
          expect(block.title).toBeTruthy();
          expect(block.description.length).toBeGreaterThan(40);
          expect(block.items.length).toBeGreaterThanOrEqual(3);
          expect(page.zhIntentBlocks?.[index].items).toHaveLength(block.items.length);
        }
      }

      if (page.faqItems) {
        expect(page.zhFaqItems).toHaveLength(page.faqItems.length);
        expect(page.faqItems.length).toBeGreaterThanOrEqual(3);
        for (const [index, faq] of page.faqItems.entries()) {
          expect(faq.question).toBeTruthy();
          expect(faq.answer.length).toBeGreaterThan(40);
          expect(page.zhFaqItems?.[index].question).toBeTruthy();
        }
      }
    }
  });

  it("returns only landing pages that can render template previews", () => {
    const pagesWithTemplates = getUseCaseLandingPagesWithTemplates();

    expect(pagesWithTemplates).toHaveLength(useCaseLandingPages.length);
    expect(pagesWithTemplates.every((page) => page.template)).toBe(true);
  });

  it("keeps the event registration pillar focused on lightweight signup and QR sharing", () => {
    const page = getUseCaseLandingPage("event-registration-form-builder");

    expect(page).toBeTruthy();
    expect(page?.templateId).toBe("event-registration");
    expect(page?.keywords).toEqual(
      expect.arrayContaining([
        "event registration form builder",
        "QR code registration form",
        "RSVP form builder",
      ])
    );
    expect(page?.relatedSlugs).toEqual(
      expect.arrayContaining([
        "qr-code-form-builder",
        "feishu-dingtalk-form-notifications",
      ])
    );
    expect(page?.recommendedFields).toEqual(
      expect.arrayContaining([
        "Attendee name",
        "Attendance preference",
        "Dietary or accessibility needs",
      ])
    );
    expect(page?.zhRecommendedFields).toHaveLength(page?.recommendedFields?.length || 0);
    expect(page?.faqItems?.some((item) => item.answer.includes("does not currently promise ticket sales"))).toBe(true);
    expect(`${page?.title} ${page?.description} ${page?.prompt}`).not.toMatch(
      /paid event|payment|ticket sales|seat inventory|check-in scanning|badge generation/i
    );
  });

  it("keeps the customer feedback pillar aligned with lightweight feedback collection", () => {
    const page = getUseCaseLandingPage("customer-feedback-form-builder");

    expect(page).toBeTruthy();
    expect(page?.templateId).toBe("satisfaction-survey");
    expect(page?.keywords).toEqual(
      expect.arrayContaining([
        "customer feedback form",
        "customer feedback form builder",
        "customer feedback form template",
      ])
    );
    expect(page?.recommendedFields).toEqual(
      expect.arrayContaining([
        "Overall satisfaction rating",
        "What could be improved",
        "Follow-up consent",
      ])
    );
    expect(page?.zhRecommendedFields).toHaveLength(
      page?.recommendedFields?.length || 0
    );
    expect(page?.relatedSlugs).toEqual(
      expect.arrayContaining([
        "webhook-form-builder-retry-logs",
        "qr-code-form-builder",
      ])
    );
    expect(
      page?.faqItems?.some((item) =>
        /professional NPS benchmarking.*advanced CX analytics.*outside/i.test(
          item.answer
        )
      )
    ).toBe(true);

    const publicCopy = `${page?.title} ${page?.description} ${page?.prompt}`;
    expect(publicCopy).not.toMatch(
      /NPS benchmark|advanced CX analytics|email campaign|website widget|CRM native/i
    );
  });

  it("keeps the waitlist sub-pillar within lightweight pre-launch collection", () => {
    const page = getUseCaseLandingPage("waitlist-form-builder-indie-hackers");

    expect(page).toBeTruthy();
    expect(page?.templateId).toBe("waitlist");
    expect(page?.relatedSlugs).toEqual(
      expect.arrayContaining([
        "ai-lead-capture-form-builder",
        "webhook-form-builder-retry-logs",
      ])
    );
    expect(page?.keywords).toEqual(
      expect.arrayContaining([
        "waitlist form builder",
        "startup waitlist form",
        "AI waitlist form",
      ])
    );
    expect(page?.ctaBadge).toBe("AI Ready • Share link / QR");

    const publicCopy = `${page?.title} ${page?.description} ${page?.prompt}`;
    expect(publicCopy).not.toMatch(
      /referral loop|leaderboard|queue position|invite code|email campaign|custom domain|iframe|unlimited free/i
    );
  });

  it("keeps the quote request sub-pillar focused on inquiry collection", () => {
    const page = getUseCaseLandingPage("quote-request-form-builder");

    expect(page).toBeTruthy();
    expect(page?.templateId).toBe("quote-request");
    expect(page?.keywords).toEqual(
      expect.arrayContaining([
        "quote request form",
        "request a quote form",
        "quote request form template",
      ])
    );
    expect(page?.relatedSlugs).toEqual(
      expect.arrayContaining([
        "ai-lead-capture-form-builder",
        "webhook-form-builder-retry-logs",
      ])
    );
    expect(page?.faqItems?.some((item) => /does not provide pricing formulas/i.test(item.answer))).toBe(true);

    const publicCopy = `${page?.title} ${page?.description} ${page?.prompt}`;
    expect(publicCopy).not.toMatch(
      /instant quote|price calculator|formal quote|payment|invoice|file upload|CRM native|dispatch/i
    );
  });

  it("keeps the demo request sub-pillar focused on pre-demo qualification", () => {
    const page = getUseCaseLandingPage("demo-request-form-builder");

    expect(page).toBeTruthy();
    expect(page?.templateId).toBe("demo-request");
    expect(page?.keywords).toEqual(
      expect.arrayContaining([
        "demo request form builder",
        "demo request form template",
        "request a demo form",
      ])
    );
    expect(page?.recommendedFields).toHaveLength(8);
    expect(page?.relatedSlugs).toEqual(
      expect.arrayContaining([
        "ai-lead-capture-form-builder",
        "webhook-form-builder-retry-logs",
      ])
    );
    expect(page?.ctaBadge).toBe("AI Ready • Share link / QR");
    expect(
      page?.faqItems?.some((item) =>
        /does not promise real-time slots.*calendar sync.*meeting invitations/i.test(
          item.answer
        )
      )
    ).toBe(true);

    const publicCopy = `${page?.title} ${page?.description} ${page?.prompt}`;
    expect(publicCopy).not.toMatch(
      /calendar sync|schedule a meeting|redirect-on-submit|automatic lead scoring|CRM native|payment|embed|spam protection|unlimited free/i
    );
  });
});
