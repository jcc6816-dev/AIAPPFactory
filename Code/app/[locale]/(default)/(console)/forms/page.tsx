import Link from "next/link";
import moment from "moment";
import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";

import AgentWorkspace from "@/components/agentfactory/agent-workspace";
import Icon from "@/components/icon";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TemplateVisualPreview } from "@/components/blocks/template-starter";
import { getFormDashboardMetrics } from "@/services/form-dashboard";
import { getUserEmail, getUserUuid } from "@/services/user";
import { getFormCreationAllowance, listFormsByUser } from "@/services/form";
import { getHomepageSceneTemplates } from "@/services/form-templates";
import { buildWorkspaceAgentResponses } from "@/services/workspace-agent";
import { getBillingPlanSummary } from "@/services/billing";
import { cn } from "@/lib/utils";

export default async function ({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const t = await getTranslations("forms");
  const { locale } = await params;
  const isZh = locale.toLowerCase().startsWith("zh");
  const user_uuid = await getUserUuid();
  const callbackUrl = `${process.env.NEXT_PUBLIC_WEB_URL}/${locale}/forms`;
  if (!user_uuid) {
    redirect(`/auth/signin?callbackUrl=${encodeURIComponent(callbackUrl)}`);
  }

  const user_email = await getUserEmail();
  const [forms, allowance, billing] = await Promise.all([
    listFormsByUser(user_uuid),
    getFormCreationAllowance(user_uuid),
    getBillingPlanSummary(user_uuid, user_email),
  ]);
  const metrics = await getFormDashboardMetrics(forms);
  const formMetrics = await Promise.all(
    forms.map(async (form) => ({
      formUuid: form.uuid,
      metrics: await getFormDashboardMetrics([form]),
    }))
  );
  const formMetricsByUuid = new Map(
    formMetrics.map((item) => [item.formUuid, item.metrics])
  );
  const recommendedTemplates = getHomepageSceneTemplates().slice(0, 3);
  const anomalyCount =
    metrics.failedSubmissions + metrics.ocrFailedCount + metrics.webhookFailedCount;
  const completionRate = metrics.totalSubmissions
    ? Math.round((metrics.completedSubmissions / metrics.totalSubmissions) * 100)
    : 0;
  const workspaceAgentResponses = buildWorkspaceAgentResponses(
    forms,
    metrics,
    allowance.canCreate
  );

  return (
    <AgentWorkspace
      variant="light"
      agentTitle={isZh ? "AI 场景助手" : "AI Assistant"}
      agentDescription={isZh ? "欢迎回来。这里是你的业务中枢，你可以通过指令快速调取数据或创建新的业务场景。" : "Welcome back. This is your central hub. You can use instructions to quickly query data or build new scenarios."}
      inputPlaceholder={isZh ? "输入指令..." : "Type instructions..."}
      examples={[
        {
          label: isZh ? "总结工作台情况" : "Summarize console overview",
          icon: "RiLineChartLine",
          response: workspaceAgentResponses.overview,
        },
        {
          label: isZh ? "检查异常告警" : "Check anomalies and alerts",
          icon: "RiTimeLine",
          response: workspaceAgentResponses.anomalies,
        },
        {
          label: isZh ? "建议下一步动作" : "Suggest next action steps",
          icon: "RiAddCircleLine",
          response: workspaceAgentResponses.nextActions,
        },
      ]}
      staticResponses={[
        {
          keywords: isZh ? ["异常", "失败", "告警", "问题", "健康"] : ["anomaly", "failure", "alert", "issue", "health"],
          response: workspaceAgentResponses.anomalies,
        },
        {
          keywords: isZh ? ["下一步", "建议", "继续", "后面"] : ["next", "suggest", "continue", "after"],
          response: workspaceAgentResponses.nextActions,
        },
        {
          keywords: isZh ? ["创建", "新建", "额度", "模板"] : ["create", "new", "allowance", "template"],
          response: workspaceAgentResponses.creation,
        },
        {
          keywords: isZh ? ["概览", "总结", "工作台", "场景", "数据", "提交"] : ["overview", "summary", "console", "scene", "data", "submission"],
          response: workspaceAgentResponses.overview,
        },
      ]}
      defaultResponse={workspaceAgentResponses.defaultResponse}
      agentEndpoint="/api/forms/workspace-agent"
    >
      <div className="p-10 space-y-10">
        <div className="flex items-center justify-between">
          <div>
             <h1 className="text-2xl font-black tracking-tight text-slate-900">{isZh ? "我的场景 / Workspace" : "My Scenes / Workspace"}</h1>
             <p className="mt-1 text-sm font-medium text-slate-500">{isZh ? "以场景为中心管理 AI 表单、数据、分析与发布集成。" : "Manage AI forms, data, analytics, and publication integrations from a single dashboard."}</p>
          </div>
          <Button asChild className="h-12 rounded-2xl bg-brand-yellow text-slate-950 font-black shadow-lg shadow-brand-yellow/20 hover:bg-brand-yellow/90">
            <Link href={`/${locale}/forms/new`}>
              <Icon name="RiAddLine" className="mr-2 h-5 w-5" />
              {isZh ? "新建 AI 场景" : "New AI Scene"}
            </Link>
          </Button>
        </div>

        {forms.length === 0 && (
          <section className="overflow-hidden rounded-[2.5rem] border border-brand-blue/15 bg-white shadow-xl shadow-brand-blue/5">
            <div className="grid gap-0 lg:grid-cols-[minmax(0,1fr)_360px]">
              <div className="p-7 md:p-9">
                <Badge className="border-none bg-brand-light-blue text-[10px] font-black uppercase tracking-widest text-brand-blue">
                  {isZh ? "首次激活路径" : "First Run Path"}
                </Badge>
                <h2 className="mt-4 max-w-2xl text-3xl font-black tracking-tight text-slate-950">
                  {isZh
                    ? "用 3 分钟发布你的第一个 AI 表单场景"
                    : "Publish your first AI form scenario in 3 minutes"}
                </h2>
                <p className="mt-3 max-w-2xl text-sm font-semibold leading-6 text-slate-500">
                  {isZh
                    ? "建议先从模板开始，确认字段和视觉效果后发布分享。之后你可以在这里查看提交、分析和 Webhook 日志。"
                    : "Start from a template, confirm fields and visuals, then publish and share. After that, this workspace will show submissions, analytics, and Webhook logs."}
                </p>
                <div className="mt-7 grid gap-3 md:grid-cols-3">
                  <OnboardingStep
                    index="01"
                    title={isZh ? "选择模板" : "Pick Template"}
                    description={isZh ? "从高转化场景开始，避免空白页。" : "Start from a proven scenario instead of a blank page."}
                  />
                  <OnboardingStep
                    index="02"
                    title={isZh ? "AI 调整" : "Refine With AI"}
                    description={isZh ? "修改字段、文案、主题和显示方式。" : "Tune fields, copy, theme, and display mode."}
                  />
                  <OnboardingStep
                    index="03"
                    title={isZh ? "发布收集" : "Publish"}
                    description={isZh ? "分享链接或二维码，开始收集数据。" : "Share a link or QR code and collect real data."}
                  />
                </div>
                <div className="mt-8 flex flex-wrap gap-3">
                  <Button asChild className="h-11 rounded-2xl bg-brand-blue px-5 font-black">
                    <Link href={`/${locale}/templates`}>
                      {isZh ? "从模板开始" : "Start From Templates"}
                    </Link>
                  </Button>
                  <Button asChild variant="outline" className="h-11 rounded-2xl border-slate-200 bg-white px-5 font-black">
                    <Link href={`/${locale}/forms/new?prompt=${encodeURIComponent(isZh ? "帮我生成一个客户线索收集表" : "Create a customer lead capture form")}`}>
                      {isZh ? "用一句话生成" : "Generate From Prompt"}
                    </Link>
                  </Button>
                </div>
              </div>
              <div className="border-t border-slate-100 bg-slate-50 p-6 lg:border-l lg:border-t-0">
                <p className="text-[11px] font-black uppercase tracking-widest text-slate-400">
                  {isZh ? "推荐开始场景" : "Recommended Starts"}
                </p>
                <div className="mt-4 space-y-3">
                  {recommendedTemplates.slice(0, 3).map((template) => (
                    <Link
                      key={template.id}
                      href={`/${locale}/forms/new?template=${template.id}`}
                      className="group flex items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-4 transition-all hover:border-brand-blue hover:shadow-md"
                    >
                      <div className="min-w-0">
                        <p className="truncate text-sm font-black text-slate-900 group-hover:text-brand-blue">
                          {isZh ? template.name : (template.nameEn || template.name)}
                        </p>
                        <p className="mt-1 truncate text-xs font-bold text-slate-400">
                          {isZh ? template.category : (template.categoryEn || template.category)}
                        </p>
                      </div>
                      <Icon name="RiArrowRightLine" className="h-4 w-4 shrink-0 text-slate-300 group-hover:text-brand-blue" />
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}

        {billing.leftCredits < 20 && (
          <div className="rounded-[2rem] border border-amber-200 bg-amber-50/50 p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm animate-in fade-in duration-300">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-2xl bg-amber-500/10 text-amber-600 shrink-0">
                <Icon name="RiErrorWarningLine" className="size-6 animate-pulse" />
              </div>
              <div>
                <h4 className="text-sm font-black text-slate-900">
                  {isZh ? "您的提交额度（Credits）即将耗尽" : "Your submission credits are running low"}
                </h4>
                <p className="mt-1 text-xs font-semibold text-slate-500 leading-relaxed">
                  {isZh 
                    ? `当前剩余额度仅剩 ${billing.leftCredits} Credits。额度耗尽后将无法继续通过分享链接收集数据，请及时充值或升级 Pro 套餐。` 
                    : `You only have ${billing.leftCredits} credits left. Form collection will pause when credits reach 0. Recharge or upgrade to Pro to avoid disruption.`}
                </p>
              </div>
            </div>
            <Button asChild className="h-10 rounded-2xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-black shrink-0 px-5 text-xs shadow-md shadow-amber-500/10">
              <Link href={`/${locale}/settings`}>
                <Icon name="RiVipDiamondLine" className="mr-1.5 h-4 w-4" />
                {isZh ? "立即管理订阅与充值" : "Manage & Recharge"}
              </Link>
            </Button>
          </div>
        )}

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          <KPICard label={isZh ? "活跃场景" : "Active Scenes"} value={forms.length.toString()} trend={isZh ? "实时" : "Live"} />
          <KPICard label={isZh ? "累计提交" : "Total Submissions"} value={metrics.totalSubmissions.toString()} trend={isZh ? "真实数据" : "Real data"} />
          <KPICard label={isZh ? "完成率" : "Completion Rate"} value={`${completionRate}%`} trend={`${metrics.completedSubmissions}/${metrics.totalSubmissions}`} />
          <KPICard
            label={isZh ? "异常告警" : "Anomalies / Alerts"}
            value={String(anomalyCount)}
            trend={anomalyCount ? (isZh ? "需处理" : "Needs review") : (isZh ? "健康" : "Healthy")}
            trendColor={anomalyCount ? "text-amber-500" : "text-emerald-500"}
          />
        </div>

        <section className="space-y-5">
          <div className="flex flex-col justify-between gap-3 md:flex-row md:items-end">
            <div>
              <h2 className="text-sm font-black uppercase tracking-widest text-slate-400">
                {isZh ? "推荐模板 / START FROM TEMPLATE" : "Recommended Templates / START FROM TEMPLATE"}
              </h2>
              <p className="mt-2 text-sm font-medium text-slate-500">
                {isZh ? "先选一个接近业务的模板，再让 Agent 帮你调整字段、文案和发布配置。" : "Pick a template close to your business needs, then let the Agent refine the fields, copy, and integrations."}
              </p>
            </div>
            <Button asChild variant="outline" className="h-10 rounded-2xl border-slate-200 bg-white text-xs font-black">
              <Link href={`/${locale}/templates`}>
                {isZh ? "查看全部模板" : "View All Templates"}
              </Link>
            </Button>
          </div>

          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {recommendedTemplates.map((template) => (
              <Link
                key={template.id}
                href={`/${locale}/forms/new?template=${template.id}`}
                className="group overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm transition-all hover:-translate-y-1 hover:border-brand-blue hover:shadow-xl hover:shadow-brand-blue/10"
              >
                <TemplateVisualPreview template={template} fieldsLabel={isZh ? "字段" : "fields"} locale={locale} />
                <div className="space-y-3 p-5">
                  <div className="flex items-center justify-between gap-2">
                    <Badge className="border-none bg-slate-100 text-[10px] font-black text-slate-500">
                      {isZh ? template.category : (template.categoryEn || template.category)}
                    </Badge>
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-300">
                      {template.theme}
                    </span>
                  </div>
                  <div>
                    <h3 className="truncate text-sm font-black text-slate-900 transition-colors group-hover:text-brand-blue">
                      {isZh ? template.name : (template.nameEn || template.name)}
                    </h3>
                    <p className="mt-2 line-clamp-2 text-xs font-medium leading-5 text-slate-500">
                      {isZh ? template.description : (template.descriptionEn || template.description)}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-black uppercase tracking-widest text-slate-400">
              {isZh ? "运行中的场景 / ACTIVE SCENES" : "Active Scenes / ACTIVE SCENES"}
            </h2>
          </div>

          {forms.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {forms.map((form) => {
                const currentMetrics = formMetricsByUuid.get(form.uuid);
                const updatedLabel = form.updated_at
                  ? moment(form.updated_at).fromNow()
                  : isZh
                    ? "暂无更新时间"
                    : "No update time";

                return (
                <article key={form.uuid} className="group overflow-hidden rounded-[2.5rem] border border-slate-200 bg-white transition-all hover:-translate-y-1.5 hover:border-brand-blue hover:shadow-2xl hover:shadow-brand-blue/10">
                  <div className="flex h-36 items-center justify-center bg-gradient-to-br from-[#f0f7ff] to-[#e0efff] relative overflow-hidden">
                    <Icon name="RiFileList3Line" className="h-12 w-12 text-slate-300 transition-all duration-500 group-hover:scale-110 group-hover:text-brand-blue group-hover:rotate-[-5deg]" />
                    <div className="absolute top-4 right-4">
                       <Badge className="bg-white/80 backdrop-blur-sm text-emerald-600 border-none font-black text-[10px]">
                         {isZh ? "运行中" : "Active"}
                       </Badge>
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="truncate text-base font-black text-slate-900 group-hover:text-brand-blue transition-colors">{form.title}</h3>
                    <div className="mt-4 flex items-center justify-between text-[11px] font-bold text-slate-400">
                      <span>{form.schema_json.fields.length} {isZh ? "个字段" : "fields"}</span>
                      <span>
                        {currentMetrics?.totalSubmissions ?? 0} {isZh ? "提交" : "subs"} · {updatedLabel}
                      </span>
                    </div>
                  </div>
                  <div className="grid grid-cols-4 border-t border-slate-50 bg-slate-50/50">
                    <SceneAction href={`/${locale}/forms/${form.uuid}`} icon="RiMagicLine" label={isZh ? "设计" : "Design"} />
                    <SceneAction href={`/${locale}/forms/${form.uuid}/submissions`} icon="RiDatabase2Line" label={isZh ? "数据" : "Data"} />
                    <SceneAction href={`/${locale}/forms/${form.uuid}/analytics`} icon="RiPieChart2Line" label={isZh ? "分析" : "Analytics"} />
                    <SceneAction href={`/${locale}/forms/${form.uuid}/publish`} icon="RiRocket2Line" label={isZh ? "发布" : "Publish"} />
                  </div>
                </article>
                );
              })}
            </div>
          ) : (
            <div className="rounded-[2.5rem] border-2 border-dashed border-slate-200 bg-white px-6 py-16 text-center">
               <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-50 text-slate-300 mb-4">
                  <Icon name="RiInboxLine" className="h-8 w-8" />
               </div>
               <p className="text-sm font-bold text-slate-500">
                {isZh ? "还没有运行中的场景。建议先用模板创建第一个表单。" : "No active scenes yet. Start with a template to create your first form."}
               </p>
               <div className="mt-6 flex flex-wrap justify-center gap-3">
                <Button asChild className="rounded-2xl bg-brand-blue font-bold">
                    <Link href={`/${locale}/templates`}>{isZh ? "从模板开始" : "Start From Templates"}</Link>
                </Button>
                <Button asChild variant="outline" className="rounded-2xl border-slate-200 bg-white font-bold">
                    <Link href={`/${locale}/forms/new`}>{isZh ? "直接新建" : "Create Blank"}</Link>
                </Button>
               </div>
            </div>
          )}
        </section>
      </div>
    </AgentWorkspace>
  );
}

function OnboardingStep({
  index,
  title,
  description,
}: {
  index: string;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
      <p className="text-[10px] font-black uppercase tracking-widest text-brand-blue">
        {index}
      </p>
      <h3 className="mt-2 text-sm font-black text-slate-950">{title}</h3>
      <p className="mt-1 text-xs font-semibold leading-5 text-slate-500">
        {description}
      </p>
    </div>
  );
}

function KPICard({ label, value, trend, trendColor = "text-emerald-500" }: { label: string; value: string; trend: string; trendColor?: string }) {
  const showArrow = /^[0-9.]+%$/.test(trend);

  return (
    <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm transition-all hover:shadow-md hover:border-brand-blue/20">
      <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">{label}</p>
      <p className="mt-2 text-3xl font-black tracking-tight text-[#003366]">{value}</p>
      <p className={cn("mt-2 text-[11px] font-black flex items-center gap-1", trendColor)}>
        {showArrow ? <><Icon name="RiArrowUpLine" className="h-3.5 w-3.5" /> {trend}</> : trend}
      </p>
    </div>
  );
}

function SceneAction({
  href,
  icon,
  label,
}: {
  href: string;
  icon: string;
  label: string;
}) {
  return (
    <Link
      href={href}
      className="relative flex h-16 flex-col items-center justify-center gap-1.5 text-slate-400 transition-all hover:bg-white hover:text-brand-blue group/action"
    >
      <Icon name={icon} className="h-4 w-4 transition-transform group-hover/action:-translate-y-0.5" />
      <span className="text-[10px] font-black uppercase tracking-tighter">{label}</span>
      <span className="absolute bottom-0 left-1/2 h-0.5 w-0 -translate-x-1/2 bg-brand-blue transition-all group-hover/action:w-1/3" />
    </Link>
  );
}
