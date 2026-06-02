import Branding from "@/components/blocks/branding";
import CTA from "@/components/blocks/cta";
import FAQ from "@/components/blocks/faq";
import Feature from "@/components/blocks/feature";
import Feature1 from "@/components/blocks/feature1";
import Feature2 from "@/components/blocks/feature2";
import Feature3 from "@/components/blocks/feature3";
import Hero from "@/components/blocks/hero";
import Pricing from "@/components/blocks/pricing";
import Showcase from "@/components/blocks/showcase";
import Stats from "@/components/blocks/stats";
import TemplateStarter from "@/components/blocks/template-starter";
import SkillsGallery from "@/components/blocks/skills-gallery";
import Testimonial from "@/components/blocks/testimonial";
import { getLandingPage } from "@/services/page";
import { Bot, Database, LineChart, Rocket } from "lucide-react";
import JsonLd from "@/components/seo/json-ld";

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
    ? "智能场景表单生成与高颜值数据收集平台" 
    : "Intelligent Form Generation & Immersive Data Collection Platform";

  const description = isZh
    ? "GenForms.ai 帮助团队通过一句话或推荐模板快速生成表单及类 Typeform 交互式微网页，提供物理拟真动效、5套悬浮卡片主题预览、OCR 图像智能识别以及飞书/钉钉 Webhook 自动化数据推送集成。"
    : "GenForms.ai helps teams generate responsive forms, Typeform-like flows, and data collection pages from a single prompt or template. Features premium glassmorphism themes, built-in OCR autofill, and Feishu/Slack/DingTalk webhook integrations.";

  const keywords = isZh
    ? "AI表单生成, 类Typeform表单, 数据收集, 智能表单模板, OCR发票识别, 飞书Webhook表单, 钉钉机器人集成, 低代码表单"
    : "AI Form Generator, Typeform Alternative, Data Collection Platform, Immersive Form Templates, OCR Form Autofill, Webhook Integration, Feishu DingTalk Slack Form";

  return {
    title,
    description,
    keywords,
    alternates: {
      canonical: canonicalUrl,
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

export default async function LandingPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const page = await getLandingPage(locale);
  const isZh = locale.toLowerCase().startsWith("zh");
  const baseUrl = process.env.NEXT_PUBLIC_WEB_URL || "https://genforms.ai";

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          name: "GenForms.ai",
          url: baseUrl,
          applicationCategory: "BusinessApplication",
          operatingSystem: "Web",
          description: isZh
            ? "通过 AI 和模板生成可发布的数据收集表单、单题流填写页与 Webhook 集成。"
            : "Generate publishable data-collection forms, Typeform-like flows, and Webhook integrations with AI and templates.",
          offers: {
            "@type": "Offer",
            price: "0",
            priceCurrency: "USD",
          },
        }}
      />
      {page.hero && <Hero hero={page.hero} />}
      <CorePathSection isZh={isZh} />
      <TemplateStarter locale={locale} />
      
      <SkillsGallery locale={locale} />
      
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
