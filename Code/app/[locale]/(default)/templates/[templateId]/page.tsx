import Link from "next/link";
import { notFound } from "next/navigation";
import { getSceneTemplateById, getHomepageSceneTemplates } from "@/services/form-templates";
import { ArrowLeft, Sparkles, Check, Database, Share2, Webhook, Cpu } from "lucide-react";
import InteractiveDetailPreview from "@/components/templates/interactive-detail-preview";
import TemplateUseButton from "@/components/templates/template-use-button";
import TemplateViewTracker from "@/components/templates/template-view-tracker";

interface Props {
  params: Promise<{ locale: string; templateId: string }>;
  searchParams?: Promise<{ theme?: string }>;
}



export async function generateMetadata({ params }: Props) {
  const { locale, templateId } = await params;
  const template = getSceneTemplateById(templateId);
  if (!template) return {};

  const isZh = locale.toLowerCase().startsWith("zh");
  const name = isZh ? template.name : (template.nameEn || template.name);
  const desc = isZh ? template.description : (template.descriptionEn || template.description);
  const baseUrl = process.env.NEXT_PUBLIC_WEB_URL || "https://aifactory.ai";
  const canonicalUrl =
    locale === "en"
      ? `${baseUrl}/templates/${template.id}`
      : `${baseUrl}/${locale}/templates/${template.id}`;
  const title = isZh
    ? `免费 ${name} 表单模板 - 即开即用`
    : `Free ${name} - AI Form Template`;
  const description = isZh
    ? `使用免费的${name}模板。内置${template.scenario || "自动化"}场景。支持一键创建、AI 协同修改、Webhook 自动推送与 OCR 识别。`
    : `Get started with the free ${name} template. Tailored for ${template.scenarioEn || "forms"}. AI-driven customizations and Feishu/Slack/Webhook integrations.`;

  return {
    title,
    description,
    keywords: `${name}, form template, AI form, free template, ${template.category}`,
    alternates: {
      canonical: canonicalUrl,
      languages: {
        en: `${baseUrl}/templates/${template.id}`,
        zh: `${baseUrl}/zh/templates/${template.id}`,
      },
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: "AI FormFactory",
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
  const name = isZh ? template.name : (template.nameEn || template.name);
  const description = isZh ? template.description : (template.descriptionEn || template.description);
  const category = isZh ? template.category : (template.categoryEn || template.category);
  const scenario = isZh ? template.scenario : (template.scenarioEn || template.scenario);

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
        ocrText: template.ocrTemplate ? `Preset OCR ${template.ocrTemplate} photo extraction` : "No image parsing",
        webhookText: template.webhookPreset ? `Built-in ${template.webhookPreset} webhook dispatch` : "Generic Webhook dispatch",
        previewLabel: "Interactive High-Fidelity Preview",
        setupTitle: "30-Second Setup Guide",
        step1: "1. Click the 'Use This Template' button above to clone it.",
        step2: "2. Tweak labels or add questions in seconds using our AI Agent console.",
        step3: "3. Save, configure your custom webhook payload, and share the link.",
      };

  return (
    <div className="bg-slate-950 text-slate-100 min-h-screen pb-20 pt-28">
      <TemplateViewTracker templateId={template.id} />
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Back Link */}
        <Link 
          href={`/${locale}/templates`}
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-white transition-colors mb-8 group"
        >
          <ArrowLeft className="size-4 group-hover:-translate-x-1 transition-transform" />
          {i18n.back}
        </Link>

        {/* Hero split layout (Top Info Block) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start mb-12">
          
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
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 pt-16 border-t border-slate-900">
          
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

      </div>
    </div>
  );
}
