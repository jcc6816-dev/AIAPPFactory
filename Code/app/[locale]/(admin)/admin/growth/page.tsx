import moment from "moment";

import { getGrowthAnalyticsSummary } from "@/services/growth-analytics";

export default async function AdminGrowthPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const isZh = locale === "zh";
  const summary = await getGrowthAnalyticsSummary();

  const cards = [
    {
      label: isZh ? "访客" : "Visitors",
      value: summary.totals.visitors,
      hint: isZh ? "按浏览器访客 ID 去重" : "Deduplicated by visitor ID",
    },
    {
      label: isZh ? "浏览量" : "Page Views",
      value: summary.totals.pageViews,
      hint: isZh ? "全站页面访问事件" : "Tracked page view events",
    },
    {
      label: isZh ? "模板使用" : "Template Uses",
      value: summary.totals.templateUses,
      hint: isZh ? `${summary.totals.templateViews} 次模板浏览` : `${summary.totals.templateViews} template views`,
    },
    {
      label: isZh ? "创建表单" : "Forms Created",
      value: summary.totals.formsCreated,
      hint: isZh ? `${summary.totals.formsPublished} 个已发布` : `${summary.totals.formsPublished} published`,
    },
    {
      label: isZh ? "公开提交" : "Public Submissions",
      value: summary.totals.publicSubmissions,
      hint: isZh ? "分享页提交次数" : "Public share form submits",
    },
    {
      label: isZh ? "平均停留" : "Avg. Duration",
      value: `${summary.totals.averageDurationSeconds}s`,
      hint: isZh ? "基于页面离开事件" : "Based on page leave events",
    },
  ];

  return (
    <div className="w-full px-4 py-8 md:px-8">
      <div className="mb-8">
        <p className="text-[11px] font-extrabold uppercase tracking-widest text-brand-blue">
          {isZh ? "增长分析" : "Growth Analytics"}
        </p>
        <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-950">
          {isZh ? "访客、来源与转化漏斗" : "Visitors, Sources, and Conversion Funnel"}
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {isZh
            ? "追踪用户从访问、模板浏览、使用模板、创建表单、发布到公开提交的关键路径。"
            : "Track the path from visit, template view, template use, form creation, publishing, and public submission."}
        </p>
      </div>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {cards.map((card) => (
          <MetricCard key={card.label} {...card} />
        ))}
      </section>

      <div className="mt-8 grid gap-6 xl:grid-cols-2">
        <Panel title={isZh ? "转化漏斗" : "Conversion Funnel"}>
          <div className="space-y-4">
            {summary.funnel.map((step) => (
              <div key={step.key}>
                <div className="mb-2 flex items-center justify-between gap-3 text-xs font-extrabold text-slate-500">
                  <span>{isZh ? translateFunnel(step.key) : step.label}</span>
                  <span>
                    {step.count} · {step.rateFromPrevious}%
                  </span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                  <div
                    className="h-full rounded-full bg-brand-blue"
                    style={{ width: `${Math.min(step.rateFromPrevious, 100)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Panel>

        <Panel title={isZh ? "来源渠道" : "Traffic Sources"}>
          <SimpleList
            empty={isZh ? "暂无来源数据。" : "No source data yet."}
            rows={summary.topSources.map((item) => ({
              title: item.key,
              right: String(item.count),
            }))}
          />
        </Panel>

        <Panel title={isZh ? "热门页面" : "Top Pages"}>
          <SimpleList
            empty={isZh ? "暂无页面浏览数据。" : "No page views yet."}
            rows={summary.topPages.map((item) => ({
              title: item.key,
              right: String(item.count),
            }))}
          />
        </Panel>

        <Panel title={isZh ? "模板转化" : "Template Conversion"}>
          <SimpleList
            empty={isZh ? "暂无模板转化数据。" : "No template data yet."}
            rows={summary.topTemplates.map((item) => ({
              title: item.key,
              meta: `${item.views} ${isZh ? "浏览" : "views"} · ${item.uses} ${isZh ? "使用" : "uses"}`,
              right: `${item.conversionRate}%`,
            }))}
          />
        </Panel>

        <Panel title={isZh ? "最近事件" : "Recent Events"}>
          <SimpleList
            empty={isZh ? "暂无事件。" : "No events yet."}
            rows={summary.recentEvents.map((event) => ({
              title: event.event_name,
              meta: event.path || event.template_id || event.form_uuid || "",
              right: event.created_at ? moment(event.created_at).fromNow() : "",
            }))}
          />
        </Panel>
      </div>
    </div>
  );
}

function translateFunnel(key: string) {
  const labels: Record<string, string> = {
    page_view: "访客",
    template_viewed: "模板浏览",
    template_used: "使用模板",
    form_created: "创建表单",
    form_published: "发布表单",
    public_form_submitted: "公开提交",
  };
  return labels[key] || key;
}

function MetricCard({
  label,
  value,
  hint,
}: {
  label: string;
  value: string | number;
  hint?: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-[11px] font-extrabold uppercase tracking-widest text-slate-400">
        {label}
      </p>
      <p className="mt-3 text-3xl font-black tracking-tight text-slate-950">
        {value}
      </p>
      {hint && <p className="mt-1 text-xs font-bold text-slate-400">{hint}</p>}
    </div>
  );
}

function Panel({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="mb-4 text-base font-extrabold text-slate-950">{title}</h2>
      {children}
    </section>
  );
}

function SimpleList({
  rows,
  empty,
}: {
  rows: Array<{ title: string; meta?: string; right?: string }>;
  empty: string;
}) {
  if (rows.length === 0) {
    return (
      <div className="py-8 text-center text-sm font-semibold text-slate-400">
        {empty}
      </div>
    );
  }

  return (
    <div className="divide-y divide-slate-100">
      {rows.map((row) => (
        <div key={`${row.title}-${row.meta}-${row.right}`} className="flex items-center justify-between gap-4 py-3">
          <div className="min-w-0">
            <p className="truncate text-sm font-extrabold text-slate-900">
              {row.title}
            </p>
            {row.meta && (
              <p className="mt-1 truncate text-xs font-semibold text-slate-400">
                {row.meta}
              </p>
            )}
          </div>
          {row.right && (
            <span className="shrink-0 text-xs font-bold text-slate-400">
              {row.right}
            </span>
          )}
        </div>
      ))}
    </div>
  );
}
