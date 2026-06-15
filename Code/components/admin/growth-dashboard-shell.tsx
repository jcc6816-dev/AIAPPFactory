"use client";

import { useEffect, useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import OverviewTab from "./overview-tab";
import SearchConsoleTab from "./search-console-tab";
import Ga4FunnelTab from "./ga4-funnel-tab";
import ClarityExperiencePanel from "./clarity-experience-panel";
import GrowthActionsTab from "./growth-actions-tab";
import PageSpeedTab from "./pagespeed-tab";

interface GrowthDashboardShellProps {
  summary: any;
  isZh: boolean;
}

export default function GrowthDashboardShell({ summary, isZh }: GrowthDashboardShellProps) {
  const [activeTab, setActiveTab] = useState<string>("overview");
  const [days, setDays] = useState<number>(28);

  // PageSpeed State
  const [pageSpeedData, setPageSpeedData] = useState<any>(null);

  // GSC State
  const [gscData, setGscData] = useState<any>(null);
  const [gscLoading, setGscLoading] = useState<boolean>(false);
  const [gscError, setGscError] = useState<string | null>(null);
  const [gscConfigMissing, setGscConfigMissing] = useState<boolean>(false);

  // GA4 State
  const [ga4Data, setGa4Data] = useState<any>(null);
  const [ga4Loading, setGa4Loading] = useState<boolean>(false);
  const [ga4Error, setGa4Error] = useState<string | null>(null);
  const [ga4ConfigMissing, setGa4ConfigMissing] = useState<boolean>(false);

  async function fetchGscData(selectedDays: number) {
    setGscLoading(true);
    setGscError(null);
    setGscConfigMissing(false);
    try {
      const response = await fetch(`/api/admin/gsc/summary?numOfDays=${selectedDays}`);
      if (response.status === 403) {
        throw new Error(isZh ? "未授权：仅管理员可访问。" : "Unauthorized: Admin access only.");
      }
      const json = await response.json();
      if (json.code === 1) {
        setGscConfigMissing(true);
        setGscData(null);
      } else if (json.code !== 0) {
        setGscError(json.message || "Failed to load GSC data");
        setGscData(null);
      } else {
        setGscData(json.data);
      }
    } catch (err: any) {
      setGscError(err.message || "Network error while loading GSC data");
      setGscData(null);
    } finally {
      setGscLoading(false);
    }
  }

  async function fetchGa4Data(selectedDays: number) {
    setGa4Loading(true);
    setGa4Error(null);
    setGa4ConfigMissing(false);
    try {
      const response = await fetch(`/api/admin/ga4/summary?numOfDays=${selectedDays}`);
      if (response.status === 403) {
        throw new Error(isZh ? "未授权：仅管理员可访问。" : "Unauthorized: Admin access only.");
      }
      const json = await response.json();
      if (json.code === 1) {
        setGa4ConfigMissing(true);
        setGa4Data(null);
      } else if (json.code !== 0) {
        setGa4Error(json.message || "Failed to load GA4 data");
        setGa4Data(null);
      } else {
        setGa4Data(json.data);
      }
    } catch (err: any) {
      setGa4Error(err.message || "Network error while loading GA4 data");
      setGa4Data(null);
    } finally {
      setGa4Loading(false);
    }
  }

  // 并发拉取 GSC 和 GA4 数据
  useEffect(() => {
    Promise.all([fetchGscData(days), fetchGa4Data(days)]);
  }, [days]);

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-slate-200 pb-2 gap-3">
        <TabsList className="bg-slate-100 p-1 rounded-xl h-11 flex flex-wrap max-w-full overflow-x-auto justify-start">
          <TabsTrigger value="overview" className="rounded-lg font-bold px-4 py-2 text-xs">
            {isZh ? "总览仪表盘" : "Overview"}
          </TabsTrigger>
          <TabsTrigger value="search-console" className="rounded-lg font-bold px-4 py-2 text-xs">
            {isZh ? "谷歌搜索 (Search Console)" : "Search Console"}
          </TabsTrigger>
          <TabsTrigger value="ga4-funnel" className="rounded-lg font-bold px-4 py-2 text-xs">
            {isZh ? "流量与转化 (GA4)" : "GA4"}
          </TabsTrigger>
          <TabsTrigger value="clarity" className="rounded-lg font-bold px-4 py-2 text-xs">
            {isZh ? "交互体验 (Clarity)" : "Clarity"}
          </TabsTrigger>
          <TabsTrigger value="pagespeed" className="rounded-lg font-bold px-4 py-2 text-xs">
            {isZh ? "页面性能 (PageSpeed)" : "PageSpeed"}
          </TabsTrigger>
          <TabsTrigger value="growth-actions" className="rounded-lg font-bold px-4 py-2 text-xs">
            {isZh ? "增长诊断建议" : "Growth Actions"}
          </TabsTrigger>
        </TabsList>

        {/* 仅在指定 Tab 显示天数切换器 */}
        {["search-console", "ga4-funnel", "growth-actions"].includes(activeTab) && (
          <div className="flex rounded-xl bg-slate-100 p-1 shrink-0">
            {([7, 28] as const).map((d) => (
              <button
                key={d}
                onClick={() => setDays(d)}
                disabled={gscLoading || ga4Loading}
                className={`rounded-lg px-3 py-1 text-xs font-black transition-all ${
                  days === d
                    ? "bg-white text-slate-900 shadow-sm"
                    : "text-slate-500 hover:text-slate-900"
                }`}
              >
                {d === 7 ? (isZh ? "近7天" : "7 Days") : (isZh ? "近28天" : "28 Days")}
              </button>
            ))}
          </div>
        )}
      </div>

      <TabsContent value="overview" className="outline-none focus:ring-0">
        <OverviewTab summary={summary} isZh={isZh} />
      </TabsContent>

      <TabsContent value="search-console" className="outline-none focus:ring-0">
        <SearchConsoleTab
          gscData={gscData}
          isLoading={gscLoading}
          errorMsg={gscError}
          configMissing={gscConfigMissing}
          isZh={isZh}
        />
      </TabsContent>

      <TabsContent value="ga4-funnel" className="outline-none focus:ring-0">
        <Ga4FunnelTab
          ga4Data={ga4Data}
          isLoading={ga4Loading}
          errorMsg={ga4Error}
          configMissing={ga4ConfigMissing}
          isZh={isZh}
        />
      </TabsContent>

      <TabsContent value="clarity" className="outline-none focus:ring-0">
        <ClarityExperiencePanel isZh={isZh} />
      </TabsContent>

      <TabsContent value="pagespeed" className="outline-none focus:ring-0">
        <PageSpeedTab isZh={isZh} onDataLoaded={setPageSpeedData} />
      </TabsContent>

      <TabsContent value="growth-actions" className="outline-none focus:ring-0">
        <GrowthActionsTab
          gscData={gscData}
          ga4Data={ga4Data}
          pageSpeedData={pageSpeedData}
          isLoadingGsc={gscLoading}
          isLoadingGa4={ga4Loading}
          isZh={isZh}
        />
      </TabsContent>
    </Tabs>
  );
}

