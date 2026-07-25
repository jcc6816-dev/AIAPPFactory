"use client";

import { useState } from "react";
import { AlertCircle, BarChart3, Globe2, Info, Loader2, Route } from "lucide-react";

interface Ga4MetricRow {
  key: string;
  sessions: number;
  activeUsers: number;
  eventCount: number;
}

interface Ga4EventRow {
  eventName: string;
  eventCount: number;
}

interface Ga4Data {
  summary: {
    sessions: number;
    activeUsers: number;
    newUsers: number;
    eventCount: number;
  };
  funnel: Ga4EventRow[];
  sources: Ga4MetricRow[];
  landingPages: Ga4MetricRow[];
  devices: Ga4MetricRow[];
  countries: Ga4MetricRow[];
  fromCache: boolean;
  lastFetchedAt: string;
  numOfDays: number;
}

interface Ga4FunnelTabProps {
  ga4Data: Ga4Data | null;
  isLoading: boolean;
  errorMsg: string | null;
  configMissing: boolean;
  isZh: boolean;
}

const EVENT_LABELS: Record<string, { zh: string; en: string }> = {
  demo_start: {
    zh: "开始免登录体验 (Demo)",
    en: "Demo Started",
  },
  demo_complete: {
    zh: "完成表单体验 (Demo)",
    en: "Demo Completed",
  },
  template_use_click: {
    zh: "选择并套用表单模板",
    en: "Template Use Click",
  },
  form_generate: {
    zh: "真实触发表单生成",
    en: "Form Generated",
  },
  form_saved: {
    zh: "真实创建表单成功",
    en: "Form Created",
  },
  form_publish: {
    zh: "成功发布表单页面",
    en: "Form Published",
  },
  form_submit: {
    zh: "公开收集数据提交",
    en: "Form Submitted",
  },
};

