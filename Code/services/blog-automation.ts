import { Post } from "@/types/post";
import {
  PostStatus,
  findPostBySlug,
  findPostByUuid,
  insertPost,
  updatePost,
} from "@/models/post";
import { getIsoTimestr } from "@/lib/time";
import { getUuid } from "@/lib/hash";
import { locales } from "@/i18n/locale";

type BlogAutomationInput = {
  title?: unknown;
  slug?: unknown;
  locale?: unknown;
  status?: unknown;
  description?: unknown;
  cover_url?: unknown;
  author_name?: unknown;
  author_avatar_url?: unknown;
  content?: unknown;
};

function stringValue(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function countEnglishWords(content: string) {
  return (content.match(/[A-Za-z0-9]+(?:[-'][A-Za-z0-9]+)?/g) || []).length;
}

function countCjkCharacters(content: string) {
  return (content.match(/[\u3400-\u9fff]/g) || []).length;
}

function getFirstContentLine(content: string) {
  return (
    content
      .split(/\r?\n/)
      .map((line) => line.trim())
      .find(Boolean) || ""
  );
}

function normalizeHeading(text: string) {
  return text
    .replace(/^#{1,6}\s+/, "")
    .replace(/[*_`]/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();
}

function countInternalLinks(content: string) {
  const matches = content.match(
    /\]\(\/(?:use-cases|solutions|templates|posts)(?:[/?#][^)]+|\))/g
  );
  return matches?.length || 0;
}

export function validateSeoPostDraft(post: Partial<Post>) {
  const locale = post.locale || "en";
  const isZh = locale.startsWith("zh");
  const title = post.title || "";
  const slug = post.slug || "";
  const description = post.description || "";
  const content = post.content || "";

  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
    throw new Error("slug must use lowercase words separated by hyphens");
  }

  if (slug.length > 70) {
    throw new Error("slug must be 70 characters or less");
  }

  if (!description) {
    throw new Error("description is required for SEO drafts");
  }

  if (isZh) {
    if (title.length < 12 || title.length > 40) {
      throw new Error("zh title should be 12-40 characters");
    }
    if (description.length < 40 || description.length > 120) {
      throw new Error("zh description should be 40-120 characters");
    }
  } else {
    if (title.length < 35 || title.length > 90) {
      throw new Error("en title should be 35-90 characters");
    }
    if (description.length < 80 || description.length > 180) {
      throw new Error("en description should be 80-180 characters");
    }
  }

  const h1Headings = content.match(/^#\s+.+$/gm) || [];
  if (h1Headings.length !== 1) {
    throw new Error("content must include exactly one H1 heading");
  }

  if (
    normalizeHeading(getFirstContentLine(content)) !== normalizeHeading(title)
  ) {
    throw new Error("content H1 must match the title");
  }

  if (isZh) {
    if (countCjkCharacters(content) < 700) {
      throw new Error("zh content should contain at least 700 Chinese characters");
    }
  } else if (countEnglishWords(content) < 650) {
    throw new Error("en content should contain at least 650 words");
  }

  if (countInternalLinks(content) < 2) {
    throw new Error("content must include at least two internal product links");
  }

  if (!/##\s+(Try|Start|Next|开始|尝试|下一步)/i.test(content)) {
    throw new Error("content must include one clear CTA section");
  }

  if (/as an ai|作为\s*ai|作为人工智能/i.test(content)) {
    throw new Error("content must not include generic AI assistant wording");
  }
}

export function getSeoPostGateStatus(post: Partial<Post>) {
  try {
    validateSeoPostDraft(post);
    return {
      passed: true,
      message: "Ready to publish",
    };
  } catch (error) {
    return {
      passed: false,
      message:
        error instanceof Error ? error.message : "SEO quality gate failed",
    };
  }
}

function normalizeStatus(value: unknown) {
  const status = stringValue(value);
  if (!status) return PostStatus.Created;
  if (status === PostStatus.Created || status === PostStatus.Offline) {
    return status;
  }

  throw new Error("automation can only create or update draft/offline posts");
}

function normalizePostInput(input: BlogAutomationInput, partial = false) {
  const title = stringValue(input.title);
  const slug = stringValue(input.slug);
  const locale = stringValue(input.locale);

  if (!partial || title) {
    if (!title) throw new Error("title is required");
  }
  if (!partial || slug) {
    if (!slug) throw new Error("slug is required");
  }
  if (!partial || locale) {
    if (!locale) throw new Error("locale is required");
    if (!locales.includes(locale)) throw new Error("unsupported locale");
  }

  const post: Partial<Post> = {};
  if (title) post.title = title;
  if (slug) post.slug = slug;
  if (locale) post.locale = locale;
  if (input.status !== undefined) post.status = normalizeStatus(input.status);
  if (input.description !== undefined) {
    post.description = stringValue(input.description);
  }
  if (input.cover_url !== undefined) {
    post.cover_url = stringValue(input.cover_url);
  }
  if (input.author_name !== undefined) {
    post.author_name = stringValue(input.author_name);
  }
  if (input.author_avatar_url !== undefined) {
    post.author_avatar_url = stringValue(input.author_avatar_url);
  }
  if (input.content !== undefined) {
    post.content = stringValue(input.content);
  }

  return post;
}

export async function createBlogDraftForAutomation(input: BlogAutomationInput) {
  const post = normalizePostInput(input) as Post;
  const existing = await findPostBySlug(post.slug || "", post.locale || "");
  if (existing) {
    throw new Error("post with same slug already exists");
  }
  validateSeoPostDraft(post);

  const nextPost: Post = {
    uuid: getUuid(),
    created_at: getIsoTimestr(),
    status: post.status || PostStatus.Created,
    title: post.title,
    slug: post.slug,
    locale: post.locale,
    description: post.description || "",
    cover_url: post.cover_url || "",
    author_name: post.author_name || "GenForms.ai",
    author_avatar_url: post.author_avatar_url || "",
    content: post.content || "",
  };

  await insertPost(nextPost);
  return nextPost;
}

export async function updateBlogDraftForAutomation(
  uuid: string,
  input: BlogAutomationInput
) {
  if (!uuid || !uuid.trim()) {
    throw new Error("uuid is required");
  }

  const existingPost = await findPostByUuid(uuid);
  if (!existingPost) {
    throw new Error("post not found");
  }

  const post = normalizePostInput(input, true);
  const nextSlug = post.slug || existingPost.slug || "";
  const nextLocale = post.locale || existingPost.locale || "";

  if (post.slug || post.locale) {
    const existing = await findPostBySlug(nextSlug, nextLocale);
    if (existing && existing.uuid !== uuid) {
      throw new Error("post with same slug already exists");
    }
  }

  const updatedPost: Partial<Post> = {
    ...post,
    updated_at: getIsoTimestr(),
  };

  validateSeoPostDraft({
    ...existingPost,
    ...updatedPost,
    slug: nextSlug,
    locale: nextLocale,
  });

  await updatePost(uuid, updatedPost);
  return {
    ...existingPost,
    ...updatedPost,
  };
}
