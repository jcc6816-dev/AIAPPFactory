import { redirect } from "next/navigation";

import AgentWorkspace from "@/components/agentfactory/agent-workspace";
import Empty from "@/components/blocks/empty";
import SceneSubnav from "@/components/agentfactory/scene-subnav";
import PrintButton from "@/components/analytics/print-button";
import { buildFormAnalyticsAgentResponses } from "@/services/form-analytics-agent";
import { getFormDashboardMetrics } from "@/services/form-dashboard";
import { getFormByUuidForUser } from "@/services/form";
import { getTranslations } from "next-intl/server";
import { getUserUuid } from "@/services/user";

export default async function ({
  params,
}: {
  params: Promise<{ id: string; locale: string }>;
}) {
  const t = await getTranslations("forms");
  const user_uuid = await getUserUuid();
  const { id, locale } = await params;
  const isZh = locale.toLowerCase().startsWith("zh");
  const callbackUrl = `${process.env.NEXT_PUBLIC_WEB_URL}/${locale}/forms`;
  if (!user_uuid) {
    redirect(`/auth/signin?callbackUrl=${encodeURIComponent(callbackUrl)}`);
  }

  const form = await getFormByUuidForUser(user_uuid, id);
  if (!form) {
    return <Empty message={t("not_found")} />;
  }

  const metrics = await getFormDashboardMetrics([form]);
  const total = metrics.totalSubmissions || 0;
  const webhookTotal = metrics.webhookCompletedCount + metrics.webhookFailedCount;
  const webhookRate = webhookTotal
    ? Math.round((metrics.webhookCompletedCount / webhookTotal) * 100)
    : 0;
  const ocrTotal = metrics.ocrCompletedCount + metrics.ocrFailedCount;
  const ocrRate = ocrTotal ? Math.round((metrics.ocrCompletedCount / ocrTotal) * 100) : 0;
  const analyticsAgentResponses = buildFormAnalyticsAgentResponses(metrics);

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <SceneSubnav
        locale={locale}
        formId={form.uuid}
        formTitle={form.title}
        active="analytics"
        rightActions={<PrintButton locale={locale} />}
      />
      <div className="flex-1 flex flex-col min-h-0">
        <AgentWorkspace
          agentTitle={isZh ? "AI 分析专家" : "AI Analytics Expert"}
          agentDescription={isZh ? "这里用于查看当前场景的数据表现。MVP 阶段先提供基础运行指标，后续再接入趋势、漏斗和语义分析。" : "This page is used to monitor your scene's data performance. The MVP phase displays core operational metrics, with trend, funnel, and semantic analysis coming soon."}
          inputPlaceholder={isZh ? "例如：分析最近提交量变化..." : "e.g. Analyze recent submission trend..."}
          examples={[
            {
              label: isZh ? "分析整体表现" : "Analyze overall performance",
              icon: "RiLineChartLine",
              response: analyticsAgentResponses.overview,
            },
            {
              label: isZh ? "查看转化漏斗" : "View conversion funnel",
              icon: "RiFunnelLine",
              response: analyticsAgentResponses.funnel,
            },
            {
              label: isZh ? "分析 OCR 成功率" : "Analyze OCR success rate",
              icon: "RiBarChartBoxLine",
              response: analyticsAgentResponses.ocr,
            },
          ]}
          staticResponses={[
            {
              keywords: isZh ? ["分析", "概览", "总结", "趋势", "异常", "比例"] : ["analyze", "overview", "summary", "trend", "anomaly", "rate"],
              response: analyticsAgentResponses.overview,
            },
            {
              keywords: isZh ? ["漏斗", "转化", "完成率"] : ["funnel", "conversion", "completion"],
              response: analyticsAgentResponses.funnel,
            },
            {
              keywords: isZh ? ["ocr", "识别", "自动填充"] : ["ocr", "recognize", "autofill"],
              response: analyticsAgentResponses.ocr,
            },
            {
              keywords: isZh ? ["webhook", "推送", "通知"] : ["webhook", "push", "notification"],
              response: analyticsAgentResponses.webhook,
            },
          ]}
          defaultResponse={analyticsAgentResponses.defaultResponse}
          agentEndpoint={`/api/forms/${form.uuid}/analytics-agent`}
        >

      <div className="p-6 space-y-6">
        <div className="rounded-[1.6rem] border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-[11px] font-extrabold text-brand-blue uppercase tracking-widest">Analysis</p>
          <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-950">
            {isZh ? "统计分析中心 / Analytics" : "Analytics Dashboard"}
          </h1>
          <p className="mt-2 text-sm font-medium text-slate-500">
            {isZh ? "当前场景：" : "Current Scene: "}{form.title}
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4 analytics-kpi-grid">
          <AnalyticsCard label={isZh ? "总提交量" : "Total Submissions"} value={String(total)} hint={isZh ? "累计提交记录" : "Total recorded submissions"} />
          <AnalyticsCard label={isZh ? "OCR 成功率" : "OCR Success Rate"} value={`${ocrRate}%`} hint={`${metrics.ocrCompletedCount} ${isZh ? "成功" : "Success"} / ${metrics.ocrFailedCount} ${isZh ? "失败" : "Failed"}`} />
          <AnalyticsCard label={isZh ? "Webhook 成功率" : "Webhook Success Rate"} value={`${webhookRate}%`} hint={`${metrics.webhookCompletedCount} ${isZh ? "成功" : "Success"} / ${metrics.webhookFailedCount} ${isZh ? "失败" : "Failed"}`} />
          <AnalyticsCard label={isZh ? "自动填充" : "OCR Auto-filled"} value={String(metrics.autoFilledSubmissionCount)} hint={isZh ? "OCR 自动填充提交" : "Submissions filled by OCR"} />
        </div>

        <div className="grid gap-5 xl:grid-cols-[minmax(0,1.35fr)_minmax(280px,0.65fr)] analytics-main-grid">
          <div className="rounded-[1.6rem] border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-lg font-extrabold text-slate-950">
              {isZh ? "提交趋势分析 / Submission Trend" : "Submission Trend Analysis"}
            </h2>
            <div className="mt-8 flex h-64 items-end gap-4 rounded-3xl bg-slate-50 p-6">
              {[42, 78, 58, 90, 64, 86].map((height, index) => (
                <div key={index} className="flex flex-1 flex-col items-center gap-3 group">
                  <div
                    className="w-full rounded-t-2xl bg-brand-blue/30 group-hover:bg-brand-blue transition-all"
                    style={{ height: `${height}%` }}
                  />
                  <span className="text-[10px] font-extrabold text-slate-400">
                    D{index + 1}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[1.6rem] border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-lg font-extrabold text-slate-950">
              {isZh ? "填写漏斗 / Funnel" : "Form Funnel Analysis"}
            </h2>
            <div className="mt-8 space-y-5">
              <FunnelStep label={isZh ? "访问表单" : "Visit Form"} value="100%" />
              <FunnelStep label={isZh ? "开始填写" : "Start Filling"} value={total ? "72%" : "0%"} />
              <FunnelStep label={isZh ? "完成提交" : "Complete Submission"} value={total ? "54%" : "0%"} />
            </div>
          </div>
        </div>
      </div>
    </AgentWorkspace>
  </div>
</div>
  );
}

function AnalyticsCard({
  label,
  value,
  hint,
}: {
  label: string;
  value: string;
  hint: string;
}) {
  return (
    <div className="group rounded-[1.4rem] border border-slate-200 bg-white p-5 shadow-sm transition-all hover:border-brand-blue/30 hover:shadow-md">
      <p className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">{label}</p>
      <p className="mt-3 text-3xl font-black tracking-tight text-slate-950 group-hover:text-brand-blue transition-colors">{value}</p>
      <p className="mt-2 text-xs font-bold text-slate-400">{hint}</p>
    </div>
  );
}

function FunnelStep({ label, value }: { label: string; value: string }) {
  const width = parseInt(value, 10) || 0;

  return (
    <div>
      <div className="mb-2 flex justify-between text-[11px] font-extrabold text-slate-500 uppercase tracking-wider">
        <span>{label}</span>
        <span className="text-slate-900">{value}</span>
      </div>
      <div className="h-3 rounded-full bg-slate-100 overflow-hidden">
        <div
          className="h-3 rounded-full bg-brand-blue shadow-[0_0_8px_rgba(0,102,255,0.2)]"
          style={{ width: `${width}%` }}
        />
      </div>
    </div>
  );
}
