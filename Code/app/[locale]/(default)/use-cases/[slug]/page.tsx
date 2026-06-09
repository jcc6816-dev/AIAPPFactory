import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowRight,
  CheckCircle2,
  ExternalLink,
  Route,
  Search,
  Sparkles,
  Webhook,
} from "lucide-react";

import LandingPageTracker from "@/components/analytics/landing-page-tracker";
import { TemplateVisualPreview } from "@/components/blocks/template-starter";
import JsonLd from "@/components/seo/json-ld";
import TemplateUseButton from "@/components/templates/template-use-button";
import { getPostsByLocale } from "@/models/post";
import { getSceneTemplateById } from "@/services/form-templates";
import {
  getGrowthContentCluster,
  getPublishedClusterPosts,
} from "@/services/growth-content-clusters";
import {
  getUseCaseLandingPage,
  useCaseLandingPages,
} from "@/services/use-case-landing-pages";
import { solutionLandingPages } from "@/services/solution-landing-pages";

interface Props {
  params: Promise<{ locale: string; slug: string }>;
}

function localizedPath(locale: string, path: string) {
  return locale === "en" ? path : `/${locale}${path}`;
}

export function generateStaticParams() {
  return useCaseLandingPages.flatMap((page) => [
    { locale: "en", slug: page.slug },
    { locale: "zh", slug: page.slug },
  ]);
}

