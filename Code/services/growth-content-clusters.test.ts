import { describe, expect, it } from "vitest";

import {
  getGrowthContentCluster,
  getPublishedClusterPosts,
  getRelatedUseCasesForPost,
  growthContentClusters,
} from "./growth-content-clusters";
import { getUseCaseLandingPage, useCaseLandingPages } from "./use-case-landing-pages";

describe("growth content clusters", () => {
  it("maps every cluster to an existing use case landing page", () => {
    const clusteredUseCases = new Set(growthContentClusters.map((cluster) => cluster.useCaseSlug));

    expect(clusteredUseCases.size).toBe(growthContentClusters.length);
    expect(clusteredUseCases.size).toBe(useCaseLandingPages.length);

    for (const cluster of growthContentClusters) {
      expect(getUseCaseLandingPage(cluster.useCaseSlug)).toBeTruthy();
      expect(cluster.postSlugs.length).toBeGreaterThanOrEqual(1);
      expect(cluster.topicIdeas.length).toBeGreaterThanOrEqual(1);
    }
  });

  it("returns published posts for a use case in configured order", () => {
    const posts = [
      { slug: "google-forms-vs-typeform-vs-genforms-workflow", title: "Google vs Typeform" },
      { slug: "typeform-alternatives", title: "Typeform Alternatives" },
      { slug: "other", title: "Other" },
    ];

    expect(getPublishedClusterPosts("google-forms-alternative-ai", posts)).toEqual([
      posts[0],
      posts[1],
    ]);
    expect(getGrowthContentCluster("google-forms-alternative-ai")).toBeTruthy();
  });

  it("prioritizes webhook support posts on the webhook pillar", () => {
    const posts = [
      { slug: "feishu-dingtalk-webhook-notification", title: "Feishu and DingTalk Webhook" },
      { slug: "form-builder-with-webhook", title: "Form Builder With Webhook" },
      { slug: "send-form-submissions-to-webhook", title: "Send Submissions to Webhook" },
      { slug: "other", title: "Other" },
    ];

    expect(getPublishedClusterPosts("webhook-form-builder-retry-logs", posts)).toEqual([
      posts[2],
      posts[1],
      posts[0],
    ]);
  });

  it("prioritizes dedicated lead capture posts on the lead capture pillar", () => {
    const posts = [
      { slug: "typeform-alternatives", title: "Typeform Alternatives" },
      { slug: "saas-lead-capture-form", title: "SaaS Lead Capture Form" },
      {
        slug: "ai-lead-capture-form-builder-saas",
        title: "AI Lead Capture Form Builder for SaaS Teams",
      },
      { slug: "other", title: "Other" },
    ];

    expect(getPublishedClusterPosts("ai-lead-capture-form-builder", posts)).toEqual([
      posts[2],
      posts[1],
      posts[0],
    ]);
  });

  it("connects the waitlist pillar to its demand validation guide", () => {
    const posts = [
      {
        slug: "google-forms-vs-typeform-vs-genforms-workflow",
        title: "Google vs Typeform",
      },
      {
        slug: "waitlist-form-demand-validation",
        title: "Waitlist Demand Validation",
      },
    ];

    expect(
      getPublishedClusterPosts("waitlist-form-builder-indie-hackers", posts)
    ).toEqual([posts[1]]);
  });

  it("connects quote requests to an existing lead capture support post", () => {
    const posts = [
      { slug: "saas-lead-capture-form", title: "SaaS Lead Capture Form" },
      { slug: "other", title: "Other" },
    ];

    expect(getPublishedClusterPosts("quote-request-form-builder", posts)).toEqual([
      posts[0],
    ]);
  });

  it("connects demo requests to the existing SaaS lead capture support post", () => {
    const posts = [
      { slug: "saas-lead-capture-form", title: "SaaS Lead Capture Form" },
      { slug: "other", title: "Other" },
    ];

    expect(getPublishedClusterPosts("demo-request-form-builder", posts)).toEqual([
      posts[0],
    ]);
  });

  it("recommends related use cases for blog posts", () => {
    const related = getRelatedUseCasesForPost({
      slug: "feishu-dingtalk-webhook-notification",
      title: "Feishu and DingTalk Webhook Notification",
      description: "Send form submissions to team chat.",
    });

    expect(related.length).toBeGreaterThan(0);
    expect(related.map((page) => page.slug)).toContain("feishu-dingtalk-form-notifications");
  });
});
