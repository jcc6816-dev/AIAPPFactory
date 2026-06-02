import { ReactNode } from "react";
import { Sidebar } from "@/types/blocks/sidebar";
import SidebarNav from "@/components/console/sidebar/nav";
import Link from "next/link";
import Icon from "@/components/icon";
import LocaleToggle from "@/components/locale/toggle";
import ThemeToggle from "@/components/theme/toggle";

import { getLocale } from "next-intl/server";
import { getUserInfo } from "@/services/user";

function localizeHref(href: string, locale: string) {
  if (!href || href.startsWith("http") || href.startsWith("#")) {
    return href;
  }

  if (href === "/") {
    return locale === "en" ? "/" : `/${locale}`;
  }

  if (href.startsWith(`/${locale}/`) || href === `/${locale}`) {
    return href;
  }

  if (href.startsWith("/en/") || href.startsWith("/zh/")) {
    return href;
  }

  return href.startsWith("/") ? `/${locale}${href}` : href;
}

export default async function ConsoleLayout({
  children,
  sidebar,
}: {
  children: ReactNode;
  sidebar?: Sidebar;
}) {
  const userInfo = await getUserInfo();
  const locale = await getLocale();

  return (
    <div className="h-screen overflow-hidden bg-slate-50 text-slate-950 flex flex-col">
      <header className="sticky top-0 z-50 h-16 border-b border-slate-200 bg-white px-6">
        <div className="flex h-full items-center justify-between">
          <div className="flex items-center gap-2">
            <Link href={localizeHref("/forms", locale)} className="group flex items-center gap-2.5 transition-all hover:opacity-80">
              <img
                src="/logo.png"
                alt="GenForms.ai"
                className="h-8 w-8 object-contain transition-transform group-hover:scale-105"
              />
              <span className="text-lg font-black tracking-tight text-brand-blue">
                GenForms.ai
              </span>
            </Link>
          </div>

          {sidebar?.nav?.items && (
            <div className="absolute left-1/2 hidden -translate-x-1/2 lg:block">
              <SidebarNav
                items={sidebar.nav?.items}
              />
            </div>
          )}

          <div className="flex items-center gap-4">
            <LocaleToggle />
            <ThemeToggle />
            <Link
              href={localizeHref("/settings", locale)}
              className="group flex items-center gap-3 rounded-2xl p-1.5 transition-all hover:bg-slate-50"
            >
              <div className="hidden flex-col items-end sm:flex">
                <span className="text-xs font-black text-slate-900 leading-tight">{(userInfo as any)?.name || (userInfo as any)?.nickname || "Mike Admin"}</span>
                <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-tight">Pro Plan</span>
              </div>
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-blue text-xs font-bold text-white shadow-md">
                {(userInfo as any)?.name?.[0]?.toUpperCase() || (userInfo as any)?.nickname?.[0]?.toUpperCase() || "M"}
              </div>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1 flex flex-col min-h-0">
        {children}
      </main>
    </div>
  );
}
