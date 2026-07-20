"use client";

import {
  Check,
  Copy,
  ExternalLink,
  MessageCircle,
  QrCode,
  Send,
  Share2,
} from "lucide-react";
import Link from "next/link";
import { useState, useTransition } from "react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { trackGrowthEvent } from "@/lib/growth";

export default function PublishSuccessActions({
  formUuid,
  shareUrl,
  openHref,
  testHref,
}: {
  formUuid: string;
  shareUrl: string;
  openHref: string;
  testHref: string;
}) {
  const t = useTranslations("forms");
  const [copied, setCopied] = useState(false);
  const [isPending, startTransition] = useTransition();

  function getAbsoluteShareUrl() {
    if (/^https?:\/\//i.test(shareUrl)) {
      return shareUrl;
    }
    return `${window.location.origin}${shareUrl.startsWith("/") ? "" : "/"}${shareUrl}`;
  }

  function handleCopy() {
    startTransition(async () => {
      try {
        await navigator.clipboard.writeText(getAbsoluteShareUrl());
        setCopied(true);
        toast.success(t("share_link_copied"));
        window.setTimeout(() => setCopied(false), 1600);
      } catch (error: any) {
        toast.error(error?.message || t("share_link_copy_failed"));
      }
    });
  }

  function handleWhatsAppShare() {
    trackGrowthEvent("whatsapp_share_clicked", {
      form_uuid: formUuid,
      source: "publish_success",
    });
    const message = t("whatsapp_share_message", {
      url: getAbsoluteShareUrl(),
    });
    window.open(
      `https://wa.me/?text=${encodeURIComponent(message)}`,
      "_blank",
      "noopener,noreferrer"
    );
  }

  async function handleNativeShare() {
    const url = getAbsoluteShareUrl();
    try {
      if (navigator.share) {
        await navigator.share({ url });
        return;
      }
      await navigator.clipboard.writeText(url);
      toast.success(t("share_link_copied"));
    } catch (error: any) {
      if (error?.name !== "AbortError") {
        toast.error(error?.message || t("share_link_copy_failed"));
      }
    }
  }

  return (
    <div className="rounded-[1.5rem] border border-emerald-200 bg-emerald-50/60 p-5 shadow-sm sm:p-6">
      <div className="flex flex-col gap-5">
        <div className="min-w-0">
          <span className="inline-flex rounded-full bg-emerald-600 px-3 py-1 text-[11px] font-black uppercase tracking-wider text-white">
            {t("publish_success_badge")}
          </span>
          <h2 className="mt-3 text-xl font-black text-slate-950 sm:text-2xl">
            {t("publish_success_title")}
          </h2>
          <p className="mt-1 text-sm font-medium leading-6 text-slate-600">
            {t("publish_success_description")}
          </p>
        </div>

        <code className="block min-w-0 break-all rounded-xl border border-emerald-200 bg-white px-4 py-3 text-xs text-slate-700">
          {shareUrl}
        </code>

        <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap">
          <Button
            type="button"
            variant="outline"
            onClick={handleCopy}
            disabled={isPending}
            className="min-w-0 rounded-xl bg-white"
          >
            {copied ? <Check className="size-4 shrink-0" /> : <Copy className="size-4 shrink-0" />}
            <span className="truncate">{copied ? t("share_link_copied_short") : t("share_link_copy")}</span>
          </Button>
          <Button asChild variant="outline" className="min-w-0 rounded-xl bg-white">
            <Link href={openHref} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="size-4 shrink-0" />
              <span className="truncate">{t("open_share_page")}</span>
            </Link>
          </Button>
          <Button asChild variant="outline" className="min-w-0 rounded-xl bg-white">
            <Link href="#publish-qr">
              <QrCode className="size-4 shrink-0" />
              <span className="truncate">QR</span>
            </Link>
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={handleWhatsAppShare}
            className="min-w-0 rounded-xl border-emerald-300 bg-white text-emerald-700 hover:bg-emerald-100 sm:col-auto"
          >
            <MessageCircle className="size-4 shrink-0" />
            <span className="truncate">{t("share_whatsapp")}</span>
          </Button>
        </div>

        <Button asChild className="hidden h-12 w-full rounded-xl bg-blue-600 text-sm font-black text-white hover:bg-blue-700 md:inline-flex xl:hidden">
          <Link href={testHref}>
            <Send className="size-4" />
            {t("send_free_test")}
          </Link>
        </Button>
        <p className="text-center text-xs font-semibold leading-5 text-slate-500">
          {t("send_free_test_helper")}
        </p>
      </div>
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-200 bg-white/95 px-3 py-3 shadow-[0_-8px_30px_rgba(15,23,42,0.12)] backdrop-blur md:hidden">
        <div className="mx-auto flex max-w-lg items-center gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={handleNativeShare}
            className="h-12 shrink-0 rounded-xl px-4 text-xs font-black"
          >
            <Share2 className="size-4" />
            {t("share_link")}
          </Button>
          <Button asChild className="h-12 min-w-0 flex-1 rounded-xl bg-blue-600 px-4 text-sm font-black text-white hover:bg-blue-700">
            <Link href={testHref}>
              <Send className="size-4" />
              {t("send_free_test")}
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
