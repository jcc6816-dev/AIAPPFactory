import { getGrowthAnalyticsSummary } from "@/services/growth-analytics";
import GrowthDashboardShell from "@/components/admin/growth-dashboard-shell";

export default async function AdminGrowthPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const isZh = locale === "zh";
  const summary = await getGrowthAnalyticsSummary();

  return (
    <div className="w-full px-4 py-8 md:px-8">
      <div className="mb-8">
        <p className="text-[11px] font-extrabold uppercase tracking-widest text-brand-blue">
          {isZh ? "数据驾驶舱" : "Growth Cockpit"}
        </p>
        <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-950">
          {isZh ? "数据与转化驾驶舱" : "Growth & Promotion Dashboard"}
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {isZh
            ? "集中式监控自然曝光、页面流失漏斗以及用户体验，指引流量与获客转化。"
            : "Centralized tracking of organic rankings, conversion funnels, and negative user friction."}
        </p>
      </div>

      <GrowthDashboardShell summary={summary} isZh={isZh} />
    </div>
  );
}
