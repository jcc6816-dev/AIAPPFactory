import type { FormCreationContext } from "@/types/form";

interface TemplateCreationDefaults extends FormCreationContext {
  prompt?: string;
}

const useCaseCreationContexts: Record<string, FormCreationContext> = {
  "contact-form-builder-for-websites": { intent: "contact_form" },
  "webhook-form-builder-retry-logs": { intent: "webhook_form" },
  "qr-code-form-builder": { intent: "qr_form" },
  "event-registration-form-builder": { intent: "event_registration" },
  "customer-feedback-form-builder": { intent: "customer_feedback" },
  "typeform-alternative-webhooks": {
    intent: "typeform_alternative",
    mode: "typeform_style",
  },
  "ai-lead-capture-form-builder": { intent: "lead_capture" },
  "quote-request-form-builder": { intent: "quote_request" },
  "demo-request-form-builder": { intent: "demo_request" },
  "waitlist-form-builder-indie-hackers": { intent: "waitlist" },
};

export function getUseCaseCreationContext(slug: string): FormCreationContext {
  return useCaseCreationContexts[slug] || {};
}

export function getTemplateCreationDefaults(
  templateId: string,
  locale: string
): TemplateCreationDefaults {
  const isZh = locale.toLowerCase().startsWith("zh");

  if (templateId === "satisfaction-survey") {
    return {
      source: "template_satisfaction-survey",
      intent: "customer_feedback",
      prompt: isZh
        ? "创建一个客户反馈表单，包含整体评分、评分原因、做得好的地方、需要改进的地方、可选联系方式和后续联系许可。"
        : "Create a customer feedback form with an overall rating, reason for the rating, what worked well, what could be improved, optional contact details, and follow-up consent.",
    };
  }

  if (templateId === "waitlist") {
    return {
      source: "template_waitlist",
      intent: "waitlist",
      prompt: isZh
        ? "创建一个产品预发布 Waitlist 表单，收集姓名、邮箱、用户角色、主要使用场景、核心痛点和产品更新偏好。"
        : "Create a pre-launch waitlist form that collects name, email, role, main use case, pain point, and launch update preference.",
    };
  }

  if (templateId === "quote-request") {
    return {
      source: "template_quote-request",
      intent: "quote_request",
      prompt: isZh
        ? "创建一个询价需求表，收集联系方式、服务类型、项目范围、预算、期望时间、回复方式、补充说明和后续联系许可。"
        : "Create a quote request form that collects contact details, service needed, project scope, budget range, desired timeline, preferred response method, notes, and follow-up consent.",
    };
  }

  if (templateId === "demo-request") {
    return {
      source: "template_demo-request",
      intent: "demo_request",
      prompt: isZh
        ? "创建一个 B2B Demo 申请表，收集工作联系方式、公司、角色、团队规模、主要使用场景或痛点、评估时间和后续联系许可。"
        : "Create a B2B demo request form that collects work contact details, company, role, team size, main use case or pain point, evaluation timeline, and follow-up consent.",
    };
  }

  if (templateId === "content-download") {
    return {
      source: "template_content-download",
      intent: "lead_magnet_request",
      prompt: isZh
        ? "创建一个资料访问申请表，收集工作邮箱、公司、角色、资料兴趣和联系许可；不要承诺自动发送邮件、托管文件或提交后跳转下载。"
        : "Create a lead magnet access request form that collects work email, company, role, resource interest, and follow-up consent. Do not promise automatic email, file hosting, or redirect-on-submit delivery.",
    };
  }

  if (templateId === "newsletter-signup") {
    return {
      source: "template_newsletter-signup",
      intent: "newsletter_signup",
      prompt: isZh
        ? "创建一个 Newsletter 订阅意向表，收集邮箱、内容兴趣、频率偏好和许可；不要承诺网页嵌入、邮件发送、双重确认或邮件服务商原生同步。"
        : "Create a newsletter signup interest form that collects email, content interests, frequency preference, and consent. Do not promise website embed, campaign sending, double opt-in, or native ESP synchronization.",
    };
  }

  if (templateId === "course-registration") {
    return {
      source: "template_course-registration",
      intent: "course_registration",
      prompt: isZh
        ? "创建一个适合课程、班级、培训项目、工作坊或训练营的报名表，收集学员姓名、联系方式、课程选择、经验水平、学习目标、可选时间偏好和后续联系许可。不要生成支付、名额锁定、自动邮件、日历预约、考勤、证书、LMS 同步、嵌入或跳转承诺。"
        : "Create a course registration form for classes, training programs, workshops, or cohorts with student name, contact details, course choice, experience level, learning goal, optional time preference, and follow-up consent. Do not promise payment, seat limits, automatic email, calendar booking, attendance, certificates, LMS sync, embed, or redirect.",
    };
  }

  if (templateId === "community-application") {
    return {
      source: "template_community-application",
      intent: "community_application",
      prompt: isZh
        ? "创建一个社群申请表，收集申请人姓名、联系方式、背景、加入原因、可贡献内容、规则同意和人工后续联系许可。不要承诺自动审批、自动发送 Discord 或 Slack 邀请、会员开通、付款订阅或生产级邮件邀请。"
        : "Create a community application form with applicant name, contact details, background, joining motivation, contribution intent, rules consent, and manual follow-up consent. Do not promise automatic approval, Discord or Slack invitations, membership provisioning, payment, subscriptions, or production email invitations.",
    };
  }

  if (templateId === "volunteer-application") {
    return {
      source: "template_volunteer-application",
      intent: "volunteer_application",
      prompt: isZh
        ? "创建一个志愿者申请表，收集申请人姓名、联系方式、感兴趣的志愿岗位或领域、相关技能经验、参与动机、可选的一般时间偏好、地点偏好和人工后续联系许可。不要生成班次排期、时段或名额预订、背景调查、自动审批、文件上传、电子签名、考勤、证书、生产级邮件、原生 CRM 同步或嵌入承诺。"
        : "Create a volunteer application form with applicant name, contact details, volunteer role or interest, relevant skills, motivation, optional general availability preference, location preference, and consent for manual follow-up. Do not create shift scheduling, slot or capacity booking, background checks, automatic approval, file upload, electronic signature, attendance, certificates, production email, native CRM sync, or embed promises.",
    };
  }

  if (templateId === "customer-service-request") {
    return {
      source: "template_customer-service-request",
      intent: "service_request_intake",
      prompt: isZh
        ? "创建一个轻量客户服务请求信息收集表，包含姓名、邮箱或电话联系方式、请求类型、相关产品或服务、请求描述、可选的期望处理结果、必填的人工后续联系许可和可选的订单号或客户编号。不要生成工单编号或状态、SLA 承诺、升级计时、自动路由或分派、客服邮箱系统、文件上传、自动解决、原生 Helpdesk 或 CRM 同步、密码字段、完整支付信息、政府身份证件、验证码或 Token 等认证信息、生产级邮件或嵌入承诺。"
        : "Create a lightweight customer service request intake form with name, email or phone contact details, request type, related product or service, request description, optional desired outcome, required consent to manual follow-up, and an optional order or customer reference. Do not create ticket numbers or statuses, SLA promises, escalation timers, automatic routing or assignment, support inboxes, file uploads, automatic resolution, native helpdesk or CRM synchronization, password fields, complete payment information, government ID, authentication secrets such as verification codes or tokens, production email, or embed promises.",
    };
  }

  if (
    templateId === "customer-testimonial-form" ||
    templateId === "customer-story"
  ) {
    return {
      source: "template_customer-testimonial-form",
      intent: "customer_testimonial",
      prompt: isZh
        ? "创建一个客户证言收集表，包含客户姓名、使用的产品或服务、使用前的问题、使用后的具体结果、公开使用偏好、公司和角色以及可选的后续联系方式。不要生成文件、Logo、头像或截图上传字段，也不要承诺该表单可以替代正式法律授权。"
        : "Create a customer testimonial form with customer name, product or service used, the challenge before, concrete results after, publishing preference, company and role, and optional follow-up contact. Do not create file, logo, headshot, or screenshot upload fields, and do not claim this form replaces a legal release.",
    };
  }

  return {};
}
