import {
  FormAnswerValue,
  FormAnswers,
  FormRecord,
  FormSubmissionRecord,
  StoredFileAsset,
  SubmissionFileValue,
  SubmitFormPayload,
} from "@/types/form";
import {
  FormSubmissionStatus,
  getFormSubmissionsByFormUuid,
  insertFormSubmission,
  updateFormSubmissionByUuid,
} from "@/models/form-submission";

import { getIsoTimestr } from "@/lib/time";
import { getUniSeq } from "@/lib/hash";
import { chargeFormSubmissionCredits } from "./billing";
import { getUserCredits } from "./credit";
import {
  createWorkflowRunForSubmission,
  executeMockWorkflowRun,
} from "./workflow";

function normalizeAnswerValue(value: FormAnswerValue): FormAnswerValue {
  if (Array.isArray(value)) {
    return value.map((item) => String(item));
  }

  if (typeof value === "number" || typeof value === "boolean") {
    return value;
  }

  if (value === null || value === undefined) {
    return null;
  }

  return String(value).trim();
}

export function validateSubmissionAnswers(
  form: FormRecord,
  answers: FormAnswers,
  options?: {
    files?: SubmissionFileValue[];
    storage_files?: StoredFileAsset[];
  }
): FormAnswers {
  const nextAnswers: FormAnswers = {};
  const uploadedFieldKeys = new Set<string>([
    ...(options?.files || []).map((file) => file.field_key),
    ...(options?.storage_files || []).map((file) => file.field_key),
  ]);

  for (const field of form.schema_json.fields) {
    const rawValue = answers[field.key];
    const normalizedValue = normalizeAnswerValue(rawValue);
    const hasUploadedFile =
      (field.type === "file" || field.type === "image" || field.type === "pdf") &&
      uploadedFieldKeys.has(field.key);

    if (
      field.required &&
      !hasUploadedFile &&
      (normalizedValue === null ||
        normalizedValue === "" ||
        (Array.isArray(normalizedValue) && normalizedValue.length === 0))
    ) {
      throw new Error(`${field.label} is required`);
    }

    if (normalizedValue !== null) {
      nextAnswers[field.key] = normalizedValue;
    }
  }

  return nextAnswers;
}

export async function submitForm(
  form: FormRecord,
  payload: SubmitFormPayload
): Promise<FormSubmissionRecord> {
  const ownerCredits = await getUserCredits(form.user_uuid);
  if (!ownerCredits.is_recharged) {
    const existingSubmissions = await getFormSubmissionsByFormUuid(form.uuid);
    const limit = Number(process.env.DEV_FREE_SUBMISSION_LIMIT) || 50;
    if (existingSubmissions.length >= limit) {
      throw new Error("This form has reached the maximum submission limit (50) for the Free Plan. Please upgrade to Pro to receive more submissions.");
    }
  }

  const normalizedAnswers = validateSubmissionAnswers(form, payload.answers, {
    files: payload.files,
    storage_files: payload.storage_files,
  });
  await chargeFormSubmissionCredits(form);
  const submission: FormSubmissionRecord = {
    uuid: getUniSeq("sub_"),
    form_uuid: form.uuid,
    form_title: form.title,
    form_share_code: form.share_code,
    answers_json: normalizedAnswers,
    files_json: payload.files || [],
    storage_files_json: payload.storage_files || [],
    status: FormSubmissionStatus.Submitted,
    ocr_status: payload.files?.length ? "uploaded" : "not_requested",
    ocr_provider: "",
    ocr_result_json: {},
    ocr_error_message: "",
    created_at: getIsoTimestr(),
  };

  const createdSubmission = await insertFormSubmission(submission);
  const workflowRun = await createWorkflowRunForSubmission(
    form,
    createdSubmission
  );
  const queuedSubmission =
    (await updateFormSubmissionByUuid(createdSubmission.uuid, {
      status: "queued",
      workflow_run_uuid: workflowRun.uuid,
    })) || createdSubmission;
  const completedWorkflowRun = await executeMockWorkflowRun(
    form,
    queuedSubmission,
    workflowRun
  );

  return (
    (await updateFormSubmissionByUuid(createdSubmission.uuid, {
      status:
        completedWorkflowRun.status === "failed" ? "failed" : "completed",
      workflow_run_uuid: completedWorkflowRun.uuid,
    })) || createdSubmission
  );
}

export async function listFormSubmissions(form: FormRecord) {
  return getFormSubmissionsByFormUuid(form.uuid);
}
