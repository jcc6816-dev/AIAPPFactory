import type { FormRecord } from "@/types/form";
import type { GrowthEventRecord } from "@/types/growth-event";

export interface PendingPublishForm {
  form_uuid: string;
  created_at: string;
  age_minutes: number;
  source: string;
  template_id: string | null;
}

export interface FormPublishActivationMonitor {
  generated_at: string;
  window: { hours: number; pending_after_minutes: number };
  totals: {
    recent_forms: number;
    draft_forms: number;
    published_forms: number;
    pending_publish_forms: number;
  };
  decision: "pass" | "iterate" | "wait";
  notes: string[];
  pending_publish_forms: PendingPublishForm[];
}

function parsedTime(value: string | undefined) {
  const time = Date.parse(value || "");
  return Number.isFinite(time) ? time : 0;
}

function sourceForForm(form: FormRecord, events: GrowthEventRecord[]) {
  const created = events.find(
    (event) => event.event_name === "form_created" && event.form_uuid === form.uuid
  );
  const attribution = created?.metadata_json?.attribution;
  return String(attribution?.content_source || attribution?.channel || created?.source || "unattributed");
}

function templateForForm(form: FormRecord, events: GrowthEventRecord[]) {
  const created = events.find(
    (event) => event.event_name === "form_created" && event.form_uuid === form.uuid
  );
  const templateId =
    created?.metadata_json?.attribution?.template_id || created?.template_id;
  return typeof templateId === "string" && templateId.trim() ? templateId : null;
}

export function buildFormPublishActivationMonitor(
  forms: FormRecord[],
  events: GrowthEventRecord[],
  options: { now?: Date; hours?: number; pendingAfterMinutes?: number } = {}
): FormPublishActivationMonitor {
  const now = options.now || new Date();
  const hours = Math.min(Math.max(options.hours || 24, 1), 168);
  const pendingAfterMinutes = Math.min(
    Math.max(options.pendingAfterMinutes || 30, 5),
    24 * 60
  );
  const from = now.getTime() - hours * 60 * 60 * 1000;
  const recentForms = forms.filter((form) => parsedTime(form.created_at) >= from);
  const draftForms = recentForms.filter((form) => form.status === "draft");
  const publishedForms = recentForms.filter((form) => form.status === "published");
  const pendingPublishForms = draftForms
    .map((form) => ({
      form_uuid: form.uuid,
      created_at: form.created_at || "",
      age_minutes: Math.floor((now.getTime() - parsedTime(form.created_at)) / 60000),
      source: sourceForForm(form, events),
      template_id: templateForForm(form, events),
    }))
    .filter((form) => form.age_minutes >= pendingAfterMinutes)
    .sort((left, right) => right.age_minutes - left.age_minutes);

  const pendingCount = pendingPublishForms.length;
  return {
    generated_at: now.toISOString(),
    window: { hours, pending_after_minutes: pendingAfterMinutes },
    totals: {
      recent_forms: recentForms.length,
      draft_forms: draftForms.length,
      published_forms: publishedForms.length,
      pending_publish_forms: pendingCount,
    },
    decision: pendingCount >= 3 ? "iterate" : pendingCount > 0 ? "wait" : "pass",
    notes:
      pendingCount > 0
        ? ["Draft forms remain unpublished after the configured waiting period; inspect the publish page before changing acquisition."]
        : ["No recent forms are waiting beyond the publish grace period."],
    pending_publish_forms: pendingPublishForms,
  };
}
