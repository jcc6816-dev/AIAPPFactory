import type {
  FormSchema,
  FormTheme,
  GeneratedFormDraft,
  OcrTemplate,
  WebhookProvider,
} from "@/types/form";

export type TemplateSource = "public_benchmark" | "user_research" | "internal_demo";

export interface SceneTemplate {
  id: string;
  name: string;
  source: TemplateSource;
  category: string;
  scenario: string;
  description: string;
  theme: FormTheme;
  formSchema: FormSchema;
  suggestedPrompts: string[];
  agentQuickActions: string[];
  ocrTemplate?: OcrTemplate;
  webhookPreset?: WebhookProvider;
  successCopy?: string;
}

export const sceneTemplates: SceneTemplate[] = [
  {
    id: "lead-capture",
    name: "线索收集表",
    source: "public_benchmark",
    category: "增长获客",
    scenario: "官网、落地页、活动页潜客收集",
    description: "适合快速收集潜在客户需求、联系方式和预算计划。",
    theme: "business",
    webhookPreset: "generic",
    suggestedPrompts: [
      "把这个线索收集表改成适合 SaaS 官网获客。",
      "增加预算范围选项，并让字段更适合销售跟进。",
    ],
    agentQuickActions: [
      "改成适合 SaaS 官网获客",
      "增加预算范围选项",
      "检查字段是否太多",
      "生成销售跟进提示",
    ],
    formSchema: {
      layout: "single",
      fields: [
        {
          key: "contact_name",
          label: "怎么称呼你？",
          type: "text",
          required: true,
          placeholder: "请输入你的姓名或称呼",
        },
        {
          key: "contact_method",
          label: "我们可以通过什么方式联系你？",
          type: "text",
          required: true,
          placeholder: "手机号、邮箱或微信都可以",
        },
        {
          key: "interest_area",
          label: "你对哪类产品或服务感兴趣？",
          type: "select",
          required: true,
          options: [
            { label: "产品咨询", value: "product_consulting" },
            { label: "价格方案", value: "pricing" },
            { label: "合作洽谈", value: "partnership" },
            { label: "其他需求", value: "other" },
          ],
        },
        {
          key: "budget_timeline",
          label: "你的预算或计划时间大概是？",
          type: "radio",
          required: false,
          options: [
            { label: "本月内", value: "this_month" },
            { label: "1-3 个月", value: "one_to_three_months" },
            { label: "还在了解", value: "researching" },
          ],
        },
        {
          key: "extra_notes",
          label: "还有什么想补充的吗？",
          type: "textarea",
          required: false,
          placeholder: "简单说说你的业务背景或具体需求",
        },
      ],
    },
  },
  {
    id: "contact-us",
    name: "联系我们表",
    source: "public_benchmark",
    category: "官网咨询",
    scenario: "网站、个人主页、机构页面接收咨询",
    description: "适合收集咨询内容，并推送给客服或团队负责人。",
    theme: "minimal",
    webhookPreset: "feishu_bot",
    suggestedPrompts: [
      "改成适合企业官网的联系我们表。",
      "增加服务类型选项，并生成自动回复文案。",
    ],
    agentQuickActions: [
      "改成适合个人咨询",
      "改成适合企业官网",
      "增加服务类型选项",
      "生成自动回复文案",
    ],
    formSchema: {
      layout: "single",
      fields: [
        {
          key: "name",
          label: "怎么称呼你？",
          type: "text",
          required: true,
          placeholder: "请输入你的姓名",
        },
        {
          key: "email_or_phone",
          label: "你的邮箱或电话是？",
          type: "text",
          required: true,
          placeholder: "方便我们回复你",
        },
        {
          key: "topic",
          label: "你想咨询什么？",
          type: "textarea",
          required: true,
          placeholder: "请简单描述你的问题或需求",
        },
        {
          key: "preferred_contact_time",
          label: "希望我们什么时候联系你？",
          type: "text",
          required: false,
          placeholder: "例如：工作日下午、明天上午",
        },
      ],
    },
  },
  {
    id: "event-registration",
    name: "活动报名表",
    source: "public_benchmark",
    category: "活动运营",
    scenario: "会议、沙龙、直播、线下活动报名",
    description: "适合活动报名收集、席位安排和运营群通知。",
    theme: "business",
    webhookPreset: "feishu_bot",
    suggestedPrompts: [
      "改成高端沙龙报名，并加一个饮食偏好字段。",
      "加一个同行人数，并生成报名成功提示文案。",
    ],
    agentQuickActions: [
      "改成高端沙龙报名",
      "加一个饮食偏好字段",
      "加一个同行人数",
      "生成报名成功提示文案",
    ],
    formSchema: {
      layout: "single",
      fields: [
        {
          key: "attendee_name",
          label: "怎么称呼你？",
          type: "text",
          required: true,
          placeholder: "请输入参会人姓名",
        },
        {
          key: "contact",
          label: "你的手机号或邮箱是？",
          type: "text",
          required: true,
          placeholder: "用于发送活动确认信息",
        },
        {
          key: "company",
          label: "你所在公司或组织是？",
          type: "text",
          required: false,
          placeholder: "例如：AI AgentFactory",
        },
        {
          key: "role",
          label: "你的职位或身份是？",
          type: "text",
          required: false,
          placeholder: "例如：产品负责人、开发者、设计师",
        },
        {
          key: "preference",
          label: "是否有饮食或座位偏好？",
          type: "textarea",
          required: false,
          placeholder: "如无特殊偏好可跳过",
        },
      ],
    },
  },
  {
    id: "event-feedback",
    name: "活动反馈表",
    source: "public_benchmark",
    category: "活动复盘",
    scenario: "活动结束后收集体验反馈和改进建议",
    description: "适合活动复盘、满意度分析和后续运营改进。",
    theme: "minimal",
    webhookPreset: "generic",
    suggestedPrompts: [
      "改成适合线上直播反馈。",
      "增加 NPS 评分，并精简成 3 个问题。",
    ],
    agentQuickActions: [
      "改成适合线上直播反馈",
      "增加 NPS 评分",
      "精简成 3 个问题",
      "生成反馈总结维度",
    ],
    formSchema: {
      layout: "single",
      fields: [
        {
          key: "event_name",
          label: "你参加的是哪场活动？",
          type: "text",
          required: true,
          placeholder: "请输入活动名称",
        },
        {
          key: "overall_rating",
          label: "你对本次活动整体满意吗？",
          type: "radio",
          required: true,
          options: [
            { label: "非常满意", value: "very_satisfied" },
            { label: "满意", value: "satisfied" },
            { label: "一般", value: "neutral" },
            { label: "不太满意", value: "unsatisfied" },
          ],
        },
        {
          key: "most_valuable_part",
          label: "哪个环节最有价值？",
          type: "textarea",
          required: false,
          placeholder: "例如：主题分享、圆桌讨论、互动问答",
        },
        {
          key: "improvement_suggestion",
          label: "哪些地方需要改进？",
          type: "textarea",
          required: false,
          placeholder: "欢迎写下具体建议",
        },
        {
          key: "join_next_event",
          label: "是否愿意参加后续活动？",
          type: "radio",
          required: false,
          options: [
            { label: "愿意", value: "yes" },
            { label: "看主题再决定", value: "depends" },
            { label: "暂不考虑", value: "no" },
          ],
        },
      ],
    },
  },
  {
    id: "satisfaction-survey",
    name: "客户满意度调查",
    source: "public_benchmark",
    category: "客户体验",
    scenario: "产品、服务、门店或交付后的满意度调查",
    description: "适合收集客户体验、改进意见和回访意愿。",
    theme: "business",
    webhookPreset: "generic",
    suggestedPrompts: [
      "改成适合门店服务满意度调查。",
      "改成适合软件产品反馈，并增加 NPS 评分。",
    ],
    agentQuickActions: [
      "改成适合门店服务",
      "改成适合软件产品反馈",
      "增加 NPS 评分",
      "检查问题是否引导性太强",
    ],
    formSchema: {
      layout: "single",
      fields: [
        {
          key: "product_or_service",
          label: "你使用的是哪项产品或服务？",
          type: "text",
          required: true,
          placeholder: "请输入产品、服务或门店名称",
        },
        {
          key: "satisfaction",
          label: "你的整体满意度如何？",
          type: "radio",
          required: true,
          options: [
            { label: "非常满意", value: "very_satisfied" },
            { label: "满意", value: "satisfied" },
            { label: "一般", value: "neutral" },
            { label: "不满意", value: "unsatisfied" },
          ],
        },
        {
          key: "best_part",
          label: "哪一项体验最好？",
          type: "textarea",
          required: false,
          placeholder: "告诉我们最值得保留的体验",
        },
        {
          key: "improvement_area",
          label: "哪一项最需要改进？",
          type: "textarea",
          required: false,
          placeholder: "请写下你最希望改进的地方",
        },
        {
          key: "allow_follow_up",
          label: "是否愿意被进一步回访？",
          type: "radio",
          required: false,
          options: [
            { label: "可以回访", value: "yes" },
            { label: "暂不需要", value: "no" },
          ],
        },
      ],
    },
  },
  {
    id: "product-recommendation",
    name: "产品推荐问卷",
    source: "public_benchmark",
    category: "互动转化",
    scenario: "根据用户偏好推荐产品、方案或服务",
    description: "适合做互动问卷、方案推荐和销售线索分层。",
    theme: "dark",
    webhookPreset: "generic",
    suggestedPrompts: [
      "改成适合课程推荐的互动问卷。",
      "改成适合软件方案推荐，并增加预算区间。",
    ],
    agentQuickActions: [
      "改成适合课程推荐",
      "改成适合软件方案推荐",
      "增加预算区间",
      "优化成更像互动测验",
    ],
    formSchema: {
      layout: "single",
      fields: [
        {
          key: "main_goal",
          label: "你主要想解决什么问题？",
          type: "textarea",
          required: true,
          placeholder: "简单描述你当前最想解决的需求",
        },
        {
          key: "usage_context",
          label: "你的使用场景是什么？",
          type: "select",
          required: true,
          options: [
            { label: "个人使用", value: "personal" },
            { label: "小团队协作", value: "small_team" },
            { label: "企业内部", value: "enterprise" },
            { label: "对外服务客户", value: "customer_facing" },
          ],
        },
        {
          key: "priority",
          label: "你更看重哪些因素？",
          type: "checkbox",
          required: true,
          options: [
            { label: "价格", value: "price" },
            { label: "易用性", value: "ease_of_use" },
            { label: "专业能力", value: "capability" },
            { label: "交付速度", value: "speed" },
          ],
        },
        {
          key: "budget",
          label: "你的预算范围大概是？",
          type: "radio",
          required: false,
          options: [
            { label: "先免费试用", value: "trial" },
            { label: "低预算", value: "low" },
            { label: "中等预算", value: "medium" },
            { label: "预算充足", value: "high" },
          ],
        },
        {
          key: "need_consultant",
          label: "是否需要人工顾问联系？",
          type: "radio",
          required: false,
          options: [
            { label: "需要", value: "yes" },
            { label: "暂不需要", value: "no" },
          ],
        },
      ],
    },
  },
  {
    id: "booking-consultation",
    name: "预约咨询表",
    source: "public_benchmark",
    category: "预约服务",
    scenario: "课程、服务、顾问、美容、线下门店预约",
    description: "适合预约服务、咨询排期和门店运营通知。",
    theme: "minimal",
    webhookPreset: "feishu_bot",
    suggestedPrompts: [
      "改成适合课程顾问预约。",
      "增加可选时间段，并生成预约确认文案。",
    ],
    agentQuickActions: [
      "改成适合课程顾问预约",
      "改成适合门店服务预约",
      "增加可选时间段",
      "生成预约确认文案",
    ],
    formSchema: {
      layout: "single",
      fields: [
        {
          key: "customer_name",
          label: "怎么称呼你？",
          type: "text",
          required: true,
          placeholder: "请输入你的姓名",
        },
        {
          key: "service_type",
          label: "你想预约哪项服务？",
          type: "select",
          required: true,
          options: [
            { label: "初次咨询", value: "first_consultation" },
            { label: "方案沟通", value: "solution_discussion" },
            { label: "体验预约", value: "trial_booking" },
            { label: "其他服务", value: "other" },
          ],
        },
        {
          key: "preferred_time",
          label: "希望预约的日期和时间？",
          type: "text",
          required: true,
          placeholder: "例如：周三下午 3 点",
        },
        {
          key: "contact",
          label: "你的联系方式是？",
          type: "text",
          required: true,
          placeholder: "手机号、邮箱或微信",
        },
        {
          key: "special_notes",
          label: "是否有特殊说明？",
          type: "textarea",
          required: false,
          placeholder: "如有特殊偏好或限制，请提前告诉我们",
        },
      ],
    },
  },
  {
    id: "job-application",
    name: "招聘申请表",
    source: "public_benchmark",
    category: "招聘申请",
    scenario: "收集候选人信息和简历附件",
    description: "适合职位申请、简历收集和 HR 群通知。",
    theme: "business",
    ocrTemplate: "general_image",
    webhookPreset: "generic",
    suggestedPrompts: [
      "改成适合实习生招聘。",
      "加一个作品集链接，并检查候选人信息是否足够筛选。",
    ],
    agentQuickActions: [
      "改成适合实习生招聘",
      "加一个作品集链接",
      "增加简历上传字段",
      "检查候选人信息是否足够筛选",
    ],
    formSchema: {
      layout: "single",
      fields: [
        {
          key: "candidate_name",
          label: "你的姓名是？",
          type: "text",
          required: true,
          placeholder: "请输入真实姓名",
        },
        {
          key: "contact",
          label: "你的联系方式是？",
          type: "text",
          required: true,
          placeholder: "手机号或邮箱",
        },
        {
          key: "target_role",
          label: "你想申请哪个岗位？",
          type: "text",
          required: true,
          placeholder: "请输入岗位名称",
        },
        {
          key: "work_years",
          label: "你的工作年限是？",
          type: "select",
          required: true,
          options: [
            { label: "应届 / 实习", value: "intern_or_graduate" },
            { label: "1-3 年", value: "one_to_three" },
            { label: "3-5 年", value: "three_to_five" },
            { label: "5 年以上", value: "over_five" },
          ],
        },
        {
          key: "resume_file",
          label: "请上传简历。",
          type: "pdf",
          required: true,
          help_text: "建议上传 PDF 格式简历。",
        },
        {
          key: "portfolio_or_notes",
          label: "有什么补充说明？",
          type: "textarea",
          required: false,
          placeholder: "可以填写作品集链接、个人亮点或补充说明",
        },
      ],
    },
  },
];

export function getSceneTemplateById(templateId: string) {
  return sceneTemplates.find((template) => template.id === templateId);
}

export function buildGeneratedFormDraftFromTemplate(template: SceneTemplate): GeneratedFormDraft {
  return {
    title: template.name,
    description: template.description,
    theme: template.theme,
    schema: JSON.parse(JSON.stringify(template.formSchema)),
    source: "template",
    model: template.id,
  };
}
