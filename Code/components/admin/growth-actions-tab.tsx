"use client";

import { AlertCircle, ArrowUpRight, CheckCircle2, HelpCircle, Lightbulb, Loader2 } from "lucide-react";

interface GscMetric {
  key: string;
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
}

interface Ga4EventRow {
  eventName: string;
  eventCount: number;
}

interface Ga4MetricRow {
  key: string;
  sessions: number;
  activeUsers: number;
  eventCount: number;
}

interface PageSpeedData {
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
}

interface GrowthActionsTabProps {
  gscData: {
    summary: {
      clicks: number;
      impressions: number;
      ctr: number;
      position: number;
    };
    queries: GscMetric[];
    pages: GscMetric[];
  } | null;
  ga4Data: {
    summary: {
      sessions: number;
      activeUsers: number;
      newUsers: number;
      eventCount: number;
    };
    funnel: Ga4EventRow[];
    landingPages: Ga4MetricRow[];
  } | null;
  pageSpeedData?: PageSpeedData | null;
  isLoadingGsc: boolean;
  isLoadingGa4: boolean;
  isZh: boolean;
}

interface ActionItem {
  id: string;
  type: "opportunity" | "low_ctr" | "warning";
  title: string;
  description: string;
  metrics: string;
  actionText: string;
  link: string;
}

