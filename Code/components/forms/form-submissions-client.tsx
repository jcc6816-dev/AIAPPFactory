"use client";

import { useMemo, useState } from "react";
import moment from "moment";
import { useLocale } from "next-intl";

import AgentWorkspace from "@/components/agentfactory/agent-workspace";
import Icon from "@/components/icon";
import { Badge } from "@/components/ui/badge";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import {
  CheckCircle2,
  AlertTriangle,
  Loader2,
  Circle,
  FileText,
  Terminal,
  ExternalLink,
  Zap,
  Server,
  Database
} from "lucide-react";
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
import type { FormSubmissionRecord, FormSchema } from "@/types/form";
import type { WorkflowRunRecord } from "@/types/workflow";

type SubmissionWithWorkflow = FormSubmissionRecord & {
  workflow_run?: WorkflowRunRecord | null;
};

interface FormSubmissionsClientProps {
  formUuid: string;
  formSchema: FormSchema;
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
  formSchema,
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
  const [selectedSubmission, setSelectedSubmission] = useState<SubmissionWithWorkflow | null>(null);

  const locale = useLocale();
  const isZh = locale.toLowerCase().startsWith("zh");

  const handleExport = () => {
    const fields = formSchema?.fields || [];
    
    // 1. Build Headers
    const headers = [
      isZh ? "提交ID" : "Submission ID",
      isZh ? "提交时间" : "Timestamp",
      isZh ? "状态" : "Status",
      isZh ? "OCR 识别状态" : "OCR Status",
      isZh ? "OCR 摘要" : "OCR Summary",
      isZh ? "OCR 错误" : "OCR Error",
      isZh ? "工作流状态" : "Workflow Status",
      ...fields.map(f => f.label)
    ];

    // 2. Escape CSV cell helper
    const escapeCSV = (val: any) => {
      if (val === null || val === undefined) return '""';
      let str = String(val);
      str = str.replace(/"/g, '""');
      if (str.includes(",") || str.includes("\n") || str.includes('"')) {
        return `"${str}"`;
      }
      return `"${str}"`;
    };

    // 3. Map submissions
    const rows = visibleSubmissions.map(item => {
      const answers = item.answers_json || {};
      return [
        item.uuid,
        item.created_at ? moment(item.created_at).format("YYYY-MM-DD HH:mm:ss") : "",
        item.status,
        item.ocr_status || "",
        item.ocr_result_json?.summary || "",
        item.ocr_error_message || "",
        item.workflow_run?.status || "",
        ...fields.map(f => {
          const val = answers[f.key];
          return Array.isArray(val) ? val.join(", ") : (val !== null && val !== undefined ? String(val) : "");
        })
      ];
    });

    // 4. Generate CSV String
    const csvContent = [
      headers.map(escapeCSV).join(","),
      ...rows.map(row => row.map(escapeCSV).join(","))
    ].join("\n");

    // 5. Trigger browser download with BOM for Excel compatibility
    const blob = new Blob(["\uFEFF" + csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `submissions_${formUuid}_${moment().format("YYYYMMDD_HHmmss")}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

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
  const webhookTotal =
    dataAgentSummary.webhookCompletedCount + dataAgentSummary.webhookFailedCount;
  const webhookSuccessRate = webhookTotal
    ? Math.round((dataAgentSummary.webhookCompletedCount / webhookTotal) * 100)
    : 0;

  return (
    <AgentWorkspace
      agentTitle={isZh ? "AI 数据管家" : "AI Data Co-pilot"}
      agentDescription={isZh ? "我会用规则统计帮你看清数据健康度，也可以把自然语言问题转成可解释的筛选结果。" : "I use statistics to show data health, and translate natural language queries into filter results."}
      inputPlaceholder={isZh ? "例如：找出没有上传发票的记录..." : "e.g. Find records without uploaded invoices..."}
      agentInsights={
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-2">
            <DataAgentMetric label={isZh ? "提交" : "Submissions"} value={dataAgentSummary.totalSubmissions} />
            <DataAgentMetric label={isZh ? "完成" : "Completed"} value={dataAgentSummary.completedSubmissions} />
            <DataAgentMetric label={isZh ? "OCR 失败" : "OCR Failed"} value={dataAgentSummary.ocrFailedCount} tone="warning" />
            <DataAgentMetric label={isZh ? "Webhook 失败" : "Webhook Failed"} value={dataAgentSummary.webhookFailedCount} tone="warning" />
          </div>

          <DataAgentList
            title={isZh ? "观察结论" : "Observations"}
            items={dataAgentSummary.recentSubmissionHints}
          />

          {dataAgentSummary.missingFieldStats.length > 0 ? (
            <DataAgentList
              title={isZh ? "字段缺失" : "Missing Fields"}
              items={dataAgentSummary.missingFieldStats.map(
                (item) => `${item.label}${isZh ? "：缺失 " : ": missing "}${item.missingCount}${isZh ? " 次" : " times"}`
              )}
            />
          ) : null}

          <DataAgentList
            title={isZh ? "建议动作" : "Next Actions"}
            items={dataAgentSummary.recommendedActions}
          />
        </div>
      }
      examples={[
        {
          label: isZh ? "总结最近提交情况" : "Summarize recent submissions",
          icon: "RiSearchEyeLine",
          response: dataAgentResponses.summary,
          agentResult: {},
        },
        {
          label: isZh ? "筛选 OCR 失败记录" : "Filter OCR failed records",
          icon: "RiFileWarningLine",
          response: ocrFailedAgentResult.answer,
          agentResult: { filter: ocrFailedAgentResult.filter },
        },
        {
          label: isZh ? "找出没有上传发票的记录" : "Find records without invoice uploaded",
          icon: "RiImageLine",
          response: missingFileAgentResult.answer,
          agentResult: { filter: missingFileAgentResult.filter },
        },
        {
          label: isZh ? "查看 Webhook 失败原因" : "Inspect Webhook failures",
          icon: "RiAlertLine",
          response: webhookFailedAgentResult.answer,
          agentResult: { filter: webhookFailedAgentResult.filter },
        },
      ]}
      staticResponses={[
        {
          keywords: isZh ? ["总结", "最近", "提交", "情况", "数据", "统计"] : ["summary", "recent", "submissions", "stats", "data"],
          response: dataAgentResponses.summary,
        },
        {
          keywords: isZh ? ["ocr", "识别", "图片"] : ["ocr", "parse", "photo", "image"],
          response: dataAgentResponses.ocrFailures,
        },
        {
          keywords: isZh ? ["webhook", "推送", "失败", "原因"] : ["webhook", "push", "failed", "reason"],
          response: dataAgentResponses.webhookFailures,
        },
      ]}
      defaultResponse={dataAgentResponses.defaultResponse}
      agentEndpoint={`/api/forms/${formUuid}/data-agent`}
      inputHint={isZh ? "左侧输入会触发 Agent；右侧搜索框只筛表格" : "Left input triggers AI Agent; right search box only filters table"}
      onAgentResult={(result) => {
        setActiveFilter(result.filter || null);
      }}
    >
      <div className="flex h-full min-h-0 flex-col p-6">
        <div className="mb-5 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          <MainDataMetric
            label={isZh ? "累计提交" : "Total Submissions"}
            value={String(dataAgentSummary.totalSubmissions)}
            detail={isZh ? "公开表单收集结果" : "Collected from public forms"}
          />
          <MainDataMetric
            label={isZh ? "完成提交" : "Completed"}
            value={String(dataAgentSummary.completedSubmissions)}
            detail={isZh ? "已完成自动流转" : "Finished processing"}
          />
          <MainDataMetric
            label={isZh ? "Webhook 成功率" : "Webhook Success"}
            value={webhookTotal ? `${webhookSuccessRate}%` : "-"}
            detail={
              webhookTotal
                ? `${dataAgentSummary.webhookCompletedCount}/${webhookTotal}`
                : isZh
                  ? "暂无推送记录"
                  : "No delivery yet"
            }
            tone={dataAgentSummary.webhookFailedCount > 0 ? "warning" : "default"}
          />
          <MainDataMetric
            label={isZh ? "当前视图" : "Current View"}
            value={`${visibleSubmissions.length}/${submissions.length}`}
            detail={activeFilter || searchTerm ? (isZh ? "筛选后记录" : "Filtered records") : (isZh ? "全部记录" : "All records")}
          />
        </div>
        <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-[1.6rem] border border-slate-200 bg-white shadow-sm">
          <div className="flex items-center justify-between gap-4 border-b border-slate-100 bg-white px-6 py-4">
            <div className="flex w-80 items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-slate-500 transition-all focus-within:border-brand-blue focus-within:bg-white focus-within:text-brand-blue">
              <Icon name="RiSearchLine" className="h-4 w-4" />
              <input
                type="text"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder={isZh ? "搜索表格内容，不触发 Agent..." : "Search table content locally..."}
                className="w-full bg-transparent text-[13px] font-bold text-slate-900 outline-none placeholder:font-semibold placeholder:text-slate-400"
              />
            </div>
            <button
              onClick={handleExport}
              className="flex items-center gap-2 rounded-xl bg-brand-blue px-4 py-2 text-[13px] font-extrabold text-white shadow-md shadow-brand-blue/20 transition-all hover:bg-brand-blue/90"
            >
              <Icon name="RiDownloadLine" className="h-4 w-4" />
              {isZh ? "导出数据" : "Export Data"}
            </button>
          </div>

          {activeFilter ? (
            <div className="flex items-center justify-between gap-3 border-b border-blue-100 bg-blue-50 px-6 py-3 text-xs font-bold text-blue-700">
              <div>
                {isZh ? `Agent 已筛选：${activeFilter.label}，显示 ${visibleSubmissions.length} / ${submissions.length} 条记录` : `AI Filtered: ${activeFilter.label}, showing ${visibleSubmissions.length} / ${submissions.length} entries`}
              </div>
              <button
                type="button"
                onClick={() => setActiveFilter(null)}
                className="rounded-lg border border-blue-200 bg-white px-3 py-1.5 text-[11px] font-black text-blue-700 hover:bg-blue-50"
              >
                {isZh ? "清除筛选" : "Clear Filter"}
              </button>
            </div>
          ) : null}

          <div className="flex-1 overflow-auto">
            {visibleSubmissions.length > 0 ? (
              <table className="w-full min-w-[1000px] text-left">
                <thead className="sticky top-0 z-10 bg-slate-50/90 shadow-sm backdrop-blur-sm">
                  <tr>
                    <th className="px-6 py-4 text-[11px] font-extrabold uppercase tracking-widest text-slate-400">{isZh ? "ID / 时间" : "ID / Timestamp"}</th>
                    <th className="px-6 py-4 text-[11px] font-extrabold uppercase tracking-widest text-slate-400">{isZh ? "状态" : "Status"}</th>
                    {(formSchema?.fields || []).map((f) => (
                      <th key={f.key} className="px-6 py-4 text-[11px] font-extrabold uppercase tracking-widest text-slate-400">{f.label}</th>
                    ))}
                    <th className="px-6 py-4 text-[11px] font-extrabold uppercase tracking-widest text-slate-400">{isZh ? "OCR 识别" : "OCR Extraction"}</th>
                    <th className="px-6 py-4 text-[11px] font-extrabold uppercase tracking-widest text-slate-400">{isZh ? "工作流流转" : "Workflow Pipeline"}</th>
                  </tr>
                </thead>
                <tbody className="text-[13px] font-bold text-slate-700">
                  {visibleSubmissions.map((item) => {
                    const submissionStatus = getSubmissionStatusView(item.status, isZh);
                    const ocrStatus = getOcrStatusView(item.ocr_status, isZh);
                    const workflowStatus = getWorkflowStatusView(item.workflow_run?.status, isZh);

                    return (
                      <tr
                        key={item.uuid}
                        onClick={() => setSelectedSubmission(item)}
                        className="border-b border-slate-50 transition-colors hover:bg-slate-50/50 cursor-pointer hover:bg-slate-50/70"
                      >
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
                        {(formSchema?.fields || []).map((f) => {
                          const val = item.answers_json?.[f.key];
                          const displayVal = Array.isArray(val)
                            ? val.join(", ")
                            : (val !== null && val !== undefined ? String(val) : "-");
                          return (
                            <td key={f.key} className="max-w-[240px] px-6 py-5 text-[12px] text-slate-700 truncate" title={displayVal}>
                              {displayVal}
                            </td>
                          );
                        })}
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
                    {activeFilter || searchTerm ? (isZh ? "没有匹配记录" : "No matching records") : emptyMessage}
                  </h3>
                  <p className="mt-1 text-xs font-semibold text-slate-500">
                    {activeFilter || searchTerm
                      ? (isZh ? "可以清除 Agent 筛选或右侧搜索条件后再查看。" : "Clear filters or search terms to see all results.")
                      : (isZh ? "当前表单暂无任何提交记录" : "No submissions recorded yet for this form")}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <Sheet open={!!selectedSubmission} onOpenChange={(open) => !open && setSelectedSubmission(null)}>
        <SheetContent className="w-[500px] sm:w-[600px] md:w-[700px] max-w-full overflow-y-auto border-l border-slate-200 bg-slate-50 p-0 flex flex-col h-full">
          {/* Header */}
          <div className="bg-white border-b border-slate-100 p-6 shrink-0">
            <SheetHeader>
              <div className="flex items-center gap-2 text-brand-blue text-xs font-black uppercase tracking-wider">
                <Server className="h-4 w-4" />
                <span>{isZh ? "数据提交流水线" : "SUBMISSION PIPELINE"}</span>
              </div>
              <SheetTitle className="text-xl font-extrabold text-slate-900 mt-1 flex items-center justify-between">
                <span>{isZh ? "提交详情" : "Submission Details"}</span>
                {selectedSubmission && (
                  <Badge variant="outline" className={getSubmissionStatusView(selectedSubmission.status, isZh).badgeClassName}>
                    {getSubmissionStatusView(selectedSubmission.status, isZh).label}
                  </Badge>
                )}
              </SheetTitle>
              <SheetDescription className="text-xs font-mono font-bold text-slate-400 mt-1 break-all">
                ID: {selectedSubmission?.uuid}
              </SheetDescription>
            </SheetHeader>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {selectedSubmission && (
              <>
                {/* Section 1: Answers */}
                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
                  <h3 className="text-xs font-black uppercase tracking-wider text-slate-400 border-b border-slate-100 pb-2 flex items-center gap-2">
                    <Database className="h-3.5 w-3.5 text-slate-400" />
                    {isZh ? "表单答卷数据" : "Form Fields Data"}
                  </h3>
                  <div className="grid gap-3.5 text-xs">
                    {formSchema?.fields?.map((f) => {
                      const val = selectedSubmission.answers_json?.[f.key];
                      const displayVal = Array.isArray(val)
                        ? val.join(", ")
                        : (val !== null && val !== undefined ? String(val) : "-");
                      return (
                        <div key={f.key} className="flex flex-col gap-1 sm:flex-row sm:items-start border-b border-slate-50 pb-2 last:border-0 last:pb-0">
                          <span className="font-bold text-slate-500 w-full sm:w-1/3 shrink-0">{f.label}</span>
                          <span className="font-semibold text-slate-900 w-full break-all whitespace-pre-wrap">{displayVal}</span>
                        </div>
                      );
                    })}
                    {/* Timestamp */}
                    <div className="flex flex-col gap-1 sm:flex-row sm:items-start pt-2">
                      <span className="font-bold text-slate-500 w-full sm:w-1/3 shrink-0">{isZh ? "提交时间" : "Submitted At"}</span>
                      <span className="font-semibold text-slate-400 w-full">
                        {selectedSubmission.created_at ? moment(selectedSubmission.created_at).format("YYYY-MM-DD HH:mm:ss") : "-"}
                      </span>
                    </div>
                  </div>

                  {/* Attachment if present */}
                  {selectedSubmission.files_json && selectedSubmission.files_json.length > 0 && (
                    <div className="mt-4 pt-3 border-t border-slate-100">
                      <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-wider mb-2">
                        {isZh ? "关联附件" : "Attachments"}
                      </h4>
                      <div className="space-y-2">
                        {selectedSubmission.files_json.map((file: any, i: number) => (
                          <a
                            key={i}
                            href={file.file_url || "#"}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 text-xs font-semibold text-brand-blue hover:underline bg-slate-50 border border-slate-100 p-2.5 rounded-xl transition hover:bg-slate-100/50"
                          >
                            <FileText className="h-4 w-4 text-slate-400" />
                            <span className="truncate max-w-[200px]">{file.file_name}</span>
                            <span className="text-[10px] text-slate-400 ml-1">
                              {file.file_size ? `(${(file.file_size / 1024).toFixed(1)} KB)` : ""}
                            </span>
                            <ExternalLink className="h-3.5 w-3.5 opacity-60 ml-auto" />
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Section 2: Timeline */}
                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                  <h3 className="text-xs font-black uppercase tracking-wider text-slate-400 border-b border-slate-100 pb-3 mb-4 flex items-center gap-2">
                    <Zap className="h-3.5 w-3.5 text-brand-blue" />
                    {isZh ? "技能自动化流水线 (Workflow Skills)" : "Workflow Pipeline"}
                  </h3>

                  {!selectedSubmission.workflow_run ? (
                    <div className="text-center py-6">
                      <p className="text-xs font-semibold text-slate-400">
                        {isZh ? "该提交未关联任何技能流水线" : "No workflow execution associated with this submission."}
                      </p>
                    </div>
                  ) : (
                    <div className="relative pl-6 space-y-6">
                      {/* Left timeline bar */}
                      <div className="absolute left-[9px] top-2 bottom-2 w-px bg-slate-100" />

                      {selectedSubmission.workflow_run.steps_json.map((step, idx) => {
                        const isLast = idx === selectedSubmission.workflow_run!.steps_json.length - 1;
                        let statusIcon;
                        
                        switch (step.status) {
                          case "completed":
                            statusIcon = <CheckCircle2 className="h-5 w-5 text-emerald-500 fill-emerald-50 shrink-0" />;
                            break;
                          case "failed":
                            statusIcon = <AlertTriangle className="h-5 w-5 text-rose-500 fill-rose-50 shrink-0" />;
                            break;
                          case "processing":
                            statusIcon = <Loader2 className="h-5 w-5 text-blue-500 animate-spin shrink-0" />;
                            break;
                          default:
                            statusIcon = <Circle className="h-5 w-5 text-slate-300 fill-slate-50 shrink-0" />;
                            break;
                        }

                        return (
                          <div key={step.code} className="relative group">
                            {/* Bullet icon */}
                            <div className="absolute -left-[26px] top-0.5 z-10 flex h-5 w-5 items-center justify-center rounded-full bg-white">
                              {statusIcon}
                            </div>
                            
                            {/* Bullet line connector */}
                            {!isLast && (
                              <div className={`absolute -left-[17px] top-6 bottom-[-24px] w-px ${
                                step.status === "completed" ? "bg-emerald-100" : "bg-slate-100"
                              }`} />
                            )}

                            <div className="space-y-1.5">
                              {/* Step Header */}
                              <div className="flex flex-wrap items-center justify-between gap-2">
                                <div className="flex items-center gap-1.5">
                                  <span className="text-[13px] font-black text-slate-900 leading-none">
                                    {step.title}
                                  </span>
                                  <span className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-[9px] font-bold text-slate-500 uppercase tracking-wider scale-90">
                                    {step.code}
                                  </span>
                                </div>
                                {step.durationMs !== undefined && step.durationMs > 0 && (
                                  <span className="text-[10px] font-extrabold text-slate-400 bg-slate-50 border border-slate-100 rounded px-1.5 py-0.5">
                                    {step.durationMs}ms
                                  </span>
                                )}
                              </div>

                              {/* Terminal Log Output */}
                              {step.status !== "pending" && (
                                <div className="rounded-xl border border-slate-950 bg-slate-950 p-3 shadow-inner">
                                  <div className="flex items-center justify-between border-b border-slate-800 pb-1.5 mb-2 font-mono text-[9px] text-slate-500 uppercase tracking-widest">
                                    <span className="flex items-center gap-1">
                                      <Terminal className="h-3 w-3" />
                                      {step.code}_pipeline_log
                                    </span>
                                    <span>utf-8</span>
                                  </div>
                                  <p className="font-mono text-[11px] leading-relaxed text-slate-300 whitespace-pre-wrap break-all">
                                    {step.detail}
                                  </p>

                                  {/* Render OCR extraction payload */}
                                  {step.code === "table_ocr" && step.status === "completed" && (
                                    (() => {
                                      const tableRows = selectedSubmission.ocr_result_json?.structured_data?.table_rows;
                                      if (Array.isArray(tableRows) && tableRows.length > 0) {
                                        return (
                                          <div className="mt-3 rounded-lg border border-slate-800 bg-slate-900/40 p-2.5">
                                            <div className="mb-2 text-[9px] font-black text-slate-500 uppercase tracking-wider">
                                              {isZh ? "📋 OCR 提取商品列表数据" : "📋 OCR Extracted Grid Data"}
                                            </div>
                                            <table className="w-full text-[10px] font-mono text-slate-300 text-left">
                                              <thead>
                                                <tr className="border-b border-slate-800 text-slate-600">
                                                  <th className="pb-1 font-bold">{isZh ? "项名称" : "Item"}</th>
                                                  <th className="pb-1 font-bold text-center">{isZh ? "数量" : "Qty"}</th>
                                                  <th className="pb-1 font-bold">{isZh ? "规格" : "Spec"}</th>
                                                </tr>
                                              </thead>
                                              <tbody>
                                                {tableRows.map((row: any, rIdx: number) => (
                                                  <tr key={rIdx} className="border-b border-slate-800/20 last:border-0">
                                                    <td className="py-1 text-slate-200">{row.item_name}</td>
                                                    <td className="py-1 text-center text-slate-300">{row.qty}</td>
                                                    <td className="py-1 text-slate-400">{row.spec || "-"}</td>
                                                  </tr>
                                                ))}
                                              </tbody>
                                            </table>
                                          </div>
                                        );
                                      }
                                      return null;
                                    })()
                                  )}

                                  {/* Render AI Pre-audit results */}
                                  {step.code === "ai_pre_audit" && step.status === "completed" && (
                                    (() => {
                                      const isWarning = step.detail?.toLowerCase().includes("warning");
                                      return (
                                        <div className={`mt-3 rounded-lg border p-2.5 ${
                                          isWarning
                                            ? "border-amber-500/30 bg-amber-500/5 text-amber-200"
                                            : "border-emerald-500/20 bg-emerald-500/5 text-emerald-300"
                                        }`}>
                                          <div className="flex items-center gap-1.5 text-[9px] font-black uppercase tracking-wider mb-1">
                                            {isWarning ? (
                                              <>
                                                <AlertTriangle className="h-3.5 w-3.5 text-amber-500 shrink-0" />
                                                <span>{isZh ? "AI 预审警告" : "AI Audit Warning"}</span>
                                              </>
                                            ) : (
                                              <>
                                                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                                                <span>{isZh ? "AI 预审合规" : "AI Audit Passed"}</span>
                                              </>
                                            )}
                                          </div>
                                          <p className="text-[10px] leading-relaxed">
                                            {isWarning
                                              ? (isZh
                                                  ? "警报：该提交记录被标记为‘高风险/额度超标异常’。项目费用预算已触发政策警示机制，请人工双核。"
                                                  : "Flagged: Budget limit violation warning triggered. Route priority approval requested.")
                                              : (isZh
                                                  ? "政策合规：未检测到任何制度偏离，数据已归档。"
                                                  : "Compliance verified: Zero violations detected. Record archived.")}
                                          </p>
                                        </div>
                                      );
                                    })()
                                  )}

                                  {/* Render Deduplication status results */}
                                  {step.code === "deduplication" && (
                                    <div className="mt-3 p-2 bg-slate-900/40 border border-slate-800 rounded-lg text-[9px] space-y-1 text-slate-400">
                                      <div className="flex justify-between font-mono text-[8px] text-slate-600">
                                        <span>METHOD: UNIQUE_ID MATCH</span>
                                        <span className={step.status === "failed" ? "text-rose-500" : "text-emerald-500"}>
                                          {step.status === "failed" ? "CLASH" : "CLEAN"}
                                        </span>
                                      </div>
                                      <div className="font-mono text-[9px] truncate">
                                        SHA-256: {selectedSubmission.uuid}
                                      </div>
                                      {step.status === "failed" && (
                                        <div className="text-rose-400 font-bold mt-1 text-[9px]">
                                          {isZh ? "⚠️ 重复碰撞拦截，工作流流转已熔断终止。" : "⚠️ Collision Alert: Subsequent steps halted."}
                                        </div>
                                      )}
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </SheetContent>
      </Sheet>
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

function MainDataMetric({
  label,
  value,
  detail,
  tone = "default",
}: {
  label: string;
  value: string;
  detail: string;
  tone?: "default" | "warning";
}) {
  return (
    <div className={`rounded-[1.4rem] border bg-white p-4 shadow-sm ${
      tone === "warning" ? "border-amber-200" : "border-slate-200"
    }`}>
      <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
        {label}
      </p>
      <p className={`mt-2 text-2xl font-black ${
        tone === "warning" ? "text-amber-600" : "text-slate-950"
      }`}>
        {value}
      </p>
      <p className="mt-1 text-xs font-semibold text-slate-500">{detail}</p>
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
