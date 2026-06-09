"use client";

import { Avatar, AvatarImage } from "@/components/ui/avatar";

import Crumb from "./crumb";
import Link from "next/link";
import Markdown from "@/components/markdown";
import { Post } from "@/types/post";
import { getRelatedUseCasesForPost } from "@/services/growth-content-clusters";
import moment from "moment";

function normalizeTitleText(text?: string) {
  return (text || "")
    .replace(/^#{1,6}\s+/, "")
    .replace(/#+$/, "")
    .replace(/[*_`]/g, "")
    .replace(/[：:｜|\-–—]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();
}

function removeDuplicateLeadingTitle(content?: string, title?: string) {
  if (!content || !title) {
    return content || "";
  }

  const lines = content.split(/\r?\n/);
  let firstContentLineIndex = 0;

  while (
    firstContentLineIndex < lines.length &&
    lines[firstContentLineIndex].trim() === ""
  ) {
    firstContentLineIndex += 1;
  }

  const firstLine = lines[firstContentLineIndex]?.trim();
  const firstLineLooksLikeTitle =
    firstLine?.startsWith("#") || normalizeTitleText(firstLine) === normalizeTitleText(title);

  if (
    firstLine &&
    firstLineLooksLikeTitle &&
    normalizeTitleText(firstLine) === normalizeTitleText(title)
  ) {
    lines.splice(0, firstContentLineIndex + 1);

    while (lines[0]?.trim() === "") {
      lines.shift();
    }
  }

  return lines.join("\n");
}

function formatPostDate(date?: string) {
  if (!date) {
    return "";
  }

  return moment(date).format("YYYY-MM-DD");
}

export default function BlogDetail({ post }: { post: Post }) {
  const isZh = post.locale?.toLowerCase().startsWith("zh");
  const localePrefix = isZh ? `/${post.locale}` : "";
  const content = removeDuplicateLeadingTitle(post.content, post.title);
  const publishedDate = formatPostDate(post.created_at);
  const updatedDate = formatPostDate(post.updated_at);
  const showUpdatedDate = updatedDate && updatedDate !== publishedDate;
  const relatedUseCases = getRelatedUseCasesForPost(post);
  const firstRelatedUseCase = relatedUseCases[0];
  const templateId = firstRelatedUseCase?.templateId;

  const templatesHref = templateId 
    ? `${localePrefix}/templates/${templateId}?source=blog_${post.slug}` 
    : `${localePrefix}/templates?source=blog_${post.slug}`;
    
  const createHref = templateId
    ? `${localePrefix}/forms/new?source=blog_${post.slug}&template=${templateId}`
    : `${localePrefix}/forms/new?source=blog_${post.slug}`;

  return (
    <section className="py-10 md:py-16">
      <div className="container">
        <Crumb post={post} />
        <h1 className="mb-7 mt-9 max-w-3xl text-2xl font-bold md:mb-10 md:text-4xl">
          {post.title}
        </h1>
        <div className="flex items-center gap-3 text-sm md:text-base">
          {post.author_avatar_url && (
            <Avatar className="h-8 w-8 border">
              <AvatarImage
                src={post.author_avatar_url}
                alt={post.author_name}
              />
            </Avatar>
          )}
          <div>
            {post.author_name && (
              <a href="javascript:void(0)" className="font-medium">
                {post.author_name}
              </a>
            )}

            <span className="ml-2 text-muted-foreground">
              {publishedDate && (
                <>
                  {isZh ? "发布于 " : "Published "}
                  <time dateTime={post.created_at}>{publishedDate}</time>
                </>
              )}
              {showUpdatedDate && (
                <>
                  <span className="mx-2">·</span>
                  {isZh ? "更新于 " : "Updated "}
                  <time dateTime={post.updated_at}>{updatedDate}</time>
                </>
              )}
            </span>
          </div>
        </div>
        <div className="relative mt-0 grid max-w-screen-xl gap-4 lg:mt-0 lg:grid lg:grid-cols-12 lg:gap-6">
          <div className="order-1 lg:order-none lg:col-span-8 min-w-0 w-full overflow-hidden">
            {content && <Markdown content={content} />}
          </div>
          <aside className="order-2 flex h-fit flex-col text-sm lg:sticky lg:top-8 lg:order-none lg:col-span-3 lg:col-start-10 lg:text-xs">
            <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-[11px] font-black uppercase tracking-[0.18em] text-blue-600">
                {isZh ? "开始实践" : "Try It Now"}
              </p>
              <h2 className="mt-3 text-base font-bold leading-6 text-slate-950">
                {isZh
                  ? "把这篇指南变成一个可发布表单"
                  : "Turn this guide into a publishable form"}
              </h2>
              <p className="mt-3 text-sm leading-6 text-slate-600 lg:text-xs lg:leading-5">
                {isZh
                  ? "从模板或一句话开始生成，预览单题流体验，然后发布链接收集真实数据。"
                  : "Start from a template or prompt, preview the flow, then publish a link to collect real data."}
              </p>
              <div className="mt-5 flex flex-col gap-2">
                <Link
                  href={templatesHref}
                  className="inline-flex h-9 items-center justify-center rounded-md bg-slate-950 px-3 text-xs font-semibold text-white transition hover:bg-slate-800"
                >
                  {isZh ? "从模板开始" : "Start From Templates"}
                </Link>
                <Link
                  href={createHref}
                  className="inline-flex h-9 items-center justify-center rounded-md border border-slate-200 px-3 text-xs font-semibold text-slate-700 transition hover:bg-slate-50"
                >
                  {isZh ? "直接创建表单" : "Create A Form"}
                </Link>
              </div>
            </div>
            {relatedUseCases.length > 0 && (
              <div className="mt-4 rounded-lg border border-slate-200 bg-slate-50 p-5">
                <p className="text-[11px] font-black uppercase tracking-[0.18em] text-blue-600">
                  {isZh ? "相关场景" : "Related workflows"}
                </p>
                <h2 className="mt-3 text-base font-bold leading-6 text-slate-950">
                  {isZh ? "把这篇文章落到具体表单" : "Apply this guide to a form"}
                </h2>
                <div className="mt-4 flex flex-col gap-2">
                  {relatedUseCases.map((useCase) => (
                    <Link
                      key={useCase.slug}
                      href={`${localePrefix}/use-cases/${useCase.slug}`}
                      className="rounded-md border border-slate-200 bg-white px-3 py-2 text-xs font-semibold leading-5 text-slate-700 transition hover:border-blue-200 hover:text-blue-600"
                    >
                      {isZh ? useCase.zhTitle : useCase.title}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </aside>
        </div>
      </div>
    </section>
  );
}
