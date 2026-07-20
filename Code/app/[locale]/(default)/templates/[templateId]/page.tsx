import Link from "next/link";
import { notFound } from "next/navigation";
import { getSceneTemplateById, getHomepageSceneTemplates } from "@/services/form-templates";
import { ArrowLeft, Sparkles, Check, Database, Share2, Webhook, Cpu, Route, HelpCircle } from "lucide-react";
import InteractiveDetailPreview from "@/components/templates/interactive-detail-preview";
import TemplateUseButton from "@/components/templates/template-use-button";
import TemplateViewTracker from "@/components/templates/template-view-tracker";
import { buildBreadcrumbListJsonLd } from "@/components/seo/breadcrumb-json-ld";
import JsonLd from "@/components/seo/json-ld";
import { localizePath } from "@/lib/localized-path";
import { getTemplateCreationDefaults } from "@/services/form-creation-context";
import { solutionLandingPages } from "@/services/solution-landing-pages";
import { useCaseLandingPages } from "@/services/use-case-landing-pages";

interface Props {
  params: Promise<{ locale: string; templateId: string }>;
  searchParams?: Promise<{
    theme?: string;
    source?: string;
    intent?: string;
    mode?: string;
    prompt?: string;
  }>;
}

const templateSeoOverrides: Record<
  string,
  {
    titleEn: string;
    descriptionEn: string;
    titleZh?: string;
    descriptionZh?: string;
  }
> = {
  "job-application": {
    titleEn: "Lightweight Job Application Form Template | GenForms",
    descriptionEn:
      "Collect candidate contact details, target role, experience, and professional profile links. This lightweight template does not host resume files or provide an ATS pipeline.",
    titleZh: "轻量候选人意向登记表模板 | GenForms",
    descriptionZh:
      "收集候选人联系方式、目标岗位、经验和职业主页链接；该轻量模板不托管简历文件，也不提供 ATS 候选人管道。",
  },
  "booking-consultation": {
    titleEn: "Consultation Request Form Template | GenForms",
    descriptionEn:
      "Collect consultation topics, preferred time windows, and contact details for manual review and confirmation. This is not a real-time calendar scheduling system.",
    titleZh: "咨询预约申请表模板 | GenForms",
    descriptionZh:
      "收集咨询主题、期望时间段和联系方式，由团队人工查看并确认；这不是实时日历排期系统。",
  },
  "nps-survey": {
    titleEn: "NPS Survey Maker - Free AI Form Template",
    descriptionEn:
      "Use this free NPS survey maker template to measure customer loyalty, collect detractor reasons, and prepare follow-up actions with AI.",
  },
  "satisfaction-survey": {
    titleEn: "Customer Satisfaction Survey Template | GenForms",
    descriptionEn:
      "Use this customer satisfaction survey template to collect ratings, comments, improvement ideas, and follow-up consent, then review responses or export CSV.",
    titleZh: "客户满意度调查模板 | GenForms",
    descriptionZh:
      "使用客户满意度调查模板收集评分、意见、改进建议和回访许可，并在数据面板查看回复或导出 CSV。",
  },
  "quote-request": {
    titleEn: "Quote Request Form Template | GenForms",
    descriptionEn:
      "Use this quote request form template to collect service needs, project scope, budget, timeline, and contact details, then review responses or export CSV.",
    titleZh: "询价需求表单模板 | GenForms",
    descriptionZh:
      "使用询价需求表单模板收集服务类型、项目范围、预算、时间和联系方式，并在数据面板查看回复或导出 CSV。",
  },
  "demo-request": {
    titleEn: "Demo Request Form Template | GenForms",
    descriptionEn:
      "Use this demo request form template to collect work contact details, company context, team size, use case, and evaluation timeline before sales follow-up.",
    titleZh: "Demo 申请表单模板 | GenForms",
    descriptionZh:
      "使用 Demo 申请表单模板，在销售跟进前收集工作联系方式、公司背景、团队规模、使用场景和评估时间。",
  },
  "content-download": {
    titleEn: "Lead Magnet Access Request Form Template | GenForms",
    descriptionEn:
      "Collect lead magnet access requests, resource interest, and follow-up consent. File or email delivery stays in your existing external process.",
    titleZh: "内容资料访问申请表模板 | GenForms",
    descriptionZh:
      "收集资料访问请求、内容兴趣和后续联系许可；文件或邮件交付继续由团队现有外部流程处理。",
  },
  "newsletter-signup": {
    titleEn: "Newsletter Signup Form Template | GenForms",
    descriptionEn:
      "Collect newsletter signup interest, content preferences, and consent. GenForms does not embed the form, send campaigns, manage double opt-in, or sync natively with an email service provider.",
    titleZh: "Newsletter 订阅意向表单模板 | GenForms",
    descriptionZh:
      "收集 Newsletter 订阅意向、内容偏好和许可；GenForms 当前不提供网页嵌入、邮件群发、双重确认或邮件服务商原生同步。",
  },
  "course-registration": {
    titleEn: "Course Registration Form Template | GenForms",
    descriptionEn:
      "Collect student details, course choice, experience, and learning goals for manual follow-up. Share by link or QR code, review responses, export CSV, or use a Webhook path.",
    titleZh: "课程报名表模板 | GenForms",
    descriptionZh:
      "收集学员联系方式、课程选择、经验和学习目标，通过链接或二维码分享，并查看回复、导出 CSV 或接入 Webhook 后续流程。",
  },
  "community-application": {
    titleEn: "Community Application Form Template | GenForms",
    descriptionEn:
      "Collect community applicant contact details, background, joining motivation, contribution intent, and consent for manual review. Share by link or QR code and review responses in one place.",
    titleZh: "社群申请表模板 | GenForms",
    descriptionZh:
      "收集社群申请人的联系方式、背景、加入原因、可贡献内容和人工跟进许可，通过链接或二维码分享，并由团队人工审核。",
  },
  "volunteer-application": {
    titleEn: "Volunteer Application Form Template",
    descriptionEn:
      "Create a volunteer application form for contact details, interests, skills, motivation, and general availability preferences. Share by link or QR code and review responses in one place.",
    titleZh: "志愿者申请表模板",
    descriptionZh:
      "创建志愿者申请表，收集联系方式、志愿方向、技能经验、参与动机和一般时间偏好，通过链接或二维码分享并集中查看申请。",
  },
  "customer-service-request": {
    titleEn: "Customer Service Request Form Template",
    descriptionEn:
      "Create a customer service request form for contact details, request type, product context and manual follow-up. Share by link or QR code and review responses in one place.",
    titleZh: "客户服务请求表模板",
    descriptionZh:
      "创建客户服务请求表，收集联系方式、请求类型、相关产品或服务和问题描述，通过链接或二维码分享并由团队人工跟进。",
  },
};

