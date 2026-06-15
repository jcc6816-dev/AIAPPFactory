import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";

import { TemplateVisualPreview } from "@/components/blocks/template-starter";
import { getUseCaseLandingPagesWithTemplates } from "@/services/use-case-landing-pages";
import { localizePath } from "@/lib/localized-path";
import JsonLd from "@/components/seo/json-ld";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const isZh = locale.toLowerCase().startsWith("zh");
  const baseUrl = process.env.NEXT_PUBLIC_WEB_URL || "https://genforms.ai";
  const canonicalUrl =
    locale === "en" ? `${baseUrl}/use-cases` : `${baseUrl}/${locale}/use-cases`;
  const title = isZh
    ? "AI 表单使用场景与工作流"
    : "AI Form Builder Use Cases and Workflows";
  const description = isZh
    ? "探索 GenForms 在不同业务场景中的数据收集方案，包含类 Typeform 单题流、智能 Webhook 表单、线索收集等应用实践。"
    : "Explore AI form builder use cases for Typeform-like flows, webhook forms, lead capture, feedback, notifications, and publishable data collection workflows.";

  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
      languages: {
        en: `${baseUrl}/use-cases`,
        zh: `${baseUrl}/zh/use-cases`,
        "x-default": `${baseUrl}/use-cases`,
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

export default async function UseCasesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const isZh = locale.toLowerCase().startsWith("zh");
  const pages = getUseCaseLandingPagesWithTemplates();
  const baseUrl = process.env.NEXT_PUBLIC_WEB_URL || "https://genforms.ai";
  const canonicalUrl =
    locale === "en" ? `${baseUrl}/use-cases` : `${baseUrl}/${locale}/use-cases`;
  const itemList = pages.map((page, index) => ({
    "@type": "ListItem",
    position: index + 1,
    name: isZh ? page.zhTitle : page.title,
    url:
      locale === "en"
        ? `${baseUrl}/use-cases/${page.slug}`
        : `${baseUrl}/${locale}/use-cases/${page.slug}`,
  }));

  return (
    <main className="min-h-screen bg-white text-slate-950">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: isZh ? "AI 表单使用场景与工作流" : "AI Form Builder Use Cases and Workflows",
          description: isZh
            ? "探索 GenForms 在不同业务场景中的数据收集方案，包含类 Typeform 单题流、智能 Webhook 表单、线索收集等应用实践。"
            : "Explore AI form builder use cases for Typeform-like flows, webhook forms, lead capture, feedback, notifications, and publishable data collection workflows.",
          url: canonicalUrl,
          inLanguage: isZh ? "zh-CN" : "en",
          mainEntity: {
            "@type": "ItemList",
            itemListElement: itemList,
          },
        }}
      />
      <section className="border-b border-slate-200 bg-slate-950 text-white">
        <div className="container py-16 md:py-20">
          <p className="text-xs font-black uppercase tracking-[0.28em] text-blue-300">
            {isZh ? "场景入口" : "Use Case Entry Points"}
          </p>
          <h1 className="mt-4 max-w-4xl text-4xl font-black tracking-tight md:text-6xl">
            {isZh
              ? "从具体场景进入同一个 AI 表单创作流程"
              : "Start from a specific use case, then enter the same AI form workflow"}
          </h1>
          <p className="mt-5 max-w-2xl text-base font-medium leading-8 text-slate-300 md:text-lg">
            {isZh
              ? "每个入口页都对应一个真实搜索意图、一个可用模板和同一条创建、发布、提交、分享与 Webhook 闭环。"
              : "Each page maps to a real search intent, a usable template, and the same creation, publishing, submission, sharing, and webhook loop."}
          </p>
        </div>
      </section>

      <section className="container py-12 md:py-16">
        <div className="grid gap-6 md:grid-cols-2">
          {pages.map(({ template, ...page }) => {
            if (!template) return null;
            return (
              <article
                key={page.slug}
                className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
              >
                <Link href={localizePath(locale, `/use-cases/${page.slug}`)} className="block">
                  <TemplateVisualPreview
                    template={template}
                    activeTheme={template.theme === "business" ? "business" : "minimal"}
                    locale={locale}
                  />
                </Link>
                <div className="p-6">
                  <p className="text-[11px] font-black uppercase tracking-[0.2em] text-blue-600">
                    {isZh ? page.zhEyebrow : page.eyebrow}
                  </p>
                  <h2 className="mt-3 text-2xl font-black tracking-tight text-slate-950">
                    {isZh ? page.zhTitle : page.title}
                  </h2>
                  <p className="mt-3 text-sm font-medium leading-6 text-slate-600">
                    {isZh ? page.zhDescription : page.description}
                  </p>
                  <div className="mt-5 flex flex-wrap gap-2">
                    {(isZh ? page.zhProofPoints : page.proofPoints)
                      .slice(0, 3)
                      .map((point) => (
                        <span
                          key={point}
                          className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-700"
                        >
                          <CheckCircle2 className="h-3 w-3 text-emerald-600" />
                          {point}
                        </span>
                      ))}
                  </div>
                  <Link
                    href={localizePath(locale, `/use-cases/${page.slug}`)}
                    className="mt-6 inline-flex items-center gap-2 text-sm font-black text-blue-600 hover:text-blue-500"
                  >
                    {isZh ? "查看场景方案" : "View use case"}
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      </section>
    </main>
  );
}
