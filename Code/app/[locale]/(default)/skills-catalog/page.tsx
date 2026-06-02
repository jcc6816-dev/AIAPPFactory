import SkillsCatalogClient from "@/components/skills/skills-catalog-client";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const isZh = (locale || "zh").toLowerCase().startsWith("zh");
  const baseUrl = process.env.NEXT_PUBLIC_WEB_URL || "https://genforms.ai";
  const canonicalUrl = locale === "en" ? `${baseUrl}/skills-catalog` : `${baseUrl}/${locale}/skills-catalog`;
  
  const title = isZh
    ? "AI 自动化集成技能仓库 - GenForms.ai"
    : "AI Form Automation Integration Skills Catalog - GenForms.ai";
  const description = isZh
    ? "探索 GenForms.ai 强大的自动化执行技能。内置数据查重防重、表格 OCR 图片解析、AI 合规要求预审以及智能报表导出等能力。提供高交互配置仿真沙盒体验。"
    : "Explore GenForms.ai Smart Skills. Configure and try interactive guest sandboxes for Deduplication Guard, Table OCR matrix parsing, automated AI compliance audits, and advanced report exports.";

  return {
    title,
    description,
    keywords: isZh
      ? "AI表单, 技能仓库, 表格识别, 规则审计, 报表导出, 数据去重, Webhook推送"
      : "AI Form, Skills Center, Table OCR, Compliance Audit, Report Export, Deduplication, Webhook Integration",
    alternates: {
      canonical: canonicalUrl,
      languages: {
        en: `${baseUrl}/skills-catalog`,
        zh: `${baseUrl}/zh/skills-catalog`,
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

export default async function SkillsCatalogPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  return <SkillsCatalogClient locale={locale} />;
}