// Per-template scene-specific CTA labels (English only).
// ZH uses the generic i18n.use string to avoid layout inconsistencies.
const templateCtaOverrides: Record<string, string> = {
  "lead-capture": "Use the lead capture template",
  "contact-us": "Use the contact form template",
  "quote-request": "Use the quote request template",
  "demo-request": "Use the demo request template",
  "event-registration": "Use the event registration template",
  "event-feedback": "Use the event feedback template",
  "satisfaction-survey": "Use the satisfaction survey template",
  "product-recommendation": "Use the product recommendation template",
  "booking-consultation": "Use the consultation request template",
  "job-application": "Use the job application template",
  "waitlist": "Use the waitlist template",
  "newsletter-signup": "Use the newsletter signup template",
  "course-registration": "Use the course registration template",
  "community-application": "Use the community application template",
  "volunteer-application": "Use the volunteer application template",
  "customer-service-request": "Use the customer service request template",
  "beta-feedback": "Use the beta feedback template",
  "nps-survey": "Use the NPS survey template",
  "user-interview-recruitment": "Use the user interview recruitment template",
  "content-download": "Use the resource request template",
  "customer-testimonial-form": "Use the customer testimonial form",
  "portfolio-submission": "Use the portfolio submission template",
  "invoice-receipt-collection": "Use the invoice collection template",
  "identity-qualification-collection": "Use the identity qualification template",
};

const templateOnlyTopicIds = new Set([
  "job-application",
  "booking-consultation",
  "community-application",
  "volunteer-application",
  "customer-service-request",
  "customer-testimonial-form",
]);

const templateFaqs: Record<
  string,
  {
    locale: string;
    faqs: { q: string; a: string }[];
  }[]
