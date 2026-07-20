import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowRight,
  CheckCircle2,
  ClipboardList,
  FileText,
  Layers3,
  Route,
  Search,
  Sparkles,
} from "lucide-react";

import { TemplateVisualPreview } from "@/components/blocks/template-starter";
import LandingPageTracker from "@/components/analytics/landing-page-tracker";
import { buildBreadcrumbListJsonLd } from "@/components/seo/breadcrumb-json-ld";
import JsonLd from "@/components/seo/json-ld";
import TemplateUseButton from "@/components/templates/template-use-button";
import {
  getSceneTemplateById,
  type SceneTemplate,
} from "@/services/form-templates";
import {
  getSolutionLandingPage,
  solutionLandingPages,
} from "@/services/solution-landing-pages";
import { useCaseLandingPages } from "@/services/use-case-landing-pages";

interface Props {
  params: Promise<{ locale: string; slug: string }>;
}

function localizedPath(locale: string, path: string) {
  return locale === "en" ? path : `/${locale}${path}`;
}

export function generateStaticParams() {
  return solutionLandingPages.flatMap((page) => [
    { locale: "en", slug: page.slug },
    { locale: "zh", slug: page.slug },
  ]);
}

export async function generateMetadata({ params }: Props) {
  const { locale, slug } = await params;
  const page = getSolutionLandingPage(slug);
  if (!page) return {};

  const isZh = locale.toLowerCase().startsWith("zh");
  const baseUrl = process.env.NEXT_PUBLIC_WEB_URL || "https://genforms.ai";
  const canonicalUrl =
    locale === "en"
      ? `${baseUrl}/solutions/${page.slug}`
      : `${baseUrl}/${locale}/solutions/${page.slug}`;
  const title = isZh ? page.zhTitle : page.title;
  const description = isZh ? page.zhDescription : page.description;

  return {
    title,
    description,
    keywords: (isZh ? page.zhKeywords : page.keywords).join(", "),
    alternates: {
      canonical: canonicalUrl,
      languages: {
        en: `${baseUrl}/solutions/${page.slug}`,
        zh: `${baseUrl}/zh/solutions/${page.slug}`,
        "x-default": `${baseUrl}/solutions/${page.slug}`,
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

export default async function SolutionLandingPage({ params }: Props) {
  const { locale, slug } = await params;
  const page = getSolutionLandingPage(slug);
  if (!page) notFound();

  const template = getSceneTemplateById(page.templateId);
  if (!template) notFound();

  const isZh = locale.toLowerCase().startsWith("zh");
  const isCourseRegistration = page.slug === "course-registration-form-builder";
  const title = isZh ? page.zhTitle : page.title;
  const description = isZh ? page.zhDescription : page.description;
  const searchIntent = isZh ? page.zhSearchIntent : page.searchIntent;
  const audience = isZh ? page.zhAudience : page.audience;
  const recommendedFields = isZh
    ? page.zhRecommendedFields
    : page.recommendedFields;
  const workflow = isZh ? page.zhWorkflow : page.workflow;
  const prompt = isZh ? page.zhPrompt : page.prompt;
  const baseUrl = process.env.NEXT_PUBLIC_WEB_URL || "https://genforms.ai";
  const canonicalUrl =
    locale === "en"
      ? `${baseUrl}/solutions/${page.slug}`
      : `${baseUrl}/${locale}/solutions/${page.slug}`;
  const sameTemplateUseCases = useCaseLandingPages
    .filter((item) => item.templateId === page.templateId)
    .slice(0, 3);
  const sameTemplateSolutions = solutionLandingPages
    .filter((item) => item.slug !== page.slug && item.templateId === page.templateId)
    .slice(0, 3);
  const fallbackUseCaseSlugs = [
    "typeform-alternative-webhooks",
    "ai-lead-capture-form-builder",
    "webhook-form-builder-retry-logs",
  ];
  const fallbackSolutionSlugs = [
    "saas-lead-capture-form-builder",
    "webhook-form-builder-retry-logs",
    "google-forms-alternative-ai",
  ];
  const courseRelatedUseCaseSlugs = [
    "event-registration-form-builder",
    "qr-code-form-builder",
    "webhook-form-builder-retry-logs",
  ];
  const relatedUseCases =
    isCourseRegistration
      ? courseRelatedUseCaseSlugs
          .map((relatedSlug) =>
            useCaseLandingPages.find((item) => item.slug === relatedSlug),
          )
          .filter((item): item is (typeof useCaseLandingPages)[number] => Boolean(item))
      : sameTemplateUseCases.length > 0
      ? sameTemplateUseCases
      : useCaseLandingPages.filter((item) => fallbackUseCaseSlugs.includes(item.slug));
  const relatedSolutions =
    isCourseRegistration
      ? []
      : sameTemplateSolutions.length > 0
      ? sameTemplateSolutions
      : solutionLandingPages.filter(
          (item) =>
            item.slug !== page.slug && fallbackSolutionSlugs.includes(item.slug),
        );

  return (
    <main className="min-h-screen bg-white text-slate-950">
      <LandingPageTracker
        slug={page.slug}
        templateId={template.id}
        entryPoint="solution_landing"
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          name: title,
          applicationCategory: "BusinessApplication",
          operatingSystem: "Web",
          url: canonicalUrl,
          description,
          audience: {
            "@type": "Audience",
            audienceType: audience,
          },
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
          featureList: recommendedFields,
        }}
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: page.faq.map((item) => ({
            "@type": "Question",
            name: isZh ? item.zhQuestion : item.question,
            acceptedAnswer: {
              "@type": "Answer",
              text: isZh ? item.zhAnswer : item.answer,
            },
          })),
        }}
      />
      <JsonLd
        data={buildBreadcrumbListJsonLd([
          {
            name: isZh ? "行业解决方案" : "Solutions",
            url:
              locale === "en"
                ? `${baseUrl}/solutions`
                : `${baseUrl}/${locale}/solutions`,
          },
          {
            name: title,
            url: canonicalUrl,
          },
        ])}
      />

      <section className="bg-slate-950 text-white">
        <div className="container grid gap-10 py-10 md:py-20 lg:grid-cols-[minmax(0,1fr)_minmax(380px,0.72fr)] lg:items-center">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full border border-blue-400/30 bg-blue-400/10 px-3 py-1 text-[11px] font-black uppercase tracking-[0.22em] text-blue-200">
              <Search className="h-3.5 w-3.5" />
              {isZh ? page.zhEyebrow : page.eyebrow}
            </p>
            <h1 className="mt-5 max-w-4xl text-4xl font-black tracking-tight md:text-6xl">
              {title}
            </h1>
            <p className="mt-5 max-w-2xl text-base font-medium leading-8 text-slate-300 md:text-lg">
              {description}
            </p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <TemplateUseButton
                locale={locale}
                templateId={template.id}
                label={isZh ? page.zhCta : page.cta}
                source={`solution_${page.slug}`}
                intent={page.creationIntent}
                prompt={page.creationIntent ? prompt : undefined}
                badgeLabel={
                  page.creationIntent === "client_intake" ||
                  page.creationIntent === "customer_testimonial" ||
                  isCourseRegistration
                    ? isZh
                      ? "AI Ready • 分享链接 / 二维码"
                      : "AI Ready • Share link / QR"
                    : undefined
                }
                trackingMetadata={{
                  landing_slug: page.slug,
                  entry_point: "solution_landing",
                  source: `solution_${page.slug}`,
                  intent: page.creationIntent || "",
                }}
              />
              <Link
                href={
                  page.creationIntent === "client_intake" || isCourseRegistration
                    ? "#recommended-fields"
                    : localizedPath(locale, `/templates/${template.id}?source=solution_${page.slug}`)
                }
                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/15 px-8 py-4 text-sm font-black text-white transition hover:bg-white/10"
              >
                {page.creationIntent === "client_intake" || isCourseRegistration
                  ? isZh
                    ? isCourseRegistration
                      ? "查看报名字段"
                      : "查看推荐字段"
                    : isCourseRegistration
                      ? "Preview registration fields"
                      : "Preview intake fields"
                  : isZh
                    ? "查看模板详情"
                    : "View template"}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>

          <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/5 shadow-2xl shadow-blue-950/30">
            {page.creationIntent === "client_intake" ? (
              <WebDesignIntakePreview isZh={isZh} />
            ) : isCourseRegistration ? (
              <CourseRegistrationPreview template={template} isZh={isZh} />
            ) : (
              <TemplateVisualPreview
                template={template}
                activeTheme={template.theme === "dark" ? "dark" : "business"}
                locale={locale}
              />
            )}
          </div>
        </div>
      </section>

      {!isCourseRegistration && (
        <section className="border-b border-slate-200 bg-slate-50">
          <div className="container grid gap-6 py-8 md:grid-cols-3">
            <Metric icon={Search} label={isZh ? "搜索意图" : "Search intent"} value={searchIntent} />
            <Metric icon={Sparkles} label={isZh ? "推荐 Prompt" : "Starter prompt"} value={prompt} />
            <Metric icon={ClipboardList} label={isZh ? "目标用户" : "Best for"} value={audience} />
          </div>
        </section>
      )}

      <section
        id="recommended-fields"
        className="container scroll-mt-28 grid gap-10 py-10 md:py-16 lg:grid-cols-[0.85fr_1.15fr]"
      >
        <div>
          <p className="text-xs font-black uppercase tracking-[0.22em] text-blue-600">
            {isZh ? "推荐字段" : "Recommended fields"}
          </p>
          <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-950">
            {isZh ? "先把行业场景问对" : "Start with fields that fit the workflow"}
          </h2>
          <p className="mt-4 text-sm font-medium leading-7 text-slate-600">
            {isZh
              ? "这些字段不是固定限制，而是让 AI 生成更贴近业务场景的起点。"
              : "These fields are not a fixed limit. They are a starting point for AI to generate a more relevant form."}
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          {recommendedFields.map((field) => (
            <div
              key={field}
              className="flex gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
            >
              <CheckCircle2 className="mt-0.5 h-5 w-5 flex-none text-emerald-600" />
              <p className="text-sm font-bold leading-6 text-slate-700">{field}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-slate-950 text-white">
        <div className="container py-10 md:py-16">
          <div className="flex items-end justify-between gap-6">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.22em] text-blue-300">
                {isZh ? "发布流程" : "Workflow"}
              </p>
              <h2 className="mt-3 text-3xl font-black tracking-tight">
                {isZh ? "从行业入口到可发布表单" : "From industry page to publishable form"}
              </h2>
            </div>
            <Route className="hidden h-10 w-10 text-blue-300 md:block" />
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {workflow.map((step, index) => (
              <div
                key={step}
                className="rounded-2xl border border-white/10 bg-white/[0.04] p-5"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-500 text-sm font-black text-white">
                  {index + 1}
                </div>
                <p className="mt-4 text-sm font-bold leading-7 text-slate-200">{step}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="container py-10 md:py-16">
        <div className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr]">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.22em] text-blue-600">
              {isZh ? "常见问题" : "FAQ"}
            </p>
            <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-950">
              {isZh ? "发布前先回答关键顾虑" : "Answer the key concerns before users build"}
            </h2>
          </div>
          <div className="grid gap-3">
            {page.faq.map((item) => (
              <div key={item.question} className="rounded-2xl bg-slate-100 p-5">
                <h3 className="text-base font-black text-slate-950">
                  {isZh ? item.zhQuestion : item.question}
                </h3>
                <p className="mt-3 text-sm font-bold leading-6 text-slate-600">
                  {isZh ? item.zhAnswer : item.answer}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {(relatedUseCases.length > 0 || relatedSolutions.length > 0) && (
        <section className="border-t border-slate-200 bg-white">
          <div className="container py-10 md:py-16">
            <div className="max-w-2xl">
              <p className="text-xs font-black uppercase tracking-[0.22em] text-blue-600">
                {isZh ? "相关入口" : "Related paths"}
              </p>
              <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-950">
                {isZh
                  ? "继续沿着同一类表单场景探索"
                  : "Keep exploring the same form workflow"}
              </h2>
              <p className="mt-4 text-sm font-medium leading-7 text-slate-600">
                {isZh
                  ? "这些页面围绕同一个模板或工作流展开，适合进一步比较场景、自动化方式和表单入口。"
                  : "These pages build around the same template or workflow, so visitors can compare scenarios, automation paths, and form entry points."}
              </p>
            </div>

            <div className="mt-8 grid gap-4 lg:grid-cols-2">
              {relatedUseCases.map((item) => (
                <Link
                  key={item.slug}
                  href={localizedPath(locale, `/use-cases/${item.slug}`)}
                  className="group rounded-2xl border border-slate-200 bg-slate-50 p-5 transition hover:border-blue-200 hover:bg-blue-50/60"
                >
                  <div className="flex items-start gap-4">
                    <span className="flex h-10 w-10 flex-none items-center justify-center rounded-2xl bg-blue-600 text-white">
                      <FileText className="h-5 w-5" />
                    </span>
                    <div>
                      <p className="text-[11px] font-black uppercase tracking-[0.18em] text-blue-600">
                        {isZh ? item.zhEyebrow : item.eyebrow}
                      </p>
                      <h3 className="mt-2 text-lg font-black text-slate-950">
                        {isZh ? item.zhTitle : item.title}
                      </h3>
                      <p className="mt-2 text-sm font-bold leading-6 text-slate-600">
                        {isZh ? item.zhDescription : item.description}
                      </p>
                      <span className="mt-4 inline-flex items-center gap-2 text-sm font-black text-blue-600 group-hover:text-blue-500">
                        {isZh ? "查看用例" : "View use case"}
                        <ArrowRight className="h-4 w-4" />
                      </span>
                    </div>
                  </div>
                </Link>
              ))}

              {relatedSolutions.map((item) => (
                <Link
                  key={item.slug}
                  href={localizedPath(locale, `/solutions/${item.slug}`)}
                  className="group rounded-2xl border border-slate-200 bg-slate-50 p-5 transition hover:border-blue-200 hover:bg-blue-50/60"
                >
                  <div className="flex items-start gap-4">
                    <span className="flex h-10 w-10 flex-none items-center justify-center rounded-2xl bg-slate-950 text-white">
                      <Layers3 className="h-5 w-5" />
                    </span>
                    <div>
                      <p className="text-[11px] font-black uppercase tracking-[0.18em] text-slate-500">
                        {isZh ? item.zhEyebrow : item.eyebrow}
                      </p>
                      <h3 className="mt-2 text-lg font-black text-slate-950">
                        {isZh ? item.zhTitle : item.title}
                      </h3>
                      <p className="mt-2 text-sm font-bold leading-6 text-slate-600">
                        {isZh ? item.zhDescription : item.description}
                      </p>
                      <span className="mt-4 inline-flex items-center gap-2 text-sm font-black text-blue-600 group-hover:text-blue-500">
                        {isZh ? "查看方案" : "View solution"}
                        <ArrowRight className="h-4 w-4" />
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="border-t border-slate-200 bg-slate-50">
        <div className="container flex flex-col justify-between gap-6 py-8 md:py-12 md:flex-row md:items-center">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.22em] text-slate-500">
              {isZh ? "继续探索" : "More solution pages"}
            </p>
            <h2 className="mt-2 text-2xl font-black tracking-tight text-slate-950">
              {isZh ? "查看其他行业场景" : "Browse other industry workflows"}
            </h2>
          </div>
          <Link
            href={localizedPath(locale, "/solutions")}
            className="inline-flex items-center gap-2 text-sm font-black text-blue-600 hover:text-blue-500"
          >
            {isZh ? "查看全部解决方案" : "View all solutions"}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </main>
  );
}

function Metric({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Search;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <Icon className="h-5 w-5 text-blue-600" />
      <p className="mt-4 text-[11px] font-black uppercase tracking-[0.18em] text-slate-400">
        {label}
      </p>
      <p className="mt-2 text-sm font-bold leading-6 text-slate-700">{value}</p>
    </div>
  );
}

function WebDesignIntakePreview({ isZh }: { isZh: boolean }) {
  const rows = isZh
    ? [
        ["现有网站", "examplebrand.com"],
        ["项目目标", "改版官网，提升线索转化"],
        ["参考网站", "apple.com, linear.app"],
        ["品牌风格", "简洁、可信、偏 B2B SaaS"],
        ["预算范围", "$5k-$10k"],
        ["上线时间", "6-8 周"],
      ]
    : [
        ["Current website", "examplebrand.com"],
        ["Project goals", "Redesign for clearer lead generation"],
        ["Reference sites", "apple.com, linear.app"],
        ["Brand style", "Clean, credible, B2B SaaS"],
        ["Budget range", "$5k-$10k"],
        ["Launch timeline", "6-8 weeks"],
      ];

  return (
    <div className="bg-slate-100 p-5 text-slate-950 md:p-6">
      <div className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-2xl shadow-slate-950/20">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-[11px] font-black uppercase tracking-[0.2em] text-blue-600">
              {isZh ? "Mini questionnaire" : "Mini questionnaire"}
            </p>
            <h3 className="mt-2 text-2xl font-black tracking-tight text-slate-950">
              {isZh ? "网站设计客户需求" : "Website design intake"}
            </h3>
            <p className="mt-2 text-sm font-bold leading-6 text-slate-500">
              {isZh
                ? "替代静态 PDF 问卷，让客户从链接或二维码完成 kickoff 前信息收集。"
                : "Replace a static PDF with a mobile-friendly intake flow before kickoff."}
            </p>
          </div>
          <span className="rounded-full bg-emerald-50 px-3 py-1 text-[11px] font-black text-emerald-700">
            {isZh ? "可分享" : "Shareable"}
          </span>
        </div>

        <div className="mt-5 grid gap-3">
          {rows.map(([label, value]) => (
            <div
              key={label}
              className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
            >
              <p className="text-[11px] font-black uppercase tracking-[0.16em] text-slate-400">
                {label}
              </p>
              <p className="mt-1 text-sm font-black leading-6 text-slate-800">
                {value}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-5 rounded-2xl border border-blue-100 bg-blue-50 p-4">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="h-5 w-5 flex-none text-blue-600" />
            <p className="text-sm font-black leading-6 text-blue-950">
              {isZh
                ? "提交后可在数据面板查看、导出 CSV，或进入 Webhook/Bot 后续通知路径。"
                : "Review submissions, export CSV, or route responses through webhook and bot notification paths."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function CourseRegistrationPreview({
  template,
  isZh,
}: {
  template: SceneTemplate;
  isZh: boolean;
}) {
  const schema = isZh || !template.formSchemaEn
    ? template.formSchema
    : template.formSchemaEn;
  const sampleValues: Record<string, string> = isZh
    ? {
        student_name: "林晓",
        contact: "lin@example.com",
        course_name: "主题工作坊",
        experience_level: "有一点基础",
        learning_goal: "完成第一个可用项目",
      }
    : {
        student_name: "Alex Johnson",
        contact: "alex@example.com",
        course_name: "Deep-Dive Workshop",
        experience_level: "Some basic knowledge",
        learning_goal: "Build a first working project",
      };

  return (
    <div className="bg-slate-100 p-5 text-slate-950 md:p-6">
      <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-2xl shadow-slate-950/20">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-[11px] font-black uppercase tracking-[0.2em] text-blue-600">
              {isZh ? "课程报名预览" : "Registration preview"}
            </p>
            <h3 className="mt-2 text-2xl font-black tracking-tight text-slate-950">
              {isZh ? "主题工作坊报名" : "Workshop registration"}
            </h3>
            <p className="mt-2 text-sm font-bold leading-6 text-slate-500">
              {isZh
                ? "从真实课程模板字段开始，通过链接或二维码分享。"
                : "Start with real course fields and share by link or QR code."}
            </p>
          </div>
          <span className="rounded-full bg-emerald-50 px-3 py-1 text-[11px] font-black text-emerald-700">
            {isZh ? "可分享" : "Shareable"}
          </span>
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          {schema.fields.slice(0, 5).map((field) => (
            <div
              key={field.key}
              className="rounded-2xl border border-slate-200 bg-slate-50 p-3.5"
            >
              <p className="text-[10px] font-black uppercase tracking-[0.12em] text-slate-400">
                {field.label}
              </p>
              <p className="mt-1.5 text-sm font-black leading-5 text-slate-800">
                {sampleValues[field.key] || (isZh ? "可选回答" : "Optional response")}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          <span className="rounded-full border border-blue-100 bg-blue-50 px-3 py-1.5 text-[11px] font-black text-blue-700">
            {isZh ? "公开链接" : "Public link"}
          </span>
          <span className="rounded-full border border-blue-100 bg-blue-50 px-3 py-1.5 text-[11px] font-black text-blue-700">
            {isZh ? "二维码访问" : "QR access"}
          </span>
          <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-[11px] font-black text-slate-600">
            {isZh ? "人工跟进" : "Manual follow-up"}
          </span>
        </div>
      </div>
    </div>
  );
}
