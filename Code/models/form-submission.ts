import { FormSubmissionRecord } from "@/types/form";
import { getSupabaseClient, hasSupabaseConfig } from "./db";

import { readDevFormSubmissions, writeDevFormSubmissions } from "@/lib/dev-form-submission-store";

export enum FormSubmissionStatus {
  Submitted = "submitted",
}

export async function insertFormSubmission(
  submission: FormSubmissionRecord
): Promise<FormSubmissionRecord> {
  if (!hasSupabaseConfig()) {
    const submissions = await readDevFormSubmissions();
    const nextSubmission: FormSubmissionRecord = {
      ...submission,
      id: submissions.length + 1,
    };
    submissions.unshift(nextSubmission);
    await writeDevFormSubmissions(submissions);
    return nextSubmission;
  }

  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from("form_submissions")
    .insert({
      ...submission,
      answers_json: submission.answers_json,
      files_json: submission.files_json,
      storage_files_json: submission.storage_files_json || [],
      ocr_status: submission.ocr_status || "not_requested",
      ocr_provider: submission.ocr_provider || "",
      ocr_result_json: submission.ocr_result_json || {},
      ocr_error_message: submission.ocr_error_message || "",
    })
    .select("*")
    .single();

  if (error) {
    throw error;
  }

  return data as FormSubmissionRecord;
}

export async function updateFormSubmissionByUuid(
  uuid: string,
  updates: Partial<FormSubmissionRecord>
): Promise<FormSubmissionRecord | undefined> {
  if (!hasSupabaseConfig()) {
    const submissions = await readDevFormSubmissions();
    const index = submissions.findIndex((submission) => submission.uuid === uuid);
    if (index < 0) {
      return undefined;
    }

    const nextSubmission = {
      ...submissions[index],
      ...updates,
    };
    submissions[index] = nextSubmission;
    await writeDevFormSubmissions(submissions);
    return nextSubmission;
  }

  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from("form_submissions")
    .update({
      ...updates,
      answers_json: updates.answers_json,
      files_json: updates.files_json,
      storage_files_json: updates.storage_files_json,
      ocr_result_json: updates.ocr_result_json,
    })
    .eq("uuid", uuid)
    .select("*")
    .single();

  if (error) {
    return undefined;
  }

  return data as FormSubmissionRecord;
}

export async function getFormSubmissionByUuid(
  uuid: string
): Promise<FormSubmissionRecord | undefined> {
  if (!hasSupabaseConfig()) {
    const submissions = await readDevFormSubmissions();
    return submissions.find((submission) => submission.uuid === uuid);
  }

  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from("form_submissions")
    .select("*")
    .eq("uuid", uuid)
    .single();

  if (error || !data) {
    return undefined;
  }

  return data as FormSubmissionRecord;
}

export async function getFormSubmissionsByFormUuid(
  form_uuid: string
): Promise<FormSubmissionRecord[]> {
  if (!hasSupabaseConfig()) {
    const submissions = await readDevFormSubmissions();
    return submissions.filter((submission) => submission.form_uuid === form_uuid);
  }

  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from("form_submissions")
    .select("*")
    .eq("form_uuid", form_uuid)
    .order("created_at", { ascending: false });

  if (error || !data) {
    return [];
  }

  return data as FormSubmissionRecord[];
}

export async function getFormSubmissions(
  page: number = 1,
  limit: number = 200
): Promise<FormSubmissionRecord[]> {
  if (page < 1) page = 1;
  if (limit <= 0) limit = 200;

  if (!hasSupabaseConfig()) {
    const submissions = await readDevFormSubmissions();
    return submissions.slice((page - 1) * limit, page * limit);
  }

  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from("form_submissions")
    .select("*")
    .order("created_at", { ascending: false })
    .range((page - 1) * limit, page * limit - 1);

  if (error || !data) {
    return [];
  }

  return data as FormSubmissionRecord[];
}
