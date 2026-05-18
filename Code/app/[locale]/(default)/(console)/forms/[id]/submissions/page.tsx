import AgentWorkspace from "@/components/agentfactory/agent-workspace";
import Empty from "@/components/blocks/empty";
import SceneSubnav from "@/components/agentfactory/scene-subnav";
import Icon from "@/components/icon";
import { Badge } from "@/components/ui/badge";
import { getFormByUuidForUser } from "@/services/form";
import { getTranslations } from "next-intl/server";
import { getUserUuid } from "@/services/user";
import { listFormSubmissions } from "@/services/form-runtime";
import { findWorkflowRunByUuid } from "@/models/workflow";
import moment from "moment";
import { redirect } from "next/navigation";

export default async function ({
  params,
}: {
  params: Promise<{ id: string; locale: string }>;
}) {
  const t = await getTranslations("forms");
  const user_uuid = await getUserUuid();
  const { id, locale } = await params;
  const callbackUrl = `${process.env.NEXT_PUBLIC_WEB_URL}/${locale}/forms`;
  if (!user_uuid) {
    redirect(`/auth/signin?callbackUrl=${encodeURIComponent(callbackUrl)}`);
  }
  const form = await getFormByUuidForUser(user_uuid, id);
  if (!form) {
    return <Empty message={t("not_found")} />;
  }

  const submissions = await listFormSubmissions(form);
  const submissionsWithWorkflow = await Promise.all(
    submissions.map(async (submission) => {
      const workflowRun = submission.workflow_run_uuid
        ? await findWorkflowRunByUuid(submission.workflow_run_uuid)
        : undefined;

      return {
        ...submission,
        workflow_run: workflowRun,
      };
    })
  );

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <SceneSubnav
        locale={locale}
        formId={form.uuid}
        formTitle={form.title}
        active="data"
      />
      <div className="flex-1 flex flex-col min-h-0">
        <AgentWorkspace
          agentTitle="AI 数据管家"
          agentDescription="你可以用自然语言筛选提交记录、定位异常数据，或准备导出分析。当前页面先承载已有提交列表。"
          inputPlaceholder="例如：筛选金额大于 5000 的提交..."
          examples={[
            { label: "查看高额提交", icon: "RiSearchEyeLine" },
            { label: "筛选 OCR 失败记录", icon: "RiFileWarningLine" },
            { label: "导出本周数据", icon: "RiDownloadLine" },
          ]}
        >
      <div className="p-6 h-full flex flex-col min-h-0">
        <div className="flex-1 flex flex-col rounded-[1.6rem] border border-slate-200 bg-white shadow-sm overflow-hidden">
          
          <div className="flex items-center justify-between border-b border-slate-100 bg-white px-6 py-4">
            <div className="flex w-80 items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-slate-500 focus-within:border-brand-blue focus-within:bg-white focus-within:text-brand-blue transition-all">
              <Icon name="RiSearchLine" className="h-4 w-4" />
              <input 
                type="text" 
                placeholder="搜索提交内容或用户..." 
                className="w-full bg-transparent text-[13px] font-bold outline-none placeholder:font-semibold placeholder:text-slate-400 text-slate-900"
              />
            </div>
            <button className="flex items-center gap-2 rounded-xl bg-brand-blue px-4 py-2 text-[13px] font-extrabold text-white shadow-md shadow-brand-blue/20 hover:bg-brand-blue/90 transition-all">
              <Icon name="RiDownloadLine" className="h-4 w-4" />
              导出数据
            </button>
          </div>

          <div className="flex-1 overflow-auto">
            {submissionsWithWorkflow.length > 0 ? (
              <table className="w-full min-w-[1000px] text-left">
                <thead className="sticky top-0 bg-slate-50/90 backdrop-blur-sm shadow-sm z-10">
                  <tr>
                    <th className="px-6 py-4 text-[11px] font-extrabold uppercase tracking-widest text-slate-400">ID / 时间</th>
                    <th className="px-6 py-4 text-[11px] font-extrabold uppercase tracking-widest text-slate-400">状态</th>
                    <th className="px-6 py-4 text-[11px] font-extrabold uppercase tracking-widest text-slate-400">OCR 识别</th>
                    <th className="px-6 py-4 text-[11px] font-extrabold uppercase tracking-widest text-slate-400">工作流流转</th>
                    <th className="px-6 py-4 text-[11px] font-extrabold uppercase tracking-widest text-slate-400">数据 (JSON)</th>
                  </tr>
                </thead>
                <tbody className="text-[13px] font-bold text-slate-700">
                  {submissionsWithWorkflow.map((item: any) => (
                    <tr key={item.uuid} className="border-b border-slate-50 transition-colors hover:bg-slate-50/50">
                      <td className="px-6 py-5">
                        <div className="flex flex-col gap-1">
                          <span className="font-black text-slate-900">#{item.uuid.substring(0, 8)}</span>
                          <span className="text-[11px] font-semibold text-slate-400">
                            {item.created_at ? moment(item.created_at).format("YYYY-MM-DD HH:mm") : "-"}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <Badge variant="outline" className={item.status === 'completed' ? 'border-emerald-200 bg-emerald-50 text-emerald-600' : 'border-slate-200 bg-slate-50 text-slate-600'}>
                          {item.status || 'pending'}
                        </Badge>
                      </td>
                      <td className="px-6 py-5 max-w-[200px]">
                        {item.ocr_status ? (
                          <div className="flex flex-col gap-1">
                            <span className="flex items-center gap-1.5 text-[11px]">
                              <div className={`h-1.5 w-1.5 rounded-full ${item.ocr_status === 'success' ? 'bg-emerald-500' : item.ocr_status === 'failed' ? 'bg-red-500' : 'bg-amber-500'}`} />
                              <span className="font-extrabold text-slate-500 uppercase tracking-wider">{item.ocr_status}</span>
                            </span>
                            <span className="truncate text-[12px] text-slate-600" title={item.ocr_result_json?.summary || item.ocr_error_message}>
                              {item.ocr_result_json?.summary || item.ocr_error_message || "-"}
                            </span>
                          </div>
                        ) : (
                          <span className="text-slate-300">-</span>
                        )}
                      </td>
                      <td className="px-6 py-5">
                        {item.workflow_run ? (
                          <div className="flex items-center gap-2 text-[12px] text-brand-blue bg-brand-light-blue/30 px-2 py-1 rounded-md w-fit">
                            <Icon name="RiNodeTree" className="h-3.5 w-3.5" />
                            {item.workflow_run.status}
                          </div>
                        ) : (
                          <span className="text-slate-300">-</span>
                        )}
                      </td>
                      <td className="px-6 py-5 max-w-[300px]">
                        <div className="truncate font-mono text-[11px] text-slate-500 bg-slate-50 px-2 py-1.5 rounded-lg border border-slate-100" title={JSON.stringify(item.answers_json)}>
                          {JSON.stringify(item.answers_json)}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="flex h-full flex-col items-center justify-center space-y-4 p-12 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-50 text-slate-300">
                  <Icon name="RiDatabase2Line" className="h-8 w-8" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-slate-900">{t("submissions.empty")}</h3>
                  <p className="mt-1 text-xs font-semibold text-slate-500">当前表单暂无任何提交记录</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </AgentWorkspace>
  </div>
</div>
  );
}
