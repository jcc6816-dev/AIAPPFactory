"use client";

import { useState } from "react";
import { AlertCircle, Gauge, Info, Laptop, Loader2, RefreshCw, Smartphone } from "lucide-react";

export interface PageSpeedData {
  url: string;
  strategy: "mobile" | "desktop";
  scores: {
    performance: number;
    accessibility: number;
    bestPractices: number;
    seo: number;
  };
  metrics: {
    fcp: string;
    lcp: string;
    tbt: string;
    cls: string;
    tti: string;
    speedIndex: string;
  };
  opportunities: Array<{
    id: string;
    title: string;
    displayValue: string;
  }>;
  diagnostics: {
    totalByteWeight: string;
    numRequests: number;
  };
  fromCache: boolean;
  lastFetchedAt: string;
}

interface PageSpeedTabProps {
  isZh: boolean;
  onDataLoaded?: (data: PageSpeedData | null) => void;
}

const PAGE_OPTIONS = [
  { value: "https://genforms.ai/", zh: "首页", en: "Home" },
  { value: "https://genforms.ai/templates", zh: "模板列表页", en: "Templates" },
  { value: "https://genforms.ai/posts/typeform-alternatives", zh: "Typeform 替代品文章", en: "Typeform alternatives post" },
  { value: "https://genforms.ai/forms/new", zh: "新建表单页", en: "New form workspace" },
];

