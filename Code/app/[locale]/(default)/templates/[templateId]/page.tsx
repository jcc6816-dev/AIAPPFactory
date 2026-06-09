import Link from "next/link";
import { notFound } from "next/navigation";
import { getSceneTemplateById, getHomepageSceneTemplates } from "@/services/form-templates";
import { ArrowLeft, Sparkles, Check, Database, Share2, Webhook, Cpu, Route, HelpCircle } from "lucide-react";
import InteractiveDetailPreview from "@/components/templates/interactive-detail-preview";
import TemplateUseButton from "@/components/templates/template-use-button";
import TemplateViewTracker from "@/components/templates/template-view-tracker";
import JsonLd from "@/components/seo/json-ld";
import { localizePath } from "@/lib/localized-path";
import { solutionLandingPages } from "@/services/solution-landing-pages";
import { useCaseLandingPages } from "@/services/use-case-landing-pages";

interface Props {
  params: Promise<{ locale: string; templateId: string }>;
  searchParams?: Promise<{ theme?: string }>;
}

const templateSeoOverrides: Record<
  string,
  {
    titleEn: string;
    descriptionEn: string;
  }
> = {
  "job-application": {
    titleEn: "Job Application Maker - Free AI Form Template",
    descriptionEn:
      "Use this free job application maker template to collect candidate details, resumes, portfolio links, screening questions, and hiring follow-up consent.",
  },
  "nps-survey": {
    titleEn: "NPS Survey Maker - Free AI Form Template",
    descriptionEn:
      "Use this free NPS survey maker template to measure customer loyalty, collect detractor reasons, and prepare follow-up actions with AI.",
  },
  "content-download": {
    titleEn: "AI Lead Magnet Download Form - Free Template",
    descriptionEn:
      "Use this free AI lead magnet download form template to gate PDFs, whitepapers, reports, and checklists while capturing qualified leads.",
  },
};

const templateFaqs: Record<
  string,
  {
    locale: string;
    faqs: { q: string; a: string }[];
  }[]
