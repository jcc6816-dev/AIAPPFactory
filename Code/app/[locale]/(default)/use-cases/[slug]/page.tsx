import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowDown,
  ArrowRight,
  CheckCircle2,
  Route,
  Search,
  Sparkles,
  Webhook,
} from "lucide-react";

import LandingPageTracker from "@/components/analytics/landing-page-tracker";
import { TemplateVisualPreview } from "@/components/blocks/template-starter";
import { buildBreadcrumbListJsonLd } from "@/components/seo/breadcrumb-json-ld";
import JsonLd from "@/components/seo/json-ld";
import TemplateUseButton from "@/components/templates/template-use-button";
import { getPostsByLocale } from "@/models/post";
import { getSceneTemplateById } from "@/services/form-templates";
import { getUseCaseCreationContext } from "@/services/form-creation-context";
import { getPublishedClusterPosts } from "@/services/growth-content-clusters";
import {
  getUseCaseLandingPage,
  useCaseLandingPages,
} from "@/services/use-case-landing-pages";
import { solutionLandingPages } from "@/services/solution-landing-pages";
import type { FormArtifactPreferences, FormCreationContext } from "@/types/form";

interface Props {
  params: Promise<{ locale: string; slug: string }>;
}

function localizedPath(locale: string, path: string) {
  return locale === "en" ? path : `/${locale}${path}`;
}

function buildTemplateDetailPath(
  locale: string,
  templateId: string,
  source: string,
  context: FormCreationContext,
  prompt: string
) {
  const params = new URLSearchParams({ source });

  if (context.intent) params.set("intent", context.intent);
  if (context.mode) params.set("mode", context.mode);
  if (prompt) params.set("prompt", prompt);

  return `${localizedPath(locale, `/templates/${templateId}`)}?${params.toString()}`;
}

