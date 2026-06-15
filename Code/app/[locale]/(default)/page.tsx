import CTA from "@/components/blocks/cta";
import FAQ from "@/components/blocks/faq";
import Hero from "@/components/blocks/hero";
import Blog from "@/components/blocks/blog";
import LandingPageTracker from "@/components/analytics/landing-page-tracker";
import { Blog as BlogType } from "@/types/blocks/blog";
import { getPostsByLocale } from "@/models/post";
import { getLandingPage } from "@/services/page";
import { getTranslations } from "next-intl/server";
import Link from "next/link";
import { ArrowRight, Bot, Database, LineChart, Rocket } from "lucide-react";
import JsonLd from "@/components/seo/json-ld";
import { useCaseLandingPages } from "@/services/use-case-landing-pages";
import { solutionLandingPages } from "@/services/solution-landing-pages";
import { localizePath } from "@/lib/localized-path";
import dynamic from "next/dynamic";

const Pricing = dynamic(() => import("@/components/blocks/pricing"), {
  ssr: true,
  loading: () => <div className="mx-auto max-w-6xl h-96 w-full animate-pulse rounded-2xl bg-slate-100" />,
});

const TemplateStarter = dynamic(() => import("@/components/blocks/template-starter"), {
  ssr: true,
  loading: () => <div className="mx-auto max-w-6xl h-[600px] w-full animate-pulse rounded-3xl bg-slate-100" />,
});

const SkillsGallery = dynamic(() => import("@/components/blocks/skills-gallery"), {
  ssr: true,
  loading: () => <div className="mx-auto max-w-6xl h-96 w-full animate-pulse rounded-[2rem] bg-slate-900" />,
});

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const isZh = locale.toLowerCase().startsWith("zh");
  const baseUrl = process.env.NEXT_PUBLIC_WEB_URL || "https://genforms.ai";
  let canonicalUrl = baseUrl;

  if (locale !== "en") {
    canonicalUrl = `${baseUrl}/${locale}`;
  }

  const title = isZh 
    ? "AI 表单生成器与数据收集平台" 
    : "AI Form Generator & Typeform Alternative";

  const description = isZh
    ? "用一句话或模板创建 AI 表单、单题流页面、OCR 自动填充和 Webhook 数据推送。"
    : "Create AI-generated forms, Typeform-style flows, OCR autofill, and webhook integrations for teams collecting data online.";

  const keywords = isZh
    ? "AI表单生成, 类Typeform表单, 数据收集, 智能表单模板, OCR自动填充, 飞书Webhook表单, 钉钉机器人集成, 低代码表单"
    : "AI Form Generator, Typeform Alternative, Data Collection Platform, Immersive Form Templates, OCR Form Autofill, Webhook Integration, Feishu DingTalk Slack Form";

  const ogImage = `${baseUrl}/og-image.png`;

  return {
    title,
    description,
    keywords,
    metadataBase: new URL(baseUrl),
    alternates: {
      canonical: canonicalUrl,
      languages: {
        en: baseUrl,
        zh: `${baseUrl}/zh`,
        "x-default": baseUrl,
      },
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: "GenForms.ai",
      type: "website",
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: "GenForms.ai - AI Form Generation & Immersive Data Collection",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
  };
}

