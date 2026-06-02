import Link from "next/link";
import { getHomepageSceneTemplates } from "@/services/form-templates";
import { Sparkles, ArrowRight, Layers, Layout, Webhook, Zap } from "lucide-react";
import TemplateStarter, { TemplateVisualPreview } from "@/components/blocks/template-starter";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const isZh = locale.toLowerCase().startsWith("zh");
  const baseUrl = process.env.NEXT_PUBLIC_WEB_URL || "https://genforms.ai";
  const canonicalUrl = locale === "en" ? `${baseUrl}/templates` : `${baseUrl}/${locale}/templates`;
  const title = isZh
    ? "精选 AI 表单与数据收集模板库"
    : "Pre-designed AI Form & Data Collection Templates";
  const description = isZh
    ? "浏览高颜值、即开即用的场景表单模板。包含活动报名、线索收集、预约咨询、客户反馈等，支持 AI 自由定制与 Webhook 集成。"
    : "Browse premium, ready-to-use form templates for event registration, lead generation, customer feedback, and bookings. AI-customizable with webhook integrations.";

  return {
    title,
    description,
    keywords: isZh
      ? "表单模板, 活动报名表, 线索收集表, 预约表单, OCR 表单, AI 表单生成"
      : "form templates, registration form, lead capture, booking form, customer feedback, OCR form, AI form generator",
    alternates: {
      canonical: canonicalUrl,
      languages: {
        en: `${baseUrl}/templates`,
        zh: `${baseUrl}/zh/templates`,
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

export default async function TemplatesIndexPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const templates = getHomepageSceneTemplates();
  const isZh = locale.toLowerCase().startsWith("zh");
  const categories = Array.from(
    templates.reduce((map, template) => {
      const category = isZh
        ? template.category
        : template.categoryEn || template.category;
      const current = map.get(category) || [];
      current.push(template);
      map.set(category, current);
      return map;
    }, new Map<string, typeof templates>())
  );

  const i18n = isZh
    ? {
        kicker: "场景模板库",
        title: "精选高频可运行表单模板",
        subtitle: "我们拒绝生硬的占位符。每个模板均配有精心设计的双栏插画布局与人性化文案，支持 5 套核心主题实时预览，一键启用。",
        searchPlaceholder: "搜索场景模板...",
        useTemplate: "使用此模板",
        viewDetails: "查看详情",
        backHome: "返回首页",
        featuresTitle: "为什么选择 GenForms.ai 模板？",
        feature1Title: "高颜值设计",
        feature1Desc: "摒弃传统扁平表单，引入精美毛玻璃、流光流动和内联 3D 艺术插画，大幅提升填写转化率。",
        feature2Title: "AI 协同修改",
        feature2Desc: "以模板为地基，你可以通过对话框用自然语言命令 AI 随时增删字段、调整逻辑、润色文案。",
        feature3Title: "自动化集成",
        feature3Desc: "内置 OCR 自动识别、表单数据存储，以及 Feishu/Slack/自定义 Webhook 推送，打通数据收集全链路。",
        categoriesTitle: "按业务场景查找模板",
        categoriesDesc: "每个分类都对应一个可直接发布的数据采集入口，也可以作为 AI 生成表单的起点。",
      }
    : {
        kicker: "Template Gallery",
        title: "Curated High-Performance Templates",
        subtitle: "No cold starts. Every template comes with a high-fidelity visual poster, humanized conversational questions, and full webhook support. Try them instantly.",
        searchPlaceholder: "Search templates...",
        useTemplate: "Use This Template",
        viewDetails: "View Details",
        backHome: "Back to Home",
        featuresTitle: "Why Choose GenForms.ai Templates?",
        feature1Title: "Visual Excellence",
        feature1Desc: "Replace generic inputs with immersive glassmorphism, gradient glows, and beautiful custom SVG illustration sidebars.",
        feature2Title: "AI Co-pilot Customization",
        feature2Desc: "Use templates as blueprint. Tell our built-in AI Agent to add questions, format text, or tweak layout on the fly.",
        feature3Title: "Production Ready Out-of-the-box",
        feature3Desc: "Built-in OCR, data storage, and one-click integrations for Feishu, DingTalk, WeCom, and custom webhook endpoints.",
        categoriesTitle: "Browse Templates by Use Case",
        categoriesDesc: "Each category maps to a publishable data-collection workflow and can be used as a starting point for AI form generation.",
      };

  return (
    <div className="bg-slate-950 text-slate-100 min-h-screen pb-20 pt-28">
      {/* Hero Section */}
      <div className="max-w-6xl mx-auto px-6 text-center mb-16">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/10 border border-blue-500/20 text-blue-400 mb-4 animate-pulse">
          <Sparkles className="size-3" />
          {i18n.kicker}
        </span>
        <h1 className="text-4xl md:text-5xl font-black tracking-tight text-white mb-6 bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
          {i18n.title}
        </h1>
        <p className="text-base md:text-lg text-slate-400 max-w-3xl mx-auto leading-relaxed">
          {i18n.subtitle}
        </p>
      </div>

      {/* Main Grid Section - Reusing TemplateStarter component */}
      <div className="-mt-12">
        <TemplateStarter locale={locale} />
      </div>

      {/* Detailed Grid for SEO Links */}
      <div className="max-w-6xl mx-auto px-6 mt-16 border-t border-slate-900 pt-16">
        <h2 className="text-2xl font-bold text-white mb-8 text-center">{isZh ? "模板详情索引" : "Template Details Index"}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {templates.map((template) => {
            const name = isZh ? template.name : (template.nameEn || template.name);
            const desc = isZh ? template.description : (template.descriptionEn || template.description);
            const cat = isZh ? template.category : (template.categoryEn || template.category);

            return (
              <div 
                key={template.id} 
                className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-6 hover:border-blue-500/40 transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[10px] font-bold text-blue-400 px-2 py-0.5 bg-blue-500/10 rounded border border-blue-500/20 uppercase tracking-wider">
                      {cat}
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono">
                      {template.theme}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">
                    {name}
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed mb-6 line-clamp-3">
                    {desc}
                  </p>
                </div>

                <div className="flex flex-col gap-2">
                  <Link 
                    href={`/${locale}/templates/${template.id}`}
                    className="w-full text-center py-2 rounded-xl border border-slate-800 text-xs font-bold text-slate-300 hover:bg-slate-800 hover:text-white transition-all"
                  >
                    {i18n.viewDetails}
                  </Link>
                  <Link 
                    href={`/${locale}/forms/new?template=${template.id}`}
                    className="w-full text-center py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-xs font-bold text-white transition-all flex items-center justify-center gap-1"
                  >
                    {i18n.useTemplate}
                    <ArrowRight className="size-3" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 mt-16 border-t border-slate-900 pt-16">
        <div className="mb-8 text-center">
          <h2 className="text-2xl font-bold text-white">{i18n.categoriesTitle}</h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-slate-400">
            {i18n.categoriesDesc}
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {categories.map(([category, items]) => (
            <section
              key={category}
              className="rounded-2xl border border-slate-800/80 bg-slate-900/40 p-5"
            >
              <h3 className="text-sm font-black text-white">{category}</h3>
              <p className="mt-2 text-xs font-semibold leading-5 text-slate-500">
                {items.length} {isZh ? "个可发布模板" : "publishable templates"}
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                {items.slice(0, 4).map((template) => (
                  <Link
                    key={template.id}
                    href={`/${locale}/templates/${template.id}`}
                    className="rounded-full border border-slate-800 px-3 py-1 text-[11px] font-bold text-slate-300 transition hover:border-blue-500/40 hover:text-blue-300"
                  >
                    {isZh ? template.name : template.nameEn || template.name}
                  </Link>
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>

      {/* Features Showcase */}
      <div className="max-w-5xl mx-auto px-6 mt-24 text-center">
        <h2 className="text-3xl font-black text-white mb-12">{i18n.featuresTitle}</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-slate-900/40 border border-slate-900 p-8 rounded-3xl text-left">
            <div className="size-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center mb-6">
              <Layout className="size-5" />
            </div>
            <h3 className="text-lg font-bold text-white mb-3">{i18n.feature1Title}</h3>
            <p className="text-xs text-slate-400 leading-relaxed">{i18n.feature1Desc}</p>
          </div>

          <div className="bg-slate-900/40 border border-slate-900 p-8 rounded-3xl text-left">
            <div className="size-10 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center mb-6">
              <Sparkles className="size-5" />
            </div>
            <h3 className="text-lg font-bold text-white mb-3">{i18n.feature2Title}</h3>
            <p className="text-xs text-slate-400 leading-relaxed">{i18n.feature2Desc}</p>
          </div>

          <div className="bg-slate-900/40 border border-slate-900 p-8 rounded-3xl text-left">
            <div className="size-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mb-6">
              <Webhook className="size-5" />
            </div>
            <h3 className="text-lg font-bold text-white mb-3">{i18n.feature3Title}</h3>
            <p className="text-xs text-slate-400 leading-relaxed">{i18n.feature3Desc}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