export async function generateMetadata({ params }: Props) {
  const { locale, slug } = await params;
  const page = getUseCaseLandingPage(slug);
  if (!page) return {};

  const isZh = locale.toLowerCase().startsWith("zh");
  const baseUrl = process.env.NEXT_PUBLIC_WEB_URL || "https://genforms.ai";
  const canonicalUrl =
    locale === "en"
      ? `${baseUrl}/use-cases/${page.slug}`
      : `${baseUrl}/${locale}/use-cases/${page.slug}`;
  const title = isZh ? page.zhTitle : page.title;
  const description = isZh ? page.zhDescription : page.description;

  return {
    title,
    description,
    keywords: (isZh ? page.zhKeywords : page.keywords).join(", "),
    alternates: {
      canonical: canonicalUrl,
      languages: {
        en: `${baseUrl}/use-cases/${page.slug}`,
        zh: `${baseUrl}/zh/use-cases/${page.slug}`,
        "x-default": `${baseUrl}/use-cases/${page.slug}`,
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

export default async function UseCaseLandingPage({ params }: Props) {
  const { locale, slug } = await params;
  const page = getUseCaseLandingPage(slug);
  if (!page) notFound();

  const template = getSceneTemplateById(page.templateId);
  if (!template) notFound();

  const isZh = locale.toLowerCase().startsWith("zh");
  const title = isZh ? page.zhTitle : page.title;
  const description = isZh ? page.zhDescription : page.description;
  const searchIntent = isZh ? page.zhSearchIntent : page.searchIntent;
  const painPoints = isZh ? page.zhPainPoints : page.painPoints;
  const workflow = isZh ? page.zhWorkflow : page.workflow;
  const proofPoints = isZh ? page.zhProofPoints : page.proofPoints;
  const prompt = isZh ? page.zhPrompt : page.prompt;
  const baseUrl = process.env.NEXT_PUBLIC_WEB_URL || "https://genforms.ai";
  const canonicalUrl =
    locale === "en"
      ? `${baseUrl}/use-cases/${page.slug}`
      : `${baseUrl}/${locale}/use-cases/${page.slug}`;
  const relatedPages = page.relatedSlugs
    .map((relatedSlug) => getUseCaseLandingPage(relatedSlug))
    .filter(Boolean);
  const relatedSolutions = solutionLandingPages
    .filter((s) => s.templateId === page.templateId)
    .slice(0, 3);
  const [publishedPosts, contentCluster] = await Promise.all([
    getPostsByLocale(locale, 1, 20),
    Promise.resolve(getGrowthContentCluster(page.slug)),
  ]);
  const relatedPosts = getPublishedClusterPosts(page.slug, publishedPosts);
  const topicIdeas = contentCluster?.topicIdeas || [];
  const faqItems = [
    {
      question: isZh
        ? `${title} 适合从模板开始吗？`
        : `Can I start ${title} from a template?`,
      answer: isZh
        ? `可以。建议先使用 ${template.name} 模板作为起点，再用 AI 根据你的具体场景调整字段、文案和填写流程。`
        : `Yes. Start from the ${template.nameEn || template.name} template, then use AI to adapt the fields, copy, and flow to your exact workflow.`,
    },
    {
      question: isZh
        ? "表单提交可以接入 Webhook 或团队流程吗？"
        : "Can submissions connect to a webhook or team workflow?",
      answer: isZh
        ? "可以。发布后的表单可以用于公开收集，并把提交数据推送到 Webhook；团队也可以在控制台查看提交、推送状态和日志。"
        : "Yes. Published forms can collect public submissions and send response data to a webhook, while your team reviews submissions, delivery status, and logs from the console.",
    },
    {
      question: isZh
        ? "发布前应该检查哪些内容？"
        : "What should I review before publishing?",
      answer: isZh
        ? "重点检查字段是否足够短、问题是否符合用户意图、视觉主题是否可信，以及提交后的数据流向是否清晰。"
        : "Review whether the fields stay short, the questions match the visitor intent, the theme feels trustworthy, and the post-submission data handoff is clear.",
    },
  ];

  return (
    <main className="min-h-screen bg-white text-slate-950">
      <LandingPageTracker
        slug={page.slug}
        templateId={template.id}
        entryPoint="use_case_landing"
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
          offers: {
            "@type": "Offer",
            price: "0",
            priceCurrency: "USD",
          },
        }}
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: faqItems.map((item) => ({
            "@type": "Question",
            name: item.question,
            acceptedAnswer: {
              "@type": "Answer",
              text: item.answer,
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
              name: isZh ? "使用场景" : "Use Cases",
              item:
                locale === "en"
                  ? `${baseUrl}/use-cases`
                  : `${baseUrl}/${locale}/use-cases`,
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
                source={`usecase_${page.slug}`}
                trackingMetadata={{
                  landing_slug: page.slug,
                  entry_point: "use_case_landing",
                  source: `usecase_${page.slug}`,
                }}
              />
              <Link
                href={localizedPath(locale, `/templates/${template.id}?source=usecase_${page.slug}`)}
                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/15 px-8 py-4 text-sm font-black text-white transition hover:bg-white/10"
              >
                {isZh ? "查看模板详情" : "View template details"}
                <ExternalLink className="h-4 w-4" />
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
          <Metric icon={Sparkles} label={isZh ? "AI 起点" : "AI prompt"} value={prompt} />
          <Metric
            icon={Webhook}
            label={isZh ? "推荐模板" : "Starter template"}
            value={isZh ? template.name : template.nameEn || template.name}
          />
        </div>
      </section>

      <section className="container grid gap-10 py-10 md:py-16 lg:grid-cols-[0.9fr_1.1fr]">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.22em] text-blue-600">
            {isZh ? "为什么需要这个入口" : "Why this page exists"}
          </p>
          <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-950">
            {isZh ? "用户搜的不是产品名，而是具体问题" : "Users search for a problem, not a product name"}
          </h2>
          <p className="mt-4 text-sm font-medium leading-7 text-slate-600">
            {isZh
              ? "这个页面把 GenForms.ai 的同一套生成、发布和集成能力，聚焦到一个可被搜索和验证的垂直场景。"
              : "This page focuses the same GenForms.ai generation, publishing, and integration engine into one search-ready vertical workflow."}
          </p>
        </div>

        <div className="grid gap-3">
          {painPoints.map((point) => (
            <div
              key={point}
              className="flex gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
            >
              <CheckCircle2 className="mt-0.5 h-5 w-5 flex-none text-emerald-600" />
              <p className="text-sm font-bold leading-6 text-slate-700">{point}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-slate-950 text-white">
        <div className="container py-10 md:py-16">
          <div className="flex items-end justify-between gap-6">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.22em] text-blue-300">
                {isZh ? "工作流" : "Workflow"}
              </p>
              <h2 className="mt-3 text-3xl font-black tracking-tight">
                {isZh ? "从入口页到真实发布" : "From landing page to live form"}
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
        <div className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.22em] text-blue-600">
              {isZh ? "可验证卖点" : "What makes it useful"}
            </p>
            <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-950">
              {isZh ? "不是静态营销页，是可进入产品的场景入口" : "Not a static page, but a path into the product"}
            </h2>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {proofPoints.map((point) => (
              <div key={point} className="rounded-2xl bg-slate-100 p-5">
                <CheckCircle2 className="h-5 w-5 text-blue-600" />
                <p className="mt-3 text-sm font-black leading-6 text-slate-800">{point}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-slate-200 bg-slate-50">
        <div className="container py-10 md:py-16">
          <div className="max-w-2xl">
            <p className="text-xs font-black uppercase tracking-[0.22em] text-blue-600">
              {isZh ? "常见问题" : "FAQ"}
            </p>
            <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-950">
              {isZh ? "发布前常见的三个判断" : "Three checks before you publish"}
            </h2>
          </div>

          <div className="mt-7 grid gap-4 md:grid-cols-3">
            {faqItems.map((item) => (
              <div
                key={item.question}
                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
              >
                <h3 className="text-base font-black leading-6 text-slate-950">
                  {item.question}
                </h3>
                <p className="mt-3 text-sm font-medium leading-7 text-slate-600">
                  {item.answer}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {(relatedPosts.length > 0 || topicIdeas.length > 0) && (
        <section className="border-t border-slate-200 bg-white">
          <div className="container py-10 md:py-16">
            <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.22em] text-blue-600">
                  {isZh ? "延伸阅读" : "Related guides"}
                </p>
                <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-950">
                  {isZh ? "先理解问题，再进入创建流程" : "Understand the workflow, then build it"}
                </h2>
              </div>
              <Link
                href={localizedPath(locale, "/posts")}
                className="inline-flex items-center gap-2 text-sm font-black text-blue-600 hover:text-blue-500"
              >
                {isZh ? "查看全部资源" : "View all resources"}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="mt-7 grid gap-3 md:grid-cols-3">
              {relatedPosts.map((post) => (
                <Link
                  key={post.uuid || post.slug}
                  href={localizedPath(locale, `/posts/${post.slug}`)}
                  className="rounded-2xl border border-slate-200 bg-slate-50 p-5 transition hover:-translate-y-0.5 hover:border-blue-200 hover:bg-white hover:shadow-md"
                >
                  <p className="text-[11px] font-black uppercase tracking-[0.18em] text-blue-600">
                    {isZh ? "已发布指南" : "Published guide"}
                  </p>
                  <h3 className="mt-2 text-base font-black leading-6 text-slate-950">
                    {post.title}
                  </h3>
                  {post.description && (
                    <p className="mt-3 line-clamp-3 text-xs font-bold leading-5 text-slate-500">
                      {post.description}
                    </p>
                  )}
                </Link>
              ))}

              {topicIdeas.slice(0, Math.max(0, 3 - relatedPosts.length)).map((topic) => (
                <div
                  key={topic.title}
                  className="rounded-2xl border border-dashed border-slate-300 bg-white p-5"
                >
                  <p className="text-[11px] font-black uppercase tracking-[0.18em] text-slate-400">
                    {isZh ? "内容计划" : "Content plan"}
                  </p>
                  <h3 className="mt-2 text-base font-black leading-6 text-slate-950">
                    {isZh ? topic.zhTitle : topic.title}
                  </h3>
                  <p className="mt-3 text-xs font-bold leading-5 text-slate-500">
                    {isZh ? topic.zhIntent : topic.intent}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {relatedSolutions.length > 0 && (
        <section className="border-t border-slate-200 bg-white">
          <div className="container py-8 md:py-12">
            <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.22em] text-blue-600">
                  {isZh ? "场景方案指南" : "Solution guides"}
                </p>
                <h2 className="mt-2 text-2xl font-black tracking-tight text-slate-950">
                  {isZh ? "了解更完整的使用流程" : "See the full workflow for this template"}
                </h2>
              </div>
              <Link
                href={localizedPath(locale, "/solutions")}
                className="inline-flex items-center gap-2 text-sm font-black text-blue-600 hover:text-blue-500"
              >
                {isZh ? "查看全部方案" : "View all solutions"}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="mt-6 grid gap-3 md:grid-cols-3">
              {relatedSolutions.map((solution) => (
                <Link
                  key={solution.slug}
                  href={localizedPath(locale, `/solutions/${solution.slug}`)}
                  className="rounded-2xl border border-slate-200 bg-slate-50 p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-blue-200 hover:bg-white hover:shadow-md"
                >
                  <p className="text-[11px] font-black uppercase tracking-[0.18em] text-blue-600">
                    {isZh ? solution.zhEyebrow : solution.eyebrow}
                  </p>
                  <h3 className="mt-2 text-base font-black text-slate-950">
                    {isZh ? solution.zhTitle : solution.title}
                  </h3>
                  <p className="mt-2 line-clamp-2 text-xs font-medium leading-5 text-slate-500">
                    {isZh ? solution.zhDescription : solution.description}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="border-t border-slate-200 bg-slate-50">
        <div className="container py-8 md:py-12">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.22em] text-slate-500">
                {isZh ? "相关入口" : "Related use cases"}
              </p>
              <h2 className="mt-2 text-2xl font-black tracking-tight text-slate-950">
                {isZh ? "继续比较其他表单场景" : "Compare another form workflow"}
              </h2>
            </div>
            <Link
              href={localizedPath(locale, "/use-cases")}
              className="inline-flex items-center gap-2 text-sm font-black text-blue-600 hover:text-blue-500"
            >
              {isZh ? "查看全部入口" : "View all use cases"}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="mt-6 grid gap-3 md:grid-cols-3">
            {relatedPages.map((related) => (
              <Link
                key={related!.slug}
                href={localizedPath(locale, `/use-cases/${related!.slug}`)}
                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-md"
              >
                <p className="text-[11px] font-black uppercase tracking-[0.18em] text-blue-600">
                  {isZh ? related!.zhEyebrow : related!.eyebrow}
                </p>
                <h3 className="mt-2 text-base font-black text-slate-950">
                  {isZh ? related!.zhTitle : related!.title}
                </h3>
              </Link>
            ))}
          </div>
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
