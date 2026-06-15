import Dropdown from "@/components/blocks/table/dropdown";
import { NavItem } from "@/types/blocks/base";
import { Post } from "@/types/post";
import TableSlot from "@/components/dashboard/slots/table";
import { Table as TableSlotType } from "@/types/slots/table";
import { findPostByUuid, getAllPosts, PostStatus, updatePost } from "@/models/post";
import { getIsoTimestr } from "@/lib/time";
import moment from "moment";
import { revalidatePath } from "next/cache";
import {
  getSeoPostGateStatus,
  validateSeoPostDraft,
} from "@/services/blog-automation";

async function setPostPublicationStatus(formData: FormData) {
  "use server";

  const uuid = formData.get("uuid")?.toString();
  const locale = formData.get("locale")?.toString() || "en";
  const slug = formData.get("slug")?.toString();
  const status = formData.get("status")?.toString();

  if (!uuid || !status) {
    return;
  }

  if (![PostStatus.Online, PostStatus.Offline].includes(status as PostStatus)) {
    return;
  }

  if (status === PostStatus.Online) {
    const post = await findPostByUuid(uuid);
    if (!post) return;
    validateSeoPostDraft(post);
  }

  await updatePost(uuid, {
    status,
    updated_at: getIsoTimestr(),
  });

  revalidatePath("/admin/posts");
  revalidatePath(`/${locale}`);
  revalidatePath(`/${locale}/posts`);

  if (slug) {
    revalidatePath(`/${locale}/posts/${slug}`);
  }

  if (locale === "en") {
    revalidatePath("/");
  }
}

function PublicationStatusButton({ item }: { item: Post }) {
  const isOnline = item.status === PostStatus.Online;
  const nextStatus = isOnline ? PostStatus.Offline : PostStatus.Online;
  const seoGate = getSeoPostGateStatus(item);
  const canSubmit = Boolean(item.uuid) && (isOnline || seoGate.passed);

  return (
    <form action={setPostPublicationStatus}>
      <input type="hidden" name="uuid" value={item.uuid || ""} />
      <input type="hidden" name="locale" value={item.locale || "en"} />
      <input type="hidden" name="slug" value={item.slug || ""} />
      <input type="hidden" name="status" value={nextStatus} />
      <button
        type="submit"
        disabled={!canSubmit}
        title={canSubmit ? undefined : seoGate.message}
        className={
          isOnline
            ? "rounded-md border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
            : "rounded-md bg-slate-950 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
        }
      >
        {isOnline ? "下线" : "发布"}
      </button>
    </form>
  );
}

function SeoGateBadge({ item }: { item: Post }) {
  const seoGate = getSeoPostGateStatus(item);

  return (
    <div className="min-w-40">
      <span
        className={
          seoGate.passed
            ? "inline-flex rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700 ring-1 ring-emerald-200"
            : "inline-flex rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700 ring-1 ring-amber-200"
        }
      >
        {seoGate.passed ? "可发布" : "需完善"}
      </span>
      <p className="mt-1 max-w-64 text-xs leading-5 text-slate-500">
        {seoGate.message}
      </p>
    </div>
  );
}

export default async function () {
  const posts = await getAllPosts();

  const table: TableSlotType = {
    title: "Posts",
    toolbar: {
      items: [
        {
          title: "Add Post",
          icon: "RiAddLine",
          url: "/admin/posts/add",
        },
      ],
    },
    columns: [
      {
        name: "title",
        title: "Title",
      },
      {
        name: "description",
        title: "Description",
      },
      {
        name: "slug",
        title: "Slug",
      },
      {
        name: "locale",
        title: "Locale",
      },
      {
        name: "status",
        title: "Status",
      },
      {
        title: "SEO Gate",
        callback: (item: Post) => <SeoGateBadge item={item} />,
      },
      {
        name: "created_at",
        title: "Created At",
        callback: (item: Post) => {
          return moment(item.created_at).format("YYYY-MM-DD HH:mm:ss");
        },
      },
      {
        callback: (item: Post) => {
          const items: NavItem[] = [
            {
              title: "Edit",
              icon: "RiEditLine",
              url: `/admin/posts/${item.uuid}/edit`,
            },
            {
              title: "View",
              icon: "RiEyeLine",
              url: `/${item.locale}/posts/${item.slug}`,
              target: "_blank",
            },
          ];

          return (
            <div className="flex items-center justify-end gap-2">
              <PublicationStatusButton item={item} />
              <Dropdown items={items} />
            </div>
          );
        },
      },
    ],
    data: posts,
    empty_message: "No posts found",
  };

  return <TableSlot {...table} />;
}