> = {
  "customer-testimonial-form": [
    {
      locale: "en",
      faqs: [
        {
          q: "Can customers upload logos, headshots, or screenshots?",
          a: "No. This template collects text, publishing preferences, and optional contact details. Collect files through your existing external process when needed.",
        },
        {
          q: "Does the publishing preference replace a legal release?",
          a: "No. It records the customer's stated preference for team review. Confirm any formal release requirements through your existing legal or brand process before publication.",
        },
        {
          q: "Where can I review testimonial submissions?",
          a: "Review responses in the submission dashboard, export CSV, or notify the team through a configured Webhook path.",
        },
      ],
    },
    {
      locale: "zh",
      faqs: [
        {
          q: "客户可以上传 Logo、头像或截图吗？",
          a: "不可以。该模板收集文本、公开使用偏好和可选联系方式；如需文件，请通过团队现有外部流程收集。",
        },
        {
          q: "公开使用偏好可以替代正式法律授权吗？",
          a: "不可以。它只记录客户表达的偏好供团队审核；正式发布前，请通过现有法律或品牌流程确认适用的授权要求。",
        },
        {
          q: "在哪里查看客户证言提交？",
          a: "可以在提交数据面板查看回复、导出 CSV，或通过已配置的 Webhook 路径提醒团队。",
        },
      ],
    },
  ],
  "customer-service-request": [
    {
      locale: "en",
      faqs: [
        {
          q: "Is this a helpdesk or ticketing system?",
          a: "No. This template collects customer service requests for manual review. It does not create ticket numbers, statuses, queues or SLA workflows.",
        },
        {
          q: "Can customers upload screenshots or files?",
          a: "No. The current template collects structured text responses and references only; it does not accept file, image or screenshot uploads.",
        },
        {
          q: "Does GenForms assign requests to support agents?",
          a: "No. When configured, a Webhook or supported Incoming Webhook path can notify your team, but GenForms does not route or assign requests to agents.",
        },
        {
          q: "Where can I review customer service requests?",
          a: "Review responses in the submission dashboard, export CSV, or notify the team through a generic Webhook or supported Incoming Webhook path.",
        },
      ],
    },
    {
      locale: "zh",
      faqs: [
        {
          q: "这是 Helpdesk 或工单系统吗？",
          a: "不是。该模板只收集客户服务请求供团队人工查看，不会创建工单编号、状态、队列或 SLA 工作流。",
        },
        {
          q: "客户可以上传截图或文件吗？",
          a: "不可以。当前模板只收集结构化文本和参考编号，不接受文件、图片或截图上传。",
        },
        {
          q: "GenForms 会把请求分派给客服人员吗？",
          a: "不会。配置后，Webhook 或支持的 Incoming Webhook 路径可以提醒团队，但 GenForms 不会自动路由或分派请求。",
        },
        {
          q: "在哪里查看客户服务请求？",
          a: "可以在提交数据面板查看回复、导出 CSV，或通过通用 Webhook 或支持的 Incoming Webhook 路径提醒团队。",
        },
      ],
    },
  ],
  "course-registration": [
    {
      locale: "en",
      faqs: [
        {
          q: "Can students register from a QR code?",
          a: "Yes. Publish the form as a public link and use QR access on course pages, posters, slides, handouts, or venue signs.",
        },
        {
          q: "Does GenForms collect tuition or enforce seat limits?",
          a: "No. This template collects registration details and preferences. It does not process tuition, lock seats, stop submissions at a capacity threshold, or manage checkout.",
        },
        {
          q: "Does this template send confirmation emails or sync with an LMS?",
          a: "No. Production email confirmation, calendar invitations, attendance, certificates, and native LMS synchronization are outside the current product promise.",
        },
        {
          q: "Where can I review course registrations?",
          a: "Review responses in the submission dashboard, export CSV, or route new registrations through a generic Webhook or supported notification path.",
        },
      ],
    },
    {
      locale: "zh",
      faqs: [
        {
          q: "学员可以通过二维码报名吗？",
          a: "可以。表单发布为公开链接后，可将二维码用于课程页面、海报、幻灯片、讲义或现场指示牌。",
        },
        {
          q: "GenForms 会收取学费或限制名额吗？",
          a: "不会。该模板收集报名信息和偏好，但不处理学费、锁定名额、达到容量后停止提交或管理结账。",
        },
        {
          q: "这个模板会发送确认邮件或同步 LMS 吗？",
          a: "不会。生产级确认邮件、日历邀请、考勤、证书和 LMS 原生同步不在当前产品承诺范围内。",
        },
        {
          q: "在哪里查看课程报名？",
          a: "可以在提交数据面板查看回复、导出 CSV，或通过通用 Webhook 或支持的通知路径流转新报名。",
        },
      ],
    },
  ],
  "community-application": [
    {
      locale: "en",
      faqs: [
        {
          q: "Are community applications approved automatically?",
          a: "No. GenForms collects application details for your team to review manually. It does not provide an approve/reject workflow.",
        },
        {
          q: "Does GenForms automatically send Discord or Slack invitations?",
          a: "No. Webhook or notification paths can alert your team about a new application, but your team sends any community invitation through its existing external channel.",
        },
        {
          q: "Can GenForms process paid memberships?",
          a: "No. GenForms does not process membership payments, subscriptions, checkout, or account provisioning.",
        },
        {
          q: "Where can I review community applications?",
          a: "Review applications in the response dashboard, export CSV, or notify your team through a generic Webhook or supported notification path.",
        },
      ],
    },
    {
      locale: "zh",
      faqs: [
        {
          q: "社群申请会自动批准吗？",
          a: "不会。GenForms 负责收集申请信息，由团队人工审核；当前不提供通过或驳回审批流。",
        },
        {
          q: "会自动发送 Discord 或 Slack 邀请吗？",
          a: "不会。Webhook 或通知路径可以提醒团队有新申请，但社群邀请仍需团队通过现有外部渠道发送。",
        },
        {
          q: "支持付费会员吗？",
          a: "不支持。GenForms 不处理会员付款、订阅、结账或账号开通。",
        },
        {
          q: "在哪里查看社群申请？",
          a: "可以在回复数据面板查看申请、导出 CSV，或通过通用 Webhook 或支持的通知路径提醒团队。",
        },
      ],
    },
  ],
  "volunteer-application": [
    {
      locale: "en",
      faqs: [
        {
          q: "Can volunteers choose or reserve a shift?",
          a: "No. This template can collect a general availability preference, but it does not schedule, reserve, assign, or limit shift slots.",
        },
        {
          q: "Does GenForms run volunteer background checks?",
          a: "No. GenForms collects application information only. Background screening and identity verification must be handled through an appropriate external process.",
        },
        {
          q: "Are volunteer applications approved automatically?",
          a: "No. Your team reviews applications and follows up manually. GenForms does not provide an approval or acceptance workflow.",
        },
        {
          q: "Where can I review volunteer applications?",
          a: "Review applications in the response dashboard, export CSV, or notify your team through a generic Webhook or supported Incoming Webhook path.",
        },
      ],
    },
    {
      locale: "zh",
      faqs: [
        {
          q: "志愿者可以选择或预订班次吗？",
          a: "不可以。模板可以收集一般时间偏好，但不会安排、预订、分配或限制班次名额。",
        },
        {
          q: "GenForms 会进行志愿者背景调查吗？",
          a: "不会。GenForms 只负责收集申请信息；背景审查和身份验证需要通过适当的外部流程完成。",
        },
        {
          q: "志愿者申请会自动批准吗？",
          a: "不会。申请由团队人工查看和跟进，GenForms 当前不提供批准或录取工作流。",
        },
        {
          q: "在哪里查看志愿者申请？",
          a: "可以在回复数据面板查看申请、导出 CSV，或通过通用 Webhook 或支持的 Incoming Webhook 路径提醒团队。",
        },
      ],
    },
  ],
  "newsletter-signup": [
    {
      locale: "en",
      faqs: [
        {
          q: "What does this newsletter signup template collect?",
          a: "It collects an email address, optional name, content interests, frequency preference, and consent for your team to review or export.",
        },
        {
          q: "Can I embed this form into a website sidebar or footer?",
          a: "No. The current supported path is a public GenForms link or QR code. This template does not provide iframe, script, or native HTML embed code.",
        },
        {
          q: "Does GenForms send newsletters or manage double opt-in?",
          a: "No. GenForms does not host an email list, send campaigns or welcome emails, manage double opt-in or unsubscribe flows, or provide email deliverability tooling.",
        },
        {
          q: "Does this template sync directly with Mailchimp or ConvertKit?",
          a: "No. Native ESP synchronization is not included. You can review or export submissions and use a generic webhook only when your external workflow supports the handoff.",
        },
      ],
    },
    {
      locale: "zh",
      faqs: [
        {
          q: "这个 Newsletter 模板会收集哪些信息？",
          a: "它会收集邮箱、可选姓名、内容兴趣、频率偏好和许可，供团队查看或导出。",
        },
        {
          q: "可以把这个表单嵌入网站侧边栏或页脚吗？",
          a: "不可以。当前支持的路径是 GenForms 公开链接或二维码；该模板不提供 iframe、脚本或原生 HTML embed 代码。",
        },
        {
          q: "GenForms 会发送 Newsletter 或管理双重确认吗？",
          a: "不会。GenForms 不托管邮件列表，不发送 Campaign 或欢迎邮件，也不管理双重确认、退订流程或邮件可达性。",
        },
        {
          q: "这个模板会直接同步 Mailchimp 或 ConvertKit 吗？",
          a: "不会。当前不包含邮件服务商原生同步；可以查看或导出提交，并只在外部工作流支持时使用通用 Webhook 流转。",
        },
      ],
    },
  ],
  "content-download": [
    {
      locale: "en",
      faqs: [
        {
          q: "What should a lead magnet access request form collect?",
          a: "Start with work email, company or role, the requested resource, one useful qualification field, consent, and optional follow-up permission.",
        },
        {
          q: "Does GenForms automatically email or host the PDF?",
          a: "No. This workflow collects and routes the access request. Your team provides the PDF or resource separately through its existing delivery process.",
        },
        {
          q: "Where can the team review resource requests?",
          a: "Review submissions in the GenForms response dashboard, export CSV, or route the request through a generic webhook or supported bot path.",
        },
      ],
    },
    {
      locale: "zh",
      faqs: [
        {
          q: "资料访问申请表应该收集哪些信息？",
          a: "建议从工作邮箱、公司或角色、申请的资料、一个有用的筛选字段、同意条款和可选的后续联系许可开始。",
        },
        {
          q: "GenForms 会自动发送邮件或托管 PDF 吗？",
          a: "不会。这个流程用于收集并流转资料访问申请，PDF 或其他资料需要由团队通过现有交付流程另行提供。",
        },
        {
          q: "团队在哪里查看资料申请？",
          a: "可以在 GenForms 回复数据面板查看提交、导出 CSV，或把申请接入通用 Webhook 或支持的机器人路径。",
        },
      ],
    },
  ],
  "demo-request": [
    {
      locale: "en",
      faqs: [
        {
          q: "What should a demo request form include?",
          a: "Start with name, work contact, company, role, team size, main use case or pain point, evaluation timeline, and follow-up consent.",
        },
        {
          q: "Can I share this demo request form with a QR code?",
          a: "Yes. Publish the form as a public link and use QR access for product pages, campaigns, events, booths, printed decks, or direct outreach.",
        },
        {
          q: "Where can I review and export demo requests?",
          a: "Review submissions in the GenForms response dashboard, export CSV, or route new requests through a webhook-ready follow-up path.",
        },
        {
          q: "Does this template book meetings or score leads automatically?",
          a: "No. It collects structured demo requests. It does not provide real-time calendar scheduling, meeting invitations, automatic lead scoring, or native CRM synchronization.",
        },
      ],
    },
    {
      locale: "zh",
      faqs: [
        {
          q: "Demo 申请表应该包含哪些字段？",
          a: "建议从姓名、工作联系方式、公司、角色、团队规模、主要使用场景或痛点、评估时间和后续联系许可开始。",
        },
        {
          q: "可以通过二维码分享 Demo 申请表吗？",
          a: "可以。表单发布为公开链接后，可以在产品页、活动、会展、展台、印刷文档或直接沟通中使用二维码入口。",
        },
        {
          q: "在哪里查看和导出 Demo 申请？",
          a: "可以在 GenForms 回复数据面板查看提交、导出 CSV，或把新申请接入 Webhook-ready 跟进路径。",
        },
        {
          q: "这个模板会自动预订会议或评分线索吗？",
          a: "不会。它用于收集结构化 Demo 申请，不提供实时日历排期、会议邀请、自动线索评分或 CRM 原生同步。",
        },
      ],
    },
  ],
  "quote-request": [
    {
      locale: "en",
      faqs: [
        {
          q: "What should a quote request form include?",
          a: "Start with contact details, service needed, project scope, budget range, desired timeline, preferred response method, and follow-up consent.",
        },
        {
          q: "Can I share this request form with a QR code?",
          a: "Yes. Publish the form as a public link and use QR access for service locations, events, counters, printed materials, or other scan-to-request touchpoints.",
        },
        {
          q: "Where can I review and export quote requests?",
          a: "Review submissions in the GenForms response dashboard and export CSV for spreadsheet-based qualification or follow-up.",
        },
        {
          q: "Does this template calculate prices or generate formal quotes?",
          a: "No. It collects structured requests and does not provide pricing formulas, CPQ, instant estimates, formal PDF quotes, payments, invoicing, or file uploads.",
        },
      ],
    },
    {
      locale: "zh",
      faqs: [
        {
          q: "询价需求表应该包含哪些字段？",
          a: "建议从联系方式、所需服务、项目范围、预算区间、期望时间、首选回复方式和后续联系许可开始。",
        },
        {
          q: "可以通过二维码分享这个询价表吗？",
          a: "可以。表单发布为公开链接后，可以在服务场所、活动、柜台、印刷材料或其他扫码询价触点使用二维码入口。",
        },
        {
          q: "在哪里查看和导出询价需求？",
          a: "可以在 GenForms 回复数据面板查看提交，并导出 CSV 做表格筛选或后续跟进。",
        },
        {
          q: "这个模板会计算价格或生成正式报价单吗？",
          a: "不会。它用于收集结构化需求，不提供定价公式、CPQ、即时估价、正式 PDF 报价、支付、开票或文件上传。",
        },
      ],
    },
  ],
  "booking-consultation": [
    {
      locale: "en",
      faqs: [
        {
          q: "Is this a real-time calendar booking system?",
          a: "No. This template collects a preferred time window and consultation context so your team can review the request and confirm the final time manually.",
        },
        {
          q: "Can I collect consultation topics before following up?",
          a: "Yes. Ask for the service or consultation topic, preferred time window, contact details, and optional notes before your team responds.",
        },
        {
          q: "Where can I review consultation requests?",
          a: "Review submissions in the GenForms response dashboard, export CSV, or route new requests through a webhook-ready follow-up path.",
        },
        {
          q: "Does GenForms send calendar invitations or appointment reminders?",
          a: "No. The current workflow does not promise calendar synchronization, confirmed time slots, meeting invitations, reminders, cancellations, or rescheduling.",
        },
      ],
    },
    {
      locale: "zh",
      faqs: [
        {
          q: "这是实时日历预约系统吗？",
          a: "不是。这个模板收集期望时间段和咨询背景，团队查看申请后再人工确认最终时间。",
        },
        {
          q: "可以在跟进前收集咨询主题吗？",
          a: "可以。你可以收集服务或咨询主题、期望时间段、联系方式和可选补充说明，再由团队进行回复。",
        },
        {
          q: "在哪里查看咨询申请？",
          a: "可以在 GenForms 回复数据面板查看提交、导出 CSV，或把新申请接入 Webhook-ready 后续路径。",
        },
        {
          q: "GenForms 会发送日历邀请或预约提醒吗？",
          a: "不会。当前流程不承诺日历同步、已确认时段、会议邀请、提醒、取消或改期功能。",
        },
      ],
    },
  ],
  "satisfaction-survey": [
    {
      locale: "en",
      faqs: [
        {
          q: "What should a customer satisfaction survey include?",
          a: "Start with the product or service being reviewed, an overall rating, the reason behind that rating, what worked well, what should improve, and optional follow-up consent.",
        },
        {
          q: "Can I share this feedback form with a QR code?",
          a: "Yes. Publish the form as a public link and use QR access at stores, counters, workshops, venues, or printed customer touchpoints.",
        },
        {
          q: "Where can I review and export responses?",
          a: "Review submissions in the GenForms response dashboard and export CSV when your team needs spreadsheet-based analysis or follow-up.",
        },
        {
          q: "Does this template provide professional NPS benchmarks or advanced CX analytics?",
          a: "No. It focuses on collecting structured feedback, reviewing submissions, exporting CSV, and routing follow-up through webhook-ready workflows.",
        },
      ],
    },
    {
      locale: "zh",
      faqs: [
        {
          q: "客户满意度调查应该包含哪些问题？",
          a: "建议从被评价的产品或服务、整体评分、评分原因、做得好的地方、需要改进的地方和可选回访许可开始。",
        },
        {
          q: "这个反馈表可以通过二维码分享吗？",
          a: "可以。表单发布为公开链接后，可以在门店、柜台、工作坊、活动现场或印刷客户触点上使用二维码入口。",
        },
        {
          q: "在哪里查看和导出反馈回复？",
          a: "可以在 GenForms 回复数据面板查看提交，并在团队需要使用表格分析或跟进时导出 CSV。",
        },
        {
          q: "这个模板提供专业 NPS 基准或高级 CX 分析吗？",
          a: "不提供。这个模板聚焦结构化反馈收集、提交查看、CSV 导出和 Webhook-ready 后续流转。",
        },
      ],
    },
  ],
  "job-application": [
    {
      locale: "en",
      faqs: [
        {
          q: "What is a job application form maker?",
          a: "A lightweight job application form helps teams collect candidate contact details, target roles, experience, professional profile links, and initial screening responses. It is not a full applicant tracking system."
        },
        {
          q: "Can new candidate entries enter a team workflow?",
          a: "You can review candidate entries in the response dashboard, export CSV, or route structured text responses through a generic webhook or supported bot path for team follow-up."
        },
        {
          q: "Can candidates upload resume files to this template?",
          a: "No. This lightweight template collects text responses and professional profile URLs. It does not host PDF resumes, extract resume content with OCR, provide e-signatures, or manage an ATS candidate pipeline."
        }
      ]
    },
    {
      locale: "zh",
      faqs: [
        {
          q: "什么是求职申请表生成器？",
          a: "轻量候选人意向登记表帮助团队收集候选人的联系方式、目标岗位、工作经验、职业主页链接和初步筛选回答，但它不是完整的候选人管理系统。"
        },
        {
          q: "新的候选人信息可以进入团队跟进流程吗？",
          a: "可以在回复数据面板查看候选人提交、导出 CSV，或通过通用 Webhook 和支持的机器人路径流转结构化文本信息。"
        },
        {
          q: "候选人可以在这个模板中上传简历文件吗？",
          a: "不可以。这个轻量模板收集文本回答和职业主页 URL，不托管 PDF 简历、不通过 OCR 解析简历，也不提供电子签名或 ATS 候选人管道。"
        }
      ]
    }
  ],
  "nps-survey": [
    {
      locale: "en",
      faqs: [
        {
          q: "What is an NPS survey maker?",
          a: "An NPS (Net Promoter Score) survey maker is a tool to measure customer loyalty and satisfaction. It presents a standard question: 'On a scale of 0-10, how likely are you to recommend us?' and follows up with dynamic conditional questions based on the user's score to understand their reasoning."
        },
        {
          q: "Why should I use conversational, single-question forms for NPS surveys?",
          a: "Traditional long forms yield very low completion rates. A Typeform-like, step-by-step single-question flow keeps users focused. Experiencing only one question at a time on mobile browsers dramatically increases survey completion rates to over 50%."
        },
        {
          q: "How do Webhook retry logs secure my NPS customer feedback?",
          a: "Customer feedback is too valuable to lose due to server fluctuations. If your CRM or database goes down temporarily, GenForms.ai's webhook delivery system will automatically log the failure and retry the dispatch, ensuring no customer score is dropped."
        }
      ]
    },
    {
      locale: "zh",
      faqs: [
        {
          q: "什么是 NPS 净推荐值调查表？",
          a: "NPS（净推荐值）调查表是衡量客户忠忠诚度和满意度的标准工具。它通常只包含一个核心问题：‘在 0-10 分中，您有多大可能向朋友推荐我们？’，并根据客户给出的分数，动态展示针对性的追问问题以收集具体的吐槽或表扬。"
        },
        {
          q: "为什么 NPS 调查应采用单题流（类 Typeform）交互？",
          a: "传统的长表单往往会导致极低的完成率。类 Typeform 的单题流交互能让用户在手机上专注地一次回答一个问题，极大地减轻填写负担，通常能将 NPS 问卷的完成率拉升至 50% 以上。"
        },
        {
          q: "Webhook 自动重试与日志如何保障 NPS 反馈不丢失？",
          a: "客户的吐槽和好评对产品至关重要。如果您的接收端系统网络出现临时波动，GenForms.ai 的 Webhook 管道会自动记录发送失败日志并进入自动重试周期，确保每一条 NPS 用户反馈都能最终被系统接收。"
        }
      ]
    }
  ]
};



