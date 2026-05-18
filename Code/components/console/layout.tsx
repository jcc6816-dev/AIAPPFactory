import { ReactNode } from "react";
import { Sidebar } from "@/types/blocks/sidebar";
import SidebarNav from "@/components/console/sidebar/nav";
import Link from "next/link";
import Icon from "@/components/icon";

import { getUserInfo } from "@/services/user";

export default async function ConsoleLayout({
  children,
  sidebar,
}: {
  children: ReactNode;
  sidebar?: Sidebar;
}) {
  const userInfo = await getUserInfo();

  return (
    <div className="h-screen overflow-hidden bg-slate-50 text-slate-950 flex flex-col">
      <header className="sticky top-0 z-50 h-16 border-b border-slate-200 bg-white px-6">
        <div className="flex h-full items-center justify-between">
          <div className="flex items-center gap-2">
            <Link href="/forms" className="group flex items-center gap-2.5 transition-all hover:opacity-80">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-blue text-white shadow-lg shadow-brand-blue/30 transition-transform group-hover:rotate-[-10deg]">
                <Icon name="RiShip2Line" className="h-5 w-5" />
              </span>
              <span className="text-lg font-black tracking-tight text-brand-blue">
                ShipAny AI
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
            <Link
              href="/settings"
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
