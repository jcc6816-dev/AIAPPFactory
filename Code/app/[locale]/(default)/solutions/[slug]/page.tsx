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
import JsonLd from "@/components/seo/json-ld";
import TemplateUseButton from "@/components/templates/template-use-button";
import { getSceneTemplateById } from "@/services/form-templates";
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
  const relatedUseCases =
    sameTemplateUseCases.length > 0
      ? sameTemplateUseCases
      : useCaseLandingPages.filter((item) => fallbackUseCaseSlugs.includes(item.slug));
  const relatedSolutions =
    sameTemplateSolutions.length > 0
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
        data={{
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            {
              "@type": "ListItem",
              position: 1,
              name: isZh ? "行业解决方案" : "Solutions",
              item: locale === "en" ? `${baseUrl}/solutions` : `${baseUrl}/${locale}/solutions`,
            },
            {
              "@type": "ListItem",
              position: 2,
              name: title,
              item: canonicalUrl,
            },
          ],
        }}
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
                trackingMetadata={{
                  landing_slug: page.slug,
                  entry_point: "solution_landing",
                  source: `solution_${page.slug}`,
                }}
              />
              <Link
                href={localizedPath(locale, `/templates/${template.id}?source=solution_${page.slug}`)}
                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/15 px-8 py-4 text-sm font-black text-white transition hover:bg-white/10"
              >
                {isZh ? "查看模板详情" : "View template"}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>

          <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/5 shadow-2xl shadow-blue-950/30">
            <TemplateVisualPreview
              template={template}
              activeTheme={template.theme === "dark" ? "dark" : "business"}
              locale={locale}
            />
          </div>
        </div>
      </section>

      <section className="border-b border-slate-200 bg-slate-50">
        <div className="container grid gap-6 py-8 md:grid-cols-3">
          <Metric icon={Search} label={isZh ? "搜索意图" : "Search intent"} value={searchIntent} />
          <Metric icon={Sparkles} label={isZh ? "推荐 Prompt" : "Starter prompt"} value={prompt} />
          <Metric icon={ClipboardList} label={isZh ? "目标用户" : "Best for"} value={audience} />
        </div>
      </section>

      <section className="container grid gap-10 py-10 md:py-16 lg:grid-cols-[0.85fr_1.15fr]">
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
