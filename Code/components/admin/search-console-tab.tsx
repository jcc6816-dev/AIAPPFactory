"use client";

import { useState } from "react";
import { Loader2, AlertCircle, Info, Smartphone, Laptop, Tablet } from "lucide-react";

interface GscMetric {
  key: string;
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
}

interface SearchConsoleTabProps {
  gscData: {
    summary: {
      clicks: number;
      impressions: number;
      ctr: number;
      position: number;
    };
    queries: GscMetric[];
    pages: GscMetric[];
    countries: GscMetric[];
    devices: GscMetric[];
    fromCache: boolean;
    lastFetchedAt: string;
  } | null;
  isLoading: boolean;
  errorMsg: string | null;
  configMissing: boolean;
  isZh: boolean;
}

export default function SearchConsoleTab({
  gscData,
  isLoading,
  errorMsg,
  configMissing,
  isZh,
}: SearchConsoleTabProps) {
  const [activeSubTab, setActiveSubTab] = useState<"queries" | "pages" | "countries" | "devices">("queries");

  // 1. 加载中
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-3 border border-slate-200 bg-white rounded-2xl shadow-sm">
        <Loader2 className="size-8 text-blue-600 animate-spin" />
        <p className="text-xs text-slate-500 font-bold">
          {isZh ? "正在拉取 Google Search Console 搜索数据..." : "Fetching Google Search Console insights..."}
        </p>
      </div>
    );
  }

  // 2. 配置缺失
  if (configMissing) {
    return (
      <div className="rounded-2xl border border-amber-200 bg-amber-50/50 p-6 flex flex-col sm:flex-row gap-4 items-start shadow-sm">
        <AlertCircle className="size-5 text-amber-600 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <h4 className="text-sm font-black text-slate-900">
            {isZh ? "Google Search Console API 未配置" : "Google Search Console API Not Configured"}
          </h4>
          <p className="text-xs leading-relaxed text-slate-600 font-medium">
            {isZh
              ? "服务器环境变量中缺失 GOOGLE_SERVICE_ACCOUNT_KEY 或 GSC_PROPERTY_URL。请在部署环境配置这些参数以启用自然搜索分析。"
              : "The environment variables GOOGLE_SERVICE_ACCOUNT_KEY or GSC_PROPERTY_URL are missing on your server. Configure them to enable organic search analysis."}
          </p>
        </div>
      </div>
    );
  }

  // 3. API 拉取报错
  if (errorMsg) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50/50 p-6 flex flex-col sm:flex-row gap-4 items-start shadow-sm">
        <AlertCircle className="size-5 text-red-600 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <h4 className="text-sm font-black text-slate-900">
            {isZh ? "GSC API 数据拉取失败" : "GSC API Fetch Failed"}
          </h4>
          <p className="text-xs leading-relaxed text-red-700/90 font-medium font-mono">
            {errorMsg}
          </p>
          <p className="text-[10.5px] leading-relaxed text-slate-500 pt-1">
            {isZh
              ? "💡 提示：请确保已向该 Google 服务账号授权（Restricted User），或者验证您的网域所有权配置。"
              : "💡 Tip: Make sure the Google Service Account is granted access (Restricted User) to your property, or verify your property ownership URL."}
          </p>
        </div>
      </div>
    );
  }

  // 4. 无数据状态
  if (!gscData) {
    return (
      <div className="py-20 text-center text-slate-400 font-bold border border-slate-200 bg-white rounded-2xl shadow-sm">
        {isZh ? "暂无可用搜索分析数据。" : "No Search Console data available."}
      </div>
    );
  }

  const activeList = gscData[activeSubTab] || [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div>
          <h3 className="text-sm font-black text-slate-900">
            {isZh ? "Google Search Console 自然搜索表现" : "Google Search Console Performance"}
          </h3>
          <p className="mt-1 text-[11px] font-bold text-slate-400">
            {isZh
              ? "监测自然搜索带来的展现、点击、点击率与关键词排名分布。"
              : "Monitor organic search impressions, clicks, click-through rates, and query rankings."}
          </p>
        </div>
      </div>
      {/* GSC 汇总看板 */}
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          label={isZh ? "搜索点击数" : "Organic Clicks"}
          value={gscData.summary.clicks.toLocaleString()}
          hint={isZh ? "点击进入网站的次数" : "Total organic search clicks"}
        />
        <MetricCard
          label={isZh ? "搜索曝光数" : "Organic Impressions"}
          value={gscData.summary.impressions.toLocaleString()}
          hint={isZh ? "在搜索结果中的展现次数" : "Total organic impressions"}
        />
        <MetricCard
          label={isZh ? "平均点击率 (CTR)" : "Average CTR"}
          value={`${gscData.summary.ctr.toFixed(2)}%`}
          hint={isZh ? "点击量 / 曝光量" : "Click-through rate"}
        />
        <MetricCard
          label={isZh ? "平均排名" : "Average Position"}
          value={gscData.summary.position.toFixed(1)}
          hint={isZh ? "在搜索结果中的平均排位" : "Average search ranking"}
        />
      </section>

      {/* 细节数据面板 */}
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div className="flex border-b border-slate-100 gap-1">
            {(["queries", "pages", "countries", "devices"] as const).map((tab) => {
              const label = {
                queries: isZh ? "热门搜索词 (Queries)" : "Queries",
                pages: isZh ? "热门受访页 (Pages)" : "Pages",
                countries: isZh ? "地理国家 (Countries)" : "Countries",
                devices: isZh ? "设备类型 (Devices)" : "Devices",
              }[tab];

              return (
                <button
                  key={tab}
                  onClick={() => setActiveSubTab(tab)}
                  className={`px-4 py-2 text-xs font-black transition-all border-b-2 -mb-px ${
                    activeSubTab === tab
                      ? "border-blue-600 text-blue-600 font-extrabold"
                      : "border-transparent text-slate-400 hover:text-slate-900"
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-1 text-[10.5px] font-bold text-slate-400">
            <Info className="size-3" />
            <span>
              {isZh
                ? `缓存状态：${gscData.fromCache ? "24h 服务端缓存" : "刚刚拉取"}`
                : `Cache: ${gscData.fromCache ? "24h cached" : "fresh"}`}
            </span>
          </div>
        </div>

        <div className="overflow-x-auto border border-slate-100 rounded-xl shadow-inner max-h-[420px] overflow-y-auto">
          <table className="w-full border-collapse text-left text-xs text-slate-600">
            <thead className="bg-slate-50 text-[10px] font-black uppercase text-slate-400 sticky top-0 z-10 border-b border-slate-100">
              <tr>
                <th className="px-4 py-3 min-w-[200px]">
                  {activeSubTab === "queries" ? (isZh ? "搜索关键词" : "Search Query") : ""}
                  {activeSubTab === "pages" ? (isZh ? "页面 URL" : "Page URL") : ""}
                  {activeSubTab === "countries" ? (isZh ? "国家/地区" : "Country/Region") : ""}
                  {activeSubTab === "devices" ? (isZh ? "设备类别" : "Device Category") : ""}
                </th>
                <th className="px-3 py-3 text-right">{isZh ? "点击数" : "Clicks"}</th>
                <th className="px-3 py-3 text-right">{isZh ? "曝光数" : "Impressions"}</th>
                <th className="px-3 py-3 text-right">{isZh ? "点击率 (CTR)" : "CTR"}</th>
                <th className="px-3 py-3 text-right">{isZh ? "平均排名" : "Avg. Position"}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {activeList.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-slate-400 font-bold">
                    {isZh ? "该维度下暂无统计指标。" : "No metrics available for this dimension."}
                  </td>
                </tr>
              ) : (
                activeList.map((row, idx) => {
                  let displayKey = row.key;
                  let icon = null;
                  if (activeSubTab === "devices") {
                    if (row.key.toLowerCase() === "desktop") {
                      icon = <Laptop className="size-3.5 text-slate-500 inline mr-1.5 shrink-0" />;
                      displayKey = isZh ? "电脑端 (Desktop)" : "Desktop";
                    } else if (row.key.toLowerCase() === "mobile") {
                      icon = <Smartphone className="size-3.5 text-slate-500 inline mr-1.5 shrink-0" />;
                      displayKey = isZh ? "手机端 (Mobile)" : "Mobile";
                    } else if (row.key.toLowerCase() === "tablet") {
                      icon = <Tablet className="size-3.5 text-slate-500 inline mr-1.5 shrink-0" />;
                      displayKey = isZh ? "平板端 (Tablet)" : "Tablet";
                    }
                  }

                  return (
                    <tr key={`${row.key}-${idx}`} className="hover:bg-slate-50/50 transition-all font-semibold">
                      <td className="px-4 py-3 truncate max-w-[320px] font-bold text-slate-900" title={row.key}>
                        <span className="flex items-center">
                          {icon}
                          <span className="truncate">{displayKey}</span>
                        </span>
                      </td>
                      <td className="px-3 py-3 text-right font-black text-slate-950">{row.clicks.toLocaleString()}</td>
                      <td className="px-3 py-3 text-right text-slate-500">{row.impressions.toLocaleString()}</td>
                      <td className="px-3 py-3 text-right text-slate-500">{row.ctr.toFixed(2)}%</td>
                      <td className="px-3 py-3 text-right text-slate-500">{row.position.toFixed(1)}</td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

function MetricCard({
  label,
  value,
  hint,
}: {
  label: string;
  value: string;
  hint?: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-[11px] font-extrabold uppercase tracking-widest text-slate-400">
        {label}
      </p>
      <p className="mt-2 text-2xl font-black tracking-tight text-slate-950">
        {value}
      </p>
      {hint && <p className="mt-1 text-[10px] font-bold text-slate-400">{hint}</p>}
    </div>
  );
}
