import CTA from "@/components/blocks/cta";
import FAQ from "@/components/blocks/faq";
import Hero from "@/components/blocks/hero";
import LandingPageTracker from "@/components/analytics/landing-page-tracker";
import HashAnchorScroller from "@/components/analytics/hash-anchor-scroller";
import { getLandingPage } from "@/services/page";
import { Database, Send, Sparkles } from "lucide-react";
import JsonLd from "@/components/seo/json-ld";
import dynamic from "next/dynamic";

const Pricing = dynamic(() => import("@/components/blocks/pricing"), {
  ssr: true,
  loading: () => <div className="mx-auto max-w-6xl h-96 w-full animate-pulse rounded-2xl bg-slate-100" />,
});

const TemplateStarter = dynamic(() => import("@/components/blocks/template-starter"), {
  ssr: true,
  loading: () => <div className="mx-auto max-w-6xl h-[600px] w-full animate-pulse rounded-3xl bg-slate-100" />,
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
    ? "用一句话或模板创建 AI 表单，发布单题流填写页并通过 Webhook 接收数据。"
    : "Create AI forms from prompts or templates. Publish Typeform-style flows, collect submissions, and send data with webhooks.";

  const keywords = isZh
    ? "AI表单生成, 类Typeform表单, 数据收集, 智能表单模板, Webhook表单, 表单发布"
    : "AI Form Generator, Typeform Alternative, Data Collection Platform, Form Templates, Webhook Integration";

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
  const [page] = await Promise.all([
    getLandingPage(locale),
  ]);
  const isZh = locale.toLowerCase().startsWith("zh");
  const baseUrl = process.env.NEXT_PUBLIC_WEB_URL || "https://genforms.ai";
  const structuredDataDescription = isZh
    ? "通过 AI 和模板生成可发布的数据收集表单、单题流填写页与 Webhook 集成。"
    : "Generate publishable data-collection forms, Typeform-like flows, and Webhook integrations with AI and templates.";
  return (
    <>
      <LandingPageTracker
        slug={isZh ? "homepage-zh" : "homepage"}
        templateId="homepage"
        entryPoint="homepage"
      />
      <HashAnchorScroller />
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
            highPrice: "9",
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
                price: "9",
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
          logo: `${baseUrl}/brand/genforms-mark-v2.png`,
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

function CorePathSection({ isZh }: { isZh: boolean }) {
  const pillars = isZh
    ? [
        {
          icon: Sparkles,
          title: "生成表单",
          desc: "从一句话或模板开始，生成字段与单题流填写体验。",
        },
        {
          icon: Database,
          title: "调整内容",
          desc: "生成后调整标题、字段和外观，确认填写体验。",
        },
        {
          icon: Database,
          title: "发布并分享",
          desc: "获取公开链接和二维码，先完成一次免费测试。",
        },
        {
          icon: Send,
          title: "查看第一条结果",
          desc: "确认测试结果已保存，再开始收集真实提交。",
        },
      ]
    : [
        {
          icon: Sparkles,
          title: "Generate",
          desc: "Start from a prompt or template to generate fields and a single-question filling flow.",
        },
        {
          icon: Database,
          title: "Refine",
          desc: "Adjust the title, fields, and appearance after generation.",
        },
        {
          icon: Database,
          title: "Publish and share",
          desc: "Get a public link and QR code, then complete one free test.",
        },
        {
          icon: Send,
          title: "See your first result",
          desc: "Confirm the test result is saved before collecting real submissions.",
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
              {isZh ? "从生成到第一条结果" : "From generation to your first result"}
            </h2>
          </div>
          <p className="max-w-xl text-sm font-medium leading-6 text-slate-400">
            {isZh
              ? "用一条清晰的路径完成第一次表单发布与测试。"
              : "Complete your first form publication and test in one clear path."}
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
