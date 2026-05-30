import Empty from "@/components/blocks/empty";
import SceneSubnav from "@/components/agentfactory/scene-subnav";
import FormSubmissionsClient from "@/components/forms/form-submissions-client";
import { getFormByUuidForUser } from "@/services/form";
import { getTranslations } from "next-intl/server";
import { getUserUuid } from "@/services/user";
import { listFormSubmissions } from "@/services/form-runtime";
import { listWebhookLogs } from "@/services/webhook-log";
import {
  answerFormDataAgentQueryWithContext,
  buildFormDataAgentResponses,
  buildFormDataAgentSummary,
} from "@/services/form-data-agent";
import { findWorkflowRunByUuid } from "@/models/workflow";
import { redirect } from "next/navigation";

export default async function ({
  params,
}: {
  params: Promise<{ id: string; locale: string }>;
}) {
  const t = await getTranslations("forms");
  const user_uuid = await getUserUuid();
  const { id, locale } = await params;
  const callbackUrl = `/${locale}/forms`;
  if (!user_uuid) {
    redirect(`/auth/signin?callbackUrl=${encodeURIComponent(callbackUrl)}`);
  }

  const form = await getFormByUuidForUser(user_uuid, id);
  if (!form) {
    return <Empty message={t("not_found")} />;
  }

  const [submissions, webhookLogs] = await Promise.all([
    listFormSubmissions(form),
    listWebhookLogs(form),
  ]);
  const isZh = locale.toLowerCase().startsWith("zh");
  const dataAgentSummary = buildFormDataAgentSummary(form, submissions, webhookLogs);
  const dataAgentResponses = buildFormDataAgentResponses(dataAgentSummary);
  const ocrFailedAgentResult = answerFormDataAgentQueryWithContext(
    isZh ? "筛选 OCR 失败记录" : "Filter OCR failure logs",
    form,
    submissions,
    webhookLogs
  );
  const missingFileAgentResult = answerFormDataAgentQueryWithContext(
    isZh ? "找出没有上传发票的记录" : "Find records without uploaded invoice",
    form,
    submissions,
    webhookLogs
  );
  const webhookFailedAgentResult = answerFormDataAgentQueryWithContext(
    isZh ? "查看 Webhook 失败原因" : "Check Webhook failure reasons",
    form,
    submissions,
    webhookLogs
  );
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
      <div className="flex min-h-0 flex-1 flex-col">
        <FormSubmissionsClient
          formUuid={form.uuid}
          formSchema={form.schema_json}
          submissions={submissionsWithWorkflow}
          dataAgentSummary={dataAgentSummary}
          dataAgentResponses={dataAgentResponses}
          ocrFailedAgentResult={ocrFailedAgentResult}
          missingFileAgentResult={missingFileAgentResult}
          webhookFailedAgentResult={webhookFailedAgentResult}
          emptyMessage={t("submissions.empty")}
        />
      </div>
    </div>
  );
}
