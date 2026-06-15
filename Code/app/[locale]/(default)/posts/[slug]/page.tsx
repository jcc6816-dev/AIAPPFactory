import { PostStatus, findPostBySlug } from "@/models/post";

import BlogDetail from "@/components/blocks/blog-detail";
import Empty from "@/components/blocks/empty";
import JsonLd from "@/components/seo/json-ld";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getRelatedUseCasesForPost } from "@/services/growth-content-clusters";
import { localizePath } from "@/lib/localized-path";

const baseUrl = process.env.NEXT_PUBLIC_WEB_URL || "https://genforms.ai";

function articlePath(locale: string, slug: string) {
  return locale === "en"
    ? `${baseUrl}/posts/${slug}`
    : `${baseUrl}/${locale}/posts/${slug}`;
}

function absoluteUrl(url?: string) {
  if (!url) {
    return `${baseUrl}/og-image.png`;
  }

  if (url.startsWith("http://") || url.startsWith("https://")) {
    return url;
  }

  return `${baseUrl}${url.startsWith("/") ? url : `/${url}`}`;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;

  const post = await findPostBySlug(slug, locale);
  const canonicalUrl = articlePath(locale, slug);
  const isPublished = post?.status === PostStatus.Online;

  if (!post || !isPublished) {
    return {
      title: "Post not found",
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const alternateLocale = locale === "en" ? "zh" : "en";
  const alternatePost = await findPostBySlug(slug, alternateLocale);
  const alternateLanguages =
    alternatePost?.status === PostStatus.Online
      ? {
          [locale]: canonicalUrl,
          [alternateLocale]: articlePath(alternateLocale, slug),
          "x-default": locale === "en" ? canonicalUrl : articlePath("en", slug),
        }
      : {
          [locale]: canonicalUrl,
          "x-default": canonicalUrl,
        };
  const imageUrl = absoluteUrl(post.cover_url);

  return {
    title: post?.title,
    description: post?.description,
    metadataBase: new URL(baseUrl),
    alternates: {
      canonical: canonicalUrl,
      languages: alternateLanguages,
    },
    openGraph: {
      title: post.title,
      description: post.description,
      url: canonicalUrl,
      siteName: "GenForms.ai",
      type: "article",
      publishedTime: post.created_at,
      modifiedTime: post.updated_at || post.created_at,
      authors: post.author_name ? [post.author_name] : ["GenForms.ai"],
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: post.title || "GenForms.ai resource",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
      images: [imageUrl],
    },
  };
}

export default async function ({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const post = await findPostBySlug(slug, locale);

  if (!post || post.status !== PostStatus.Online) {
    return <Empty message="Post not found" />;
  }

  const articleUrl = articlePath(locale, slug);
  const imageUrl = absoluteUrl(post.cover_url);
  const isZh = locale.toLowerCase().startsWith("zh");
  const relatedUseCases = getRelatedUseCasesForPost(post);

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BlogPosting",
          headline: post.title,
          description: post.description,
          image: imageUrl,
          datePublished: post.created_at,
          dateModified: post.updated_at || post.created_at,
          author: {
            "@type": "Organization",
            name: post.author_name || "GenForms.ai",
          },
          publisher: {
            "@type": "Organization",
            name: "GenForms.ai",
            logo: {
              "@type": "ImageObject",
              url: `${baseUrl}/logo.png`,
            },
          },
          mainEntityOfPage: {
            "@type": "WebPage",
            "@id": articleUrl,
          },
        }}
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            {
              "@type": "ListItem",
              position: 1,
              name: locale === "zh" ? "首页" : "Home",
              item: locale === "en" ? baseUrl : `${baseUrl}/${locale}`,
            },
            {
              "@type": "ListItem",
              position: 2,
              name: locale === "zh" ? "资源中心" : "Resources",
              item: locale === "en" ? `${baseUrl}/posts` : `${baseUrl}/${locale}/posts`,
            },
            {
              "@type": "ListItem",
              position: 3,
              name: post.title,
              item: articleUrl,
            },
          ],
        }}
      />
      <BlogDetail post={post} />
      {relatedUseCases.length > 0 && (
        <section className="border-t border-slate-200 bg-slate-50 py-12">
          <div className="container">
            <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.22em] text-blue-600">
                  {isZh ? "相关场景入口" : "Related workflow pages"}
                </p>
                <h2 className="mt-3 text-2xl font-black tracking-tight text-slate-950 md:text-3xl">
                  {isZh ? "把这篇指南落到可发布的表单流程" : "Turn this guide into a publishable form workflow"}
                </h2>
              </div>
              <Link
                href={localizePath(locale, "/use-cases")}
                className="inline-flex items-center gap-2 text-sm font-black text-blue-600 hover:text-blue-500"
              >
                {isZh ? "查看全部场景" : "View all use cases"}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="mt-6 grid gap-3 md:grid-cols-3">
              {relatedUseCases.map((useCase) => (
                <Link
                  key={useCase.slug}
                  href={localizePath(locale, `/use-cases/${useCase.slug}`)}
                  className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-md"
                >
                  <p className="text-[11px] font-black uppercase tracking-[0.18em] text-blue-600">
                    {isZh ? useCase.zhEyebrow : useCase.eyebrow}
                  </p>
                  <h3 className="mt-2 text-base font-black leading-6 text-slate-950">
                    {isZh ? useCase.zhTitle : useCase.title}
                  </h3>
                  <p className="mt-3 text-xs font-bold leading-5 text-slate-500">
                    {isZh ? useCase.zhCta : useCase.cta}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
