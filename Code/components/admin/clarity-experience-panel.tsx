"use client";

import { useEffect, useState } from "react";
import { Loader2, AlertCircle, Info, RefreshCw, Smartphone, Laptop, Tablet } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ClarityMetric {
  key: string;
  sessions: number;
  scrollDepth: number;
  engagementTime: number;
  deadClicks: number;
  rageClicks: number;
  quickBacks: number;
  scriptErrors: number;
}

export default function ClarityExperiencePanel({ isZh }: { isZh: boolean }) {
  const [data, setData] = useState<{
    url: ClarityMetric[];
    device: ClarityMetric[];
    countryRegion: ClarityMetric[];
    fromCache: boolean;
    lastFetchedAt: string;
    numOfDays: number;
  } | null>(null);

  const [numOfDays, setNumOfDays] = useState<number>(1);
  const [activeTab, setActiveTab] = useState<"url" | "device" | "countryRegion">("url");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [configMissing, setConfigMissing] = useState<boolean>(false);

  async function fetchSummary(days: number) {
    setIsLoading(true);
    setErrorMsg(null);
    setConfigMissing(false);
    try {
      const response = await fetch(`/api/admin/clarity/summary?numOfDays=${days}`);
      if (response.status === 403) {
        throw new Error(isZh ? "未授权：仅管理员可访问。" : "Unauthorized: Admin access only.");
      }
      
      const json = await response.json();
      if (json.code === 1) {
        // Token 缺失
        setConfigMissing(true);
        setData(null);
      } else if (json.code !== 0) {
        // API 报错或者超限
        setErrorMsg(json.message || (isZh ? "无法从 Clarity API 提取数据" : "Failed to load from Clarity API"));
        setData(null);
      } else {
        // 成功
        setData(json.data);
      }
    } catch (e: any) {
      setErrorMsg(e.message || (isZh ? "获取数据时发生网络异常" : "Network error while fetching data"));
      setData(null);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchSummary(numOfDays);
  }, [numOfDays]);

  const activeDataList = data ? data[activeTab] : [];

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6 border-b border-slate-100 pb-4">
        <div>
          <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
            <span>{isZh ? "Clarity 用户行为与体验指标" : "Clarity Experience Analytics"}</span>
            <span className="text-[10px] font-black px-1.5 py-0.5 rounded-full bg-blue-50 text-blue-600 border border-blue-100">
              API
            </span>
          </h3>
          <p className="text-[11px] font-bold text-slate-400 mt-1">
            {isZh
              ? "最近 1-3 天体验汇总（包括无效点击、愤怒点击、快速返回、脚本错误）。"
              : "Summary of negative interaction patterns for the last 1-3 days (dead clicks, rage clicks, quickbacks, script errors)."}
          </p>
        </div>

        {/* 筛选控制器 */}
        <div className="flex items-center gap-2">
          <div className="flex rounded-xl bg-slate-100 p-1">
            {([1, 2, 3] as const).map((days) => (
              <button
                key={days}
                onClick={() => setNumOfDays(days)}
                disabled={isLoading}
                className={`rounded-lg px-3 py-1 text-xs font-black transition-all ${
                  numOfDays === days
                    ? "bg-white text-slate-900 shadow-sm"
                    : "text-slate-500 hover:text-slate-900"
                }`}
              >
                {days}{isZh ? "天内" : "d"}
              </button>
            ))}
          </div>

          <Button
            variant="outline"
            size="icon"
            onClick={() => fetchSummary(numOfDays)}
            disabled={isLoading}
            className="size-7 rounded-xl"
          >
            <RefreshCw className={`size-3 text-slate-500 ${isLoading ? "animate-spin" : ""}`} />
          </Button>
        </div>
      </div>

      {/* 1. 加载中 */}
      {isLoading && (
        <div className="flex flex-col items-center justify-center py-20 gap-3 border border-slate-200 bg-white rounded-2xl shadow-sm">
          <Loader2 className="size-8 text-blue-600 animate-spin" />
          <p className="text-xs text-slate-500 font-bold">
            {isZh ? "正在拉取 Clarity 体验分析..." : "Fetching Clarity insights..."}
          </p>
        </div>
      )}

      {/* 2. 配置缺失 */}
      {!isLoading && configMissing && (
        <div className="rounded-2xl border border-amber-200 bg-amber-50/50 p-6 flex flex-col sm:flex-row gap-4 items-start shadow-sm">
          <AlertCircle className="size-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h4 className="text-sm font-black text-slate-900">
              {isZh ? "Clarity API Token 未配置" : "Clarity API Token Not Configured"}
            </h4>
            <p className="text-xs leading-relaxed text-slate-600 font-medium">
              {isZh
                ? "系统检测到服务器环境变量中缺少 CLARITY_API_TOKEN 秘钥。请在部署环境配置此 token 以启用最近 1-3 天的用户体验负面指标面板。"
                : "The environment variable CLARITY_API_TOKEN is missing on your server. Configure it to enable live negative UX insights for the last 1-3 days."}
            </p>
          </div>
        </div>
      )}

      {/* 3. API 拉取报错 */}
      {!isLoading && errorMsg && (
        <div className="rounded-2xl border border-red-200 bg-red-50/50 p-6 flex flex-col sm:flex-row gap-4 items-start shadow-sm">
          <AlertCircle className="size-5 text-red-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h4 className="text-sm font-black text-slate-900">
              {isZh ? "Clarity API 数据拉取失败" : "Clarity API Fetch Failed"}
            </h4>
            <p className="text-xs leading-relaxed text-red-700/90 font-medium font-mono">
              {errorMsg}
            </p>
            <p className="text-[10.5px] leading-relaxed text-slate-500 pt-1">
              {isZh
                ? "💡 提示：请确保 Token 配置正确，或由于微软限制每日上限 10 次请求，请稍后重试。"
                : "💡 Tip: Please verify the token settings. Microsoft limits Live Insights to 10 requests per day per project."}
            </p>
          </div>
        </div>
      )}

      {/* 4. 正常数据展示 */}
      {!isLoading && data && (
        <div className="space-y-4">
          {/* 元数据说明条 */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-50 border border-slate-100 rounded-xl px-4 py-2 text-[10.5px] font-bold text-slate-500">
            <div className="flex items-center gap-1">
              <Info className="size-3 text-slate-400" />
              <span>
                {isZh
                  ? `数据缓存：${data.fromCache ? "已启用缓存 (12h)" : "刚刚拉取最新"}`
                  : `Cache state: ${data.fromCache ? "Cached (12h)" : "Just fetched"}`}
              </span>
            </div>
            {data.lastFetchedAt && (
              <div>
                {isZh ? "同步时间：" : "Synced at: "}
                {new Date(data.lastFetchedAt).toLocaleString(isZh ? "zh-CN" : "en-US")}
              </div>
            )}
          </div>

          {/* 维度 Tab 切换 */}
          <div className="flex border-b border-slate-100 gap-1 mt-2">
            {(["url", "device", "countryRegion"] as const).map((tab) => {
              const label = {
                url: isZh ? "受访页面 (URLs)" : "URLs",
                device: isZh ? "设备类型 (Devices)" : "Devices",
                countryRegion: isZh ? "地区分布 (Countries)" : "Countries/Regions",
              }[tab];

              return (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 text-xs font-black transition-all border-b-2 -mb-px ${
                    activeTab === tab
                      ? "border-blue-600 text-blue-600 font-extrabold"
                      : "border-transparent text-slate-400 hover:text-slate-900"
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>

          {/* 数据指标表 */}
          <div className="overflow-x-auto border border-slate-100 rounded-xl shadow-inner max-h-[420px] overflow-y-auto">
            <table className="w-full border-collapse text-left text-xs text-slate-600">
              <thead className="bg-slate-50 text-[10px] font-black uppercase text-slate-400 sticky top-0 z-10 border-b border-slate-100">
                <tr>
                  <th className="px-4 py-3 min-w-[150px]">
                    {activeTab === "url" ? (isZh ? "页面路径" : "Path") : isZh ? "类型/维度" : "Dimension"}
                  </th>
                  <th className="px-3 py-3 text-right">{isZh ? "会话数" : "Sessions"}</th>
                  <th className="px-3 py-3 text-right">{isZh ? "平均停留" : "Avg. Duration"}</th>
                  <th className="px-3 py-3 text-right">{isZh ? "平均滚深" : "Scroll Depth"}</th>
                  <th className="px-3 py-3 text-right">{isZh ? "无效点击" : "Dead Clicks"}</th>
                  <th className="px-3 py-3 text-right">{isZh ? "愤怒点击" : "Rage Clicks"}</th>
                  <th className="px-3 py-3 text-right">{isZh ? "快速返回" : "Quick Backs"}</th>
                  <th className="px-3 py-3 text-right">{isZh ? "脚本错误" : "Script Errors"}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {activeDataList.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-8 text-center text-slate-400 font-bold">
                      {isZh ? "该维度下暂无统计指标。" : "No metrics available for this dimension."}
                    </td>
                  </tr>
                ) : (
                  activeDataList.map((row) => {
                    // 页面名称美化与设备图标
                    let displayKey = row.key;
                    let icon = null;
                    if (activeTab === "device") {
                      if (row.key.toLowerCase() === "pc" || row.key.toLowerCase() === "desktop") {
                        icon = <Laptop className="size-3.5 text-slate-500 inline mr-1.5 shrink-0" />;
                        displayKey = isZh ? "电脑端 (PC)" : "Desktop";
                      } else if (row.key.toLowerCase() === "mobile" || row.key.toLowerCase() === "phone") {
                        icon = <Smartphone className="size-3.5 text-slate-500 inline mr-1.5 shrink-0" />;
                        displayKey = isZh ? "手机端 (Mobile)" : "Mobile";
                      } else if (row.key.toLowerCase() === "tablet") {
                        icon = <Tablet className="size-3.5 text-slate-500 inline mr-1.5 shrink-0" />;
                        displayKey = isZh ? "平板端 (Tablet)" : "Tablet";
                      }
                    }

                    return (
                      <tr key={row.key} className="hover:bg-slate-50/50 transition-all font-semibold">
                        <td className="px-4 py-3 truncate max-w-[280px] font-bold text-slate-900" title={row.key}>
                          <span className="flex items-center">
                            {icon}
                            <span className="truncate">{displayKey}</span>
                          </span>
                        </td>
                        <td className="px-3 py-3 text-right font-black text-slate-950">{row.sessions.toLocaleString()}</td>
                        <td className="px-3 py-3 text-right text-slate-500">
                          {row.engagementTime ? `${row.engagementTime}s` : "-"}
                        </td>
                        <td className="px-3 py-3 text-right text-slate-500">
                          {row.scrollDepth ? `${Math.round(row.scrollDepth)}%` : "-"}
                        </td>
                        <td className={`px-3 py-3 text-right font-extrabold ${row.deadClicks > 5 ? "text-amber-600" : "text-slate-500"}`}>
                          {row.deadClicks || "-"}
                        </td>
                        <td className={`px-3 py-3 text-right font-extrabold ${row.rageClicks > 0 ? "text-red-500" : "text-slate-500"}`}>
                          {row.rageClicks || "-"}
                        </td>
                        <td className={`px-3 py-3 text-right font-extrabold ${row.quickBacks > 5 ? "text-amber-600" : "text-slate-500"}`}>
                          {row.quickBacks || "-"}
                        </td>
                        <td className={`px-3 py-3 text-right font-extrabold ${row.scriptErrors > 0 ? "text-red-400" : "text-slate-500"}`}>
                          {row.scriptErrors || "-"}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </section>
  );
}
