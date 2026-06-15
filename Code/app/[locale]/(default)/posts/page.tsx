import Blog from "@/components/blocks/blog";
import { Blog as BlogType } from "@/types/blocks/blog";
import { getPostsByLocale } from "@/models/post";
import { getTranslations } from "next-intl/server";
import JsonLd from "@/components/seo/json-ld";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations();
  const baseUrl = process.env.NEXT_PUBLIC_WEB_URL || "https://genforms.ai";

  let canonicalUrl = `${baseUrl}/posts`;

  if (locale !== "en") {
    canonicalUrl = `${baseUrl}/${locale}/posts`;
  }

  return {
    title: t("blog.title"),
    description: t("blog.description"),
    metadataBase: new URL(baseUrl),
    alternates: {
      canonical: canonicalUrl,
      languages: {
        en: `${baseUrl}/posts`,
        zh: `${baseUrl}/zh/posts`,
        "x-default": `${baseUrl}/posts`,
      },
    },
    openGraph: {
      title: t("blog.title"),
      description: t("blog.description"),
      url: canonicalUrl,
      siteName: "GenForms.ai",
      type: "website",
      images: [
        {
          url: `${baseUrl}/og-image.png`,
          width: 1200,
          height: 630,
          alt: "GenForms.ai Resources",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: t("blog.title"),
      description: t("blog.description"),
      images: [`${baseUrl}/og-image.png`],
    },
  };
}

export default async function ({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations();

  const posts = await getPostsByLocale(locale);

  const blog: BlogType = {
    title: t("blog.title"),
    description: t("blog.description"),
    items: posts,
    read_more_text: t("blog.read_more_text"),
  };

  const baseUrl = process.env.NEXT_PUBLIC_WEB_URL || "https://genforms.ai";
  const canonicalUrl = locale === "en" ? `${baseUrl}/posts` : `${baseUrl}/${locale}/posts`;
  const itemList = posts.slice(0, 20).map((post, index) => ({
    "@type": "ListItem",
    position: index + 1,
    name: post.title,
    url:
      locale === "en"
        ? `${baseUrl}/posts/${post.slug}`
        : `${baseUrl}/${locale}/posts/${post.slug}`,
  }));

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: t("blog.title"),
          description: t("blog.description"),
          url: canonicalUrl,
          inLanguage: locale.toLowerCase().startsWith("zh") ? "zh-CN" : "en",
          mainEntity: {
            "@type": "ItemList",
            itemListElement: itemList,
          },
        }}
      />
      <Blog blog={blog} />
    </>
  );
}
