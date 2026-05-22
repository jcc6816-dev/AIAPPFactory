"use client";

import { useMemo, useState } from "react";
import moment from "moment";

import AgentWorkspace from "@/components/agentfactory/agent-workspace";
import Icon from "@/components/icon";
import { Badge } from "@/components/ui/badge";
import type {
  FormDataAgentFilterResult,
  FormDataAgentQueryResult,
  FormDataAgentResponses,
  FormDataAgentSummary,
} from "@/services/form-data-agent";
import {
  getOcrStatusView,
  getSubmissionStatusView,
  getWorkflowStatusView,
} from "@/services/form-workflow-status";
import type { FormSubmissionRecord } from "@/types/form";
import type { WorkflowRunRecord } from "@/types/workflow";

type SubmissionWithWorkflow = FormSubmissionRecord & {
  workflow_run?: WorkflowRunRecord | null;
};

interface FormSubmissionsClientProps {
  formUuid: string;
  submissions: SubmissionWithWorkflow[];
  dataAgentSummary: FormDataAgentSummary;
  dataAgentResponses: FormDataAgentResponses;
  ocrFailedAgentResult: FormDataAgentQueryResult;
  missingFileAgentResult: FormDataAgentQueryResult;
  webhookFailedAgentResult: FormDataAgentQueryResult;
  emptyMessage: string;
}

function stringifySubmission(item: SubmissionWithWorkflow) {
  return [
    item.uuid,
    item.status,
    item.ocr_status || "",
    item.ocr_result_json?.summary || "",
    item.ocr_error_message || "",
    JSON.stringify(item.answers_json || {}),
  ]
    .join(" ")
    .toLowerCase();
}