export default function GrowthActionsTab({
  gscData,
  ga4Data,
  pageSpeedData,
  isLoadingGsc,
  isLoadingGa4,
  isZh,
}: GrowthActionsTabProps) {
  const isLoading = isLoadingGsc || isLoadingGa4;

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-3 border border-slate-200 bg-white rounded-2xl shadow-sm">
        <Loader2 className="size-8 text-blue-600 animate-spin" />
        <p className="text-xs text-slate-500 font-bold">
          {isZh ? "正在计算增长策略建议..." : "Analyzing growth actions..."}
        </p>
      </div>
    );
  }

  if (!gscData && !ga4Data) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm flex flex-col items-center justify-center text-center py-16">
        <div className="size-10 rounded-full bg-slate-100 flex items-center justify-center mb-3 text-slate-400">
          <HelpCircle className="size-5" />
        </div>
        <h4 className="text-sm font-black text-slate-900 mb-1">
          {isZh ? "无法加载增长建议" : "Growth Actions Unavailable"}
        </h4>
        <p className="text-xs text-slate-500 max-w-sm">
          {isZh
            ? "增长建议需要基于 Google Search Console 或 GA4 数据进行分析。请先确保后台集成已成功配置并获取数据。"
            : "Growth suggestions require active Google Search Console or GA4 configurations. Please verify integrations first."}
        </p>
      </div>
    );
  }

  const actions: ActionItem[] = [];
  const flaggedPages = new Set<string>(); // 用于页面建议去重

  // ==================== GSC 相关规则 ====================
  if (gscData) {
    const queries = gscData.queries || [];
    const pages = gscData.pages || [];
    const summary = gscData.summary;

    const avgImpressionsQueries = queries.reduce((sum, q) => sum + q.impressions, 0) / (queries.length || 1);
    const avgImpressionsPages = pages.reduce((sum, p) => sum + p.impressions, 0) / (pages.length || 1);
    const avgCtr = summary.ctr;

    // 1. 规则 1：近第一页机会词（排名 11-20 且曝光大于平均曝光）
    const opportunityQueries = queries.filter(
      (q) => q.position >= 11 && q.position <= 20 && q.impressions > avgImpressionsQueries
    );
    opportunityQueries.slice(0, 2).forEach((q) => {
      actions.push({
        id: `opt-query-${q.key}`,
        type: "opportunity",
        title: isZh ? `针对高潜力关键词 “${q.key}” 进行内容补充` : `Target high-potential keyword "${q.key}"`,
        description: isZh
          ? `该词平均排名为 ${q.position.toFixed(1)}，已接近搜索首页（第2页），且带来了 ${q.impressions.toLocaleString()} 次曝光。建议优先优化该词相关的表单模板与博客内容，争取冲入搜索第一页。`
          : `This query ranks at ${q.position.toFixed(1)} (page 2) with ${q.impressions.toLocaleString()} impressions. Consider optimizing form templates or blog posts targeted at this keyword to reach page 1.`,
        metrics: isZh
          ? `当前排名: ${q.position.toFixed(1)} · 曝光数: ${q.impressions.toLocaleString()}`
          : `Position: ${q.position.toFixed(1)} · Impressions: ${q.impressions.toLocaleString()}`,
        actionText: isZh ? "去撰写博客" : "Create Blog Draft",
        link: "/admin/posts/add",
      });
    });

    // 2. 规则 2：高曝光低点击率页面（页面曝光大于平均曝光，且页面 CTR 小于全站平均 CTR）
    const lowCtrPages = pages.filter((p) => p.impressions > avgImpressionsPages && p.ctr < avgCtr);
    lowCtrPages.slice(0, 2).forEach((p) => {
      let shortUrl = p.key;
      try {
        const urlObj = new URL(p.key);
        shortUrl = urlObj.pathname + urlObj.search;
      } catch (_) {}

      // 记录已建议页面
      flaggedPages.add(p.key);

      actions.push({
        id: `ctr-page-${p.key}`,
        type: "low_ctr",
        title: isZh ? `优化页面 [ ${shortUrl} ] 的元数据 (Meta Description)` : `Optimize metadata for [ ${shortUrl} ]`,
        description: isZh
          ? `该页面的曝光量为 ${p.impressions.toLocaleString()}，但点击率仅为 ${p.ctr.toFixed(2)}%（低于平均值 ${avgCtr.toFixed(2)}%）。这可能表明搜索引擎摘要吸引力不够。建议检查并优化 Title 与 Description。`
          : `This page has ${p.impressions.toLocaleString()} impressions but only a ${p.ctr.toFixed(2)}% CTR (site average: ${avgCtr.toFixed(2)}%). Consider checking and optimizing its Meta Title and Description.`,
        metrics: isZh
          ? `点击率: ${p.ctr.toFixed(2)}% · 曝光数: ${p.impressions.toLocaleString()}`
          : `CTR: ${p.ctr.toFixed(2)}% · Impressions: ${p.impressions.toLocaleString()}`,
        actionText: isZh ? "查看受访页" : "Visit Page",
        link: p.key,
      });
    });

    // 3. 规则 3：搜索曝光高但实际访问低 (GSC + GA4 联动，去重)
    if (ga4Data && ga4Data.landingPages) {
      const highImpPages = pages.filter((p) => p.impressions > avgImpressionsPages);
      highImpPages.slice(0, 3).forEach((p) => {
        // 如果页面已被低 CTR 规则覆盖，则跳过，避免重复输出
        if (flaggedPages.has(p.key)) return;

        let pathname = p.key;
        try {
          pathname = new URL(p.key).pathname;
        } catch (_) {}

        // 从 GA4 数据中查找对应落地页
        const ga4Page = ga4Data.landingPages.find((lp) => {
          const lpPath = lp.key.split("?")[0];
          return lpPath === pathname || lpPath === pathname + "/" || pathname === lpPath + "/";
        });

        // 假如 GSC 点击和曝光都不低，但在 GA4 中实际 Session 极少（例如 < 5），说明可能存在跳出、跳转故障，或者严重的加载卡顿
        const sessions = ga4Page ? ga4Page.sessions : 0;
        if (p.clicks > 5 && sessions < 5) {
          flaggedPages.add(p.key);
          actions.push({
            id: `gsc-ga4-${p.key}`,
            type: "warning",
            title: isZh ? `检查页面 [ ${pathname} ] 的加载可用性与跳转状态` : `Check loading accessibility for [ ${pathname} ]`,
            description: isZh
              ? `该页面在谷歌搜索点击为 ${p.clicks} 次，但 GA4 记录的着陆页会话数仅为 ${sessions}。这可能表明存在重定向异常、SSL 握手缓慢或前端脚本阻塞，建议检查该路径可用性。`
              : `This path has ${p.clicks} search clicks, but GA4 recorded only ${sessions} landing sessions. This could indicate a redirect loop, script crash, or SSL error. Please inspect this URL manually.`,
            metrics: isZh
              ? `谷歌点击: ${p.clicks} · 实际会话: ${sessions}`
              : `Search Clicks: ${p.clicks} · GA4 Sessions: ${sessions}`,
            actionText: isZh ? "测试链接" : "Test Link",
            link: p.key,
          });
        }
      });
    }
  }

  // ==================== GA4 漏斗相关规则 ====================
  if (ga4Data) {
    const sessions = ga4Data.summary.sessions;

    if (sessions < 20) {
      // 样本不足，不给出强漏斗断言
      actions.push({
        id: "ga4-low-samples",
        type: "opportunity",
        title: isZh ? "GA4 激活流量样本累计中" : "GA4 Activation Sample Accumulating",
        description: isZh
          ? `当前周期内的总会话数为 ${sessions}，样本不足以计算出具备统计学意义的漏斗转化规律。建议继续观察以获取更准确的转化指标。`
          : `Current period sessions (${sessions}) are below the threshold of 20. We suggest letting traffic accumulate to yield statistically meaningful funnel insights.`,
        metrics: isZh ? `总会话: ${sessions} / 20` : `Sessions: ${sessions} / 20`,
        actionText: isZh ? "去查看 GA4" : "Go to GA4",
        link: "/admin/growth",
      });
    } else {
      // 提取 funnel 事件数量
      const getEventCount = (name: string) => {
        return ga4Data.funnel.find((item) => item.eventName === name)?.eventCount || 0;
      };

      const demoStart = getEventCount("demo_start");
      const demoComplete = getEventCount("demo_complete");
      // form_saved is emitted only once a form exists; form_generate is kept
      // as the historical fallback for older GA4 windows.
      const formGenerate = getEventCount("form_saved") || getEventCount("form_generate");
      const formPublish = getEventCount("form_publish");
      const formSubmit = getEventCount("form_submit");

      // 4. 规则 4：高访问低 Demo 激活 (GA4 Funnel 联动)
      const demoStartRate = demoStart / sessions;
      if (demoStartRate < 0.05) {
        actions.push({
          id: "funnel-low-demo-start",
          type: "warning",
          title: isZh ? "优化首页 Demo 体验的入口显眼度" : "Optimize homepage sandbox demo visibility",
          description: isZh
            ? `会话数有 ${sessions}，但仅有 ${demoStart} 次免登录演示点击，点击率较低。建议检查首页 Demo 入口显眼度，并考虑强化首屏呼吁行动 (CTA) 按钮。`
            : `There are ${sessions} sessions but only ${demoStart} clicks on the sandbox demo. Consider increasing the visual weight of the demo section above the fold.`,
          metrics: isZh
            ? `演示点击率: ${(demoStartRate * 100).toFixed(1)}%`
            : `Demo Click Rate: ${(demoStartRate * 100).toFixed(1)}%`,
          actionText: isZh ? "去修改页面" : "Edit Home",
          link: "/admin/forms",
        });
      }

      // 5. 规则 5：Demo 过程摩擦流失 (GA4 Funnel 联动)
      if (demoStart >= 5) {
        const demoCompleteRate = demoComplete / demoStart;
        if (demoCompleteRate < 0.40) {
          actions.push({
            id: "funnel-low-demo-complete",
            type: "warning",
            title: isZh ? "检查表单 Demo 的步骤长度与交互引导" : "Inspect demo completion friction",
            description: isZh
              ? `免登录体验表单的完成率为 ${(demoCompleteRate * 100).toFixed(1)}%，流失率偏高。建议检查演示流程是否过长、字段是否精简，或者交互反馈是否足够清晰。`
              : `The sandbox demo completion rate is ${(demoCompleteRate * 100).toFixed(1)}% (below target 40%). Check if the demo steps are too long or if users encounter friction during submission.`,
            metrics: isZh
              ? `体验完成率: ${(demoCompleteRate * 100).toFixed(1)}%`
              : `Demo Completion Rate: ${(demoCompleteRate * 100).toFixed(1)}%`,
            actionText: isZh ? "去修改表单" : "Edit Form Template",
            link: "/admin/forms",
          });
        }
      }

      // 6. 规则 6：生成后发布率低 (GA4 Funnel 联动)
      if (formGenerate >= 3) {
        const publishRate = formPublish / formGenerate;
        if (publishRate < 0.50) {
          actions.push({
            id: "funnel-low-publish",
            type: "warning",
            title: isZh ? "检查表单生成后的发布流失与登录限制" : "Inspect conversion blocks after form generation",
            description: isZh
              ? `表单生成后的最终发布率仅为 ${(publishRate * 100).toFixed(1)}%。建议检查发布引导、登录/注册拦截时机以及免费计划额度是否限制了用户继续体验。`
              : `Only ${(publishRate * 100).toFixed(1)}% of generated forms are published. Inspect if the login dialog, onboarding guide, or subscription tier limits block user activation.`,
            metrics: isZh
              ? `生成发布率: ${(publishRate * 100).toFixed(1)}%`
              : `Publish Rate: ${(publishRate * 100).toFixed(1)}%`,
            actionText: isZh ? "检查付费墙" : "Check Billing Rules",
            link: "/admin/paid-orders",
          });
        }
      }

      // 7. 规则 7：发布后无公开提交数据 (GA4 Funnel 联动)
      if (formPublish >= 3) {
        const submitRate = formSubmit / formPublish;
        if (submitRate < 0.10) {
          actions.push({
            id: "funnel-low-submit",
            type: "warning",
            title: isZh ? "优化分享表单落地页的加载与提交引导" : "Improve public form submit conversions",
            description: isZh
              ? `已发布表单的公开数据提交转化率偏低 (${(submitRate * 100).toFixed(1)}%)。建议检查分享落地页的访问响应速度、以及对终端用户的测试数据填写的说明提示。`
              : `The ratio of submissions to published forms is ${(submitRate * 100).toFixed(1)}% (below target 10%). Review the loading speeds of share pages or add guidance on how endpoints fill data.`,
            metrics: isZh
              ? `发布提交率: ${(submitRate * 100).toFixed(1)}%`
              : `Submit/Publish Rate: ${(submitRate * 100).toFixed(1)}%`,
            actionText: isZh ? "查看表单列表" : "Forms List",
            link: "/admin/forms",
          });
        }
      }
    }
  }

  // ==================== PageSpeed 相关规则 ====================
  if (pageSpeedData) {
    const targetPath = (() => {
      try {
        return new URL(pageSpeedData.url).pathname || "/";
      } catch (_) {
        return pageSpeedData.url;
      }
    })();

    if (pageSpeedData.scores.performance < 80) {
      actions.push({
        id: `pagespeed-performance-${pageSpeedData.strategy}-${targetPath}`,
        type: "warning",
        title: isZh ? `优化 ${targetPath} 的移动端首屏性能` : `Improve ${targetPath} page speed`,
        description: isZh
          ? `PageSpeed ${pageSpeedData.strategy === "mobile" ? "移动端" : "桌面端"}性能分为 ${pageSpeedData.scores.performance}，LCP 为 ${pageSpeedData.metrics.lcp}，资源体积为 ${pageSpeedData.diagnostics.totalByteWeight}。建议优先处理第三方脚本延迟加载、首屏 JS 瘦身和非首屏模块懒加载。`
          : `The ${pageSpeedData.strategy} performance score is ${pageSpeedData.scores.performance}, with LCP ${pageSpeedData.metrics.lcp} and total byte weight ${pageSpeedData.diagnostics.totalByteWeight}. Prioritize third-party script deferral and above-the-fold JS reduction.`,
        metrics: isZh
          ? `性能分: ${pageSpeedData.scores.performance} · LCP: ${pageSpeedData.metrics.lcp}`
          : `Performance: ${pageSpeedData.scores.performance} · LCP: ${pageSpeedData.metrics.lcp}`,
        actionText: isZh ? "查看性能面板" : "View PageSpeed",
        link: "/admin/growth",
      });
    }

    if (pageSpeedData.scores.accessibility < 90 || pageSpeedData.scores.bestPractices < 90) {
      actions.push({
        id: `pagespeed-quality-${pageSpeedData.strategy}-${targetPath}`,
        type: "opportunity",
        title: isZh ? `修复 ${targetPath} 的页面质量细节` : `Fix quality issues for ${targetPath}`,
        description: isZh
          ? `当前可访问性分为 ${pageSpeedData.scores.accessibility}，最佳实践分为 ${pageSpeedData.scores.bestPractices}。建议检查按钮可访问名称、链接名称、图片尺寸、颜色对比度以及第三方脚本控制台错误。`
          : `Accessibility is ${pageSpeedData.scores.accessibility} and Best Practices is ${pageSpeedData.scores.bestPractices}. Check button labels, link names, image dimensions, contrast, and third-party console errors.`,
        metrics: isZh
          ? `可访问性: ${pageSpeedData.scores.accessibility} · 最佳实践: ${pageSpeedData.scores.bestPractices}`
          : `Accessibility: ${pageSpeedData.scores.accessibility} · Best Practices: ${pageSpeedData.scores.bestPractices}`,
        actionText: isZh ? "查看性能面板" : "View PageSpeed",
        link: "/admin/growth",
      });
    }

    const jsOpportunity = pageSpeedData.opportunities.find((item) => item.id.includes("javascript"));
    if (jsOpportunity) {
      actions.push({
        id: `pagespeed-js-${pageSpeedData.strategy}-${targetPath}`,
        type: "warning",
        title: isZh ? "继续压缩首屏 JavaScript 负担" : "Continue reducing first-load JavaScript",
        description: isZh
          ? `PageSpeed 返回了 JavaScript 相关优化机会：“${jsOpportunity.title}”。这与我们下一步的 019/020 性能任务一致，应优先从 Stripe、Google 登录脚本延迟加载和首页非首屏模块拆分开始。`
          : `PageSpeed returned a JavaScript opportunity: "${jsOpportunity.title}". This matches the next 019/020 performance tasks: defer Stripe and Google sign-in scripts, then split below-the-fold homepage modules.`,
        metrics: jsOpportunity.displayValue || (isZh ? "存在 JS 优化机会" : "JavaScript opportunity detected"),
        actionText: isZh ? "查看性能面板" : "View PageSpeed",
        link: "/admin/growth",
      });
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
        <Lightbulb className="size-5 text-amber-500 shrink-0" />
        <div>
          <h3 className="text-sm font-black text-slate-900">
            {isZh ? "增长诊断与行动建议" : "Growth Diagnosis & Recommendations"}
          </h3>
          <p className="text-[11px] text-slate-400 font-bold mt-0.5">
            {isZh
              ? "通过综合分析谷歌自然排名及漏斗转化特征，系统提示可以作为下一步优化的诊断任务。"
              : "Generate concrete optimization actions by combining organic rankings and conversion drop-offs."}
          </p>
        </div>
      </div>

      {actions.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center py-16 shadow-sm">
          <CheckCircle2 className="size-8 text-emerald-500 mx-auto mb-3" />
          <h4 className="text-sm font-black text-slate-900 mb-1">
            {isZh ? "数据分析状态良好" : "Analysis looks clean"}
          </h4>
          <p className="text-xs text-slate-500 max-w-sm mx-auto font-medium">
            {isZh
              ? "当前未检测到异常的自然搜索点击率或漏斗卡点。请继续保持优良的元描述和高转化的首屏布局。"
              : "No interaction bottlenecks or poor CTR signals detected. Keep up the high metadata quality."}
          </p>
        </div>
      ) : (
        <div className="grid gap-4">
          {actions.map((act) => {
            const badgeColor = {
              opportunity: "bg-blue-50 text-blue-700 border-blue-100",
              low_ctr: "bg-amber-50 text-amber-700 border-amber-100",
              warning: "bg-red-50 text-red-700 border-red-100",
            }[act.type];

            const badgeText = {
              opportunity: isZh ? "优化机会" : "Opportunity",
              low_ctr: isZh ? "点击偏低" : "Low CTR",
              warning: isZh ? "诊断警告" : "Warning",
            }[act.type];

            return (
              <div
                key={act.id}
                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm hover:border-blue-300 transition-all flex flex-col md:flex-row md:items-start justify-between gap-4"
              >
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`text-[10px] font-black px-2 py-0.5 rounded-full border ${badgeColor}`}>
                      {badgeText}
                    </span>
                    <span className="text-[10.5px] font-bold text-slate-400 font-mono">
                      {act.metrics}
                    </span>
                  </div>
                  <h4 className="text-sm font-black text-slate-900">
                    {act.title}
                  </h4>
                  <p className="text-xs leading-relaxed text-slate-500 max-w-2xl font-semibold">
                    {act.description}
                  </p>
                </div>

                <div className="shrink-0 flex items-center">
                  <a
                    href={act.link}
                    className="inline-flex items-center gap-1 text-xs font-black text-blue-600 hover:text-blue-700 hover:underline"
                  >
                    <span>{act.actionText}</span>
                    <ArrowUpRight className="size-3.5" />
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
