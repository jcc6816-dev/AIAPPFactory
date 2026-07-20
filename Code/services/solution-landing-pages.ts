import { getSceneTemplateById } from "@/services/form-templates";

export interface SolutionLandingPage {
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
  audience: string;
  zhAudience: string;
  recommendedFields: string[];
  zhRecommendedFields: string[];
  workflow: string[];
  zhWorkflow: string[];
  faq: {
    question: string;
    zhQuestion: string;
    answer: string;
    zhAnswer: string;
  }[];
  cta: string;
  zhCta: string;
  prompt: string;
  zhPrompt: string;
  creationIntent?: string;
  keywords: string[];
  zhKeywords: string[];
}

const allSolutionLandingPages: SolutionLandingPage[] = [
  {
    slug: "saas-lead-capture-form-builder",
    templateId: "lead-capture",
    title: "AI Lead Capture Form Builder for SaaS Teams",
    zhTitle: "面向 SaaS 团队的 AI 线索收集表单",
    eyebrow: "SaaS pipeline intake",
    zhEyebrow: "SaaS 销售线索入口",
    description:
      "Create SaaS lead capture forms with qualification fields, Typeform-like flow, and webhook-ready handoff for sales follow-up.",
    zhDescription:
      "为 SaaS 团队创建带线索筛选字段、类 Typeform 单题流和 Webhook 流转能力的线索收集表单。",
    searchIntent:
      "Marketing and sales teams searching for a faster SaaS lead form that can qualify prospects before CRM handoff.",
    zhSearchIntent:
      "营销和销售团队正在寻找能在进入 CRM 前完成线索筛选的 SaaS 线索表单。",
    audience: "SaaS founders, growth marketers, and sales ops teams",
    zhAudience: "SaaS 创始人、增长营销和销售运营团队",
    recommendedFields: [
      "Work email",
      "Company size",
      "Use case",
      "Budget range",
      "Buying timeline",
      "CRM or workflow destination",
    ],
    zhRecommendedFields: [
      "工作邮箱",
      "公司规模",
      "使用场景",
      "预算范围",
      "采购时间计划",
      "CRM 或后续流转目标",
    ],
    workflow: [
      "Start from the lead capture template or generate a SaaS-specific prompt.",
      "Keep the flow short while collecting the fields sales actually need.",
      "Publish the form and route qualified submissions into a webhook workflow.",
    ],
    zhWorkflow: [
      "从线索收集模板开始，或用 SaaS 场景 prompt 生成表单。",
      "保持流程简短，同时收集销售真正需要的字段。",
      "发布表单，并把合格线索推送到 Webhook 工作流。",
    ],
    faq: [
      {
        question: "Can this replace a basic website contact form?",
        zhQuestion: "它可以替代普通官网联系表单吗？",
        answer:
          "Yes. It is better suited when you need qualification fields, a cleaner completion experience, and downstream handoff.",
        zhAnswer:
          "可以。尤其适合需要线索筛选字段、更顺畅填写体验和后续流转的官网获客场景。",
      },
      {
        question: "Do I need to start from a blank form?",
        zhQuestion: "我需要从空白表单开始吗？",
        answer:
          "No. You can start from a template, then ask AI to tune fields, labels, and the flow.",
        zhAnswer:
          "不需要。可以先从模板开始，再让 AI 调整字段、文案和填写流程。",
      },
    ],
    cta: "Create a SaaS lead form",
    zhCta: "创建 SaaS 线索表单",
    prompt:
      "Create a SaaS lead capture form with company size, use case, budget, timeline, and contact fields.",
    zhPrompt:
      "创建一个 SaaS 线索收集表单，包含公司规模、使用场景、预算、采购时间和联系方式。",
    keywords: [
      "SaaS lead capture form",
      "AI lead form builder",
      "lead generation form",
      "Typeform alternative for SaaS",
    ],
    zhKeywords: ["SaaS 线索表单", "AI 线索表单生成器", "获客表单", "SaaS 表单工具"],
  },
  {
    slug: "event-registration-form-with-qr-code",
    templateId: "event-registration",
    title: "Event Registration Form with QR Code Sharing",
    zhTitle: "带二维码分享的活动报名表单",
    eyebrow: "Online and offline signup",
    zhEyebrow: "线上线下一体报名",
    description:
      "Build event registration forms that collect attendees, publish a share link, and support QR code distribution for venues and campaigns.",
    zhDescription:
      "创建活动报名表单，收集参会者信息，并通过公开链接和二维码用于会场、海报和活动推广。",
    searchIntent:
      "Event marketers looking for a registration form that works for landing pages, posters, and offline scan-to-register campaigns.",
    zhSearchIntent:
      "活动营销团队需要同时适配落地页、海报和线下扫码报名的表单。",
    audience: "Event teams, community operators, and course organizers",
    zhAudience: "活动团队、社群运营和课程组织者",
    recommendedFields: [
      "Full name",
      "Email",
      "Company or organization",
      "Attendance preference",
      "Session or topic interest",
      "Consent checkbox",
    ],
    zhRecommendedFields: [
      "姓名",
      "邮箱",
      "公司或组织",
      "参会方式",
      "感兴趣的场次或主题",
      "同意条款勾选",
    ],
    workflow: [
      "Create the registration form from an event template.",
      "Publish it as a public link and generate a QR code for posters or venue signage.",
      "Review submissions and send new attendees to your notification workflow.",
    ],
    zhWorkflow: [
      "从活动报名模板创建表单。",
      "发布公开链接，并生成二维码用于海报或会场指示牌。",
      "查看报名数据，并把新增参会者推送到通知流程。",
    ],
    faq: [
      {
        question: "Can QR forms work for offline events?",
        zhQuestion: "二维码表单适合线下活动吗？",
        answer:
          "Yes. A QR code gives attendees a fast mobile entry point while keeping the same submission dashboard.",
        zhAnswer:
          "适合。二维码能让参会者快速从手机进入填写，同时仍然使用同一个提交数据面板。",
      },
      {
        question: "Can I customize attendance fields?",
        zhQuestion: "可以自定义参会字段吗？",
        answer:
          "Yes. Start from the template and adjust attendance preference, session interest, and attendee questions.",
        zhAnswer:
          "可以。从模板开始后，可以调整参会方式、场次兴趣和参会者问题。",
      },
    ],
    cta: "Create event registration form",
    zhCta: "创建活动报名表",
    prompt:
      "Create an event registration form with attendee details, attendance preference, QR sharing, and webhook-ready follow-up.",
    zhPrompt:
      "创建一个活动报名表单，包含参会者信息、参会方式、二维码分享和 Webhook-ready 后续流转。",
    keywords: [
      "event registration form",
      "QR code form builder",
      "event signup form",
      "AI event form builder",
    ],
    zhKeywords: ["活动报名表单", "二维码表单", "扫码报名表", "AI 活动表单"],
  },
  {
    slug: "law-firm-client-intake-form-template",
    templateId: "contact-us",
    title: "Law Firm Client Intake Form Template",
    zhTitle: "律师事务所客户咨询登记表模板",
    eyebrow: "Professional inquiry intake",
    zhEyebrow: "专业咨询登记",
    description:
      "Create a client intake form for law firms that captures contact details, case type, urgency, and supporting notes before consultation.",
    zhDescription:
      "为律师事务所创建客户咨询登记表，在预约前收集联系方式、案件类型、紧急程度和补充说明。",
    searchIntent:
      "Law firms and professional service teams looking for a structured website intake form.",
    zhSearchIntent:
      "律师事务所和专业服务团队需要结构化的官网咨询登记表。",
    audience: "Law firms, consultants, and professional service teams",
    zhAudience: "律师事务所、咨询顾问和专业服务团队",
    recommendedFields: [
      "Client name",
      "Email and phone",
      "Case or service type",
      "Urgency",
      "Preferred contact time",
      "Case summary",
    ],
    zhRecommendedFields: [
      "客户姓名",
      "邮箱和电话",
      "案件或服务类型",
      "紧急程度",
      "偏好联系时间",
      "情况摘要",
    ],
    workflow: [
      "Start from a contact or consultation template.",
      "Ask AI to adapt labels for legal or professional service intake.",
      "Publish the form and route submissions to the right follow-up channel.",
    ],
    zhWorkflow: [
      "从联系或咨询模板开始。",
      "让 AI 将字段文案调整为法律或专业服务咨询语境。",
      "发布表单，并把提交推送到合适的后续跟进渠道。",
    ],
    faq: [
      {
        question: "Should this collect sensitive legal details?",
        zhQuestion: "这个表单应该收集敏感法律细节吗？",
        answer:
          "Keep it focused on intake and triage. Avoid asking for highly sensitive details unless your own compliance process covers it.",
        zhAnswer:
          "建议聚焦登记和初步分流。除非已有合规流程覆盖，否则不要要求填写高度敏感细节。",
      },
      {
        question: "Can it route urgent inquiries?",
        zhQuestion: "可以分流紧急咨询吗？",
        answer:
          "Yes. Add an urgency field and route new submissions through webhook or notification workflows.",
        zhAnswer:
          "可以。增加紧急程度字段，并通过 Webhook 或通知流程推送新提交。",
      },
    ],
    cta: "Create client intake form",
    zhCta: "创建客户咨询登记表",
    prompt:
      "Create a law firm client intake form with contact details, case type, urgency, preferred contact time, and case summary.",
    zhPrompt:
      "创建一个律师事务所客户咨询登记表，包含联系方式、案件类型、紧急程度、偏好联系时间和情况摘要。",
    keywords: [
      "law firm intake form",
      "client intake form template",
      "legal consultation form",
      "professional service form",
    ],
    zhKeywords: ["律师客户登记表", "客户咨询表模板", "法律咨询表单", "专业服务表单"],
  },
  {
    slug: "web-design-client-intake-form-template",
    templateId: "contact-us",
    title: "Web Design Client Intake Form Template",
    zhTitle: "网站设计客户需求收集表单模板",
    eyebrow: "Website project discovery",
    zhEyebrow: "建站项目需求对齐",
    description:
      "Create a web design client intake form with AI. Replace static PDF questionnaires with a mobile-friendly intake flow for project goals, reference sites, brand preferences, budget, and timeline.",
    zhDescription:
      "用 AI 创建网站设计客户需求收集表，用移动端友好的在线填写流程替代静态 PDF 问卷，收集项目目标、参考网站、品牌偏好、预算和时间计划。",
    searchIntent:
      "Freelance web designers and small agencies searching for a modern online intake form or website design questionnaire before starting a client project.",
    zhSearchIntent:
      "自由职业网站设计师和小型 Agency 希望在项目启动前，用现代在线表单替代传统网站设计问卷或 PDF。",
    audience: "Freelance web designers, developers, and creative agencies",
    zhAudience: "自由职业网站设计师、开发者和创意 Agency",
    recommendedFields: [
      "Client name",
      "Work email",
      "Company or brand name",
      "Current website URL",
      "Project goals",
      "Target audience",
      "Reference websites",
      "Brand style preferences",
      "Required pages",
      "Budget range",
      "Launch timeline",
      "Additional notes",
    ],
    zhRecommendedFields: [
      "客户姓名",
      "工作邮箱",
      "公司或品牌名称",
      "现有网站 URL",
      "项目目标",
      "目标受众",
      "参考网站",
      "品牌风格偏好",
      "所需页面",
      "预算范围",
      "上线时间",
      "补充说明",
    ],
    workflow: [
      "Start from a website client intake prompt instead of sending a static PDF questionnaire.",
      "Let AI draft discovery questions for goals, brand direction, pages, timeline, and budget.",
      "Share the form link or QR code before kickoff and review responses from the dashboard or CSV export.",
      "Route new intake responses to your team through webhook or bot notification paths when needed.",
    ],
    zhWorkflow: [
      "从网站客户需求收集 prompt 开始，而不是发送静态 PDF 问卷。",
      "让 AI 生成项目目标、品牌方向、页面范围、时间计划和预算相关问题。",
      "在 kickoff 前分享链接或二维码，并在数据面板或 CSV 中查看回复。",
      "需要时通过 Webhook 或 Bot 通知路径把新提交推送给团队。",
    ],
    faq: [
      {
        question: "What should a web design client intake form include?",
        zhQuestion: "网站设计客户需求收集表应该包含什么？",
        answer:
          "Include client details, current website URL, project goals, target audience, reference websites, brand preferences, required pages, budget range, timeline, and notes for kickoff.",
        zhAnswer:
          "建议包含客户信息、现有网站 URL、项目目标、目标受众、参考网站、品牌偏好、所需页面、预算范围、时间计划和 kickoff 备注。",
      },
      {
        question: "Can this replace a website design questionnaire PDF?",
        zhQuestion: "它可以替代网站设计问卷 PDF 吗？",
        answer:
          "Yes. You can use an online, mobile-friendly form instead of a static PDF so clients can complete the intake flow from a shared link or QR code.",
        zhAnswer:
          "可以。你可以用移动端友好的在线表单替代静态 PDF，让客户通过分享链接或二维码完成需求填写。",
      },
      {
        question: "Can clients upload logos or brand files?",
        zhQuestion: "客户可以上传 Logo 或品牌文件吗？",
        answer:
          "This page does not promise file upload. Ask clients to paste links to brand assets, reference sites, or shared folders, then collect files through your normal project process.",
        zhAnswer:
          "本页不承诺文件上传能力。建议让客户粘贴品牌资产、参考网站或共享文件夹链接，再通过你的常规项目流程收集文件。",
      },
      {
        question: "Is this project management software?",
        zhQuestion: "这是项目管理软件吗？",
        answer:
          "No. GenForms helps collect client intake responses before kickoff. It does not replace project management tools, approval workflows, contracts, or task boards.",
        zhAnswer:
          "不是。GenForms 用于在 kickoff 前收集客户需求回复，不替代项目管理工具、审批流、合同或任务看板。",
      },
      {
        question: "Can I send new intake responses to Slack or another team channel?",
        zhQuestion: "可以把新提交推送到 Slack 或团队频道吗？",
        answer:
          "You can collect submissions first, then use webhook and bot notification paths for team follow-up where your workflow supports it.",
        zhAnswer:
          "可以先收集提交，再在你的工作流支持时，通过 Webhook 和 Bot 通知路径进行团队跟进。",
      },
    ],
    cta: "Create web design intake form",
    zhCta: "创建网站设计需求表",
    prompt:
      "Create a web design client intake form with client details, current website URL, project goals, target audience, reference websites, brand style preferences, required pages, budget range, launch timeline, and additional notes.",
    zhPrompt:
      "创建一个网站设计客户需求收集表，包含客户信息、现有网站 URL、项目目标、目标受众、参考网站、品牌风格偏好、所需页面、预算范围、上线时间和补充说明。",
    creationIntent: "client_intake",
    keywords: [
      "web design client intake form",
      "website design questionnaire",
      "web design intake form template",
      "client intake form for web designers",
      "website design client questionnaire",
    ],
    zhKeywords: [
      "网站设计客户需求表",
      "网站设计问卷",
      "建站客户需求收集表",
      "网页设计客户问卷",
      "Agency 客户需求表",
    ],
  },
  {
    slug: "clinic-appointment-request-form",
    templateId: "booking-consultation",
    title: "Clinic Appointment Request Form Builder",
    zhTitle: "诊所预约申请表单生成器",
    eyebrow: "Appointment intake",
    zhEyebrow: "预约登记入口",
    description:
      "Generate a clinic appointment request form for preferred times, contact details, visit type, and simple pre-visit notes.",
    zhDescription:
      "生成诊所预约申请表，收集预约时间、联系方式、就诊类型和简单到访前说明。",
    searchIntent:
      "Small clinics and service providers looking for a simple appointment request form without building a custom portal.",
    zhSearchIntent:
      "小型诊所和服务机构希望不用开发预约系统，也能先收集预约申请。",
    audience: "Clinics, wellness studios, and local service providers",
    zhAudience: "诊所、健康服务工作室和本地服务机构",
    recommendedFields: [
      "Name",
      "Phone",
      "Preferred date",
      "Preferred time window",
      "Visit type",
      "Pre-visit notes",
    ],
    zhRecommendedFields: [
      "姓名",
      "电话",
      "期望日期",
      "期望时间段",
      "就诊类型",
      "到访前说明",
    ],
    workflow: [
      "Generate the appointment form from a booking template.",
      "Customize visit types and availability wording.",
      "Publish the form and review requests before confirmation.",
    ],
    zhWorkflow: [
      "从预约模板生成表单。",
      "调整就诊类型和可预约时间说明。",
      "发布表单，并在确认前查看预约申请。",
    ],
    faq: [
      {
        question: "Is this a full scheduling system?",
        zhQuestion: "这是完整排班系统吗？",
        answer:
          "No. It is best for appointment requests and intake before manual confirmation.",
        zhAnswer:
          "不是。它更适合收集预约申请和初步登记，然后人工确认。",
      },
      {
        question: "Can I avoid collecting sensitive health data?",
        zhQuestion: "可以避免收集敏感健康信息吗？",
        answer:
          "Yes. Keep the form limited to appointment logistics and non-sensitive pre-visit notes.",
        zhAnswer:
          "可以。建议限制在预约安排和非敏感到访说明上。",
      },
    ],
    cta: "Create appointment form",
    zhCta: "创建预约申请表",
    prompt:
      "Create a clinic appointment request form with name, phone, preferred date, time window, visit type, and pre-visit notes.",
    zhPrompt:
      "创建一个诊所预约申请表，包含姓名、电话、期望日期、时间段、就诊类型和到访前说明。",
    keywords: [
      "clinic appointment form",
      "appointment request form",
      "booking form builder",
      "AI appointment form",
    ],
    zhKeywords: ["诊所预约表", "预约申请表", "预约表单生成器", "AI 预约表单"],
  },
  {
    slug: "real-estate-inquiry-form-template",
    templateId: "lead-capture",
    title: "Real Estate Inquiry Form Template",
    zhTitle: "房产咨询线索表单模板",
    eyebrow: "Property lead collection",
    zhEyebrow: "房产线索收集",
    description:
      "Create real estate inquiry forms that capture buyer or tenant intent, budget, preferred location, and contact details.",
    zhDescription:
      "创建房产咨询线索表单，收集买家或租客意向、预算、目标区域和联系方式。",
    searchIntent:
      "Real estate teams looking for a simple form to qualify property inquiries before follow-up.",
    zhSearchIntent:
      "房产团队需要在跟进前筛选咨询意向和预算范围。",
    audience: "Real estate agents, property managers, and local brokerages",
    zhAudience: "房产经纪人、物业管理方和本地中介团队",
    recommendedFields: [
      "Buyer or tenant name",
      "Contact details",
      "Budget range",
      "Preferred location",
      "Move-in timeline",
      "Property type",
    ],
    zhRecommendedFields: [
      "买家或租客姓名",
      "联系方式",
      "预算范围",
      "目标区域",
      "入住或购买时间",
      "房产类型",
    ],
    workflow: [
      "Generate a lead form tailored to property inquiries.",
      "Keep qualification questions short and easy to answer on mobile.",
      "Publish the form and route high-intent leads to your follow-up workflow.",
    ],
    zhWorkflow: [
      "生成适合房产咨询的线索表单。",
      "保持筛选问题简短，方便手机填写。",
      "发布表单，并将高意向线索推送到后续跟进流程。",
    ],
    faq: [
      {
        question: "Can this support rental and sales inquiries?",
        zhQuestion: "租赁和买卖咨询都能用吗？",
        answer:
          "Yes. Add a property intent field and adjust follow-up questions for rental or purchase workflows.",
        zhAnswer:
          "可以。增加意向类型字段，并根据租赁或购买调整后续问题。",
      },
      {
        question: "Can leads be sent to a webhook?",
        zhQuestion: "线索可以推送到 Webhook 吗？",
        answer:
          "Yes. Published forms can support webhook delivery and submission logs.",
        zhAnswer:
          "可以。发布后的表单可以支持 Webhook 推送和提交日志。",
      },
    ],
    cta: "Create property inquiry form",
    zhCta: "创建房产咨询表单",
    prompt:
      "Create a real estate inquiry form with buyer intent, budget, preferred location, timeline, property type, and contact fields.",
    zhPrompt:
      "创建一个房产咨询表单，包含购房或租房意向、预算、目标区域、时间计划、房产类型和联系方式。",
    keywords: [
      "real estate inquiry form",
      "property lead form",
      "real estate lead capture",
      "housing inquiry form template",
    ],
    zhKeywords: ["房产咨询表单", "房产线索表单", "地产获客表单", "房屋咨询模板"],
  },
  {
    slug: "course-registration-form-builder",
    templateId: "course-registration",
    title: "Course Registration Form Builder",
    zhTitle: "课程报名表单生成器",
    eyebrow: "Education & training registration",
    zhEyebrow: "教育与培训报名",
    description:
      "Create a mobile-friendly registration form for classes, training programs, workshops, or cohorts. Collect student details and learning goals, then share by link or QR code and review every response in one place.",
    zhDescription:
      "为课程、培训、工作坊或训练营创建移动端报名表，收集学员信息和学习目标，通过链接或二维码分享，并集中查看每一条回复。",
    searchIntent:
      "Course creators and education teams looking for a publishable course signup form.",
    zhSearchIntent:
      "课程创作者和教育团队需要一个可发布的课程报名表。",
    audience: "Course creators, educators, training teams, and workshop organizers",
    zhAudience: "课程创作者、教育者、培训团队和工作坊组织者",
    recommendedFields: [
      "Student name",
      "Email or phone",
      "Course, class, workshop, or training choice",
      "Experience level",
      "Learning goal",
      "Preferred session or time window (optional preference only)",
      "Learning support needs (optional; no medical diagnosis)",
      "Questions for the instructor",
      "Follow-up consent",
    ],
    zhRecommendedFields: [
      "学员姓名",
      "邮箱或电话",
      "课程、班级、工作坊或培训选择",
      "经验水平",
      "学习目标",
      "期望场次或时间段（仅收集偏好，不锁定）",
      "学习支持需求（可选，不收集医疗诊断）",
      "给讲师的问题",
      "后续联系许可",
    ],
    workflow: [
      "Describe the class, training program, workshop, or cohort and adjust the generated registration fields.",
      "Publish a public link and share it directly or through a QR code.",
      "Review registrations, export CSV, or route new responses through a generic Webhook or supported notification path.",
    ],
    zhWorkflow: [
      "描述课程、培训项目、工作坊或训练营，并调整 AI 生成的报名字段。",
      "发布公开链接，通过链接或二维码分享。",
      "查看报名、导出 CSV，或通过通用 Webhook 或支持的通知路径流转新回复。",
    ],
    faq: [
      {
        question: "Can I create a course registration form with AI?",
        zhQuestion: "可以用 AI 创建课程报名表吗？",
        answer:
          "Yes. Describe the class, course, training program, workshop, or cohort and GenForms can draft registration fields you can review before publishing.",
        zhAnswer:
          "可以。描述班级、课程、培训项目、工作坊或训练营，GenForms 会生成可在发布前检查和调整的报名字段。",
      },
      {
        question: "Can students register from a QR code?",
        zhQuestion: "学员可以通过二维码报名吗？",
        answer:
          "Yes. Publish the form as a public link and use QR access on course pages, posters, slides, handouts, or venue signs.",
        zhAnswer:
          "可以。表单发布为公开链接后，可将二维码用于课程页面、海报、幻灯片、讲义或现场指示牌。",
      },
      {
        question: "Does GenForms collect tuition or course payments?",
        zhQuestion: "GenForms 会收取学费或课程付款吗？",
        answer:
          "No. GenForms collects registration details and learning preferences. It does not process tuition, payments, refunds, coupons, or checkout.",
        zhAnswer:
          "不会。GenForms 收集报名信息和学习偏好，但不处理学费、付款、退款、优惠券或结账。",
      },
      {
        question: "Can GenForms enforce class size or seat limits?",
        zhQuestion: "GenForms 可以限制班级人数或名额吗？",
        answer:
          "No. The current product does not count or lock seats, stop submissions at a capacity threshold, or manage a waitlist automatically.",
        zhAnswer:
          "不可以。当前产品不会计数或锁定名额，也不会在达到容量后自动停止提交或管理候补名单。",
      },
      {
        question: "Does GenForms send confirmation emails or sync with an LMS?",
        zhQuestion: "GenForms 会发送确认邮件或同步 LMS 吗？",
        answer:
          "No. Production email confirmation, calendar invitations, certificates, attendance tracking, and native LMS synchronization are outside the current product promise.",
        zhAnswer:
          "不会。生产级确认邮件、日历邀请、证书、考勤跟踪和 LMS 原生同步不在当前产品承诺范围内。",
      },
      {
        question: "Where can I review course registrations?",
        zhQuestion: "在哪里查看课程报名？",
        answer:
          "Review responses in the submission dashboard, export CSV, or route new registrations through a generic Webhook or supported notification path.",
        zhAnswer:
          "可以在提交数据面板查看回复、导出 CSV，或通过通用 Webhook 或支持的通知路径流转新报名。",
      },
    ],
    cta: "Create course registration form",
    zhCta: "创建课程报名表",
    prompt:
      "Create a course registration form for classes, training programs, workshops, or cohorts with student name, contact details, course choice, experience level, learning goal, optional time preference, and follow-up consent. Do not promise payment, seat limits, automatic email, calendar booking, attendance, certificates, LMS sync, embed, or redirect.",
    zhPrompt:
      "创建一个适合课程、班级、培训项目、工作坊或训练营的报名表，收集学员姓名、联系方式、课程选择、经验水平、学习目标、可选时间偏好和后续联系许可。不要生成支付、名额锁定、自动邮件、日历预约、考勤、证书、LMS 同步、嵌入或跳转承诺。",
    creationIntent: "course_registration",
    keywords: [
      "course registration form",
      "workshop signup form",
      "training registration form",
      "AI course form builder",
    ],
    zhKeywords: ["课程报名表", "工作坊报名表", "培训报名表", "AI 课程表单"],
  },
  {
    slug: "saas-nps-survey-form-template",
    templateId: "nps-survey",
    title: "SaaS NPS Survey Form Template",
    zhTitle: "SaaS NPS 调查表单模板",
    eyebrow: "Customer loyalty signal",
    zhEyebrow: "客户忠诚度信号",
    description:
      "Create an NPS survey form for SaaS customers with score, segment, feedback reason, and follow-up intent.",
    zhDescription:
      "为 SaaS 客户创建 NPS 调查表单，收集评分、客户分层、反馈原因和后续跟进意向。",
    searchIntent:
      "SaaS teams looking for a simple NPS survey that can collect qualitative feedback after the score.",
    zhSearchIntent:
      "SaaS 团队希望在 NPS 分数之外，继续收集可行动的文字反馈。",
    audience: "SaaS founders, customer success teams, and product teams",
    zhAudience: "SaaS 创始人、客户成功和产品团队",
    recommendedFields: [
      "NPS score",
      "Account segment",
      "Reason for score",
      "Feature request",
      "Follow-up consent",
      "Contact email",
    ],
    zhRecommendedFields: [
      "NPS 分数",
      "客户分层",
      "评分原因",
      "功能建议",
      "是否愿意跟进",
      "联系邮箱",
    ],
    workflow: [
      "Start from the NPS survey template.",
      "Customize segments and follow-up prompts for your SaaS audience.",
      "Publish the survey and review responses from the submissions dashboard.",
    ],
    zhWorkflow: [
      "从 NPS 调查模板开始。",
      "根据 SaaS 客群调整分层和跟进问题。",
      "发布调查，并在提交数据面板查看反馈。",
    ],
    faq: [
      {
        question: "Should an NPS form ask more than the score?",
        zhQuestion: "NPS 表单只问分数够吗？",
        answer:
          "The score is useful, but short qualitative fields explain what to fix or double down on.",
        zhAnswer:
          "分数有用，但简短的文字反馈能说明应该修复什么或继续强化什么。",
      },
      {
        question: "Can I follow up with promoters or detractors?",
        zhQuestion: "可以跟进推荐者或贬损者吗？",
        answer:
          "Yes. Add follow-up consent and contact fields so your team can respond to high-signal answers.",
        zhAnswer:
          "可以。增加跟进授权和联系方式字段，方便团队回应高价值反馈。",
      },
    ],
    cta: "Create NPS survey",
    zhCta: "创建 NPS 调查",
    prompt:
      "Create a SaaS NPS survey with score, customer segment, reason, feature request, follow-up consent, and contact email.",
    zhPrompt:
      "创建一个 SaaS NPS 调查，包含分数、客户分层、评分原因、功能建议、跟进授权和联系邮箱。",
    keywords: [
      "SaaS NPS survey",
      "NPS survey form",
      "customer loyalty form",
      "product feedback survey",
    ],
    zhKeywords: ["SaaS NPS 调查", "NPS 表单", "客户忠诚度调查", "产品反馈调查"],
  },
  {
    slug: "user-interview-recruitment-form",
    templateId: "user-interview-recruitment",
    title: "User Interview Recruitment Form",
    zhTitle: "用户访谈招募表单",
    eyebrow: "Research participant intake",
    zhEyebrow: "调研用户招募",
    description:
      "Recruit product interview participants with a form that captures profile, availability, product usage, and research fit.",
    zhDescription:
      "用表单招募产品访谈用户，收集用户画像、可用时间、产品使用情况和调研匹配度。",
    searchIntent:
      "Product teams looking for a lightweight way to recruit and screen interview participants.",
    zhSearchIntent:
      "产品团队希望轻量招募并筛选用户访谈参与者。",
    audience: "Product managers, UX researchers, and founders",
    zhAudience: "产品经理、UX 研究员和创始人",
    recommendedFields: [
      "Name",
      "Email",
      "Role",
      "Product usage",
      "Interview availability",
      "Research incentive preference",
    ],
    zhRecommendedFields: [
      "姓名",
      "邮箱",
      "角色",
      "产品使用情况",
      "访谈可用时间",
      "激励偏好",
    ],
    workflow: [
      "Start from the user interview recruitment template.",
      "Tune screening questions for your product stage.",
      "Publish the form and shortlist participants from submissions.",
    ],
    zhWorkflow: [
      "从用户访谈招募模板开始。",
      "根据产品阶段调整筛选问题。",
      "发布表单，并从提交数据中筛选候选用户。",
    ],
    faq: [
      {
        question: "Can this screen participants before scheduling?",
        zhQuestion: "可以在预约前筛选访谈对象吗？",
        answer:
          "Yes. Use role, usage, and availability fields to shortlist participants before outreach.",
        zhAnswer:
          "可以。通过角色、使用情况和可用时间字段，先筛选再联系。",
      },
      {
        question: "Can I adapt it for beta user interviews?",
        zhQuestion: "可以改成 Beta 用户访谈吗？",
        answer:
          "Yes. Ask AI to add beta usage, bug experience, and feature priority questions.",
        zhAnswer:
          "可以。可以让 AI 增加 Beta 使用情况、问题体验和功能优先级问题。",
      },
    ],
    cta: "Create user interview recruitment form",
    zhCta: "创建访谈招募表",
    prompt:
      "Create a user interview recruitment form with role, product usage, availability, research fit, and incentive preference.",
    zhPrompt:
      "创建一个用户访谈招募表，包含角色、产品使用情况、可用时间、调研匹配度和激励偏好。",
    keywords: [
      "user interview recruitment form",
      "UX research screener",
      "participant recruitment form",
      "product research form",
    ],
    zhKeywords: ["用户访谈招募表", "UX 调研筛选表", "访谈用户招募", "产品调研表单"],
  },
  {
    slug: "website-contact-form-template",
    templateId: "contact-us",
    title: "Website Contact Form Template for Business Inquiries",
    zhTitle: "官网业务咨询表单模板",
    eyebrow: "Website inquiry workflow",
    zhEyebrow: "官网咨询收集流程",
    description:
      "Create a professional website contact form that captures inquiry type, contact details, project context, and follow-up preferences.",
    zhDescription:
      "创建专业的官网业务咨询表单，收集咨询类型、联系方式、项目背景和后续跟进偏好。",
    searchIntent:
      "Website owners and SaaS teams looking for a polished contact form that collects enough context for follow-up.",
    zhSearchIntent:
      "网站所有者和 SaaS 团队需要一个更专业的联系表单，用于收集足够的业务跟进信息。",
    audience: "SaaS teams, agencies, consultants, and business websites",
    zhAudience: "SaaS 团队、服务机构、咨询顾问和商业网站",
    recommendedFields: [
      "Full name",
      "Work email",
      "Company or website",
      "Inquiry type",
      "Project or request summary",
      "Preferred follow-up method",
    ],
    zhRecommendedFields: [
      "姓名",
      "工作邮箱",
      "公司或网站",
      "咨询类型",
      "项目或需求摘要",
      "偏好跟进方式",
    ],
    workflow: [
      "Start from the contact form template instead of a blank page.",
      "Use AI to tailor inquiry types, follow-up questions, and concise helper copy.",
      "Publish the form and route new business inquiries into your review or webhook workflow.",
    ],
    zhWorkflow: [
      "从联系我们模板开始，而不是从空白表单搭建。",
      "用 AI 调整咨询类型、跟进问题和简洁提示文案。",
      "发布表单，并把新业务咨询接入审核或 Webhook 流程。",
    ],
    faq: [
      {
        question: "What should a website contact form ask?",
        zhQuestion: "官网联系表单应该问什么？",
        answer:
          "Ask for contact details, inquiry type, request context, and preferred follow-up method. Avoid asking for too much before the first conversation.",
        zhAnswer:
          "建议收集联系方式、咨询类型、需求背景和偏好跟进方式。第一次沟通前不要要求用户填写过多内容。",
      },
      {
        question: "Is this better than a basic email link?",
        zhQuestion: "这比直接放邮箱链接更好吗？",
        answer:
          "Yes when you need structured context. A form helps route inquiries, qualify requests, and keep submissions visible in one dashboard.",
        zhAnswer:
          "当你需要结构化上下文时会更好。表单可以帮助分流咨询、初步筛选需求，并让提交集中在一个数据面板中。",
      },
      {
        question: "Can contact form submissions go to a webhook?",
        zhQuestion: "联系表单提交可以推送到 Webhook 吗？",
        answer:
          "Yes. Published forms can support webhook-oriented handoff so new inquiries can enter your follow-up workflow.",
        zhAnswer:
          "可以。发布后的表单可以支持 Webhook 形式的后续流转，让新咨询进入跟进流程。",
      },
    ],
    cta: "Create website contact form",
    zhCta: "创建官网联系表单",
    prompt:
      "Create a professional website contact form with name, work email, company, inquiry type, request summary, and preferred follow-up method.",
    zhPrompt:
      "创建一个专业官网联系表单，包含姓名、工作邮箱、公司、咨询类型、需求摘要和偏好跟进方式。",
    keywords: [
      "website contact form template",
      "business inquiry form",
      "professional contact form",
      "AI contact form builder",
      "contact form with webhook",
    ],
    zhKeywords: ["官网联系表单", "业务咨询表单", "专业联系表单", "AI 联系表单", "Webhook 联系表单"],
  },
  {
    slug: "lead-magnet-download-form",
    templateId: "content-download",
    title: "AI Lead Magnet Access Request Form Builder",
    zhTitle: "内容资料访问申请表单",
    eyebrow: "AI resource request lead capture",
    zhEyebrow: "资料访问申请获客",
    description:
      "Create an AI lead magnet access request form for PDFs, whitepapers, reports, and gated resources while collecting qualified lead context before your team handles delivery separately.",
    zhDescription:
      "创建内容资料访问申请表，在团队通过现有流程提供电子书、清单或其他资料前，先收集合格线索信息。",
    searchIntent:
      "Marketing teams searching for a form that collects gated-content requests and qualification context before an external resource-delivery step.",
    zhSearchIntent:
      "营销团队需要一个简单的资料下载表单来获取销售线索。",
    audience: "B2B marketers, SaaS teams, and content creators",
    zhAudience: "B2B 营销、SaaS 团队和内容创作者",
    recommendedFields: [
      "Work email",
      "Company",
      "Role",
      "Team size",
      "Resource interest",
      "Consent checkbox",
    ],
    zhRecommendedFields: [
      "工作邮箱",
      "公司",
      "角色",
      "团队规模",
      "资料兴趣",
      "同意条款",
    ],
    workflow: [
      "Start from the lead magnet access request template and name the resource users can request.",
      "Keep the form short: email, company, role, and one qualification field are usually enough.",
      "Publish the request form, review submissions, and use your existing process to provide the resource separately.",
    ],
    zhWorkflow: [
      "从资料访问申请模板开始，并写清可申请的资料。",
      "保持表单足够简短，避免影响转化。",
      "发布申请表、查看提交，并通过团队现有流程另行提供资料。",
    ],
    faq: [
      {
        question: "How many fields should a lead magnet form have?",
        zhQuestion: "内容下载表单应该有多少字段？",
        answer:
          "Start with email, role, company, and one qualification field. Add more only when sales follow-up needs it.",
        zhAnswer:
          "建议从邮箱、角色、公司和一个筛选字段开始。只有销售跟进需要时再增加字段。",
      },
      {
        question: "Can AI help create a lead download form?",
        zhQuestion: "AI 可以帮助创建资料下载表单吗？",
        answer:
          "Yes. Start with the download goal, target audience, and qualification fields, then let AI draft the form structure before you publish it.",
        zhAnswer:
          "可以。先说明资料下载目标、目标用户和筛选字段，再让 AI 生成表单结构并发布。",
      },
      {
        question: "What should happen after someone requests the download?",
        zhQuestion: "用户请求下载后应该做什么？",
        answer:
          "Show a clear request-submitted message, review the entry, and provide the resource through your existing delivery process. GenForms does not automatically email or host the file in this workflow.",
        zhAnswer:
          "建议展示清晰的申请成功提示、查看提交，再通过现有交付流程提供资料。当前流程不承诺由 GenForms 自动发送邮件或托管文件。",
      },
      {
        question: "Can this work without a CRM integration?",
        zhQuestion: "没有 CRM 集成也能用吗？",
        answer:
          "Yes. You can publish the form, collect submissions, and later connect webhook delivery.",
        zhAnswer:
          "可以。可以先发布收集提交，后续再接入 Webhook 流转。",
      },
    ],
    cta: "Create resource request form",
    zhCta: "创建资料申请表",
    prompt:
      "Create a lead magnet access request form for a PDF or whitepaper with work email, company, role, team size, resource interest, consent, and a clear request-submitted message. Do not promise automatic file or email delivery.",
    zhPrompt:
      "创建一个内容资料访问申请表，包含工作邮箱、公司、角色、团队规模、资料兴趣和同意条款；不要承诺自动发送邮件或文件。",
    keywords: [
      "lead magnet download form",
      "AI lead form download",
      "gated content form",
      "content download form",
      "resource download lead form",
    ],
    zhKeywords: ["内容下载表单", "资料下载获客", "门控内容表单", "资源下载线索表单"],
  },
  {
    slug: "beta-feedback-form-template",
    templateId: "beta-feedback",
    title: "Beta Feedback Form Template",
    zhTitle: "Beta 测试反馈表单模板",
    eyebrow: "Product beta feedback",
    zhEyebrow: "产品内测反馈",
    description:
      "Collect beta tester feedback with fields for usability, bugs, missing features, severity, and follow-up consent.",
    zhDescription:
      "收集 Beta 测试用户反馈，包含易用性、Bug、缺失功能、严重程度和后续跟进授权。",
    searchIntent:
      "Product teams looking for a structured beta feedback form before public launch.",
    zhSearchIntent:
      "产品团队希望在正式发布前结构化收集 Beta 测试反馈。",
    audience: "Product teams, founders, and beta program managers",
    zhAudience: "产品团队、创始人和 Beta 项目负责人",
    recommendedFields: [
      "Tester email",
      "Usage scenario",
      "Usability rating",
      "Bug description",
      "Feature request",
      "Severity",
    ],
    zhRecommendedFields: [
      "测试用户邮箱",
      "使用场景",
      "易用性评分",
      "Bug 描述",
      "功能建议",
      "严重程度",
    ],
    workflow: [
      "Start from the beta feedback template.",
      "Customize rating and bug fields for your product.",
      "Publish the form to beta users and review submissions by severity.",
    ],
    zhWorkflow: [
      "从 Beta 反馈模板开始。",
      "根据产品调整评分和 Bug 字段。",
      "发给内测用户，并按严重程度查看提交。",
    ],
    faq: [
      {
        question: "Should beta feedback be open-ended?",
        zhQuestion: "Beta 反馈应该完全开放填写吗？",
        answer:
          "Use a mix of rating, severity, and open text fields so feedback is both structured and rich.",
        zhAnswer:
          "建议结合评分、严重程度和开放文本字段，让反馈既结构化又有细节。",
      },
      {
        question: "Can this help prioritize fixes?",
        zhQuestion: "它能帮助排序修复优先级吗？",
        answer:
          "Yes. Severity and usage scenario fields help your team triage the highest impact issues first.",
        zhAnswer:
          "可以。严重程度和使用场景字段能帮助团队优先处理影响最大的问题。",
      },
    ],
    cta: "Create beta feedback form",
    zhCta: "创建 Beta 反馈表",
    prompt:
      "Create a beta feedback form with usability rating, bug report, feature request, severity, and follow-up consent.",
    zhPrompt:
      "创建一个 Beta 反馈表单，包含易用性评分、Bug 报告、功能建议、严重程度和跟进授权。",
    keywords: [
      "beta feedback form",
      "beta tester feedback template",
      "product beta survey",
      "bug feedback form",
    ],
    zhKeywords: ["Beta 反馈表", "内测反馈模板", "产品内测调查", "Bug 反馈表"],
  },
  {
    slug: "community-application-form-template",
    templateId: "community-application",
    title: "Community Application Form Template",
    zhTitle: "社群申请表单模板",
    eyebrow: "Member screening workflow",
    zhEyebrow: "成员筛选入口",
    description:
      "Create a community application form to screen members by motivation, background, expectations, and contribution intent.",
    zhDescription:
      "创建社群申请表单，按加入动机、背景、期望和贡献意愿筛选新成员。",
    searchIntent:
      "Community operators looking for a lightweight application form before inviting members.",
    zhSearchIntent:
      "社群运营者希望在邀请成员前，用轻量申请表完成筛选。",
    audience: "Community builders, cohort operators, and membership groups",
    zhAudience: "社群创建者、训练营运营和会员组织",
    recommendedFields: [
      "Name",
      "Email",
      "Background",
      "Reason for joining",
      "Expected value",
      "Contribution intent",
    ],
    zhRecommendedFields: [
      "姓名",
      "邮箱",
      "背景",
      "加入原因",
      "期望价值",
      "贡献意愿",
    ],
    workflow: [
      "Start from the community application template.",
      "Tune questions for your membership criteria.",
      "Publish the form and review applicants before sending invites.",
    ],
    zhWorkflow: [
      "从社群申请模板开始。",
      "根据成员标准调整问题。",
      "发布表单，并在发送邀请前审核申请者。",
    ],
    faq: [
      {
        question: "Can this reduce low-fit members?",
        zhQuestion: "它能减少不合适成员吗？",
        answer:
          "Yes. Motivation and contribution fields help filter applicants before they enter the group.",
        zhAnswer:
          "可以。加入动机和贡献意愿字段能在入群前帮助筛选。",
      },
      {
        question: "Can I use it for paid communities?",
        zhQuestion: "付费社群可以用吗？",
        answer:
          "Yes. Add payment status or plan interest fields if you need qualification before checkout.",
        zhAnswer:
          "可以。如果需要付款前筛选，可以加入付款状态或套餐意向字段。",
      },
    ],
    cta: "Create community application",
    zhCta: "创建社群申请表",
    prompt:
      "Create a community application form with background, joining motivation, expectations, contribution intent, and contact fields.",
    zhPrompt:
      "创建一个社群申请表单，包含背景、加入动机、期望、贡献意愿和联系方式。",
    keywords: [
      "community application form",
      "membership application form",
      "community signup form",
      "member screening form",
    ],
    zhKeywords: ["社群申请表", "会员申请表", "社群报名表", "成员筛选表"],
  },
  {
    slug: "job-application-form-builder",
    templateId: "job-application",
    title: "Job Application Form Builder",
    zhTitle: "招聘申请表单生成器",
    eyebrow: "Hiring intake workflow",
    zhEyebrow: "招聘候选人收集入口",
    description:
      "Create a job application form that collects candidate details, role interest, portfolio links, screening questions, and follow-up consent.",
    zhDescription:
      "创建招聘申请表单，收集候选人信息、意向岗位、作品链接、筛选问题和后续联系授权。",
    searchIntent:
      "Small teams and hiring managers looking for a simple job application form before adopting a full ATS.",
    zhSearchIntent:
      "小团队和招聘负责人希望在使用完整 ATS 前，先用简单表单收集候选人。",
    audience: "Founders, hiring managers, recruiters, and small business teams",
    zhAudience: "创始人、招聘负责人、HR 和小企业团队",
    recommendedFields: [
      "Candidate name",
      "Email and phone",
      "Target role",
      "Resume or portfolio link",
      "Relevant experience",
      "Availability",
    ],
    zhRecommendedFields: [
      "候选人姓名",
      "邮箱和电话",
      "目标岗位",
      "简历或作品链接",
      "相关经验",
      "可入职时间",
    ],
    workflow: [
      "Start from the job application template.",
      "Adjust screening questions for the role and hiring stage.",
      "Publish the form and review applications from the submissions dashboard.",
    ],
    zhWorkflow: [
      "从招聘申请模板开始。",
      "根据岗位和招聘阶段调整筛选问题。",
      "发布表单，并在提交数据面板查看申请。",
    ],
    faq: [
      {
        question: "Is this a replacement for an ATS?",
        zhQuestion: "它可以替代 ATS 吗？",
        answer:
          "No. It is best for lightweight application intake before you need full recruiting pipeline management.",
        zhAnswer:
          "不完全替代。它更适合在需要完整招聘管道之前，先做轻量候选人收集。",
      },
      {
        question: "Can I ask role-specific screening questions?",
        zhQuestion: "可以加入岗位相关筛选问题吗？",
        answer:
          "Yes. Use AI to tailor experience, availability, portfolio, and motivation questions for each role.",
        zhAnswer:
          "可以。可以让 AI 根据岗位调整经验、可入职时间、作品和动机问题。",
      },
    ],
    cta: "Create job application form",
    zhCta: "创建招聘申请表",
    prompt:
      "Create a job application form with candidate details, target role, resume link, portfolio link, relevant experience, and availability.",
    zhPrompt:
      "创建一个招聘申请表单，包含候选人信息、目标岗位、简历链接、作品链接、相关经验和可入职时间。",
    keywords: [
      "job application form builder",
      "job application form template",
      "candidate application form",
      "hiring intake form",
    ],
    zhKeywords: ["招聘申请表", "职位申请表模板", "候选人申请表", "招聘收集表单"],
  },
  {
    slug: "newsletter-signup-form-builder",
    templateId: "newsletter-signup",
    title: "Newsletter Signup Form Builder",
    zhTitle: "Newsletter 订阅表单生成器",
    eyebrow: "Audience list growth",
    zhEyebrow: "订阅用户增长入口",
    description:
      "Create a newsletter signup form that captures email, audience segment, content interest, consent, and source context.",
    zhDescription:
      "创建 Newsletter 订阅表单，收集邮箱、用户分层、内容兴趣、订阅授权和来源语境。",
    searchIntent:
      "Creators and marketing teams looking for a lightweight signup form to grow an email list.",
    zhSearchIntent:
      "创作者和营销团队希望用轻量订阅表单增长邮件列表。",
    audience: "Creators, marketers, SaaS teams, and community operators",
    zhAudience: "创作者、营销团队、SaaS 团队和社群运营者",
    recommendedFields: [
      "Email",
      "Name",
      "Content interest",
      "Role or segment",
      "Consent checkbox",
      "Referral source",
    ],
    zhRecommendedFields: [
      "邮箱",
      "姓名",
      "内容兴趣",
      "角色或用户分层",
      "订阅授权",
      "来源渠道",
    ],
    workflow: [
      "Start from the newsletter signup template.",
      "Keep the form short and ask only the fields needed for segmentation.",
      "Publish the form and review subscribers from the submissions dashboard.",
    ],
    zhWorkflow: [
      "从 Newsletter 订阅模板开始。",
      "保持表单简短，只询问分层真正需要的字段。",
      "发布表单，并在提交数据面板查看订阅用户。",
    ],
    faq: [
      {
        question: "How many fields should a signup form collect?",
        zhQuestion: "订阅表单应该收集多少字段？",
        answer:
          "Start with email and one interest field. Add name or segment only when it improves follow-up.",
        zhAnswer:
          "建议从邮箱和一个兴趣字段开始。只有对后续触达有帮助时，再增加姓名或分层字段。",
      },
      {
        question: "Can this work as a waitlist form?",
        zhQuestion: "它可以当 Waitlist 表单用吗？",
        answer:
          "Yes. Add product interest and early-access fields if the newsletter also serves as a waitlist.",
        zhAnswer:
          "可以。如果 Newsletter 同时承担候补名单功能，可以增加产品兴趣和早期访问字段。",
      },
    ],
    cta: "Create newsletter signup form",
    zhCta: "创建订阅表单",
    prompt:
      "Create a newsletter signup form with email, name, content interest, audience segment, consent, and referral source.",
    zhPrompt:
      "创建一个 Newsletter 订阅表单，包含邮箱、姓名、内容兴趣、用户分层、订阅授权和来源渠道。",
    keywords: [
      "newsletter signup form builder",
      "newsletter signup form template",
      "email signup form",
      "audience signup form",
    ],
    zhKeywords: ["Newsletter 订阅表单", "邮件订阅表单", "订阅表单模板", "用户订阅收集"],
  },
  {
    slug: "customer-testimonial-collection-form",
    templateId: "customer-testimonial-form",
    title: "Customer Testimonial Collection Form",
    zhTitle: "客户证言收集表单",
    eyebrow: "Customer story intake",
    zhEyebrow: "客户故事收集入口",
    description:
      "Create a customer testimonial form that collects outcomes, quotes, publishing preferences, company context, and follow-up details.",
    zhDescription:
      "创建客户证言收集表单，收集使用结果、引用语、公开使用偏好、公司语境和后续联系信息。",
    searchIntent:
      "Marketing teams looking for a structured way to collect testimonials and customer stories.",
    zhSearchIntent:
      "营销团队希望结构化收集客户评价、引用语和客户故事素材。",
    audience: "B2B marketers, customer success teams, founders, and agencies",
    zhAudience: "B2B 营销、客户成功、创始人和代理服务团队",
    recommendedFields: [
      "Customer name",
      "Company or role",
      "Use case",
      "Outcome or result",
      "Quote permission",
      "Follow-up contact",
    ],
    zhRecommendedFields: [
      "客户姓名",
      "公司或角色",
      "使用场景",
      "结果或收益",
      "引用授权",
      "后续联系方式",
    ],
    workflow: [
      "Start from the customer story template.",
      "Ask for concrete outcomes instead of generic praise.",
      "Publish the form and manually review each testimonial and its publishing preference before using quotes publicly.",
    ],
    zhWorkflow: [
      "从客户故事模板开始。",
      "询问具体结果，而不是只收集泛泛好评。",
      "发布表单，并在公开引用前人工审核客户提交及其公开使用偏好。",
    ],
    faq: [
      {
        question: "Should testimonial forms include permission fields?",
        zhQuestion: "客户证言表单需要授权字段吗？",
        answer:
          "Yes. Record a publishing preference and follow-up contact, then have your team confirm any legal release requirements through its existing process before publication.",
        zhAnswer:
          "需要。建议记录公开使用偏好和后续联系方式；正式发布前，仍应由团队通过现有流程确认适用的法律授权要求。",
      },
      {
        question: "What makes a testimonial useful?",
        zhQuestion: "什么样的客户证言更有用？",
        answer:
          "Ask for the original problem, the workflow used, and the measurable result rather than only a satisfaction sentence.",
        zhAnswer:
          "应询问原始问题、使用流程和可衡量结果，而不只是收集一句满意评价。",
      },
      {
        question: "Can customers upload logos, headshots, or screenshots?",
        zhQuestion: "客户可以上传 Logo、头像或截图吗？",
        answer:
          "No. The current GenForms template collects text, publishing preferences, and optional links or contact details. Collect files through your existing external process when needed.",
        zhAnswer:
          "不可以。当前 GenForms 模板收集文本、公开使用偏好以及可选链接或联系方式；如需文件，请通过团队现有外部流程收集。",
      },
    ],
    cta: "Create testimonial form",
    zhCta: "创建客户证言表",
    prompt:
      "Create a customer testimonial collection form with customer details, use case, result, quote, publishing preference, and follow-up contact. Do not add file, logo, headshot, or screenshot upload fields, and do not claim this replaces a legal release.",
    zhPrompt:
      "创建一个客户证言收集表，包含客户信息、使用场景、结果、引用语、公开使用偏好和后续联系方式。不要增加文件、Logo、头像或截图上传字段，也不要承诺该表单可以替代正式法律授权。",
    creationIntent: "customer_testimonial",
    keywords: [
      "customer testimonial form",
      "testimonial collection form",
      "customer story form",
      "case study intake form",
    ],
    zhKeywords: ["客户证言表单", "客户评价收集", "客户故事表单", "案例素材收集表"],
  },
  {
    slug: "portfolio-submission-form-template",
    templateId: "portfolio-submission",
    title: "Portfolio Submission Form Template",
    zhTitle: "作品集提交表单模板",
    eyebrow: "Creative submission intake",
    zhEyebrow: "作品提交入口",
    description:
      "Create a portfolio submission form for creators, applicants, communities, or showcases with links, categories, notes, and permissions.",
    zhDescription:
      "为创作者、申请者、社群或展示活动创建作品集提交表单，收集链接、分类、说明和展示授权。",
    searchIntent:
      "Communities, schools, and teams looking for a structured portfolio or project submission form.",
    zhSearchIntent:
      "社群、学校和团队希望结构化收集作品集、项目或创作提交。",
    audience: "Creative communities, educators, hiring teams, and showcase organizers",
    zhAudience: "创作者社群、教育者、招聘团队和展示活动组织者",
    recommendedFields: [
      "Submitter name",
      "Email",
      "Portfolio or project link",
      "Category",
      "Project description",
      "Display permission",
    ],
    zhRecommendedFields: [
      "提交人姓名",
      "邮箱",
      "作品集或项目链接",
      "作品分类",
      "项目说明",
      "展示授权",
    ],
    workflow: [
      "Start from the portfolio submission template.",
      "Customize categories and permission wording for the showcase or review process.",
      "Publish the form and review submissions from one dashboard.",
    ],
    zhWorkflow: [
      "从作品集提交模板开始。",
      "根据展示或审核流程调整分类和授权文案。",
      "发布表单，并在同一个数据面板查看提交。",
    ],
    faq: [
      {
        question: "Can this collect project links instead of file uploads?",
        zhQuestion: "可以收集项目链接而不是上传文件吗？",
        answer:
          "Yes. Use URL fields for portfolio links, live demos, GitHub repos, or design files.",
        zhAnswer:
          "可以。可以用 URL 字段收集作品集、在线演示、GitHub 仓库或设计文件链接。",
      },
      {
        question: "Should permission be included?",
        zhQuestion: "需要包含展示授权吗？",
        answer:
          "Yes. Permission fields help clarify whether a submission can be displayed publicly.",
        zhAnswer:
          "建议包含。展示授权字段能明确作品是否可以公开展示。",
      },
    ],
    cta: "Create portfolio submission form",
    zhCta: "创建作品提交表",
    prompt:
      "Create a portfolio submission form with submitter details, project link, category, description, and display permission.",
    zhPrompt:
      "创建一个作品集提交表单，包含提交人信息、项目链接、分类、说明和展示授权。",
    keywords: [
      "portfolio submission form",
      "project submission form template",
      "creative submission form",
      "showcase application form",
    ],
    zhKeywords: ["作品集提交表", "项目提交表单", "创作提交表", "展示申请表单"],
  },
  {
    slug: "expense-reimbursement-form-template",
    templateId: "invoice-receipt-collection",
    title: "Expense Reimbursement Form Template",
    zhTitle: "费用报销票据收集表单模板",
    eyebrow: "Receipt and expense intake",
    zhEyebrow: "票据和费用收集",
    description:
      "Create an expense reimbursement form for receipts, applicant details, amount, category, and finance follow-up.",
    zhDescription:
      "创建费用报销票据收集表单，收集票据、申请人、金额、费用类别和财务跟进信息。",
    searchIntent:
      "Small teams looking for a simple reimbursement and receipt collection form before finance review.",
    zhSearchIntent:
      "小团队希望在财务审核前，用表单统一收集报销和票据信息。",
    audience: "Finance teams, operations teams, and small businesses",
    zhAudience: "财务团队、运营团队和小企业",
    recommendedFields: [
      "Applicant name",
      "Receipt upload",
      "Expense amount",
      "Expense category",
      "Business purpose",
      "Approver or department",
    ],
    zhRecommendedFields: [
      "申请人姓名",
      "票据上传",
      "费用金额",
      "费用类别",
      "业务用途",
      "审批人或部门",
    ],
    workflow: [
      "Start from the receipt collection template.",
      "Customize categories and required receipt fields.",
      "Publish the form and review submissions before finance processing.",
    ],
    zhWorkflow: [
      "从票据收集模板开始。",
      "自定义费用类别和必填票据字段。",
      "发布表单，并在财务处理前查看提交。",
    ],
    faq: [
      {
        question: "Is this a full finance approval system?",
        zhQuestion: "这是完整财务审批系统吗？",
        answer:
          "No. It is best for intake, receipt collection, and structured submission before your finance process.",
        zhAnswer:
          "不是。它更适合作为财务流程前的统一登记、票据收集和结构化提交入口。",
      },
      {
        question: "Can it collect receipt images?",
        zhQuestion: "可以收集票据图片吗？",
        answer:
          "Yes. Use upload fields to collect receipts and keep the submitted records in one dashboard.",
        zhAnswer:
          "可以。可以通过上传字段收集票据，并在同一个数据面板查看提交记录。",
      },
    ],
    cta: "Create reimbursement form",
    zhCta: "创建报销表单",
    prompt:
      "Create an expense reimbursement form with applicant details, receipt upload, amount, category, business purpose, and approver.",
    zhPrompt:
      "创建一个费用报销表单，包含申请人信息、票据上传、金额、费用类别、业务用途和审批人。",
    keywords: [
      "expense reimbursement form",
      "receipt collection form",
      "invoice receipt form",
      "reimbursement form template",
    ],
    zhKeywords: ["费用报销表单", "票据收集表", "发票收集表", "报销表模板"],
  },
];

const retiredSolutionSlugs = new Set([
  "lead-magnet-download-form",
  "newsletter-signup-form-builder",
  "community-application-form-template",
  "customer-testimonial-collection-form",
]);

export const solutionLandingPages = allSolutionLandingPages.filter(
  (page) => !retiredSolutionSlugs.has(page.slug)
);

export function getSolutionLandingPage(slug: string) {
  return solutionLandingPages.find((page) => page.slug === slug);
}

export function getSolutionLandingPagesWithTemplates() {
  return solutionLandingPages.map((page) => ({
    ...page,
    template: getSceneTemplateById(page.templateId),
  }));
}