> = {
  "job-application": [
    {
      locale: "en",
      faqs: [
        {
          q: "What is a job application form maker?",
          a: "A job application form maker helps businesses design conversational, structured signup forms for hiring candidates. It enables applicants to upload resumes, submit portfolios, and answer pre-screening questions, improving response rates compared to standard email submissions."
        },
        {
          q: "How do I connect my job application form to HR tools like Feishu, DingTalk, or Slack?",
          a: "You can easily configure a custom Webhook in your GenForms.ai console. Every time a candidate submits their job application, GenForms.ai will instantly trigger an HTTP request containing the candidate's details and direct resume download links, routing them directly into your internal group chats or ATS workflows."
        },
        {
          q: "Can candidate resumes be extracted automatically using AI?",
          a: "Yes! With GenForms.ai's integrated OCR extraction pipeline, you can pre-map fields to parse key details (like names, contact info, and past companies) directly from candidate resume attachments, saving valuable time during pre-screening."
        }
      ]
    },
    {
      locale: "zh",
      faqs: [
        {
          q: "什么是求职申请表生成器？",
          a: "求职申请表生成器可帮助企业设计对话式、结构化的招聘报名表，方便候选人上传简历、提交作品集链接并回答筛选问题。与传统邮件投递相比，它能显著提高候选人的回复率与体验。"
        },
        {
          q: "如何将求职申请表与飞书、钉钉、微信或内部 HR 系统对接？",
          a: "您可以在 GenForms.ai 控制台中配置自定义 Webhook。每当有候选人提交申请，系统会立即触发 HTTP 请求，将候选人详情及简历下载链接实时推送到您的飞书群、钉钉群或自建 ATS 系统中。"
        },
        {
          q: "能否自动解析候选人简历中的文本？",
          a: "可以。配合 GenForms.ai 内置的智能 OCR 提取模块，您可以将附件字段映射为结构化文本，自动抓取简历中的姓名、电话、过往公司等关键信息，大幅缩短人工初筛时间。"
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
    ? `免费 ${name} 表单模板 - 即开即用`
    : seoOverride?.titleEn || `Free ${name} - AI Form Template`;
  const description = isZh
    ? `使用免费的${name}模板。内置${template.scenario || "自动化"}场景。支持一键创建、AI 协同修改、Webhook 自动推送与 OCR 识别。`
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
  const querySource = (query as any).source;
  const template = getSceneTemplateById(templateId);

  if (!template) {
    notFound();
  }

  const isZh = locale.toLowerCase().startsWith("zh");
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
        use: "Use This Template",
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

  return (
    <div className="bg-slate-950 text-slate-100 min-h-screen pb-12 pt-20 md:pb-20 md:pt-28">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            {
              "@type": "ListItem",
              position: 1,
              name: isZh ? "模板库" : "Templates",
              item: locale === "en" ? `${baseUrl}/templates` : `${baseUrl}/${locale}/templates`,
            },
            {
              "@type": "ListItem",
              position: 2,
              name,
              item: templateUrl,
            },
          ],
        }}
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
      {(() => {
        const faqsForLocale = templateFaqs[template.id]?.find(f => locale.startsWith(f.locale))?.faqs || [];
        if (faqsForLocale.length === 0) return null;
        return (
          <JsonLd
            data={{
              "@context": "https://schema.org",
              "@type": "FAQPage",
              mainEntity: faqsForLocale.map(faq => ({
                "@type": "Question",
                name: faq.q,
                acceptedAnswer: {
                  "@type": "Answer",
                  text: faq.a
                }
              }))
            }}
          />
        );
      })()}
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
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12 items-start mb-8 lg:mb-12">
          
          {/* Left panel: Metadata, Title & CTA */}
          <div className="lg:col-span-8 space-y-6">
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
                source={querySource}
                trackingMetadata={querySource ? { source: querySource } : undefined}
              />
            </div>
          </div>

          {/* Right panel: Meta Specs Summary Card */}
          <div className="lg:col-span-4 bg-slate-900/40 border border-slate-900 rounded-3xl p-6 space-y-4">
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

        {/* Full-Width Live Sandbox Interactive Preview Block */}
        <div className="w-full bg-slate-900/10 border border-slate-900/80 rounded-3xl p-6 lg:p-8 flex flex-col items-center gap-6 relative overflow-hidden shadow-2xl mb-16">
          {/* Top colored aesthetic strip */}
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

        {/* Detailed Fields Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12 pt-10 lg:pt-16 border-t border-slate-900">
          
          {/* Left panel: Fields list for SEO keyword indexing */}
          <div className="lg:col-span-7 space-y-6">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Database className="size-5 text-blue-500" />
              {i18n.fieldsTitle}
            </h2>

            <div className="border border-slate-900 rounded-2xl overflow-x-auto bg-slate-900/10">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-900 bg-slate-900/30 text-slate-400 font-bold uppercase tracking-wider">
                    <th className="py-3 px-4">{i18n.fieldName}</th>
                    <th className="py-3 px-4">{i18n.fieldKey}</th>
                    <th className="py-3 px-4">{i18n.fieldType}</th>
                    <th className="py-3 px-4 text-center">{i18n.fieldReq}</th>
                  </tr>
                </thead>
                <tbody>
                  {fields.map((field) => (
                    <tr key={field.key} className="border-b border-slate-900/60 hover:bg-slate-900/20 transition-colors">
                      <td className="py-3.5 px-4 font-bold text-white">{field.label}</td>
                      <td className="py-3.5 px-4 font-mono text-slate-400">{field.key}</td>
                      <td className="py-3.5 px-4">
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

            {/* Quick 30s Deploy */}
            <div className="bg-slate-900/30 border border-slate-900 rounded-3xl p-6 space-y-4">
              <h3 className="text-sm font-black text-white flex items-center gap-1.5 uppercase tracking-wide">
                <Sparkles className="size-4 text-amber-400" />
                {i18n.setupTitle}
              </h3>
              <div className="space-y-3 text-xs text-slate-400 leading-relaxed font-semibold">
                <p>{i18n.step1}</p>
                <p>{i18n.step2}</p>
                <p>{i18n.step3}</p>
              </div>
            </div>

            {solutionLandingPages.some((page) => page.templateId === template.id) && (
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
                    {i18n.ocrText}
                  </h4>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {isZh
                      ? "配合平台自带的图像识别引擎，可自动将用户上传的图片文件（发票、账单等）提取为结构化字段。"
                      : "Using our pre-mapped OCR workflows to parse text from photo attachments automatically."}
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
                      ? "表单提交后，数据可配置重试策略并自动推送到指定的 Webhook，支持飞书、钉钉、企业微信机器人格式。"
                      : "Instantly route submitted entries to your CRM, team message logs, or any custom API with full retry logs."}
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

        {(() => {
          const faqsForLocale = templateFaqs[template.id]?.find(f => locale.startsWith(f.locale))?.faqs || [];
          if (faqsForLocale.length === 0) return null;
          return (
            <div className="mt-20 pt-16 border-t border-slate-900/80 space-y-8">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <HelpCircle className="size-5 text-blue-500" />
                {isZh ? "常见问题解答 (FAQ)" : "Frequently Asked Questions"}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {faqsForLocale.map((faq, idx) => (
                  <div 
                    key={idx}
                    className="bg-slate-900/20 border border-slate-900/60 p-6 rounded-2xl space-y-3 hover:border-slate-800 transition-colors"
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
          );
        })()}

      </div>
    </div>
  );
}
