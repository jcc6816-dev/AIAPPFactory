import { getSceneTemplateById } from "@/services/form-templates";

export interface UseCaseLandingPage {
  slug: string;
  templateId: string;
  title: string;
  zhTitle: string;
  eyebrow: string;
  zhEyebrow: string;
  description: string;
  zhDescription: string;
  searchIntent: string;
  zhSearchIntent: string;
  painPoints: string[];
  zhPainPoints: string[];
  workflow: string[];
  zhWorkflow: string[];
  proofPoints: string[];
  zhProofPoints: string[];
  cta: string;
  zhCta: string;
  prompt: string;
  zhPrompt: string;
  keywords: string[];
  zhKeywords: string[];
  relatedSlugs: string[];
}

export const useCaseLandingPages: UseCaseLandingPage[] = [
  {
    slug: "typeform-alternative-webhooks",
    templateId: "lead-capture",
    title: "Typeform Alternative with Webhooks",
    zhTitle: "带 Webhook 的 Typeform 替代方案",
    eyebrow: "Lower-cost form automation",
    zhEyebrow: "低成本表单自动化",
    description:
      "Create Typeform-like forms, publish them fast, and send submissions to your own workflow without climbing into enterprise pricing.",
    zhDescription:
      "快速创建类 Typeform 的高转化表单，并把提交数据通过 Webhook 推送到你的业务流程，不必一开始就承担高价套餐。",
    searchIntent: "Users looking for a cheaper Typeform-style form builder with webhook delivery.",
    zhSearchIntent: "正在寻找更低成本、支持 Webhook 的 Typeform 风格表单工具。",
    painPoints: [
      "Traditional form builders often gate webhooks or branding removal behind expensive tiers.",
      "Manual builders still require too much field-by-field setup.",
      "Teams need submission logs and retry visibility, not just a pretty form.",
    ],
    zhPainPoints: [
      "传统表单工具常把 Webhook 或去品牌放在更高价套餐。",
      "手工搭建仍然需要逐字段配置，启动成本高。",
      "团队不只需要漂亮表单，也需要提交日志和重试可见性。",
    ],
    workflow: [
      "Start from the lead capture template or describe your use case in one prompt.",
      "Review the generated Typeform-like flow and visual theme.",
      "Publish, share, and connect submissions to your webhook endpoint.",
    ],
    zhWorkflow: [
      "从线索收集模板开始，或用一句话描述你的表单场景。",
      "检查生成的单题流体验和视觉主题。",
      "发布分享，并把提交数据推送到你的 Webhook 地址。",
    ],
    proofPoints: [
      "AI prompt-to-form generation",
      "Typeform-like single-question flow",
      "Webhook delivery with logs",
      "Starter pricing below traditional form builders",
    ],
    zhProofPoints: [
      "AI 一句话生成表单",
      "类 Typeform 单题流填写体验",
      "Webhook 推送与日志",
      "低于传统表单工具的入门价格",
    ],
    cta: "Create a webhook form",
    zhCta: "创建 Webhook 表单",
    prompt:
      "Create a Typeform-style lead capture form with webhook delivery, clean sales fields, and a short conversion-focused flow.",
    zhPrompt:
      "创建一个类 Typeform 的线索收集表单，带 Webhook 推送、销售跟进字段和短流程转化体验。",
    keywords: [
      "Typeform alternative",
      "form builder with webhooks",
      "Typeform webhook alternative",
      "AI form builder",
    ],
    zhKeywords: ["Typeform 替代", "Webhook 表单", "AI 表单生成", "低成本表单工具"],
    relatedSlugs: [
      "ai-lead-capture-form-builder",
      "feishu-dingtalk-form-notifications",
      "waitlist-form-builder-indie-hackers",
    ],
  },
  {
    slug: "feishu-dingtalk-form-notifications",
    templateId: "event-registration",
    title: "Feishu and DingTalk Form Notifications",
    zhTitle: "飞书和钉钉表单通知工具",
    eyebrow: "Form submissions into team chat",
    zhEyebrow: "表单提交进入团队群",
    description:
      "Turn public forms into operational notifications for Feishu, DingTalk, WeCom, Slack, or generic webhook workflows.",
    zhDescription:
      "把公开表单提交变成飞书、钉钉、企业微信、Slack 或通用 Webhook 工作流里的实时通知。",
    searchIntent: "Teams searching for form submission notifications in Feishu, DingTalk, or chat bots.",
    zhSearchIntent: "团队想把表单提交实时推送到飞书、钉钉或群机器人。",
    painPoints: [
      "Many form tools are built around email notifications only.",
      "Operations teams need instant group visibility, not delayed exports.",
      "Notification setup should stay simple for non-developers.",
    ],
    zhPainPoints: [
      "很多表单工具仍然以邮件通知为主。",
      "运营团队需要实时群通知，而不是事后导出。",
      "通知配置应该让非开发人员也能上手。",
    ],
    workflow: [
      "Choose a registration, contact, or feedback template.",
      "Publish the form and collect user submissions.",
      "Route new submissions to Feishu, DingTalk, WeCom, Slack, or generic webhook logs.",
    ],
    zhWorkflow: [
      "选择活动报名、联系我们或反馈模板。",
      "发布表单并开始收集用户提交。",
      "把新提交推送到飞书、钉钉、企微、Slack 或通用 Webhook 日志。",
    ],
    proofPoints: [
      "Feishu and DingTalk-friendly presets",
      "Webhook logs and retry visibility",
      "Public links and QR codes",
      "Template-first setup",
    ],
    zhProofPoints: [
      "飞书和钉钉友好的预设",
      "Webhook 日志与重试可见性",
      "公开链接和二维码",
      "从模板快速配置",
    ],
    cta: "Create notification form",
    zhCta: "创建通知表单",
    prompt:
      "Create an event registration form that sends every new submission to a Feishu or DingTalk notification workflow.",
    zhPrompt: "创建一个活动报名表单，并把每次新提交推送到飞书或钉钉通知流程。",
    keywords: [
      "Feishu form notification",
      "DingTalk form webhook",
      "form to team chat",
      "webhook form automation",
    ],
    zhKeywords: ["飞书表单通知", "钉钉表单推送", "表单群机器人", "Webhook 自动化"],
    relatedSlugs: [
      "typeform-alternative-webhooks",
      "ai-lead-capture-form-builder",
      "waitlist-form-builder-indie-hackers",
    ],
  },
  {
    slug: "ai-lead-capture-form-builder",
    templateId: "lead-capture",
    title: "AI Lead Capture Form Builder",
    zhTitle: "AI 线索收集表单生成器",
    eyebrow: "Prompt-to-lead-form",
    zhEyebrow: "一句话生成线索表单",
    description:
      "Generate a lead capture form from a prompt, tune the fields, publish it, and start collecting prospects from your site or campaign.",
    zhDescription:
      "用一句话生成线索收集表单，调整字段后直接发布，用于官网、活动页或营销 campaign 获客。",
    searchIntent: "SaaS and marketing teams searching for a fast lead capture form builder.",
    zhSearchIntent: "SaaS 和营销团队想快速创建线索收集表单。",
    painPoints: [
      "Blank form builders slow down campaign launches.",
      "Generic forms miss sales qualification context.",
      "Teams need a usable form and a shareable link immediately.",
    ],
    zhPainPoints: [
      "从空白表单开始会拖慢活动上线。",
      "通用表单缺少销售线索筛选语境。",
      "团队需要马上可用的表单和分享链接。",
    ],
    workflow: [
      "Describe your audience, offer, and sales questions.",
      "Let AI draft the title, description, fields, and flow.",
      "Publish the form and review submissions from the console.",
    ],
    zhWorkflow: [
      "描述目标用户、产品卖点和销售问题。",
      "让 AI 生成标题、说明、字段和填写流程。",
      "发布表单，并在控制台查看提交数据。",
    ],
    proofPoints: [
      "Lead capture template",
      "AI field generation",
      "Submission dashboard",
      "Webhook-ready handoff",
    ],
    zhProofPoints: [
      "线索收集模板",
      "AI 字段生成",
      "提交数据面板",
      "可接 Webhook 的后续流转",
    ],
    cta: "Create AI lead capture form",
    zhCta: "创建线索表单",
    prompt:
      "Create a lead capture form for a SaaS product launch with company size, use case, budget, timeline, and contact fields.",
    zhPrompt: "为 SaaS 产品上线创建线索收集表单，包含公司规模、使用场景、预算、时间计划和联系方式。",
    keywords: [
      "AI lead capture form",
      "lead generation form builder",
      "SaaS lead form",
      "prompt to form",
    ],
    zhKeywords: ["AI 线索表单", "获客表单生成器", "SaaS 线索收集", "一句话生成表单"],
    relatedSlugs: [
      "typeform-alternative-webhooks",
      "waitlist-form-builder-indie-hackers",
      "feishu-dingtalk-form-notifications",
    ],
  },
  {
    slug: "waitlist-form-builder-indie-hackers",
    templateId: "waitlist",
    title: "Waitlist Form Builder for Indie Hackers",
    zhTitle: "独立开发者 Waitlist 表单生成器",
    eyebrow: "Launch before the product is finished",
    zhEyebrow: "产品完成前先收集早期用户",
    description:
      "Launch a polished waitlist form, collect early users, and route signups into your launch workflow before the product is fully built.",
    zhDescription:
      "快速发布高颜值 Waitlist 表单，在产品完全做完前收集早期用户，并把报名数据接入你的上线流程。",
    searchIntent: "Indie hackers and startup founders searching for a quick waitlist form.",
    zhSearchIntent: "独立开发者和创业者想快速创建产品候补名单表单。",
    painPoints: [
      "Indie products need validation before full development.",
      "Most waitlist forms look generic and do not explain the offer.",
      "Founders need export, webhook, and follow-up readiness.",
    ],
    zhPainPoints: [
      "独立产品需要在完整开发前先验证需求。",
      "普通 Waitlist 表单太泛，无法讲清产品价值。",
      "创始人需要导出、Webhook 和后续跟进能力。",
    ],
    workflow: [
      "Start from the waitlist template and describe your product idea.",
      "Use AI to tailor the signup questions and positioning copy.",
      "Publish the waitlist and track signups from the console.",
    ],
    zhWorkflow: [
      "从 Waitlist 模板开始，描述你的产品想法。",
      "用 AI 调整报名问题和产品定位文案。",
      "发布候补名单，并在控制台跟踪报名数据。",
    ],
    proofPoints: [
      "Waitlist template",
      "AI positioning copy",
      "Share link and QR code",
      "Submission tracking",
    ],
    zhProofPoints: [
      "候补名单模板",
      "AI 产品定位文案",
      "分享链接和二维码",
      "报名数据追踪",
    ],
    cta: "Create waitlist form",
    zhCta: "创建 Waitlist 表单",
    prompt:
      "Create a waitlist form for an indie SaaS launch with early access, role, use case, and contact fields.",
    zhPrompt: "为独立 SaaS 产品发布创建 Waitlist 表单，包含早期访问、用户角色、使用场景和联系方式。",
    keywords: [
      "waitlist form builder",
      "indie hacker waitlist",
      "startup waitlist form",
      "AI waitlist form",
    ],
    zhKeywords: ["Waitlist 表单", "独立开发者候补名单", "创业项目报名表", "AI 候补名单表单"],
    relatedSlugs: [
      "ai-lead-capture-form-builder",
      "typeform-alternative-webhooks",
      "feishu-dingtalk-form-notifications",
    ],
  },
  {
    slug: "google-forms-alternative-ai",
    templateId: "contact-us",
    title: "Google Forms Alternative with AI",
    zhTitle: "带 AI 的 Google Forms 替代方案",
    eyebrow: "AI-native form creation",
    zhEyebrow: "AI 原生表单创建",
    description:
      "Move beyond blank Google Forms by generating polished forms from a prompt, publishing share links, and routing responses into your workflow.",
    zhDescription:
      "不再从空白 Google Forms 开始，而是用一句话生成高颜值表单，发布分享链接，并把回复接入你的业务流程。",
    searchIntent: "Users comparing Google Forms alternatives that are faster to create and easier to connect.",
    zhSearchIntent: "用户正在比较比 Google Forms 更快创建、更容易连接业务流程的替代工具。",
    painPoints: [
      "Blank forms are simple, but they still require manual structure and copywriting.",
      "Teams often outgrow basic response collection when they need workflow handoff.",
      "A public form should look product-ready without heavy design work.",
    ],
    zhPainPoints: [
      "空白表单很简单，但字段结构和文案仍要手工设计。",
      "当团队需要后续流转时，基础回复收集很快不够用。",
      "公开表单应该默认具备产品级观感，而不是临时问卷感。",
    ],
    workflow: [
      "Describe the form you need instead of building every field manually.",
      "Use the generated draft as a starting point and adjust fields or theme.",
      "Publish a share link and review responses from the GenForms console.",
    ],
    zhWorkflow: [
      "直接描述你需要的表单，而不是手工逐个添加字段。",
      "以 AI 生成草稿为起点，调整字段和主题。",
      "发布分享链接，并在 GenForms 控制台查看回复。",
    ],
    proofPoints: [
      "Prompt-to-form generation",
      "Polished public share pages",
      "Response dashboard",
      "Webhook-ready workflow handoff",
    ],
    zhProofPoints: [
      "一句话生成表单",
      "高颜值公开分享页",
      "回复数据面板",
      "可接 Webhook 的流程流转",
    ],
    cta: "Try the Google Forms alternative",
    zhCta: "创建 AI 表单",
    prompt:
      "Create a polished contact form as a Google Forms alternative with clear fields, short copy, and webhook-ready response handling.",
    zhPrompt:
      "创建一个可替代 Google Forms 的高颜值联系表单，包含清晰字段、简短文案和可接 Webhook 的回复流转。",
    keywords: [
      "Google Forms alternative",
      "AI form builder",
      "Google Forms AI alternative",
      "online form builder",
    ],
    zhKeywords: ["Google Forms 替代", "AI 表单工具", "在线表单生成器", "表单自动生成"],
    relatedSlugs: [
      "typeform-alternative-webhooks",
      "ai-lead-capture-form-builder",
      "customer-feedback-form-builder",
    ],
  },
  {
    slug: "webhook-form-builder-retry-logs",
    templateId: "contact-us",
    title: "Webhook Form Builder with Retry Logs",
    zhTitle: "带重试日志的 Webhook 表单生成器",
    eyebrow: "Reliable submission delivery",
    zhEyebrow: "可靠提交推送",
    description:
      "Build forms that do more than collect responses: publish them, deliver submissions to a webhook, and inspect delivery status when something fails.",
    zhDescription:
      "创建不只收集回复的表单：发布后把提交推送到 Webhook，并在失败时查看推送状态和日志。",
    searchIntent: "Teams looking for a form builder with webhook delivery, retry visibility, and submission logs.",
    zhSearchIntent: "团队正在寻找支持 Webhook 推送、重试可见性和提交日志的表单工具。",
    painPoints: [
      "Webhook failures are hard to debug when the form builder only shows a final status.",
      "Operations teams need delivery evidence before trusting a public form workflow.",
      "Developers want payload handoff without building the entire form UI themselves.",
    ],
    zhPainPoints: [
      "如果表单工具只显示最终状态，Webhook 失败很难排查。",
      "运营团队需要推送证据，才敢把公开表单接入业务流程。",
      "开发者希望拿到数据推送，而不是自己从零搭建表单 UI。",
    ],
    workflow: [
      "Generate or choose a form template for your intake workflow.",
      "Configure the webhook destination and publish the public link.",
      "Review submissions, delivery status, and retry history from the console.",
    ],
    zhWorkflow: [
      "生成或选择适合收集流程的表单模板。",
      "配置 Webhook 目标地址并发布公开链接。",
      "在控制台查看提交、推送状态和重试历史。",
    ],
    proofPoints: [
      "Webhook delivery",
      "Delivery logs",
      "Retry visibility",
      "Published share links",
    ],
    zhProofPoints: ["Webhook 推送", "推送日志", "重试可见性", "公开分享链接"],
    cta: "Create webhook workflow",
    zhCta: "创建 Webhook 流程",
    prompt:
      "Create a webhook-ready intake form with contact fields, request details, and delivery-friendly response structure.",
    zhPrompt: "创建一个支持 Webhook 的信息收集表单，包含联系字段、需求详情和适合推送的数据结构。",
    keywords: [
      "form builder with webhook logs",
      "webhook form builder",
      "form webhook retry",
      "submission delivery logs",
    ],
    zhKeywords: ["Webhook 表单生成器", "表单推送日志", "Webhook 重试", "提交数据推送"],
    relatedSlugs: [
      "typeform-alternative-webhooks",
      "feishu-dingtalk-form-notifications",
      "google-forms-alternative-ai",
    ],
  },
  {
    slug: "ai-event-registration-form-builder",
    templateId: "event-registration",
    title: "AI Event Registration Form Builder",
    zhTitle: "AI 活动报名表单生成器",
    eyebrow: "Launch event signup faster",
    zhEyebrow: "更快发布活动报名",
    description:
      "Generate an event registration form with attendee details, session preferences, share links, QR codes, and submission tracking.",
    zhDescription:
      "生成活动报名表单，收集参会人信息、场次偏好，支持分享链接、二维码和报名数据追踪。",
    searchIntent: "Event teams searching for a fast AI event registration form builder.",
    zhSearchIntent: "活动团队想快速创建可发布、可追踪的 AI 活动报名表单。",
    painPoints: [
      "Event forms need to be launched quickly when promotion starts.",
      "Registration questions often change by audience, session, or campaign.",
      "Teams need a shareable link and QR code without waiting for developers.",
    ],
    zhPainPoints: [
      "活动推广一开始，报名表单就需要马上上线。",
      "报名问题经常会因受众、场次或 campaign 调整。",
      "团队需要无需开发介入的分享链接和二维码。",
    ],
    workflow: [
      "Start from the event registration template or describe the event in one prompt.",
      "Adjust attendee fields, session options, and confirmation copy.",
      "Publish the form and track registrations from the console.",
    ],
    zhWorkflow: [
      "从活动报名模板开始，或用一句话描述活动。",
      "调整参会字段、场次选项和确认文案。",
      "发布表单，并在控制台追踪报名数据。",
    ],
    proofPoints: [
      "Event registration template",
      "QR code sharing",
      "Mobile-first signup flow",
      "Submission tracking",
    ],
    zhProofPoints: ["活动报名模板", "二维码分享", "移动端优先报名", "报名数据追踪"],
    cta: "Create AI event registration form",
    zhCta: "创建活动报名表",
    prompt:
      "Create an event registration form with attendee profile, session selection, contact fields, and a concise mobile-first signup flow.",
    zhPrompt: "创建一个活动报名表单，包含参会人资料、场次选择、联系方式和简洁的移动端报名流程。",
    keywords: [
      "AI event registration form",
      "event signup form builder",
      "event registration template",
      "QR code registration form",
    ],
    zhKeywords: ["AI 活动报名表", "活动报名表单生成器", "活动报名模板", "二维码报名表"],
    relatedSlugs: [
      "feishu-dingtalk-form-notifications",
      "ai-lead-capture-form-builder",
      "customer-feedback-form-builder",
    ],
  },
  {
    slug: "customer-feedback-form-builder",
    templateId: "event-feedback",
    title: "Customer Feedback Form Builder",
    zhTitle: "客户反馈表单生成器",
    eyebrow: "Collect feedback without friction",
    zhEyebrow: "低摩擦收集反馈",
    description:
      "Create customer feedback forms that feel lightweight, look polished, and give teams a clear place to review responses.",
    zhDescription:
      "创建轻量、高颜值的客户反馈表单，让用户更愿意填写，也让团队有清晰位置查看反馈。",
    searchIntent: "Product, support, and customer success teams looking for a better feedback form builder.",
    zhSearchIntent: "产品、客服和客户成功团队正在寻找更好用的反馈表单工具。",
    painPoints: [
      "Feedback forms fail when they feel too long or too generic.",
      "Teams need structured responses, not scattered messages across channels.",
      "A polished feedback flow can improve completion and trust.",
    ],
    zhPainPoints: [
      "反馈表单太长或太泛时，用户很容易放弃填写。",
      "团队需要结构化反馈，而不是散落在各个渠道的信息。",
      "更精致的反馈流程能提升完成率和信任感。",
    ],
    workflow: [
      "Choose a feedback template or describe the customer moment you want to measure.",
      "Use AI to generate focused questions and a short flow.",
      "Publish the feedback link and review responses from the dashboard.",
    ],
    zhWorkflow: [
      "选择反馈模板，或描述你想衡量的客户触点。",
      "用 AI 生成聚焦问题和短流程。",
      "发布反馈链接，并在数据面板查看回复。",
    ],
    proofPoints: [
      "Feedback template",
      "Short single-question flow",
      "Response dashboard",
      "Shareable public link",
    ],
    zhProofPoints: ["反馈模板", "短单题流", "回复数据面板", "公开分享链接"],
    cta: "Create feedback form",
    zhCta: "创建反馈表单",
    prompt:
      "Create a customer feedback form with satisfaction rating, open comments, product context, and a short mobile-friendly flow.",
    zhPrompt: "创建一个客户反馈表单，包含满意度评分、开放建议、产品语境和简洁的移动端填写流程。",
    keywords: [
      "customer feedback form builder",
      "AI feedback form",
      "feedback survey form",
      "customer satisfaction form",
    ],
    zhKeywords: ["客户反馈表单", "AI 反馈表单", "满意度反馈", "反馈问卷生成器"],
    relatedSlugs: [
      "ai-event-registration-form-builder",
      "google-forms-alternative-ai",
      "ai-lead-capture-form-builder",
    ],
  },
  {
    slug: "contact-form-builder-for-websites",
    templateId: "contact-us",
    title: "Contact Form Builder for Websites",
    zhTitle: "网站联系我们表单生成器",
    eyebrow: "Website inquiry intake",
    zhEyebrow: "官网咨询收集",
    description:
      "Create a polished contact form for your website, collect inquiries, and route new messages into your follow-up workflow.",
    zhDescription:
      "为官网创建高颜值联系我们表单，收集咨询信息，并把新消息接入后续跟进流程。",
    searchIntent: "Website owners looking for an easy contact form builder with share links and workflow handoff.",
    zhSearchIntent: "网站所有者想要一个易用、可分享、可接业务流程的联系我们表单工具。",
    painPoints: [
      "A generic contact form can make a serious website feel unfinished.",
      "Business inquiries need enough context for follow-up, not just an email field.",
      "Teams need a simple way to publish and route messages.",
    ],
    zhPainPoints: [
      "普通联系我们表单会让认真做的网站显得不完整。",
      "业务咨询需要足够语境，不能只有一个邮箱字段。",
      "团队需要简单地发布并流转咨询消息。",
    ],
    workflow: [
      "Start from the contact form template and describe your website or service.",
      "Adjust inquiry type, contact fields, and follow-up context.",
      "Publish the form link or connect submissions to a webhook workflow.",
    ],
    zhWorkflow: [
      "从联系我们模板开始，描述你的网站或服务。",
      "调整咨询类型、联系方式和跟进语境。",
      "发布表单链接，或把提交接入 Webhook 流程。",
    ],
    proofPoints: [
      "Contact form template",
      "AI-generated inquiry fields",
      "Public share link",
      "Webhook-ready routing",
    ],
    zhProofPoints: ["联系我们模板", "AI 生成咨询字段", "公开分享链接", "可接 Webhook 流转"],
    cta: "Create contact form",
    zhCta: "创建联系表单",
    prompt:
      "Create a website contact form with service type, contact details, inquiry summary, and a clean professional layout.",
    zhPrompt: "创建一个官网联系我们表单，包含服务类型、联系方式、咨询摘要和简洁专业的布局。",
    keywords: [
      "contact form builder",
      "website contact form",
      "AI contact form",
      "business inquiry form",
    ],
    zhKeywords: ["联系表单生成器", "网站联系我们表单", "AI 联系表单", "业务咨询表单"],
    relatedSlugs: [
      "google-forms-alternative-ai",
      "webhook-form-builder-retry-logs",
      "ai-lead-capture-form-builder",
    ],
  },
  {
    slug: "qr-code-form-builder",
    templateId: "event-registration",
    title: "QR Code Form Builder",
    zhTitle: "二维码表单生成器",
    eyebrow: "Share forms offline and online",
    zhEyebrow: "线上线下都能分享",
    description:
      "Create a form, publish it as a share link, and use QR code access for events, counters, posters, classrooms, or field collection.",
    zhDescription:
      "创建表单并发布分享链接，通过二维码用于活动、柜台、海报、课堂或线下信息收集。",
    searchIntent: "Users searching for a form builder that supports QR code sharing for real-world collection.",
    zhSearchIntent: "用户想找支持二维码分享、适合线下收集场景的表单生成器。",
    painPoints: [
      "Offline collection needs a fast way to move people from poster or counter to form.",
      "Long URLs are hard to share in physical spaces.",
      "Teams need the same response dashboard whether submissions come from web or QR code.",
    ],
    zhPainPoints: [
      "线下收集需要让用户从海报或柜台快速进入表单。",
      "长链接不适合在物理空间传播。",
      "无论来自网页还是二维码，团队都需要同一个回复数据面板。",
    ],
    workflow: [
      "Generate a form for the offline or event collection scenario.",
      "Publish the share page and use the QR code for scanning access.",
      "Collect submissions and review them from the same dashboard.",
    ],
    zhWorkflow: [
      "为线下或活动收集场景生成表单。",
      "发布分享页，并使用二维码让用户扫码进入。",
      "收集提交，并在同一个数据面板查看。",
    ],
    proofPoints: [
      "Published form links",
      "QR code sharing",
      "Mobile-first filling",
      "Submission dashboard",
    ],
    zhProofPoints: ["公开表单链接", "二维码分享", "移动端优先填写", "提交数据面板"],
    cta: "Create QR form",
    zhCta: "创建二维码表单",
    prompt:
      "Create a QR-code-friendly registration form for an offline event with short mobile questions and clear contact fields.",
    zhPrompt: "创建一个适合二维码扫码填写的线下活动报名表，包含简短移动端问题和清晰联系方式字段。",
    keywords: [
      "QR code form builder",
      "form with QR code",
      "event QR registration form",
      "mobile form builder",
    ],
    zhKeywords: ["二维码表单生成器", "扫码表单", "二维码报名表", "移动端表单"],
    relatedSlugs: [
      "ai-event-registration-form-builder",
      "contact-form-builder-for-websites",
      "customer-feedback-form-builder",
    ],
  },
];

export function getUseCaseLandingPage(slug: string) {
  return useCaseLandingPages.find((page) => page.slug === slug);
}

export function getUseCaseLandingPagesWithTemplates() {
  return useCaseLandingPages
    .map((page) => ({
      ...page,
      template: getSceneTemplateById(page.templateId),
    }))
    .filter((page) => page.template);
}
