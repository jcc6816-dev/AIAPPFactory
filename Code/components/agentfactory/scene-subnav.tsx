"use client";

import Link from "next/link";
import Icon from "@/components/icon";
import { cn } from "@/lib/utils";
import LocaleToggle from "@/components/locale/toggle";
import ThemeToggle from "@/components/theme/toggle";
import { useAppContext } from "@/contexts/app";

type SceneTab = "design" | "data" | "analytics" | "publish";

interface SceneSubnavProps {
  locale: string;
  formId: string;
  formTitle: string;
  active: SceneTab;
  rightActions?: React.ReactNode;
}

export default function SceneSubnav({
  locale,
  formId,
  formTitle,
  active,
  rightActions,
}: SceneSubnavProps) {
  const { user } = useAppContext();
  const isZh = locale.toLowerCase().startsWith("zh");

  const userName = user?.name || user?.nickname || "Mike Admin";
  const userInitial = userName[0]?.toUpperCase() || "M";

  const tabs: Array<{ key: SceneTab; label: string; href: (locale: string, id: string) => string }> = [
    {
      key: "design",
      label: isZh ? "设计" : "Design",
      href: (locale, id) => `/${locale}/forms/${id}`,
    },
    {
      key: "data",
      label: isZh ? "数据" : "Data",
      href: (locale, id) => `/${locale}/forms/${id}/submissions`,
    },
    {
      key: "analytics",
      label: isZh ? "分析" : "Analytics",
      href: (locale, id) => `/${locale}/forms/${id}/analytics`,
    },
    {
      key: "publish",
      label: isZh ? "发布" : "Publish",
      href: (locale, id) => `/${locale}/forms/${id}/publish`,
    },
  ];

  return (
    <header className="sticky top-0 z-50 h-16 border-b border-slate-200 bg-white px-6 shadow-[0_1px_3px_rgba(0,0,0,0.02)] print:hidden">
      <div className="flex h-full items-center justify-between">
        
        {/* Left side: Brand Logo + Breadcrumbs (desktop) / Back Arrow (mobile) */}
        <div className="flex items-center gap-2">
          <Link
            href={`/${locale}/forms`}
            className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 transition hover:border-brand-blue hover:bg-brand-light-blue hover:text-brand-blue lg:hidden"
            title={isZh ? "返回工作台" : "Back to Console"}
          >
            <Icon name="RiArrowLeftLine" className="h-4 w-4" />
          </Link>

          <div className="hidden items-center gap-2.5 lg:flex">
            <Link href={`/${locale}/forms`} className="group flex items-center gap-2.5 transition-all hover:opacity-80">
              <img
                src="/logo.png"
                alt="GenForms.ai"
                className="h-8 w-8 object-contain transition-transform group-hover:scale-105"
              />
              <span className="text-sm font-black tracking-tight text-brand-blue">
                GenForms.ai
              </span>
            </Link>

            <Icon name="RiArrowRightSLine" className="h-4 w-4 text-slate-300" />

            <Link
              href={`/${locale}/forms`}
              className="text-xs font-extrabold text-slate-500 hover:text-slate-900 transition-colors"
            >
              {isZh ? "工作台" : "Console"}
            </Link>

            <Icon name="RiArrowRightSLine" className="h-4 w-4 text-slate-300" />

            <div className="inline-flex min-w-0 items-center gap-1.5 rounded-xl bg-slate-50 border border-slate-100 px-3 py-1 text-xs font-bold text-slate-800">
              <Icon name="RiFileList3Line" className="h-3.5 w-3.5 shrink-0 text-brand-blue" />
              <span className="truncate max-w-[150px]">{formTitle}</span>
            </div>
          </div>
        </div>

        {/* Middle side: Navigation Tabs (Pill style aligned with SidebarNav) */}
        <div className="absolute left-1/2 -translate-x-1/2">
          <nav className="flex items-center gap-1 rounded-2xl bg-slate-100 p-1 border border-slate-200/50">
            {tabs.map((tab) => (
              <Link
                key={tab.key}
                href={tab.href(locale, formId)}
                className={cn(
                  "inline-flex h-8 items-center justify-center rounded-lg px-3 text-xs font-bold transition-all sm:h-9 sm:rounded-xl sm:px-5 sm:text-[13px]",
                  active === tab.key
                    ? "bg-white text-brand-blue shadow-[0_1px_3px_rgba(0,0,0,0.05)]"
                    : "text-slate-500 hover:text-slate-900"
                )}
              >
                {tab.label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Right side: Page-specific actions + Toggles + User Avatar */}
        <div className="flex items-center gap-3">
          {rightActions && (
            <div className="flex items-center gap-2">
              {rightActions}
            </div>
          )}

          <div className="hidden h-5 w-px bg-slate-200 lg:block" />

          <div className="hidden items-center gap-3 lg:flex">
            <LocaleToggle />
            <ThemeToggle />
            
            <Link
              href={`/${locale}/settings`}
              className="group flex items-center gap-2.5 rounded-2xl p-1 transition-all hover:bg-slate-50"
            >
              <div className="flex flex-col items-end">
                <span className="text-[11px] font-black text-slate-900 leading-none">
                  {userName}
                </span>
                <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-tight scale-90 origin-right">
                  Pro Plan
                </span>
              </div>
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-blue text-xs font-bold text-white shadow-sm">
                {userInitial}
              </div>
            </Link>
          </div>
        </div>

      </div>
    </header>
  );
}
