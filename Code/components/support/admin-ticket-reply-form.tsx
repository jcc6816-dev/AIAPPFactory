"use client";

import { FormEvent, useState, useTransition } from "react";

import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useLocale } from "next-intl";
import { useRouter } from "next/navigation";

export default function AdminTicketReplyForm({
  ticketId,
  defaultReply = "",
}: {
  ticketId: string;
  defaultReply?: string;
}) {
  const router = useRouter();
  const isZh = useLocale() === "zh";
  const [reply, setReply] = useState(defaultReply);
  const [status, setStatus] = useState("replied");
  const [isPending, startTransition] = useTransition();

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const response = await fetch(`/api/admin/support/tickets/${ticketId}/reply`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        reply,
        status,
      }),
    });
    const json = await response.json();

    if (json.code !== 0) {
      toast.error(json.message || (isZh ? "回复失败" : "Reply failed"));
      return;
    }

    toast.success(isZh ? "回复已保存" : "Reply saved");
    startTransition(() => router.refresh());
  }

  return (
    <form onSubmit={onSubmit} className="mt-4 space-y-3">
      <textarea
        value={reply}
        onChange={(event) => setReply(event.target.value)}
        rows={3}
        className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-brand-blue"
        placeholder={isZh ? "填写管理员回复..." : "Write an admin reply..."}
        required
      />
      <div className="flex flex-wrap items-center gap-2">
        <select
          value={status}
          onChange={(event) => setStatus(event.target.value)}
          className="h-9 rounded-lg border border-slate-200 bg-white px-2 text-xs font-bold text-slate-700"
        >
          <option value="replied">{isZh ? "已回复" : "Replied"}</option>
          <option value="closed">{isZh ? "已关闭" : "Closed"}</option>
        </select>
        <Button disabled={isPending} size="sm" className="rounded-lg font-bold">
          {isPending ? (isZh ? "保存中..." : "Saving...") : isZh ? "保存回复" : "Save Reply"}
        </Button>
      </div>
    </form>
  );
}
