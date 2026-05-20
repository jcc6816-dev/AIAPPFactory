import { TableColumn } from "@/types/blocks/table";

import AgentWorkspace from "@/components/agentfactory/agent-workspace";
import Empty from "@/components/blocks/empty";
import SceneSubnav from "@/components/agentfactory/scene-subnav";
import TableSlot from "@/components/console/slots/table";
import { Table as TableSlotType } from "@/types/slots/table";
import WebhookRetryButton from "@/components/forms/webhook-retry-button";
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
  const callbackUrl = `${process.env.NEXT_PUBLIC_WEB_URL}/${locale}/forms`;
  if (!user_uuid) {
    redirect(`/auth/signin?callbackUrl=${encodeURIComponent(callbackUrl)}`);
  }
  const form = await getFormByUuidForUser(user_uuid, id);
  if (!form) {
    return <Empty message={t("not_found")} />;
  }

  const logs = await listWebhookLogs(form);

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
      title: "操作",
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
      agentTitle="Webhook 诊断助手"
      agentDescription="这里记录了所有外发请求的状态。你可以查询特定的推送失败原因，或通过 AI 助手分析接口联调问题。"
      inputPlaceholder="例如：帮我查一下昨天下午 3 点失败的请求..."
      examples={[
        { label: "分析失败原因", icon: "RiErrorWarningLine" },
        { label: "查询特定推送", icon: "RiSearch2Line" },
        { label: "重试失败请求", icon: "RiRefreshLine" },
      ]}
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
