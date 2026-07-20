import type { Post } from "@/types/post";

export function getPostActionConfig(post: Post, localePrefix: string) {
  if (post.slug === "customer-testimonial-form-guide") {
    const prompt =
      "Create a customer testimonial form with customer name, product or service used, the challenge before, concrete results after, publishing preference, company and role, and optional follow-up contact. Do not create file, logo, headshot, or screenshot upload fields, and do not claim this form replaces a legal release.";
    const query = new URLSearchParams({
      template: "customer-testimonial-form",
      source: "post_customer-testimonial-form-guide",
      intent: "customer_testimonial",
      prompt,
    });

    return {
      templatesHref: `${localePrefix}/templates/customer-testimonial-form`,
      createHref: `${localePrefix}/forms/new?${query.toString()}`,
      primaryLabel: "Review testimonial workflow",
      zhPrimaryLabel: "查看客户证言流程",
      secondaryLabel: "Create a testimonial form",
      zhSecondaryLabel: "创建客户证言表单",
      title: "Create the testimonial form while you read",
      zhTitle: "边阅读边创建客户证言表单",
      description:
        "Start from the customer testimonial form, collect concrete outcomes and publishing preferences, then review every submission before public use.",
      zhDescription:
        "从客户证言收集表开始，收集具体结果和公开使用偏好，并在公开使用前人工审核每一条提交。",
    };
  }

  if (post.slug === "feishu-dingtalk-webhook-notification") {
    const prompt =
      "Create a form that sends new submissions to Feishu or DingTalk via webhook";
    const query = new URLSearchParams({
      template: "contact-us",
      source: "post_feishu-dingtalk-webhook-notification",
      intent: "webhook_form",
      prompt,
    });

    return {
      templatesHref: `${localePrefix}/use-cases/feishu-dingtalk-form-notifications`,
      createHref: `${localePrefix}/forms/new?${query.toString()}`,
      primaryLabel: "Review notification workflow",
      zhPrimaryLabel: "查看通知流程",
      secondaryLabel: "Create a notification form",
      zhSecondaryLabel: "创建通知表单",
      title: "Create the notification form while you read",
      zhTitle: "边看教程边创建通知表单",
      description:
        "Start from a contact-style form, keep the webhook intent, then send test submissions to your Feishu or DingTalk bot.",
      zhDescription:
        "从联系类表单开始，保留 Webhook 意图，再把测试提交发送到飞书或钉钉机器人。",
    };
  }

  if (post.slug === "send-form-submissions-to-webhook") {
    const prompt =
      "Create a webhook-ready intake form that collects name, email, company, request type, message, and follow-up priority";
    const query = new URLSearchParams({
      template: "contact-us",
      source: "post_send-form-submissions-to-webhook",
      intent: "webhook_form",
      prompt,
    });

    return {
      templatesHref: `${localePrefix}/use-cases/webhook-form-builder-retry-logs`,
      createHref: `${localePrefix}/forms/new?${query.toString()}`,
      primaryLabel: "Review webhook workflow",
      zhPrimaryLabel: "查看 Webhook 场景",
      secondaryLabel: "Create a webhook-ready form",
      zhSecondaryLabel: "创建 Webhook 表单",
      title: "Create the webhook form while you read",
      zhTitle: "边看教程边创建 Webhook 表单",
      description:
        "Start from a contact-style intake form, keep the webhook intent, then inspect submissions and delivery logs after testing.",
      zhDescription:
        "从联系类收集表单开始，保留 Webhook 意图，测试后查看提交和投递日志。",
    };
  }

  if (post.slug === "typeform-alternatives") {
    const prompt =
      "Create a Typeform-style lead capture form with one question per screen and a webhook-ready follow-up path";
    const query = new URLSearchParams({
      template: "lead-capture",
      source: "post_typeform-alternatives",
      intent: "typeform_alternative",
      mode: "typeform_style",
      prompt,
    });

    return {
      templatesHref: `${localePrefix}/use-cases/typeform-alternative-webhooks`,
      createHref: `${localePrefix}/forms/new?${query.toString()}`,
      primaryLabel: "Review Typeform workflow",
      zhPrimaryLabel: "查看 Typeform 替代场景",
      secondaryLabel: "Create a Typeform-style form",
      zhSecondaryLabel: "创建 Typeform 风格表单",
      title: "Create the Typeform-style form while you compare",
      zhTitle: "边比较边创建 Typeform 风格表单",
      description:
        "Start from a lead capture template, keep the Typeform-style mode, then publish a share link or connect webhook-ready follow-up.",
      zhDescription:
        "从线索收集模板开始，保留 Typeform 风格模式，再发布分享链接或接入 Webhook 后续流转。",
    };
  }

  if (
    post.slug === "waitlist-form-demand-validation"
  ) {
    const prompt =
      "Create a pre-launch waitlist form that collects name, email, role, main use case, pain point, and launch update preference";
    const query = new URLSearchParams({
      template: "waitlist",
      source: "post_waitlist-form-demand-validation",
      intent: "waitlist",
      prompt,
    });

    return {
      templatesHref: `${localePrefix}/use-cases/waitlist-form-builder-indie-hackers`,
      createHref: `${localePrefix}/forms/new?${query.toString()}`,
      primaryLabel: "Review the waitlist workflow",
      zhPrimaryLabel: "查看 Waitlist 流程",
      secondaryLabel: "Create a waitlist form",
      zhSecondaryLabel: "创建 Waitlist 表单",
      title: "Create the waitlist form while you validate demand",
      zhTitle: "边验证需求边创建 Waitlist 表单",
      description:
        "Start from the waitlist template, collect early-user intent, then publish a link or QR code and review signups in your dashboard.",
      zhDescription:
        "从 Waitlist 模板开始收集早期用户意向，再发布链接或二维码，并在数据面板查看报名结果。",
    };
  }

  if (
    post.slug === "ai-lead-capture-form-builder-saas" ||
    post.slug === "saas-lead-capture-form"
  ) {
    const prompt =
      "Create a concise SaaS lead capture form with work email, company, role, team size, use case, and follow-up priority";
    const query = new URLSearchParams({
      template: "lead-capture",
      source: `post_${post.slug}`,
      intent: "lead_capture",
      prompt,
    });

    return {
      templatesHref: `${localePrefix}/use-cases/ai-lead-capture-form-builder`,
      createHref: `${localePrefix}/forms/new?${query.toString()}`,
      primaryLabel: "Review lead capture workflow",
      zhPrimaryLabel: "查看线索收集场景",
      secondaryLabel: "Create a lead capture form",
      zhSecondaryLabel: "创建线索收集表单",
      title: "Create the lead capture form while you read",
      zhTitle: "边阅读边创建线索收集表单",
      description:
        "Start from the lead capture template, qualify prospects with focused questions, then publish and route submissions to your follow-up workflow.",
      zhDescription:
        "从线索收集模板开始，用精简问题筛选潜客，再发布并把提交送入后续跟进流程。",
    };
  }

  return null;
}
