import type { Post } from "@/types/post";

import {
  getUseCaseLandingPage,
  useCaseLandingPages,
} from "./use-case-landing-pages";

export interface GrowthContentCluster {
  useCaseSlug: string;
  postSlugs: string[];
  topicIdeas: {
    title: string;
    zhTitle: string;
    intent: string;
    zhIntent: string;
  }[];
}

export const growthContentClusters: GrowthContentCluster[] = [
  {
    useCaseSlug: "typeform-alternative-webhooks",
    postSlugs: ["typeform-alternatives", "google-forms-vs-typeform-vs-genforms-workflow"],
    topicIdeas: [
      {
        title: "How to move Typeform responses into a webhook workflow",
        zhTitle: "如何把 Typeform 风格表单接入 Webhook 工作流",
        intent: "Comparison users who already know Typeform but need automation.",
        zhIntent: "用户已熟悉 Typeform，但正在寻找自动化流转能力。",
      },
    ],
  },
  {
    useCaseSlug: "feishu-dingtalk-form-notifications",
    postSlugs: ["feishu-dingtalk-webhook-notification"],
    topicIdeas: [
      {
        title: "Send form submissions to Feishu and DingTalk without custom UI work",
        zhTitle: "无需自建 UI，把表单提交推送到飞书和钉钉",
        intent: "Ops teams looking for chat-based submission alerts.",
        zhIntent: "运营团队想把提交数据实时推送到团队群。",
      },
    ],
  },
  {
    useCaseSlug: "ai-lead-capture-form-builder",
    postSlugs: ["typeform-alternatives", "google-forms-vs-typeform-vs-genforms-workflow"],
    topicIdeas: [
      {
        title: "Best questions to ask in a SaaS lead capture form",
        zhTitle: "SaaS 线索收集表单应该问哪些问题",
        intent: "Marketing teams optimizing lead form completion and sales quality.",
        zhIntent: "营销团队想同时提升线索表单完成率和销售质量。",
      },
    ],
  },
  {
    useCaseSlug: "waitlist-form-builder-indie-hackers",
    postSlugs: ["google-forms-vs-typeform-vs-genforms-workflow"],
    topicIdeas: [
      {
        title: "How indie hackers can validate demand with a waitlist form",
        zhTitle: "独立开发者如何用 Waitlist 表单验证需求",
        intent: "Founders validating product demand before building the full product.",
        zhIntent: "创始人在完整开发前想先验证需求。",
      },
    ],
  },
  {
    useCaseSlug: "google-forms-alternative-ai",
    postSlugs: ["google-forms-vs-typeform-vs-genforms-workflow", "typeform-alternatives"],
    topicIdeas: [
      {
        title: "When Google Forms is no longer enough for product workflows",
        zhTitle: "什么时候 Google Forms 已经不够支撑产品工作流",
        intent: "Users outgrowing basic response collection.",
        zhIntent: "用户正在从基础回复收集升级到业务流程。",
      },
    ],
  },
  {
    useCaseSlug: "webhook-form-builder-retry-logs",
    postSlugs: ["feishu-dingtalk-webhook-notification"],
    topicIdeas: [
      {
        title: "Why webhook logs matter for form automation",
        zhTitle: "为什么表单自动化需要 Webhook 日志",
        intent: "Technical evaluators checking reliability before adopting a form workflow.",
        zhIntent: "技术评估者在采用表单工作流前需要验证可靠性。",
      },
    ],
  },
  {
    useCaseSlug: "ai-event-registration-form-builder",
    postSlugs: ["feishu-dingtalk-webhook-notification"],
    topicIdeas: [
      {
        title: "Event registration form checklist for marketing teams",
        zhTitle: "营销团队活动报名表单检查清单",
        intent: "Event marketers trying to launch signup pages quickly.",
        zhIntent: "活动营销团队想快速发布报名页面。",
      },
    ],
  },
  {
    useCaseSlug: "customer-feedback-form-builder",
    postSlugs: ["google-forms-vs-typeform-vs-genforms-workflow"],
    topicIdeas: [
      {
        title: "How to keep customer feedback forms short but useful",
        zhTitle: "如何让客户反馈表单既简短又有用",
        intent: "Product and support teams improving feedback quality.",
        zhIntent: "产品和客服团队想提升反馈质量。",
      },
    ],
  },
  {
    useCaseSlug: "contact-form-builder-for-websites",
    postSlugs: ["google-forms-vs-typeform-vs-genforms-workflow"],
    topicIdeas: [
      {
        title: "What a professional website contact form should include",
        zhTitle: "专业官网联系我们表单应该包含什么",
        intent: "Website owners improving business inquiry collection.",
        zhIntent: "网站所有者想提升业务咨询收集质量。",
      },
    ],
  },
  {
    useCaseSlug: "qr-code-form-builder",
    postSlugs: ["feishu-dingtalk-webhook-notification"],
    topicIdeas: [
      {
        title: "How to use QR code forms for offline collection",
        zhTitle: "如何用二维码表单做线下信息收集",
        intent: "Teams collecting event, counter, classroom, or field submissions.",
        zhIntent: "团队要收集活动、柜台、课堂或外勤场景提交。",
      },
    ],
  },
];

export function getGrowthContentCluster(useCaseSlug: string) {
  return growthContentClusters.find((cluster) => cluster.useCaseSlug === useCaseSlug);
}

export function getPublishedClusterPosts(
  useCaseSlug: string,
  posts: Post[],
  limit = 3
) {
  const cluster = getGrowthContentCluster(useCaseSlug);
  if (!cluster) return [];

  const postBySlug = new Map(posts.map((post) => [post.slug, post]));

  return cluster.postSlugs
    .map((slug) => postBySlug.get(slug))
    .filter((post): post is Post => Boolean(post))
    .slice(0, limit);
}

export function getRelatedUseCasesForPost(post: Post, limit = 3) {
  const haystack = [post.slug, post.title, post.description]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  const scored = growthContentClusters
    .map((cluster) => {
      const useCase = getUseCaseLandingPage(cluster.useCaseSlug);
      if (!useCase) return null;

      let score = cluster.postSlugs.includes(post.slug || "") ? 8 : 0;
      const keywords = [
        useCase.slug,
        useCase.title,
        useCase.zhTitle,
        useCase.eyebrow,
        ...useCase.keywords,
        ...useCase.zhKeywords,
      ];

      for (const keyword of keywords) {
        const normalizedKeyword = keyword.toLowerCase();
        if (normalizedKeyword && haystack.includes(normalizedKeyword)) {
          score += 2;
        }
      }

      return score > 0 ? { useCase, score } : null;
    })
    .filter((entry): entry is { useCase: NonNullable<ReturnType<typeof getUseCaseLandingPage>>; score: number } =>
      Boolean(entry)
    )
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((entry) => entry.useCase);

  if (scored.length > 0) {
    return scored;
  }

  return useCaseLandingPages.slice(0, limit);
}
