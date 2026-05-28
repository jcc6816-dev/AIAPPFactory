"use client";

import { FormEvent, useState, useTransition } from "react";

import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const categories = [
  "general",
  "generation",
  "template",
  "publish",
  "webhook",
  "billing",
  "bug",
  "feature",
] as const;

export default function SupportTicketForm({ isZh }: { isZh: boolean }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [category, setCategory] = useState("general");
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const response = await fetch("/api/support/tickets", {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        category,
        title,
        message,
      }),
    });
    const json = await response.json();

    if (json.code !== 0) {
      toast.error(json.message || (isZh ? "提交失败" : "Submit failed"));
      return;
    }

    toast.success(isZh ? "反馈已提交" : "Feedback submitted");
    setCategory("general");
    setTitle("");
    setMessage("");
    startTransition(() => router.refresh());
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        <label className="space-y-2">
          <span className="text-[11px] font-extrabold uppercase tracking-widest text-slate-400">
            {isZh ? "问题类型" : "Category"}
          </span>
          <select
            value={category}
            onChange={(event) => setCategory(event.target.value)}
            className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm font-bold text-slate-800 outline-none transition-colors focus:border-brand-blue"
          >
            {categories.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </label>
        <label className="space-y-2">
          <span className="text-[11px] font-extrabold uppercase tracking-widest text-slate-400">
            {isZh ? "标题" : "Title"}
          </span>
          <input
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            maxLength={140}
            required
            className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm font-bold text-slate-800 outline-none transition-colors focus:border-brand-blue"
            placeholder={isZh ? "例如：Webhook 推送失败" : "e.g. Webhook delivery failed"}
          />
        </label>
      </div>
      <label className="space-y-2 block">
        <span className="text-[11px] font-extrabold uppercase tracking-widest text-slate-400">
          {isZh ? "问题描述" : "Message"}
        </span>
        <textarea
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          maxLength={4000}
          required
          rows={6}
          className="w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm font-medium text-slate-800 outline-none transition-colors focus:border-brand-blue"
          placeholder={
            isZh
              ? "请描述你遇到的问题、相关表单或链接，以及你期望的结果。"
              : "Describe the issue, related form or link, and what you expected to happen."
          }
        />
      </label>
      <Button disabled={isPending} type="submit" className="rounded-xl font-extrabold">
        {isPending ? (isZh ? "提交中..." : "Submitting...") : isZh ? "提交反馈" : "Submit Feedback"}
      </Button>
    </form>
  );
}
