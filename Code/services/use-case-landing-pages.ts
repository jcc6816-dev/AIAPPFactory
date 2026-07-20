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
  recommendedFields?: string[];
  zhRecommendedFields?: string[];
  recommendedFieldsHeading?: string;
  zhRecommendedFieldsHeading?: string;
  recommendedFieldsDescription?: string;
  zhRecommendedFieldsDescription?: string;
  templateLinkLabel?: string;
  zhTemplateLinkLabel?: string;
  ctaBadge?: string;
  zhCtaBadge?: string;
  cta: string;
  zhCta: string;
  prompt: string;
  zhPrompt: string;
  keywords: string[];
  zhKeywords: string[];
  relatedSlugs: string[];
  intentBlocks?: UseCaseIntentBlock[];
  zhIntentBlocks?: UseCaseIntentBlock[];
  faqItems?: UseCaseFaqItem[];
  zhFaqItems?: UseCaseFaqItem[];
}

export interface UseCaseIntentBlock {
  title: string;
  description: string;
  items: string[];
}

export interface UseCaseFaqItem {
  question: string;
  answer: string;
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
      "Generate a lead capture form from a prompt, qualify visitors with the right questions, publish it, and route submissions into your follow-up workflow.",
    zhDescription:
      "用一句话生成线索收集表单，用合适问题筛选访客，发布后把提交接入后续跟进流程。",
    searchIntent: "SaaS and marketing teams searching for a fast lead capture form builder.",
    zhSearchIntent: "SaaS 和营销团队想快速创建线索收集表单。",
    painPoints: [
      "Blank form builders slow down campaign launches.",
      "Generic forms miss sales qualification context and collect leads without priority signals.",
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
      "AI field generation for qualification questions",
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
      "webhook-form-builder-retry-logs",
      "quote-request-form-builder",
      "demo-request-form-builder",
      "waitlist-form-builder-indie-hackers",
    ],
    intentBlocks: [
      {
        title: "Lead qualification questions",
        description:
          "A lead capture form should do more than ask for an email. Use a short set of questions to understand fit without slowing down conversion.",
        items: [
          "What are you trying to solve?",
          "What is your company size or team size?",
          "When do you plan to launch or evaluate a solution?",
          "Which tools should this connect to after submission?",
          "What priority level should your team assign to this request?",
        ],
      },
      {
        title: "Common lead capture workflows",
        description:
          "Start from the same form engine, then adjust the fields for the intent behind the campaign.",
        items: [
          "SaaS demo request: company size, use case, timeline, and contact details.",
          "Lead magnet download: role, interest area, consent, and delivery email.",
          "Newsletter signup: topic interest and optional company context.",
          "Consultation request: problem summary, urgency, budget range, and preferred contact method.",
          "Event inquiry: attendee type, question topic, and follow-up channel.",
        ],
      },
      {
        title: "After submission",
        description:
          "Review submissions in the dashboard, then route qualified entries through webhook or your existing follow-up workflow. GenForms is a lightweight capture layer, not a full CRM.",
        items: [
          "Use the dashboard to inspect new leads before follow-up.",
          "Send qualified submissions into a webhook-ready workflow.",
          "Keep CRM language conservative unless a native integration is actually configured.",
        ],
      },
    ],
    zhIntentBlocks: [
      {
        title: "线索筛选问题",
        description:
          "线索表单不应该只收邮箱。用少量问题判断匹配度，同时避免拉长填写流程。",
        items: [
          "你现在想解决什么问题？",
          "你的公司或团队规模是多少？",
          "你计划什么时候上线或评估方案？",
          "提交后希望接入哪些工具或流程？",
          "这条线索对团队来说属于什么优先级？",
        ],
      },
      {
        title: "常见线索收集场景",
        description:
          "使用同一套表单生成能力，根据 campaign 背后的意图调整字段。",
        items: [
          "SaaS demo 申请：公司规模、使用场景、时间计划和联系方式。",
          "资料下载：角色、兴趣方向、授权同意和接收邮箱。",
          "Newsletter 订阅：主题兴趣和可选公司语境。",
          "咨询预约：问题摘要、紧急程度、预算范围和首选联系方式。",
          "活动咨询：参会人类型、问题主题和后续联系渠道。",
        ],
      },
      {
        title: "提交后的流转",
        description:
          "先在数据面板查看提交，再把合格线索通过 Webhook 或现有跟进流程流转。GenForms 是轻量线索收集层，不是完整 CRM。",
        items: [
          "在数据面板查看新线索，再决定跟进动作。",
          "把合格提交推送到 Webhook-ready 工作流。",
          "除非已配置原生集成，否则 CRM 表述保持保守。",
        ],
      },
    ],
    faqItems: [
      {
        question: "What is an AI lead capture form?",
        answer:
          "It is a public form generated from a prompt that collects contact details and qualification context, then gives your team a dashboard and workflow handoff for follow-up.",
      },
      {
        question: "What questions should a lead capture form ask?",
        answer:
          "Ask only what helps follow-up: contact details, problem or use case, company size, timeline, and an optional priority or budget signal.",
      },
      {
        question: "Can I send captured leads into my CRM workflow?",
        answer:
          "You can route submissions through webhook or an existing follow-up workflow. GenForms does not claim to replace a full CRM or native two-way CRM sync.",
      },
      {
        question: "Do I need a full CRM to start collecting leads?",
        answer:
          "No. You can start with a published lead capture form, review submissions in the dashboard, and add workflow routing when the process needs it.",
      },
      {
        question: "Can I use this as a lead capture template?",
        answer:
          "Yes. Start from the lead capture template, then use AI to adapt the questions, copy, and flow for your SaaS demo, lead magnet, newsletter, or consultation workflow.",
      },
    ],
    zhFaqItems: [
      {
        question: "什么是 AI 线索收集表单？",
        answer:
          "它是由一句话生成的公开表单，用来收集联系方式和筛选语境，并让团队在数据面板中查看提交、接入后续跟进流程。",
      },
      {
        question: "线索收集表单应该问哪些问题？",
        answer:
          "只问对跟进有帮助的问题：联系方式、问题或使用场景、公司规模、时间计划，以及可选的优先级或预算信号。",
      },
      {
        question: "收集到的线索可以进入 CRM 流程吗？",
        answer:
          "可以通过 Webhook 或现有跟进流程流转提交数据。GenForms 不把自己包装成完整 CRM，也不承诺原生双向 CRM 同步。",
      },
      {
        question: "一开始必须使用完整 CRM 吗？",
        answer:
          "不需要。你可以先发布线索表单，在数据面板查看提交，等流程复杂后再增加 Webhook 或其他流转方式。",
      },
      {
        question: "这个页面可以当作线索收集模板使用吗？",
        answer:
          "可以。从线索收集模板开始，再用 AI 调整问题、文案和流程，适配 SaaS demo、资料下载、订阅或咨询预约等场景。",
      },
    ],
  },
  {
    slug: "quote-request-form-builder",
    templateId: "quote-request",
    title: "AI Quote Request Form Builder",
    zhTitle: "AI 询价需求表单生成器",
    eyebrow: "Collect scope before the sales call",
    zhEyebrow: "销售跟进前先收集需求范围",
    description:
      "Create a mobile-friendly request-a-quote form for service needs, project scope, budget, timeline, and contact details. Share it by link or QR code, review responses, export CSV, and route qualified requests through webhook-ready follow-up.",
    zhDescription:
      "用 AI 创建适合手机填写的询价需求表，收集服务类型、项目范围、预算、时间和联系方式；通过链接或二维码分享，在数据面板查看回复、导出 CSV，并接入 Webhook-ready 后续跟进。",
    searchIntent:
      "Service businesses and agencies searching for a form to collect quote requests before pricing or follow-up.",
    zhSearchIntent:
      "服务型企业和 Agency 想在定价或销售跟进前，用表单收集客户的询价需求。",
    painPoints: [
      "Generic contact forms do not collect enough scope, budget, or timing context.",
      "Back-and-forth messages slow down qualification before a useful sales conversation.",
      "Teams need structured requests they can review, export, and route into follow-up.",
    ],
    zhPainPoints: [
      "通用联系表单无法收集足够的项目范围、预算和时间信息。",
      "反复沟通会拖慢销售在有效对话前的需求筛选。",
      "团队需要可查看、导出并继续流转的结构化询价需求。",
    ],
    workflow: [
      "Describe the service inquiry and the information needed before follow-up.",
      "Let AI draft quote-request fields for contact, scope, budget, and timeline.",
      "Publish a public link or QR code, then review responses, export CSV, or route follow-up through a webhook.",
    ],
    zhWorkflow: [
      "描述服务询价场景，以及跟进前需要了解的信息。",
      "让 AI 生成联系方式、需求范围、预算和时间等询价字段。",
      "发布公开链接或二维码，再查看回复、导出 CSV，或通过 Webhook 继续跟进。",
    ],
    proofPoints: [
      "AI-generated quote request fields",
      "Mobile-friendly single-question flow",
      "Public link and QR code sharing",
      "Response dashboard and CSV export",
      "Webhook-ready follow-up",
    ],
    zhProofPoints: [
      "AI 生成询价字段",
      "移动端友好的单题流",
      "公开链接和二维码分享",
      "提交数据面板和 CSV 导出",
      "可通过 Webhook 继续流转",
    ],
    recommendedFields: [
      "Name",
      "Work email or preferred contact",
      "Company or organization",
      "Service needed",
      "Project or request summary",
      "Budget range",
      "Desired timeline",
      "Service area or project location",
      "Preferred response method",
      "Additional notes",
      "Follow-up consent",
    ],
    zhRecommendedFields: [
      "姓名",
      "工作邮箱或首选联系方式",
      "公司或组织",
      "所需服务",
      "项目或需求摘要",
      "预算范围",
      "期望时间",
      "服务地区或项目地点",
      "首选回复方式",
      "补充说明",
      "后续联系许可",
    ],
    recommendedFieldsHeading: "Collect enough context for a useful follow-up",
    zhRecommendedFieldsHeading: "收集足够信息，让后续跟进更有效",
    recommendedFieldsDescription:
      "Start with service, scope, budget, timeline, and contact details. Keep optional fields short so the request still feels easy to complete on mobile.",
    zhRecommendedFieldsDescription:
      "优先收集服务类型、需求范围、预算、时间和联系方式，并保持可选字段简短，让客户在手机上也能轻松完成。",
    templateLinkLabel: "Start with the quote request template",
    zhTemplateLinkLabel: "从询价需求模板开始",
    ctaBadge: "AI Ready • Share link / QR",
    zhCtaBadge: "AI 就绪 • 链接 / 二维码分享",
    cta: "Create a quote request form",
    zhCta: "创建询价表单",
    prompt:
      "Create a quote request form that collects contact details, service needed, project scope, budget range, desired timeline, preferred response method, notes, and follow-up consent.",
    zhPrompt:
      "创建一个询价需求表，收集联系方式、服务类型、项目范围、预算、期望时间、回复方式、补充说明和后续联系许可。",
    keywords: [
      "quote request form",
      "request a quote form",
      "quote request form builder",
      "quote request form template",
      "service quote request form",
    ],
    zhKeywords: [
      "询价需求表",
      "询价表单生成器",
      "报价请求表单",
      "询价表单模板",
      "服务询价表",
    ],
    relatedSlugs: [
      "ai-lead-capture-form-builder",
      "webhook-form-builder-retry-logs",
      "contact-form-builder-for-websites",
    ],
    intentBlocks: [
      {
        title: "A request form, not an instant quote calculator",
        description:
          "Use this workflow to collect the context a service team needs before pricing. It does not calculate prices or generate a formal proposal.",
        items: [
          "Ask which service the prospect needs and what outcome they expect.",
          "Collect a budget range and desired timeline as qualification signals.",
          "Keep pricing formulas, CPQ, formal quotes, and payments outside the page promise.",
        ],
      },
      {
        title: "Share one form across inquiry channels",
        description:
          "Publish the request flow as a public link or QR code for service pages, campaigns, printed materials, or direct outreach.",
        items: [
          "Use a public link from a service page or call-to-action button.",
          "Use QR access at a studio, venue, event, counter, or printed proposal deck.",
          "Keep the flow concise for prospects completing it on mobile.",
        ],
      },
      {
        title: "Review and route qualified requests",
        description:
          "Review structured submissions in the dashboard, export CSV, or send them into a webhook-ready follow-up path.",
        items: [
          "Inspect scope, budget, and timeline before a sales conversation.",
          "Export requests as CSV for spreadsheet-based review.",
          "Use webhook or bot paths for follow-up without claiming native CRM sync or dispatch.",
        ],
      },
    ],
    zhIntentBlocks: [
      {
        title: "这是需求收集表，不是自动报价计算器",
        description:
          "这个流程用于收集服务团队在定价前需要了解的背景，不会自动计算价格或生成正式报价单。",
        items: [
          "询问客户需要哪类服务，以及希望达成什么结果。",
          "把预算范围和期望时间作为线索筛选信号。",
          "不承诺定价公式、CPQ、正式报价单或支付能力。",
        ],
      },
      {
        title: "在不同询价入口复用同一张表",
        description:
          "把询价流程发布为公开链接或二维码，用于服务页面、营销活动、印刷材料或直接沟通。",
        items: [
          "从服务页面或 CTA 按钮链接到公开表单。",
          "在工作室、活动、柜台或印刷材料上使用二维码入口。",
          "保持填写流程简短，方便客户在手机上完成。",
        ],
      },
      {
        title: "查看并流转合格询价",
        description:
          "在数据面板查看结构化提交、导出 CSV，或把询价接入 Webhook-ready 后续路径。",
        items: [
          "在销售沟通前查看需求范围、预算和时间。",
          "导出 CSV 做表格筛选和团队复核。",
          "通过 Webhook 或机器人路径跟进，但不承诺原生 CRM 同步或派单。",
        ],
      },
    ],
    faqItems: [
      {
        question: "Can I create a quote request form with AI?",
        answer:
          "Yes. Describe the service and the context your team needs, then use AI to draft a mobile-friendly form for contact details, scope, budget, timeline, and follow-up consent.",
      },
      {
        question: "What fields should a quote request form include?",
        answer:
          "Start with name, contact details, company, service needed, project summary, budget range, desired timeline, preferred response method, and optional follow-up consent.",
      },
      {
        question: "Can customers open the form from a QR code?",
        answer:
          "Yes. Publish the form as a public link and use QR access for service locations, events, counters, printed materials, or other scan-to-request touchpoints.",
      },
      {
        question: "Where can I review and export quote requests?",
        answer:
          "Review submissions in the GenForms response dashboard and export CSV when your team needs spreadsheet-based qualification or follow-up.",
      },
      {
        question: "Can quote requests be sent to a webhook or team bot?",
        answer:
          "Yes. You can route new requests through a generic webhook or supported bot path, with delivery logs and retry visibility for the follow-up handoff.",
      },
      {
        question: "Does GenForms calculate prices or generate formal quotes?",
        answer:
          "No. GenForms collects structured quote requests. It does not provide pricing formulas, CPQ, instant estimates, formal proposal or PDF quote generation, payments, or invoicing.",
      },
      {
        question: "Can customers upload plans or photos?",
        answer:
          "Not in this workflow. The quote request template collects text, selection, budget, timeline, and contact fields; it does not promise file, photo, plan, or blueprint uploads.",
      },
    ],
    zhFaqItems: [
      {
        question: "可以用 AI 创建询价需求表吗？",
        answer:
          "可以。描述服务类型和团队需要了解的信息，AI 就能生成适合手机填写的联系方式、需求范围、预算、时间和跟进许可字段。",
      },
      {
        question: "询价需求表应该包含哪些字段？",
        answer:
          "建议从姓名、联系方式、公司、所需服务、项目摘要、预算范围、期望时间、首选回复方式和可选跟进许可开始。",
      },
      {
        question: "客户可以通过二维码打开询价表吗？",
        answer:
          "可以。表单发布为公开链接后，可以在服务场所、活动、柜台、印刷材料或其他扫码询价触点使用二维码入口。",
      },
      {
        question: "在哪里查看和导出询价需求？",
        answer:
          "可以在 GenForms 回复数据面板查看提交，并在团队需要用表格筛选或跟进时导出 CSV。",
      },
      {
        question: "询价提交可以推送到 Webhook 或团队机器人吗？",
        answer:
          "可以。新询价可以通过通用 Webhook 或支持的机器人路径继续流转，并查看投递日志和失败重试状态。",
      },
      {
        question: "GenForms 会自动计算价格或生成正式报价单吗？",
        answer:
          "不会。GenForms 用于收集结构化询价需求，不提供定价公式、CPQ、即时估价、正式方案或 PDF 报价生成、支付和开票能力。",
      },
      {
        question: "客户可以上传图纸或照片吗？",
        answer:
          "当前这个流程不支持。询价模板收集文本、选项、预算、时间和联系方式，不承诺文件、照片、图纸或蓝图上传。",
      },
    ],
  },
  {
    slug: "demo-request-form-builder",
    templateId: "demo-request",
    title: "AI Demo Request Form Builder",
    zhTitle: "AI Demo 申请表单生成器",
    eyebrow: "Qualify interest before sales follow-up",
    zhEyebrow: "销售跟进前先收集 Demo 需求",
    description:
      "Create a B2B demo request form for work contact details, company context, team size, use case, and evaluation timeline. Share it by link or QR code, review requests, export CSV, and route follow-up through a webhook-ready path.",
    zhDescription:
      "用 AI 创建 B2B Demo 申请表，收集工作联系方式、公司背景、团队规模、使用场景和评估时间；通过链接或二维码分享，查看申请、导出 CSV，并接入 Webhook-ready 跟进路径。",
    searchIntent:
      "B2B SaaS and sales teams searching for a form to collect qualified demo requests before follow-up.",
    zhSearchIntent:
      "B2B SaaS 和销售团队想在跟进前，用表单收集更完整的 Demo 申请信息。",
    painPoints: [
      "A generic contact form does not capture enough company, use case, or evaluation context.",
      "Sales teams lose time asking the same qualification questions after every request.",
      "Teams need structured demo requests they can review, export, and route into follow-up.",
    ],
    zhPainPoints: [
      "通用联系表单无法收集足够的公司、使用场景和评估背景。",
      "销售团队需要在每次申请后重复追问同样的筛选问题。",
      "团队需要可查看、导出并继续流转的结构化 Demo 申请。",
    ],
    workflow: [
      "Describe the product and the qualification context needed before a demo follow-up.",
      "Let AI draft a concise request form for company, role, team size, use case, and timeline.",
      "Publish a public link or QR code, then review requests, export CSV, or route follow-up through a webhook.",
    ],
    zhWorkflow: [
      "描述产品，以及 Demo 跟进前需要了解的筛选背景。",
      "让 AI 生成简洁的公司、角色、团队规模、使用场景和时间计划字段。",
      "发布公开链接或二维码，再查看申请、导出 CSV，或通过 Webhook 继续跟进。",
    ],
    proofPoints: [
      "AI-generated demo request fields",
      "Mobile-friendly single-question flow",
      "Public link and QR code sharing",
      "Response dashboard and CSV export",
      "Webhook-ready follow-up",
    ],
    zhProofPoints: [
      "AI 生成 Demo 申请字段",
      "移动端友好的单题流",
      "公开链接和二维码分享",
      "提交数据面板和 CSV 导出",
      "可通过 Webhook 继续跟进",
    ],
    recommendedFields: [
      "Name",
      "Work email or preferred contact",
      "Company",
      "Role",
      "Team or company size",
      "Main use case or pain point",
      "Evaluation timeline",
      "Follow-up consent",
    ],
    zhRecommendedFields: [
      "姓名",
      "工作邮箱或首选联系方式",
      "公司",
      "角色",
      "团队或公司规模",
      "主要使用场景或痛点",
      "评估时间",
      "后续联系许可",
    ],
    recommendedFieldsHeading: "Ask only what the sales team needs before follow-up",
    zhRecommendedFieldsHeading: "只收集销售跟进前真正需要的信息",
    recommendedFieldsDescription:
      "Keep the flow focused on company fit, the problem to solve, and evaluation timing. Do not turn the request form into a calendar scheduler or a full CRM intake process.",
    zhRecommendedFieldsDescription:
      "聚焦公司匹配度、待解决问题和评估时间，不要把 Demo 申请表写成日历排期或完整 CRM 收集流程。",
    templateLinkLabel: "Start with the demo request template",
    zhTemplateLinkLabel: "从 Demo 申请模板开始",
    ctaBadge: "AI Ready • Share link / QR",
    zhCtaBadge: "AI 就绪 • 链接 / 二维码分享",
    cta: "Create a demo request form",
    zhCta: "创建 Demo 申请表",
    prompt:
      "Create a B2B demo request form that collects work contact details, company, role, team size, main use case or pain point, evaluation timeline, and follow-up consent.",
    zhPrompt:
      "创建一个 B2B Demo 申请表，收集工作联系方式、公司、角色、团队规模、主要使用场景或痛点、评估时间和后续联系许可。",
    keywords: [
      "demo request form builder",
      "demo request form template",
      "request a demo form",
      "B2B demo request form",
    ],
    zhKeywords: [
      "Demo 申请表",
      "Demo 申请表单生成器",
      "B2B Demo 申请模板",
      "产品演示申请表",
    ],
    relatedSlugs: [
      "ai-lead-capture-form-builder",
      "webhook-form-builder-retry-logs",
      "quote-request-form-builder",
    ],
    intentBlocks: [
      {
        title: "A demo request form, not a calendar scheduler",
        description:
          "Use the form to understand the prospect before follow-up. Keep time-slot selection, meeting invitations, reminders, cancellations, and rescheduling outside the page promise.",
        items: [
          "Collect the business problem and the workflow the prospect wants to improve.",
          "Ask for company size and evaluation timing as qualification context.",
          "Let the sales team decide the next step after reviewing the request.",
        ],
      },
      {
        title: "Share one request flow across campaign touchpoints",
        description:
          "Publish a public link or QR code for product pages, campaign CTAs, event materials, or direct outreach without promising an embedded form.",
        items: [
          "Link from a Request a demo button on a product or campaign page.",
          "Use QR access at events, booths, printed decks, or in-person demos.",
          "Keep the mobile flow short enough to finish in one focused session.",
        ],
      },
      {
        title: "Review and route requests without inventing a CRM",
        description:
          "Review structured submissions in the dashboard, export CSV, or use a webhook-ready path for follow-up while keeping CRM and scoring claims out of scope.",
        items: [
          "Review company, role, team size, use case, and timeline in one record.",
          "Export requests as CSV for spreadsheet-based review.",
          "Use webhook or supported bot paths without claiming native CRM sync or automatic lead scoring.",
        ],
      },
    ],
    zhIntentBlocks: [
      {
        title: "这是 Demo 申请表，不是日历排期系统",
        description:
          "用表单在跟进前理解潜在客户，不承诺时段占用、会议邀请、提醒、取消或改期。",
        items: [
          "收集业务问题和希望改善的当前流程。",
          "用公司规模和评估时间补充筛选背景。",
          "由销售团队在查看申请后决定下一步。",
        ],
      },
      {
        title: "在不同活动入口复用同一张申请表",
        description:
          "把流程发布为公开链接或二维码，用于产品页、活动 CTA、会展材料或直接沟通，不承诺 iframe 嵌入。",
        items: [
          "从产品页或活动页的 Request a demo 按钮进入。",
          "在会展、展台、印刷材料或线下演示中使用二维码。",
          "保持移动端流程简短，便于一次专注完成。",
        ],
      },
      {
        title: "查看并流转申请，不冒充 CRM",
        description:
          "在数据面板查看结构化提交、导出 CSV，或接入 Webhook-ready 跟进路径，同时把 CRM 和自动评分留在产品边界之外。",
        items: [
          "在同一条记录中查看公司、角色、团队规模、使用场景和时间。",
          "导出 CSV 进行表格式复核。",
          "使用 Webhook 或支持的机器人路径，但不承诺 CRM 原生同步或自动线索评分。",
        ],
      },
    ],
    faqItems: [
      {
        question: "What should a demo request form ask?",
        answer:
          "Ask for name, work contact, company, role, team size, the main use case or pain point, evaluation timeline, and permission for the team to follow up.",
      },
      {
        question: "Can I create a demo request form with AI?",
        answer:
          "Yes. Describe the product and the context your sales team needs, then use AI to draft and adjust a concise mobile-friendly request flow.",
      },
      {
        question: "Can prospects open the form from a public link or QR code?",
        answer:
          "Yes. Publish the form as a public link and use QR access for product pages, campaign materials, events, booths, printed decks, or direct outreach.",
      },
      {
        question: "Where can the team review or export demo requests?",
        answer:
          "Review submissions in the GenForms response dashboard and export CSV when the team needs spreadsheet-based qualification or follow-up.",
      },
      {
        question: "Can new demo requests enter a webhook or bot path?",
        answer:
          "Yes. Route new requests through a generic webhook or supported bot path, with delivery logs and failed-delivery retry visibility for the handoff.",
      },
      {
        question: "Does GenForms book a calendar time or send a meeting invite?",
        answer:
          "No. This workflow collects a demo request for team review. It does not promise real-time slots, calendar sync, meeting invitations, confirmations, reminders, cancellations, or rescheduling.",
      },
      {
        question: "Does GenForms score leads or sync natively with a CRM?",
        answer:
          "No. GenForms collects structured demo requests and supports CSV or webhook-ready follow-up; it does not provide automatic lead scoring or native CRM synchronization.",
      },
    ],
    zhFaqItems: [
      {
        question: "Demo 申请表应该问哪些问题？",
        answer:
          "建议收集姓名、工作联系方式、公司、角色、团队规模、主要使用场景或痛点、评估时间和后续联系许可。",
      },
      {
        question: "可以用 AI 创建 Demo 申请表吗？",
        answer:
          "可以。描述产品和销售团队需要了解的信息，AI 就能生成并调整简洁、适合手机填写的申请流程。",
      },
      {
        question: "潜在客户可以通过公开链接或二维码打开吗？",
        answer:
          "可以。表单发布为公开链接后，可以用于产品页、活动材料、会展、展台、印刷文档或直接沟通中的二维码入口。",
      },
      {
        question: "团队在哪里查看或导出 Demo 申请？",
        answer:
          "可以在 GenForms 回复数据面板查看提交，并在需要用表格做筛选或跟进时导出 CSV。",
      },
      {
        question: "新的 Demo 申请可以进入 Webhook 或机器人路径吗？",
        answer:
          "可以。可以把新申请接入通用 Webhook 或支持的机器人路径，并查看投递日志和失败重试状态。",
      },
      {
        question: "GenForms 会预订日历时间或发送会议邀请吗？",
        answer:
          "不会。这个流程用于收集 Demo 申请并交由团队复核，不承诺实时时段、日历同步、会议邀请、确认、提醒、取消或改期。",
      },
      {
        question: "GenForms 会自动评分线索或原生同步 CRM 吗？",
        answer:
          "不会。GenForms 用于收集结构化 Demo 申请，并支持 CSV 或 Webhook-ready 跟进；它不提供自动线索评分或 CRM 原生同步。",
      },
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
    ctaBadge: "AI Ready • Share link / QR",
    zhCtaBadge: "AI 就绪 • 链接 / 二维码分享",
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
      "webhook-form-builder-retry-logs",
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
      "Build forms that do more than collect responses: publish them, send form submissions to a webhook, and inspect delivery logs or retry status when something fails.",
    zhDescription:
      "创建不只收集回复的表单：发布后把提交推送到 Webhook，并在失败时查看推送日志、状态和重试结果。",
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
      "Delivery logs for debugging failed submissions",
      "Retry visibility",
      "Published share links",
    ],
    zhProofPoints: ["Webhook 推送", "推送日志", "重试可见性", "公开分享链接"],
    cta: "Create a webhook form",
    zhCta: "创建 Webhook 表单",
    prompt:
      "Create a webhook-ready intake form with contact fields, request details, and delivery-friendly response structure.",
    zhPrompt: "创建一个支持 Webhook 的信息收集表单，包含联系字段、需求详情和适合推送的数据结构。",
    keywords: [
      "form builder with webhook logs",
      "webhook form builder",
      "send form submissions to webhook",
      "webhook form integration",
      "form webhook retry",
      "submission delivery logs",
    ],
    zhKeywords: [
      "Webhook 表单生成器",
      "表单推送日志",
      "提交数据发送到 Webhook",
      "Webhook 表单集成",
      "Webhook 重试",
      "提交数据推送",
    ],
    relatedSlugs: [
      "typeform-alternative-webhooks",
      "ai-lead-capture-form-builder",
      "feishu-dingtalk-form-notifications",
    ],
    intentBlocks: [
      {
        title: "Illustrative webhook payload",
        description:
          "A webhook-ready form should make the handoff understandable. Actual fields depend on the form schema you publish.",
        items: [
          'form_id: "contact-us"',
          'submitted_at: "2026-06-18T10:30:00Z"',
          'fields.name: "Jane Doe"',
          'fields.email_or_phone: "jane@example.com"',
          'fields.topic: "Need a demo workflow"',
        ],
      },
      {
        title: "Common delivery states",
        description:
          "Use delivery status and logs to decide whether the issue is in the form, the endpoint, or the receiving system.",
        items: [
          "Delivered: the endpoint returned a success response.",
          "4xx client error: check the URL, authorization, payload format, or receiver configuration.",
          "5xx server error: the receiving server failed and may be suitable for retry.",
          "Timeout: the endpoint did not respond in time.",
          "Signature mismatch: check the shared secret or signature verification logic.",
        ],
      },
      {
        title: "When retry logs matter",
        description:
          "Logs help operations and developers trust public forms before connecting them to a live workflow.",
        items: [
          "Confirm whether a submission was delivered before asking the user to resubmit.",
          "Separate receiver configuration mistakes from temporary server failures.",
          "Give developers the context they need without rebuilding the form UI.",
        ],
      },
    ],
    zhIntentBlocks: [
      {
        title: "Webhook payload 示例",
        description:
          "Webhook-ready 表单应该让数据交接足够清楚。实际字段取决于你发布的表单 schema。",
        items: [
          'form_id: "contact-us"',
          'submitted_at: "2026-06-18T10:30:00Z"',
          'fields.name: "Jane Doe"',
          'fields.email_or_phone: "jane@example.com"',
          'fields.topic: "Need a demo workflow"',
        ],
      },
      {
        title: "常见推送状态",
        description:
          "通过推送状态和日志判断问题出在表单、Endpoint，还是接收系统。",
        items: [
          "Delivered：Endpoint 已返回成功响应。",
          "4xx client error：检查 URL、鉴权、payload 格式或接收方配置。",
          "5xx server error：接收方服务器异常，通常更适合重试。",
          "Timeout：Endpoint 没有及时响应。",
          "Signature mismatch：检查 shared secret 或签名校验逻辑。",
        ],
      },
      {
        title: "什么时候需要重试日志",
        description:
          "日志能帮助运营和开发在接入真实业务流程前信任公开表单。",
        items: [
          "先确认提交是否已推送，再决定是否让用户重新填写。",
          "区分接收方配置错误和临时服务器故障。",
          "让开发者拿到排查上下文，而不必重建表单 UI。",
        ],
      },
    ],
    faqItems: [
      {
        question: "What is a webhook form?",
        answer:
          "A webhook form collects public submissions and sends the response data to an endpoint you control, so the form can feed another workflow.",
      },
      {
        question: "What happens if my webhook endpoint fails?",
        answer:
          "Use delivery status and logs to inspect whether the receiver returned a client error, server error, timeout, or signature issue before deciding the next action.",
      },
      {
        question: "Can I inspect webhook delivery logs?",
        answer:
          "Yes. GenForms is designed around submission review, delivery status, and retry visibility so teams can debug handoff problems.",
      },
      {
        question: "Can I secure webhook payloads?",
        answer:
          "You should configure the receiving endpoint, authorization, and secret handling carefully. Do not expose tokens in public forms or logs.",
      },
      {
        question: "Do I need a developer to use webhook forms?",
        answer:
          "Non-developers can publish the form, but a developer or ops owner should usually help configure and verify the receiving webhook endpoint.",
      },
    ],
    zhFaqItems: [
      {
        question: "什么是 Webhook 表单？",
        answer:
          "Webhook 表单会收集公开提交，并把回复数据推送到你控制的 endpoint，让表单进入另一个业务流程。",
      },
      {
        question: "如果 Webhook endpoint 失败会发生什么？",
        answer:
          "先通过推送状态和日志判断是 client error、server error、timeout 还是签名问题，再决定是否修正配置或重试。",
      },
      {
        question: "可以查看 Webhook 推送日志吗？",
        answer:
          "可以。GenForms 围绕提交查看、推送状态和重试可见性设计，方便团队排查数据交接问题。",
      },
      {
        question: "Webhook payload 可以做安全保护吗？",
        answer:
          "接收方 endpoint、鉴权和 secret 需要谨慎配置。不要把 token 暴露在公开表单或日志中。",
      },
      {
        question: "使用 Webhook 表单一定需要开发吗？",
        answer:
          "非开发人员可以发布表单，但接收方 Webhook endpoint 的配置和验证通常建议由开发或运维负责人协助完成。",
      },
    ],
  },
  {
    slug: "event-registration-form-builder",
    templateId: "event-registration",
    title: "Event Registration Form Builder with QR Sharing",
    zhTitle: "AI 活动报名表单生成器",
    eyebrow: "Signup, RSVP, workshop and webinar intake",
    zhEyebrow: "报名、RSVP、工作坊和 Webinar 登记",
    description:
      "Create an event registration form with AI for signup, RSVP, workshops, webinars, and small events. Share it by public link or QR code, review submissions, export CSV, and route follow-up through webhook-ready workflows.",
    zhDescription:
      "用 AI 创建活动报名表单，适用于报名、RSVP、工作坊、Webinar 和小型活动。通过公开链接或二维码分享，查看提交、导出 CSV，并通过 Webhook-ready 流程继续跟进。",
    searchIntent:
      "Event organizers searching for a lightweight form builder to create signup, RSVP, workshop, or webinar registration forms without buying ticketing or event management software.",
    zhSearchIntent:
      "活动组织者想创建轻量的报名、RSVP、工作坊或 Webinar 登记表，而不是购买票务或完整活动管理系统。",
    painPoints: [
      "Event registration searches are usually urgent: the form needs to be live before promotion, posters, or community posts go out.",
      "Small events need attendee details, session interest, dietary or accessibility needs, and follow-up context without a heavy event platform.",
      "QR sharing matters for workshops, meetups, classrooms, booths, and offline promotion where visitors arrive from mobile.",
    ],
    zhPainPoints: [
      "活动报名搜索通常很急：推广、海报或社群消息发出去之前，表单就要能上线。",
      "小型活动需要收集参会信息、场次兴趣、饮食或无障碍需求和后续跟进语境，而不是一套沉重的活动平台。",
      "工作坊、Meetup、课堂、展位和线下推广天然需要二维码入口，方便用户手机扫码报名。",
    ],
    workflow: [
      "Describe the event, workshop, webinar, or RSVP flow and let AI draft the registration fields.",
      "Review attendee fields such as name, email, company, role, attendance preference, session interest, dietary needs, and questions.",
      "Publish the form, share the link or QR code, then review registrations, export CSV, or connect webhook-ready follow-up.",
    ],
    zhWorkflow: [
      "描述活动、工作坊、Webinar 或 RSVP 流程，让 AI 起草报名字段。",
      "检查姓名、邮箱、公司、角色、参会方式、场次兴趣、饮食需求和问题等字段。",
      "发布表单，分享链接或二维码，然后查看报名、导出 CSV，或接入 Webhook-ready 后续流程。",
    ],
    proofPoints: [
      "AI event registration fields",
      "Public share link and QR code",
      "Mobile-friendly one-question flow",
      "Submission dashboard and CSV export",
      "Webhook-ready follow-up",
    ],
    zhProofPoints: [
      "AI 生成活动报名字段",
      "公开链接和二维码分享",
      "移动端友好的单题流",
      "提交数据面板和 CSV 导出",
      "Webhook-ready 后续流转",
    ],
    recommendedFields: [
      "Attendee name",
      "Email or phone",
      "Company or organization",
      "Role or title",
      "Event type or session interest",
      "Attendance preference",
      "Number of guests",
      "Dietary or accessibility needs",
      "Questions for organizer",
      "Consent checkbox",
    ],
    zhRecommendedFields: [
      "参会人姓名",
      "邮箱或电话",
      "公司或组织",
      "角色或职位",
      "活动类型或场次兴趣",
      "参会方式",
      "随行人数",
      "饮食或无障碍需求",
      "给主办方的问题",
      "同意条款勾选",
    ],
    recommendedFieldsHeading: "Collect signup details before adding heavy event software",
    zhRecommendedFieldsHeading: "先收集报名信息，再考虑复杂活动系统",
    recommendedFieldsDescription:
      "These fields keep the page focused on event signup, RSVP, workshop, and webinar intake without implying ticketing, payments, or check-in scanning.",
    zhRecommendedFieldsDescription:
      "这些字段帮助页面明确承接活动报名、RSVP、工作坊和 Webinar 信息收集，不把用户预期引向票务、支付或签到核销。",
    templateLinkLabel: "View event registration template",
    zhTemplateLinkLabel: "查看活动报名模板",
    cta: "Create event registration form",
    zhCta: "创建活动报名表",
    prompt:
      "Create an event registration form for a workshop or webinar with attendee details, attendance preference, session interest, questions, QR sharing, response dashboard, CSV export, and webhook-ready follow-up.",
    zhPrompt:
      "创建一个用于工作坊或 Webinar 的活动报名表单，包含参会者信息、参会方式、场次兴趣、问题、二维码分享、数据面板、CSV 导出和 Webhook-ready 后续流转。",
    keywords: [
      "event registration form builder",
      "event signup form builder",
      "event registration template",
      "QR code registration form",
      "RSVP form builder",
      "workshop registration form",
      "webinar registration form",
    ],
    zhKeywords: [
      "活动报名表单生成器",
      "活动报名表",
      "活动报名模板",
      "二维码报名表",
      "RSVP 表单",
      "工作坊报名表",
      "Webinar 报名表",
    ],
    relatedSlugs: [
      "qr-code-form-builder",
      "feishu-dingtalk-form-notifications",
      "customer-feedback-form-builder",
    ],
    intentBlocks: [
      {
        title: "Create a registration form, not an event management system",
        description:
          "This page is for teams that need a fast signup or RSVP form, not ticket sales, seat inventory, check-in scanning, agenda management, or payment processing.",
        items: [
          "Use it for webinars, workshops, small meetups, internal sessions, RSVP, and lightweight event signup.",
          "Collect attendee details, attendance preference, session interest, questions, and follow-up context.",
          "Keep payment, ticketing, capacity management, and badge generation outside the promise of this page.",
        ],
      },
      {
        title: "Share registration by link or QR code",
        description:
          "Event registration often starts from a poster, community post, classroom, booth, or venue sign where the fastest entry is a link or QR scan.",
        items: [
          "Publish a public form link for landing pages, social posts, and team messages.",
          "Use QR access for posters, reception desks, workshops, booths, and offline promotion.",
          "Keep the form short and mobile-friendly for attendees who arrive on a phone.",
        ],
      },
      {
        title: "Handle registrations after submission",
        description:
          "The registration form is only useful if your team can see responses and move them into the next follow-up workflow.",
        items: [
          "Review event registrations from the GenForms response dashboard.",
          "Export registrations as CSV when follow-up is still manual.",
          "Route new registrations through webhook-ready or bot notification paths when the process becomes operational.",
        ],
      },
    ],
    zhIntentBlocks: [
      {
        title: "创建报名表，不是活动管理系统",
        description:
          "这个页面服务的是快速报名或 RSVP 表单需求，不承诺门票销售、座位库存、签到核销、议程管理或支付处理。",
        items: [
          "适用于 Webinar、工作坊、小型 Meetup、内部活动、RSVP 和轻量活动报名。",
          "收集参会信息、参会方式、场次兴趣、问题和后续跟进语境。",
          "支付、票务、容量管理和胸牌生成不属于这个页面的承诺范围。",
        ],
      },
      {
        title: "通过链接或二维码分享报名入口",
        description:
          "活动报名经常来自海报、社群消息、课堂、展位或会场指示牌，最快入口通常是链接或二维码扫码。",
        items: [
          "发布公开表单链接，用于落地页、社媒帖子和团队消息。",
          "使用二维码承接海报、前台、工作坊、展位和线下推广。",
          "让问题保持简短，方便手机端扫码进入的参会者完成报名。",
        ],
      },
      {
        title: "提交后继续处理报名数据",
        description:
          "报名表只有在团队能查看回复并进入后续流程时，才真正可用。",
        items: [
          "在 GenForms 数据面板查看活动报名提交。",
          "后续仍靠人工处理时，可以导出 CSV 名单。",
          "流程进入运营阶段后，可通过 Webhook-ready 或机器人通知路径继续流转。",
        ],
      },
    ],
    faqItems: [
      {
        question: "What is an event registration form builder?",
        answer:
          "An event registration form builder helps you create a form for attendees to sign up for an event, RSVP, workshop, webinar, meetup, or internal session. GenForms adds AI field generation, public sharing, QR access, a response dashboard, CSV export, and webhook-ready follow-up.",
      },
      {
        question: "Can I use GenForms for ticket sales or paid events?",
        answer:
          "No. This page focuses on lightweight registration and RSVP collection. GenForms does not currently promise ticket sales, payment collection, refunds, seat inventory, ticket tiers, or check-in scanning.",
      },
      {
        question: "Can attendees register from a QR code?",
        answer:
          "Yes. Publish the form and use QR code access for posters, venue signs, classrooms, booths, workshops, and offline promotion where attendees arrive from a mobile browser.",
      },
      {
        question: "Where do event registrations go after submission?",
        answer:
          "Registrations can be reviewed in the GenForms response dashboard and exported as CSV. Advanced teams can also route new submissions through webhook-ready or bot notification paths.",
      },
    ],
    zhFaqItems: [
      {
        question: "什么是活动报名表单生成器？",
        answer:
          "活动报名表单生成器帮助你创建用于活动、RSVP、工作坊、Webinar、Meetup 或内部活动的报名表。GenForms 提供 AI 字段生成、公开分享、二维码访问、数据面板、CSV 导出和 Webhook-ready 后续流转。",
      },
      {
        question: "GenForms 可以用于门票销售或付费活动吗？",
        answer:
          "不可以。这个页面聚焦轻量报名和 RSVP 收集。GenForms 当前不承诺门票销售、支付收款、退款、座位库存、票档或签到核销。",
      },
      {
        question: "参会者可以通过二维码报名吗？",
        answer:
          "可以。发布表单后，可以使用二维码入口，用于海报、会场指示牌、课堂、展位、工作坊和线下推广，让参会者通过手机浏览器打开填写。",
      },
      {
        question: "活动报名提交后在哪里查看？",
        answer:
          "报名数据可以在 GenForms 数据面板查看，并可导出 CSV。需要进一步运营时，也可以通过 Webhook-ready 或机器人通知路径继续流转。",
      },
    ],
  },
  {
    slug: "customer-feedback-form-builder",
    templateId: "satisfaction-survey",
    title: "AI Customer Feedback Form Builder",
    zhTitle: "AI 客户反馈表单生成器",
    eyebrow: "Ratings, comments and follow-up",
    zhEyebrow: "评分、意见与后续跟进",
    description:
      "Generate a mobile-friendly customer feedback form with AI. Share it by public link or QR code, review responses, export CSV, and route follow-up through webhook-ready workflows.",
    zhDescription:
      "用 AI 生成适合手机填写的客户反馈表单，通过公开链接或二维码分享，在数据面板查看回复、导出 CSV，并通过 Webhook 或机器人通知继续跟进。",
    searchIntent:
      "Product, service, retail, and delivery teams that need to publish a short feedback form and start collecting responses immediately.",
    zhSearchIntent:
      "需要快速发布简短反馈表并开始收集回复的产品、服务、门店或交付团队。",
    painPoints: [
      "Feedback forms fail when they feel too long or too generic.",
      "Teams need structured responses, not scattered messages across channels.",
      "Collecting feedback is only useful when teams can review, export, and route the responses.",
    ],
    zhPainPoints: [
      "反馈表单太长或太泛时，用户很容易放弃填写。",
      "团队需要结构化反馈，而不是散落在各个渠道的信息。",
      "只有能够查看、导出并继续流转回复，反馈收集才真正有用。",
    ],
    workflow: [
      "Describe the product, service, store, or delivery experience you want to evaluate.",
      "Let AI draft a short, mobile-friendly set of rating and open-comment questions.",
      "Publish a public link or QR code, then review responses, export CSV, or route follow-up through a webhook.",
    ],
    zhWorkflow: [
      "描述需要评价的产品、服务、门店或交付体验。",
      "让 AI 生成简短、适合手机填写的评分和开放意见问题。",
      "发布公开链接或二维码，再查看回复、导出 CSV，或通过 Webhook 继续跟进。",
    ],
    proofPoints: [
      "AI-generated feedback questions",
      "Public link and QR code sharing",
      "Mobile-friendly single-question flow",
      "Response dashboard and CSV export",
      "Webhook-ready follow-up",
    ],
    zhProofPoints: [
      "AI 生成反馈问题",
      "公开链接和二维码分享",
      "移动端友好的单题流",
      "提交数据面板和 CSV 导出",
      "可通过 Webhook 继续流转",
    ],
    recommendedFields: [
      "Product, service, store, or delivery being reviewed",
      "Overall satisfaction rating",
      "Reason for the rating",
      "What worked well",
      "What could be improved",
      "Feedback category",
      "Likelihood to use again",
      "Optional contact details",
      "Follow-up consent",
    ],
    zhRecommendedFields: [
      "被评价的产品、服务、门店或交付内容",
      "整体满意度评分",
      "评分原因",
      "做得好的地方",
      "需要改进的地方",
      "反馈类别",
      "是否愿意再次使用",
      "可选联系方式",
      "后续联系许可",
    ],
    recommendedFieldsHeading: "Start with the core questions, then add fields when needed",
    zhRecommendedFieldsHeading: "先从核心问题开始，再按需要补充字段",
    recommendedFieldsDescription:
      "The starter template covers the core rating and comments. Add the recommended fields that fit your workflow without turning the form into a long survey.",
    zhRecommendedFieldsDescription:
      "起始模板包含核心评分和意见问题。你可以按实际流程补充下面的推荐字段，同时避免把反馈表变成长问卷。",
    templateLinkLabel: "View customer satisfaction template",
    zhTemplateLinkLabel: "查看客户满意度模板",
    ctaBadge: "AI Ready • Share link / QR",
    zhCtaBadge: "AI 就绪 • 链接 / 二维码分享",
    cta: "Create a customer feedback form",
    zhCta: "创建客户反馈表",
    prompt:
      "Create a customer feedback form with an overall rating, reason for the rating, what worked well, what could be improved, optional contact details, and follow-up consent.",
    zhPrompt:
      "创建一个客户反馈表单，包含整体评分、评分原因、做得好的地方、需要改进的地方、可选联系方式和后续联系许可。",
    keywords: [
      "customer feedback form",
      "customer feedback form builder",
      "AI feedback form",
      "customer feedback form template",
      "customer satisfaction survey template",
    ],
    zhKeywords: [
      "客户反馈表单",
      "客户反馈表单生成器",
      "AI 反馈表单",
      "客户反馈表模板",
      "客户满意度调查模板",
    ],
    relatedSlugs: [
      "webhook-form-builder-retry-logs",
      "qr-code-form-builder",
      "google-forms-alternative-ai",
    ],
    intentBlocks: [
      {
        title: "Collect feedback, not a full CX analytics program",
        description:
          "This workflow is for teams that need a focused form and a reliable place to review responses, not an enterprise survey platform.",
        items: [
          "Ask for a rating, the reason behind it, and one concrete improvement idea.",
          "Use optional contact details and follow-up consent when a team member may respond.",
          "Keep NPS benchmarks, trend dashboards, and email campaigns outside the page promise.",
        ],
      },
      {
        title: "Share the form where the customer already is",
        description:
          "Publish one feedback flow and use a public link or QR code across online and offline customer touchpoints.",
        items: [
          "Send the public link after a purchase, service interaction, delivery, or support conversation.",
          "Use QR access at a counter, venue, store, workshop, or printed follow-up card.",
          "Keep the questions short for customers completing the form on mobile.",
        ],
      },
      {
        title: "Turn responses into follow-up",
        description:
          "Feedback should reach the people who can act on it instead of remaining in disconnected messages.",
        items: [
          "Review responses in the GenForms dashboard.",
          "Export CSV when the team still works from spreadsheets.",
          "Use webhook or bot notification paths for advanced follow-up in Feishu, DingTalk, WeCom, Slack, or a custom endpoint.",
        ],
      },
    ],
    zhIntentBlocks: [
      {
        title: "收集反馈，而不是承诺一整套 CX 分析平台",
        description:
          "这个工作流适合需要聚焦问题和可靠回复入口的团队，不把 GenForms 包装成企业级调研平台。",
        items: [
          "询问评分、评分原因和一个具体改进建议。",
          "可能需要人工回复时，再收集可选联系方式和回访许可。",
          "不承诺 NPS 行业基准、趋势报表和邮件 Campaign。",
        ],
      },
      {
        title: "在客户所在的触点分享表单",
        description:
          "发布同一条反馈流程，通过公开链接或二维码覆盖线上和线下客户触点。",
        items: [
          "购买、服务、交付或客服沟通结束后发送公开链接。",
          "在柜台、门店、活动、工作坊或印刷回访卡上使用二维码入口。",
          "问题保持简短，方便客户在手机端完成。",
        ],
      },
      {
        title: "让回复进入后续处理",
        description:
          "反馈需要到达真正能够处理它的人，而不是继续散落在不同消息渠道。",
        items: [
          "在 GenForms 数据面板查看回复。",
          "团队仍然使用表格处理时，可以导出 CSV。",
          "需要高级跟进时，通过 Webhook 或 Bot 通知路径进入飞书、钉钉、企微、Slack 或自定义 endpoint。",
        ],
      },
    ],
    faqItems: [
      {
        question: "Can I create a customer feedback form with AI?",
        answer:
          "Yes. Describe the customer moment you want to evaluate and GenForms can draft rating, comment, improvement, and optional follow-up questions for you to review before publishing.",
      },
      {
        question: "Can customers open the feedback form from a QR code?",
        answer:
          "Yes. Publish the form as a public link and use QR code access at stores, counters, workshops, venues, or printed customer touchpoints.",
      },
      {
        question: "Where can I review and export feedback submissions?",
        answer:
          "Review submissions in the GenForms response dashboard and export them as CSV when your team needs spreadsheet-based analysis or follow-up.",
      },
      {
        question: "Can new feedback enter a webhook or bot notification workflow?",
        answer:
          "Yes. GenForms supports webhook-ready routing, delivery logs, failed-delivery retry, and notification paths for Feishu, DingTalk, WeCom, Slack Incoming Webhook, or a custom endpoint.",
      },
      {
        question: "Does GenForms provide professional NPS benchmarks or advanced CX analytics?",
        answer:
          "No. GenForms currently focuses on creating feedback forms, collecting responses, reviewing submissions, exporting CSV, and routing follow-up. Professional NPS benchmarking and advanced CX analytics are outside this page's promise.",
      },
    ],
    zhFaqItems: [
      {
        question: "可以用 AI 创建客户反馈表吗？",
        answer:
          "可以。描述你想评价的客户触点，GenForms 会生成评分、开放意见、改进建议和可选回访问题，发布前仍可检查和调整。",
      },
      {
        question: "客户可以通过二维码打开反馈表吗？",
        answer:
          "可以。表单发布为公开链接后，可以在门店、柜台、工作坊、活动现场或印刷客户触点上使用二维码入口。",
      },
      {
        question: "反馈提交后在哪里查看和导出？",
        answer:
          "可以在 GenForms 回复数据面板查看提交，并在团队需要使用表格分析或跟进时导出 CSV。",
      },
      {
        question: "新反馈可以进入 Webhook 或群机器人通知流程吗？",
        answer:
          "可以。GenForms 支持 Webhook 流转、推送日志、失败重试，以及飞书、钉钉、企微、Slack Incoming Webhook 或自定义 endpoint 通知路径。",
      },
      {
        question: "GenForms 提供专业 NPS 基准或高级 CX 分析吗？",
        answer:
          "不提供。GenForms 当前聚焦反馈表单创建、回复收集、提交查看、CSV 导出和后续流转；专业 NPS benchmark 和高级 CX analytics 不在本页面承诺范围内。",
      },
    ],
  },
  {
    slug: "contact-form-builder-for-websites",
    templateId: "contact-us",
    title: "AI Website Contact Form Builder",
    zhTitle: "AI 网站联系表单生成器",
    eyebrow: "Website contact form",
    zhEyebrow: "网站联系入口",
    description:
      "Create a website contact form with AI, publish it as a share link or QR code, review submissions in a dashboard, export CSV responses, and connect webhook-ready follow-up when your process needs it.",
    zhDescription:
      "用 AI 快速生成网站联系表单，通过公开链接或二维码发布，在数据面板查看提交、导出 CSV，并在需要时接入 Webhook 后续流转。",
    searchIntent:
      "Website owners and small teams searching for a contact form builder they can use immediately on a contact page, footer link, button, or QR code entry.",
    zhSearchIntent:
      "网站所有者和小团队想立刻创建一个可用于 contact page、页脚链接、按钮或二维码入口的联系表单。",
    painPoints: [
      "Most contact form searches are urgent: the user wants a form they can put on a website today.",
      "A useful contact form needs more than name and email. It should collect inquiry type, message context, and preferred response details.",
      "After visitors submit the form, teams need a clear place to review replies, export them, and route important inquiries into the next workflow.",
    ],
    zhPainPoints: [
      "搜索联系表单的用户通常很急：他今天就想把表单放到网站上。",
      "可用的联系表单不只收姓名和邮箱，还应该收集咨询类型、留言语境和首选回复方式。",
      "访客提交后，团队需要清楚地查看回复、导出数据，并把重要咨询流转到下一步流程。",
    ],
    workflow: [
      "Describe your website, service, or contact page goal and let AI draft the contact form fields.",
      "Review recommended fields such as name, email or phone, company, inquiry type, message, and preferred response time.",
      "Publish the form as a public link or QR code, then review submissions, export CSV responses, or connect a webhook-ready follow-up path.",
    ],
    zhWorkflow: [
      "描述你的网站、服务或联系页目标，让 AI 起草联系表单字段。",
      "检查推荐字段，例如姓名、邮箱或电话、公司、咨询类型、留言和首选回复时间。",
      "通过公开链接或二维码发布表单，然后查看提交、导出 CSV，或接入 Webhook-ready 后续流转。",
    ],
    proofPoints: [
      "AI-generated contact fields",
      "Contact form template",
      "Public share link and QR code",
      "Submission dashboard and CSV export",
      "Webhook configuration, logs, and retries",
    ],
    zhProofPoints: [
      "AI 生成联系字段",
      "联系我们模板",
      "公开分享链接和二维码",
      "提交数据面板和 CSV 导出",
      "Webhook 配置、日志和重试",
    ],
    cta: "Create a contact form for free",
    zhCta: "免费创建联系表单",
    prompt:
      "Create a website contact form with name, email or phone, company, inquiry type, message, preferred response time, and a clean mobile-friendly flow.",
    zhPrompt:
      "创建一个网站联系表单，包含姓名、邮箱或电话、公司、咨询类型、留言、首选回复时间和简洁的移动端填写流程。",
    keywords: [
      "contact form builder",
      "contact form generator",
      "website contact form",
      "AI website contact form builder",
      "contact us form template",
      "business inquiry form",
    ],
    zhKeywords: [
      "联系表单生成器",
      "网站联系我们表单",
      "AI 网站联系表单",
      "联系我们模板",
      "业务咨询表单",
    ],
    relatedSlugs: [
      "google-forms-alternative-ai",
      "webhook-form-builder-retry-logs",
      "ai-lead-capture-form-builder",
    ],
    intentBlocks: [
      {
        title: "Generate a contact form from your website context",
        description:
          "Start with the contact-us template or describe your business. AI helps draft a short website contact form instead of forcing you to build every field by hand.",
        items: [
          "Recommended identity fields: name, email or phone, and company.",
          "Recommended intent fields: inquiry type, message, and preferred response time.",
          "Keep the first version short enough for a visitor to complete from a mobile device.",
        ],
      },
      {
        title: "Use it as a website contact entry",
        description:
          "The primary publishing path is a public form link or QR code that can be placed where visitors already look for contact options.",
        items: [
          "Add the form link to a contact page or navigation button.",
          "Use the link from a footer, landing page CTA, social profile, or support page.",
          "Use the QR code for printed material, reception areas, events, or offline lead collection.",
        ],
      },
      {
        title: "Handle replies after submission",
        description:
          "A contact form is only useful if your team can act on the replies. Review submissions first, then export or connect workflow routing when needed.",
        items: [
          "Review new contact requests in the submission dashboard.",
          "Export CSV responses for lightweight operations or manual follow-up.",
          "Use webhook configuration, logs, and retries as an advanced follow-up path for Feishu, DingTalk, WeCom, Slack Incoming Webhook, or custom workflows.",
        ],
      },
    ],
    zhIntentBlocks: [
      {
        title: "根据网站语境生成联系表单",
        description:
          "从联系我们模板开始，或直接描述你的业务。AI 会帮助起草简洁的网站联系表单，不需要逐字段手工搭建。",
        items: [
          "推荐身份字段：姓名、邮箱或电话、公司。",
          "推荐意图字段：咨询类型、留言、首选回复时间。",
          "第一版保持足够短，让访客可以在手机上顺畅完成。",
        ],
      },
      {
        title: "作为网站联系入口使用",
        description:
          "当前主要发布路径是公开表单链接或二维码，可以放在访客本来就会寻找联系入口的位置。",
        items: [
          "把表单链接放到 contact page 或导航按钮。",
          "在页脚、落地页 CTA、社交资料页或支持页面使用这个链接。",
          "用二维码承接印刷物料、前台接待、活动现场或线下线索收集。",
        ],
      },
      {
        title: "处理提交后的回复",
        description:
          "联系表单只有在团队能处理回复时才真正有用。先在数据面板查看提交，再按需要导出或接入流程流转。",
        items: [
          "在提交数据面板查看新的联系请求。",
          "导出 CSV，用于轻量运营或人工跟进。",
          "把 Webhook 配置、日志和重试作为高级后续路径，用于飞书、钉钉、企微、Slack Incoming Webhook 或自定义流程。",
        ],
      },
    ],
    faqItems: [
      {
        question: "What is a website contact form builder?",
        answer:
          "A website contact form builder helps you create a form visitors can use to send inquiries from your site. GenForms adds AI field generation, a mobile-friendly flow, public sharing, QR access, submission review, CSV export, and webhook-ready follow-up.",
      },
      {
        question: "Can I create a contact form without code?",
        answer:
          "Yes. Start from the contact form template or describe your website in a prompt, review the generated fields, then publish the form as a public link or QR code.",
      },
      {
        question: "What fields should a website contact form include?",
        answer:
          "A practical contact form usually includes name, email or phone, company, inquiry type, message, and preferred response time. Keep the form short enough for mobile visitors.",
      },
      {
        question: "How can I use this contact form on my website?",
        answer:
          "Use the published form link from your contact page, navigation button, footer, landing page CTA, support page, or social profile. You can also use the QR code for offline contact points.",
      },
      {
        question: "Where do contact form submissions go?",
        answer:
          "Submissions can be reviewed in the GenForms dashboard and exported as CSV. For more advanced operations, submissions can be routed through a webhook-ready follow-up workflow.",
      },
      {
        question: "Can I send contact form submissions to a webhook?",
        answer:
          "Yes. Webhook configuration, delivery logs, and retry visibility are the advanced path for teams that want to connect submissions to Feishu, DingTalk, WeCom, Slack Incoming Webhook, or a custom endpoint.",
      },
      {
        question: "Can I embed the form directly into my website HTML?",
        answer:
          "The current recommended path is to use a public form link or QR code from your website. Direct iframe or HTML embed should be treated as a future or custom implementation path unless it is explicitly configured.",
      },
    ],
    zhFaqItems: [
      {
        question: "什么是网站联系表单生成器？",
        answer:
          "网站联系表单生成器帮助你创建一个让访客从网站提交咨询的表单。GenForms 额外提供 AI 字段生成、移动端单题流、公开链接、二维码、提交查看、CSV 导出和 Webhook-ready 后续流转。",
      },
      {
        question: "不写代码可以创建联系表单吗？",
        answer:
          "可以。从联系我们模板开始，或用一句话描述你的网站，检查 AI 生成的字段后，就可以通过公开链接或二维码发布。",
      },
      {
        question: "网站联系表单应该包含哪些字段？",
        answer:
          "实用的联系表单通常包含姓名、邮箱或电话、公司、咨询类型、留言和首选回复时间。同时要保持足够短，方便移动端访客完成。",
      },
      {
        question: "这个联系表单可以怎么放到网站上？",
        answer:
          "你可以把公开表单链接放在联系页、导航按钮、页脚、落地页 CTA、支持页面或社交资料页，也可以用二维码承接线下联系入口。",
      },
      {
        question: "联系表单提交后在哪里查看？",
        answer:
          "提交内容可以在 GenForms 数据面板查看，并导出为 CSV。需要更高级运营时，也可以把提交接入 Webhook-ready 后续流程。",
      },
      {
        question: "联系表单提交可以发送到 Webhook 吗？",
        answer:
          "可以。Webhook 配置、推送日志和重试可见性是高级路径，适合把提交流转到飞书、钉钉、企微、Slack Incoming Webhook 或自定义 endpoint。",
      },
      {
        question: "可以直接把表单 iframe 或 HTML embed 到网站里吗？",
        answer:
          "当前推荐路径是从网站使用公开表单链接或二维码。直接 iframe 或 HTML embed 应视为后续或定制实现路径，除非实际产品中已经明确配置。",
      },
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
      "Create a mobile-friendly form with AI, publish it as a public link, and use QR code access for events, counters, posters, classrooms, surveys, or field collection.",
    zhDescription:
      "用 AI 创建适合手机填写的表单，发布公开链接，并通过二维码用于活动、柜台、海报、课堂、调查或现场信息收集。",
    searchIntent: "Users searching for a form builder that supports QR code sharing for real-world collection.",
    zhSearchIntent: "用户想找支持二维码分享、适合线下收集场景的表单生成器。",
    painPoints: [
      "Offline collection needs a fast way to move people from a poster, counter, event booth, or classroom into a form.",
      "Google Forms and QR generators often solve separate pieces, leaving teams to connect the form, link, QR code, and response tracking themselves.",
      "Teams need the same response dashboard whether visitors arrive from a website link, printed QR code, or mobile scan.",
    ],
    zhPainPoints: [
      "线下收集需要让用户从海报、柜台、活动展位或课堂快速进入表单。",
      "Google Forms 和二维码生成器通常只解决一部分问题，团队还要自己串起表单、链接、二维码和回复追踪。",
      "无论访客来自网站链接、印刷二维码还是手机扫码，团队都需要同一个回复数据面板。",
    ],
    workflow: [
      "Describe the event, survey, intake, or field collection scenario and let AI draft the form fields.",
      "Publish the share page and use the QR code for posters, signs, counters, classrooms, or event booths.",
      "Collect mobile submissions, review them from the dashboard, export CSV responses, or route follow-up through webhook-ready workflows.",
    ],
    zhWorkflow: [
      "描述活动、调查、登记或现场收集场景，让 AI 起草表单字段。",
      "发布分享页，并把二维码用于海报、指示牌、柜台、课堂或活动展位。",
      "收集手机端提交，在数据面板查看、导出 CSV，或通过 Webhook-ready 流程继续流转。",
    ],
    proofPoints: [
      "AI-generated form fields",
      "Published form links",
      "QR code sharing for print and mobile access",
      "Mobile-first filling",
      "Submission dashboard and CSV export",
      "Webhook-ready follow-up",
    ],
    zhProofPoints: [
      "AI 生成表单字段",
      "公开表单链接",
      "适合印刷和手机访问的二维码分享",
      "移动端优先填写",
      "提交数据面板和 CSV 导出",
      "Webhook-ready 后续流转",
    ],
    cta: "Create a QR code form",
    zhCta: "创建二维码表单",
    prompt:
      "Create a QR-code-friendly mobile form for an offline event or survey with short questions, contact fields, and a clear response dashboard.",
    zhPrompt:
      "创建一个适合二维码扫码填写的移动端表单，用于线下活动或调查，包含简短问题、联系方式字段和清晰的数据面板。",
    keywords: [
      "QR code form builder",
      "form builder with QR code",
      "QR code survey form",
      "event QR registration form",
      "mobile form with QR code",
      "mobile form builder",
    ],
    zhKeywords: [
      "二维码表单生成器",
      "带二维码的表单生成器",
      "二维码调查表",
      "二维码报名表",
      "移动端扫码表单",
    ],
    relatedSlugs: [
      "event-registration-form-builder",
      "contact-form-builder-for-websites",
      "customer-feedback-form-builder",
    ],
    intentBlocks: [
      {
        title: "Build the form and QR entry together",
        description:
          "A QR code form should not force teams to stitch together a form builder, a QR generator, and a separate response tracker.",
        items: [
          "Use AI to draft fields for an event registration, survey, contact intake, or field collection form.",
          "Publish a public form link and use QR code access for scan-to-fill collection.",
          "Keep the questions short enough for mobile visitors who arrive from a poster or venue sign.",
        ],
      },
      {
        title: "Use QR forms in real-world collection points",
        description:
          "QR forms work best when the visitor is already offline or on mobile and needs a fast way to submit information.",
        items: [
          "Event booths and check-in desks for registration or inquiry collection.",
          "Posters, flyers, counters, classrooms, and reception areas.",
          "Feedback surveys, contact requests, waitlists, and lightweight field reports.",
        ],
      },
      {
        title: "Review responses after the scan",
        description:
          "The QR code is only the entry point. Teams still need a reliable place to review, export, and route submissions.",
        items: [
          "Review scanned submissions from the same GenForms dashboard.",
          "Export CSV responses when the follow-up process is still manual.",
          "Use webhook-ready routing for advanced follow-up in Feishu, DingTalk, WeCom, Slack Incoming Webhook, or custom workflows.",
        ],
      },
    ],
    zhIntentBlocks: [
      {
        title: "把表单和二维码入口一起创建",
        description:
          "二维码表单不应该让团队分别拼接表单工具、二维码生成器和回复追踪表。",
        items: [
          "用 AI 为活动报名、调查、联系登记或现场收集表单起草字段。",
          "发布公开表单链接，并使用二维码承接扫码填写。",
          "问题保持足够短，方便从海报或场地指示牌扫码进入的移动端访客完成。",
        ],
      },
      {
        title: "用于真实线下收集点",
        description:
          "二维码表单最适合访客已经在线下或手机端，需要快速提交信息的场景。",
        items: [
          "活动展位和签到台，用于报名或咨询收集。",
          "海报、传单、柜台、课堂和前台接待区域。",
          "反馈调查、联系请求、候补名单和轻量现场记录。",
        ],
      },
      {
        title: "扫码之后继续处理回复",
        description:
          "二维码只是入口。团队仍然需要可靠地查看、导出和流转提交。",
        items: [
          "在同一个 GenForms 数据面板查看扫码提交。",
          "后续还比较人工时，可以导出 CSV 回复。",
          "需要高级跟进时，通过 Webhook-ready 流转到飞书、钉钉、企微、Slack Incoming Webhook 或自定义流程。",
        ],
      },
    ],
    faqItems: [
      {
        question: "What is a QR code form builder?",
        answer:
          "A QR code form builder helps you create a form, publish it as a public link, and let people open it by scanning a QR code. GenForms adds AI field generation, mobile-first filling, a response dashboard, CSV export, and webhook-ready follow-up.",
      },
      {
        question: "Can I create a QR code for a form without code?",
        answer:
          "Yes. Create or generate the form, publish it, and use QR code access for posters, counters, events, classrooms, or other scan-to-fill collection points.",
      },
      {
        question: "What can QR code forms be used for?",
        answer:
          "Common use cases include event registration, feedback surveys, contact requests, waitlists, classroom responses, reception intake, and field data collection.",
      },
      {
        question: "Do QR forms work well on mobile?",
        answer:
          "They should. A QR code normally sends visitors to a mobile browser, so the form should use short questions, clear fields, and a mobile-friendly flow.",
      },
      {
        question: "Where do QR form submissions go?",
        answer:
          "Submissions can be reviewed in the GenForms dashboard and exported as CSV. Advanced teams can also connect webhook-ready follow-up workflows.",
      },
      {
        question: "Does GenForms provide printing, ticketing, or offline app features?",
        answer:
          "No. GenForms focuses on form creation, public links, QR access, submission review, CSV export, and webhook-ready routing. Printing, ticketing, seating, offline mode, and native mobile apps are separate product categories.",
      },
    ],
    zhFaqItems: [
      {
        question: "什么是二维码表单生成器？",
        answer:
          "二维码表单生成器帮助你创建表单、发布公开链接，并让用户通过扫描二维码打开填写。GenForms 额外提供 AI 字段生成、移动端优先填写、数据面板、CSV 导出和 Webhook-ready 后续流转。",
      },
      {
        question: "不写代码可以创建二维码表单吗？",
        answer:
          "可以。创建或生成表单后发布，再用二维码承接海报、柜台、活动、课堂或其他扫码填写场景。",
      },
      {
        question: "二维码表单适合哪些场景？",
        answer:
          "常见场景包括活动报名、反馈调查、联系请求、候补名单、课堂回复、前台登记和现场数据收集。",
      },
      {
        question: "二维码表单适合手机填写吗？",
        answer:
          "应该适合。二维码通常把访客带到手机浏览器，所以表单需要简短问题、清晰字段和移动端友好的填写流程。",
      },
      {
        question: "二维码表单提交后在哪里查看？",
        answer:
          "提交可以在 GenForms 数据面板查看，并导出 CSV。需要更高级跟进时，也可以接入 Webhook-ready 后续流程。",
      },
      {
        question: "GenForms 提供打印、票务或离线 App 功能吗？",
        answer:
          "不提供。GenForms 聚焦表单创建、公开链接、二维码访问、提交查看、CSV 导出和 Webhook-ready 流转。打印、票务、座位、离线模式和原生移动 App 属于其他产品类型。",
      },
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
