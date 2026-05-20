import { WebhookLogRecord } from "@/types/form";
import { getSupabaseClient, hasSupabaseConfig } from "./db";

import { readDevWebhookLogs, writeDevWebhookLogs } from "@/lib/dev-webhook-log-store";

export async function insertWebhookLog(
  log: WebhookLogRecord
): Promise<WebhookLogRecord> {
  if (!hasSupabaseConfig()) {
    const logs = await readDevWebhookLogs();
    const nextLog: WebhookLogRecord = {
      ...log,
      id: logs.length + 1,
    };
    logs.unshift(nextLog);
    await writeDevWebhookLogs(logs);
    return nextLog;
  }

  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from("webhook_logs")
    .insert({
      ...log,
      request_body_json: log.request_body_json,
      error_message: log.error_message || "",
    })
    .select("*")
    .single();

  if (error) {
    throw error;
  }

  return data as WebhookLogRecord;
}

export async function getWebhookLogsByFormUuid(
  form_uuid: string
): Promise<WebhookLogRecord[]> {
  if (!hasSupabaseConfig()) {
    const logs = await readDevWebhookLogs();
    return logs.filter((log) => log.form_uuid === form_uuid);
  }

  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from("webhook_logs")
    .select("*")
    .eq("form_uuid", form_uuid)
    .order("created_at", { ascending: false });

  if (error || !data) {
    return [];
  }

  return data as WebhookLogRecord[];
}

export async function getWebhookLogByUuid(
  uuid: string
): Promise<WebhookLogRecord | undefined> {
  if (!hasSupabaseConfig()) {
    const logs = await readDevWebhookLogs();
    return logs.find((log) => log.uuid === uuid);
  }

  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from("webhook_logs")
    .select("*")
    .eq("uuid", uuid)
    .single();

  if (error || !data) {
    return undefined;
  }

  return data as WebhookLogRecord;
}

export async function updateWebhookLogByUuid(
  uuid: string,
  updates: Partial<WebhookLogRecord>
): Promise<WebhookLogRecord | undefined> {
  if (!hasSupabaseConfig()) {
    const logs = await readDevWebhookLogs();
    const index = logs.findIndex((log) => log.uuid === uuid);
    if (index < 0) {
      return undefined;
    }

    const nextLog = {
      ...logs[index],
      ...updates,
    };
    logs[index] = nextLog;
    await writeDevWebhookLogs(logs);
    return nextLog;
  }

  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from("webhook_logs")
    .update({
      ...updates,
      request_body_json: updates.request_body_json,
      error_message: updates.error_message,
    })
    .eq("uuid", uuid)
    .select("*")
    .single();

  if (error) {
    return undefined;
  }

  return data as WebhookLogRecord;
}