export async function generateMetadata({ params }: Props) {
  const { locale, templateId } = await params;
  const template = getSceneTemplateById(templateId);
  if (!template) return {};

  const isZh = locale.toLowerCase().startsWith("zh");
  const name = isZh ? template.name : (template.nameEn || template.name);
  const desc = isZh ? template.description : (template.descriptionEn || template.description);
  const baseUrl = process.env.NEXT_PUBLIC_WEB_URL || "https://genforms.ai";
  const canonicalUrl =
    locale === "en"
      ? `${baseUrl}/templates/${template.id}`
      : `${baseUrl}/${locale}/templates/${template.id}`;
  const seoOverride = templateSeoOverrides[template.id];
  const title = isZh
    ? seoOverride?.titleZh || `免费 ${name} 表单模板 - 即开即用`
    : seoOverride?.titleEn || `Free ${name} - AI Form Template`;
  const description = isZh
    ? seoOverride?.descriptionZh ||
      `使用免费的${name}模板。内置${template.scenario || "自动化"}场景，支持 AI 调整和 Webhook-ready 后续流转。`
    : seoOverride?.descriptionEn ||
      `Get started with the free ${name} template. Tailored for ${template.scenarioEn || "forms"}. AI-driven customizations and Feishu/Slack/Webhook integrations.`;

  return {
    title,
    description,
    keywords: `${name}, form template, AI form, free template, ${template.category}`,
    alternates: {
      canonical: canonicalUrl,
      languages: {
        en: `${baseUrl}/templates/${template.id}`,
        zh: `${baseUrl}/zh/templates/${template.id}`,
        "x-default": `${baseUrl}/templates/${template.id}`,
      },
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: "GenForms.ai",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export default async function TemplateDetailPage({ params, searchParams }: Props) {
  const { locale, templateId } = await params;
  const query = searchParams ? await searchParams : {};
  const queryTheme = query.theme;
  const template = getSceneTemplateById(templateId);

  if (!template) {
    notFound();
  }

  const isZh = locale.toLowerCase().startsWith("zh");
  const isSatisfactionSurvey = template.id === "satisfaction-survey";
  const creationDefaults = getTemplateCreationDefaults(template.id, locale);
  const creationSource = query.source || creationDefaults.source;
  const creationIntent = query.intent || creationDefaults.intent;
  const creationPrompt = query.prompt || creationDefaults.prompt;
  const name = isZh ? template.name : (template.nameEn || template.name);
  const description = isZh ? template.description : (template.descriptionEn || template.description);
  const category = isZh ? template.category : (template.categoryEn || template.category);
  const scenario = isZh ? template.scenario : (template.scenarioEn || template.scenario);
  const baseUrl = process.env.NEXT_PUBLIC_WEB_URL || "https://genforms.ai";
  const templateUrl =
    locale === "en"
      ? `${baseUrl}/templates/${template.id}`
      : `${baseUrl}/${locale}/templates/${template.id}`;
  const relatedUseCases = useCaseLandingPages
    .filter((page) => page.templateId === template.id)
    .slice(0, 3);

  // Schema to display
  const schema = isZh || !template.formSchemaEn ? template.formSchema : template.formSchemaEn;
  const fields = schema.fields;
  const aspects = schema.aspects;
  const faqsForLocale =
    templateFaqs[template.id]?.find((item) => locale.startsWith(item.locale))
      ?.faqs || [];

  const i18n = isZh
    ? {
        back: "返回所有模板",
        use: "立即使用此模板",
        category: "场景分类",
        scenario: "适用场景",
        theme: "默认主题",
        layout: "分栏海报",
        ocr: "OCR 识别模板",
        webhook: "推送集成预设",
        fieldsTitle: "模板包含字段",
        fieldName: "字段标签",
        fieldKey: "内部标识 (Key)",
        fieldType: "输入类型",
        fieldReq: "必填",
        schemaTitle: "表单配置 JSON Schema",
        yes: "是",
        no: "否",
        automationTitle: "智能数据流特性",
        relatedSolutionsTitle: "相关场景指南",
        relatedSolutionsDescription: "从模板继续查看更完整的场景说明、字段建议和发布流程。",
        relatedSolutionsCta: "查看场景方案",
        relatedUseCasesTitle: "相关工作流",
        relatedUseCasesDescription: "看看这个模板还能如何用于获客、通知、反馈或发布流程。",
        relatedUseCasesCta: "查看用例",
        ocrText: template.ocrTemplate ? `预设 OCR ${template.ocrTemplate} 图像提取` : "无图像提取",
        webhookText: template.webhookPreset ? `内置 ${template.webhookPreset} 推送集成` : "通用 Webhook 推送",
        previewLabel: "内联高保真插画与交互预览",
        setupTitle: "30秒部署指南",
        step1: "1. 一键点击上方「立即使用此模板」按钮。",
        step2: "2. 在 AI 协同舱中输入指令，可微调问题文案或增减字段。",
        step3: "3. 保存场景，在控制台中配置 Webhook 或分享链接即可上线。",
      }
    : {
        back: "Back to Templates",
        use: templateCtaOverrides[template.id] ?? "Use This Template",
        category: "Category",
        scenario: "Scenario",
        theme: "Default Theme",
        layout: "Split Poster",
        ocr: "OCR Template",
        webhook: "Webhook Target",
        fieldsTitle: "Template Fields",
        fieldName: "Question Text (Label)",
        fieldKey: "Internal Key",
        fieldType: "Field Type",
        fieldReq: "Required",
        schemaTitle: "Form JSON Schema",
        yes: "Yes",
        no: "No",
        automationTitle: "Smart Automation Features",
        relatedSolutionsTitle: "Related solution guides",
        relatedSolutionsDescription: "Continue from this template into a fuller workflow guide with fields, publishing steps, and SEO-ready use cases.",
        relatedSolutionsCta: "View solution",
        relatedUseCasesTitle: "Related workflows",
        relatedUseCasesDescription: "See how this template can support lead capture, notifications, feedback, or publishable workflows.",
        relatedUseCasesCta: "View use case",
        ocrText: template.ocrTemplate ? `Preset OCR ${template.ocrTemplate} photo extraction` : "No image parsing",
        webhookText: template.webhookPreset ? `Built-in ${template.webhookPreset} webhook dispatch` : "Generic Webhook dispatch",
        previewLabel: "Interactive High-Fidelity Preview",
        setupTitle: "30-Second Setup Guide",
        step1: "1. Click the 'Use This Template' button above to clone it.",
        step2: "2. Tweak labels or add questions in seconds using our AI Agent console.",
        step3: "3. Save, configure your custom webhook payload, and share the link.",
      };
  const setupTitle = isSatisfactionSurvey
    ? isZh
      ? "发布与分享步骤"
      : "Publish and share"
    : i18n.setupTitle;

  return (
    <div className="bg-slate-950 text-slate-100 min-h-screen pb-12 pt-20 md:pb-20 md:pt-28">
      <JsonLd
        data={buildBreadcrumbListJsonLd([
          {
            name: isZh ? "模板库" : "Templates",
            url:
              locale === "en"
                ? `${baseUrl}/templates`
                : `${baseUrl}/${locale}/templates`,
          },
          {
            name,
            url: templateUrl,
          },
        ])}
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          name: `${name} ${isZh ? "表单模板" : "Form Template"}`,
          applicationCategory: "BusinessApplication",
          operatingSystem: "Web",
          url: templateUrl,
          description,
          isPartOf: {
            "@type": "SoftwareApplication",
            name: "GenForms.ai",
            url: baseUrl,
          },
          offers: {
            "@type": "Offer",
            price: "0",
            priceCurrency: "USD",
            availability: "https://schema.org/InStock",
          },
          featureList: [
            scenario,
            template.webhookPreset
              ? i18n.webhookText
              : "Webhook-ready form publishing",
            template.ocrTemplate
              ? i18n.ocrText
              : "AI-customizable form fields",
          ],
        }}
      />
      {faqsForLocale.length > 0 && (
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: faqsForLocale.map((faq) => ({
              "@type": "Question",
              name: faq.q,
              acceptedAnswer: {
                "@type": "Answer",
                text: faq.a,
              },
            })),
          }}
        />
      )}
      <TemplateViewTracker templateId={template.id} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* Back Link */}
        <Link 
          href={localizePath(locale, "/templates")}
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-white transition-colors mb-8 group"
        >
          <ArrowLeft className="size-4 group-hover:-translate-x-1 transition-transform" />
          {i18n.back}
        </Link>

        {/* Hero split layout (Top Info Block) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12 items-start mb-16">
          
          {/* Left panel: Metadata, Title & CTA */}
          <div className="order-1 lg:col-span-8 space-y-6">
            <div className="flex items-center gap-3">
              <span className="text-[10px] font-black tracking-wider uppercase bg-blue-500/10 border border-blue-500/20 text-blue-400 px-3 py-1 rounded-full">
                {category}
              </span>
              <span className="text-[10px] font-black tracking-wider uppercase bg-slate-900 border border-slate-800 text-slate-400 px-3 py-1 rounded-full">
                {i18n.theme}: {template.theme}
              </span>
            </div>

            <h1 className="text-3xl md:text-4xl lg:text-5xl font-black tracking-tight text-white leading-tight">
              {name}
            </h1>
            
            <p className="text-base text-slate-400 leading-relaxed max-w-3xl">
              {description}
            </p>

            {/* Glowing CTA Button */}
            <div className="pt-2">
              <TemplateUseButton
                locale={locale}
                templateId={template.id}
                label={i18n.use}
                source={creationSource}
                intent={creationIntent}
                mode={query.mode}
                prompt={creationPrompt}
                badgeLabel={
                  isSatisfactionSurvey ||
                  template.id === "quote-request" ||
                  template.id === "demo-request" ||
                  template.id === "course-registration" ||
                  template.id === "community-application" ||
                  template.id === "volunteer-application" ||
                  template.id === "customer-service-request" ||
                  template.id === "customer-testimonial-form"
                    ? isZh
                      ? "AI 就绪 • 链接 / 二维码分享"
                      : "AI Ready • Share link / QR"
                    : undefined
                }
                trackingMetadata={
                  creationSource
                    ? {
                        source: creationSource,
                        intent: creationIntent || "",
                      }
                    : undefined
                }
              />
            </div>
          </div>

          {/* Live preview appears before technical properties on mobile. */}
          <div className="order-2 lg:order-3 lg:col-span-12 w-full bg-slate-900/10 border border-slate-900/80 rounded-3xl p-6 lg:p-8 flex flex-col items-center gap-6 relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600"></div>
            <div className="w-full">
              <InteractiveDetailPreview
                template={template}
                locale={locale}
                previewLabel={i18n.previewLabel}
                initialTheme={queryTheme}
              />
            </div>
          </div>

          {/* Right panel: Meta Specs Summary Card */}
          <div className="hidden lg:block order-3 lg:order-2 lg:col-span-4 bg-slate-900/40 border border-slate-900 rounded-3xl p-6 space-y-4">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-400 border-b border-slate-900 pb-2">
              {isZh ? "场景属性与预设集成" : "Properties & Integrations"}
            </h3>
            <div className="space-y-3">
              <div className="text-xs flex justify-between py-1 border-b border-slate-900/60">
                <span className="text-slate-500 font-bold">{i18n.scenario}</span>
                <span className="text-slate-300 font-medium text-right ml-4">{scenario}</span>
              </div>
              <div className="text-xs flex justify-between py-1 border-b border-slate-900/60">
                <span className="text-slate-500 font-bold">{i18n.layout}</span>
                <span className="text-slate-300 font-medium text-right">
                  {aspects?.welcomeImage ? (isZh ? `Split 双栏 (${aspects.welcomeImage})` : `Split Double Column (${aspects.welcomeImage})`) : (isZh ? "单栏极简" : "Single Column")}
                </span>
              </div>
              {template.ocrTemplate && (
                <div className="text-xs flex justify-between py-1 border-b border-slate-900/60">
                  <span className="text-slate-500 font-bold">{i18n.ocr}</span>
                  <span className="text-slate-300 font-medium font-mono text-emerald-400 text-right">{template.ocrTemplate}</span>
                </div>
              )}
              {template.webhookPreset && (
                <div className="text-xs flex justify-between py-1">
                  <span className="text-slate-500 font-bold">{i18n.webhook}</span>
                  <span className="text-slate-300 font-medium font-mono text-blue-400 text-right">{template.webhookPreset}</span>
                </div>
              )}
            </div>
          </div>

        </div>

        {/* Detailed Fields Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12 pt-10 lg:pt-16 border-t border-slate-900">
          
          {/* Left panel: Fields list for SEO keyword indexing */}
          <div className="lg:col-span-7 space-y-6">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Database className="size-5 text-blue-500" />
              {i18n.fieldsTitle}
            </h2>

            <div className="border border-slate-900 rounded-2xl overflow-hidden bg-slate-900/10">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-900 bg-slate-900/30 text-slate-400 font-bold uppercase tracking-wider">
                    <th className="py-3 px-4">{i18n.fieldName}</th>
                    <th className="hidden sm:table-cell py-3 px-4">{i18n.fieldKey}</th>
                    <th className="hidden sm:table-cell py-3 px-4">{i18n.fieldType}</th>
                    <th className="py-3 px-4 text-center">{i18n.fieldReq}</th>
                  </tr>
                </thead>
                <tbody>
                  {fields.map((field) => (
                    <tr key={field.key} className="border-b border-slate-900/60 hover:bg-slate-900/20 transition-colors">
                      <td className="py-3.5 px-4 font-bold text-white">{field.label}</td>
                      <td className="hidden sm:table-cell py-3.5 px-4 font-mono text-slate-400">{field.key}</td>
                      <td className="hidden sm:table-cell py-3.5 px-4">
                        <span className="px-2 py-0.5 bg-slate-900 border border-slate-800 rounded font-mono text-[10px] text-slate-300">
                          {field.type}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-center text-slate-400">
                        {field.required ? (
                          <span className="text-emerald-500 font-bold font-mono">✓ {i18n.yes}</span>
                        ) : (
                          <span className="text-slate-600 font-mono">--</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {faqsForLocale.length > 0 && (
              <div className="pt-8 border-t border-slate-900/80 space-y-6">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <HelpCircle className="size-5 text-blue-500" />
                  {isZh ? "常见问题解答 (FAQ)" : "Frequently Asked Questions"}
                </h2>
                <div className="grid grid-cols-1 gap-4">
                  {faqsForLocale.map((faq) => (
                    <div
                      key={faq.q}
                      className="bg-slate-900/20 border border-slate-900/60 p-5 rounded-2xl space-y-3 hover:border-slate-800 transition-colors"
                    >
                      <h3 className="text-sm font-bold text-white flex items-start gap-2">
                        <span className="text-blue-500 font-mono">Q:</span>
                        {faq.q}
                      </h3>
                      <p className="text-xs text-slate-400 leading-relaxed pl-5">
                        {faq.a}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Keep product-boundary FAQs ahead of technical details on mobile. */}
            <div className="lg:hidden bg-slate-900/40 border border-slate-900 rounded-3xl p-6 space-y-4">
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-400 border-b border-slate-900 pb-2">
                {isZh ? "场景属性与预设集成" : "Properties & Integrations"}
              </h3>
              <div className="space-y-3">
                <div className="text-xs flex justify-between py-1 border-b border-slate-900/60">
                  <span className="text-slate-500 font-bold">{i18n.scenario}</span>
                  <span className="text-slate-300 font-medium text-right ml-4">{scenario}</span>
                </div>
                <div className="text-xs flex justify-between py-1 border-b border-slate-900/60">
                  <span className="text-slate-500 font-bold">{i18n.layout}</span>
                  <span className="text-slate-300 font-medium text-right ml-4">
                    {aspects?.welcomeImage
                      ? isZh
                        ? `Split 双栏 (${aspects.welcomeImage})`
                        : `Split Double Column (${aspects.welcomeImage})`
                      : isZh
                        ? "单栏极简"
                        : "Single Column"}
                  </span>
                </div>
                {template.ocrTemplate && (
                  <div className="text-xs flex justify-between py-1 border-b border-slate-900/60">
                    <span className="text-slate-500 font-bold">{i18n.ocr}</span>
                    <span className="text-slate-300 font-medium font-mono text-emerald-400 text-right ml-4">{template.ocrTemplate}</span>
                  </div>
                )}
                {template.webhookPreset && (
                  <div className="text-xs flex justify-between py-1">
                    <span className="text-slate-500 font-bold">{i18n.webhook}</span>
                    <span className="text-slate-300 font-medium font-mono text-blue-400 text-right ml-4">{template.webhookPreset}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Quick 30s Deploy */}
            <div className="bg-slate-900/30 border border-slate-900 rounded-3xl p-6 space-y-4">
              <h3 className="text-sm font-black text-white flex items-center gap-1.5 uppercase tracking-wide">
                <Sparkles className="size-4 text-amber-400" />
                {setupTitle}
              </h3>
              <div className="space-y-3 text-xs text-slate-400 leading-relaxed font-semibold">
                <p>{i18n.step1}</p>
                <p>{i18n.step2}</p>
                <p>{i18n.step3}</p>
              </div>
            </div>

            {!templateOnlyTopicIds.has(template.id) &&
              solutionLandingPages.some((page) => page.templateId === template.id) && (
              <div className="bg-blue-500/5 border border-blue-500/20 rounded-3xl p-6 space-y-4">
                <div>
                  <h3 className="text-sm font-black text-white flex items-center gap-1.5 uppercase tracking-wide">
                    <Sparkles className="size-4 text-blue-400" />
                    {i18n.relatedSolutionsTitle}
                  </h3>
                  <p className="mt-2 text-xs leading-relaxed text-slate-400">
                    {i18n.relatedSolutionsDescription}
                  </p>
                </div>
                <div className="grid gap-3">
                  {solutionLandingPages
                    .filter((page) => page.templateId === template.id)
                    .map((page) => {
                      const solutionTitle = isZh ? page.zhTitle : page.title;
                      const solutionDescription = isZh
                        ? page.zhDescription
                        : page.description;

                      return (
                        <Link
                          key={page.slug}
                          href={localizePath(locale, `/solutions/${page.slug}`)}
                          className="group block rounded-2xl border border-slate-800 bg-slate-950/50 p-4 transition hover:border-blue-500/50 hover:bg-blue-500/10"
                        >
                          <div className="flex items-start justify-between gap-4">
                            <div>
                              <h4 className="text-sm font-black text-white group-hover:text-blue-200">
                                {solutionTitle}
                              </h4>
                              <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-slate-400">
                                {solutionDescription}
                              </p>
                            </div>
                            <span className="shrink-0 rounded-full border border-blue-500/20 bg-blue-500/10 px-3 py-1 text-[10px] font-black uppercase tracking-wide text-blue-300">
                              {i18n.relatedSolutionsCta}
                            </span>
                          </div>
                        </Link>
                      );
                    })}
                </div>
              </div>
            )}

            {relatedUseCases.length > 0 && (
              <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-3xl p-6 space-y-4">
                <div>
                  <h3 className="text-sm font-black text-white flex items-center gap-1.5 uppercase tracking-wide">
                    <Route className="size-4 text-emerald-400" />
                    {i18n.relatedUseCasesTitle}
                  </h3>
                  <p className="mt-2 text-xs leading-relaxed text-slate-400">
                    {i18n.relatedUseCasesDescription}
                  </p>
                </div>
                <div className="grid gap-3">
                  {relatedUseCases.map((page) => {
                    const useCaseTitle = isZh ? page.zhTitle : page.title;
                    const useCaseDescription = isZh
                      ? page.zhDescription
                      : page.description;

                    return (
                      <Link
                        key={page.slug}
                        href={localizePath(locale, `/use-cases/${page.slug}`)}
                        className="group block rounded-2xl border border-slate-800 bg-slate-950/50 p-4 transition hover:border-emerald-500/50 hover:bg-emerald-500/10"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <h4 className="text-sm font-black text-white group-hover:text-emerald-200">
                              {useCaseTitle}
                            </h4>
                            <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-slate-400">
                              {useCaseDescription}
                            </p>
                          </div>
                          <span className="shrink-0 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-[10px] font-black uppercase tracking-wide text-emerald-300">
                            {i18n.relatedUseCasesCta}
                          </span>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Right panel: Automation and integration details */}
          <div className="lg:col-span-5 space-y-6">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Cpu className="size-5 text-indigo-500" />
              {i18n.automationTitle}
            </h2>

            <div className="space-y-4">
              {/* Feature 1 */}
              <div className="bg-slate-900/20 border border-slate-900 p-5 rounded-2xl flex items-start gap-4">
                <div className="size-8 shrink-0 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center">
                  <Check className="size-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white mb-1">
                    {isZh ? "高转化双栏插画" : "High-Converting Layout"}
                  </h4>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {isZh 
                      ? "该模板默认采用 Split 双栏版式与动态高保真插画，为填写用户提供专注且高级的视觉体验。"
                      : "Engage respondents with our side-by-side design featuring immersive live visual assets."}
                  </p>
                </div>
              </div>

              {/* Feature 2 */}
              <div className="bg-slate-900/20 border border-slate-900 p-5 rounded-2xl flex items-start gap-4">
                <div className="size-8 shrink-0 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center">
                  <Share2 className="size-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white mb-1">
                    {template.ocrTemplate
                      ? i18n.ocrText
                      : isZh
                        ? "AI 可调整字段"
                        : "AI-customizable fields"}
                  </h4>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {template.ocrTemplate
                      ? isZh
                        ? "使用已配置的图像提取能力，把适用的图片内容转成结构化字段。"
                        : "Use the configured image extraction workflow to turn supported image content into structured fields."
                      : isZh
                        ? "从现有模板开始，再用 AI 根据实际场景调整问题、字段标签和填写顺序。"
                        : "Start from the template, then use AI to adapt questions, field labels, and the flow to the real scenario."}
                  </p>
                </div>
              </div>

              {/* Feature 3 */}
              <div className="bg-slate-900/20 border border-slate-900 p-5 rounded-2xl flex items-start gap-4">
                <div className="size-8 shrink-0 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center">
                  <Webhook className="size-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white mb-1">
                    {i18n.webhookText}
                  </h4>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {isZh
                      ? "表单提交后，可以把数据推送到指定 Webhook，并通过日志和失败重试查看交付状态；也可连接飞书、钉钉、企微或 Slack Incoming Webhook 路径。"
                      : "Route submissions to a custom webhook endpoint or supported bot path, then review delivery logs and failed-delivery retries."}
                  </p>
                </div>
              </div>
            </div>

            {/* Schema JSON collapsible */}
            <div className="border border-slate-900 rounded-2xl overflow-hidden bg-slate-900/10">
              <div className="bg-slate-900/30 px-4 py-3 border-b border-slate-900 text-xs font-bold text-slate-300 flex items-center gap-2">
                <Database className="size-4 text-indigo-400" />
                {i18n.schemaTitle}
              </div>
              <pre className="p-4 text-[10px] font-mono text-slate-400 overflow-x-auto max-h-48 leading-relaxed">
                {JSON.stringify(schema, null, 2)}
              </pre>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