export default function FormSubmissionsClient({
  formUuid,
  submissions,
  dataAgentSummary,
  dataAgentResponses,
  ocrFailedAgentResult,
  missingFileAgentResult,
  webhookFailedAgentResult,
  emptyMessage,
}: FormSubmissionsClientProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] =
    useState<FormDataAgentFilterResult | null>(null);

  const visibleSubmissions = useMemo(() => {
    const filterSet = activeFilter
      ? new Set(activeFilter.matchedSubmissionUuids)
      : null;
    const normalizedSearch = searchTerm.trim().toLowerCase();

    return submissions.filter((item) => {
      if (filterSet && !filterSet.has(item.uuid)) {
        return false;
      }

      if (!normalizedSearch) {
        return true;
      }

      return stringifySubmission(item).includes(normalizedSearch);
    });
  }, [activeFilter, searchTerm, submissions]);

  return (
    <AgentWorkspace
      agentTitle="AI 数据管家"
      agentDescription="我会用规则统计帮你看清数据健康度，也可以把自然语言问题转成可解释的筛选结果。"
      inputPlaceholder="例如：找出没有上传发票的记录..."
      agentInsights={
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-2">
            <DataAgentMetric label="提交" value={dataAgentSummary.totalSubmissions} />
            <DataAgentMetric label="完成" value={dataAgentSummary.completedSubmissions} />
            <DataAgentMetric label="OCR 失败" value={dataAgentSummary.ocrFailedCount} tone="warning" />
            <DataAgentMetric label="Webhook 失败" value={dataAgentSummary.webhookFailedCount} tone="warning" />
          </div>

          <DataAgentList
            title="观察结论"
            items={dataAgentSummary.recentSubmissionHints}
          />

          {dataAgentSummary.missingFieldStats.length > 0 ? (
            <DataAgentList
              title="字段缺失"
              items={dataAgentSummary.missingFieldStats.map(
                (item) => `${item.label}：缺失 ${item.missingCount} 次`
              )}
            />
          ) : null}

          <DataAgentList
            title="建议动作"
            items={dataAgentSummary.recommendedActions}
          />
        </div>
      }
      examples={[
        {
          label: "总结最近提交情况",
          icon: "RiSearchEyeLine",
          response: dataAgentResponses.summary,
          agentResult: {},
        },
        {
          label: "筛选 OCR 失败记录",
          icon: "RiFileWarningLine",
          response: ocrFailedAgentResult.answer,
          agentResult: { filter: ocrFailedAgentResult.filter },
        },
        {
          label: "找出没有上传发票的记录",
          icon: "RiImageLine",
          response: missingFileAgentResult.answer,
          agentResult: { filter: missingFileAgentResult.filter },
        },
        {
          label: "查看 Webhook 失败原因",
          icon: "RiAlertLine",
          response: webhookFailedAgentResult.answer,
          agentResult: { filter: webhookFailedAgentResult.filter },
        },
      ]}
      staticResponses={[
        {
          keywords: ["总结", "最近", "提交", "情况", "数据", "统计"],
          response: dataAgentResponses.summary,
        },
        {
          keywords: ["ocr", "识别", "图片"],
          response: dataAgentResponses.ocrFailures,
        },
        {
          keywords: ["webhook", "推送", "失败", "原因"],
          response: dataAgentResponses.webhookFailures,
        },
      ]}
      defaultResponse={dataAgentResponses.defaultResponse}
      agentEndpoint={`/api/forms/${formUuid}/data-agent`}
      inputHint="左侧输入会触发 Agent；右侧搜索框只筛表格"
      onAgentResult={(result) => {
        setActiveFilter(result.filter || null);
      }}
    >
      <div className="flex h-full min-h-0 flex-col p-6">
        <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-[1.6rem] border border-slate-200 bg-white shadow-sm">
          <div className="flex items-center justify-between gap-4 border-b border-slate-100 bg-white px-6 py-4">
            <div className="flex w-80 items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-slate-500 transition-all focus-within:border-brand-blue focus-within:bg-white focus-within:text-brand-blue">
              <Icon name="RiSearchLine" className="h-4 w-4" />
              <input
                type="text"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="搜索表格内容，不触发 Agent..."
                className="w-full bg-transparent text-[13px] font-bold text-slate-900 outline-none placeholder:font-semibold placeholder:text-slate-400"
              />
            </div>
            <button className="flex items-center gap-2 rounded-xl bg-brand-blue px-4 py-2 text-[13px] font-extrabold text-white shadow-md shadow-brand-blue/20 transition-all hover:bg-brand-blue/90">
              <Icon name="RiDownloadLine" className="h-4 w-4" />
              导出数据
            </button>
          </div>

          {activeFilter ? (
            <div className="flex items-center justify-between gap-3 border-b border-blue-100 bg-blue-50 px-6 py-3 text-xs font-bold text-blue-700">
              <div>
                Agent 已筛选：{activeFilter.label}，显示 {visibleSubmissions.length} / {submissions.length} 条记录
              </div>
              <button
                type="button"
                onClick={() => setActiveFilter(null)}
                className="rounded-lg border border-blue-200 bg-white px-3 py-1.5 text-[11px] font-black text-blue-700 hover:bg-blue-50"
              >
                清除筛选
              </button>
            </div>
          ) : null}

          <div className="flex-1 overflow-auto">
            {visibleSubmissions.length > 0 ? (
              <table className="w-full min-w-[1000px] text-left">
                <thead className="sticky top-0 z-10 bg-slate-50/90 shadow-sm backdrop-blur-sm">
                  <tr>
                    <th className="px-6 py-4 text-[11px] font-extrabold uppercase tracking-widest text-slate-400">ID / 时间</th>
                    <th className="px-6 py-4 text-[11px] font-extrabold uppercase tracking-widest text-slate-400">状态</th>
                    <th className="px-6 py-4 text-[11px] font-extrabold uppercase tracking-widest text-slate-400">OCR 识别</th>
                    <th className="px-6 py-4 text-[11px] font-extrabold uppercase tracking-widest text-slate-400">工作流流转</th>
                    <th className="px-6 py-4 text-[11px] font-extrabold uppercase tracking-widest text-slate-400">数据 (JSON)</th>
                  </tr>
                </thead>
                <tbody className="text-[13px] font-bold text-slate-700">
                  {visibleSubmissions.map((item) => {
                    const submissionStatus = getSubmissionStatusView(item.status);
                    const ocrStatus = getOcrStatusView(item.ocr_status);
                    const workflowStatus = getWorkflowStatusView(item.workflow_run?.status);

                    return (
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
                          <Badge variant="outline" className={submissionStatus.badgeClassName}>
                            {submissionStatus.label}
                          </Badge>
                        </td>
                        <td className="max-w-[200px] px-6 py-5">
                          <div className="flex flex-col gap-1">
                            <span className="flex items-center gap-1.5 text-[11px]">
                              <div className={`h-1.5 w-1.5 rounded-full ${ocrStatus.dotClassName}`} />
                              <span className="font-extrabold uppercase tracking-wider text-slate-500">
                                {ocrStatus.label}
                              </span>
                            </span>
                            <span className="truncate text-[12px] text-slate-600" title={item.ocr_result_json?.summary || item.ocr_error_message}>
                              {item.ocr_result_json?.summary || item.ocr_error_message || "-"}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-5">
                          {item.workflow_run ? (
                            <Badge variant="outline" className={`flex w-fit items-center gap-2 ${workflowStatus.badgeClassName}`}>
                              <Icon name="RiNodeTree" className="h-3.5 w-3.5" />
                              {workflowStatus.label}
                            </Badge>
                          ) : (
                            <span className="text-slate-300">-</span>
                          )}
                        </td>
                        <td className="max-w-[300px] px-6 py-5">
                          <div className="truncate rounded-lg border border-slate-100 bg-slate-50 px-2 py-1.5 font-mono text-[11px] text-slate-500" title={JSON.stringify(item.answers_json)}>
                            {JSON.stringify(item.answers_json)}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            ) : (
              <div className="flex h-full flex-col items-center justify-center space-y-4 p-12 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-50 text-slate-300">
                  <Icon name="RiDatabase2Line" className="h-8 w-8" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-slate-900">
                    {activeFilter || searchTerm ? "没有匹配记录" : emptyMessage}
                  </h3>
                  <p className="mt-1 text-xs font-semibold text-slate-500">
                    {activeFilter || searchTerm
                      ? "可以清除 Agent 筛选或右侧搜索条件后再查看。"
                      : "当前表单暂无任何提交记录"}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </AgentWorkspace>
  );
}

function DataAgentMetric({
  label,
  value,
  tone = "default",
}: {
  label: string;
  value: number;
  tone?: "default" | "warning";
}) {
  return (
    <div className={`rounded-xl border px-3 py-2 ${
      tone === "warning"
        ? "border-amber-200 bg-amber-50 text-amber-700"
        : "border-slate-200 bg-white text-slate-700"
    }`}>
      <div className="text-[10px] font-black uppercase tracking-wider opacity-60">{label}</div>
      <div className="mt-0.5 text-lg font-black">{value}</div>
    </div>
  );
}

function DataAgentList({
  title,
  items,
}: {
  title: string;
  items: string[];
}) {
  if (items.length === 0) {
    return null;
  }

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-3">
      <div className="mb-2 text-[10px] font-black uppercase tracking-wider text-slate-400">{title}</div>
      <div className="space-y-1.5">
        {items.slice(0, 3).map((item) => (
          <div key={item} className="text-[11px] font-semibold leading-5 text-slate-600">
            {item}
          </div>
        ))}
      </div>
    </div>
  );
}
