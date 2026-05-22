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
import { getUserUuid } from "@/services/user";
import { getFormCreationAllowance, listFormsByUser } from "@/services/form";
import { getHomepageSceneTemplates } from "@/services/form-templates";
import { buildWorkspaceAgentResponses } from "@/services/workspace-agent";
import { cn } from "@/lib/utils";

export default async function ({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const t = await getTranslations("forms");
  const { locale } = await params;
  const user_uuid = await getUserUuid();
  const callbackUrl = `${process.env.NEXT_PUBLIC_WEB_URL}/${locale}/forms`;
  if (!user_uuid) {
    redirect(`/auth/signin?callbackUrl=${encodeURIComponent(callbackUrl)}`);
  }

  const forms = await listFormsByUser(user_uuid);
  const allowance = await getFormCreationAllowance(user_uuid);
  const metrics = await getFormDashboardMetrics(forms);
  const recommendedTemplates = getHomepageSceneTemplates().slice(0, 4);
  const workspaceAgentResponses = buildWorkspaceAgentResponses(
    forms,
    metrics,
    allowance.canCreate
  );

  return (
    <AgentWorkspace
      variant="light"
      agentTitle="AI 场景助手"
      agentDescription="欢迎回来。这里是你的业务中枢，你可以通过指令快速调取数据或创建新的业务场景。"
      inputPlaceholder="输入指令..."
      examples={[
        {
          label: "总结工作台情况",
          icon: "RiLineChartLine",
          response: workspaceAgentResponses.overview,
        },
        {
          label: "检查异常告警",
          icon: "RiTimeLine",
          response: workspaceAgentResponses.anomalies,
        },
        {
          label: "建议下一步动作",
          icon: "RiAddCircleLine",
          response: workspaceAgentResponses.nextActions,
        },
      ]}
      staticResponses={[
        {
          keywords: ["异常", "失败", "告警", "问题", "健康"],
          response: workspaceAgentResponses.anomalies,
        },
        {
          keywords: ["下一步", "建议", "继续", "后面"],
          response: workspaceAgentResponses.nextActions,
        },
        {
          keywords: ["创建", "新建", "额度", "模板"],
          response: workspaceAgentResponses.creation,
        },
        {
          keywords: ["概览", "总结", "工作台", "场景", "数据", "提交"],
          response: workspaceAgentResponses.overview,
        },
      ]}
      defaultResponse={workspaceAgentResponses.defaultResponse}
      agentEndpoint="/api/forms/workspace-agent"
    >
      <div className="p-10 space-y-10">
        <div className="flex items-center justify-between">
          <div>
             <h1 className="text-2xl font-black tracking-tight text-slate-900">我的场景 / Workspace</h1>
             <p className="mt-1 text-sm font-medium text-slate-500">以场景为中心管理 AI 表单、数据、分析与发布集成。</p>
          </div>
          <Button asChild className="h-12 rounded-2xl bg-brand-yellow text-slate-950 font-black shadow-lg shadow-brand-yellow/20 hover:bg-brand-yellow/90">
            <Link href={`/${locale}/forms/new`}>
              <Icon name="RiAddLine" className="mr-2 h-5 w-5" />
              新建 AI 场景
            </Link>
          </Button>
        </div>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          <KPICard label="活跃场景" value={forms.length.toString()} trend="15.2%" />
          <KPICard label="今日提交量" value={metrics.totalSubmissions.toString()} trend="8.4%" />
          <KPICard label="平均转化率" value="64.2%" trend="持平" />
          <KPICard label="异常告警" value="0" trend="健康" trendColor="text-emerald-500" />
        </div>

        <section className="space-y-5">
          <div className="flex flex-col justify-between gap-3 md:flex-row md:items-end">
            <div>
              <h2 className="text-sm font-black uppercase tracking-widest text-slate-400">
                推荐模板 / START FROM TEMPLATE
              </h2>
              <p className="mt-2 text-sm font-medium text-slate-500">
                先选一个接近业务的模板，再让 Agent 帮你调整字段、文案和发布配置。
              </p>
            </div>
            <Button asChild variant="outline" className="h-10 rounded-2xl border-slate-200 bg-white text-xs font-black">
              <Link href={`/${locale}/forms/new`}>
                查看全部模板
              </Link>
            </Button>
          </div>

          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {recommendedTemplates.map((template) => (
              <Link
                key={template.id}
                href={`/${locale}/forms/new?template=${template.id}`}
                className="group overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm transition-all hover:-translate-y-1 hover:border-brand-blue hover:shadow-xl hover:shadow-brand-blue/10"
              >
                <TemplateVisualPreview template={template} fieldsLabel="字段" />
                <div className="space-y-3 p-5">
                  <div className="flex items-center justify-between gap-2">
                    <Badge className="border-none bg-slate-100 text-[10px] font-black text-slate-500">
                      {template.category}
                    </Badge>
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-300">
                      {template.theme}
                    </span>
                  </div>
                  <div>
                    <h3 className="truncate text-sm font-black text-slate-900 transition-colors group-hover:text-brand-blue">
                      {template.name}
                    </h3>
                    <p className="mt-2 line-clamp-2 text-xs font-medium leading-5 text-slate-500">
                      {template.description}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-black uppercase tracking-widest text-slate-400">运行中的场景 / ACTIVE SCENES</h2>
          </div>

          {forms.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {forms.map((form) => (
                <article key={form.uuid} className="group overflow-hidden rounded-[2.5rem] border border-slate-200 bg-white transition-all hover:-translate-y-1.5 hover:border-brand-blue hover:shadow-2xl hover:shadow-brand-blue/10">
                  <div className="flex h-36 items-center justify-center bg-gradient-to-br from-[#f0f7ff] to-[#e0efff] relative overflow-hidden">
                    <Icon name="RiFileList3Line" className="h-12 w-12 text-slate-300 transition-all duration-500 group-hover:scale-110 group-hover:text-brand-blue group-hover:rotate-[-5deg]" />
                    <div className="absolute top-4 right-4">
                       <Badge className="bg-white/80 backdrop-blur-sm text-emerald-600 border-none font-black text-[10px]">运行中</Badge>
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="truncate text-base font-black text-slate-900 group-hover:text-brand-blue transition-colors">{form.title}</h3>
                    <div className="mt-4 flex items-center justify-between text-[11px] font-bold text-slate-400">
                      <span>{form.schema_json.fields.length} 个字段</span>
                      <span>{metrics.totalSubmissions} 提交 · 刚刚</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-4 border-t border-slate-50 bg-slate-50/50">
                    <SceneAction href={`/${locale}/forms/${form.uuid}`} icon="RiMagicLine" label="设计" />
                    <SceneAction href={`/${locale}/forms/${form.uuid}/submissions`} icon="RiDatabase2Line" label="数据" />
                    <SceneAction href={`/${locale}/forms/${form.uuid}/analytics`} icon="RiPieChart2Line" label="分析" />
                    <SceneAction href={`/${locale}/forms/${form.uuid}/publish`} icon="RiRocket2Line" label="发布" />
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="rounded-[2.5rem] border-2 border-dashed border-slate-200 bg-white px-6 py-20 text-center">
               <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-50 text-slate-300 mb-4">
                  <Icon name="RiInboxLine" className="h-8 w-8" />
               </div>
               <p className="text-sm font-bold text-slate-500">暂无场景，快去创建一个吧</p>
               <Button asChild className="mt-6 rounded-2xl bg-brand-blue font-bold">
                  <Link href={`/${locale}/forms/new`}>立即创建</Link>
               </Button>
            </div>
          )}
        </section>
      </div>
    </AgentWorkspace>
  );
}

function KPICard({ label, value, trend, trendColor = "text-emerald-500" }: { label: string; value: string; trend: string; trendColor?: string }) {
  return (
    <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm transition-all hover:shadow-md hover:border-brand-blue/20">
      <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">{label}</p>
      <p className="mt-2 text-3xl font-black tracking-tight text-[#003366]">{value}</p>
      <p className={cn("mt-2 text-[11px] font-black flex items-center gap-1", trendColor)}>
        {trend === "持平" || trend === "健康" ? trend : <><Icon name="RiArrowUpLine" className="h-3.5 w-3.5" /> {trend}</>}
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
