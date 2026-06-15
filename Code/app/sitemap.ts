import type { MetadataRoute } from "next";

import { getPostsByLocale } from "@/models/post";
import { sceneTemplates } from "@/services/form-templates";
import { solutionLandingPages } from "@/services/solution-landing-pages";
import { useCaseLandingPages } from "@/services/use-case-landing-pages";

export const dynamic = "force-dynamic";

const baseUrl = process.env.NEXT_PUBLIC_WEB_URL || "https://genforms.ai";
const contentLastModified = new Date(
  process.env.NEXT_PUBLIC_CONTENT_UPDATED_AT || "2026-06-02"
);

function localizedPath(locale: "en" | "zh", path: string) {
  return locale === "en" ? `${baseUrl}${path}` : `${baseUrl}/${locale}${path}`;
}

function localizedAlternates(path: string) {
  return {
    languages: {
      en: localizedPath("en", path),
      zh: localizedPath("zh", path),
      "x-default": localizedPath("en", path),
    },
  };
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPaths = ["/", "/templates", "/skills-catalog", "/posts", "/use-cases", "/solutions"];
  const templatePaths = sceneTemplates.map(
    (template) => `/templates/${template.id}`
  );
  const useCasePaths = useCaseLandingPages.map(
    (page) => `/use-cases/${page.slug}`
  );
  const solutionPaths = solutionLandingPages.map(
    (page) => `/solutions/${page.slug}`
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

  const [enPosts, zhPosts] = await Promise.all([
    getPostsByLocale("en"),
    getPostsByLocale("zh"),
  ]);

  const productEntries = [...staticPaths, ...templatePaths, ...skillPaths, ...useCasePaths, ...solutionPaths].flatMap((path) => [
    {
      url: localizedPath("en", path),
      lastModified: contentLastModified,
      changeFrequency: path === "/" || path.startsWith("/use-cases") || path.startsWith("/solutions") ? ("weekly" as const) : ("monthly" as const),
      priority: path === "/" ? 1 : path.startsWith("/use-cases") || path.startsWith("/solutions") ? 0.88 : path.startsWith("/skills-catalog") ? 0.85 : 0.75,
      alternates: localizedAlternates(path),
    },
    {
      url: localizedPath("zh", path),
      lastModified: contentLastModified,
      changeFrequency: path === "/" || path.startsWith("/use-cases") || path.startsWith("/solutions") ? ("weekly" as const) : ("monthly" as const),
      priority: path === "/" ? 0.9 : path.startsWith("/use-cases") || path.startsWith("/solutions") ? 0.82 : path.startsWith("/skills-catalog") ? 0.8 : 0.7,
      alternates: localizedAlternates(path),
    },
  ]);

  const postEntries = [
    ...enPosts.map((post) => ({ post, locale: "en" as const })),
    ...zhPosts.map((post) => ({ post, locale: "zh" as const })),
  ]
    .filter(({ post }) => post.slug)
    .map(({ post, locale }) => {
      const path = `/posts/${post.slug}`;

      return {
        url: localizedPath(locale, path),
        lastModified: new Date(
          post.updated_at || post.created_at || contentLastModified
        ),
        changeFrequency: "monthly" as const,
        priority: 0.65,
        alternates: localizedAlternates(path),
      };
    });

  return [...productEntries, ...postEntries];
}
