import { PostStatus, findPostBySlug } from "@/models/post";

import BlogDetail from "@/components/blocks/blog-detail";
import Empty from "@/components/blocks/empty";
import { buildBreadcrumbListJsonLd } from "@/components/seo/breadcrumb-json-ld";
import JsonLd from "@/components/seo/json-ld";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getRelatedUseCasesForPost } from "@/services/growth-content-clusters";
import { localizePath } from "@/lib/localized-path";

const baseUrl = process.env.NEXT_PUBLIC_WEB_URL || "https://genforms.ai";

const postKeywords: Record<string, string[]> = {
  "send-form-submissions-to-webhook": [
    "send form submissions to webhook",
    "form webhook",
    "webhook form builder",
    "webhook delivery logs",
    "form webhook retry",
  ],
};

const postFaqItems: Record<string, { question: string; answer: string }[]> = {
  "send-form-submissions-to-webhook": [
    {
      question: "What is a form webhook?",
      answer:
        "A form webhook is a way to send form submission data to another system automatically. When a visitor submits the form, the platform sends an HTTP request to a configured endpoint.",
    },
    {
      question: "Do I need a developer to send form submissions to a webhook?",
      answer:
        "You may need a technical teammate if the receiving endpoint is custom or requires authentication, signature verification, or payload transformation. The form setup can be simple, but the endpoint still needs to be configured correctly.",
    },
    {
      question: "What data is sent in the webhook payload?",
      answer:
        "The payload usually includes form metadata, submission time, and field responses. The exact structure depends on the form schema and platform settings, so you should test with a real submission before relying on it in production.",
    },
    {
      question: "What happens if the webhook endpoint fails?",
      answer:
        "The submission should still be saved by the form platform, but the delivery attempt may fail. Logs and retry visibility help you diagnose whether the problem is a bad URL, auth issue, payload mismatch, timeout, or receiving server error.",
    },
    {
      question: "Can I test the webhook before sharing the form?",
      answer:
        "Yes. You should send at least one test submission, confirm the response is saved, and inspect the webhook delivery log before sending real users to the form.",
    },
  ],
};

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
    keywords: postKeywords[slug],
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
  const faqItems = postFaqItems[slug] || [];

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
              url: `${baseUrl}/brand/genforms-mark-v2.png`,
            },
          },
          mainEntityOfPage: {
            "@type": "WebPage",
            "@id": articleUrl,
          },
        }}
      />
      {faqItems.length > 0 && (
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: faqItems.map((item) => ({
              "@type": "Question",
              name: item.question,
              acceptedAnswer: {
                "@type": "Answer",
                text: item.answer,
              },
            })),
          }}
        />
      )}
      <JsonLd
        data={buildBreadcrumbListJsonLd([
          {
            name: locale === "zh" ? "首页" : "Home",
            url: locale === "en" ? baseUrl : `${baseUrl}/${locale}`,
          },
          {
            name: locale === "zh" ? "资源中心" : "Resources",
            url:
              locale === "en"
                ? `${baseUrl}/posts`
                : `${baseUrl}/${locale}/posts`,
          },
          {
            name: post.title || slug,
            url: articleUrl,
          },
        ])}
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
