"use client";

import { Check, Copy } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";

export default function CopyShareLinkButton({
  shareUrl,
  label,
  className,
  ariaLabel,
}: {
  shareUrl: string;
  label?: string;
  className?: string;
  ariaLabel?: string;
}) {
  const [copied, setCopied] = useState(false);
  async function copy() {
    const url = /^https?:\/\//.test(shareUrl)
      ? shareUrl
      : `${window.location.origin}${shareUrl.startsWith("/") ? "" : "/"}${shareUrl}`;
    await navigator.clipboard.writeText(url);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  }
  return (
    <Button
      type="button"
      variant="outline"
      onClick={copy}
      aria-label={ariaLabel || label || "Copy share link"}
      className={`h-10 min-w-0 rounded-xl border-slate-300 bg-white text-xs font-bold text-slate-700 hover:bg-slate-50 hover:text-slate-950 ${className || ""}`}
    >
      {copied ? <Check className="size-4 shrink-0" /> : <Copy className="size-4 shrink-0" />}
      <span className="truncate">{copied ? "已复制" : label || "复制链接"}</span>
    </Button>
  );
}
