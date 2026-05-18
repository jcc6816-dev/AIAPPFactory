"use client";

import { Check, Copy, ExternalLink } from "lucide-react";
import Link from "next/link";
import { useState, useTransition } from "react";

import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useTranslations } from "next-intl";

export default function ShareLinkCard({
  shareUrl,
  openHref,
}: {
  shareUrl: string;
  openHref: string;
}) {
  const t = useTranslations("forms");
  const [copied, setCopied] = useState(false);
  const [isPending, startTransition] = useTransition();

  function handleCopy() {
    startTransition(async () => {
      try {
        await navigator.clipboard.writeText(shareUrl);
        setCopied(true);
        toast.success(t("share_link_copied"));
        window.setTimeout(() => setCopied(false), 1600);
      } catch (error: any) {
        toast.error(error?.message || t("share_link_copy_failed"));
      }
    });
  }

  return (
    <div className="rounded-[1.5rem] border border-slate-200 bg-white p-6 md:p-8 shadow-sm">
      <div className="space-y-2">
        <div className="inline-flex rounded-full border bg-white/80 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-500">
          {t("share_link_badge")}
        </div>
        <p className="text-sm font-semibold">{t("share_link")}</p>
        <p className="text-sm leading-6 text-muted-foreground">
          {t("detail_share_hint")}
        </p>
      </div>

      <div className="mt-4 space-y-3">
        <code className="block break-all rounded-2xl border bg-white/75 px-4 py-3 text-xs shadow-sm">
          {shareUrl}
        </code>

        <div className="flex flex-col gap-3 sm:flex-row">
          <Button
            type="button"
            variant="outline"
            onClick={handleCopy}
            disabled={isPending}
            className="rounded-xl bg-white/85"
          >
            {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
            {copied ? t("share_link_copied_short") : t("share_link_copy")}
          </Button>

          <Button asChild className="rounded-xl shadow-sm">
            <Link href={openHref}>
              <ExternalLink className="size-4" />
              {t("open_share_page")}
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