export default function PageSpeedTab({
  isZh,
  onDataLoaded,
}: PageSpeedTabProps) {
  const [pageSpeedData, setPageSpeedData] = useState<PageSpeedData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [configMissing, setConfigMissing] = useState(false);
  const [selectedUrl, setSelectedUrl] = useState("https://genforms.ai/");
  const [strategy, setStrategy] = useState<"mobile" | "desktop">("mobile");

  async function fetchPageSpeed(url = selectedUrl, selectedStrategy = strategy) {
    setIsLoading(true);
    setErrorMsg(null);
    setConfigMissing(false);
    try {
      const params = new URLSearchParams({ url, strategy: selectedStrategy });
      const response = await fetch(`/api/admin/pagespeed/summary?${params.toString()}`);
      if (response.status === 403) {
        throw new Error(isZh ? "未授权：仅管理员可访问。" : "Unauthorized: Admin access only.");
      }

      const json = await response.json();
      if (json.code === 1) {
        setConfigMissing(true);
        setPageSpeedData(null);
        onDataLoaded?.(null);
      } else if (json.code !== 0) {
        setErrorMsg(json.message || "Failed to load PageSpeed data");
        setPageSpeedData(null);
        onDataLoaded?.(null);
      } else {
        setPageSpeedData(json.data);
        onDataLoaded?.(json.data);
      }
    } catch (error: any) {
      setErrorMsg(error.message || "Network error while loading PageSpeed data");
      setPageSpeedData(null);
      onDataLoaded?.(null);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 border-b border-slate-100 pb-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h3 className="text-sm font-black text-slate-900">
            {isZh ? "PageSpeed 页面性能巡检" : "PageSpeed Performance Monitoring"}
          </h3>
          <p className="mt-1 text-[11px] font-bold text-slate-400">
            {isZh
              ? "用于观察核心页面的实验室性能、可访问性、最佳实践与 SEO 状态。"
              : "Track lab performance, accessibility, best practices, and SEO for core pages."}
          </p>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <select
            value={selectedUrl}
            onChange={(event) => {
              const nextUrl = event.target.value;
              setSelectedUrl(nextUrl);
              fetchPageSpeed(nextUrl, strategy);
            }}
            disabled={isLoading}
            className="h-10 rounded-xl border border-slate-200 bg-white px-3 text-xs font-bold text-slate-700 shadow-sm outline-none transition-all hover:border-slate-300 focus:border-blue-500"
          >
            {PAGE_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {isZh ? option.zh : option.en}
              </option>
            ))}
          </select>

          <div className="flex rounded-xl bg-slate-100 p-1">
            {(["mobile", "desktop"] as const).map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => {
                  setStrategy(item);
                  fetchPageSpeed(selectedUrl, item);
                }}
                disabled={isLoading}
                className={`inline-flex h-8 items-center gap-1.5 rounded-lg px-3 text-xs font-black transition-all ${
                  strategy === item
                    ? "bg-white text-slate-900 shadow-sm"
                    : "text-slate-500 hover:text-slate-900"
                }`}
              >
                {item === "mobile" ? <Smartphone className="size-3.5" /> : <Laptop className="size-3.5" />}
                {item === "mobile" ? (isZh ? "移动端" : "Mobile") : (isZh ? "桌面端" : "Desktop")}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={() => fetchPageSpeed()}
            disabled={isLoading}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-slate-950 px-4 text-xs font-black text-white shadow-sm transition-all hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isLoading ? <Loader2 className="size-3.5 animate-spin" /> : <RefreshCw className="size-3.5" />}
            {isZh ? "拉取数据" : "Fetch"}
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-slate-200 bg-white py-20 shadow-sm">
          <Loader2 className="size-8 animate-spin text-blue-600" />
          <p className="text-xs font-bold text-slate-500">
            {isZh ? "正在拉取 Google PageSpeed 数据..." : "Fetching Google PageSpeed data..."}
          </p>
        </div>
      ) : configMissing ? (
        <StatusCard
          tone="amber"
          title={isZh ? "PageSpeed API Key 未配置" : "PageSpeed API Key Not Configured"}
          description={
            isZh
              ? "服务器环境变量中缺失 PAGESPEED_API_KEY。配置后即可在后台巡检核心页面性能。"
              : "PAGESPEED_API_KEY is missing on the server. Configure it to enable page performance monitoring."
          }
        />
      ) : errorMsg ? (
        <StatusCard
          tone="red"
          title={isZh ? "PageSpeed 数据拉取失败" : "PageSpeed Fetch Failed"}
          description={errorMsg}
        />
      ) : !pageSpeedData ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center text-xs font-bold text-slate-400 shadow-sm">
          {isZh ? "请选择页面并点击“拉取数据”开始巡检。" : "Select a page and click Fetch to start monitoring."}
        </div>
      ) : (
        <>
          <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <ScoreCard label={isZh ? "性能" : "Performance"} score={pageSpeedData.scores.performance} />
            <ScoreCard label={isZh ? "可访问性" : "Accessibility"} score={pageSpeedData.scores.accessibility} />
            <ScoreCard label={isZh ? "最佳实践" : "Best Practices"} score={pageSpeedData.scores.bestPractices} />
            <ScoreCard label={isZh ? "SEO" : "SEO"} score={pageSpeedData.scores.seo} />
          </section>

          <section className="grid gap-4 lg:grid-cols-[1fr_1.2fr]">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="mb-4 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <Gauge className="size-4 text-blue-600" />
                  <h4 className="text-sm font-black text-slate-900">
                    {isZh ? "核心 Web 指标" : "Core Web Metrics"}
                  </h4>
                </div>
                <div className="flex items-center gap-1 text-[10.5px] font-bold text-slate-400">
                  <Info className="size-3" />
                  <span>{pageSpeedData.fromCache ? (isZh ? "12h 缓存" : "12h cached") : (isZh ? "刚刚拉取" : "fresh")}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Metric label="FCP" value={pageSpeedData.metrics.fcp} />
                <Metric label="LCP" value={pageSpeedData.metrics.lcp} />
                <Metric label="TBT" value={pageSpeedData.metrics.tbt} />
                <Metric label="CLS" value={pageSpeedData.metrics.cls} />
                <Metric label="TTI" value={pageSpeedData.metrics.tti} />
                <Metric label={isZh ? "速度指数" : "Speed Index"} value={pageSpeedData.metrics.speedIndex} />
              </div>

              <div className="mt-4 rounded-xl bg-slate-50 p-4 text-[11px] font-bold text-slate-500">
                <p>{isZh ? "资源体积" : "Total byte weight"}: {pageSpeedData.diagnostics.totalByteWeight}</p>
                <p className="mt-1">{isZh ? "网络请求数" : "Network requests"}: {pageSpeedData.diagnostics.numRequests}</p>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h4 className="mb-4 text-sm font-black text-slate-900">
                {isZh ? "主要优化机会" : "Top Opportunities"}
              </h4>
              {pageSpeedData.opportunities.length === 0 ? (
                <p className="rounded-xl bg-emerald-50 p-4 text-xs font-bold text-emerald-700">
                  {isZh ? "PageSpeed 暂未返回明显优化机会。" : "PageSpeed did not return major opportunities."}
                </p>
              ) : (
                <div className="space-y-3">
                  {pageSpeedData.opportunities.map((item) => (
                    <div key={item.id} className="rounded-xl border border-slate-100 bg-slate-50 p-4">
                      <p className="text-xs font-black text-slate-900">{item.title}</p>
                      <p className="mt-1 text-[11px] font-bold text-slate-500">{item.displayValue || item.id}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>
        </>
      )}
    </div>
  );
}

function ScoreCard({ label, score }: { label: string; score: number }) {
  const tone = score >= 90
    ? "text-emerald-600 bg-emerald-50 border-emerald-100"
    : score >= 70
      ? "text-amber-600 bg-amber-50 border-amber-100"
      : "text-red-600 bg-red-50 border-red-100";

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-[11px] font-extrabold uppercase tracking-widest text-slate-400">{label}</p>
      <p className={`mt-3 inline-flex rounded-xl border px-3 py-1 text-2xl font-black tracking-tight ${tone}`}>
        {score}
      </p>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-slate-100 bg-white p-3">
      <p className="text-[10px] font-black uppercase text-slate-400">{label}</p>
      <p className="mt-1 text-sm font-black text-slate-900">{value}</p>
    </div>
  );
}

function StatusCard({
  tone,
  title,
  description,
}: {
  tone: "amber" | "red";
  title: string;
  description: string;
}) {
  const color = tone === "amber"
    ? "border-amber-200 bg-amber-50/50 text-amber-600"
    : "border-red-200 bg-red-50/50 text-red-600";

  return (
    <div className={`flex flex-col items-start gap-4 rounded-2xl border p-6 shadow-sm sm:flex-row ${color}`}>
      <AlertCircle className="mt-0.5 size-5 shrink-0" />
      <div className="space-y-1">
        <h4 className="text-sm font-black text-slate-900">{title}</h4>
        <p className="text-xs font-medium leading-relaxed text-slate-600">{description}</p>
      </div>
    </div>
  );
}
