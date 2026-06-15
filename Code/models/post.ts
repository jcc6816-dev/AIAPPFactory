import { Post } from "@/types/post";
import { getSupabaseClient } from "./db";

// Dynamic imports to prevent breaking standalone node scripts
let unstable_cache: any = (fn: any) => fn;
let revalidateTag: any = null;
try {
  const cacheObj = require("next/cache");
  unstable_cache = cacheObj.unstable_cache;
  revalidateTag = cacheObj.revalidateTag;
} catch (e) {
  // fallback if not in next.js environment
}

export enum PostStatus {
  Created = "created",
  Deleted = "deleted",
  Online = "online",
  Offline = "offline",
}

export async function insertPost(post: Post) {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase.from("posts").insert(post);

  if (error) {
    throw error;
  }

  if (revalidateTag) {
    try {
      revalidateTag("posts");
    } catch (e) {
      console.warn("Failed to revalidate tag 'posts':", e);
    }
  }

  return data;
}

export async function updatePost(uuid: string, post: Partial<Post>) {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from("posts")
    .update(post)
    .eq("uuid", uuid);

  if (error) {
    throw error;
  }

  if (revalidateTag) {
    try {
      revalidateTag("posts");
    } catch (e) {
      console.warn("Failed to revalidate tag 'posts':", e);
    }
  }

  return data;
}

export async function findPostByUuid(uuid: string): Promise<Post | undefined> {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .eq("uuid", uuid)
    .limit(1)
    .single();

  if (error) {
    return undefined;
  }

  return data;
}

export async function findPostBySlug(
  slug: string,
  locale: string
): Promise<Post | undefined> {
  const fetcher = unstable_cache(
    async (slg: string, loc: string) => {
      const supabase = getSupabaseClient();
      const { data, error } = await supabase
        .from("posts")
        .select("*")
        .eq("slug", slg)
        .eq("locale", loc)
        .limit(1)
        .single();

      if (error) {
        return undefined;
      }

      return data;
    },
    [`post-by-slug-${slug}-${locale}`],
    {
      revalidate: 3600,
      tags: ["posts"],
    }
  );

  return fetcher(slug, locale);
}

export async function getAllPosts(
  page: number = 1,
  limit: number = 50
): Promise<Post[]> {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .order("created_at", { ascending: false })
    .range((page - 1) * limit, page * limit - 1);

  if (error) {
    return [];
  }

  return data;
}

export async function getPostsByLocale(
  locale: string,
  page: number = 1,
  limit: number = 50
): Promise<Post[]> {
  const fetcher = unstable_cache(
    async (loc: string, pg: number, lim: number) => {
      const supabase = getSupabaseClient();
      const { data, error } = await supabase
        .from("posts")
        .select("*")
        .eq("locale", loc)
        .eq("status", PostStatus.Online)
        .order("created_at", { ascending: false })
        .range((pg - 1) * lim, pg * lim - 1);

      if (error) {
        return [];
      }

      return data;
    },
    [`posts-by-locale-${locale}-${page}-${limit}`],
    {
      revalidate: 3600,
      tags: ["posts"],
    }
  );

  return fetcher(locale, page, limit);
}
