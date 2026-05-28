"use client";

import { useEffect } from "react";
import Link from "next/link";
import { trackGrowthEvent } from "@/lib/growth";

interface PublishPaywallProps {
  locale: string;
  formUuid: string;
}

export default function PublishPaywall({ locale, formUuid }: PublishPaywallProps) {
  const isZh = locale.toLowerCase().startsWith("zh");

  useEffect(() => {
    trackGrowthEvent("paywall_impression", { form_uuid: formUuid });
  }, [formUuid]);

  const handleClick = () => {
    trackGrowthEvent("paywall_clicked", { form_uuid: formUuid });
  };

  return (
    <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-slate-950/60 backdrop-blur-md p-6 text-center animate-in fade-in duration-300">
      <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-2xl bg-amber-500 text-slate-950 shadow-md mb-3">
        <i className="ri-lock-line text-lg" />
      </div>
      <h3 className="text-sm font-black text-white">
        {isZh ? "Pro 高级技能锁定" : "Pro Skill Locked"}
      </h3>
      <p className="mt-1 text-[11px] font-bold text-slate-300 max-w-sm leading-relaxed">
        {isZh
          ? "当前表单已装配高级 AI 自动化技能（如表格 OCR、AI 预审）。免费套餐不支持发布，请升级 Pro 套餐解锁分享链接与数据收集。"
          : "This form has premium AI Skills enabled (e.g. Table OCR, AI Pre-audit). Upgrade to Pro to activate link sharing and start collecting submissions."}
      </p>
      
      <Link
        href={`/${locale}/#pricing`}
        onClick={handleClick}
        className="mt-4 inline-flex h-9 items-center justify-center rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 px-5 text-xs font-black text-white shadow-lg hover:from-amber-600 hover:to-amber-700 transition gap-2"
      >
        <span>{isZh ? "升级至专业版解锁" : "Upgrade to Pro"}</span>
        <i className="ri-arrow-right-line" />
      </Link>
    </div>
  );
}