export default function Ga4FunnelTab({
  ga4Data,
  isLoading,
  errorMsg,
  configMissing,
  isZh,
}: Ga4FunnelTabProps) {
  const [activeTable, setActiveTable] = useState<"sources" | "landingPages" | "devices" | "countries">("sources");

  // 1. 加载中
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-3 border border-slate-200 bg-white rounded-2xl shadow-sm">
        <Loader2 className="size-8 text-blue-600 animate-spin" />
        <p className="text-xs text-slate-500 font-bold">
          {isZh ? "正在拉取 GA4 流量与激活漏斗..." : "Fetching GA4 traffic and activation metrics..."}
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
            {isZh ? "Google Analytics 4 API 未配置" : "Google Analytics 4 API Not Configured"}
          </h4>
          <p className="text-xs leading-relaxed text-slate-600 font-medium">
            {isZh
              ? "服务器环境变量中缺失 GOOGLE_SERVICE_ACCOUNT_KEY 或 GA4_PROPERTY_ID。配置后即可查看流量激活漏斗和渠道流量指标。"
              : "The environment variables GOOGLE_SERVICE_ACCOUNT_KEY or GA4_PROPERTY_ID are missing. Configure them to enable traffic acquisition and activation funnel insights."}
          </p>
        </div>
      </div>
    );
  }

  // 3. API 拉取故障
  if (errorMsg) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50/50 p-6 flex flex-col sm:flex-row gap-4 items-start shadow-sm">
        <AlertCircle className="size-5 text-red-600 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <h4 className="text-sm font-black text-slate-900">
            {isZh ? "GA4 API 数据拉取失败" : "GA4 API Fetch Failed"}
          </h4>
          <p className="text-xs leading-relaxed text-red-700/90 font-medium font-mono">
            {errorMsg}
          </p>
          <p className="text-[10.5px] leading-relaxed text-slate-500 pt-1">
            {isZh
              ? "💡 提示：请确保服务账号已被授予 GA4 媒体资源的 Viewer 权限，或检查网络连接。"
              : "💡 Tip: Verify that the service account has been granted Viewer permission on the GA4 property."}
          </p>
        </div>
      </div>
    );
  }

  // 4. 无数据状态
  if (!ga4Data) {
    return (
      <div className="py-20 text-center text-slate-400 font-bold border border-slate-200 bg-white rounded-2xl shadow-sm">
        {isZh ? "暂无可用流量分析数据。" : "No GA4 metrics available."}
      </div>
    );
  }

  const tableRows = ga4Data[activeTable] || [];
  const maxEventCount = Math.max(...ga4Data.funnel.map((item) => item.eventCount), 1);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div>
          <h3 className="text-sm font-black text-slate-900">
            {isZh ? "GA4 流量与关键事件激活漏斗" : "GA4 Traffic & Activation Funnel"}
          </h3>
          <p className="mt-1 text-[11px] font-bold text-slate-400">
            {isZh
              ? "监测从免登录 Demo 体验到最终真实表单发布与公开提交的全链路流失率。"
              : "Monitor traffic drop-offs from sandbox demo experience to formal form publishing and collection."}
          </p>
        </div>
      </div>

      {/* 核心指标卡片 */}
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          label={isZh ? "独立会话数" : "Sessions"}
          value={ga4Data.summary.sessions.toLocaleString()}
          hint={isZh ? "独立访问会话量" : "Total traffic sessions"}
        />
        <MetricCard
          label={isZh ? "活跃用户数" : "Active Users"}
          value={ga4Data.summary.activeUsers.toLocaleString()}
          hint={isZh ? "已识别的去重活跃用户" : "Deduplicated active users"}
        />
        <MetricCard
          label={isZh ? "新注册/新用户" : "New Users"}
          value={ga4Data.summary.newUsers.toLocaleString()}
          hint={isZh ? "首次访问网站的用户" : "First-time visitors"}
        />
        <MetricCard
          label={isZh ? "事件量 (Event Count)" : "Event Count"}
          value={ga4Data.summary.eventCount.toLocaleString()}
          hint={isZh ? "全站捕获的全部事件数" : "Total events recorded"}
        />
      </section>

      {/* 漏斗分析 */}
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-5 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Route className="size-4 text-blue-600" />
            <h4 className="text-sm font-black text-slate-900">
              {isZh ? "核心行为激活漏斗" : "Core Activation Funnel"}
            </h4>
          </div>
          <div className="flex items-center gap-1 text-[10.5px] font-bold text-slate-400">
            <Info className="size-3" />
            <span>
              {isZh
                ? `缓存状态：${ga4Data.fromCache ? "1h 服务端缓存" : "刚刚拉取"}`
                : `Cache: ${ga4Data.fromCache ? "1h cached" : "fresh"}`}
            </span>
          </div>
        </div>

        <div className="space-y-4">
          {ga4Data.funnel.map((item, index) => {
            const previous = index > 0 ? ga4Data.funnel[index - 1]?.eventCount || 0 : item.eventCount;
            const rate = previous > 0 ? (item.eventCount / previous) * 100 : 0;
            const width = (item.eventCount / maxEventCount) * 100;
            const label = EVENT_LABELS[item.eventName];

            return (
              <div key={item.eventName}>
                <div className="mb-2 flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate text-xs font-black text-slate-900">
                      {isZh ? label?.zh || item.eventName : label?.en || item.eventName}
                    </p>
                    <p className="mt-0.5 font-mono text-[10px] font-bold text-slate-400">
                      {item.eventName}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-black text-slate-950 font-mono">
                      {item.eventCount.toLocaleString()}
                    </p>
                    <p className="text-[10px] font-bold text-slate-400 font-mono">
                      {index === 0 ? "100%" : `${rate.toFixed(1)}%`}
                    </p>
                  </div>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                  <div
                    className="h-full rounded-full bg-blue-600"
                    style={{ width: `${Math.max(width, item.eventCount > 0 ? 3 : 0)}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 来源与页面维度表格 */}
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Globe2 className="size-4 text-blue-600" />
            <h4 className="text-sm font-black text-slate-900">
              {isZh ? "流量获取与渠道细分" : "Acquisition & Channel Distribution"}
            </h4>
          </div>

          <div className="flex flex-wrap gap-1 rounded-xl bg-slate-100 p-1">
            {(["sources", "landingPages", "devices", "countries"] as const).map((key) => (
              <button
                key={key}
                onClick={() => setActiveTable(key)}
                className={`rounded-lg px-3 py-1 text-[11px] font-black transition-all ${
                  activeTable === key
                    ? "bg-white text-slate-900 shadow-sm"
                    : "text-slate-500 hover:text-slate-900"
                }`}
              >
                {getTableLabel(key, isZh)}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto border border-slate-100 rounded-xl shadow-inner max-h-[420px] overflow-y-auto">
          <table className="w-full border-collapse text-left text-xs text-slate-600">
            <thead className="bg-slate-50 text-[10px] font-black uppercase text-slate-400 sticky top-0 z-10 border-b border-slate-100">
              <tr>
                <th className="min-w-[220px] px-4 py-3">{getTableLabel(activeTable, isZh)}</th>
                <th className="px-3 py-3 text-right">{isZh ? "会话数" : "Sessions"}</th>
                <th className="px-3 py-3 text-right">{isZh ? "活跃用户" : "Active Users"}</th>
                <th className="px-3 py-3 text-right">{isZh ? "事件总数" : "Events"}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {tableRows.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-8 text-center font-bold text-slate-400">
                    {isZh ? "该维度暂无可用指标。" : "No metrics available for this dimension."}
                  </td>
                </tr>
              ) : (
                tableRows.map((row, index) => (
                  <tr key={`${row.key}-${index}`} className="hover:bg-slate-50/50 transition-all font-semibold">
                    <td className="max-w-[360px] truncate px-4 py-3 font-bold text-slate-900" title={row.key}>
                      {row.key}
                    </td>
                    <td className="px-3 py-3 text-right font-black text-slate-950 font-mono">
                      {row.sessions.toLocaleString()}
                    </td>
                    <td className="px-3 py-3 text-right text-slate-500 font-mono">
                      {row.activeUsers.toLocaleString()}
                    </td>
                    <td className="px-3 py-3 text-right text-slate-500 font-mono">
                      {row.eventCount.toLocaleString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

function getTableLabel(key: "sources" | "landingPages" | "devices" | "countries", isZh: boolean) {
  const labels = {
    sources: isZh ? "来源渠道 (Source / Medium)" : "Source / Medium",
    landingPages: isZh ? "热门落地页 (Landing Pages)" : "Landing Pages",
    devices: isZh ? "设备类型 (Devices)" : "Devices",
    countries: isZh ? "国家与地区 (Countries)" : "Countries/Regions",
  };
  return labels[key];
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
      <p className="mt-2 text-2xl font-black tracking-tight text-slate-950 font-mono">
        {value}
      </p>
      {hint && <p className="mt-1 text-[10px] font-bold text-slate-400">{hint}</p>}
    </div>
  );
}
