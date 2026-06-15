import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";

import { TemplateVisualPreview } from "@/components/blocks/template-starter";
import { getSolutionLandingPagesWithTemplates } from "@/services/solution-landing-pages";
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
    locale === "en" ? `${baseUrl}/solutions` : `${baseUrl}/${locale}/solutions`;
  const title = isZh
    ? "AI 表单行业解决方案"
    : "AI Form Builder Solutions by Industry";
  const description = isZh
    ? "面向 SaaS、活动、法律咨询、诊所预约、房产线索和课程报名的 AI 表单解决方案。每个页面都可以直接进入模板和创建流程。"
    : "Explore AI form builder solutions for SaaS lead capture, events, law firm intake, clinic appointments, real estate inquiries, and course registration.";

  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
      languages: {
        en: `${baseUrl}/solutions`,
        zh: `${baseUrl}/zh/solutions`,
        "x-default": `${baseUrl}/solutions`,
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

export default async function SolutionsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const isZh = locale.toLowerCase().startsWith("zh");
  const pages = getSolutionLandingPagesWithTemplates();
  const baseUrl = process.env.NEXT_PUBLIC_WEB_URL || "https://genforms.ai";
  const canonicalUrl =
    locale === "en" ? `${baseUrl}/solutions` : `${baseUrl}/${locale}/solutions`;
  const itemList = pages.map((page, index) => ({
    "@type": "ListItem",
    position: index + 1,
    name: isZh ? page.zhTitle : page.title,
    url:
      locale === "en"
        ? `${baseUrl}/solutions/${page.slug}`
        : `${baseUrl}/${locale}/solutions/${page.slug}`,
  }));

  return (
    <main className="min-h-screen bg-white text-slate-950">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: isZh ? "AI 表单行业解决方案" : "AI Form Builder Solutions by Industry",
          description: isZh
            ? "面向 SaaS、活动、法律咨询、诊所预约、房产线索和课程报名的 AI 表单解决方案。每个页面都可以直接进入模板和创建流程。"
            : "Explore AI form builder solutions for SaaS lead capture, events, law firm intake, clinic appointments, real estate inquiries, and course registration.",
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
            {isZh ? "行业解决方案" : "Industry Solutions"}
          </p>
          <h1 className="mt-4 max-w-4xl text-4xl font-black tracking-tight md:text-6xl">
            {isZh
              ? "从行业长尾词进入 AI 表单创作"
              : "Turn industry search intent into AI form creation"}
          </h1>
          <p className="mt-5 max-w-2xl text-base font-medium leading-8 text-slate-300 md:text-lg">
            {isZh
              ? "这些页面面向具体行业和业务场景，帮助搜索用户快速理解字段设计、发布流程和可用模板。"
              : "These pages map specific industries and workflows to field design, publishing steps, and usable starter templates."}
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
                <Link href={localizePath(locale, `/solutions/${page.slug}`)} className="block">
                  <TemplateVisualPreview
                    template={template}
                    activeTheme={template.theme === "dark" ? "dark" : "business"}
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
                    {(isZh ? page.zhRecommendedFields : page.recommendedFields)
                      .slice(0, 3)
                      .map((field) => (
                        <span
                          key={field}
                          className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-700"
                        >
                          <CheckCircle2 className="h-3 w-3 text-emerald-600" />
                          {field}
                        </span>
                      ))}
                  </div>
                  <Link
                    href={localizePath(locale, `/solutions/${page.slug}`)}
                    className="mt-6 inline-flex items-center gap-2 text-sm font-black text-blue-600 hover:text-blue-500"
                  >
                    {isZh ? "查看解决方案" : "View solution"}
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