export default async function LandingPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const [page, latestPosts, blogT] = await Promise.all([
    getLandingPage(locale),
    getPostsByLocale(locale, 1, 3),
    getTranslations({ locale, namespace: "blog" }),
  ]);
  const isZh = locale.toLowerCase().startsWith("zh");
  const baseUrl = process.env.NEXT_PUBLIC_WEB_URL || "https://genforms.ai";
  const structuredDataDescription = isZh
    ? "通过 AI 和模板生成可发布的数据收集表单、单题流填写页与 Webhook 集成。"
    : "Generate publishable data-collection forms, Typeform-like flows, and Webhook integrations with AI and templates.";
  const blog: BlogType | null = latestPosts.length
    ? {
        label: isZh ? "资源中心" : "Resources",
        title: blogT("title"),
        description: blogT("description"),
        read_more_text: blogT("read_more_text"),
        items: latestPosts,
      }
    : null;

  return (
    <>
      <LandingPageTracker
        slug={isZh ? "homepage-zh" : "homepage"}
        templateId="homepage"
        entryPoint="homepage"
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          name: "GenForms.ai",
          url: baseUrl,
          applicationCategory: "BusinessApplication",
          operatingSystem: "Web",
          description: structuredDataDescription,
          featureList: isZh
            ? [
                "AI 一句话生成表单",
                "类 Typeform 单题流体验",
                "模板库与用例落地页",
                "Webhook 推送与日志",
                "表单提交数据面板",
              ]
            : [
                "AI prompt-to-form generation",
                "Typeform-like single-question flow",
                "Template and use-case landing pages",
                "Webhook delivery and logs",
                "Submission data dashboard",
              ],
          offers: {
            "@type": "AggregateOffer",
            priceCurrency: "USD",
            lowPrice: "0",
            highPrice: "19",
            offerCount: "2",
            offers: [
              {
                "@type": "Offer",
                name: "Free",
                price: "0",
                priceCurrency: "USD",
                availability: "https://schema.org/InStock",
              },
              {
                "@type": "Offer",
                name: "Pro",
                price: "19",
                priceCurrency: "USD",
                availability: "https://schema.org/InStock",
              },
            ],
          },
          creator: {
            "@type": "Organization",
            name: "GenForms.ai",
            url: baseUrl,
          },
          potentialAction: {
            "@type": "CreateAction",
            name: isZh ? "创建 AI 表单" : "Create an AI form",
            target: `${baseUrl}/forms/new`,
          },
        }}
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Organization",
          name: "GenForms.ai",
          url: baseUrl,
          logo: `${baseUrl}/logo.png`,
          sameAs: ["https://genforms.ai"],
        }}
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: "GenForms.ai",
          url: baseUrl,
          description: structuredDataDescription,
          inLanguage: isZh ? "zh-CN" : "en",
          potentialAction: {
            "@type": "SearchAction",
            target: `${baseUrl}/templates?q={search_term_string}`,
            "query-input": "required name=search_term_string",
          },
        }}
      />
      {page.hero && <Hero hero={page.hero} />}
      <CorePathSection isZh={isZh} />
      <TemplateStarter locale={locale} />
      <UseCaseEntrySection locale={locale} isZh={isZh} />
      <SolutionEntrySection locale={locale} isZh={isZh} />
      
      <SkillsGallery locale={locale} />
      {blog && <Blog blog={blog} />}
      
      {/* 隐藏冗长板块以符合 Typeform 极简空气感 */}
      {/* {page.branding && <Branding section={page.branding} />} */}
      {/* {page.introduce && <Feature1 section={page.introduce} />} */}
      {/* {page.benefit && <Feature2 section={page.benefit} />} */}
      {/* {page.usage && <Feature3 section={page.usage} />} */}
      {/* {page.feature && <Feature section={page.feature} />} */}
      {/* {page.showcase && <Showcase section={page.showcase} />} */}
      {/* {page.stats && <Stats section={page.stats} />} */}
      
      {page.pricing && <Pricing pricing={page.pricing} />}
      {/* {page.testimonial && <Testimonial section={page.testimonial} />} */}
      {page.faq && <FAQ section={page.faq} />}
      {page.cta && <CTA section={page.cta} />}
    </>
  );
}

