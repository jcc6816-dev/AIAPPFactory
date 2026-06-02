import type { MetadataRoute } from "next";

import { sceneTemplates } from "@/services/form-templates";

const baseUrl = process.env.NEXT_PUBLIC_WEB_URL || "https://genforms.ai";
const contentLastModified = new Date(
  process.env.NEXT_PUBLIC_CONTENT_UPDATED_AT || "2026-06-02"
);

function localizedPath(locale: "en" | "zh", path: string) {
  return locale === "en" ? `${baseUrl}${path}` : `${baseUrl}/${locale}${path}`;
}

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPaths = ["/", "/templates", "/skills-catalog"];
  const templatePaths = sceneTemplates.map(
    (template) => `/templates/${template.id}`
  );
  
  const skills = [
    "deduplication",
    "table_ocr",
    "ai_pre_audit",
    "report_export",
    "email_notification",
    "data_cleaning",
    "ai_insights",
  ];
  const skillPaths = skills.map((skillId) => `/skills-catalog/${skillId}`);

  return [...staticPaths, ...templatePaths, ...skillPaths].flatMap((path) => [
    {
      url: localizedPath("en", path),
      lastModified: contentLastModified,
      changeFrequency: path === "/" ? "weekly" : "monthly",
      priority: path === "/" ? 1 : path.startsWith("/skills-catalog") ? 0.85 : 0.75,
    },
    {
      url: localizedPath("zh", path),
      lastModified: contentLastModified,
      changeFrequency: path === "/" ? "weekly" : "monthly",
      priority: path === "/" ? 0.9 : path.startsWith("/skills-catalog") ? 0.8 : 0.7,
    },
  ]);
}
