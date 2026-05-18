import { FormRecord } from "@/types/form";
import { getIsoTimestr } from "@/lib/time";
import { getSupabaseClient } from "./db";
import { hasSupabaseConfig } from "./db";
import { readDevForms, writeDevForms } from "@/lib/dev-form-store";

export enum FormStatus {
  Draft = "draft",
  Published = "published",
}

export async function insertForm(form: FormRecord): Promise<FormRecord> {
  if (!hasSupabaseConfig()) {
    const forms = await readDevForms();
    const nextForm: FormRecord = {
      ...form,
      id: forms.length + 1,
      created_at: form.created_at || getIsoTimestr(),
      updated_at: form.updated_at || getIsoTimestr(),
    };
    forms.unshift(nextForm);
    await writeDevForms(forms);
    return nextForm;
  }

  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from("forms")
    .insert({
      ...form,
      schema_json: form.schema_json,
      ocr_template: form.ocr_template || "general_image",
      llm_provider: form.llm_provider || "",
      llm_model: form.llm_model || "",
      generation_meta_json: form.generation_meta_json || {},
      webhook_enabled: form.webhook_enabled ?? false,
      webhook_url: form.webhook_url || "",
      webhook_provider: form.webhook_provider || "generic",
      webhook_secret_encrypted: form.webhook_secret_encrypted || "",
      webhook_auth_mode: form.webhook_auth_mode || "none",
      webhook_keyword_encrypted: form.webhook_keyword_encrypted || "",
      webhook_header_name: form.webhook_header_name || "",
    })
    .select("*")
    .single();

  if (error) {
    throw error;
  }

  return data as FormRecord;
}

export async function findFormByUuid(
  uuid: string
): Promise<FormRecord | undefined> {
  if (!hasSupabaseConfig()) {
    const forms = await readDevForms();
    return forms.find((form) => form.uuid === uuid);
  }

  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from("forms")
    .select("*")
    .eq("uuid", uuid)
    .single();

  if (error) {
    return undefined;
  }

  return data as FormRecord;
}

export async function findFormByShareCode(
  share_code: string
): Promise<FormRecord | undefined> {
  if (!hasSupabaseConfig()) {
    const forms = await readDevForms();
    return forms.find((form) => form.share_code === share_code);
  }

  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from("forms")
    .select("*")
    .eq("share_code", share_code)
    .single();

  if (error) {
    return undefined;
  }

  return data as FormRecord;
}

export async function getFormsByUserUuid(
  user_uuid: string
): Promise<FormRecord[]> {
  if (!hasSupabaseConfig()) {
    const forms = await readDevForms();
    return forms.filter((form) => form.user_uuid === user_uuid);
  }

  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from("forms")
    .select("*")
    .eq("user_uuid", user_uuid)
    .order("created_at", { ascending: false });

  if (error || !data) {
    return [];
  }

  return data as FormRecord[];
}

export async function updateFormByUuid(
  uuid: string,
  updates: Partial<FormRecord>
): Promise<FormRecord | undefined> {
  if (!hasSupabaseConfig()) {
    const forms = await readDevForms();
    const formIndex = forms.findIndex((form) => form.uuid === uuid);
    if (formIndex < 0) {
      return undefined;
    }

    const nextForm = {
      ...forms[formIndex],
      ...updates,
      updated_at: updates.updated_at || getIsoTimestr(),
    };
    forms[formIndex] = nextForm;
    await writeDevForms(forms);
    return nextForm;
  }

  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from("forms")
    .update({
      ...updates,
      schema_json: updates.schema_json,
      generation_meta_json: updates.generation_meta_json,
    })
    .eq("uuid", uuid)
    .select("*")
    .single();

  if (error) {
    return undefined;
  }

  return data as FormRecord;
}