function getUseCaseDefaultPreferences(
  slug: string
): FormArtifactPreferences | undefined {
  if (slug === "customer-feedback-form-builder") {
    return {
      theme: "sunset",
      visualDirection: "warm-feedback",
      themeVariant: "glass",
      preferredDevice: "phone",
    };
  }

  return undefined;
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
  const recommendedFields =
    isZh && page.zhRecommendedFields
      ? page.zhRecommendedFields
      : page.recommendedFields || [];
  const prompt = isZh ? page.zhPrompt : page.prompt;
  const creationContext = getUseCaseCreationContext(page.slug);
  const defaultArtifactPreferences = getUseCaseDefaultPreferences(page.slug);
  const creationSource = `usecase_${page.slug}`;
  const templateDetailPath = buildTemplateDetailPath(
    locale,
    template.id,
    creationSource,
    creationContext,
    prompt
  );
  const recommendedFieldsHeading = isZh
    ? page.zhRecommendedFieldsHeading
    : page.recommendedFieldsHeading;
  const recommendedFieldsDescription = isZh
    ? page.zhRecommendedFieldsDescription
    : page.recommendedFieldsDescription;
  const templateLinkLabel = isZh
    ? page.zhTemplateLinkLabel
    : page.templateLinkLabel;
  const ctaBadge = isZh ? page.zhCtaBadge : page.ctaBadge;
  const intentBlocks = isZh
    ? page.zhIntentBlocks || page.intentBlocks || []
    : page.intentBlocks || [];
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
  const publishedPosts = await getPostsByLocale(locale, 1, 20);
  const relatedPosts = getPublishedClusterPosts(page.slug, publishedPosts);
  const faqItems = isZh && page.zhFaqItems
    ? page.zhFaqItems
    : page.faqItems || [
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
        data={buildBreadcrumbListJsonLd([
          {
            name: isZh ? "使用场景" : "Use Cases",
            url:
              locale === "en"
                ? `${baseUrl}/use-cases`
                : `${baseUrl}/${locale}/use-cases`,
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
            <h1 className="mt-5 max-w-4xl text-balance text-3xl font-black leading-tight tracking-tight sm:text-4xl md:text-6xl">
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
                source={creationSource}
                intent={creationContext.intent}
                mode={creationContext.mode}
                prompt={prompt}
                defaultPreferences={defaultArtifactPreferences}
                badgeLabel={ctaBadge}
                trackingMetadata={{
                  landing_slug: page.slug,
                  entry_point: "use_case_landing",
                  source: creationSource,
                  intent: creationContext.intent || "",
                  mode: creationContext.mode || "",
                }}
              />
              <Link
                href={
                  recommendedFields.length > 0
                    ? "#recommended-fields"
                    : templateDetailPath
                }
                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/15 px-8 py-4 text-sm font-black text-white transition hover:bg-white/10"
              >
                {recommendedFields.length > 0
                  ? isZh
                    ? "查看推荐字段"
                    : "Preview recommended fields"
                  : isZh
                    ? "查看模板详情"
                    : "View template details"}
                <ArrowDown className="h-4 w-4" />
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
          <Metric icon={Search} label={isZh ? "适合场景" : "Best for"} value={searchIntent} />
          <Metric icon={Sparkles} label={isZh ? "AI 生成方式" : "Create with AI"} value={prompt} />
          <Metric
            icon={Webhook}
            label={isZh ? "起始模板" : "Starter template"}
            value={isZh ? template.name : template.nameEn || template.name}
          />
        </div>
      </section>

      <section className="container grid gap-10 py-10 md:py-16 lg:grid-cols-[0.9fr_1.1fr]">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.22em] text-blue-600">
            {isZh ? "为什么选择这个流程" : "Why this workflow"}
          </p>
          <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-950">
            {isZh ? "把实际需求变成可发布的表单" : "Turn a real task into a form you can publish"}
          </h2>
          <p className="mt-4 text-sm font-medium leading-7 text-slate-600">
            {isZh
              ? "从适合当前场景的模板和 AI 提示开始，调整字段后即可发布、分享并处理提交。"
              : "Start with a template and AI prompt for this workflow, refine the fields, then publish, share, and handle submissions."}
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

      {recommendedFields.length > 0 && (
        <section id="recommended-fields" className="border-b border-slate-200 bg-slate-50">
          <div className="container grid gap-8 py-10 md:py-16 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.22em] text-blue-600">
                {isZh ? "推荐字段" : "Recommended fields"}
              </p>
              <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-950">
                {recommendedFieldsHeading ||
                  (isZh ? "从必要字段开始" : "Start with the fields that matter")}
              </h2>
              <p className="mt-4 text-sm font-medium leading-7 text-slate-600">
                {recommendedFieldsDescription ||
                  (isZh
                    ? "先收集完成当前任务所需的信息，再根据真实工作流继续调整。"
                    : "Collect the information required for this task, then adapt the flow to your real workflow.")}
              </p>
              <Link
                href={templateDetailPath}
                className="mt-6 inline-flex items-center gap-2 text-sm font-black text-blue-600 hover:text-blue-500"
              >
                {templateLinkLabel || (isZh ? "查看模板" : "View template")}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {recommendedFields.map((field, index) => (
                <div
                  key={field}
                  className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
                >
                  <span className="flex h-8 w-8 flex-none items-center justify-center rounded-full bg-blue-50 text-xs font-black text-blue-700">
                    {index + 1}
                  </span>
                  <p className="text-sm font-black leading-6 text-slate-800">{field}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

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

      {intentBlocks.length > 0 && (
        <section className="border-b border-slate-200 bg-white">
          <div className="container py-10 md:py-16">
            <div className="max-w-3xl">
              <p className="text-xs font-black uppercase tracking-[0.22em] text-blue-600">
                {isZh ? "使用方式" : "How it fits"}
              </p>
              <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-950">
                {isZh ? "围绕实际工作流完成创建、分享和处理" : "Create, share, and follow up around the real workflow"}
              </h2>
            </div>

            <div className="mt-8 grid gap-4 lg:grid-cols-3">
              {intentBlocks.map((block) => (
                <div
                  key={block.title}
                  className="rounded-2xl border border-slate-200 bg-slate-50 p-5 shadow-sm"
                >
                  <h3 className="text-lg font-black leading-7 text-slate-950">
                    {block.title}
                  </h3>
                  <p className="mt-3 text-sm font-medium leading-7 text-slate-600">
                    {block.description}
                  </p>
                  <ul className="mt-4 space-y-3">
                    {block.items.map((item) => (
                      <li
                        key={item}
                        className="flex gap-2 text-sm font-bold leading-6 text-slate-700"
                      >
                        <CheckCircle2 className="mt-0.5 h-4 w-4 flex-none text-emerald-600" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="container py-10 md:py-16">
        <div className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.22em] text-blue-600">
              {isZh ? "你可以完成" : "What you can do"}
            </p>
            <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-950">
              {isZh ? "从创建到后续处理，一条路径完成" : "Create, publish, and follow up in one flow"}
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
              {page.faqItems
                ? isZh
                  ? "创建前常见问题"
                  : "Questions before you create"
                : isZh
                  ? "发布前常见的三个判断"
                  : "Three checks before you publish"}
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

      {relatedPosts.length > 0 && (
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
