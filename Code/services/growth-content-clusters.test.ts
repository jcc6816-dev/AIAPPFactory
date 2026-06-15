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
