"use client";

import { Rocket } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { trackGrowthEvent } from "@/lib/growth";

export default function PublishDraftAction({
  formUuid,
  locale,
}: {
  formUuid: string;
  locale: string;
}) {
  const router = useRouter();
  const [isPublishing, setIsPublishing] = useState(false);
  const isZh = locale.toLowerCase().startsWith("zh");

  async function publishNow() {
    setIsPublishing(true);
    trackGrowthEvent("publish_started", {
      form_uuid: formUuid,
      source: "publish_readiness",
    });

    try {
      const response = await fetch(`/api/forms/${formUuid}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "published" }),
      });
      const result = await response.json();
      if (result.code !== 0 || !result.data?.uuid) {
        throw new Error(result.message || "publish form failed");
      }

      trackGrowthEvent("publish_succeeded", {
        form_uuid: result.data.uuid,
        source: "publish_readiness",
      });
      toast.success(isZh ? "表单已发布，现在可发送测试或分享链接。" : "Form published. You can now test it or share its link.");
      router.refresh();
    } catch (error: any) {
      toast.error(error?.message || (isZh ? "发布失败，请稍后重试。" : "Publishing failed. Please try again."));
    } finally {
      setIsPublishing(false);
    }
  }

  return (
    <div className="mt-5 flex flex-col gap-3 rounded-2xl border border-emerald-200 bg-white/80 p-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p className="text-sm font-black text-slate-950">
          {isZh ? "检查已通过，可以直接发布" : "Everything is ready. Publish it now."}
        </p>
        <p className="mt-1 text-xs font-semibold leading-5 text-slate-500">
          {isZh ? "发布后会生成公开链接和二维码；你还可以先发送一次免费测试。" : "Publishing creates a public link and QR code. You can send a free test next."}
        </p>
      </div>
      <Button
        type="button"
        onClick={publishNow}
        disabled={isPublishing}
        className="h-11 shrink-0 rounded-xl bg-blue-600 px-5 text-sm font-black text-white hover:bg-blue-700"
      >
        <Rocket className="size-4" />
        {isPublishing ? (isZh ? "正在发布…" : "Publishing…") : (isZh ? "立即发布" : "Publish now")}
      </Button>
    </div>
  );
}
