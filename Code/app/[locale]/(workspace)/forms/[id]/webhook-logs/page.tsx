import { TableColumn } from "@/types/blocks/table";

import AgentWorkspace from "@/components/agentfactory/agent-workspace";
import Empty from "@/components/blocks/empty";
import SceneSubnav from "@/components/agentfactory/scene-subnav";
import TableSlot from "@/components/console/slots/table";
import { Table as TableSlotType } from "@/types/slots/table";
import WebhookRetryButton from "@/components/forms/webhook-retry-button";
import {
  buildFormWebhookAgentResponses,
  buildFormWebhookAgentSummary,
} from "@/services/form-webhook-agent";
import { getFormByUuidForUser } from "@/services/form";
import { getTranslations } from "next-intl/server";
import { getUserUuid } from "@/services/user";
import { getWebhookStatusView } from "@/services/form-workflow-status";
import { listWebhookLogs } from "@/services/webhook-log";
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
  const isZh = locale.toLowerCase().startsWith("zh");
  const callbackUrl = `/${locale}/forms`;
  if (!user_uuid) {
    redirect(`/auth/signin?callbackUrl=${encodeURIComponent(callbackUrl)}`);
  }
  const form = await getFormByUuidForUser(user_uuid, id);
  if (!form) {
    return <Empty message={t("not_found")} />;
  }

  const logs = await listWebhookLogs(form);
  const webhookAgentSummary = buildFormWebhookAgentSummary(form, logs);
  const webhookAgentResponses = buildFormWebhookAgentResponses(webhookAgentSummary);

  const columns: TableColumn[] = [
    {
      name: "uuid",
      title: t("webhooks.table.log_id"),
      type: "copy",
    },
    {
      name: "submission_uuid",
      title: t("webhooks.table.submission_id"),
      type: "copy",
    },
    {
      name: "workflow_run_uuid",
      title: t("webhooks.table.workflow_run_id"),
      type: "copy",
    },
    {
      name: "target_url",
      title: t("webhooks.table.target_url"),
    },
    {
      name: "response_status",
      title: t("webhooks.table.response_status"),
    },
    {
      name: "status",
      title: t("webhooks.table.status"),
      callback: (item: any) => getWebhookStatusView(item.status).label,
    },
    {
      name: "error_message",
      title: t("webhooks.table.error_message"),
      callback: (item: any) => item.error_message || "-",
    },
    {
      name: "created_at",
      title: t("webhooks.table.created_at"),
      callback: (item: any) =>
        item.created_at
          ? moment(item.created_at).format("YYYY-MM-DD HH:mm:ss")
          : "-",
    },
    {
      title: isZh ? "操作" : "Actions",
      callback: (item: any) =>
        item.status === "failed" ? (
          <WebhookRetryButton formId={form.uuid} logId={item.uuid} />
        ) : (
          <span className="text-xs font-semibold text-slate-300">-</span>
        ),
    },
  ];

  const table: TableSlotType = {
    title: t("webhooks.title", { title: form.title }),
    description: t("webhooks.description"),
    toolbar: {
      items: [
        {
          title: t("back_to_form"),
          url: `/${locale}/forms/${form.uuid}`,
          icon: "RiArrowLeftLine",
          variant: "outline",
        },
      ],
    },
    columns,
    data: logs,
    empty_message: t("webhooks.empty"),
  };

  return (
    <AgentWorkspace
      agentTitle={isZh ? "Webhook 诊断助手" : "Webhook Diagnosis Assistant"}
      agentDescription={isZh ? "这里记录了所有外发请求的状态。你可以查询特定的推送失败原因，或通过 AI 助手分析接口联调问题。" : "All webhook payload delivery logs are recorded here. You can analyze push failure reasons, or troubleshoot API issues with the Assistant."}
      inputPlaceholder={isZh ? "例如：帮我查一下昨天下午 3 点失败的请求..." : "e.g. Help me look up the failed request at 3 PM yesterday..."}
      examples={[
        {
          label: isZh ? "分析失败原因" : "Analyze failure reasons",
          icon: "RiErrorWarningLine",
          response: webhookAgentResponses.failures,
        },
        {
          label: isZh ? "查询特定推送" : "Query specific delivery",
          icon: "RiSearch2Line",
          response: webhookAgentResponses.lookup,
        },
        {
          label: isZh ? "重试失败请求" : "Retry failed requests",
          icon: "RiRefreshLine",
          response: webhookAgentResponses.retry,
        },
      ]}
      staticResponses={[
        {
          keywords: isZh ? ["失败", "原因", "报错", "错误", "异常"] : ["failure", "reason", "error", "exception"],
          response: webhookAgentResponses.failures,
        },
        {
          keywords: isZh ? ["重试", "retry", "再推", "重新推送"] : ["retry", "repush"],
          response: webhookAgentResponses.retry,
        },
        {
          keywords: isZh ? ["查询", "查一下", "定位", "特定", "日志", "id"] : ["query", "find", "locate", "log", "id"],
          response: webhookAgentResponses.lookup,
        },
        {
          keywords: isZh ? ["分析", "概览", "总结", "情况", "状态", "统计"] : ["overview", "summary", "status", "stats"],
          response: webhookAgentResponses.overview,
        },
      ]}
      defaultResponse={webhookAgentResponses.defaultResponse}
      agentEndpoint={`/api/forms/${form.uuid}/webhook-logs/agent`}
    >
      <SceneSubnav
        locale={locale}
        formId={form.uuid}
        formTitle={form.title}
        active="publish"
      />
      <div className="p-6">
        <div className="rounded-[1.6rem] border border-slate-200 bg-white p-5 shadow-sm">
          <TableSlot {...table} />
        </div>
      </div>
    </AgentWorkspace>
  );
}
