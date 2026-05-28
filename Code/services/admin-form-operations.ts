import { FormRecord, FormSubmissionRecord, WebhookLogRecord } from "@/types/form";
import { getFormSubmissions } from "@/models/form-submission";
import { getForms } from "@/models/form";
import { getUsersByUuids } from "@/models/user";
import { getWebhookLogs } from "@/models/webhook-log";

export interface AdminFormOperationRow {
  uuid: string;
  title: string;
  ownerEmail: string;
  ownerUuid: string;
  status: string;
  theme: string;
  submissions: number;
  webhookFailures: number;
  lastSubmissionAt: string;
  createdAt: string;
}

export interface AdminFormOperationSummary {
  totals: {
    forms: number;
    published: number;
    drafts: number;
    submissions: number;
    webhookFailures: number;
  };
  rows: AdminFormOperationRow[];
}

function countBy<T>(items: T[], keyFn: (item: T) => string) {
  const map = new Map<string, number>();
  for (const item of items) {
    const key = keyFn(item);
    map.set(key, (map.get(key) || 0) + 1);
  }
  return map;
}

function latestSubmissionByForm(submissions: FormSubmissionRecord[]) {
  const map = new Map<string, string>();
  for (const submission of submissions) {
    const current = map.get(submission.form_uuid) || "";
    const next = submission.created_at || "";
    if (next && (!current || next > current)) {
      map.set(submission.form_uuid, next);
    }
  }
  return map;
}

export function buildAdminFormOperationSummary(
  forms: FormRecord[],
  submissions: FormSubmissionRecord[],
  webhookLogs: WebhookLogRecord[],
  users: Array<{ uuid?: string; email: string }>
): AdminFormOperationSummary {
  const submissionsByForm = countBy(submissions, (item) => item.form_uuid);
  const failuresByForm = countBy(
    webhookLogs.filter((log) => log.status === "failed"),
    (item) => item.form_uuid
  );
  const lastSubmissionByForm = latestSubmissionByForm(submissions);
  const userEmailByUuid = new Map(users.map((user) => [user.uuid || "", user.email]));

  return {
    totals: {
      forms: forms.length,
      published: forms.filter((form) => form.status === "published").length,
      drafts: forms.filter((form) => form.status !== "published").length,
      submissions: submissions.length,
      webhookFailures: webhookLogs.filter((log) => log.status === "failed").length,
    },
    rows: forms.map((form) => ({
      uuid: form.uuid,
      title: form.title,
      ownerEmail: userEmailByUuid.get(form.user_uuid) || form.user_uuid,
      ownerUuid: form.user_uuid,
      status: form.status,
      theme: form.theme,
      submissions: submissionsByForm.get(form.uuid) || 0,
      webhookFailures: failuresByForm.get(form.uuid) || 0,
      lastSubmissionAt: lastSubmissionByForm.get(form.uuid) || "",
      createdAt: form.created_at || "",
    })),
  };
}

export async function getAdminFormOperationSummary() {
  const forms = await getForms(1, 300);
  const submissions = await getFormSubmissions(1, 1000);
  const webhookLogs = await getWebhookLogs(1, 1000);
  const userUuids = Array.from(new Set(forms.map((form) => form.user_uuid).filter(Boolean)));
  const users = userUuids.length > 0 ? await getUsersByUuids(userUuids) : [];

  return buildAdminFormOperationSummary(forms, submissions, webhookLogs, users);
}