function UseCaseEntrySection({
  locale,
  isZh,
}: {
  locale: string;
  isZh: boolean;
}) {
  return (
    <section className="border-y border-slate-200 bg-white py-14">
      <div className="container">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div className="max-w-2xl">
            <p className="text-xs font-black uppercase tracking-[0.22em] text-blue-600">
              {isZh ? "场景入口" : "Use Case Landing Pages"}
            </p>
            <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-950 md:text-4xl">
              {isZh ? "从用户正在搜索的问题进入产品" : "Turn search intent into product activation"}
            </h2>
            <p className="mt-4 text-sm font-medium leading-7 text-slate-600">
              {isZh
                ? "这些入口页不是泛泛介绍产品，而是把同一套 AI 表单能力聚焦到 Webhook、通知、Google Forms 替代、二维码、线索和活动报名等具体场景。"
                : "These pages focus the same AI form engine on concrete workflows like webhooks, notifications, Google Forms alternatives, QR code forms, lead capture, and event registration."}
            </p>
          </div>
          <Link
            href={localizePath(locale, "/use-cases")}
            className="inline-flex items-center gap-2 text-sm font-black text-blue-600 hover:text-blue-500"
          >
            {isZh ? "查看全部场景" : "View all use cases"}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="mt-8 grid gap-3 md:grid-cols-4">
          {useCaseLandingPages.map((page) => (
            <Link
              key={page.slug}
              href={localizePath(locale, `/use-cases/${page.slug}`)}
              className="rounded-2xl border border-slate-200 bg-slate-50 p-5 transition hover:-translate-y-0.5 hover:border-blue-200 hover:bg-white hover:shadow-md"
            >
              <p className="text-[10px] font-black uppercase tracking-[0.18em] text-blue-600">
                {isZh ? page.zhEyebrow : page.eyebrow}
              </p>
              <h3 className="mt-3 text-base font-black leading-6 text-slate-950">
                {isZh ? page.zhTitle : page.title}
              </h3>
              <p className="mt-3 text-xs font-bold leading-5 text-slate-500">
                {isZh ? page.zhCta : page.cta}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

function SolutionEntrySection({
  locale,
  isZh,
}: {
  locale: string;
  isZh: boolean;
}) {
  return (
    <section className="border-b border-slate-200 bg-slate-50 py-14">
      <div className="container">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div className="max-w-2xl">
            <p className="text-xs font-black uppercase tracking-[0.22em] text-emerald-600">
              {isZh ? "行业长尾入口" : "Industry Solution Pages"}
            </p>
            <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-950 md:text-4xl">
              {isZh ? "把模板能力映射到更具体的行业搜索" : "Map form templates to industry search intent"}
            </h2>
            <p className="mt-4 text-sm font-medium leading-7 text-slate-600">
              {isZh
                ? "针对 SaaS、活动、法律咨询、诊所预约、房产线索和课程报名等高意图场景，提供可直接进入创建流程的解决方案页。"
                : "For high-intent searches like SaaS lead capture, event QR signup, law firm intake, clinic appointments, real estate inquiries, and course registration."}
            </p>
          </div>
          <Link
            href={localizePath(locale, "/solutions")}
            className="inline-flex items-center gap-2 text-sm font-black text-emerald-700 hover:text-emerald-600"
          >
            {isZh ? "查看全部行业方案" : "View all solutions"}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="mt-8 grid gap-3 md:grid-cols-3">
          {solutionLandingPages.slice(0, 6).map((page) => (
            <Link
              key={page.slug}
              href={localizePath(locale, `/solutions/${page.slug}`)}
              className="rounded-2xl border border-slate-200 bg-white p-5 transition hover:-translate-y-0.5 hover:border-emerald-200 hover:shadow-md"
            >
              <p className="text-[10px] font-black uppercase tracking-[0.18em] text-emerald-600">
                {isZh ? page.zhEyebrow : page.eyebrow}
              </p>
              <h3 className="mt-3 text-base font-black leading-6 text-slate-950">
                {isZh ? page.zhTitle : page.title}
              </h3>
              <p className="mt-3 text-xs font-bold leading-5 text-slate-500">
                {isZh ? page.zhCta : page.cta}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

function CorePathSection({ isZh }: { isZh: boolean }) {
  const pillars = isZh
    ? [
        {
          icon: Bot,
          title: "生成表单",
          desc: "从一句话或模板开始，自动生成字段、文案、主题与单题流体验。",
        },
        {
          icon: Database,
          title: "采集数据",
          desc: "发布公开填写页，支持移动端优先、文件上传与 OCR 自动填充。",
        },
        {
          icon: LineChart,
          title: "运行分析",
          desc: "沉淀提交记录、运行状态、基础指标和页面 Agent 的数据解释。",
        },
        {
          icon: Rocket,
          title: "发布集成",
          desc: "通过链接、二维码和 Webhook 把结果推送到业务系统。",
        },
      ]
    : [
        {
          icon: Bot,
          title: "Generate",
          desc: "Start from a prompt or template, then shape fields, copy, theme, and flow.",
        },
        {
          icon: Database,
          title: "Collect",
          desc: "Publish mobile-first filling pages with uploads and OCR-assisted autofill.",
        },
        {
          icon: LineChart,
          title: "Operate",
          desc: "Review submissions, runtime status, core metrics, and page Agent summaries.",
        },
        {
          icon: Rocket,
          title: "Publish",
          desc: "Share links, QR codes, and Webhooks that move data into downstream systems.",
        },
      ];

  return (
    <section className="border-y border-slate-900 bg-slate-950 px-6 py-14 text-white">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <p className="text-[11px] font-black uppercase tracking-[0.22em] text-blue-400">
              {isZh ? "核心创作闭环" : "Core Creation Loop"}
            </p>
            <h2 className="mt-3 text-2xl font-black tracking-tight md:text-3xl">
              {isZh ? "GenForms.ai 的四条主线" : "The four product lines of GenForms.ai"}
            </h2>
          </div>
          <p className="max-w-xl text-sm font-medium leading-6 text-slate-400">
            {isZh
              ? "先把 AI 表单生成、填写、数据和集成做成可发布闭环，再逐步扩展更深的 Agent 与工作流能力。"
              : "Turn form generation, filling, data review, and integrations into a publishable loop before expanding into deeper Agent and workflow capabilities."}
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {pillars.map((pillar, index) => {
            const Icon = pillar.icon;
            return (
              <div
                key={pillar.title}
                className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 shadow-sm"
              >
                <div className="mb-5 flex items-center justify-between">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10 text-blue-300">
                    <Icon className="h-5 w-5" />
                  </span>
                  <span className="font-mono text-xs font-bold text-slate-600">
                    0{index + 1}
                  </span>
                </div>
                <h3 className="text-base font-black">{pillar.title}</h3>
                <p className="mt-3 text-sm font-medium leading-6 text-slate-400">
                  {pillar.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
